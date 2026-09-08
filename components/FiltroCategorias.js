import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function FiltroCategorias({ categorias, selecionada, onSelect }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const opcoes = ["Todos", ...categorias.filter((item) => item !== "Todos")];

    return (
        <ScrollView
            contentContainerStyle={styles.conteudo}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.lista}
        >
            {opcoes.map((categoria) => {
                const ativa = categoria === selecionada;

                return (
                    <Pressable
                        accessibilityRole="button"
                        key={categoria}
                        onPress={() => onSelect(categoria)}
                        style={({ pressed }) => [
                            styles.opcao,
                            ativa && styles.opcaoAtiva,
                            pressed && styles.opcaoPressionada,
                        ]}
                    >
                        <Text style={[styles.texto, ativa && styles.textoAtivo]}>
                            {categoria}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        lista: {
            marginHorizontal: -20,
            marginTop: 12,
        },
        conteudo: {
            paddingHorizontal: 20,
        },
        opcao: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 999,
            borderWidth: 1,
            marginRight: 9,
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        opcaoAtiva: {
            backgroundColor: cores.primaria,
            borderColor: cores.primaria,
        },
        opcaoPressionada: {
            opacity: 0.72,
        },
        texto: {
            color: cores.textoSuave,
            fontSize: 12,
            fontWeight: "700",
        },
        textoAtivo: {
            color: cores.branco,
        },
    });
