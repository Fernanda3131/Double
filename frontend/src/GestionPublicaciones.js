import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GestionPublicaciones.css";

function GestionPrendas() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Asegurarse de que el ID sea un número válido
  const idPublicacion = id && !isNaN(id) ? parseInt(id) : null;
  
  console.log("🆔 ID del parámetro:", id);
  console.log("🔢 ID parseado:", idPublicacion);

  const [form, setForm] = useState({
    id_prenda: "",
    nombre: "",
    username: "",
    id_usuario: "",
    descripcion: "",
    talla: "",
    tipo_publicacion: "",
    valor: "",
    foto: null,
    foto2: null,
    foto3: null,
    foto4: null,
    foto_actual: "",
    foto2_actual: "",
    foto3_actual: "",
    foto4_actual: "",
  });

  const [preview, setPreview] = useState({
    foto: null,
    foto2: null,
    foto3: null,
    foto4: null,
  });
  // Estado para el carrusel
  const fotosKeys = ["foto_actual", "foto2_actual", "foto3_actual", "foto4_actual"];
  const [currentFoto, setCurrentFoto] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // --- Cargar datos desde el backend ---
  useEffect(() => {
    if (!idPublicacion) {
      setError("ID de publicación inválido");
      setLoading(false);
      return;
    }

    const fetchPrenda = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔍 Cargando publicación ID:", idPublicacion);
        
        const url = `http://localhost:5000/api/prendas/${idPublicacion}`;
        console.log("📡 URL completa:", url);
        
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("📡 Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Error response:", errorText);
          throw new Error(`Error ${res.status}: No se pudo cargar la prenda`);
        }
        
        const data = await res.json();
        console.log("📦 Datos recibidos:", data);
        
        // Validar que tenemos datos
        if (!data || !data.id_prenda) {
          throw new Error("No se encontraron datos de la prenda");
        }
        
        // Los datos vienen directamente del endpoint
        const formData = {
          id_prenda: data.id_prenda || "",
          nombre: data.nombre_prenda || "",
          username: data.username || "",
          id_usuario: data.id_usuario || "",
          descripcion: data.descripcion_prenda || "",
          talla: data.talla || "",
          tipo_publicacion: data.tipo_publicacion || "",
          valor: data.valor || "",
          foto_actual: data.foto || "",
          foto2_actual: data.foto2 || "",
          foto3_actual: data.foto3 || "",
          foto4_actual: data.foto4 || "",
          foto: null,
          foto2: null,
          foto3: null,
          foto4: null,
        };
        
        console.log("💾 Guardando en form state:", formData);
        setForm(formData);
        
        setLoading(false);
        console.log("✅ Prenda cargada exitosamente");
      } catch (err) {
        console.error("❌ Error al cargar la prenda:", err);
        setError(err.message || "Error al cargar la prenda");
        setLoading(false);
      }
    };

    fetchPrenda();
  }, [idPublicacion]);

  // --- Manejar cambios ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Editar prenda ---
  const handleEditar = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    try {
      const res = await fetch(`http://localhost:5000/api/prendas/${idPublicacion}`, {
        method: "PUT",
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || "✅ Prenda editada correctamente");
        setTimeout(() => navigate("/MiPerfil"), 2000);
      } else {
        setError("Error: " + data.message);
      }
    } catch (err) {
      setError("Error del servidor: " + err.message);
    }
  };

  // --- Eliminar prenda ---
  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar esta prenda?")) return;
    setError(null);
    setSuccessMessage(null);
    
    try {
      const res = await fetch(`http://localhost:5000/api/prendas/${idPublicacion}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || "✅ Prenda eliminada correctamente");
        setTimeout(() => navigate("/MiPerfil"), 2000);
      } else {
        setError("Error al eliminar: " + data.message);
      }
    } catch (err) {
      setError("Error del servidor: " + err.message);
    }
  };

  // --- Render carrusel de fotos ---
  const fotosDisponibles = fotosKeys.map((k, i) => ({
    key: k.replace('_actual', ''),
    actual: form[k],
    previewUrl: preview[k.replace('_actual', '')],
    idx: i
  })).filter(f => f.actual || f.previewUrl);

  const handlePrevFoto = () => {
    setCurrentFoto((prev) => (prev === 0 ? fotosDisponibles.length - 1 : prev - 1));
  };
  const handleNextFoto = () => {
    setCurrentFoto((prev) => (prev === fotosDisponibles.length - 1 ? 0 : prev + 1));
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando prenda...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay
  if (error && !form.id_prenda) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="error-state" style={{
          background: '#ffe6e6',
          border: '2px solid #ff4444',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ff4444', marginBottom: '15px' }}>❌ Error</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => navigate("/MiPerfil")}
            style={{
              padding: '10px 20px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Volver a Mi Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div className="editar-container" style={{position: 'relative', flex: '1 0 auto'}}>
        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease'
          }}>
            {successMessage}
          </div>
        )}
        {error && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#f44336',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease'
          }}>
            {error}
          </div>
        )}
        <button
          className="back-arrow"
          type="button"
          title="Volver a mi perfil"
          onClick={() => navigate("/MiPerfil")}
          style={{position: 'absolute', top: 20, left: 20}}
        >
          ⟵
        </button>
        <div className="editar-panel">
          {/* Carrusel tipo tarjeta */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div style={{ position: 'relative', width: 260, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa', borderRadius: 32, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', marginBottom: 24 }}>
              {/* Flecha izquierda */}
              {fotosDisponibles.length > 1 && (
                <button onClick={handlePrevFoto} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, color: '#a07e44' }}>{'<'}</span>
                </button>
              )}
              {/* Imagen principal */}
              {fotosDisponibles.length > 0 ? (
                <img
                  src={fotosDisponibles[currentFoto].previewUrl ? fotosDisponibles[currentFoto].previewUrl : `http://localhost:5000/uploads/${fotosDisponibles[currentFoto].actual}`}
                  alt="prenda"
                  style={{ width: 220, height: 320, objectFit: 'cover', borderRadius: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                />
              ) : (
                <div className="foto-placeholder" style={{ width: 220, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 24, background: '#e0e0e0' }}>No hay foto</div>
              )}
              {/* Flecha derecha */}
              {fotosDisponibles.length > 1 && (
                <button onClick={handleNextFoto} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, color: '#a07e44' }}>{'>'}</span>
                </button>
              )}
            </div>
            {/* Dots del carrusel */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              {fotosDisponibles.map((f, idx) => (
                <span key={idx} style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: idx === currentFoto ? '#a07e44' : '#e0d3b8',
                  margin: '0 5px',
                  display: 'inline-block',
                  border: '2px solid #a07e44',
                  transition: 'background 0.2s, border 0.2s'
                }} />
              ))}
            </div>
            {/* Input para cambiar la foto actual */}
            {fotosDisponibles.length > 0 && (
              <input
                type="file"
                name={fotosDisponibles[currentFoto].key}
                accept="image/*"
                onChange={handleChange}
                style={{ marginTop: 16 }}
              />
            )}
          </div>

          <form className="editar-formulario" onSubmit={handleEditar}>
            <h2>EDITAR PRENDA</h2>
            
            {/* Debug info */}
            {console.log("🎨 Renderizando form con valores:", {
              nombre: form.nombre,
              descripcion: form.descripcion,
              talla: form.talla,
              valor: form.valor
            })}
            
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
            />
            <input
              type="text"
              name="talla"
              value={form.talla}
              onChange={handleChange}
              placeholder="Talla"
            />
            <input
              type="number"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="Valor"
            />

            {/* Campos ocultos */}
            <input type="hidden" name="foto_actual" value={form.foto_actual} />
            <input type="hidden" name="foto2_actual" value={form.foto2_actual} />
            <input type="hidden" name="foto3_actual" value={form.foto3_actual} />
            <input type="hidden" name="foto4_actual" value={form.foto4_actual} />

            <div className="editar-botones">
              <button type="submit" className="btn-accion">
                EDITAR
              </button>
              <button type="button" className="btn-accion" onClick={handleEliminar}>
                ELIMINAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GestionPrendas;