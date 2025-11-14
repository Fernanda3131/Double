import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CalcularValorPrenda.css";

export default function CalculadoraPrendas() {
  const navigate = useNavigate();
  const [marca, setMarca] = useState(3);
  const [calidad, setCalidad] = useState(3);
  const [valorOriginal, setValorOriginal] = useState("");
  const [uso, setUso] = useState(3);
  const [minimo, setMinimo] = useState("");
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    if (!valorOriginal || valorOriginal <= 0) {
      alert("Por favor ingresa un valor original válido");
      return;
    }

    const factorMarca = 0.15 + marca * 0.05;
    const factorCalidad = 0.20 + calidad * 0.10;
    const factorUso = 1 - uso * 0.05;

    const valorEstimado = parseFloat(valorOriginal) * factorMarca * factorCalidad * factorUso;
    const minimoVal = parseFloat(minimo) || 0;
    const precioFinal = Math.max(valorEstimado, minimoVal);

    setResultado(precioFinal);
  };

  return (
    <div className="calculadora-container">
      <div className="calculadora-wrapper">
        <button className="calculadora-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <h1 className="calculadora-titulo">Calculadora Double P</h1>
        <p className="calculadora-subtitulo">
          Calcula el valor estimado de tus prendas de forma inteligente
        </p>

        <div className="calculadora-form">
          <div className="calculadora-campo">
            <label className="calculadora-label">Marca (1 a 5)</label>
            <select
              className="calculadora-select"
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

          <div className="calculadora-campo">
            <label className="calculadora-label">Calidad / Estado (1 a 5)</label>
            <select
              className="calculadora-select"
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

          <div className="calculadora-campo">
            <label className="calculadora-label">Valor Original (COP)</label>
            <input
              type="number"
              className="calculadora-input"
              value={valorOriginal}
              onChange={(e) => setValorOriginal(e.target.value)}
              placeholder="Ej: 150000"
              min="0"
            />
          </div>

          <div className="calculadora-campo">
            <label className="calculadora-label">Nivel de Uso (1 a 5)</label>
            <select
              className="calculadora-select"
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

          <div className="calculadora-campo">
            <label className="calculadora-label">Precio Mínimo Deseado (COP) - Opcional</label>
            <input
              type="number"
              className="calculadora-input"
              value={minimo}
              onChange={(e) => setMinimo(e.target.value)}
              placeholder="Ej: 30000"
              min="0"
            />
          </div>

          <button onClick={calcular} className="calculadora-btn">
            CALCULAR PRECIO
          </button>

          {resultado !== null && (
            <div className="calculadora-resultado">
              <p className="calculadora-resultado-texto">PRECIO ESTIMADO</p>
              <p className="calculadora-resultado-valor">
                ${resultado.toLocaleString("es-CO")} COP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
