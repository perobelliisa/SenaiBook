import { getToken } from "../usuario/usuarioStorage";

const URL_BASE = "https://apps-api-livros.ucxocw.easypanel.host/livros";

async function requisitar(caminho = "", opcoes = {}) {
    const token = await getToken();

    if (!token) {
        throw new Error("Faça login novamente para gerenciar livros.");
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

export function cadastrarLivro(dadosLivro) {
    return requisitar("", {
        method: "POST",
        body: JSON.stringify(dadosLivro),
    });
}

export function atualizarLivro(id, dadosLivro) {
    return requisitar(`/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(dadosLivro),
    });
}

export function excluirLivro(id) {
    return requisitar(`/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}
