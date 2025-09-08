import React, { useState, useEffect } from "react";
import "./perfiles.css";

function Perfiles() {
  const [promedio, setPromedio] = useState(0);  // promedio del usuario (estrellas negras)
  const [rating, setRating] = useState(0);      // rating seleccionado (estrellas amarillas)
  const [perfil, setPerfil] = useState(null);

  // Función para cargar perfil y promedio
  const fetchPerfil = () => {
    fetch("http://localhost:5000/api/perfiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.perfil) {
          const perfilData = Array.isArray(data.perfil) ? data.perfil[0] : data.perfil;
          setPerfil(perfilData);
          setPromedio(perfilData.promedio_valoracion || 0);
        }
      })
      .catch((err) => console.error("Error al cargar perfil:", err));
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  // Guardar valoración y refrescar promedio
  const guardarValoracion = (nuevoRating) => {
    setRating(nuevoRating); // para colorear estrellas amarillas
    fetch("http://localhost:5000/api/guardar_valoracion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_valorado_id: perfil?.id_usuario,
        puntaje: nuevoRating,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchPerfil(); // refrescar promedio negro
      })
      .catch((err) => console.error("Error guardando valoración:", err));
  };

  return (
    <div className="app">
      <header className="app-header">
        <img className="logo" src="/logo.png" alt="Logo" />
      </header>

      <main className="app-main">
        {perfil ? (
          <div className="perfil">
            {/* Foto usuario */}
            <div className="Marco">
              <img
                src={`/uploads/${perfil.foto_usuario || "default.jpg"}`}
                alt="Foto del usuario"
                className="foto-usuario"
              />
            </div>

            {/* Valoración promedio - SOLO mostrar, no clicable */}
            <p>
              <strong>Promedio de valoración:</strong>{" "}
              {promedio > 0 ? (
                <span className="stars-text">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < Math.round(promedio) ? "black" : "#ccc" }}>★</span>
                  ))}
                </span>
              ) : (
                "Sin valoraciones aún"
              )}
            </p>

            {/* Estrellas para agregar valoración - AMARILLAS, clicables */}
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "active" : ""}`}
                  style={{ color: rating >= star ? "orange" : "#ccc", cursor: "pointer" }}
                  onClick={() => guardarValoracion(star)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Datos personales */}
            <h2>{perfil.username_usuario || "Usuario"}</h2>
            <div className="datos">
              <p><strong>Username:</strong> {perfil.username_usuario || "N/A"}</p>
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
                        src={`/uploads/${prenda.foto_prenda || "default-prenda.jpg"}`}
                        alt={prenda.nombre_prenda}
                        className="foto-prenda"
                      />
                      {/* Aquí si quieres puedes mostrar promedio prenda */}
                      <p>⭐ {prenda.promedio_valoracion || "-"}</p>
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

export default Perfiles;
