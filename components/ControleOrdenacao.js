import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

const OPCOES = [
    { id: "titulo-asc", nome: "A → Z" },
    { id: "titulo-desc", nome: "Z → A" },
    { id: "preco-asc", nome: "Menor preço", precisaDePreco: true },
    { id: "preco-desc", nome: "Maior preço", precisaDePreco: true },
];

export default function ControleOrdenacao({ valor, onChange, temPreco }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    return (
        <View style={styles.container}>
            <Text style={styles.rotulo}>Ordenar por</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.lista}
            >
                {OPCOES.map((opcao) => {
                    const ativa = valor === opcao.id;
                    const desativada = opcao.precisaDePreco && !temPreco;

                    return (
                        <Pressable
                            accessibilityState={{ disabled: desativada, selected: ativa }}
                            disabled={desativada}
                            key={opcao.id}
                            onPress={() => onChange(opcao.id)}
                            style={[
                                styles.opcao,
                                ativa && styles.opcaoAtiva,
                                desativada && styles.opcaoDesativada,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.texto,
                                    ativa && styles.textoAtivo,
                                    desativada && styles.textoDesativado,
                                ]}
                            >
                                {opcao.nome}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {!temPreco && (
                <Text style={styles.aviso}>
                    A API não fornece preços no momento.
                </Text>
            )}
        </View>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
        },
        rotulo: {
            color: cores.texto,
            fontSize: 13,
            fontWeight: "800",
            marginBottom: 9,
        },
        lista: {
            marginRight: -20,
        },
        opcao: {
            borderColor: cores.borda,
            borderRadius: 10,
            borderWidth: 1,
            marginRight: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        opcaoAtiva: {
            backgroundColor: cores.superficieSecundaria,
            borderColor: cores.primaria,
        },
        opcaoDesativada: {
            opacity: 0.42,
        },
        texto: {
            color: cores.textoSuave,
            fontSize: 11,
            fontWeight: "700",
        },
        textoAtivo: {
            color: cores.primaria,
        },
        textoDesativado: {
            color: cores.textoSuave,
        },
        aviso: {
            color: cores.textoSuave,
            fontSize: 10,
            marginTop: 7,
        },
    });
