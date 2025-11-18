import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./perfiles.css";

const BACKEND_URL = "http://localhost:5000";

function MiPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0); // Valoración que el usuario puede dar
  const [hoveredStar, setHoveredStar] = useState(0); // Para hover effect
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Para determinar si es el perfil propio
  const [activeTab, setActiveTab] = useState("prendas");
  const [isEditMode, setIsEditMode] = useState(false); // Modo de edición
  const [editForm, setEditForm] = useState({}); // Formulario de edición
  const [editPhoto, setEditPhoto] = useState(null); // Nueva foto

  // Banner
  const [bannerHover, setBannerHover] = useState(false);
  const [bannerImage, setBannerImage] = useState(null); // Para previsualización

  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(URL.createObjectURL(file));
      // Subir al backend
      const formData = new FormData();
      formData.append('banner_usuario', file);
      const id_usuario = localStorage.getItem('id_usuario') || (perfil && perfil.id_usuario);
      formData.append('id_usuario', id_usuario);
      try {
        const response = await fetch(`${BACKEND_URL}/api/mi_perfil/actualizar_banner`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success && data.banner_usuario) {
          setPerfil(prev => ({ ...prev, banner_usuario: data.banner_usuario }));
          setBannerImage(null); // Limpiar previsualización local tras éxito
        } else {
          alert('Error al subir el banner: ' + (data.error || ''));
        }
      } catch (err) {
        alert('Error de red al subir el banner');
      }
    }
  };
  
  // Estados para la calculadora
  const [marca, setMarca] = useState(3);
  const [calidad, setCalidad] = useState(3);
  const [valorOriginal, setValorOriginal] = useState("");
  const [uso, setUso] = useState(3);
  const [minimo, setMinimo] = useState("");
  const [resultado, setResultado] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Iniciando carga del perfil...");
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      await cargarPerfilPorSesion();
    } catch (error) {
      console.error("❌ Error general al cargar perfil:", error);
      setError("Error al cargar el perfil");
      setLoading(false);
    }
  };

  const cargarPerfilPorId = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/perfil_usuario/${id}?t=${Date.now()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📥 Datos del perfil por ID:", data);
        procesarDatosPerfil(data);
      } else {
        throw new Error("Error al cargar el perfil por ID");
      }
    } catch (error) {
      console.error("❌ Error al cargar el perfil por ID:", error);
      setLoading(false);
    }
  };

  const cargarPerfilPorSesion = async () => {
    try {
      setLoading(true);
      
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const id_usuario = localStorage.getItem("id_usuario");

      console.log("🔍 Debug MiPerfil:");
      console.log("- Usuario:", user ? "✅ Encontrado" : "❌ No encontrado");
      console.log("- Token:", token);
      console.log("- ID Usuario:", id_usuario);

      // Verificación más permisiva - solo requiere token
      if (!token) {
        console.log("❌ No hay token, redirigiendo al login");
        setError("No hay sesión activa. Por favor, inicia sesión.");
        setLoading(false);
        setTimeout(() => navigate("/iniciar"), 0);
        return;
      }

      console.log("📡 Haciendo petición a:", `${BACKEND_URL}/api/perfil_usuario`);

      const response = await fetch(`${BACKEND_URL}/api/perfil_usuario?t=${Date.now()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      console.log("📡 Respuesta del servidor:", response.status);

      if (response.status === 401) {
        console.log("❌ Sesión expirada (401)");
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        setLoading(false);
        setTimeout(() => navigate("/iniciar"), 0);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("📥 Datos del perfil por sesión:", data);
        procesarDatosPerfil(data);
      } else {
        throw new Error(`Error del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error al cargar el perfil:", error);
      setError("Error al cargar el perfil: " + error.message);
      setLoading(false);
    }
  };

  const procesarDatosPerfil = (data) => {
    console.log("📝 Procesando datos del perfil:", data);
    if (data && data.perfil) {
      console.log("[DEBUG] perfil recibido:", data.perfil);
      console.log("[DEBUG] banner_usuario recibido:", data.perfil.banner_usuario);
      setPerfil(data.perfil);
      setRating(Number(data.perfil.promedio_valoracion) || 0);
      setIsOwnProfile(true); // Siempre es el perfil propio en MiPerfil
      setBannerImage(null); // Limpiar previsualización local al recargar perfil
      setLoading(false);
    } else {
      setError("No se pudieron cargar los datos del perfil");
      setLoading(false);
    }
  };

  // Función para manejar el clic en una estrella (simplificada - solo visual)
  const handleStarClick = (starValue) => {
    if (isOwnProfile) {
      return;
    }

    // Guardar la valoración en localStorage
    const userProfileKey = `rating_${localStorage.getItem('id_usuario')}`;
    localStorage.setItem(userProfileKey, starValue.toString());
    
    // Actualizar la valoración localmente
    setUserRating(starValue);
    
    // Calcular nuevo promedio aproximado (simulado)
    const newRating = Math.min(5, Math.max(1, (rating * 0.7 + starValue * 0.3))); // Mezcla ponderada
    setRating(newRating);
    
    alert(`Has valorado a este usuario con ${starValue} estrellas`);
  };

  // Función para renderizar estrellas interactivas
  const renderInteractiveStars = (currentRating) => {
    const displayRating = userRating > 0 ? userRating : Math.round(currentRating);
    
    return (
      <div className="interactive-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-interactive ${star <= (hoveredStar || displayRating) ? "filled" : "empty"}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => !isOwnProfile && setHoveredStar(star)}
            onMouseLeave={() => !isOwnProfile && setHoveredStar(0)}
            style={{
              cursor: isOwnProfile ? 'not-allowed' : 'pointer',
              opacity: isOwnProfile ? 0.5 : 1
            }}
          >
            {star <= (hoveredStar || displayRating) ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  const renderStars = (promedio) => {
    const rounded = Math.round(promedio);
    return (
      <span className="stars-text">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`star-black ${i <= rounded ? "active" : ""}`}>
            {i <= rounded ? "★" : "☆"}
          </span>
        ))}
      </span>
    );
  };

  // --- Funciones de edición ---
  const handleEditClick = () => {
    setEditForm({
      PrimerNombre: perfil.PrimerNombre || '',
      PrimerApellido: perfil.PrimerApellido || '',
      email_usuario: perfil.email_usuario || '',
      talla_usuario: perfil.talla_usuario || '',
      fecha_nacimiento: perfil.fecha_nacimiento || ''
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({});
    setEditPhoto(null);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPhoto(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Guardar cambios localmente sin tocar la BD
      const updatedPerfil = {
        ...perfil,
        PrimerNombre: editForm.PrimerNombre || perfil.PrimerNombre,
        PrimerApellido: editForm.PrimerApellido || perfil.PrimerApellido,
        email_usuario: editForm.email_usuario || perfil.email_usuario,
        talla_usuario: editForm.talla_usuario || perfil.talla_usuario,
        fecha_nacimiento: editForm.fecha_nacimiento || perfil.fecha_nacimiento
      };

      // Si hay nueva foto, crear URL local para mostrarla
      if (editPhoto) {
        updatedPerfil.foto_usuario_preview = URL.createObjectURL(editPhoto);
      }

      // Actualizar el estado local
      setPerfil(updatedPerfil);
      
      // Salir del modo edición
      setIsEditMode(false);
      setEditForm({});
      setEditPhoto(null);
      
      console.log('✅ Cambios guardados localmente:', updatedPerfil);
      alert('✅ Cambios guardados localmente');
      
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error);
      alert('❌ Error al guardar los cambios');
    }
  };

  // Función para calcular precio con la nueva fórmula mejorada
  const calcularPrecio = () => {
    if (!valorOriginal || valorOriginal <= 0) {
      alert("Por favor ingresa un valor original válido");
      return;
    }

    // ✨ NUEVA FÓRMULA MEJORADA - más realista y balanceada
    const valorBase = parseFloat(valorOriginal) * (0.40 + marca * 0.08);
    const ajusteCalidad = 1 + (calidad - 3) * 0.10;   // +/- según estado
    const ajusteUso = 1 - (uso - 1) * 0.07;           // baja lento

    const valorEstimado = valorBase * ajusteCalidad * ajusteUso;
    const minimoVal = parseFloat(minimo) || 0;
    const precioFinal = Math.max(valorEstimado, minimoVal * 0.7);

    setResultado(precioFinal);
  };

  const limpiarCalculadora = () => {
    setMarca(3);
    setCalidad(3);
    setValorOriginal("");
    setUso(3);
    setMinimo("");
    setResultado(null);
  };

  // Función para manejar click en prendas según el modo
  const handlePrendaClick = (prenda) => {
    console.log("🔍 Objeto prenda completo:", prenda);
    
    if (isOwnProfile) {
      // Si es tu propio perfil, ir a gestionar prenda usando id_publicacion
      const idPub = prenda.id_publicacion;
      console.log("📌 id_publicacion extraído:", idPub, "tipo:", typeof idPub);
      
      if (idPub) {
        const ruta = `/gestion_prendas/${idPub}`;
        console.log("🚀 Navegando a:", ruta);
        navigate(ruta);
      } else {
        console.error("❌ Prenda sin id_publicacion:", prenda);
        alert("Error: No se puede editar esta prenda (falta id_publicacion)");
      }
    } else {
      // Si es el perfil de otro usuario, ir a ver detalles
      navigate(`/detalle_prenda/${prenda.id_prenda}`);
    }
  };

  // Renderizado del componente
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message" style={{
          background: '#fee',
          color: '#c33',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px',
          border: '1px solid #fcc'
        }}>
          <h3>❌ Error al cargar el perfil</h3>
          <p>{error}</p>
          <button onClick={() => setTimeout(() => navigate("/iniciar"), 0)}>Iniciar Sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {perfil ? (
        <>

          {/* Hero Banner editable con hover */}
          <div 
            className="hero-banner-only"
            onMouseEnter={() => setBannerHover(true)}
            onMouseLeave={() => setBannerHover(false)}
            style={{ position: 'relative' }}
          >
            <div className="banner-overlay"></div>
            {/* Imagen de banner: previsualización local o desde backend */}
            {bannerImage ? (
              <img 
                src={bannerImage} 
                alt="Banner preview" 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1
                }}
              />
            ) : perfil.banner_usuario ? (
              <img
                src={`${BACKEND_URL}/uploads/${perfil.banner_usuario}?t=${Date.now()}`}
                alt="Banner usuario"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1
                }}
                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : null}

            {/* DEBUG: Mostrar valor real del banner y src final */}
            <div style={{position:'absolute', bottom:0, left:0, background:'#fffbe9', color:'#a07e44', fontSize:'0.9em', padding:'4px 10px', zIndex:99, borderRadius:'0 8px 0 0', opacity:0.95}}>
              <div><b>banner_usuario:</b> {String(perfil.banner_usuario || '(vacío)')}</div>
              <div><b>src:</b> {perfil.banner_usuario ? `${BACKEND_URL}/uploads/${perfil.banner_usuario}` : '(no src)'}</div>
            </div>
            {/* Botón para cargar imagen al hacer hover */}
            {bannerHover && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                background: 'rgba(255,255,255,0.85)',
                padding: 16,
                borderRadius: 12,
                boxShadow: '0 2px 8px #0002',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <label htmlFor="banner-upload" style={{ cursor: 'pointer', fontWeight: 600 }}>
                  📷 Cambiar imagen de banner
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleBannerImageChange}
                />
              </div>
            )}
          </div>

          {/* Three Column Layout */}
          <div className="profile-main-layout">
            {/* Left Sidebar with Avatar */}
            <div className="profile-left-sidebar">
              <div className="sidebar-avatar">
                {isEditMode ? (
                  <div className="avatar-edit-container">
                    <img 
                      src={
                        editPhoto 
                          ? URL.createObjectURL(editPhoto)
                          : perfil.foto_usuario_preview
                            ? perfil.foto_usuario_preview
                            : perfil.foto_usuario
                              ? `${BACKEND_URL}/uploads/${perfil.foto_usuario.replace(/^\/+/, '')}`
                              : `${BACKEND_URL}/uploads/default.jpg`
                      }
                      alt="Foto del usuario"
                      onError={(e) => {
                        e.target.onerror = null; // Prevenir bucle infinito
                        e.target.src = `${BACKEND_URL}/uploads/default.jpg`;
                      }}
                    />
                    <div className="avatar-edit-overlay">
                      <input
                        type="file"
                        id="photo-input"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                      />
                      <button 
                        className="avatar-edit-btn"
                        onClick={() => document.getElementById('photo-input').click()}
                      >
                        📷 Cambiar Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={
                      perfil.foto_usuario_preview
                        ? perfil.foto_usuario_preview
                        : perfil.foto_usuario
                          ? `${BACKEND_URL}/uploads/${perfil.foto_usuario.replace(/^\/+/, '')}`
                          : `${BACKEND_URL}/uploads/default.jpg`
                    }
                    alt="Foto del usuario"
                    onError={(e) => {
                      console.log("❌ Error cargando foto del usuario:", e.target.src);
                      console.log("📝 Datos del perfil foto_usuario:", perfil.foto_usuario);
                      e.target.onerror = null; // Prevenir bucle infinito
                      e.target.src = `${BACKEND_URL}/uploads/default.jpg`;
                    }}
                    onLoad={(e) => {
                      console.log("✅ Foto del usuario cargada correctamente:", e.target.src);
                    }}
                  />
                )}
              </div>
              
              <div className="sidebar-info">
                {/* Nombre editable */}
                {isEditMode ? (
                  <div className="edit-name-container">
                    <input
                      type="text"
                      className="edit-input name-input"
                      placeholder="Primer Nombre"
                      value={editForm.PrimerNombre || ''}
                      onChange={(e) => handleInputChange('PrimerNombre', e.target.value)}
                    />
                    <input
                      type="text"
                      className="edit-input name-input"
                      placeholder="Primer Apellido"
                      value={editForm.PrimerApellido || ''}
                      onChange={(e) => handleInputChange('PrimerApellido', e.target.value)}
                    />
                  </div>
                ) : (
                  <h2 className="sidebar-name">{perfil.PrimerNombre || 'Usuario'} {perfil.PrimerApellido || ''}</h2>
                )}
                
                <p className="sidebar-username">@{perfil.username_usuario || 'username'}</p>
                
                {/* Sistema de estrellas funcional después del username */}
                <div className="user-rating">
                  <div className="rating-stars-inline">
                    {renderInteractiveStars(Math.round(Number(rating) || 0))}
                  </div>
                  <span className="rating-score-inline">({(Number(rating) || 0).toFixed(1)})</span>
                  {isOwnProfile && <span className="own-profile-note"> - Tu valoración</span>}
                  {!isOwnProfile && userRating > 0 && <span className="rating-note"> - Has valorado: {userRating}★</span>}
                  {!isOwnProfile && userRating === 0 && <span className="rating-note"> - Haz clic para valorar</span>}
                </div>
                
                {/* Información de contacto estilo profesional */}
                <div className="sidebar-contact-info">
                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    {isEditMode ? (
                      <input
                        type="email"
                        className="edit-input contact-input"
                        placeholder="Correo electrónico"
                        value={editForm.email_usuario || ''}
                        onChange={(e) => handleInputChange('email_usuario', e.target.value)}
                      />
                    ) : (
                      <span className="contact-text">{perfil.email_usuario || "correo@ejemplo.com"}</span>
                    )}
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">👕</div>
                    {isEditMode ? (
                      <select
                        className="edit-input contact-input"
                        value={editForm.talla_usuario || ''}
                        onChange={(e) => handleInputChange('talla_usuario', e.target.value)}
                      >
                        <option value="">Seleccionar talla</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    ) : (
                      <span className="contact-text">Talla: {perfil.talla_usuario || "No especificada"}</span>
                    )}
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📅</div>
                    {isEditMode ? (
                      <input
                        type="date"
                        className="edit-input contact-input"
                        value={editForm.fecha_nacimiento ? editForm.fecha_nacimiento.split('T')[0] : ''}
                        onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                      />
                    ) : (
                      <span className="contact-text">
                        Miembro desde {(() => {
                          console.log('📅 creado_en completo:', perfil.creado_en);
                          
                          if (!perfil.creado_en) {
                            return "2024";
                          }
                          
                          try {
                            // Manejar formato MySQL: "2025-11-13 07:07:46"
                            let fechaStr = perfil.creado_en;
                            
                            // Si tiene espacio, tomar solo la fecha
                            if (fechaStr.includes(' ')) {
                              fechaStr = fechaStr.split(' ')[0];
                            }
                            
                            const fecha = new Date(fechaStr);
                            console.log('📅 fecha parseada:', fecha);
                            
                            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                                          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                            
                            const resultado = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
                            console.log('📅 resultado final:', resultado);
                            
                            return resultado;
                          } catch (error) {
                            console.error('❌ Error parseando fecha:', error);
                            return "2024";
                          }
                        })()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="sidebar-actions">
                  {isOwnProfile && isEditMode ? (
                    <>
                      <button className="sidebar-btn success" onClick={handleSaveChanges}>
                        <span>💾 Guardar Cambios</span>
                      </button>
                      <button className="sidebar-btn secondary" onClick={handleCancelEdit}>
                        <span>❌ Cancelar</span>
                      </button>
                    </>
                  ) : isOwnProfile ? (
                    <>
                      <button className="sidebar-btn primary" onClick={() => window.dispatchEvent(new CustomEvent('abrir-chat-flotante'))}>
                        <span>💬 Mis Mensajes</span>
                      </button>
                      <button className="sidebar-btn secondary" onClick={() => navigate("/editar")}>\
                        <span>✏ Editar Perfil</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="sidebar-btn primary" onClick={() => navigate("/chat")}>\
                        <span>💬 Enviar Mensaje</span>
                      </button>
                      <button className="sidebar-btn secondary" onClick={() => navigate("/editar")}>\
                        <span>✏ Ver Perfil</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="profile-center-content">
              {/* Timeline Navigation */}
              <div className={`timeline-nav ${activeTab}-active`}>
                <button 
                  className={`nav-tab ${activeTab === "prendas" ? "active" : ""}`}
                  onClick={() => setActiveTab("prendas")}
                >
                  Prendas {isEditMode && isOwnProfile && '✏'}
                </button>
                <button 
                  className={`nav-tab ${activeTab === "media" ? "active" : ""}`}
                  onClick={() => setActiveTab("media")}
                >
                  Galería
                </button>
              </div>

              {/* Indicador de modo edición */}
              {isEditMode && isOwnProfile && (
                <div className="edit-mode-indicator">
                  <span className="edit-mode-text">✏ Modo Edición Activo</span>
                  <span className="edit-mode-subtitle">Los cambios se guardan localmente</span>
                </div>
              )}

              {/* Content Area */}
              <div className="timeline-content">
                {activeTab === "prendas" && (
                  <div className="prendas-section">
                    {/* Mostrar las prendas reales del usuario */}
                    {perfil.prendas && perfil.prendas.length > 0 ? (
                      <div className="prendas-grid">
                        {perfil.prendas.map((prenda, index) => (
                          <div key={`${prenda.id_prenda}-${index}`} className="prenda-card">
                              <div className="prenda-image-container">
                                <img
                                  src={
                                    prenda.foto_prenda 
                                      ? `${BACKEND_URL}/uploads/${prenda.foto_prenda}`
                                      : `${BACKEND_URL}/uploads/default.jpg`
                                  }
                                  alt={prenda.nombre_prenda}
                                  className="prenda-image"
                                  onClick={() => handlePrendaClick(prenda)}
                                  onError={(e) => {
                                    console.error("Error cargando foto de prenda:", e.target.src);
                                    e.target.onerror = null;
                                    e.target.src = `${BACKEND_URL}/uploads/default.jpg`;
                                  }}
                                />
                            </div>
                            <div className="prenda-info">
                              <h4 className="prenda-name">{prenda.nombre_prenda}</h4>
                              {/* Etiquetas y badges eliminados */}
                              
                              <div className="prenda-actions">
                                {/* Botón principal cambia según si es tu perfil o no */}
                                <button 
                                  className="prenda-btn primary" 
                                  onClick={() => handlePrendaClick(prenda)}
                                >
                                  {isOwnProfile ? '⚙️ Gestionar Prenda' : '👁 Ver Detalles'}
                                </button>
                                
                                {/* Botón secundario solo si NO es tu perfil */}
                                {!isOwnProfile && (
                                  <button 
                                    className={`prenda-btn ${prenda.tipo_transaccion === 'venta' ? 'purchase' : 'secondary'}`}
                                    onClick={() => navigate("/chat")}
                                  >
                                    {prenda.tipo_transaccion === 'venta' 
                                      ? '💳 Comprar' 
                                      : '🔄 Intercambiar'
                                    }
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-state-content">
                          <div className="empty-state-icon">👕</div>
                          <h3 className="empty-state-title">¡Comienza tu Colección!</h3>
                          <p className="empty-state-text">
                            Sube tus primeras prendas y únete a la comunidad de moda sostenible de Double P.
                            Cada prenda que compartes ayuda a crear un mundo más sustentable.
                          </p>
                          <button className="empty-state-btn" onClick={() => navigate("/agregar")}>
                            Agregar Primera Prenda
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "intercambios" && (
                  <div className="intercambios-section">
                    <div className="intercambios-header">
                      <h3>Historial de Intercambios</h3>
                      <p>Tus intercambios en Double P Marketplace</p>
                    </div>

                    <div className="empty-state">
                      <div className="empty-state-content">
                        <div className="empty-state-icon">🔄</div>
                        <h3 className="empty-state-title">¡Comienza a Intercambiar!</h3>
                        <p className="empty-state-text">
                          Aún no tienes intercambios. Explora las prendas de otros usuarios y 
                          encuentra el intercambio perfecto para renovar tu guardarropa de forma sostenible.
                        </p>
                        <div className="empty-state-actions">
                          <button className="empty-state-btn" onClick={() => navigate("/")}>
                            Explorar Catálogo
                          </button>
                          <button className="empty-state-btn secondary" onClick={() => navigate("/chat")}>
                            Ver Chats
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="media-grid">
                    {perfil.prendas && perfil.prendas.length > 0 ? (
                      perfil.prendas.map((prenda) => (
                        <img
                          key={prenda.id_prenda}
                          src={
                            prenda.foto_prenda 
                              ? `${BACKEND_URL}/uploads/${prenda.foto_prenda}`
                              : `${BACKEND_URL}/uploads/default.jpg`
                          }
                          alt={prenda.nombre_prenda}
                          className="media-item"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${BACKEND_URL}/uploads/default.jpg`;
                          }}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <div className="empty-state-icon">📷</div>
                        <h3 className="empty-state-title">No hay imágenes</h3>
                        <p className="empty-state-text">No hay imágenes para mostrar</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Moved sidebar content below the center content */}
          <div className="bottom-sidebar-content">
            <div className="calculator-card">
              <div className="calculator-content">
                <h5 className="calculator-title" style={{ fontSize: '1.1rem', whiteSpace: 'nowrap', fontWeight: 700, margin: 0 }}>
                  🧮 Calculadora Double P
                </h5>
                <p className="calculator-description">
                  Calcula el valor estimado de tus prendas y descubre oportunidades de intercambio perfectas.
                </p>
                
                <div className="calculator-form">
                  <div className="calculator-field">
                    <label className="calculator-label">Marca (1 a 5)</label>
                    <select
                      className="calculator-select"
                      value={marca}
                      onChange={(e) => setMarca(parseInt(e.target.value))}
                    >
                      <option value="1">⭐ 1 - Económica</option>
                      <option value="2">⭐⭐ 2 - Básica</option>
                      <option value="3">⭐⭐⭐ 3 - Media</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Reconocida</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Premium/Lujo</option>
                    </select>
                  </div>

                  <div className="calculator-field">
                    <label className="calculator-label">Calidad / Estado (1 a 5)</label>
                    <select
                      className="calculator-select"
                      value={calidad}
                      onChange={(e) => setCalidad(parseInt(e.target.value))}
                    >
                      <option value="1">1 - Muy deteriorada</option>
                      <option value="2">2 - Desgastada</option>
                      <option value="3">3 - Buen estado</option>
                      <option value="4">4 - Muy buen estado</option>
                      <option value="5">5 - Como nueva / Sin usar</option>
                    </select>
                  </div>

                  <div className="calculator-field">
                    <label className="calculator-label">Valor Original (COP)</label>
                    <input
                      type="number"
                      className="calculator-input"
                      value={valorOriginal}
                      onChange={(e) => setValorOriginal(e.target.value)}
                      placeholder="Ej: 150000"
                      min="0"
                    />
                  </div>

                  <div className="calculator-field">
                    <label className="calculator-label">Nivel de Uso (1 a 5)</label>
                    <select
                      className="calculator-select"
                      value={uso}
                      onChange={(e) => setUso(parseInt(e.target.value))}
                    >
                      <option value="1">1 - Prácticamente sin usar</option>
                      <option value="2">2 - Poco uso</option>
                      <option value="3">3 - Uso normal</option>
                      <option value="4">4 - Bastante uso</option>
                      <option value="5">5 - Muy usada</option>
                    </select>
                  </div>

                  <div className="calculator-field">
                    <label className="calculator-label">Precio Mínimo Deseado (COP) - Opcional</label>
                    <input
                      type="number"
                      className="calculator-input"
                      value={minimo}
                      onChange={(e) => setMinimo(e.target.value)}
                      placeholder="Ej: 30000"
                      min="0"
                    />
                  </div>

                  <button onClick={calcularPrecio} className="calculate-btn">
                    CALCULAR PRECIO →
                  </button>

                  {resultado !== null && (
                    <>
                      <div className="calculator-result">
                        <p className="result-text">PRECIO ESTIMADO</p>
                        <p className="result-value">
                          ${resultado.toLocaleString("es-CO")} COP
                        </p>
                      </div>
                      
                      <button onClick={limpiarCalculadora} className="calculate-btn-secondary">
                        LIMPIAR
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="tips-card">
              <div className="tips-content">
                <h3 className="tips-title">💡 P-Tips</h3>
                <div className="tip-item">
                  <span className="tip-icon">🌱</span>
                  <p>Intercambia prendas para un closet más sostenible</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📸</span>
                  <p>Sube fotos de alta calidad para mejores intercambios</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">💬</span>
                  <p>Mantén conversaciones amigables y respetuosas</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">⭐</span>
                  <p>Valora a otros usuarios después de cada intercambio</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🔄</span>
                  <p>Explora nuevas marcas y estilos</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🧼</span>
                  <p>Lava y cuida tus prendas antes de intercambiarlas</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📦</span>
                  <p>Empaca tus prendas de forma segura</p>
                </div>
              </div>
            </div>

            {/* Panel de comunidad con guía de tallas estilizada */}
            <div className="community-card" style={{background: '#f9f7f3', borderRadius: '16px', boxShadow: '0 2px 8px #0001', padding: '28px 22px', marginBottom: 32, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto'}}>
              <div className="community-content">
                <h3 className="community-title" style={{fontSize: '1.4rem', fontWeight: 700, color: '#222', marginBottom: 8}}>🧵 Cómo Elegir Tallas</h3>
                <p style={{fontSize: '1rem', color: '#222', marginBottom: 12, fontWeight: 500}}>
                  Elegir la talla correcta te ayuda a encontrar prendas que se ajusten mejor a tu cuerpo y evitar devoluciones innecesarias.
                </p>
                <div className="talla-guide" style={{background: '#fffbe9', borderRadius: 10, padding: 18, border: '1px solid #e6d7b6'}}>
                  <p style={{fontWeight: 600, color: '#a07e44', marginBottom: 10}}>Antes de intercambiar o comprar, ten en cuenta:</p>
                  <ul style={{paddingLeft: 22, margin: 0, color: '#5a4a2a', fontSize: '0.98rem', lineHeight: 1.7}}>
                    <li>📏 <b>Mide tu cuerpo</b> (busto, cintura y cadera) con una cinta métrica.</li>
                    <li>📊 <b>Compara tus medidas</b> con la guía de tallas que usa la prenda.</li>
                    <li>🧵 <b>Revisa el tipo de tela</b>: las rígidas tallan justo; las elásticas dan más margen.</li>
                    <li>🏷️ <b>Ten en cuenta la marca</b>: algunas suelen ser más pequeñas o más grandes.</li>
                    <li>👚 <b>Observa el fit</b>: si la prenda es “oversize”, “slim” o “regular”, puede cambiar la sensación de talla.</li>
                    <li>❓ <b>Pregunta al dueño original</b> si la talla le queda como dice la etiqueta.</li>
                  </ul>
                  <div style={{marginTop: 16, color: '#6b4f1d', fontWeight: 500, fontSize: '1rem', textAlign: 'center'}}>
                    Así podrás elegir prendas que te queden mejor y disfrutar más el intercambio.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loading-state">
          <div className="empty-state-icon">👤</div>
          <h3 className="empty-state-title">No se encontró información del usuario</h3>
          <p className="empty-state-text">
            Por favor, inicia sesión para ver tu perfil.
          </p>
          <button 
            className="action-btn primary" 
            onClick={() => navigate('/iniciar')}
            style={{marginTop: '20px'}}
          >
            Ir al Inicio
          </button>
        </div>
      )}
    </div>
  );
}

export default MiPerfil;
