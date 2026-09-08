import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export async function getBiometria() {
    if (Platform.OS === "web") return false;
    const possuiBiometria = await LocalAuthentication.hasHardwareAsync();

    if (!possuiBiometria) {
        console.log("O aparelho não possui leitor biométrico.");
        return false;
    }

    const biometriaCadastrada = await LocalAuthentication.isEnrolledAsync();

    if (!biometriaCadastrada) {
        console.log("Não há biometria cadastrada no aparelho.");
        return false;
    }

    const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirme sua identidade",
        cancelLabel: "Cancelar",
    });

    return resultado.success;
}
