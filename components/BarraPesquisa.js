import { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function BarraPesquisa({ valor, onChangeText }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    return (
        <View style={styles.container}>
            <Text style={styles.icone}>⌕</Text>
            <TextInput
                accessibilityLabel="Pesquisar livros"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={onChangeText}
                placeholder="Pesquise por título ou autor"
                placeholderTextColor={cores.textoSuave}
                returnKeyType="search"
                style={styles.input}
                value={valor}
            />

            {valor.length > 0 && (
                <Pressable
                    accessibilityLabel="Limpar pesquisa"
                    hitSlop={10}
                    onPress={() => onChangeText("")}
                    style={styles.limpar}
                >
                    <Text style={styles.textoLimpar}>×</Text>
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
            borderRadius: 3,
            borderWidth: 2,
            flexDirection: "row",
            marginTop: 18,
            minHeight: 58,
            paddingHorizontal: 15,
        },
        icone: {
            color: cores.primaria,
            fontSize: 27,
            marginRight: 9,
            marginTop: -4,
        },
        input: {
            color: cores.texto,
            flex: 1,
            fontSize: 15,
            paddingVertical: 12,
        },
        limpar: {
            alignItems: "center",
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 12,
            height: 24,
            justifyContent: "center",
            width: 24,
        },
        textoLimpar: {
            color: cores.textoSuave,
            fontSize: 20,
            lineHeight: 21,
        },
    });
