import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";

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

const Participante = () => {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [sesion, setSesion] = useState("Simulación");
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const [riesgos, setRiesgos] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const obtenerRiesgos = async () => {
      if (etapaSeleccionada && sesion === "Sesión 2") {
        const { data, error } = await supabase
          .from("riesgos")
          .select("riesgo")
          .eq("etapa", etapaSeleccionada);
        if (!error) {
          setRiesgos(data.map((r) => r.riesgo));
        }
      }
    };
    obtenerRiesgos();
  }, [etapaSeleccionada, sesion]);

  const handleCheckboxChange = (riesgo, etapa) => {
    setRespuestas((prev) => {
      const seleccionadas = prev[riesgo] || [];
      const nuevas = seleccionadas.includes(etapa)
        ? seleccionadas.filter((e) => e !== etapa)
        : [...seleccionadas, etapa];

      return {
        ...prev,
        [riesgo]: nuevas,
      };
    });
  };

  const enviarEvaluacion = async () => {
    const inserciones = Object.entries(respuestas).map(([riesgo, etapas_afectadas]) => ({
      nombre,
      empresa,
      experiencia,
      sesion,
      etapa: etapaSeleccionada,
      riesgo,
      etapas_afectadas,
    }));

    const { error } = await supabase.from("respuestas").insert(inserciones);
    if (error) {
      alert("Error al guardar respuestas: " + error.message);
    } else {
      alert("Respuestas enviadas correctamente.");
      setRespuestas({});
      setEtapaSeleccionada("");
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/edificio.jpg")',
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
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "2rem",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "1000px",
          textAlign: "center",
        }}
      >
        {!etapaSeleccionada ? (
          <>
            <h1>P6 – Proyecto Riesgos</h1>
            <p>Evaluación de riesgos en construcción industrializada en madera</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              <input
                placeholder="Años de experiencia"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
              />
              <select value={sesion} onChange={(e) => setSesion(e.target.value)}>
                <option value="Simulación">Simulación</option>
                <option value="Sesión 1">Sesión 1</option>
                <option value="Sesión 2">Sesión 2</option>
              </select>
              <select value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
                <option value="">-- Seleccione Etapa --</option>
                {etapasProyecto.map((etapa) => (
                  <option key={etapa} value={etapa}>
                    {etapa}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : sesion === "Sesión 2" ? (
          <>
            <h2>{`Etapa seleccionada: ${etapaSeleccionada}`}</h2>
            {riesgos.length === 0 ? (
              <p>No hay riesgos disponibles para esta etapa.</p>
            ) : (
              riesgos.map((riesgo, idx) => (
                <div key={idx} style={{ marginBottom: "2rem", textAlign: "left" }}>
                  <strong>{riesgo}</strong>
                  <p>¿Qué etapas del proyecto se ven afectadas por este riesgo?</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {etapasProyecto.map((etapa) => (
                      <label key={etapa}>
                        <input
                          type="checkbox"
                          checked={respuestas[riesgo]?.includes(etapa) || false}
                          onChange={() => handleCheckboxChange(riesgo, etapa)}
                        />
                        {etapa}
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
            <button onClick={enviarEvaluacion}>Enviar evaluación</button>
          </>
        ) : (
          <p>La evaluación de esta sesión aún no está disponible en este formulario.</p>
        )}
      </div>
    </div>
  );
};

export default Participante;
