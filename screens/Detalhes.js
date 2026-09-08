import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import ImagemLivro from "../components/ImagemLivro";
import LinhaInformacao from "../components/LinhaInformacao";
import { useLivraria } from "../contexts/LivrariaContext";
import { excluirLivro } from "../services/livros/cadastrarLivro";
import { formatarPreco } from "../services/livros/buscarLivros";

export default function Detalhes({ navigation, route }) {
    const { livro } = route.params;
    const { alternarFavorito, cores, ehFavorito } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const favorito = ehFavorito(livro.id);
    const preco = formatarPreco(livro.preco);
    const ano = livro.ano || livro.ano_publicacao;
    const [excluindo, setExcluindo] = useState(false);

    async function removerLivro() {
        setExcluindo(true);

        try {
            await excluirLivro(livro.id);

            if (favorito) {
                alternarFavorito(livro);
            }

            navigation.popTo("Home", {
                atualizarCatalogo: Date.now(),
            });
        } catch (falha) {
            Alert.alert(
                "Não foi possível excluir",
                falha.message || "Tente novamente."
            );
        } finally {
            setExcluindo(false);
        }
    }

    function confirmarExclusao() {
        Alert.alert(
            "Excluir livro?",
            `“${livro.titulo}” será removido do catálogo para todos os usuários.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: removerLivro,
                },
            ]
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            <View style={styles.apresentacao}>
                <View style={styles.fundoCapa}>
                    <ImagemLivro uri={livro.imagem} style={styles.capa} />
                </View>

                <Text style={styles.categoria}>
                    {livro.categoria || "Sem categoria"}
                </Text>
                <Text style={styles.titulo}>{livro.titulo}</Text>
                <Text style={styles.autor}>por {livro.autor}</Text>

                <Pressable
                    accessibilityLabel={
                        favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
                    }
                    onPress={() => alternarFavorito(livro)}
                    style={({ pressed }) => [
                        styles.botaoFavorito,
                        favorito && styles.botaoFavoritoAtivo,
                        pressed && styles.botaoPressionado,
                    ]}
                >
                    <Text
                        style={[
                            styles.iconeFavorito,
                            favorito && styles.iconeFavoritoAtivo,
                        ]}
                    >
                        {favorito ? "♥" : "♡"}
                    </Text>
                    <Text
                        style={[
                            styles.textoBotao,
                            favorito && styles.textoBotaoAtivo,
                        ]}
                    >
                        {favorito ? "Salvo nos favoritos" : "Adicionar aos favoritos"}
                    </Text>
                </Pressable>

                <View style={styles.acoesCrud}>
                    <Pressable
                        onPress={() =>
                            navigation.navigate("CadastroLivro", { livro })
                        }
                        style={({ pressed }) => [
                            styles.botaoEditar,
                            pressed && styles.botaoPressionado,
                        ]}
                    >
                        <Text style={styles.textoEditar}>✎ Editar livro</Text>
                    </Pressable>
                    <Pressable
                        disabled={excluindo}
                        onPress={confirmarExclusao}
                        style={({ pressed }) => [
                            styles.botaoExcluir,
                            pressed && styles.botaoPressionado,
                        ]}
                    >
                        {excluindo ? (
                            <ActivityIndicator color={cores.erro} size="small" />
                        ) : (
                            <Text style={styles.textoExcluir}>⌫ Excluir</Text>
                        )}
                    </Pressable>
                </View>
            </View>

            <View style={styles.cardInformacoes}>
                <Text style={styles.tituloSecao}>Informações</Text>
                <LinhaInformacao icone="✍" rotulo="Autor" valor={livro.autor} />
                <LinhaInformacao
                    icone="🏷"
                    rotulo="Categoria"
                    valor={livro.categoria}
                />
                <LinhaInformacao
                    icone="◎"
                    rotulo="Faixa etária"
                    valor={livro.faixa_etaria}
                />
                <LinhaInformacao icone="R$" rotulo="Preço" valor={preco} />
                <LinhaInformacao icone="▣" rotulo="Ano" valor={ano} />
                <LinhaInformacao
                    icone="#"
                    rotulo="Código no catálogo"
                    valor={String(livro.id)}
                />
            </View>

            <View style={styles.cardDescricao}>
                <Text style={styles.tituloSecao}>Sobre o livro</Text>
                <Text style={styles.descricao}>
                    {livro.descricao || "Descrição não informada pela API."}
                </Text>
            </View>
        </ScrollView>
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
        apresentacao: {
            alignItems: "center",
        },
        fundoCapa: {
            alignItems: "center",
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 28,
            justifyContent: "center",
            marginBottom: 22,
            padding: 22,
            width: "100%",
        },
        capa: {
            backgroundColor: cores.superficie,
            borderRadius: 13,
            elevation: 8,
            height: 310,
            shadowColor: cores.sombra,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 14,
            width: 205,
        },
        categoria: {
            color: cores.primaria,
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.2,
            textAlign: "center",
            textTransform: "uppercase",
        },
        titulo: {
            color: cores.texto,
            fontSize: 27,
            fontWeight: "900",
            letterSpacing: -0.5,
            lineHeight: 33,
            marginTop: 8,
            textAlign: "center",
        },
        autor: {
            color: cores.textoSuave,
            fontSize: 14,
            marginTop: 7,
            textAlign: "center",
        },
        botaoFavorito: {
            alignItems: "center",
            backgroundColor: cores.primaria,
            borderColor: cores.primaria,
            borderRadius: 14,
            borderWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 13,
            width: "100%",
        },
        botaoFavoritoAtivo: {
            backgroundColor: cores.superficie,
        },
        botaoPressionado: {
            opacity: 0.76,
        },
        iconeFavorito: {
            color: cores.branco,
            fontSize: 22,
            marginRight: 9,
        },
        iconeFavoritoAtivo: {
            color: "#D74747",
        },
        textoBotao: {
            color: cores.branco,
            fontSize: 13,
            fontWeight: "800",
        },
        textoBotaoAtivo: {
            color: cores.primaria,
        },
        acoesCrud: {
            flexDirection: "row",
            marginTop: 11,
            width: "100%",
        },
        botaoEditar: {
            alignItems: "center",
            borderColor: cores.primaria,
            borderRadius: 13,
            borderWidth: 1,
            flex: 1,
            justifyContent: "center",
            marginRight: 8,
            minHeight: 46,
            paddingHorizontal: 12,
        },
        botaoExcluir: {
            alignItems: "center",
            backgroundColor: cores.erroFundo,
            borderColor: cores.erro,
            borderRadius: 13,
            borderWidth: 1,
            justifyContent: "center",
            minHeight: 46,
            paddingHorizontal: 15,
        },
        textoEditar: {
            color: cores.primaria,
            fontSize: 12,
            fontWeight: "800",
        },
        textoExcluir: {
            color: cores.erro,
            fontSize: 12,
            fontWeight: "800",
        },
        cardInformacoes: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 20,
            borderWidth: 1,
            marginTop: 28,
            paddingHorizontal: 17,
            paddingTop: 18,
        },
        cardDescricao: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 20,
            borderWidth: 1,
            marginTop: 16,
            padding: 18,
        },
        tituloSecao: {
            color: cores.texto,
            fontSize: 18,
            fontWeight: "900",
            marginBottom: 5,
        },
        descricao: {
            color: cores.textoSuave,
            fontSize: 15,
            lineHeight: 24,
            marginTop: 8,
        },
    });
