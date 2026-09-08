import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function CabecalhoLoja({
    nome,
    quantidadeFavoritos,
    onAtualizar,
    onAbrirFavoritos,
    onCadastrarLivro,
    onAbrirUsuarios,
    onAbrirConta,
}) {
    const { alternarTema, cores, modoEscuro } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    return (
        <View style={styles.container}>
            <View style={styles.topo}>
                <View style={styles.identidade}>
                    <View style={styles.marcaLinha}>
                        <Text style={styles.senai}>SENAI</Text>
                        <Text style={styles.book}>Book</Text>
                    </View>
                    <Text style={styles.saudacao}>Olá, {nome}</Text>
                </View>

                <View style={styles.acoes}>
                    <Pressable
                        accessibilityLabel="Atualizar livros"
                        onPress={onAtualizar}
                        style={({ pressed }) => [
                            styles.acao,
                            pressed && styles.acaoPressionada,
                        ]}
                    >
                        <Text style={styles.iconeAcao}>↻</Text>
                    </Pressable>
                    <Pressable
                        accessibilityLabel={
                            modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"
                        }
                        onPress={alternarTema}
                        style={({ pressed }) => [
                            styles.acao,
                            pressed && styles.acaoPressionada,
                        ]}
                    >
                        <Text style={styles.iconeTema}>{modoEscuro ? "☀" : "☾"}</Text>
                    </Pressable>
                    <Pressable
                        accessibilityLabel="Abrir livros favoritos"
                        onPress={onAbrirFavoritos}
                        style={({ pressed }) => [
                            styles.acao,
                            pressed && styles.acaoPressionada,
                        ]}
                    >
                        <Text style={styles.iconeFavorito}>♥</Text>
                        {quantidadeFavoritos > 0 && (
                            <View style={styles.contador}>
                                <Text style={styles.textoContador}>
                                    {quantidadeFavoritos > 9
                                        ? "9+"
                                        : quantidadeFavoritos}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

            <View style={styles.chamada}>
                <Text style={styles.titulo}>Encontre seu próximo livro</Text>
                <Text style={styles.subtitulo}>
                    Conhecimento que inspira. Histórias que transformam.
                </Text>
            </View>

            <Pressable
                accessibilityLabel="Cadastrar um novo livro"
                onPress={onCadastrarLivro}
                style={({ pressed }) => [
                    styles.botaoCadastro,
                    pressed && styles.acaoPressionada,
                ]}
            >
                <Text style={styles.iconeCadastro}>＋</Text>
                <Text style={styles.textoCadastro}>Cadastrar livro</Text>
            </Pressable>

            <View style={styles.atalhos}>
                <Pressable
                    onPress={onAbrirUsuarios}
                    style={({ pressed }) => [
                        styles.atalho,
                        pressed && styles.acaoPressionada,
                    ]}
                >
                    <Text style={styles.iconeAtalho}>♙</Text>
                    <Text style={styles.textoAtalho}>Usuários</Text>
                </Pressable>
                <Pressable
                    onPress={onAbrirConta}
                    style={({ pressed }) => [
                        styles.atalho,
                        pressed && styles.acaoPressionada,
                    ]}
                >
                    <Text style={styles.iconeAtalho}>◎</Text>
                    <Text style={styles.textoAtalho}>Minha conta</Text>
                </Pressable>
            </View>
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            backgroundColor: cores.superficie,
            borderBottomColor: cores.borda,
            borderBottomWidth: 1,
            marginHorizontal: -20,
            paddingBottom: 23,
            paddingHorizontal: 20,
            paddingTop: 16,
        },
        topo: {
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        identidade: {
            flexShrink: 1,
        },
        marcaLinha: {
            alignItems: "baseline",
            flexDirection: "row",
        },
        senai: {
            color: cores.primaria,
            fontSize: 24,
            fontWeight: "900",
            fontStyle: "italic",
            letterSpacing: -1.1,
        },
        book: {
            color: cores.texto,
            fontSize: 20,
            fontWeight: "500",
            marginLeft: 6,
        },
        saudacao: {
            color: cores.textoSuave,
            fontSize: 10,
            marginTop: 2,
        },
        acoes: {
            flexDirection: "row",
        },
        acao: {
            alignItems: "center",
            backgroundColor: cores.fundo,
            borderColor: cores.borda,
            borderRadius: 19,
            borderWidth: 1,
            height: 38,
            justifyContent: "center",
            marginLeft: 7,
            width: 38,
        },
        acaoPressionada: {
            backgroundColor: cores.superficieSecundaria,
            transform: [{ scale: 0.94 }],
        },
        iconeAcao: {
            color: cores.primaria,
            fontSize: 24,
            lineHeight: 27,
        },
        iconeTema: {
            color: cores.primaria,
            fontSize: 20,
        },
        iconeFavorito: {
            color: cores.primaria,
            fontSize: 19,
        },
        contador: {
            alignItems: "center",
            backgroundColor: cores.destaque,
            borderRadius: 8,
            height: 16,
            justifyContent: "center",
            minWidth: 16,
            paddingHorizontal: 3,
            position: "absolute",
            right: -3,
            top: -4,
        },
        textoContador: {
            color: cores.branco,
            fontSize: 9,
            fontWeight: "900",
        },
        chamada: {
            marginTop: 19,
            maxWidth: 330,
        },
        titulo: {
            color: cores.texto,
            fontSize: 19,
            fontWeight: "900",
            letterSpacing: -0.35,
            lineHeight: 24,
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 10,
            lineHeight: 14,
            marginTop: 3,
        },
        botaoCadastro: {
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: cores.primaria,
            borderRadius: 10,
            flexDirection: "row",
            marginTop: 20,
            paddingHorizontal: 15,
            paddingVertical: 11,
        },
        iconeCadastro: {
            color: cores.branco,
            fontSize: 19,
            fontWeight: "900",
            marginRight: 6,
        },
        textoCadastro: {
            color: cores.branco,
            fontSize: 12,
            fontWeight: "900",
        },
        atalhos: {
            flexDirection: "row",
            marginTop: 10,
        },
        atalho: {
            alignItems: "center",
            backgroundColor: cores.fundo,
            borderColor: cores.borda,
            borderRadius: 10,
            borderWidth: 1,
            flexDirection: "row",
            marginRight: 8,
            paddingHorizontal: 12,
            paddingVertical: 9,
        },
        iconeAtalho: {
            color: cores.primaria,
            fontSize: 15,
            marginRight: 6,
        },
        textoAtalho: {
            color: cores.texto,
            fontSize: 11,
            fontWeight: "800",
        },
    });
