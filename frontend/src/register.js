import React, { useState } from "react";
import "./register.css";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    contrasena: "",
    talla: "",
    fecha_nacimiento: "",
    foto: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        setMensaje("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      } else {
        setMensaje("⚠️ " + result.message);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("❌ Error en el servidor.");
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <img src="/logo.png" alt="Logo" className="register-logo" />
      </header>

      <main className="register-main">
        <h2>Crea una cuenta nueva</h2>
        <p>¿Ya te has registrado? Ingresar</p>

        {mensaje && (
          <p style={{ textAlign: "center", color: "red" }}>{mensaje}</p>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="talla">Talla</label>
            <select
              id="talla"
              name="talla"
              value={formData.talla}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu talla</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="Petite">Petite</option>
              <option value="Plus Size">Plus Size</option>
            </select>
          </div>

          <div>
            <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="foto">Foto de perfil</label>
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>
      </main>
    </div>
  );
}

export default Register;
