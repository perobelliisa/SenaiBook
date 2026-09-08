import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function EstadoLista({ icone = "📚", titulo, mensagem, onRetry }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    return (
        <View style={styles.container}>
            <Text style={styles.icone}>{icone}</Text>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.mensagem}>{mensagem}</Text>

            {onRetry && (
                <Pressable
                    onPress={onRetry}
                    style={({ pressed }) => [
                        styles.botao,
                        pressed && styles.botaoPressionado,
                    ]}
                >
                    <Text style={styles.textoBotao}>Tentar novamente</Text>
                </Pressable>
            )}
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            alignItems: "center",
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 18,
            borderWidth: 1,
            marginBottom: 24,
            paddingHorizontal: 24,
            paddingVertical: 34,
            width: "100%",
        },
        icone: {
            fontSize: 38,
            marginBottom: 12,
        },
        titulo: {
            color: cores.texto,
            fontSize: 17,
            fontWeight: "800",
            textAlign: "center",
        },
        mensagem: {
            color: cores.textoSuave,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 7,
            textAlign: "center",
        },
        botao: {
            backgroundColor: cores.primaria,
            borderRadius: 12,
            marginTop: 18,
            paddingHorizontal: 18,
            paddingVertical: 11,
        },
        botaoPressionado: {
            opacity: 0.76,
        },
        textoBotao: {
            color: cores.branco,
            fontSize: 12,
            fontWeight: "800",
        },
    });
