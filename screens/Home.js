import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BarraPesquisa from "../components/BarraPesquisa";
import CabecalhoLoja from "../components/CabecalhoLoja";
import CardLivro from "../components/CardLivro";
import ControleOrdenacao from "../components/ControleOrdenacao";
import EstadoLista from "../components/EstadoLista";
import FiltroCategorias from "../components/FiltroCategorias";
import { useLivraria } from "../contexts/LivrariaContext";
import { useSessao } from "../contexts/SessaoContext";
import {
    buscarCategorias,
    buscarLivros,
    obterPrecoNumerico,
} from "../services/livros/buscarLivros";

export default function Home({ navigation, route }) {
    const { cores, favoritos } = useLivraria();
    const { usuario } = useSessao();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const [livros, setLivros] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("Todos");
    const [ordenacao, setOrdenacao] = useState("titulo-asc");
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState("");
    const [versaoBusca, setVersaoBusca] = useState(0);

    useEffect(() => {
        let componenteAtivo = true;

        buscarCategorias()
            .then((lista) => {
                if (componenteAtivo) {
                    setCategorias(lista);
                }
            })
            .catch((falha) =>
                console.warn("Não foi possível carregar as categorias.", falha)
            );

        return () => {
            componenteAtivo = false;
        };
    }, []);

    useEffect(() => {
        let componenteAtivo = true;

        const temporizador = setTimeout(
            async () => {
                setCarregando(true);
                setErro("");

                try {
                    const lista = await buscarLivros({
                        termo: busca,
                        categoria,
                    });

                    if (componenteAtivo) {
                        setLivros(lista);
                    }
                } catch (falha) {
                    console.warn("Erro ao buscar livros.", falha);

                    if (componenteAtivo) {
                        setErro(
                            "Não foi possível carregar os livros. Tente novamente."
                        );
                    }
                } finally {
                    if (componenteAtivo) {
                        setCarregando(false);
                        setAtualizando(false);
                    }
                }
            },
            busca.trim() ? 400 : 0
        );

        return () => {
            componenteAtivo = false;
            clearTimeout(temporizador);
        };
    }, [busca, categoria, versaoBusca, route.params?.atualizarCatalogo]);

    function atualizarLivros() {
        setAtualizando(true);
        setVersaoBusca((versaoAtual) => versaoAtual + 1);
    }

    const temPreco = livros.some(
        (livro) => obterPrecoNumerico(livro.preco) !== null
    );

    const livrosOrdenados = useMemo(() => {
        const listaOrdenada = [...livros];

        if (ordenacao === "titulo-desc") {
            return listaOrdenada.sort((livroA, livroB) =>
                (livroB.titulo || "").localeCompare(livroA.titulo || "", "pt-BR", {
                    sensitivity: "base",
                })
            );
        }

        if (ordenacao === "preco-asc") {
            return listaOrdenada.sort((livroA, livroB) => {
                const precoA = obterPrecoNumerico(livroA.preco);
                const precoB = obterPrecoNumerico(livroB.preco);
                return (precoA ?? Infinity) - (precoB ?? Infinity);
            });
        }

        if (ordenacao === "preco-desc") {
            return listaOrdenada.sort((livroA, livroB) => {
                const precoA = obterPrecoNumerico(livroA.preco);
                const precoB = obterPrecoNumerico(livroB.preco);
                return (precoB ?? -Infinity) - (precoA ?? -Infinity);
            });
        }

        return listaOrdenada.sort((livroA, livroB) =>
            (livroA.titulo || "").localeCompare(livroB.titulo || "", "pt-BR", {
                sensitivity: "base",
            })
        );
    }, [livros, ordenacao]);

    const carregamentoInicial = carregando && livros.length === 0 && !erro;

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            <FlatList
                columnWrapperStyle={
                    livrosOrdenados.length ? styles.colunas : undefined
                }
                contentContainerStyle={styles.conteudo}
                data={livrosOrdenados}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                keyExtractor={(livro) => String(livro.id)}
                ListHeaderComponent={
                    <View>
                        <CabecalhoLoja
                            nome={usuario?.nome?.split(" ")[0] || "Leitor"}
                            onAbrirFavoritos={() => navigation.navigate("Favoritos")}
                            onAtualizar={atualizarLivros}
                            onCadastrarLivro={() =>
                                navigation.navigate("CadastroLivro")
                            }
                            onAbrirUsuarios={() => navigation.navigate("Usuarios")}
                            onAbrirConta={() => navigation.navigate("MinhaConta")}
                            quantidadeFavoritos={favoritos.length}
                        />

                        <BarraPesquisa valor={busca} onChangeText={setBusca} />
                        <FiltroCategorias
                            categorias={categorias}
                            onSelect={setCategoria}
                            selecionada={categoria}
                        />
                        <ControleOrdenacao
                            onChange={setOrdenacao}
                            temPreco={temPreco}
                            valor={ordenacao}
                        />

                        <View style={styles.cabecalhoLista}>
                            <View>
                                <Text style={styles.tituloLista}>Catálogo de livros</Text>
                                <Text style={styles.quantidade}>
                                    {livrosOrdenados.length}{" "}
                                    {livrosOrdenados.length === 1
                                        ? "resultado"
                                        : "resultados"}
                                </Text>
                            </View>

                            {carregando && !carregamentoInicial && (
                                <View style={styles.pesquisando}>
                                    <ActivityIndicator
                                        color={cores.primaria}
                                        size="small"
                                    />
                                    <Text style={styles.textoPesquisando}>Buscando...</Text>
                                </View>
                            )}
                        </View>

                        {erro && livros.length > 0 && (
                            <View style={styles.avisoErro}>
                                <Text style={styles.textoErro}>{erro}</Text>
                            </View>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    carregamentoInicial ? (
                        <View style={styles.carregamento}>
                            <ActivityIndicator color={cores.primaria} size="large" />
                            <Text style={styles.textoCarregamento}>
                                Carregando livros...
                            </Text>
                        </View>
                    ) : erro ? (
                        <EstadoLista
                            icone="⚠"
                            mensagem={erro}
                            onRetry={atualizarLivros}
                            titulo="Algo deu errado"
                        />
                    ) : (
                        <EstadoLista
                            icone="⌕"
                            mensagem="Tente outro título, autor ou selecione uma categoria diferente."
                            titulo="Nenhum livro encontrado"
                        />
                    )
                }
                numColumns={2}
                onRefresh={atualizarLivros}
                refreshing={atualizando}
                renderItem={({ item }) => (
                    <CardLivro
                        livro={item}
                        onPress={() =>
                            navigation.navigate("Detalhes", { livro: item })
                        }
                    />
                )}
                showsVerticalScrollIndicator={false}
            />
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
            paddingBottom: 30,
            paddingHorizontal: 20,
        },
        colunas: {
            justifyContent: "space-between",
        },
        cabecalhoLista: {
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 14,
            marginTop: 28,
        },
        tituloLista: {
            color: cores.texto,
            fontSize: 20,
            fontWeight: "900",
            letterSpacing: -0.3,
        },
        quantidade: {
            color: cores.textoSuave,
            fontSize: 11,
            marginTop: 3,
        },
        pesquisando: {
            alignItems: "center",
            flexDirection: "row",
        },
        textoPesquisando: {
            color: cores.textoSuave,
            fontSize: 11,
            marginLeft: 6,
        },
        carregamento: {
            alignItems: "center",
            paddingVertical: 46,
            width: "100%",
        },
        textoCarregamento: {
            color: cores.textoSuave,
            fontSize: 14,
            marginTop: 13,
        },
        avisoErro: {
            backgroundColor: cores.erroFundo,
            borderRadius: 12,
            marginBottom: 14,
            marginTop: -2,
            padding: 12,
        },
        textoErro: {
            color: cores.erro,
            fontSize: 12,
            lineHeight: 17,
        },
    });
