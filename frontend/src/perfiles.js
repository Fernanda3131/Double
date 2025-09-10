import React, { useState, useEffect } from "react";
import "./perfiles.css";

function AppPerfiles() {
  const [rating, setRating] = useState(0);
  const [perfil, setPerfil] = useState(null);

  // 🔹 Llamada a Flask API
  useEffect(() => {
    fetch("http://localhost:5000/api/perfiles") // tu backend
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos del perfil:", data);
        if (data.perfil && data.perfil.length > 0) {
          setPerfil(data.perfil[0]);  // tomo el primer usuario
          setRating(data.perfil[0].promedio_valoracion || 0);
        }
      })
      .catch((err) => console.error("Error al cargar perfil:", err));
  }, []);

  // 🔹 Guardar valoración en Flask
  const guardarValoracion = (nuevoRating) => {
    setRating(nuevoRating);
    fetch("http://localhost:5000/api/guardar_valoracion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_valorado_id: perfil?.id_usuario,
        puntaje: nuevoRating,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("Error guardando valoración:", err));
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <img className="logo" src="/logo.png" alt="Logo" />
      </header>

      {/* MAIN */}
      <main className="app-main">
        {perfil ? (
          <div className="perfil">
            {/* Foto usuario */}
            <div className="Marco">
              <img
                src={`/uploads/${perfil.foto_usuario}`} // Ajuste de ruta
                alt="Foto del usuario"
                className="foto-usuario"
              />
            </div>

            {/* Valoración */}
            <p>
              <strong>Promedio de valoración:</strong>{" "}
              {rating > 0 ? (
                <span className="stars-text">
                  {[...Array(Math.round(rating))].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </span>
              ) : (
                "Sin valoraciones aún"
              )}
            </p>

            {/* Estrellas interactivas */}
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "active" : ""}`}
                  onClick={() => guardarValoracion(star)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Datos personales */}
            <h2>{perfil.username_usuario}</h2>
            <div className="datos">
              <p><strong>Username:</strong> {perfil.username_usuario}</p>
            </div>

            {/* Publicaciones / prendas */}
            <div className="publicaciones">
              <h3>Publicaciones</h3>
              <div className="cards">
                {perfil.prendas && perfil.prendas.length > 0 ? (
                  perfil.prendas.map((prenda) => (
                    <div className="card" key={prenda.id_prenda}>
                      <h4>{prenda.nombre_prenda}</h4>
                      <img
                        src={`/uploads/${prenda.foto_prenda}`} // Ajuste de ruta
                        alt={prenda.nombre_prenda}
                        className="foto-prenda"
                      />
                      <p>⭐ {prenda.promedio_valoracion}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay prendas para mostrar</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Cargando perfil...</p>
        )}
      </main>
    </div>
  );
}

export default AppPerfiles;
