import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatModal from "./ChatModal"; // 🔸Comentado temporalmente
import BotonPagar from "./BotonPagar";
import "./DetallePrenda.css";

function DetallePrenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChatModal, setOpenChatModal] = useState(false);
  // Carousel hooks SIEMPRE al inicio
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchDetalle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/detalle_prenda/${id}`); // ✅ corregido
        if (!res.ok) throw new Error("Error al obtener detalle de la prenda");

        const data = await res.json();
        const detalle = data.prenda && data.prenda.length > 0 ? data.prenda[0] : null;
        setPrenda(detalle);
      } catch (err) {
        setError("No se pudo cargar la prenda");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (loading) return <p>Cargando detalle...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!prenda) return <p>No se encontró la prenda.</p>;

  // ✅ Mostrar solo las fotos que existan (sin cuadros vacíos)
  const fotos = [prenda.foto, prenda.foto2, prenda.foto3, prenda.foto4].filter(Boolean);
  const hasMultipleFotos = fotos.length > 1;
  // Eliminar flechas, solo click en imagen para avanzar
  const goToNext = () => setCurrent((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));

  // Obtener el id_usuario actual desde localStorage
  const miIdUsuario = localStorage.getItem("id_usuario");

  return (
    <div className="detalle-prenda-container minimal">
      <div className="detalle-prenda-main-row">
        {/* IZQUIERDA: Foto o carrusel */}
        <div className="detalle-prenda-foto-col">
          {hasMultipleFotos ? (
            <div className="detalle-prenda-carrusel">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  className="detalle-carrusel-flechita izq"
                  onClick={() => setCurrent((prev) => (prev === 0 ? fotos.length - 1 : prev - 1))}
                  aria-label="Anterior"
                  type="button"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5L8 11L14 17" stroke="#a07e44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <img
                  src={`http://localhost:5000/uploads/${fotos[current]}`}
                  alt={`Foto ${current + 1}`}
                  className="detalle-prenda-foto-grande"
                />
                <button
                  className="detalle-carrusel-flechita der"
                  onClick={goToNext}
                  aria-label="Siguiente"
                  type="button"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5L14 11L8 17" stroke="#a07e44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="detalle-prenda-carrusel-indicador">
                {fotos.map((_, idx) => (
                  <span
                    key={idx}
                    className={"detalle-carrusel-dot" + (idx === current ? " active" : "")}
                  />
                ))}
              </div>
            </div>
          ) : (
            <img
              src={`http://localhost:5000/uploads/${fotos[0]}`}
              alt="Foto principal"
              className="detalle-prenda-foto-grande"
            />
          )}
        </div>
        {/* DERECHA: Información */}
        <div className="detalle-prenda-info-col">
          <div className="detalle-prenda-titulo-minimal">{prenda.nombre}</div>
          <div className="detalle-prenda-tipo-minimal">{prenda.tipo_publicacion}</div>
          <button
            className="detalle-prenda-ver-perfil-btn styled"
            onClick={() => {
              if (miIdUsuario && prenda.id_usuario && parseInt(miIdUsuario) === parseInt(prenda.id_usuario)) {
                navigate("/MiPerfil");
              } else {
                navigate(`/perfil/${prenda.id_usuario}`);
              }
            }}
          >
            Ver perfil de {prenda.username}
          </button>
          <div className="detalle-prenda-precio-minimal">${prenda.valor}</div>
          <div className="detalle-prenda-descripcion-minimal">{prenda.descripcion}</div>
          <div className="detalle-prenda-talla-minimal">Talla: {prenda.talla}</div>
          <div className="detalle-prenda-botones-minimal">
            <button
              className="detalle-prenda-mensaje-btn-publicacion styled"
              onClick={() => setOpenChatModal(true)}
            >
              MENSAJE
            </button>
            {prenda.tipo_publicacion?.toLowerCase() === 'venta' && prenda.valor && (
              <BotonPagar 
                amount={parseFloat(prenda.valor)}
                id_publicacion={prenda.id_publicacion || id}
                descripcion={`Compra de ${prenda.nombre}`}
                className="small"
              />
            )}
          </div>
          {openChatModal && (
            <ChatModal
              open={openChatModal}
              onClose={() => setOpenChatModal(false)}
              id_destinatario={prenda.id_usuario}
              destinatarioInfo={{
                id_usuario: prenda.id_usuario,
                username: prenda.username,
                foto_usuario: prenda.foto_usuario || null,
                nombre_completo: prenda.nombre || prenda.username,
                email: prenda.email || null,
              }}
            />
          )}
        </div>
      </div>
      <button
        className="volver-btn"
        title="Volver al Catálogo"
        onClick={() => navigate("/catalogo")}
      >
        ←
      </button>
    </div>
  );
}

export default DetallePrenda;