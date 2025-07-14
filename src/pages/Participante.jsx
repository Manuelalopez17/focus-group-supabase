import { useState } from 'react';
import { supabase } from '../supabaseClient';

const riesgosPorEtapa = {
  "Suministro": ['Retraso en entrega de materiales', 'Falta de control de calidad en insumos'],
  "Prefactibilidad": ['Falta de estudios de mercado', 'Subestimación de costos iniciales'],
  "Factibilidad": ['Cambios en regulaciones locales', 'Conflictos con la comunidad'],
  "Planeación": ['Cronograma poco realista', 'Falta de coordinación entre actores'],
  "Contratación": ['Errores en pliegos de condiciones', 'Desacuerdos contractuales'],
  "Diseño": ['Errores en planos', 'Falta de revisión interdisciplinaria'],
  "Fabricación": ['Fallos en control de calidad en fábrica', 'Demoras en producción'],
  "Logística y Transporte": ['Daños por mala manipulación', 'Retrasos por clima'],
  "Montaje": ['Falta de capacitación en obra', 'Problemas de alineación de elementos'],
  "Construcción": ['Riesgos de seguridad', 'Errores de ejecución en obra'],
  "Puesta en marcha": ['Falla en pruebas finales', 'Retrasos en aprobaciones'],
  "Disposición final": ['Mal manejo de residuos', 'Falta de cierre documental']
};

const sesiones = ["Simulación", "Sesión 1", "Sesión 2", "Sesión 3", "Sesión Final"];

function Participante() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
  const [sesion, setSesion] = useState('Simulación');
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [respuestas, setRespuestas] = useState({});

  const handleChange = (riesgo, campo, valor) => {
    const nuevo = { ...respuestas };
    if (!nuevo[riesgo]) nuevo[riesgo] = {};
    nuevo[riesgo][campo] = parseFloat(valor) || 0;
    setRespuestas(nuevo);
  };

  const calcularScore = (r) => {
    const f = r?.frecuencia || 0;
    const i = r?.impacto || 0;
    const impF = r?.importanciaFrecuencia || 0;
    const impI = r?.importanciaImpacto || 0;
    const scoreBase = f * i;
    const scoreFinal = (impF * f + impI * i) / 100;
    return { scoreBase, scoreFinal };
  };

  const handleSubmit = async () => {
    if (!nombre || !empresa || !experiencia || !etapaSeleccionada) {
      alert("Por favor complete todos los campos del participante y seleccione una etapa.");
      return;
    }

    for (const riesgo of Object.keys(respuestas)) {
      const r = respuestas[riesgo];
      const { scoreBase, scoreFinal } = calcularScore(r);

      const { error } = await supabase.from('respuestas').insert([{
        timestamp: new Date().toISOString(),
        etapa: etapaSeleccionada,
        sesion: sesion,
        riesgo,
        frecuencia: r.frecuencia,
        impacto: r.impacto,
        importancia_frecuencia: r.importanciaFrecuencia,
        importancia_impacto: r.importanciaImpacto,
        score_base: scoreBase,
        score_final: scoreFinal,
        nombre_participante: nombre,
        empresa: empresa,
        experiencia_anios: experiencia
      }]);

      if (error) {
        console.error('Error en Supabase:', error);
        alert(`Error al guardar el riesgo: ${riesgo}\n${error.message}`);
        return;
      }
    }

    alert('Respuestas enviadas con éxito.');
    setRespuestas({});
    setEtapaSeleccionada('');
    setNombre('');
    setEmpresa('');
    setExperiencia('');
  };

  const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];

  return (
    <div
      style={{
        backgroundImage: 'url("/edificio.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '1100px',
          width: '90%',
          height: '90%',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#222' }}>P6 – Proyecto Riesgos</h1>
        <h2 style={{ fontSize: '1.1rem', color: '#444', marginBottom: '1rem' }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input className="border p-2 rounded" placeholder="Nombre del participante" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Años de experiencia" type="number" min="0" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select className="border p-2 rounded w-full" value={sesion} onChange={(e) => setSesion(e.target.value)}>
            {sesiones.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="border p-2 rounded w-full" value={etapaSeleccionada} onChange={(e) => {
            setEtapaSeleccionada(e.target.value);
            setRespuestas({});
          }}>
            <option value="">-- Seleccione Etapa del Proyecto --</option>
            {Object.keys(riesgosPorEtapa).map((etapa) => (
              <option key={etapa} value={etapa}>{etapa}</option>
            ))}
          </select>
        </div>

        {riesgos.map((riesgo, index) => {
          const r = respuestas[riesgo] || {};
          const { scoreBase, scoreFinal } = calcularScore(r);

          return (
            <details key={index} className="border p-3 mb-4 rounded bg-white shadow text-left">
              <summary className="font-semibold cursor-pointer text-gray-800">{riesgo}</summary>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label>Frecuencia (1-5)</label>
                  <input type="number" min="1" max="5" className="border w-full p-1 rounded" value={r.frecuencia || ''} onChange={(e) => handleChange(riesgo, 'frecuencia', e.target.value)} />
                </div>
                <div>
                  <label>Impacto (1-5)</label>
                  <input type="number" min="1" max="5" className="border w-full p-1 rounded" value={r.impacto || ''} onChange={(e) => handleChange(riesgo, 'impacto', e.target.value)} />
                </div>
                <div>
                  <label>% Importancia Frecuencia</label>
                  <input type="number" min="0" max="100" className="border w-full p-1 rounded" value={r.importanciaFrecuencia || ''} onChange={(e) => handleChange(riesgo, 'importanciaFrecuencia', e.target.value)} />
                </div>
                <div>
                  <label>% Importancia Impacto</label>
                  <input type="number" min="0" max="100" className="border w-full p-1 rounded" value={r.importanciaImpacto || ''} onChange={(e) => handleChange(riesgo, 'importanciaImpacto', e.target.value)} />
                </div>
              </div>
              <p className="text-sm mt-2 text-gray-800">
                <strong>Score Base:</strong> {scoreBase.toFixed(2)} | <strong>Score Final:</strong> {scoreFinal.toFixed(2)}
              </p>
            </details>
          );
        })}

        {etapaSeleccionada && riesgos.length > 0 && (
          <button
            onClick={handleSubmit}
            style={{
              marginTop: '1rem',
              padding: '12px 24px',
              backgroundColor: '#1e90ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Enviar evaluación
          </button>
        )}
      </div>
    </div>
  );
}

export default Participante;
