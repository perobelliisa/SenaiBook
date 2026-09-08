import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CardUsuario from "../components/CardUsuario";
import EstadoLista from "../components/EstadoLista";
import { useLivraria } from "../contexts/LivrariaContext";
import { useSessao } from "../contexts/SessaoContext";
import { listarUsuarios } from "../services/usuario/usuarios";

export default function Usuarios() {
    const { cores } = useLivraria();
    const { usuario } = useSessao();
    const styles = useMemo(() => criarEstilos(cores), [cores]);
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState("");
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        let componenteAtivo = true;

        async function carregar() {
            setErro("");

            try {
                const lista = await listarUsuarios();

                if (componenteAtivo) {
                    setUsuarios(lista);
                }
            } catch (falha) {
                if (componenteAtivo) {
                    setErro(
                        falha.message || "Não foi possível carregar os usuários."
                    );
                }
            } finally {
                if (componenteAtivo) {
                    setCarregando(false);
                    setAtualizando(false);
                }
            }
        }

        carregar();

        return () => {
            componenteAtivo = false;
        };
    }, [versao]);

    function atualizar() {
        setAtualizando(true);
        setVersao((valor) => valor + 1);
    }

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <FlatList
                contentContainerStyle={[
                    styles.conteudo,
                    usuarios.length === 0 && styles.conteudoVazio,
                ]}
                data={usuarios}
                keyExtractor={(usuario) => String(usuario.id)}
                ListHeaderComponent={
                    <View style={styles.cabecalho}>
                        <Text style={styles.selo}>COMUNIDADE</Text>
                        <Text style={styles.titulo}>Usuários cadastrados</Text>
                        <Text style={styles.subtitulo}>
                            Lista disponível para usuários autenticados. Os dados abaixo
                            são somente para leitura.
                        </Text>
                        {!carregando && !erro && (
                            <Text style={styles.total}>
                                {usuarios.length}{" "}
                                {usuarios.length === 1 ? "usuário" : "usuários"}
                            </Text>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    carregando ? (
                        <View style={styles.carregamento}>
                            <ActivityIndicator color={cores.primaria} size="large" />
                            <Text style={styles.textoCarregamento}>
                                Carregando usuários...
                            </Text>
                        </View>
                    ) : erro ? (
                        <EstadoLista
                            icone="⚠"
                            mensagem={erro}
                            onRetry={atualizar}
                            titulo="Não foi possível carregar"
                        />
                    ) : (
                        <EstadoLista
                            icone="♙"
                            mensagem="Nenhum usuário foi retornado pela API."
                            titulo="Lista vazia"
                        />
                    )
                }
                onRefresh={atualizar}
                refreshing={atualizando}
                renderItem={({ item }) => (
                    <CardUsuario
                        usuario={item}
                        usuarioAtual={String(item.id) === String(usuario?.id)}
                    />
                )}
                showsVerticalScrollIndicator={false}
            />
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
            paddingBottom: 32,
        },
        conteudoVazio: {
            flexGrow: 1,
        },
        cabecalho: {
            marginBottom: 22,
        },
        selo: {
            color: cores.primaria,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
        },
        titulo: {
            color: cores.texto,
            fontSize: 27,
            fontWeight: "900",
            letterSpacing: -0.5,
            marginTop: 6,
        },
        subtitulo: {
            color: cores.textoSuave,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 7,
        },
        total: {
            color: cores.primaria,
            fontSize: 11,
            fontWeight: "800",
            marginTop: 12,
        },
        carregamento: {
            alignItems: "center",
            paddingVertical: 45,
        },
        textoCarregamento: {
            color: cores.textoSuave,
            fontSize: 13,
            marginTop: 12,
        },
    });
