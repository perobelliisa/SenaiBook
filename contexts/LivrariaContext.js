import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { temaClaro, temaEscuro } from "../constants/temas";

const CHAVE_FAVORITOS = "@livraria:favoritos";
const CHAVE_TEMA = "@livraria:tema-escuro";

const LivrariaContext = createContext(null);

export function LivrariaProvider({ children }) {
    const [favoritos, setFavoritos] = useState([]);
    const [modoEscuro, setModoEscuro] = useState(false);
    const [dadosCarregados, setDadosCarregados] = useState(false);

    useEffect(() => {
        let componenteAtivo = true;

        async function carregarPreferencias() {
            try {
                const [favoritosSalvos, temaSalvo] = await Promise.all([
                    AsyncStorage.getItem(CHAVE_FAVORITOS),
                    AsyncStorage.getItem(CHAVE_TEMA),
                ]);

                if (!componenteAtivo) {
                    return;
                }

                const listaSalva = favoritosSalvos
                    ? JSON.parse(favoritosSalvos)
                    : [];

                setFavoritos(Array.isArray(listaSalva) ? listaSalva : []);
                setModoEscuro(temaSalvo === "true");
            } catch (erro) {
                console.warn("Não foi possível carregar as preferências.", erro);
            } finally {
                if (componenteAtivo) {
                    setDadosCarregados(true);
                }
            }
        }

        carregarPreferencias();

        return () => {
            componenteAtivo = false;
        };
    }, []);

    useEffect(() => {
        if (!dadosCarregados) {
            return;
        }

        AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos)).catch(
            (erro) => console.warn("Não foi possível salvar os favoritos.", erro)
        );
    }, [dadosCarregados, favoritos]);

    useEffect(() => {
        if (!dadosCarregados) {
            return;
        }

        AsyncStorage.setItem(CHAVE_TEMA, String(modoEscuro)).catch((erro) =>
            console.warn("Não foi possível salvar o tema.", erro)
        );
    }, [dadosCarregados, modoEscuro]);

    function alternarFavorito(livro) {
        setFavoritos((listaAtual) => {
            const livroJaFoiSalvo = listaAtual.some(
                (item) => String(item.id) === String(livro.id)
            );

            if (livroJaFoiSalvo) {
                return listaAtual.filter(
                    (item) => String(item.id) !== String(livro.id)
                );
            }

            return [...listaAtual, livro];
        });
    }

    function ehFavorito(id) {
        return favoritos.some((livro) => String(livro.id) === String(id));
    }

    function atualizarFavorito(livroAtualizado) {
        setFavoritos((listaAtual) =>
            listaAtual.map((livro) =>
                String(livro.id) === String(livroAtualizado.id)
                    ? livroAtualizado
                    : livro
            )
        );
    }

    const valor = useMemo(
        () => ({
            alternarFavorito,
            atualizarFavorito,
            cores: modoEscuro ? temaEscuro : temaClaro,
            ehFavorito,
            favoritos,
            modoEscuro,
            alternarTema: () => setModoEscuro((temaAtual) => !temaAtual),
        }),
        [favoritos, modoEscuro]
    );

    return (
        <LivrariaContext.Provider value={valor}>
            {children}
        </LivrariaContext.Provider>
    );
}

export function useLivraria() {
    const contexto = useContext(LivrariaContext);

    if (!contexto) {
        throw new Error("useLivraria deve ser usado dentro de LivrariaProvider.");
    }

    return contexto;
}
