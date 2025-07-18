// src/pages/Participante.jsx
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import "../App.css";

const etapasProyecto = [
  "Suministro",
  "Prefactibilidad",
  "Factibilidad",
  "Planeación",
  "Contratación",
  "Diseño",
  "Fabricación",
  "Logística",
  "Montaje",
  "Construcción",
  "Puesta en marcha",
  "Disposición final",
];

const Participante = () => {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [sesion, setSesion] = useState("Sesión 2");
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const [riesgos, setRiesgos] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const fetchRiesgos = async () => {
      if (etapaSeleccionada && sesion === "Sesión 2") {
        const { data, error } = await supabase
          .from("riesgos")
          .select("*")
          .eq("etapa", etapaSeleccionada);

        if (error) {
          console.error("Error al obtener riesgos:", error);
        } else {
          setRiesgos(data);
        }
      }
    };

    fetchRiesgos();
  }, [etapaSeleccionada, sesion]);

  const handleEtapasAfectadasChange = (riesgoId, etapa) => {
    setRespuestas((prev) => {
      const actuales = prev[riesgoId]?.etapas_afectadas || [];
      const nuevas =
        actuales.includes(etapa)
          ? actuales.filter((e) => e !== etapa)
          : [...actuales, etapa];
      return {
        ...prev,
        [riesgoId]: {
          ...prev[riesgoId],
          etapas_afectadas: nuevas,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const riesgo of riesgos) {
      const respuesta = respuestas[riesgo.id];
      const etapas_afectadas = respuesta?.etapas_afectadas || [];

      const { error } = await supabase.from("respuestas").insert([
        {
          etapa: etapaSeleccionada,
          riesgo: riesgo.descripcion,
          etapas_afectadas,
          sesion,
          nombre,
          empresa,
          experiencia,
        },
      ]);

      if (error) {
        console.error("Error al guardar respuesta:", error);
      }
    }

    alert("Evaluación enviada correctamente");
    setRespuestas({});
  };

  return (
    <div
      style={{
        backgroundImage: `url('/edificio.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          padding: "2rem",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>P6 – Proyecto Riesgos</h1>
        <p style={{ textAlign: "center" }}>
          Evaluación de riesgos en construcción industrializada en madera
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <input
              type="number"
              placeholder="Años de experiencia"
              value={experiencia}
              onChange={(e) => setExperiencia(e.target.value)}
              required
              style={{ flex: 1 }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Etapa del proyecto a evaluar:</label>
            <select
              value={etapaSeleccionada}
              onChange={(e) => setEtapaSeleccionada(e.target.value)}
              required
              style={{ width: "100%" }}
            >
              <option value="">Seleccione una etapa</option>
              {etapasProyecto.map((etapa) => (
                <option key={etapa} value={etapa}>
                  {etapa}
                </option>
              ))}
            </select>
          </div>

          {sesion === "Sesión 2" && riesgos.length > 0 && (
            <>
              {riesgos.map((riesgo) => (
                <div key={riesgo.id} style={{ marginBottom: "2rem" }}>
                  <h4>{riesgo.descripcion}</h4>
                  <p>¿Qué etapas afecta este riesgo?</p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "0.5rem",
                    }}
                  >
                    {etapasProyecto.map((etapa) => (
                      <label key={etapa}>
                        <input
                          type="checkbox"
                          checked={
                            respuestas[riesgo.id]?.etapas_afectadas?.includes(
                              etapa
                            ) || false
                          }
                          onChange={() =>
                            handleEtapasAfectadasChange(riesgo.id, etapa)
                          }
                        />
                        {" " + etapa}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          <button type="submit" style={{ marginTop: "1rem" }}>
            Enviar evaluación
          </button>
        </form>
      </div>
    </div>
  );
};

export default Participante;
