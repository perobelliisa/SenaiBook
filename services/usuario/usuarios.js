import { getToken } from "./usuarioStorage";

const URL_BASE = "https://apps-api-livros.ucxocw.easypanel.host";

async function requisitar(caminho, opcoes = {}) {
    const token = await getToken();

    if (!token) {
        throw new Error("Faça login novamente para continuar.");
    }

    const resposta = await fetch(`${URL_BASE}${caminho}`, {
        ...opcoes,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
            ...opcoes.headers,
        },
    });
    const retorno = await resposta.json();

    if (!resposta.ok) {
        throw new Error(retorno.mensagem || "Não foi possível concluir a operação.");
    }

    return retorno;
}

export async function listarUsuarios() {
    const retorno = await requisitar("/usuarios");
    return Array.isArray(retorno.usuarios) ? retorno.usuarios : [];
}

export async function buscarUsuario(id) {
    const retorno = await requisitar(`/usuarios/${encodeURIComponent(id)}`);
    return retorno.usuario;
}

export function atualizarUsuario(id, { nome, email, senha }) {
    return requisitar(`/usuarios/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({ nome, email, senha }),
    });
}

export function excluirUsuario(id) {
    return requisitar(`/usuarios/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}
