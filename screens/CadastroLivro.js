import { useEffect, useMemo, useState } from "react";
import {ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable,
    ScrollView, StyleSheet, Text, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CampoFormulario from "../components/CampoFormulario";
import ImagemLivro from "../components/ImagemLivro";
import { useLivraria } from "../contexts/LivrariaContext";
import {
    atualizarLivro,
    cadastrarLivro,
} from "../services/livros/cadastrarLivro";
import { buscarCategorias } from "../services/livros/buscarLivros";

export default function CadastroLivro({ navigation, route }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const livro = route.params?.livro;
    const editando = !!livro;
    const [imagemUrl, setImagemUrl] = useState(livro?.imagem || "");
    const [titulo, setTitulo] = useState(livro?.titulo || "");
    const [categoria, setCategoria] = useState(livro?.categoria || "");
    const [descricao, setDescricao] = useState(livro?.descricao || "");
    const [autor, setAutor] = useState(livro?.autor || "");
    const [faixaEtaria, setFaixaEtaria] = useState(livro?.faixa_etaria || "");
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let componenteAtivo = true;

        buscarCategorias()
            .then((lista) => componenteAtivo && setCategorias(lista))
            .catch((falha) =>
                console.warn("Não foi possível sugerir categorias.", falha)
            );

        return () => {
            componenteAtivo = false;
        };
    }, []);

    async function salvarLivro() {
        const dadosLivro = {
            imagem: imagemUrl.trim(),
            titulo: titulo.trim(),
            categoria: categoria.trim(),
            descricao: descricao.trim(),
            autor: autor.trim(),
            faixa_etaria: faixaEtaria.trim(),
        };

        if (Object.values(dadosLivro).some((valor) => !valor)) {
            setErro("Preencha todos os campos obrigatórios do livro.");
            return;
        }

        setCarregando(true);
        setErro("");

        try {
            const retorno = editando
                ? await atualizarLivro(livro.id, dadosLivro)
                : await cadastrarLivro(dadosLivro);

            Alert.alert(
                editando ? "Livro atualizado" : "Livro cadastrado",
                retorno.mensagem || "Operação realizada com sucesso.",
                [
                    {
                        text: "Ver catálogo",
                        onPress: () =>
                            navigation.popTo("Home", {
                                atualizarCatalogo: Date.now(),
                            }),
                    },
                ],
                { cancelable: false }
            );
        } catch (falha) {
            setErro(falha.message || "Não foi possível salvar o livro.");
        } finally {
            setCarregando(false);
        }
    }

    const imagemPrevia = imagemUrl.trim();

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.conteudo}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.cabecalho}>
                        <Text style={styles.selo}>
                            {editando ? "EDITAR ITEM DO CATÁLOGO" : "NOVO ITEM DO CATÁLOGO"}
                        </Text>
                        <Text style={styles.tituloPagina}>
                            {editando ? "Editar livro" : "Cadastrar livro"}
                        </Text>
                        <Text style={styles.subtitulo}>
                            Todos os campos abaixo são obrigatórios no contrato da API.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <CampoFormulario
                            ajuda="Informe uma URL completa da capa do livro."
                            autoCapitalize="none"
                            keyboardType="url"
                            label="URL da imagem"
                            onChangeText={setImagemUrl}
                            placeholder="https://exemplo.com/capa.jpg"
                            value={imagemUrl}
                        />

                        {!!imagemPrevia && (
                            <View style={styles.previewContainer}>
                                <ImagemLivro uri={imagemPrevia} style={styles.preview} />
                            </View>
                        )}

                        <CampoFormulario
                            label="Título"
                            onChangeText={setTitulo}
                            placeholder="Nome do livro"
                            value={titulo}
                        />
                        <CampoFormulario
                            label="Autor"
                            onChangeText={setAutor}
                            placeholder="Nome do autor"
                            value={autor}
                        />
                        <CampoFormulario
                            label="Categoria"
                            onChangeText={setCategoria}
                            placeholder="Ex.: Fantasia"
                            value={categoria}
                        />

                        {categorias.length > 0 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.sugestoes}
                            >
                                {categorias.map((item) => (
                                    <Pressable
                                        key={item}
                                        onPress={() => setCategoria(item)}
                                        style={[
                                            styles.sugestao,
                                            categoria === item && styles.sugestaoAtiva,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.textoSugestao,
                                                categoria === item &&
                                                    styles.textoSugestaoAtiva,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}

                        <CampoFormulario
                            label="Descrição"
                            multiline
                            onChangeText={setDescricao}
                            placeholder="Descrição do livro"
                            value={descricao}
                        />
                        <CampoFormulario
                            ajuda="Use o texto que deverá aparecer no catálogo, por exemplo 10+ ou Não informada."
                            label="Faixa etária"
                            onChangeText={setFaixaEtaria}
                            placeholder="Ex.: 10+"
                            value={faixaEtaria}
                        />

                        {!!erro && (
                            <View style={styles.avisoErro}>
                                <Text style={styles.textoErro}>{erro}</Text>
                            </View>
                        )}

                        <Pressable
                            disabled={carregando}
                            onPress={salvarLivro}
                            style={({ pressed }) => [
                                styles.botaoSalvar,
                                pressed && styles.botaoPressionado,
                                carregando && styles.botaoDesativado,
                            ]}
                        >
                            {carregando ? (
                                <ActivityIndicator color={cores.branco} />
                            ) : (
                                <Text style={styles.textoBotaoSalvar}>
                                    {editando ? "Salvar alterações" : "Cadastrar livro"}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            backgroundColor: cores.fundo,
            flex: 1,
        },
        conteudo: {
            padding: 20,
            paddingBottom: 40,
        },
        cabecalho: {
            marginBottom: 20,
        },
        selo: {
            color: cores.primaria,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
        },
        tituloPagina: {
            color: cores.texto,
            fontSize: 28,
            fontWeight: "900",
            letterSpacing: -0.6,
            marginTop: 6,
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 7,
        },
        card: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 22,
            borderWidth: 1,
            padding: 18,
        },
        previewContainer: {
            alignItems: "center",
            backgroundColor: cores.fundo,
            borderRadius: 16,
            marginBottom: 19,
            padding: 13,
        },
        preview: {
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 9,
            height: 210,
            width: 140,
        },
        sugestoes: {
            marginBottom: 17,
            marginTop: -8,
        },
        sugestao: {
            borderColor: cores.borda,
            borderRadius: 999,
            borderWidth: 1,
            marginRight: 7,
            paddingHorizontal: 11,
            paddingVertical: 7,
        },
        sugestaoAtiva: {
            backgroundColor: cores.superficieSecundaria,
            borderColor: cores.primaria,
        },
        textoSugestao: {
            color: cores.textoSuave,
            fontSize: 10,
            fontWeight: "700",
        },
        textoSugestaoAtiva: {
            color: cores.primaria,
        },
        avisoErro: {
            backgroundColor: cores.erroFundo,
            borderRadius: 11,
            marginBottom: 15,
            padding: 12,
        },
        textoErro: {
            color: cores.erro,
            fontSize: 12,
            lineHeight: 17,
        },
        botaoSalvar: {
            alignItems: "center",
            backgroundColor: cores.primaria,
            borderRadius: 13,
            justifyContent: "center",
            minHeight: 53,
            paddingHorizontal: 16,
        },
        textoBotaoSalvar: {
            color: cores.branco,
            fontSize: 14,
            fontWeight: "900",
        },
        botaoPressionado: {
            opacity: 0.76,
        },
        botaoDesativado: {
            opacity: 0.64,
        },
    });
