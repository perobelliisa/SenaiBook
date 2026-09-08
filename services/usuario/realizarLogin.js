import { salvarToken, salvarUsuario } from "./usuarioStorage";

export async function realizarLogin(email, senha) {
    const resposta = await fetch(
        "https://apps-api-livros.ucxocw.easypanel.host/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        }
    );

    const retorno = await resposta.json();

    if (!resposta.ok || !retorno.token) {
        throw new Error(retorno.mensagem || "Credenciais inválidas");
    }

    await salvarUsuario(retorno.usuario.id, retorno.usuario.nome, retorno.usuario.email);
    await salvarToken(retorno.token);

    return {
        token: retorno.token,
        usuario: retorno.usuario,
    };
}
