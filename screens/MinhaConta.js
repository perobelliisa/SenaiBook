import { useEffect, useMemo, useState } from "react";
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
import { useSessao } from "../contexts/SessaoContext";
import { salvarUsuario } from "../services/usuario/usuarioStorage";
import {
    atualizarUsuario,
    buscarUsuario,
    excluirUsuario,
} from "../services/usuario/usuarios";

export default function MinhaConta({ navigation }) {
    const { cores } = useLivraria();
    const {
        atualizarSessao,
        encerrarSessao,
        usuario: usuarioSessao,
    } = useSessao();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregandoDados, setCarregandoDados] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let componenteAtivo = true;

        async function carregarConta() {
            try {
                if (!usuarioSessao?.id) {
                    throw new Error("Sessão inválida. Faça login novamente.");
                }

                const usuarioAtual = await buscarUsuario(usuarioSessao.id);

                if (componenteAtivo) {
                    setId(usuarioAtual.id);
                    setNome(usuarioAtual.nome);
                    setEmail(usuarioAtual.email);
                }
            } catch (falha) {
                if (componenteAtivo) {
                    setErro(falha.message || "Não foi possível carregar sua conta.");
                }
            } finally {
                if (componenteAtivo) {
                    setCarregandoDados(false);
                }
            }
        }

        carregarConta();

        return () => {
            componenteAtivo = false;
        };
    }, [usuarioSessao?.id]);

    async function sair() {
        await encerrarSessao();
    }

    async function salvarAlteracoes() {
        if (!id || !nome.trim() || !email.trim() || !senha) {
            setErro("Preencha nome, e-mail e senha para atualizar sua conta.");
            return;
        }

        setSalvando(true);
        setErro("");

        try {
            const retorno = await atualizarUsuario(id, {
                nome: nome.trim(),
                email: email.trim(),
                senha,
            });
            const usuarioAtualizado = retorno.usuario;

            await salvarUsuario(
                usuarioAtualizado.id,
                usuarioAtualizado.nome,
                usuarioAtualizado.email
            );
            atualizarSessao(usuarioAtualizado);
            setSenha("");

            Alert.alert(
                "Conta atualizada",
                retorno.mensagem || "Seus dados foram salvos.",
                [
                    {
                        text: "Voltar ao catálogo",
                        onPress: () =>
                            navigation.popTo("Home", {
                                usuarioAtualizado: Date.now(),
                            }),
                    },
                ],
                { cancelable: false }
            );
        } catch (falha) {
            setErro(falha.message || "Não foi possível atualizar sua conta.");
        } finally {
            setSalvando(false);
        }
    }

    async function removerConta() {
        setExcluindo(true);
        setErro("");

        try {
            const retorno = await excluirUsuario(id);
            await encerrarSessao();

            Alert.alert(
                "Conta excluída",
                retorno.mensagem || "Seu usuário foi removido.",
                [{ text: "OK" }],
                { cancelable: false }
            );
        } catch (falha) {
            setErro(falha.message || "Não foi possível excluir sua conta.");
        } finally {
            setExcluindo(false);
        }
    }

    function confirmarExclusao() {
        Alert.alert(
            "Excluir sua conta?",
            "Esta ação remove definitivamente o seu próprio usuário da API.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir minha conta",
                    style: "destructive",
                    onPress: removerConta,
                },
            ]
        );
    }

    if (carregandoDados) {
        return (
            <SafeAreaView edges={["bottom"]} style={styles.carregamento}>
                <ActivityIndicator color={cores.primaria} size="large" />
                <Text style={styles.textoCarregamento}>Carregando sua conta...</Text>
            </SafeAreaView>
        );
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
                        <View style={styles.avatar}>
                            <Text style={styles.inicial}>
                                {nome.trim().charAt(0).toUpperCase() || "U"}
                            </Text>
                        </View>
                        <Text style={styles.selo}>USUÁRIO #{id || "-"}</Text>
                        <Text style={styles.titulo}>Minha conta</Text>
                        <Text style={styles.subtitulo}>
                            Somente os dados do usuário desta sessão podem ser alterados
                            por esta tela.
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
                            ajuda="A API exige nome, e-mail e senha completos em toda atualização. A senha não fica salva no aplicativo."
                            autoCapitalize="none"
                            autoComplete="new-password"
                            label="Senha"
                            onChangeText={setSenha}
                            placeholder="Informe a senha para salvar"
                            secureTextEntry
                            value={senha}
                        />

                        {!!erro && (
                            <View style={styles.avisoErro}>
                                <Text style={styles.textoErro}>{erro}</Text>
                            </View>
                        )}

                        <Pressable
                            disabled={salvando || excluindo}
                            onPress={salvarAlteracoes}
                            style={({ pressed }) => [
                                styles.botaoSalvar,
                                pressed && styles.botaoPressionado,
                            ]}
                        >
                            {salvando ? (
                                <ActivityIndicator color={cores.branco} />
                            ) : (
                                <Text style={styles.textoSalvar}>Salvar alterações</Text>
                            )}
                        </Pressable>

                        <Pressable
                            disabled={salvando || excluindo}
                            onPress={sair}
                            style={({ pressed }) => [
                                styles.botaoSair,
                                pressed && styles.botaoPressionado,
                            ]}
                        >
                            <Text style={styles.textoSair}>Sair da conta</Text>
                        </Pressable>
                    </View>

                    <View style={styles.zonaPerigo}>
                        <Text style={styles.tituloPerigo}>Zona de perigo</Text>
                        <Text style={styles.descricaoPerigo}>
                            A exclusão remove somente o usuário atualmente logado.
                        </Text>
                        <Pressable
                            disabled={salvando || excluindo}
                            onPress={confirmarExclusao}
                            style={({ pressed }) => [
                                styles.botaoExcluir,
                                pressed && styles.botaoPressionado,
                            ]}
                        >
                            {excluindo ? (
                                <ActivityIndicator color={cores.erro} />
                            ) : (
                                <Text style={styles.textoExcluir}>
                                    Excluir minha conta
                                </Text>
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
            paddingBottom: 40,
        },
        carregamento: {
            alignItems: "center",
            backgroundColor: cores.fundo,
            flex: 1,
            justifyContent: "center",
        },
        textoCarregamento: {
            color: cores.textoSuave,
            fontSize: 13,
            marginTop: 12,
        },
        cabecalho: {
            alignItems: "center",
            marginBottom: 20,
        },
        avatar: {
            alignItems: "center",
            backgroundColor: cores.superficieSecundaria,
            borderRadius: 32,
            height: 64,
            justifyContent: "center",
            marginBottom: 12,
            width: 64,
        },
        inicial: {
            color: cores.primaria,
            fontSize: 25,
            fontWeight: "900",
        },
        selo: {
            color: cores.primaria,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
        },
        titulo: {
            color: cores.texto,
            fontSize: 28,
            fontWeight: "900",
            marginTop: 5,
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 7,
            textAlign: "center",
        },
        card: {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            borderRadius: 22,
            borderWidth: 1,
            padding: 18,
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
        botaoSalvar: {
            alignItems: "center",
            backgroundColor: cores.primaria,
            borderRadius: 13,
            justifyContent: "center",
            minHeight: 52,
            paddingHorizontal: 16,
        },
        textoSalvar: {
            color: cores.branco,
            fontSize: 14,
            fontWeight: "900",
        },
        botaoSair: {
            alignItems: "center",
            borderColor: cores.borda,
            borderRadius: 13,
            borderWidth: 1,
            justifyContent: "center",
            marginTop: 11,
            minHeight: 48,
        },
        textoSair: {
            color: cores.textoSuave,
            fontSize: 13,
            fontWeight: "800",
        },
        zonaPerigo: {
            backgroundColor: cores.erroFundo,
            borderColor: cores.erro,
            borderRadius: 18,
            borderWidth: 1,
            marginTop: 18,
            padding: 17,
        },
        tituloPerigo: {
            color: cores.erro,
            fontSize: 15,
            fontWeight: "900",
        },
        descricaoPerigo: {
            color: cores.erro,
            fontSize: 11,
            lineHeight: 16,
            marginTop: 5,
        },
        botaoExcluir: {
            alignItems: "center",
            borderColor: cores.erro,
            borderRadius: 12,
            borderWidth: 1,
            justifyContent: "center",
            marginTop: 14,
            minHeight: 46,
        },
        textoExcluir: {
            color: cores.erro,
            fontSize: 12,
            fontWeight: "900",
        },
        botaoPressionado: {
            opacity: 0.72,
        },
    });
