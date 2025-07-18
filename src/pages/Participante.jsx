import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import "./Participante.css";

const etapasProyecto = [
  "Abastecimiento",
  "Prefactibilidad",
  "Factibilidad",
  "Planeación",
  "Contratación y adquisición",
  "Diseño",
  "Fabricación",
  "Logística y transporte",
  "Montaje",
  "Construcción",
  "Puesta en marcha",
  "Disposición final",
];

function Participante() {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [sesion, setSesion] = useState("Sesión 2");
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [riesgos, setRiesgos] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    if (sesion === "Sesión 2" && etapaSeleccionada) {
      const fetchRiesgos = async () => {
        const { data, error } = await supabase
          .from("riesgos")
          .select("*")
          .eq("etapa", etapaSeleccionada);

        if (error) {
          console.error("Error cargando riesgos:", error);
        } else {
          setRiesgos(data);
        }
      };

      fetchRiesgos();
    }
  }, [sesion, etapaSeleccionada]);

  const handleEtapasAfectadasChange = (riesgoId, etapa) => {
    const etapasSeleccionadas = respuestas[riesgoId]?.etapas_afectadas || [];
    const nuevasEtapas = etapasSeleccionadas.includes(etapa)
      ? etapasSeleccionadas.filter((e) => e !== etapa)
      : [...etapasSeleccionadas, etapa];

    setRespuestas((prev) => ({
      ...prev,
      [riesgoId]: {
        ...prev[riesgoId],
        etapas_afectadas: nuevasEtapas,
      },
    }));
  };

  const handleSubmit = async () => {
    for (const riesgo of riesgos) {
      const respuesta = respuestas[riesgo.id];
      if (respuesta?.etapas_afectadas?.length) {
        const { error } = await supabase.from("respuestas").insert({
          timestamp: new Date().toISOString(),
          etapa: etapaSeleccionada,
          riesgo: riesgo.nombre,
          sesiones: sesion,
          etapas_afectadas: respuesta.etapas_afectadas,
          nombre,
          empresa,
          experiencia,
        });

        if (error) console.error("Error guardando respuesta:", error);
      }
    }

    alert("Respuestas enviadas correctamente.");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/edificio.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          padding: "2rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "1000px",
        }}
      >
        {!mostrarFormulario ? (
          <>
            <h2 style={{ textAlign: "center" }}>Participación – P6 Proyecto Riesgos</h2>
            <input
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              placeholder="Empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
            />
            <input
              placeholder="Años de experiencia"
              value={experiencia}
              onChange={(e) => setExperiencia(e.target.value)}
              required
            />
            <select
              value={etapaSeleccionada}
              onChange={(e) => setEtapaSeleccionada(e.target.value)}
            >
              <option value="">Seleccionar etapa a evaluar</option>
              {etapasProyecto.map((etapa) => (
                <option key={etapa} value={etapa}>
                  {etapa}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (etapaSeleccionada && nombre && empresa && experiencia) {
                  setMostrarFormulario(true);
                } else {
                  alert("Completa todos los campos antes de continuar.");
                }
              }}
            >
              Comenzar evaluación
            </button>
          </>
        ) : (
          <>
            <h3>Etapa seleccionada: {etapaSeleccionada}</h3>
            {riesgos.map((riesgo) => (
              <div
                key={riesgo.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  margin: "1rem 0",
                  padding: "1rem",
                }}
              >
                <strong>{riesgo.nombre}</strong>
                <p>¿Qué etapas del proyecto se ven afectadas por este riesgo?</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  {etapasProyecto.map((etapa) => (
                    <label key={etapa}>
                      <input
                        type="checkbox"
                        checked={
                          respuestas[riesgo.id]?.etapas_afectadas?.includes(etapa) || false
                        }
                        onChange={() =>
                          handleEtapasAfectadasChange(riesgo.id, etapa)
                        }
                      />
                      {etapa}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit}>Enviar respuestas</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Participante;
