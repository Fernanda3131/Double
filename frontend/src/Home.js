import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Bienvenido a Double_P</h1>
      <p>Usa las rutas /register, /agregar o /iniciar en la URL para navegar.</p>

      {/* Enlaces navegables */}
      <div style={{ marginTop: "1rem" }}>
        <Link to="/register">
          <button>Ir a Registro</button>
        </Link>

        <Link to="/iniciar" style={{ marginLeft: "10px" }}>
          <button>Iniciar Sesión</button>
        </Link>

        <Link to="/agregar" style={{ marginLeft: "10px" }}>
          <button>Agregar Publicación</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

