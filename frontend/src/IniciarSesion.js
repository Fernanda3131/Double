import React, { useState } from "react";
import "./IniciarSesion.css";

function IniciarSesion() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí puedes hacer la llamada al backend con fetch o axios
        fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        })
        .then((res) => {
            if (res.ok) {
            alert("Inicio de sesión exitoso");
            } else {
            alert("Usuario o contraseña incorrectos");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    return (
        <div>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
            <label>Usuario o Correo:</label><br />
            <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            /><br /><br />

            <label>Contraseña:</label><br />
            <input
            type="password"
            name="password"
            required
            minLength={3}
            maxLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br /><br />

            <button type="submit">Entrar</button>
        </form>
        </div>
    );
}

export default IniciarSesion;


