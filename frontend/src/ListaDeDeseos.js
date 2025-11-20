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
    const lista = JSON.parse(localStorage.getItem(`lista_deseos_${idUsuario}`)) || [];
    setDeseos(lista);
    setLoading(false);
  }, [navigate]);

  const handleVerMas = (id_prenda) => {
    navigate(`/detalle_prenda/${id_prenda}`);
  };

  const handleQuitarDeseo = (id_publicacion) => {
    const idUsuario = localStorage.getItem("id_usuario");
    const nuevaLista = deseos.filter((d) => d.id_publicacion !== id_publicacion);
    setDeseos(nuevaLista);
    localStorage.setItem(`lista_deseos_${idUsuario}`, JSON.stringify(nuevaLista));
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
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a07e44"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" />
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
