import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "./perfiles.css";

function AppPerfiles() {
  const { id_usuario } = useParams(); 
  const [rating, setRating] = useState(0);
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  // 🔹 Llamada al backend Flask
  useEffect(() => {
    const endpoint = id_usuario
      ? `${BACKEND_URL}/api/perfil_usuario/${id_usuario}`
      : `${BACKEND_URL}/api/perfil_usuario`;

    fetch(endpoint, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos del perfil:", data);

        if (data.perfil) {
          if (Array.isArray(data.perfil)) {
            const usuario = {
              id_usuario: data.perfil[0].id_usuario,
              username_usuario: data.perfil[0].username_usuario,
              foto_usuario: data.perfil[0].foto_usuario,
              promedio_valoracion: data.perfil[0].promedio_valoracion,
              prendas: data.perfil.map((p) => ({
                id_prenda: p.id_prenda,
                nombre_prenda: p.nombre_prenda,
                foto_prenda: p.foto_prenda,
                valor: p.valor,
              })),
            };
            setPerfil(usuario);
            setRating(usuario.promedio_valoracion || 0);
          } else {
            setPerfil(data.perfil);
            setRating(data.perfil.promedio_valoracion || 0);
          }
        }
      })
      .catch((err) => console.error("❌ Error al cargar perfil:", err));
  }, [id_usuario]);

  // 🔹 Guardar valoración
  const guardarValoracion = (nuevoRating) => {
    if (!perfil) return;
    setRating(nuevoRating);

    fetch(`${BACKEND_URL}/api/guardar_valoracion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_valorado_id: perfil.id_usuario,
        puntaje: nuevoRating,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Valoración guardada:", data))
      .catch((err) => console.error("❌ Error guardando valoración:", err));
  };

  // 🔹 Renderizar estrellas
  const renderStars = (promedio) => {
    const rounded = Math.round(promedio);
    return (
      <span className="stars-text">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`star ${rating >= i ? "active" : ""}`}
            onClick={() => guardarValoracion(i)}
            style={{ cursor: "pointer" }}
          >
            {i <= rounded ? "★" : "☆"}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="app">
      <main className="app-main">
        {perfil ? (
          <>
            {/* Columna izquierda */}
            <div className="perfil">
              <div className="Marco">
                <img
                  src={
                    perfil.foto_usuario
                      ? `${BACKEND_URL}/uploads${
                          perfil.foto_usuario.startsWith("/")
                            ? perfil.foto_usuario
                            : "/" + perfil.foto_usuario
                        }`
                      : "/default-user.png"
                  }
                  alt="Foto del usuario"
                  className="foto-usuario"
                />
              </div>

              <p>
                <strong>Promedio de valoración:</strong> {renderStars(rating)}
              </p>

              <h2>{perfil.username_usuario}</h2>
              <div className="datos">
                <p>
                  <strong>Username:</strong>{" "}
                  {perfil.username_usuario || "No disponible"}
                </p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="publicaciones">
              <h3>Publicaciones</h3>
              <div className="cards">
                {perfil.prendas && perfil.prendas.length > 0 ? (
                  perfil.prendas.map((prenda) => (
                    <div
                      className="card"
                      key={prenda.id_prenda}
                      onClick={() =>
                        navigate(`/detalle_prenda/${prenda.id_prenda}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <h4>{prenda.nombre_prenda}</h4>
                      <img
                        src={
                          prenda.foto_prenda
                            ? `${BACKEND_URL}/uploads/${prenda.foto_prenda}`
                            : "/default-prenda.png"
                        }
                        alt={prenda.nombre_prenda}
                        className="foto-prenda"
                      />
                    </div>
                  ))
                ) : (
                  <p>No hay prendas para mostrar</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Cargando perfil...</p>
        )}
      </main>

      {/* Botón volver */}
      <button
        className="volver-btn"
        title="Volver al Catálogo"
        onClick={() => navigate("/catalogo")}
      >
        ←
      </button>
    </div>
  );
}

export default AppPerfiles;
