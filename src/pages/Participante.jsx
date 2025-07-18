import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import './Participante.css';

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
  "Disposición final"
];

function Participante() {
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [sesion, setSesion] = useState('');
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [riesgos, setRiesgos] = useState([]);
  const [etapasAfectadas, setEtapasAfectadas] = useState({});

  useEffect(() => {
    const fetchRiesgos = async () => {
      if (sesion === 'Sesión 2' && etapaSeleccionada) {
        const { data, error } = await supabase
          .from('respuestas')
          .select('riesgo')
          .eq('etapa', etapaSeleccionada);

        if (error) {
          console.error('Error al cargar riesgos:', error);
        } else {
          const riesgosUnicos = [...new Set(data.map(r => r.riesgo))];
          setRiesgos(riesgosUnicos);
        }
      }
    };
    fetchRiesgos();
  }, [sesion, etapaSeleccionada]);

  const handleEtapasChange = (riesgo, etapa) => {
    setEtapasAfectadas(prev => {
      const actuales = prev[riesgo] || [];
      if (actuales.includes(etapa)) {
        return {
          ...prev,
          [riesgo]: actuales.filter(e => e !== etapa)
        };
      } else {
        return {
          ...prev,
          [riesgo]: [...actuales, etapa]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const riesgo of riesgos) {
      const { error } = await supabase.from('respuestas').insert({
        nombre,
        empresa,
        experiencia,
        sesion,
        etapa: etapaSeleccionada,
        riesgo,
        etapas_afectadas: etapasAfectadas[riesgo] || []
      });

      if (error) {
        console.error('Error al guardar la respuesta:', error);
      }
    }

    alert('Evaluación enviada correctamente');
  };

  return (
    <div className="fondo">
      {!mostrarFormulario ? (
        <div className="formulario-inicial">
          <h1>P6 – Proyecto Riesgos</h1>
          <h2>Evaluación de riesgos en construcción industrializada en madera</h2>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input type="text" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          <input type="number" placeholder="Años de experiencia" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
          <select value={sesion} onChange={(e) => setSesion(e.target.value)}>
            <option value="">-- Seleccione Sesión --</option>
            <option value="Sesión 2">Sesión 2</option>
          </select>
          <select value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
            <option value="">-- Seleccione Etapa --</option>
            {etapasProyecto.map(etapa => (
              <option key={etapa} value={etapa}>{etapa}</option>
            ))}
          </select>
          <button onClick={() => setMostrarFormulario(true)}>Comenzar evaluación</button>
        </div>
      ) : (
        <form className="evaluacion-riesgos" onSubmit={handleSubmit}>
          <h2>{etapaSeleccionada}</h2>
          {riesgos.map((riesgo, idx) => (
            <div key={idx} className="riesgo-block">
              <p><strong>{riesgo}</strong></p>
              <p>¿Qué etapas afecta este riesgo?</p>
              {etapasProyecto.map(etapa => (
                <label key={etapa} className="checkbox-etapa">
                  <input
                    type="checkbox"
                    checked={etapasAfectadas[riesgo]?.includes(etapa) || false}
                    onChange={() => handleEtapasChange(riesgo, etapa)}
                  />
                  {etapa}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Enviar evaluación</button>
        </form>
      )}
    </div>
  );
}

export default Participante;
