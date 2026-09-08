import AsyncStorage from "@react-native-async-storage/async-storage";

export async function salvarUsuario(id, nome, email) {
    await AsyncStorage.setItem(
        "usuario",
        JSON.stringify({
            id,
            nome,
            email,
        })
    );
}

export async function salvarToken(token) {
    await AsyncStorage.setItem("token", token);
}

export async function getToken() {
    const token = await AsyncStorage.getItem("token");
    return token && token.length ? token : false;
}

export async function getUsuario() {
    const usuario = await AsyncStorage.getItem("usuario");

    if (!usuario || !usuario.length) {
        return false;
    }

    try {
        return JSON.parse(usuario);
    } catch {
        return false;
    }
}

export async function limparDados() {
    await AsyncStorage.multiRemove(["usuario", "token"]);
}
