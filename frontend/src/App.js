import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Iniciar from "./IniciarSesion";
import Agregar from "./AgregarPublicacion";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/iniciar" element={<Iniciar />} />
        <Route path="/agregar" element={<Agregar />} />
      </Routes>
    </Router>
  );
}

export default App;

