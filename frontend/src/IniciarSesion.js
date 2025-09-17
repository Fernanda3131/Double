import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IniciarSesion.css";

function IniciarSesion({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [bloqueoRestante, setBloqueoRestante] = useState(null);
  const bloqueoTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bloqueoRestante === null) return;
    if (bloqueoRestante <= 0) {
      setBloqueoRestante(null);
      setMensaje("");
      return;
    }
    bloqueoTimer.current = setTimeout(() => {
      setBloqueoRestante((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(bloqueoTimer.current);
  }, [bloqueoRestante]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://localhost:5000/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.status === 200 && result.mensaje === "OK") {
        // Guardar info del usuario
        localStorage.setItem("id_usuario", result.id_usuario);
        localStorage.setItem("token", "token_simulado");
        localStorage.setItem("username", result.username);
        localStorage.setItem("foto_usuario", result.foto);
        localStorage.setItem("id_rol", result.id_rol); // Guardar el rol si viene del backend

        setIsLoggedIn(true);
        setMensaje("✅ Inicio de sesión exitoso");
        // Redirección usando useNavigate después de login exitoso
        setTimeout(() => {
          if (result.id_rol === 1 || result.id_rol === "1") {
            navigate("/AdminDashboard");
          } else {
            navigate("/Catalogo");
          }
        }, 100);
      } else if (response.status === 401) {
        setMensaje("⚠ Usuario o contraseña incorrectos");
      } else if (response.status === 403) {
        if (result.bloqueo_restante) {
          setBloqueoRestante(result.bloqueo_restante);
          setMensaje(`⚠ ${result.error}. Intenta de nuevo en ${Math.ceil(result.bloqueo_restante/60)} min.`);
        } else {
          setMensaje(`⚠ ${result.error}`);
        }
      } else {
        setMensaje("⚠ Ocurrió un error inesperado");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("⚠ Error en la conexión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-side login-logo">
          <h2>Double Π</h2>
          <img src="/LOGO.png" alt="Logo" />
        </div>

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
              {bloqueoRestante !== null && bloqueoRestante > 0 && (
                <span style={{ display: "block", marginTop: 8 }}>
                  Espera {Math.floor(bloqueoRestante/60)}:{String(bloqueoRestante%60).padStart(2, '0')} para volver a intentar.
                </span>
              )}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>* Digite su correo o username:</label>
              <input
                type="text"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label> * Digite su contraseña:</label>
              <input
                type="password"
                name="password"
                required
                minLength={3}
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
