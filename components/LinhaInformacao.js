import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function LinhaInformacao({ icone, rotulo, valor }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    if (valor === undefined || valor === null || valor === "") {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconeContainer}>
                <Text style={styles.icone}>{icone}</Text>
            </View>
            <View style={styles.textos}>
                <Text style={styles.rotulo}>{rotulo}</Text>
                <Text style={styles.valor}>{valor}</Text>
            </View>
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            alignItems: "center",
            borderBottomColor: cores.borda,
            borderBottomWidth: 1,
            flexDirection: "row",
            paddingVertical: 14,
        },
        iconeContainer: {
            alignItems: "center",
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 12,
            height: 40,
            justifyContent: "center",
            marginRight: 13,
            width: 40,
        },
        icone: {
            fontSize: 18,
        },
        textos: {
            flex: 1,
        },
        rotulo: {
            color: cores.textoSuave,
            fontSize: 10,
            fontWeight: "700",
            marginBottom: 3,
            textTransform: "uppercase",
        },
        valor: {
            color: cores.texto,
            fontSize: 14,
            fontWeight: "700",
            lineHeight: 19,
        },
    });
