// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Iniciar from "./IniciarSesion";
import Agregar from "./AgregarPublicacion";
import Editar from "./editar_perfil";
import Register from "./register";

import Header from "./Header";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";
import Headerinicioregistro from "./Headerinicioregistro";

// Componente para rutas privadas
const PrivateRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/iniciar" />;
};

// Componente para rutas públicas (solo para no logueados)
const PublicRoute = ({ children, isLoggedIn, redirectTo = "/" }) => {
  return !isLoggedIn ? children : <Navigate to={redirectTo} />;
};

// Layout que incluye header y footer
const Layout = ({ header, children }) => (
  <>
    {header}
    {children}
    <Footer />
  </>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // o cualquier indicador de login
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                <Layout header={!isLoggedIn ? <PublicHeader /> : <Header />}>
                  <Home />
                </Layout>
              }
            />

            {/* Registro */}
            <Route
              path="/register"
              element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                  <>
                    <Headerinicioregistro />
                    <Register />
                  </>
                </PublicRoute>
              }
            />

            {/* Iniciar sesión */}
            <Route
              path="/iniciar"
              element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                  <>
                    <Headerinicioregistro />
                    <Iniciar />
                  </>
                </PublicRoute>
              }
            />

            {/* Agregar publicación */}
            <Route
              path="/agregar"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header />}>
                    <Agregar />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Editar perfil */}
            <Route
              path="/editar"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Layout header={<Header />}>
                    <Editar />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

