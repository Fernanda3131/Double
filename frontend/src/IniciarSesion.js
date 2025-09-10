import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IniciarSesion.css";

function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); // Para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); // limpiar mensaje

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 mantiene cookies si usas sesión
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.mensaje === "OK")) {
        // guardar token si viene del backend
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        setMensaje("✅ Inicio de sesión exitoso");
        navigate("/"); // redirige al home
      } else {
        setMensaje("⚠️ " + (result.message || result.error || "Usuario o contraseña incorrectos"));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("❌ Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo + Texto */}
        <div className="login-side login-logo">
          <h2>Double Π</h2>
          <img src="/LOGO.png" alt="Logo" />
        </div>

        {/* Formulario */}
        <div className="login-side login-form">
          <h2>Iniciar Sesión</h2>

          {mensaje && (
            <p
              style={{
                textAlign: "center",
                color: mensaje.includes("✅") ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {mensaje}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Digite su correo o username:</label>
              <input
                type="text"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Digite su contraseña:</label>
              <input
                type="password"
                name="password"
                required
                minLength={3}
                maxLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot-password">
              <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>

          <div className="register-section">
            <p>
              ¿No tienes cuenta? <a href="/register">Regístrate</a>
            </p>
            <button className="gmail-button">Continuar con Gmail</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IniciarSesion;

