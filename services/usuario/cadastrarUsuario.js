const URL_CADASTRO = "https://apps-api-livros.ucxocw.easypanel.host/usuarios";

export async function cadastrarUsuario({ nome, email, senha }) {
    const resposta = await fetch(URL_CADASTRO, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
    });

    const retorno = await resposta.json();

    if (!resposta.ok) {
        throw new Error(retorno.mensagem || "Não foi possível cadastrar o usuário.");
    }

    return retorno;
}
