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
      if (sesion === "Sesión 2" && etapaSeleccionada) {
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
  }, [sesion, etapaSeleccionada]);

  const handleCheckboxChange = (riesgo, etapa) => {
    setRespuestas((prev) => {
      const seleccionadas = prev[riesgo] || [];
      const nuevasEtapas = seleccionadas.includes(etapa)
        ? seleccionadas.filter((e) => e !== etapa)
        : [...seleccionadas, etapa];

      return {
        ...prev,
        [riesgo]: nuevasEtapas,
      };
    });
  };

  const enviarEvaluacion = async () => {
    const respuestasFormateadas = Object.entries(respuestas).map(
      ([riesgo, etapas_afectadas]) => ({
        nombre,
        empresa,
        experiencia,
        sesion,
        etapa: etapaSeleccionada,
        riesgo,
        etapas_afectadas,
      })
    );

    const { error } = await supabase.from("respuestas").insert(respuestasFormateadas);

    if (error) {
      alert("Error al guardar respuestas: " + error.message);
    } else {
      alert("Respuestas enviadas correctamente.");
      setRespuestas({});
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
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        {!etapaSeleccionada ? (
          <>
            <h1>P6 – Proyecto Riesgos</h1>
            <p>Evaluación de riesgos en construcción industrializada en madera</p>
            <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            <input placeholder="Años de experiencia" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
            <select value={sesion} onChange={(e) => setSesion(e.target.value)}>
              <option value="Simulación">Simulación</option>
              <option value="Sesión 1">Sesión 1</option>
              <option value="Sesión 2">Sesión 2</option>
            </select>
            <select value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
              <option value="">-- Seleccione Etapa del Proyecto --</option>
              {etapasProyecto.map((etapa) => (
                <option key={etapa} value={etapa}>
                  {etapa}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <h2>Sesión 2 – {etapaSeleccionada}</h2>
            {riesgos.map((riesgo, idx) => (
              <div key={idx} style={{ marginBottom: "2rem", textAlign: "left" }}>
                <strong>{riesgo}</strong>
                <p>¿Qué etapas del proyecto son afectadas por este riesgo?</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {etapasProyecto.map((etapa) => (
                    <label key={etapa} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
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
            ))}
            <button onClick={enviarEvaluacion}>Enviar evaluación</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Participante;
