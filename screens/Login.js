import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLivraria } from "../contexts/LivrariaContext";
import { useSessao } from "../contexts/SessaoContext";
import { getBiometria } from "../services/usuario/biometria";
import { realizarLogin } from "../services/usuario/realizarLogin";
import { getToken, getUsuario } from "../services/usuario/usuarioStorage";
import { buscarUsuario } from "../services/usuario/usuarios";

export default function Login({ navigation, route }) {
    const { cores } = useLivraria();
    const { iniciarSessao } = useSessao();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const removerEvento = navigation.addListener("focus", async () => {
            const token = await getToken();
            const usuarioSalvo = await getUsuario();

            if (token && usuarioSalvo && (await getBiometria())) {
                try {
                    const usuarioAtual = await buscarUsuario(usuarioSalvo.id);
                    iniciarSessao({ token, usuario: usuarioAtual });
                } catch (falha) {
                    setErro(falha.message || "Faça login novamente.");
                }
            }
        });

        return removerEvento;
    }, [iniciarSessao, navigation]);

    useEffect(() => {
        if (route.params?.emailCadastrado) {
            setEmail(route.params.emailCadastrado);
        }
    }, [route.params?.emailCadastrado]);

    async function entrar() {
        if (!email.trim() || !senha) {
            setErro("Informe o e-mail e a senha.");
            return;
        }

        setCarregando(true);
        setErro("");

        try {
            const sessao = await realizarLogin(email.trim(), senha);
            iniciarSessao(sessao);
        } catch (falha) {
            setErro(falha.message || "Não foi possível realizar o login.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.marca}>Livraria</Text>
                <Text style={styles.titulo}>Boas-vindas</Text>
                <Text style={styles.subtitulo}>Entre para continuar sua leitura.</Text>

                <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="E-mail"
                    placeholderTextColor={cores.textoSuave}
                    style={styles.input}
                    value={email}
                />
                <TextInput
                    onChangeText={setSenha}
                    placeholder="Senha"
                    placeholderTextColor={cores.textoSuave}
                    secureTextEntry
                    style={styles.input}
                    value={senha}
                />

                {!!erro && <Text style={styles.erro}>{erro}</Text>}

                <Pressable
                    disabled={carregando}
                    onPress={entrar}
                    style={({ pressed }) => [
                        styles.botao,
                        pressed && styles.botaoPressionado,
                    ]}
                >
                    {carregando ? (
                        <ActivityIndicator color={cores.branco} />
                    ) : (
                        <Text style={styles.textoBotao}>Entrar</Text>
                    )}
                </Pressable>

                <View style={styles.divisor}>
                    <View style={styles.linha} />
                    <Text style={styles.textoDivisor}>ou</Text>
                    <View style={styles.linha} />
                </View>

                <Pressable
                    onPress={() => navigation.navigate("CadastroUsuario")}
                    style={({ pressed }) => [
                        styles.botaoSecundario,
                        pressed && styles.botaoPressionado,
                    ]}
                >
                    <Text style={styles.textoBotaoSecundario}>Criar novo usuário</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            alignItems: "center",
            backgroundColor: cores.fundo,
            flex: 1,
            justifyContent: "center",
            padding: 20,
        },
        card: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 24,
            borderWidth: 1,
            padding: 24,
            width: "100%",
        },
        marca: {
            color: cores.primaria,
            fontSize: 14,
            fontWeight: "900",
            letterSpacing: 1.3,
            textTransform: "uppercase",
        },
        titulo: {
            color: cores.texto,
            fontSize: 28,
            fontWeight: "900",
            marginTop: 18,
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 14,
            marginBottom: 22,
            marginTop: 5,
        },
        input: {
            backgroundColor: cores.fundo,
            borderColor: cores.borda,
            borderRadius: 13,
            borderWidth: 1,
            color: cores.texto,
            marginBottom: 12,
            paddingHorizontal: 14,
            paddingVertical: 14,
        },
        erro: {
            color: cores.erro,
            fontSize: 12,
            marginBottom: 12,
        },
        botao: {
            alignItems: "center",
            backgroundColor: cores.primaria,
            borderRadius: 13,
            justifyContent: "center",
            minHeight: 50,
            padding: 14,
        },
        botaoPressionado: {
            opacity: 0.76,
        },
        textoBotao: {
            color: cores.branco,
            fontSize: 14,
            fontWeight: "800",
        },
        divisor: {
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 17,
        },
        linha: {
            backgroundColor: cores.borda,
            flex: 1,
            height: 1,
        },
        textoDivisor: {
            color: cores.textoSuave,
            fontSize: 11,
            marginHorizontal: 10,
        },
        botaoSecundario: {
            alignItems: "center",
            borderColor: cores.primaria,
            borderRadius: 13,
            borderWidth: 1,
            justifyContent: "center",
            minHeight: 48,
            padding: 13,
        },
        textoBotaoSecundario: {
            color: cores.primaria,
            fontSize: 13,
            fontWeight: "800",
        },
    });
