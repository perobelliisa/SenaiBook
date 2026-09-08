import { Button, StyleSheet, View } from "react-native";

import { getBiometria } from "../services/usuario/biometria";

export default function Abrir() {
    async function testarBiometria() {
        await getBiometria();
    }

    return (
        <View style={styles.container}>
            <Button onPress={testarBiometria} title="Testar biometria" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        flex: 1,
        justifyContent: "center",
    },
});
