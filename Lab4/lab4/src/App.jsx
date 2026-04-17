import "./App.css";
import { useState } from "react";
import CryptoJS from "crypto-js";

function App() {
  const [clave, setClave] = useState("");
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState("");

  const cifrar = () => {
    const textoCifrado = CryptoJS.AES.encrypt(texto, clave).toString();
    setResultado(textoCifrado);
  };

  const descifrar = () => {
    const bytes = CryptoJS.AES.decrypt(texto, clave);
    const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8);

    if (!textoDescifrado.trim()) {
      setResultado("No se pudo descifrar: revisa la clave o el texto ingresado.");
      return;
    }

    setResultado(textoDescifrado);
  };

  return (
    <div className="App">
      <div className="input-group">
        <label htmlFor="clave">Clave</label>
        <input
          id="clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Ingresa tu clave secreta"
        />
      </div>

      <div className="input-group">
        <label htmlFor="texto">Texto a cifrar/descifrar</label>
        <textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ingresa el texto que deseas procesar"
          rows="5"
        />
      </div>

      <div className="button-group">
        <button onClick={cifrar} className="btn btn-encrypt">
          Cifrar
        </button>
        <button onClick={descifrar} className="btn btn-decrypt">
          Descifrar
        </button>
      </div>

      {resultado && (
        <>
          <label htmlFor="resultado">Resultado</label>
          <textarea
            id="resultado"
            readOnly
            value={resultado}
            className="result-text"
          />
        </>
      )}
    </div>
  );
}

export default App;
