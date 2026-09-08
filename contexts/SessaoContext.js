import { createContext, useContext, useMemo, useState } from "react";

import { limparDados } from "../services/usuario/usuarioStorage";

const SessaoContext = createContext(null);

export function SessaoProvider({ children }) {
    const [token, setToken] = useState(null);
    const [usuario, setUsuario] = useState(null);

    function iniciarSessao(dadosSessao) {
        setToken(dadosSessao.token);
        setUsuario(dadosSessao.usuario);
    }

    function atualizarSessao(usuarioAtualizado) {
        setUsuario(usuarioAtualizado);
    }

    async function encerrarSessao() {
        await limparDados();
        setToken(null);
        setUsuario(null);
    }

    const valor = useMemo(
        () => ({
            atualizarSessao,
            encerrarSessao,
            iniciarSessao,
            logado: !!token,
            token,
            usuario,
        }),
        [token, usuario]
    );

    return (
        <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>
    );
}

export function useSessao() {
    const contexto = useContext(SessaoContext);

    if (!contexto) {
        throw new Error("useSessao deve ser usado dentro de SessaoProvider.");
    }

    return contexto;
}
