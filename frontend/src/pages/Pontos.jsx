
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarPontos, excluirPonto } from "../services/api";

function Pontos() {
    const [pontos, setPontos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarPontos() {
        try {
            setCarregando(true);
            setErro("");

            const dados = await listarPontos();
            setPontos(dados);
        } catch (error) {
            setErro("Não foi possível carregar os pontos.");
        } finally {
            setCarregando(false);
        }
    }

    async function handleExcluir(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este ponto?"
        );

        if (!confirmar) return;

        try {
            await excluirPonto(id);
            await carregarPontos();
        } catch (error) {
            alert("Erro ao excluir ponto.");
        }
    }

    useEffect(() => {
        carregarPontos();
    }, []);

    return (
        <main className="pagina-pontos">
            <header className="topo">
                <div className="logo-placeholder">
                    LOGOTIPO
                </div>

                <span className="nome-sistema">GeoPoint</span>
            </header>

            <section className="conteudo-pontos">
                <div className="cabecalho-pontos">
                    <div>
                        <h1>Meus pontos</h1>
                        <p>Gerencie seus pontos geográficos.</p>
                    </div>

                    <Link to="/pontos/novo" className="botao botao-principal">
                        + Novo ponto
                    </Link>
                </div>

                {carregando && (
                    <p className="mensagem">Carregando pontos...</p>
                )}

                {erro && (
                    <p className="mensagem mensagem-erro">{erro}</p>
                )}

                {!carregando && !erro && pontos.length === 0 && (
                    <div className="estado-vazio">
                        <h2>Nenhum ponto cadastrado</h2>
                        <p>Comece adicionando seu primeiro ponto geográfico.</p>
                        <Link to="/pontos/novo" className="botao botao-principal">
                            Cadastrar ponto
                        </Link>
                    </div>
                )}

                {!carregando && !erro && pontos.length > 0 && (
                    <div className="lista-pontos">
                        {pontos.map((ponto) => (
                            <article className="card-ponto" key={ponto.id}>
                                <div className="informacoes-ponto">
                                    <h2>{ponto.name}</h2>
                                    <p>{ponto.description || "Sem descrição."}</p>

                                    <div className="coordenadas">
                    <span>
                      <strong>Latitude:</strong> {ponto.latitude}
                    </span>

                                        <span>
                      <strong>Longitude:</strong> {ponto.longitude}
                    </span>
                                    </div>
                                </div>

                                <div className="acoes-ponto">
                                    <Link
                                        to={`/pontos/${ponto.id}/editar`}
                                        className="botao botao-secundario"
                                    >
                                        Editar
                                    </Link>

                                    <button
                                        className="botao botao-excluir"
                                        onClick={() => handleExcluir(ponto.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Pontos;
