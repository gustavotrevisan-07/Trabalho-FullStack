
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { criarPonto } from "../services/api";

function NovoPonto() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
    });

    const [erro, setErro] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario({
            ...formulario,
            [name]: value,
        });
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
            await criarPonto({
                name: formulario.name.trim(),
                description: formulario.description.trim(),
                latitude,
                longitude,
            });

            navigate("/pontos");
        } catch (error) {
            setErro("Não foi possível cadastrar o ponto.");
        }
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
                        <h1>Novo ponto</h1>
                        <p>Preencha os dados para cadastrar um ponto geográfico.</p>
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
                                placeholder="Ex.: Praça Marechal Floriano"
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
                                placeholder="Descreva este ponto geográfico..."
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
                                    placeholder="Ex.: -28.2628"
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
                                    placeholder="Ex.: -52.4067"
                                    value={formulario.longitude}
                                    onChange={handleChange}
                                    required
                                />
                                <small>Entre -180 e 180.</small>
                            </div>
                        </div>

                        <div className="botoes-formulario">
                            <button type="button" className="botao botao-secundario"
                                    onClick={() => navigate("/pontos")}>
                                Cancelar
                            </button>

                            <button type="submit" className="botao botao-principal">
                                Cadastrar ponto
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default NovoPonto;
