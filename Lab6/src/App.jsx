import { useState, useRef, useEffect, useCallback } from "react";

const GEMINI_MODEL = "gemini-3.5-flash";
const API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

function Bubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          background: isUser ? "#dbeafe" : "#f3f4f6",
          padding: "10px 14px",
          borderRadius: 10,
          maxWidth: "70%",
        }}
      >
        {msg.image && (
          <img
            src={msg.image}
            alt="preview"
            style={{
              maxWidth: 200,
              display: "block",
              marginBottom: 8,
            }}
          />
        )}

        <div
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        alert("No se pudo acceder a la cámara");
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const canvas = document.createElement("canvas");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0);

    const full = canvas.toDataURL("image/jpeg");

    streamRef.current?.getTracks().forEach((t) => t.stop());

    onCapture({
      b64: full.split(",")[1],
      preview: full,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: 300,
          }}
        />

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 10,
          }}
        >
          <button onClick={capture}>
            Capturar
          </button>

          <button onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GeminiChat() {
  const [apiKey, setApiKey] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hola, soy tu asistente.",
    },
  ]);

  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const endRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const full = e.target.result;

      setImage({
        b64: full.split(",")[1],
        preview: full,
        mimeType: file.type,
      });
    };

    reader.readAsDataURL(file);
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();

    if (!text && !image) return;

    if (!apiKey) {
      alert("Ingresa tu API Key");
      return;
    }

    const userMessage = {
      role: "user",
      text,
      image: image?.preview,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    const parts = [];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.b64,
        },
      });
    }

    if (text) {
      parts.push({ text });
    }

    try {
      const res = await fetch(
        `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts,
              },
            ],
          }),
        }
      );

      const data = await res.json();

      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sin respuesta";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Error al conectar con Gemini",
        },
      ]);
    } finally {
      setLoading(false);
      setImage(null);
    }
  }, [input, image, apiKey]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showCamera && (
        <CameraModal
          onCapture={({ b64, preview }) => {
            setImage({
              b64,
              preview,
              mimeType: "image/jpeg",
            });

            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div
        style={{
          padding: 10,
          borderBottom: "1px solid #ccc",
        }}
      >
        <p>API Key:</p>
        <input
          type="password"
          placeholder="Gemini API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
        }}
      >
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}

        {loading && <p>Escribiendo...</p>}

        <div ref={endRef} />
      </div>

      {image && (
        <div
          style={{
            padding: 10,
            borderTop: "1px solid #ccc",
          }}
        >
          <img
            src={image.preview}
            alt="preview"
            style={{
              width: 80,
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 10,
          borderTop: "1px solid #ccc",
        }}
      >
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <button onClick={() => fileRef.current.click()}>
          Imagen
        </button>

        <button onClick={() => setShowCamera(true)}>
          Cámara
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribe un mensaje..."
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            padding: 8,
          }}
        />

        <button onClick={sendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}