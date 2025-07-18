import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

const etapasProyecto = [
  "Suministro",
  "Prefactibilidad",
  "Factibilidad",
  "Planeación",
  "Contratación",
  "Diseño",
  "Fabricación",
  "Logística y Transporte",
  "Montaje",
  "Construcción",
  "Puesta en marcha",
  "Disposición final",
];

const riesgosPorEtapa = {
  Suministro: ["Retraso en entrega de materiales", "Falta de control de calidad en insumos"],
  Prefactibilidad: ["Falta de estudios de mercado", "Subestimación de costos iniciales"],
  // Agrega las demás etapas con sus respectivos riesgos si ya están disponibles
};

function Participante() {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [sesion, setSesion] = useState("Sesión 1");
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const [formIniciado, setFormIniciado] = useState(false);
  const [respuestas, setRespuestas] = useState({});

  const handleCheckboxChange = (riesgo, etapaAfectada) => {
    setRespuestas((prev) => {
      const etapas = prev[riesgo] || [];
      if (etapas.includes(etapaAfectada)) {
        return { ...prev, [riesgo]: etapas.filter((e) => e !== etapaAfectada) };
      } else {
        return { ...prev, [riesgo]: [...etapas, etapaAfectada] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!etapaSeleccionada) return alert("Selecciona una etapa para evaluar");

    const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];

    for (const riesgo of riesgos) {
      const etapasAfectadas = respuestas[riesgo] || [];

      const { error } = await supabase.from("respuestas").insert([
        {
          nombre,
          empresa,
          experiencia,
          sesion,
          etapa: etapaSeleccionada,
          riesgo,
          etapas_afectadas: etapasAfectadas,
        },
      ]);

      if (error) console.error("Error al guardar respuesta:", error.message);
    }

    alert("Respuestas guardadas correctamente");
    setFormIniciado(false);
    setRespuestas({});
  };

  return (
    <div className="contenedor-principal">
      {!formIniciado ? (
        <div className="form-inicial">
          <h2>P6 – Proyecto Riesgos</h2>
          <p>Evaluación de riesgos en construcción industrializada en madera</p>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input type="text" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          <input type="number" placeholder="Años de experiencia" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
          <select value={sesion} onChange={(e) => setSesion(e.target.value)}>
            <option value="Sesión 1">Sesión 1</option>
            <option value="Sesión 2">Sesión 2</option>
          </select>
          {sesion === "Sesión 2" && (
            <select value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
              <option value="">Selecciona una etapa</option>
              {Object.keys(riesgosPorEtapa).map((etapa) => (
                <option key={etapa} value={etapa}>{etapa}</option>
              ))}
            </select>
          )}
          <button onClick={() => setFormIniciado(true)}>Comenzar evaluación</button>
        </div>
      ) : (
        <div className="evaluacion">
          <h3>{etapaSeleccionada}</h3>
          {riesgosPorEtapa[etapaSeleccionada]?.map((riesgo, idx) => (
            <div key={idx}>
              <strong>{riesgo}</strong>
              <p>¿Qué etapas afecta este riesgo?</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {etapasProyecto.map((etapa, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={respuestas[riesgo]?.includes(etapa) || false}
                      onChange={() => handleCheckboxChange(riesgo, etapa)}
                    />
                    {etapa}
                  </label>
                ))}
              </div>
              <hr />
            </div>
          ))}
          <button onClick={handleSubmit}>Enviar evaluación</button>
        </div>
      )}
    </div>
  );
}

export default Participante;
