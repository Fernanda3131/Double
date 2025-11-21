// ChatList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "./hooks/useNotificaciones";
import Chat from "./Chat";
import "./ChatList.css";

function ChatList({ onClose }) {
  const navigate = useNavigate();
  const [conversaciones, setConversaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState(null);
  const { cargarNoLeidos } = useNotificaciones();

  const BACKEND_URL = "http://localhost:5000";
  const id_usuario = localStorage.getItem("id_usuario");

  // Función para cerrar el chat
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // Volver a la página anterior
    }
  };

  // Cargar conversaciones existentes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (id_usuario) {
      cargarConversaciones();
      cargarUsuarios();
    }
  }, [id_usuario]);

  // Actualizar tiempo cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => setTiempoActual(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const cargarConversaciones = () => {
    fetch(`${BACKEND_URL}/chat/conversaciones_mejoradas/${id_usuario}`)
      .then((res) => res.json())
      .then((data) => {
        // Filtrar para no mostrar conversaciones con uno mismo
        const conversacionesFiltradas = data.filter(
          (conv) => conv.id_usuario !== parseInt(id_usuario)
        );
        setConversaciones(conversacionesFiltradas);
        setLoading(false);
        setTiempoActual(new Date());
        cargarNoLeidos();
      })
      .catch((err) => {
        console.error("Error al cargar conversaciones:", err);
        setLoading(false);
      });
  };

  const cargarUsuarios = () => {
    fetch(`${BACKEND_URL}/api/usuarios_disponibles`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.usuarios) {
          const otrosUsuarios = data.usuarios.filter(
            (u) => u.id_usuario !== parseInt(id_usuario)
          );
          setUsuarios(otrosUsuarios);
        }
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  const iniciarNuevoChat = (destinatario) => {
    setShowNewChat(false);
    
    // Validar que la foto sea válida
    const fotoValida = destinatario.foto && destinatario.foto !== 'foto' && destinatario.foto !== '' 
      ? destinatario.foto 
      : null;
    
    setConversacionSeleccionada({
      id_usuario: destinatario.id_usuario,
      username: destinatario.username,
      email: destinatario.email,
      foto_usuario: fotoValida,
      nombre_completo:
        destinatario.primer_nombre && destinatario.primer_apellido
          ? `${destinatario.primer_nombre} ${destinatario.primer_apellido}`
          : destinatario.username,
    });
  };

  const formatearFecha = (fecha) => {
    const ahora = tiempoActual;
    const fechaMsg = new Date(fecha);
    const diffMs = ahora - fechaMsg;
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    console.log(`Debug ChatList - Fecha: ${fechaMsg}, Ahora: ${ahora}, Diff minutos: ${diffMinutos}`);

    if (diffMinutos < 1) return "Ahora";
    if (diffMinutos < 60) return `${diffMinutos}min`;
    if (diffHoras < 24)
      return fechaMsg.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    if (diffDias < 7) {
      const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      return `${dias[fechaMsg.getDay()]} ${fechaMsg.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return fechaMsg.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h2>💬 Mensajes</h2>
        </div>
        <div className="loading">Cargando conversaciones...</div>
      </div>
    );
  }

  // Mostrar chat si se selecciona una conversación
  if (conversacionSeleccionada) {
    return (
      <Chat
        id_destinatario={conversacionSeleccionada.id_usuario}
        destinatarioInfo={conversacionSeleccionada}
        onBack={() => {
          setConversacionSeleccionada(null);
          cargarConversaciones(); // Refresca la lista y los no leídos al volver
        }}
      />
    );
  }

  // Mostrar lista de usuarios para nuevo chat
  if (showNewChat) {
    return (
      <div className="chat-list-container">
        <div className="chat-list-header">
          <button 
            className="back-button" 
            onClick={() => setShowNewChat(false)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            ← Mensajes
          </button>
          <h2>✏️ Nuevo Chat</h2>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="conversaciones-list">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id_usuario}
              className="conversacion-item"
              onClick={() => iniciarNuevoChat(usuario)}
            >
              <img
                src={
                  usuario.foto
                    ? `${BACKEND_URL}/uploads/${usuario.foto}`
                    : "/default-user.png"
                }
                alt={usuario.username}
                className="conversacion-foto"
              />
              <div className="conversacion-info">
                <div className="conversacion-header">
                  <span className="conversacion-nombre">{usuario.username.charAt(0).toUpperCase() + usuario.username.slice(1).toLowerCase()}</span>
                </div>
                <p className="ultimo-mensaje">{usuario.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>💬 Mensajes</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="new-chat-btn" onClick={() => setShowNewChat(!showNewChat)}>
            ✏
          </button>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="conversaciones-list">
        {conversaciones.length > 0 ? (
          conversaciones.map((conv) => {
            // Validar que la foto sea válida
            const fotoValida = conv.foto_usuario && conv.foto_usuario !== 'foto' && conv.foto_usuario !== '' 
              ? conv.foto_usuario 
              : null;
            
            return (
              <div
                key={conv.id_usuario}
                className="conversacion-item"
                onClick={() =>
                  setConversacionSeleccionada({
                    id_usuario: conv.id_usuario,
                    username: conv.username,
                    email: conv.email,
                    foto_usuario: fotoValida,
                    nombre_completo: conv.nombre_completo || conv.username,
                  })
                }
              >
                <img
                  src={
                    fotoValida
                      ? `${BACKEND_URL}/uploads/${fotoValida}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.username || 'U')}&background=95742d&color=fff`
                  }
                  alt={conv.username}
                  className="conversacion-foto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.username || 'U')}&background=95742d&color=fff`;
                  }}
                />
                <div className="conversacion-info">
                <div className="conversacion-header">
                  <span className="conversacion-nombre">{conv.username.charAt(0).toUpperCase() + conv.username.slice(1).toLowerCase()}</span>
                  <div className="conversacion-meta">
                    <span className="conversacion-tiempo">
                      {formatearFecha(conv.fecha_ultimo)}
                    </span>
                    {conv.mensajes_no_leidos > 0 && (
                      <span className="mensajes-no-leidos-badge">
                        {conv.mensajes_no_leidos}
                      </span>
                    )}
                  </div>
                </div>
                <p
                  className={`ultimo-mensaje ${
                    conv.mensajes_no_leidos > 0 ? "no-leido" : ""
                  }`}
                >
                  {conv.ultimo_mensaje}
                </p>
              </div>
            </div>
            );
          })
        ) : (
          <div className="sin-conversaciones">
            <div className="sin-conversaciones-icon">💬</div>
            <h3>No tienes conversaciones</h3>
            <p>Inicia un nuevo chat haciendo clic en el botón de arriba</p>
            <button className="start-chat-btn" onClick={() => setShowNewChat(true)}>
              Iniciar Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;
