import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function CampoFormulario({
    ajuda,
    label,
    multiline = false,
    obrigatorio = true,
    ...inputProps
}) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
            </Text>
            <TextInput
                multiline={multiline}
                placeholderTextColor={cores.textoSuave}
                style={[styles.input, multiline && styles.inputMultiline]}
                textAlignVertical={multiline ? "top" : "center"}
                {...inputProps}
            />
            {!!ajuda && <Text style={styles.ajuda}>{ajuda}</Text>}
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            marginBottom: 17,
        },
        label: {
            color: cores.texto,
            fontSize: 12,
            fontWeight: "800",
            marginBottom: 7,
        },
        obrigatorio: {
            color: cores.erro,
        },
        input: {
            backgroundColor: cores.fundo,
            borderColor: cores.borda,
            borderRadius: 13,
            borderWidth: 1,
            color: cores.texto,
            fontSize: 14,
            minHeight: 50,
            paddingHorizontal: 14,
            paddingVertical: 12,
        },
        inputMultiline: {
            minHeight: 112,
        },
        ajuda: {
            color: cores.textoSuave,
            fontSize: 10,
            lineHeight: 15,
            marginTop: 6,
        },
    });
