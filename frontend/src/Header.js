import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo">
        <img
          src="" // reemplaza por una imagen válida si quieres
          alt="Perfil"
          className="profile-pic"
        />
        <span className="username">DanielaMu</span>
      </div>
      <div className="icons">
        <button className="icon-btn" title="Configuración">
          🪄
        </button>
        <button className="icon-btn" title="Otra acción">
          ⚙️
        </button>
      </div>
    </header>
  );
};

export default Header;
