import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CampoFormulario from "../components/CampoFormulario";
import { useLivraria } from "../contexts/LivrariaContext";
import { cadastrarUsuario } from "../services/usuario/cadastrarUsuario";

export default function CadastroUsuario({ navigation }) {
    const { cores } = useLivraria();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function salvarCadastro() {
        if (!nome.trim() || !email.trim() || !senha) {
            setErro("Preencha nome, e-mail e senha.");
            return;
        }

        setCarregando(true);
        setErro("");

        try {
            const retorno = await cadastrarUsuario({
                nome: nome.trim(),
                email: email.trim(),
                senha,
            });

            Alert.alert(
                "Usuário cadastrado",
                retorno.mensagem || "Agora você já pode entrar na Livraria.",
                [
                    {
                        text: "Ir para o login",
                        onPress: () =>
                            navigation.popTo("Login", {
                                emailCadastrado: email.trim(),
                            }),
                    },
                ],
                { cancelable: false }
            );
        } catch (falha) {
            setErro(falha.message || "Não foi possível cadastrar o usuário.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.conteudo}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.cabecalho}>
                        <Text style={styles.icone}>♙</Text>
                        <Text style={styles.selo}>NOVA CONTA</Text>
                        <Text style={styles.titulo}>Cadastre seu usuário</Text>
                        <Text style={styles.subtitulo}>
                            A API solicita somente os três campos abaixo. O cadastro é
                            público e a senha não é salva no aparelho.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <CampoFormulario
                            autoCapitalize="words"
                            autoComplete="name"
                            label="Nome"
                            onChangeText={setNome}
                            placeholder="Seu nome completo"
                            value={nome}
                        />
                        <CampoFormulario
                            autoCapitalize="none"
                            autoComplete="email"
                            keyboardType="email-address"
                            label="E-mail"
                            onChangeText={setEmail}
                            placeholder="voce@email.com"
                            value={email}
                        />
                        <CampoFormulario
                            ajuda="A senha será enviada com segurança para a API e armazenada por ela como hash."
                            autoCapitalize="none"
                            autoComplete="new-password"
                            label="Senha"
                            onChangeText={setSenha}
                            placeholder="Digite uma senha"
                            secureTextEntry
                            value={senha}
                        />

                        {!!erro && (
                            <View style={styles.avisoErro}>
                                <Text style={styles.textoErro}>{erro}</Text>
                            </View>
                        )}

                        <Pressable
                            disabled={carregando}
                            onPress={salvarCadastro}
                            style={({ pressed }) => [
                                styles.botao,
                                pressed && styles.botaoPressionado,
                                carregando && styles.botaoDesativado,
                            ]}
                        >
                            {carregando ? (
                                <ActivityIndicator color={cores.branco} />
                            ) : (
                                <Text style={styles.textoBotao}>Cadastrar usuário</Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const criarEstilos = (cores) =>
    StyleSheet.create({
        container: {
            backgroundColor: cores.fundo,
            flex: 1,
        },
        conteudo: {
            padding: 20,
            paddingBottom: 36,
        },
        cabecalho: {
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 18,
        },
        icone: {
            color: cores.primaria,
            fontSize: 42,
            marginBottom: 10,
        },
        selo: {
            color: cores.primaria,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.5,
        },
        titulo: {
            color: cores.texto,
            fontSize: 27,
            fontWeight: "900",
            letterSpacing: -0.5,
            marginTop: 7,
            textAlign: "center",
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 8,
            textAlign: "center",
        },
        card: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 22,
            borderWidth: 1,
            marginTop: 8,
            padding: 19,
        },
        avisoErro: {
            backgroundColor: cores.erroFundo,
            borderRadius: 11,
            marginBottom: 15,
            padding: 12,
        },
        textoErro: {
            color: cores.erro,
            fontSize: 12,
            lineHeight: 17,
        },
        botao: {
            alignItems: "center",
            backgroundColor: cores.primaria,
            borderRadius: 13,
            justifyContent: "center",
            minHeight: 52,
            paddingHorizontal: 16,
        },
        botaoPressionado: {
            opacity: 0.76,
        },
        botaoDesativado: {
            opacity: 0.64,
        },
        textoBotao: {
            color: cores.branco,
            fontSize: 14,
            fontWeight: "900",
        },
    });
