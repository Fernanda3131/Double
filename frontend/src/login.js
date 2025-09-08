import React, { useState } from "react";
import "./IniciarSesion.css";

function IniciarSesion() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    fetch("/api/iniciar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: usuario, password }),
    })
      .then((res) => res.json()) // Convertimos la respuesta a JSON
      .then((data) => {
        if (data.mensaje === "OK") {
          // Login exitoso, puedes redirigir o mostrar mensaje
          window.location.href = "/admin"; // O la ruta que quieras
        } else {
          // Si no es OK, mostrar error
          setErrorMsg(data.error || "Usuario o contraseña incorrectos");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setErrorMsg("Error en la conexión");
      });
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Usuario o Correo:</label><br />
        <input
          type="text"
          required
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        /><br /><br />

        <label>Contraseña:</label><br />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default IniciarSesion;
