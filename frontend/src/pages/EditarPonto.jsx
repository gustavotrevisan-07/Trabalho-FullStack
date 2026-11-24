
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { buscarPonto, atualizarPonto } from "../services/api";

function EditarPonto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
    });

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarPonto() {
            try {
                const ponto = await buscarPonto(id);

                setFormulario({
                    name: ponto.name || "",
                    description: ponto.description || "",
                    latitude: ponto.latitude ?? "",
                    longitude: ponto.longitude ?? "",
                });
            } catch (error) {
                setErro("Não foi possível carregar o ponto.");
            } finally {
                setCarregando(false);
            }
        }

        carregarPonto();
    }, [id]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");

        const latitude = Number(formulario.latitude);
        const longitude = Number(formulario.longitude);

        if (
            !formulario.name.trim() ||
            formulario.name.length > 100 ||
            formulario.description.length > 255 ||
            formulario.latitude === "" ||
            formulario.longitude === "" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            setErro("Confira os campos e os limites de latitude e longitude.");
            return;
        }

        try {
            await atualizarPonto(id, {
                name: formulario.name.trim(),
                description: formulario.description.trim(),
                latitude,
                longitude,
            });

            navigate("/pontos");
        } catch (error) {
            setErro("Não foi possível atualizar o ponto.");
        }
    }

    if (carregando) {
        return <p className="mensagem">Carregando ponto...</p>;
    }

    if (erro && !formulario.name) {
        return (
            <main className="pagina-pontos">
                <p className="mensagem mensagem-erro">{erro}</p>
                <Link to="/pontos" className="voltar-link">
                    ← Voltar para meus pontos
                </Link>
            </main>
        );
    }

    return (
        <main className="pagina-pontos">
            <header className="topo">
                <div className="logo-placeholder">LOGOTIPO</div>
                <span className="nome-sistema">GeoPoint</span>
            </header>

            <section className="formulario-container">
                <Link to="/pontos" className="voltar-link">
                    ← Voltar para meus pontos
                </Link>

                <div className="formulario-card">
                    <div className="formulario-cabecalho">
                        <h1>Editar ponto</h1>
                        <p>Atualize as informações do ponto geográfico.</p>
                    </div>

                    {erro && (
                        <div className="formulario-erro">{erro}</div>
                    )}

                    <form onSubmit={handleSubmit} className="formulario-ponto">
                        <div className="campo-formulario">
                            <label htmlFor="name">Nome do ponto</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formulario.name}
                                onChange={handleChange}
                                maxLength={100}
                                required
                            />
                            <small>Máximo de 100 caracteres.</small>
                        </div>

                        <div className="campo-formulario">
                            <label htmlFor="description">Descrição</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formulario.description}
                                onChange={handleChange}
                                maxLength={255}
                                rows={4}
                            />
                            <small>Máximo de 255 caracteres.</small>
                        </div>

                        <div className="campos-coordenadas">
                            <div className="campo-formulario">
                                <label htmlFor="latitude">Latitude</label>
                                <input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formulario.latitude}
                                    onChange={handleChange}
                                    required
                                />
                                <small>Entre -90 e 90.</small>
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="longitude">Longitude</label>
                                <input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formulario.longitude}
                                    onChange={handleChange}
                                    required
                                />
                                <small>Entre -180 e 180.</small>
                            </div>
                        </div>

                        <div className="botoes-formulario">
                            <button
                                type="button"
                                className="botao botao-secundario"
                                onClick={() => navigate("/pontos")}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="botao botao-principal"
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default EditarPonto;
