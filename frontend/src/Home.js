import React from "react";
import "./Home.css";

const productos = [
  { id: 1, nombre: "Bufanda gris", precio: "8.500", imagen: "/images/bufanda.jpg" },
  { id: 2, nombre: "Falda de rayas Plus", precio: "10.000", imagen: "/images/falda.jpg" },
  { id: 3, nombre: "Jean corte petite", precio: "28.700", imagen: "/images/jean.jpg" },
  { id: 4, nombre: "Chaqueta top XS", precio: "28.000", imagen: "/images/chaqueta.jpg" },
  { id: 5, nombre: "Falda Vintage XXL", precio: "30.000", imagen: "/images/falda-vintage.jpg" },
  { id: 6, nombre: "Pantalón formal petite", precio: "30.000", imagen: "/images/pantalon.jpg" },
  { id: 7, nombre: "Camisa crop top", precio: "8.500", imagen: "/images/camisa-crop.jpg" },
  { id: 8, nombre: "Camisa retro XL", precio: "10.000", imagen: "/images/camisa-retro.jpg" },
  { id: 9, nombre: "Vestido de fiesta", precio: "60.000", imagen: "/images/vestido.jpg" },
  { id: 3, nombre: "Jean corte petite", precio: "28.700", imagen: "/images/jean.jpg" },
  { id: 4, nombre: "Chaqueta top XS", precio: "28.000", imagen: "/images/chaqueta.jpg" },
  { id: 5, nombre: "Falda Vintage XXL", precio: "30.000", imagen: "/images/falda-vintage.jpg" },
  { id: 6, nombre: "Pantalón formal petite", precio: "30.000", imagen: "/images/pantalon.jpg" },
  { id: 7, nombre: "Camisa crop top", precio: "8.500", imagen: "/images/camisa-crop.jpg" },
  { id: 8, nombre: "Camisa retro XL", precio: "10.000", imagen: "/images/camisa-retro.jpg" },
  { id: 9, nombre: "Vestido de fiesta", precio: "60.000", imagen: "/images/vestido.jpg" },
  { id: 3, nombre: "Jean corte petite", precio: "28.700", imagen: "/images/jean.jpg" },
  { id: 4, nombre: "Chaqueta top XS", precio: "28.000", imagen: "/images/chaqueta.jpg" },
  { id: 5, nombre: "Falda Vintage XXL", precio: "30.000", imagen: "/images/falda-vintage.jpg" },
  { id: 6, nombre: "Pantalón formal petite", precio: "30.000", imagen: "/images/pantalon.jpg" },
  { id: 7, nombre: "Camisa crop top", precio: "8.500", imagen: "/images/camisa-crop.jpg" },
  { id: 8, nombre: "Camisa retro XL", precio: "10.000", imagen: "/images/camisa-retro.jpg" },
  { id: 9, nombre: "Vestido de fiesta", precio: "60.000", imagen: "/images/vestido.jpg" },
  { id: 3, nombre: "Jean corte petite", precio: "28.700", imagen: "/images/jean.jpg" },
  { id: 4, nombre: "Chaqueta top XS", precio: "28.000", imagen: "/images/chaqueta.jpg" },
  { id: 5, nombre: "Falda Vintage XXL", precio: "30.000", imagen: "/images/falda-vintage.jpg" },
  { id: 6, nombre: "Pantalón formal petite", precio: "30.000", imagen: "/images/pantalon.jpg" },
  { id: 7, nombre: "Camisa crop top", precio: "8.500", imagen: "/images/camisa-crop.jpg" },
  { id: 8, nombre: "Camisa retro XL", precio: "10.000", imagen: "/images/camisa-retro.jpg" },
  { id: 9, nombre: "Vestido de fiesta", precio: "60.000", imagen: "/images/vestido.jpg" }
];

export default function Home() {
  return (
    <div className="home-container">

      {/* Texto superior */}
      <div className="home-texto">
        <p>Moda Sostenible</p>
        <h1>“Sin límites, sin barreras: más tallas, más opciones, más de ti.”</h1>
      </div>

      {/* Catálogo */}
      <div className="catalogo-container">
        <div className="catalogo-grid">
          {productos.map((prod) => (
            <div key={prod.id} className="producto-card">
              <img src={prod.imagen} alt={prod.nombre} />
              <h4>{prod.nombre}</h4>
              <p>${prod.precio}</p>
              <button>Ver más</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
