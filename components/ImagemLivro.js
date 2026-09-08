import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { useLivraria } from "../contexts/LivrariaContext";

export default function ImagemLivro({ uri, style }) {
    const { cores } = useLivraria();
    const [imagemComErro, setImagemComErro] = useState(false);
    const styles = useMemo(() => criarEstilos(cores), [cores]);

    useEffect(() => {
        setImagemComErro(false);
    }, [uri]);

    if (!uri || imagemComErro) {
        return (
            <View style={[styles.placeholder, style]}>
                <Text style={styles.icone}>📖</Text>
                <Text style={styles.texto}>Capa indisponível</Text>
            </View>
        );
    }

    return (
        <Image
            accessibilityLabel="Capa do livro"
            onError={() => setImagemComErro(true)}
            resizeMode="cover"
            source={{ uri }}
            style={style}
        />
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        placeholder: {
            alignItems: "center",
            backgroundColor: cores.superficieSecundaria,
            justifyContent: "center",
            padding: 12,
        },
        icone: {
            fontSize: 34,
            marginBottom: 6,
        },
        texto: {
            color: cores.textoSuave,
            fontSize: 11,
            textAlign: "center",
        },
    });
