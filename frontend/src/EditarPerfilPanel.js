import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditarPerfilPanel.module.css";


export default function EditarPerfilPanel({ open, onClose, perfil }) {
  const navigate = useNavigate();
  const [talla, setTalla] = useState(perfil?.talla || "");
  const [contrasena, setContrasena] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(perfil?.foto_usuario || "");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const fileInputRef = useRef();
  const BACKEND_URL = "http://localhost:5000";

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);
    const formData = new FormData();
    if (talla.trim() !== "") formData.append("talla_usuario", talla.trim());
    if (contrasena.trim() !== "") formData.append("contrasena", contrasena.trim());
    if (foto) formData.append("foto_usuario", foto);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/actualizar_perfil`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.foto) {
          // Extraer solo el nombre de archivo (sin ruta ni slash inicial)
          let nombreFoto = data.foto;
          if (nombreFoto.startsWith("/")) nombreFoto = nombreFoto.slice(1);
          if (nombreFoto.includes("/")) nombreFoto = nombreFoto.split("/").pop();
          localStorage.setItem("foto_usuario", nombreFoto);
          // Log para depuración
          if (process.env.NODE_ENV !== 'production') {
            console.log("[EditarPerfilPanel] Guardando foto_usuario en localStorage:", nombreFoto);
          }
          // Disparar evento personalizado para forzar actualización inmediata del header
          window.dispatchEvent(new Event("foto_usuario_actualizada"));
        }
        setMensaje("✅ Perfil actualizado correctamente");
        setContrasena("");
        setTimeout(() => {
          setMensaje("");
          onClose();
          navigate("/MiPerfil?refresh=" + Date.now());
        }, 1200);
      } else {
        setMensaje("❌ Error al actualizar: " + (data.error || "Intenta de nuevo"));
      }
    } catch (error) {
      setMensaje("❌ No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.overlay}
      style={{ display: open ? "flex" : "none" }}
      onClick={handleOverlayClick}
    >
      <aside className={`${styles.panel} ${open ? styles.open : ""}`}>
        <div className={styles.topbar}>
          <span className={styles.title}>Editar perfil</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose} title="Cerrar">×</button>
        <form className={styles.form} onSubmit={handleSave} autoComplete="off">
          <div className={styles.inputGroup}>
            <label className={styles.label}>Foto de perfil</label>
            {preview && (
              <img src={preview} alt="Preview" className={styles.imagePreview} />
            )}
            <input
              className={styles.fileInput}
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFotoChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Talla</label>
            <input
              className={styles.input}
              type="text"
              value={talla}
              onChange={e => setTalla(e.target.value)}
              placeholder="Talla"
              maxLength={12}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña nueva</label>
            <input
              className={styles.input}
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              placeholder="Deja vacío si no quieres cambiarla"
              autoComplete="new-password"
            />
          </div>
          <button className={styles.saveBtn} type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
          {mensaje && (
            <div style={{marginTop: 18, textAlign: 'center', color: mensaje.startsWith('✅') ? '#4a7c3a' : '#a05c3a', fontWeight: 600}}>{mensaje}</div>
          )}
        </form>
      </aside>
    </div>
  );
}