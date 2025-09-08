import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Register from "./Register";
import AgregarPublicacion from "./AgregarPublicacion";
import IniciarSesion from "./IniciarSesion";

// Página de bienvenida
function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Bienvenido a Double_P</h1>
      <p>Usa las rutas /register, /agregar o /iniciar en la URL para navegar.</p>
    </div>
  );
}

// Envoltura para detectar la ruta y renderizar condicionalmente Header/Footer
function Layout() {
  const location = useLocation();

  // Ocultar Header/Footer en /register y /iniciar
  const ocultarHeaderFooter =
    location.pathname === "/register" || location.pathname === "/iniciar";

  return (
    <>
      {!ocultarHeaderFooter && <Header />}

      <main
        style={{
          paddingTop: !ocultarHeaderFooter ? "70px" : "0",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/iniciar" element={<IniciarSesion />} />
          <Route path="/agregar" element={<AgregarPublicacion />} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <h2>Página no encontrada</h2>
              </div>
            }
          />
        </Routes>
      </main>

      {!ocultarHeaderFooter && <Footer />}
    </>
  );
}

// App principal con Router
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;

