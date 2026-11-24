
const API_URL = "http://localhost:8081/api/points";

export async function listarPontos() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Erro ao buscar pontos");
    }

    return response.json();
}

export async function buscarPonto(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar ponto");
    }

    return response.json();
}

export async function criarPonto(ponto) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ponto),
    });

    if (!response.ok) {
        throw new Error("Erro ao cadastrar ponto");
    }

    return response.json();
}

export async function atualizarPonto(id, ponto) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ponto),
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar ponto");
    }

    return response.json();
}

export async function excluirPonto(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Erro ao excluir ponto");
    }
}
