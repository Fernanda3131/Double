import React, { useState } from "react";
import Perfiles from "./perfiles";

function Editar() {
  const [logueado, setLogueado] = useState(false);

  return (
    <div>
      {logueado ? (
        <Perfil />
      ) : (
        <Login onLogin={() => setLogueado(true)} />
      )}
    </div>
  );
}

export default Editar;
