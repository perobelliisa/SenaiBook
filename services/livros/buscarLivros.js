const URL_BASE = "https://apps-api-livros.ucxocw.easypanel.host";

function montarParametros(parametros) {
    const query = Object.entries(parametros)
        .filter(([, valor]) => valor !== undefined && valor !== null && valor !== "")
        .map(
            ([chave, valor]) =>
                `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`
        )
        .join("&");

    return query ? `?${query}` : "";
}

async function requisitar(caminho) {
    const resposta = await fetch(`${URL_BASE}${caminho}`);

    if (!resposta.ok) {
        throw new Error(`A API respondeu com o status ${resposta.status}.`);
    }

    return resposta.json();
}

async function requisitarLivros(parametros) {
    const dados = await requisitar(`/livros${montarParametros(parametros)}`);
    return Array.isArray(dados.livros) ? dados.livros : [];
}

export async function buscarLivros({ termo = "", categoria = "" } = {}) {
    const pesquisa = termo.trim();
    const filtroCategoria = categoria === "Todos" ? "" : categoria;

    if (!pesquisa) {
        return requisitarLivros({ categoria: filtroCategoria });
    }

    const [livrosPorTitulo, livrosPorAutor] = await Promise.all([
        requisitarLivros({ titulo: pesquisa, categoria: filtroCategoria }),
        requisitarLivros({ autor: pesquisa, categoria: filtroCategoria }),
    ]);

    const livrosSemRepeticao = new Map();

    [...livrosPorTitulo, ...livrosPorAutor].forEach((livro) => {
        livrosSemRepeticao.set(String(livro.id), livro);
    });

    return Array.from(livrosSemRepeticao.values());
}

export async function buscarCategorias() {
    const dados = await requisitar("/categorias");
    return Array.isArray(dados.categorias) ? dados.categorias : [];
}

export function obterPrecoNumerico(preco) {
    if (typeof preco === "number") {
        return Number.isFinite(preco) ? preco : null;
    }

    if (typeof preco !== "string" || !preco.trim()) {
        return null;
    }

    const textoLimpo = preco.replace(/R\$/gi, "").replace(/\s/g, "");
    const valorNormalizado = textoLimpo.includes(",")
        ? textoLimpo.replace(/\./g, "").replace(",", ".")
        : textoLimpo;
    const valor = Number(valorNormalizado);

    return Number.isFinite(valor) ? valor : null;
}

export function formatarPreco(preco) {
    const valor = obterPrecoNumerico(preco);

    if (valor === null) {
        return null;
    }

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
