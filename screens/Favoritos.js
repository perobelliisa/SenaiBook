import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CardLivro from "../components/CardLivro";
import EstadoLista from "../components/EstadoLista";
import { useLivraria } from "../contexts/LivrariaContext";

export default function Favoritos({ navigation }) {
    const { cores, favoritos } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <FlatList
                columnWrapperStyle={favoritos.length ? styles.colunas : undefined}
                contentContainerStyle={[
                    styles.conteudo,
                    favoritos.length === 0 && styles.conteudoVazio,
                ]}
                data={favoritos}
                keyExtractor={(livro) => String(livro.id)}
                ListHeaderComponent={
                    <View style={styles.cabecalho}>
                        <Text style={styles.selo}>SUA ESTANTE</Text>
                        <Text style={styles.titulo}>Livros que você marcou</Text>
                        <Text style={styles.subtitulo}>
                            {favoritos.length === 0
                                ? "Sua coleção está pronta para receber o primeiro livro."
                                : `${favoritos.length} ${
                                      favoritos.length === 1
                                          ? "livro salvo"
                                          : "livros salvos"
                                  } neste aparelho.`}
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <EstadoLista
                        icone="♡"
                        mensagem="Toque no coração de um livro do catálogo para encontrá-lo aqui."
                        titulo="Nenhum favorito ainda"
                    />
                }
                numColumns={2}
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
            padding: 20,
            paddingBottom: 30,
        },
        conteudoVazio: {
            flexGrow: 1,
        },
        colunas: {
            justifyContent: "space-between",
        },
        cabecalho: {
            marginBottom: 24,
        },
        selo: {
            color: cores.primaria,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
        },
        titulo: {
            color: cores.texto,
            fontSize: 26,
            fontWeight: "900",
            letterSpacing: -0.5,
            marginTop: 7,
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 7,
        },
    });
