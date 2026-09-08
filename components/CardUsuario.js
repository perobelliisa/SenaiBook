import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function CardUsuario({ usuario, usuarioAtual }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const nome = usuario.nome || "Usuário sem nome";
    const inicial = nome.trim().charAt(0).toUpperCase() || "U";

    return (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.inicial}>{inicial}</Text>
            </View>
            <View style={styles.informacoes}>
                <View style={styles.linhaNome}>
                    <Text numberOfLines={1} style={styles.nome}>
                        {nome}
                    </Text>
                    {usuarioAtual && <Text style={styles.voce}>Você</Text>}
                </View>
                <Text numberOfLines={1} style={styles.email}>
                    {usuario.email}
                </Text>
                <Text style={styles.codigo}>Usuário #{usuario.id}</Text>
            </View>
            <Text style={styles.somenteLeitura}>◉</Text>
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        card: {
            alignItems: "center",
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 17,
            borderWidth: 1,
            flexDirection: "row",
            marginBottom: 11,
            padding: 14,
        },
        avatar: {
            alignItems: "center",
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 23,
            height: 46,
            justifyContent: "center",
            marginRight: 13,
            width: 46,
        },
        inicial: {
            color: cores.primaria,
            fontSize: 18,
            fontWeight: "900",
        },
        informacoes: {
            flex: 1,
        },
        linhaNome: {
            alignItems: "center",
            flexDirection: "row",
        },
        nome: {
            color: cores.texto,
            flexShrink: 1,
            fontSize: 15,
            fontWeight: "800",
        },
        voce: {
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 999,
            color: cores.primaria,
            fontSize: 9,
            fontWeight: "900",
            marginLeft: 7,
            paddingHorizontal: 7,
            paddingVertical: 3,
        },
        email: {
            color: cores.textoSuave,
            fontSize: 12,
            marginTop: 3,
        },
        codigo: {
            color: cores.textoSuave,
            fontSize: 9,
            marginTop: 5,
        },
        somenteLeitura: {
            color: cores.borda,
            fontSize: 14,
            marginLeft: 8,
        },
    });
