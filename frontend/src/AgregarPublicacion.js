<<<<<<< HEAD
import React, { useState } from "react";
import "./AgregarPublicacion.css";

const AgregarPublicacion = () => {
  const [tipo, setTipo] = useState("");
  const [valoracion, setValoracion] = useState(0);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [talla, setTalla] = useState("");
  const [valor, setValor] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [mensaje, setMensaje] = useState("");

  // Estados para fotos
  const [fotos, setFotos] = useState([null, null, null, null]);

  const handleStarClick = (num) => {
    setValoracion(num);
  };

  const handleFotoChange = (index, file) => {
    const nuevasFotos = [...fotos];
    nuevasFotos[index] = file;
    setFotos(nuevasFotos);
  };

  // Enviar datos
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("descripcion", descripcion);
    formData.append("estado", estado);
    formData.append("tipo_publicacion", tipo);
    formData.append("fecha_publicacion", new Date().toISOString().slice(0, 10));
    formData.append("nombre", nombre);
    formData.append("descripcion_prenda", descripcion);
    formData.append("talla", talla);
    formData.append("valor", valor);
    formData.append("valoracion", valoracion);

    fotos.forEach((foto, i) => {
      if (foto) formData.append(`foto${i + 1}`, foto);
    });

    try {
      const response = await fetch("http://localhost:5000/publicar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMensaje(data.message || "Publicado correctamente ✅");
    } catch (error) {
      setMensaje("❌ Error al publicar");
      console.error(error);
    }
  };

  // Previsualización de imágenes
  const renderPreview = (file) => {
    if (!file) return <span className="upload-label">📤</span>;
    return (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="preview-img"
      />
    );
  };

  return (
    <div className="container">
      <h2 className="titulo">AGREGAR PRENDA</h2>
      <div className="contenido-central">
        {/* FOTOS */}
        <div className="fotos-lado-izquierdo">
          <p className="texto">Agregar fotos de la prenda.</p>
          <div className="fotos-grid">
            {fotos.map((foto, index) => (
              <div className="foto-cuadro" key={index}>
                <input
                  type="file"
                  id={`file${index}`}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) =>
                    handleFotoChange(index, e.target.files[0] || null)
                  }
                />
                <label htmlFor={`file${index}`} className="upload-label">
                  {renderPreview(foto)}
                </label>
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

            <div className="campo">
              <label>Talla:</label>
              <input
                type="text"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                required
              />
            </div>

            <div className="campo tipo-publicacion">
              <label>Tipo de publicación:</label>
              <button
                type="button"
                className={tipo === "Venta" ? "active" : ""}
                onClick={() => setTipo("Venta")}
              >
                VENTA
              </button>
              <button
                type="button"
                className={tipo === "Intercambio" ? "active" : ""}
                onClick={() => setTipo("Intercambio")}
              >
                INTERCAMBIO
              </button>
            </div>

            <div className="campo valor">
              <label>Valor:</label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>

            <div className="campo estado">
              <label>Estado:</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="Disponible">Disponible</option>
                <option value="No Disponible">No Disponible</option>
              </select>
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

          {mensaje && (
            <p style={{ marginTop: "1em", color: "green" }}>{mensaje}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgregarPublicacion;
=======
import React, { useState } from "react";
import "./AgregarPublicacion.css";

const AgregarPublicacion = () => {
  const [tipo, setTipo] = useState("");
  const [valoracion, setValoracion] = useState(0);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [talla, setTalla] = useState("");
  const [valor, setValor] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [mensaje, setMensaje] = useState("");

  // Estados para fotos
  const [fotos, setFotos] = useState([null, null, null, null]);

  const handleStarClick = (num) => {
    setValoracion(num);
  };

  const handleFotoChange = (index, file) => {
    const nuevasFotos = [...fotos];
    nuevasFotos[index] = file;
    setFotos(nuevasFotos);
  };

  // Enviar datos
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("descripcion", descripcion);
    formData.append("estado", estado);
    formData.append("tipo_publicacion", tipo);
    formData.append("fecha_publicacion", new Date().toISOString().slice(0, 10));
    formData.append("nombre", nombre);
    formData.append("descripcion_prenda", descripcion);
    formData.append("talla", talla);
    formData.append("valor", valor);
    formData.append("valoracion", valoracion);

    fotos.forEach((foto, i) => {
      if (foto) formData.append(`foto${i + 1}`, foto);
    });

    try {
      const response = await fetch("http://localhost:5000/publicar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMensaje(data.message || "Publicado correctamente ✅");
    } catch (error) {
      setMensaje("❌ Error al publicar");
      console.error(error);
    }
  };

  // Previsualización de imágenes
  const renderPreview = (file) => {
    if (!file) return <span className="upload-label">📤</span>;
    return (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="preview-img"
      />
    );
  };

  return (
    <div className="container">
      <h2 className="titulo">AGREGAR PRENDA</h2>
      <div className="contenido-central">
        {/* FOTOS */}
        <div className="fotos-lado-izquierdo">
          <p className="texto">Agregar fotos de la prenda.</p>
          <div className="fotos-grid">
            {fotos.map((foto, index) => (
              <div className="foto-cuadro" key={index}>
                <input
                  type="file"
                  id={`file${index}`}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) =>
                    handleFotoChange(index, e.target.files[0] || null)
                  }
                />
                <label htmlFor={`file${index}`} className="upload-label">
                  {renderPreview(foto)}
                </label>
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

            <div className="campo">
              <label>Talla:</label>
              <input
                type="text"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                required
              />
            </div>

            <div className="campo tipo-publicacion">
              <label>Tipo de publicación:</label>
              <button
                type="button"
                className={tipo === "Venta" ? "active" : ""}
                onClick={() => setTipo("Venta")}
              >
                VENTA
              </button>
              <button
                type="button"
                className={tipo === "Intercambio" ? "active" : ""}
                onClick={() => setTipo("Intercambio")}
              >
                INTERCAMBIO
              </button>
            </div>

            <div className="campo valor">
              <label>Valor:</label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>

            <div className="campo estado">
              <label>Estado:</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="Disponible">Disponible</option>
                <option value="No Disponible">No Disponible</option>
              </select>
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

          {mensaje && (
            <p style={{ marginTop: "1em", color: "green" }}>{mensaje}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgregarPublicacion;
>>>>>>> 1f8ce39 (Subiendo cambios (errores en editar_perfil.js))
