
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Pontos from "./pages/Pontos";
import NovoPonto from "./pages/NovoPonto";
import EditarPonto from "./pages/EditarPonto";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/pontos/:id/editar" element={<EditarPonto />} />
                <Route path="/" element={<Navigate to="/pontos" />} />
                <Route path="/pontos" element={<Pontos />} />
                <Route path="/pontos/novo" element={<NovoPonto />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
