import React, { useState } from "react";
import "./AgregarPublicacion.css";

const AgregarPublicacion = () => {
  const [tipo, setTipo] = useState("");
  const [valoracion, setValoracion] = useState(0);

  // Estados nuevos para los inputs
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [valor, setValor] = useState("");

  const [mensaje, setMensaje] = useState(""); // Para mostrar respuesta del backend

  const handleStarClick = (num) => {
    setValoracion(num);
  };

  // Función para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombre,
      descripcion,
      tipo,
      valor,
      valoracion,
    };

    try {
      const response = await fetch("http://localhost:5000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();
      setMensaje(data.message || "Publicado correctamente");
    } catch (error) {
      setMensaje("Error al publicar");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="titulo">AGREGAR PRENDA</h2>
      <div className="contenido-central">
        {/* FOTOS */}
        <div className="fotos-lado-izquierdo">
          <p className="texto">Agregar fotos de la prenda.</p>
          <div className="fotos-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="foto-cuadro">
                <label htmlFor={`file${n}`} className="upload-label">
                  📤
                </label>
                <input type="file" id={`file${n}`} style={{ display: "none" }} />
              </div>
            ))}
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="form-lado-derecho">
          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label>Descripción:</label>
              <textarea
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="campo tipo-publicacion">
              <label>Tipo de publicación:</label>
              <button
                type="button"
                className={tipo === "venta" ? "active" : ""}
                onClick={() => setTipo("venta")}
              >
                VENTA
              </button>
              <button
                type="button"
                className={tipo === "intercambio" ? "active" : ""}
                onClick={() => setTipo("intercambio")}
              >
                INTERCAMBIO
              </button>
            </div>

            <div className="campo valor">
              <label>Valor -&gt;</label>
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>

            <div className="campo valoracion">
              <label>Califica la calidad de la prenda:</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${valoracion >= star ? "active" : ""}`}
                    onClick={() => handleStarClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-publicar">
              PUBLICAR
            </button>
          </form>

          {mensaje && <p style={{ marginTop: "1em", color: "green" }}>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
};

export default AgregarPublicacion;
