"use client";

import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-css.min';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [classes, setClasses] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const fetchClasses = async () => {
    setLoading(true);

    const url = 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2';

    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY as string,
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `
              Proporciona exclusivamente las declaraciones de CSS3 para el siguiente requisito/prompt: ${prompt}.
              Debe ser estrictamente declaraciones relacionadas con CSS3, sin ningún otro texto, explicación, saludo, ni sugerencias.
              Solo responder con las declaraciones de CSS3 separadas por espacios.
              Tampoco dar sugerencias al prompt ingresado, ni comentar con "/**/", sólo responder con la/las declaración/es de CSS3.

              El usuario puede colocar palabras como: "contenedor", "div", "span", "main" o algún nombre de clase,
              en este caso, devolver como respuesta, por ejemplo: div {(declaraciones de CSS3 que pida el usuario)} o .contenedor {(declaraciones de CSS3 que pida el usuario)}.
              
              Debes cerrar bien las llaves "{}" de las declaraciones de CSS3.
              Por ejemplo, '{ width:300px; height:300px; }'
            `,
          },
        ],
        system_prompt: "",
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setClasses(result.result || "");
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchClasses();
    }
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [classes]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4">
      <h1 className="text-4xl font-bold mb-8">FastCSS</h1>
      <input
        type="text"
        value={prompt}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="texto hacia la derecha, borde rojo de 6px, color de fondo azul, una sombra de 6px, etc..."
        className="w-[80%] placeholder-opacity-60 placeholder:italic text-black p-3 border border-gray-300 rounded-md mb-4"
      />
      <button
        onClick={fetchClasses}
        className={`px-4 py-2 rounded-md mb-4 ${
          loading ? 'bg-blue-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition-all'
        }`}
        disabled={loading}
      >
        {loading ? <Loading/> : "Generar clases"}
      </button>
      
      {classes && !loading && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md w-[80%]">
          <p>Declaraciones para CSS:</p>
          <pre className="overflow-auto whitespace-pre-wrap break-words mt-8">
            <code className="language-css">{classes}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
