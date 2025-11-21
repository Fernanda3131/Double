import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import "./ListaDeDeseos.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function ListaDeDeseos() {
  const [deseos, setDeseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const idUsuario = localStorage.getItem("id_usuario");
    if (!idUsuario) {
      navigate("/iniciar_sesion");
      return;
    }
    fetch(`${BACKEND_URL}/deseos/usuario/${idUsuario}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeseos(data.deseos || []);
        } else {
          setDeseos([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setDeseos([]);
        setLoading(false);
      });
  }, [navigate]);

  const handleVerMas = (id_prenda) => {
    navigate(`/detalle_prenda/${id_prenda}`);
  };

  const handleQuitarDeseo = (id_publicacion) => {
    const idUsuario = localStorage.getItem("id_usuario");
    if (!idUsuario) return;
    fetch(`${BACKEND_URL}/deseos/quitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: idUsuario, id_publicacion })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeseos(deseos.filter((d) => d.id_publicacion !== id_publicacion));
        }
      });
  };

  const handleIrACatalogo = () => {
    navigate("/");
  };

  const formatearPrecio = (valor) => {
    if (!valor) return "Intercambio";
    return `$${parseInt(valor).toLocaleString('es-CO')} COP`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="lista-deseos-main">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando tus favoritos...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="lista-deseos-main">
        <div className="lista-deseos-header">
          <h1 className="lista-deseos-titulo">Lista de Deseos</h1>
          <p className="lista-deseos-subtitle">
            Tus prendas favoritas guardadas para después
          </p>
          <div className="lista-deseos-stats">
            <span className="stats-text">
              {deseos.length} {deseos.length === 1 ? 'prenda favorita' : 'prendas favoritas'}
            </span>
          </div>
        </div>

        {deseos.length === 0 ? (
          <div className="lista-deseos-vacia">
            <h3 className="empty-title">Tu lista está vacía</h3>
            <p className="empty-subtitle">
              Explora nuestro catálogo y guarda tus prendas favoritas
            </p>
            <button className="empty-action" onClick={handleIrACatalogo}>
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="lista-deseos-lista">
            {deseos.map((prod) => (
              <div key={prod.id_publicacion} className="lista-deseos-item">
                <div className="item-content">
                  <img
                    src={
                      prod.foto_url || 
                      `${BACKEND_URL}/uploads/${prod.foto}` ||
                      "/LOGO.png"
                    }
                    alt={prod.nombre_prenda}
                    className="lista-deseos-img"
                    onError={(e) => {
                      e.target.src = "/LOGO.png";
                    }}
                  />
                  <div className="lista-deseos-info">
                    <h3 className="lista-deseos-nombre">{prod.nombre_prenda}</h3>
                    <p className="lista-deseos-precio">
                      {formatearPrecio(prod.valor)}
                    </p>
                    <div className="item-actions">
                      <button
                        className="lista-deseos-vermas"
                        onClick={() => handleVerMas(prod.id_prenda)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="lista-deseos-corazon"
                        onClick={() => handleQuitarDeseo(prod.id_publicacion)}
                        title="Quitar de favoritos"
                      >
                        {/* Corazón relleno igual que en los cards de publicación */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#a07e44" stroke="#a07e44" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="volver-btn"
          onClick={() => navigate(-1)}
          title="Volver"
        >
          ←
        </button>
      </div>
    </>
  );
}
