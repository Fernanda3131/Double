import React, { useState } from "react";
import Perfiles from "./perfiles";
import IniciarSesion from "./IniciarSesion";

function Editar() {
  const [logueado, setLogueado] = useState(false);

  return (
    <div>
      {logueado ? (
        <Perfiles />
      ) : (
        <IniciarSesion onLogin={() => setLogueado(true)} />
      )}
    </div>
  );
}

export default Editar;
