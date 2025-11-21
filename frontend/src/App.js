import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Iniciar from "./IniciarSesion";
import Agregar from "./AgregarPublicacion";
import Register from "./register";
import MiPerfil from "./MiPerfil";
import DetallePrenda from "./DetallePrenda";
import AdminDashboard from "./AdminDashboard";
import ListaDeDeseos from "./ListaDeDeseos";
import AppPerfiles from "./perfiles";
import GestionarPrenda from "./GestionPublicaciones";
import GestionPrendasAdmin from "./GestionPrendasAdmin";
import GestionarPublicacionesAdmin from "./GestionarPublicacionesAdmin";
import GestionUsuarios from "./GestionUsuarios";
import GestionPagos from "./GestionPagos";
import Configuracion from "./Configuracion";
import Verificar from "./Verificar";
import MensajeAdmin from "./MensajeAdmin";
import RecuperarContrasena from "./RecuperarContrasena";
import RestablecerContrasena from "./RestablecerContrasena";
import PoliticasSeguridad from "./PoliticasSeguridad";
import PreguntasFrecuentes from "./PreguntasFrecuentes";
import Contactanos from "./Contactanos";
import ChatList from "./ChatList";
import ChatModal from "./ChatModal";
import PagoTarjeta from "./PagoTarjeta";

import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";

// 🔒 Rutas privadas
function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/iniciar" />;
}

// 🌐 Rutas públicas
function PublicRoute({ isLoggedIn, children, redirectTo = "/" }) {
  return !isLoggedIn ? children : <Navigate to={redirectTo} />;
}

// 👑 Rutas para administrador
function AdminRoute({ isLoggedIn, children }) {
  const idRol = localStorage.getItem("id_rol");
  return isLoggedIn && (idRol === "1" || idRol === 1)
    ? children
    : <Navigate to="/iniciar" />;
}

// 👤 Rutas para usuarios normales
function UserRoute({ isLoggedIn, children }) {
  const idRol = localStorage.getItem("id_rol");
  return isLoggedIn && (idRol === "2" || idRol === 2)
    ? children
    : <Navigate to="/" />;
}

// 📦 Layout general
function Layout({ header, children }) {
  return (
    <>
      {header}
      {children}
      <Footer />
    </>
  );
}

// Layout Admin
function AdminLayout({ header, children }) {
  return (
    <>
      {header}
      {children}
      <Footer />
    </>
  );
}

// 🚦 Redirección basada en rol
function RootRedirect() {
  const token = localStorage.getItem("token");
  const idRol = localStorage.getItem("id_rol");

  if (!token) {
    return (
      <Layout header={<PublicHeader />}>
        <Home />
      </Layout>
    );
  }

  if (idRol === "1" || idRol === 1) return <Navigate to="/AdminDashboard" replace />;
  return <Navigate to="/catalogo" replace />;
}

// 🚀 APP PRINCIPAL

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    const idRol = localStorage.getItem("id_rol");
    // Acepta string o número, y solo si token existe
    return Boolean(token) && (String(idRol) === "1" || String(idRol) === "2");
  });
  const [openChatModal, setOpenChatModal] = useState(false);

  // Sincroniza isLoggedIn solo en montaje y cambios de localStorage
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("token");
      const idRol = localStorage.getItem("id_rol");
      setIsLoggedIn(Boolean(token) && (String(idRol) === "1" || String(idRol) === "2"));
    };
    checkSession();
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  // Escuchar evento global para abrir chat
  useEffect(() => {
    const handleOpenChat = () => setOpenChatModal(true);

    window.addEventListener("openChatModal", handleOpenChat);
    window.addEventListener("abrir-chat-flotante", handleOpenChat);

    return () => {
      window.removeEventListener("openChatModal", handleOpenChat);
      window.removeEventListener("abrir-chat-flotante", handleOpenChat);
    };
  }, []);

  return (
    <div className="App">
      <main>
        <Routes>

          {/* 🏠 Home */}
          <Route path="/" element={<RootRedirect />} />

          {/* 🛍 Catálogo */}
          <Route
            path="/catalogo"
            element={
              <UserRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <Home />
                </Layout>
              </UserRoute>
            }
          />

          {/* 📝 Registro */}
          <Route
            path="/register"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Register setIsLoggedIn={setIsLoggedIn} />
              </PublicRoute>
            }
          />

          {/* Verificar */}
          <Route
            path="/verificar"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Verificar />
              </PublicRoute>
            }
          />

          {/* 🔐 Iniciar sesión */}
          <Route
            path="/iniciar"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <Iniciar setIsLoggedIn={setIsLoggedIn} />
              </PublicRoute>
            }
          />

          {/* 👤 Perfil */}
          <Route
            path="/MiPerfil"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <MiPerfil />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 👤 Perfil alterno */}
          <Route
            path="/mi_perfil"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <MiPerfil />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* ➕ Agregar publicación */}
          <Route
            path="/agregar"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <Agregar />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 👗 Detalle prenda */}
          <Route
            path="/detalle_prenda/:id"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <DetallePrenda />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 💖 Lista de deseos */}
          <Route
            path="/lista_deseos"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <ListaDeDeseos />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* ⚙ Configuración */}
          <Route
            path="/configuracion"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <Configuracion />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Políticas */}
          <Route
            path="/politicas-seguridad"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <PoliticasSeguridad />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Preguntas frecuentes */}
          <Route
            path="/preguntas-frecuentes"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <PreguntasFrecuentes />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Contáctanos */}
          <Route
            path="/contactanos"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <Contactanos />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <ChatList />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Perfil público */}
          <Route
            path="/perfil/:id_usuario"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <AppPerfiles />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/AdminDashboard"
            element={
              <AdminRoute isLoggedIn={isLoggedIn}>
                <AdminLayout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Mensaje admin */}
          <Route
            path="/AdminDashboard/mensaje"
            element={
              <AdminRoute isLoggedIn={isLoggedIn}>
                <AdminLayout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                  <MensajeAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Gestión prendas */}
          <Route
            path="/AdminDashboard/gestion-prendas"
            element={
              <AdminRoute isLoggedIn={isLoggedIn}>
                <AdminLayout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                  <GestionPrendasAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Gestión usuarios */}
          <Route
            path="/AdminDashboard/usuarios"
            element={
              <AdminRoute isLoggedIn={isLoggedIn}>
                <AdminLayout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                  <GestionUsuarios />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Pago tarjeta */}
          <Route
            path="/pago-tarjeta"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <PagoTarjeta />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Gestión pagos */}
          <Route
            path="/AdminDashboard/pagos"
            element={
              <AdminRoute isLoggedIn={isLoggedIn}>
                <AdminLayout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                  <GestionPagos />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Editar publicación admin */}
          <Route
            path="/AdminDashboard/editar_publicacion/:id"
            element={
              <AdminRoute isLoggedIn={isLoggedIn}>
                <AdminLayout header={<HeaderAdmin setIsLoggedIn={setIsLoggedIn} />}>
                  <GestionarPublicacionesAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* Editar publicación usuario */}
          <Route
            path="/gestion_prendas/:id"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout header={<Header setIsLoggedIn={setIsLoggedIn} />}>
                  <GestionarPrenda />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 🧭 Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

      {/* Chat Modal */}
      {isLoggedIn && openChatModal && (
        <ChatModal
          open={openChatModal}
          onClose={() => setOpenChatModal(false)}
        />
      )}
    </div>
  );
}

export default App;
