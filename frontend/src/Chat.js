import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "./hooks/useNotificaciones";
import "./Chat.css";

function Chat({ id_destinatario, destinatarioInfo, onBack, mensajeInicial }) {
  const navigate = useNavigate();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [destinatario, setDestinatario] = useState(destinatarioInfo || null);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const [mensajeInicialEnviado, setMensajeInicialEnviado] = useState(false);
  const [primeraVez, setPrimeraVez] = useState(true);
  const { marcarComoLeidos, cargarNoLeidos } = useNotificaciones();

  // Referencias para scroll automático
  const mensajesEndRef = useRef(null);
  const mensajesContainerRef = useRef(null);

  const BACKEND_URL = "http://localhost:5000";
  const id_remitente = localStorage.getItem("id_usuario");

  // Scroll al final de los mensajes
  const scrollToBottom = () => {
    if (primeraVez) {
      // Primera carga: scroll instantáneo sin animación
      mensajesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setPrimeraVez(false);
    } else {
      // Mensajes nuevos: scroll suave
      mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Cargar información del destinatario si no está completa
  useEffect(() => {
    if ((!destinatario || !destinatario.foto_usuario || !destinatario.username || destinatario.foto_usuario === 'foto') && id_destinatario) {
      fetch(`${BACKEND_URL}/api/perfil_usuario/${id_destinatario}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.perfil) {
            const fotoUsuario = data.perfil.foto_usuario || data.perfil.foto;
            // Validar que la foto no sea solo la palabra "foto"
            const fotoValida = fotoUsuario && fotoUsuario !== 'foto' && fotoUsuario !== '' ? fotoUsuario : null;
            
            setDestinatario({
              id_usuario: id_destinatario,
              foto_usuario: fotoValida,
              username: data.perfil.username_usuario || data.perfil.username || "Usuario",
              nombre_completo:
                data.perfil.PrimerNombre && data.perfil.SegundoNombre
                  ? `${data.perfil.PrimerNombre} ${data.perfil.SegundoNombre}`.trim()
                  : data.perfil.username_usuario || data.perfil.username || "Usuario",
              email: data.perfil.email || null,
            });
          }
        })
        .catch((err) => console.error("Error al cargar destinatario:", err));
    }
  }, [id_destinatario]);

  // Cargar mensajes entre los usuarios
  useEffect(() => {
    if (id_remitente && id_destinatario) {
      cargarMensajes();
      marcarComoLeidos(id_destinatario);

      const interval = setInterval(() => {
        cargarMensajes();
        marcarComoLeidos(id_destinatario);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [id_remitente, id_destinatario]);

  // Enviar mensaje inicial automáticamente si existe
  useEffect(() => {
    if (mensajeInicial && !mensajeInicialEnviado && id_remitente && id_destinatario && mensajes.length >= 0) {
      // Esperar un poco para asegurar que los mensajes se cargaron
      const timer = setTimeout(() => {
        enviarMensajeAutomatico(mensajeInicial);
        setMensajeInicialEnviado(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [mensajeInicial, mensajeInicialEnviado, id_remitente, id_destinatario, mensajes]);

  // Actualizar tiempo cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll automático al cargar mensajes o al enviar uno nuevo
  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Cargar mensajes
  const cargarMensajes = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat/mensajes?id_remitente=${id_remitente}&id_destinatario=${id_destinatario}`
      );
      const data = await response.json();

      const mensajesOrdenados = data.sort((a, b) => {
        const fechaA = new Date(a.fecha_envio);
        const fechaB = new Date(b.fecha_envio);
        return fechaA - fechaB;
      });

      setMensajes(mensajesOrdenados);
      setTiempoActual(new Date());
      await marcarComoLeidos(id_destinatario);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/chat/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_remitente: parseInt(id_remitente),
          id_destinatario: parseInt(id_destinatario),
          mensaje: nuevoMensaje,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNuevoMensaje("");
        setTimeout(() => {
          const mensajesOrdenados = data.mensajes.sort((a, b) => {
            const fechaA = new Date(a.fecha_envio);
            const fechaB = new Date(b.fecha_envio);
            return fechaA - fechaB;
          });
          setMensajes(mensajesOrdenados);
          setTiempoActual(new Date());
          cargarNoLeidos();
          setTimeout(scrollToBottom, 100);
        }, 50);
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  // Enviar mensaje automático (para mensaje inicial)
  const enviarMensajeAutomatico = async (mensaje) => {
    if (!mensaje.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/chat/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_remitente: parseInt(id_remitente),
          id_destinatario: parseInt(id_destinatario),
          mensaje: mensaje,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          const mensajesOrdenados = data.mensajes.sort((a, b) => {
            const fechaA = new Date(a.fecha_envio);
            const fechaB = new Date(b.fecha_envio);
            return fechaA - fechaB;
          });
          setMensajes(mensajesOrdenados);
          setTiempoActual(new Date());
          cargarNoLeidos();
          setTimeout(scrollToBottom, 100);
        }, 50);
      }
    } catch (err) {
      console.error("Error al enviar mensaje automático:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      enviarMensaje();
    }
  };

  // Formatear tiempo de los mensajes
  const formatearTiempo = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = tiempoActual;
    const diferencia = ahora - fecha;

    // console.log(`Debug - Fecha: ${fecha}, Ahora: ${ahora}, Diferencia: ${Math.floor(diferencia/1000)}s`);

    if (diferencia < 30000) {
      return "ahora";
    }

    if (fecha.toDateString() === ahora.toDateString()) {
      return fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return fecha.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Convertir URLs en enlaces clickeables
  const renderizarMensajeConLinks = (texto) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const partes = texto.split(urlRegex);
    
    return partes.map((parte, index) => {
      if (parte.match(urlRegex)) {
        // Verificar si es un link interno (mismo dominio o localhost)
        const esLinkInterno = 
          parte.includes(window.location.origin) || 
          parte.includes('localhost:3000') ||
          parte.includes('localhost') ||
          parte.startsWith('/');
        
        if (esLinkInterno) {
          // Extraer la ruta relativa
          let ruta = parte
            .replace(window.location.origin, '')
            .replace('http://localhost:3000', '')
            .replace('http://localhost', '');
          
          // Asegurarse de que la ruta comience con /
          if (!ruta.startsWith('/')) {
            ruta = '/' + ruta;
          }
          
          return (
            <a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log('Navegando a:', ruta);
                
                // Cerrar el modal primero
                if (window.cerrarChatModal) {
                  window.cerrarChatModal();
                }
                
                // Navegar después de un pequeño delay para asegurar que el modal se cierre
                setTimeout(() => {
                  navigate(ruta);
                }, 100);
              }}
              style={{
                color: "#1e90ff",
                textDecoration: "underline",
                wordBreak: "break-all",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Ver publicación 🔗
            </a>
          );
        }
        
        // Link externo
        return (
          <a
            key={index}
            href={parte}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1e90ff",
              textDecoration: "underline",
              wordBreak: "break-all"
            }}
          >
            {parte}
          </a>
        );
      }
      return <span key={index}>{parte}</span>;
    });
  };

  return (
    <div
      className="chat-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {onBack !== undefined && (
        <button
          className="back-button"
          onClick={onBack}
          style={{
            width: "100%",
            background: "#a07e44",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 0",
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "8px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ← Mensajes
        </button>
      )}

      <div
        className="chat-header"
        style={{ width: "100%", boxSizing: "border-box", flexShrink: 0 }}
      >
        {destinatario ? (
          <div
            className="destinatario-info"
            style={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <img
              src={
                destinatario.foto_usuario
                  ? `${BACKEND_URL}/uploads/${destinatario.foto_usuario}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(destinatario.username || 'Usuario')}&background=95742d&color=fff`
              }
              alt="Foto del usuario"
              className="destinatario-foto"
              style={{ width: 48, height: 48, borderRadius: "50%", marginRight: 12 }}
              onError={(e) => {
                console.error("Error cargando foto de usuario en chat:", e.target.src);
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(destinatario.username || 'Usuario')}&background=95742d&color=fff`;
              }}
            />
            <h3 style={{ fontWeight: 700, fontSize: "1.2rem", margin: 0 }}>
              {((destinatario.username || destinatario.nombre_completo || "Usuario").charAt(0).toUpperCase() + (destinatario.username || destinatario.nombre_completo || "Usuario").slice(1).toLowerCase())}
            </h3>
          </div>
        ) : (
          <div style={{ padding: "10px", color: "#666" }}>Cargando...</div>
        )}
      </div>

      <div
        className="mensajes-container"
        ref={mensajesContainerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          marginBottom: "8px",
          background: "transparent",
        }}
      >
        {mensajes.length > 0 ? (
          mensajes.map((mensaje, index) => (
            <div
              key={index}
              className={`mensaje ${
                mensaje.id_remitente === parseInt(id_remitente)
                  ? "propio"
                  : "ajeno"
              }`}
            >
              <div className="mensaje-contenido">
                <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {renderizarMensajeConLinks(mensaje.mensaje || mensaje.contenido)}
                </p>
                <div className="mensaje-meta">
                  <small className="mensaje-fecha">
                    {formatearTiempo(mensaje.fecha_envio)}
                  </small>
                  {mensaje.id_remitente === parseInt(id_remitente) && (
                    <span className="estado-lectura">
                      {mensaje.leido ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="sin-mensajes">
            <p>No hay mensajes aún. ¡Inicia la conversación!</p>
          </div>
        )}
        <div ref={mensajesEndRef} />
      </div>

      <div
        className="mensaje-input-container"
        style={{
          display: "flex",
          gap: "10px",
          padding: "15px 0",
          borderTop: "2px solid #f0f0f0",
          background: "transparent",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="mensaje-input"
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "2px solid #e0e0e0",
            borderRadius: "25px",
            fontSize: "14px",
            outline: "none",
            background: "#fff",
          }}
        />
        <button
          onClick={enviarMensaje}
          className="enviar-button"
          style={{
            background: "#95742d",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            minWidth: "80px",
          }}
          disabled={!nuevoMensaje.trim()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;
