import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";
import { formatarPreco } from "../services/livros/buscarLivros";
import ImagemLivro from "./ImagemLivro";

export default function CardLivro({ livro, onPress }) {
    const { alternarFavorito, cores, ehFavorito } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const favorito = ehFavorito(livro.id);
    const preco = formatarPreco(livro.preco);

    return (
        <View style={styles.card}>
            <Pressable
                accessibilityHint="Abre a tela com informações completas"
                accessibilityLabel={`Ver detalhes de ${livro.titulo}`}
                onPress={onPress}
                style={({ pressed }) => [
                    styles.conteudo,
                    pressed && styles.pressionado,
                ]}
            >
                <ImagemLivro uri={livro.imagem} style={styles.capa} />

                <View style={styles.informacoes}>
                    <Text numberOfLines={1} style={styles.categoria}>
                        {livro.categoria || "Sem categoria"}
                    </Text>
                    <Text numberOfLines={2} style={styles.titulo}>
                        {livro.titulo || "Título não informado"}
                    </Text>
                    <Text numberOfLines={1} style={styles.autor}>
                        {livro.autor || "Autor não informado"}
                    </Text>

                    <View style={styles.rodape}>
                        <Text style={styles.dadoExtra}>
                            {preco || livro.faixa_etaria || "Saiba mais"}
                        </Text>
                        <Text style={styles.detalhes}>Detalhes ›</Text>
                    </View>
                </View>
            </Pressable>

            <Pressable
                accessibilityLabel={
                    favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
                }
                hitSlop={8}
                onPress={() => alternarFavorito(livro)}
                style={({ pressed }) => [
                    styles.botaoFavorito,
                    pressed && styles.botaoPressionado,
                ]}
            >
                <Text style={[styles.coracao, favorito && styles.coracaoAtivo]}>
                    {favorito ? "♥" : "♡"}
                </Text>
            </Pressable>
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        card: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 6,
            borderWidth: 2,
            elevation: 1,
            marginBottom: 20,
            maxWidth: "48.2%",
            overflow: "hidden",
            shadowColor: cores.sombra,
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.14,
            shadowRadius: 0,
            width: "48.2%",
        },
        conteudo: {
            flex: 1,
        },
        pressionado: {
            opacity: 0.78,
        },
        capa: {
            backgroundColor: cores.superficieSecundaria,
            height: 225,
            width: "100%",
        },
        informacoes: {
            flex: 1,
            minHeight: 168,
            padding: 14,
        },
        categoria: {
            color: cores.primaria,
            fontSize: 10,
            fontWeight: "800",
            letterSpacing: 0.7,
            marginBottom: 7,
            textTransform: "uppercase",
        },
        titulo: {
            color: cores.texto,
            fontSize: 16,
            fontWeight: "800",
            lineHeight: 21,
            marginBottom: 5,
        },
        autor: {
            color: cores.textoSuave,
            fontSize: 12,
            lineHeight: 17,
        },
        rodape: {
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
        },
        dadoExtra: {
            color: cores.textoSuave,
            flex: 1,
            fontSize: 10,
        },
        detalhes: {
            color: cores.primaria,
            fontSize: 11,
            fontWeight: "800",
        },
        botaoFavorito: {
            alignItems: "center",
            backgroundColor: cores.superficie,
            borderRadius: 4,
            height: 36,
            justifyContent: "center",
            position: "absolute",
            right: 9,
            top: 9,
            width: 36,
        },
        botaoPressionado: {
            transform: [{ scale: 0.92 }],
        },
        coracao: {
            color: cores.texto,
            fontSize: 23,
            lineHeight: 27,
        },
        coracaoAtivo: {
            color: "#D74747",
        },
    });
