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

const todasLasEtapas = Object.keys(riesgosPorEtapa);

const sesiones = [
  "Simulación",
  "Sesión 1",
  "Sesión 2",
  "Sesión 3",
  "Sesión Final"
];

function Participante() {
  const [sesion, setSesion] = useState('Simulación');
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [evaluando, setEvaluando] = useState(false);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');

  const handleCheckboxChange = (riesgo, etapa) => {
    const actual = respuestas[riesgo]?.etapas_afectadas || [];
    const actualizado = actual.includes(etapa)
      ? actual.filter(e => e !== etapa)
      : [...actual, etapa];

    setRespuestas(prev => ({
      ...prev,
      [riesgo]: {
        ...prev[riesgo],
        etapas_afectadas: actualizado
      }
    }));
  };

  const handleChange = (riesgo, campo, valor) => {
    const nuevo = { ...respuestas };
    if (!nuevo[riesgo]) nuevo[riesgo] = {};

    if (campo === 'importanciaImpacto') {
      const importanciaImpacto = parseFloat(valor) || 0;
      const importanciaFrecuencia = 100 - importanciaImpacto;
      nuevo[riesgo]['importanciaImpacto'] = importanciaImpacto;
      nuevo[riesgo]['importanciaFrecuencia'] = importanciaFrecuencia;
    } else {
      nuevo[riesgo][campo] = parseFloat(valor) || 0;
    }

    setRespuestas(nuevo);
  };

  const calcularScore = (r) => {
    const f = r?.frecuencia || 0;
    const i = r?.impacto || 0;
    const impF = r?.importanciaFrecuencia || 0;
    const impI = r?.importanciaImpacto || 0;
    const scoreBase = f * i;
    const scoreFinal = (impI * i + impF * f) / 100;
    return { scoreBase, scoreFinal };
  };

  const handleSubmit = async () => {
    if (!nombre || !empresa || !experiencia) {
      alert("Por favor complete todos los campos del participante.");
      return;
    }

    for (const [riesgo, r] of Object.entries(respuestas)) {
      if (sesion === 'Sesión 2') {
        const { error } = await supabase.from('respuestas').insert([{
          timestamp: new Date().toISOString(),
          sesion,
          riesgo,
          nombre_participante: nombre,
          empresa,
          experiencia_anios: experiencia,
          etapas_afectadas: r.etapas_afectadas || []
        }]);

        if (error) {
          console.error('Error Supabase:', error);
          alert(`Error al guardar: ${riesgo}\n${error.message}`);
          return;
        }
      } else {
        const { scoreBase, scoreFinal } = calcularScore(r);
        const { error } = await supabase.from('respuestas').insert([{
          timestamp: new Date().toISOString(),
          etapa: etapaSeleccionada,
          sesion,
          riesgo,
          frecuencia: r.frecuencia,
          impacto: r.impacto,
          importancia_frecuencia: r.importanciaFrecuencia,
          importancia_impacto: r.importanciaImpacto,
          score_base: scoreBase,
          score_final: scoreFinal,
          nombre_participante: nombre,
          empresa,
          experiencia_anios: experiencia
        }]);

        if (error) {
          console.error('Error Supabase:', error);
          alert(`Error al guardar: ${riesgo}\n${error.message}`);
          return;
        }
      }
    }

    alert('Respuestas enviadas con éxito.');
    setEvaluando(false);
    setRespuestas({});
    setEtapaSeleccionada('');
    setNombre('');
    setEmpresa('');
    setExperiencia('');
  };

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
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '1100px',
          width: '90%',
          height: '90%',
          overflowY: 'auto'
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>P6 – Proyecto Riesgos</h1>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

        {!evaluando ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input className="border p-2 rounded" placeholder="Nombre del participante" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input className="border p-2 rounded" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              <input className="border p-2 rounded" placeholder="Años de experiencia" type="number" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
            </div>

            <select className="border p-2 rounded w-full mb-6" value={sesion} onChange={(e) => setSesion(e.target.value)}>
              {sesiones.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {sesion !== 'Sesión 2' && (
              <select className="border p-2 rounded w-full mb-6" value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
                <option value="">-- Seleccione Etapa del Proyecto --</option>
                {Object.keys(riesgosPorEtapa).map((etapa) => <option key={etapa} value={etapa}>{etapa}</option>)}
              </select>
            )}

            <button
              onClick={() => {
                if (!nombre || !empresa || !experiencia || (sesion !== 'Sesión 2' && !etapaSeleccionada)) {
                  alert("Por favor complete todos los campos antes de comenzar.");
                  return;
                }
                setEvaluando(true);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1e90ff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Comenzar evaluación
            </button>
          </>
        ) : (
          <>
            {(sesion === 'Sesión 2' ? Object.entries(riesgosPorEtapa) : [[etapaSeleccionada, riesgosPorEtapa[etapaSeleccionada]]])
              .map(([etapa, riesgos]) => (
                <div key={etapa}>
                  <h3 className="font-bold mt-6 mb-2">{etapa}</h3>
                  {riesgos.map((riesgo, index) => {
                    const r = respuestas[riesgo] || {};
                    const { scoreBase, scoreFinal } = calcularScore(r);

                    return (
                      <div key={index} className="border p-4 mb-4 rounded bg-white shadow text-left">
                        <p className="font-semibold mb-2 text-gray-900">{riesgo}</p>

                        {sesion === 'Sesión 2' ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {todasLasEtapas.map((et) => (
                              <label key={et} className="text-sm">
                                <input
                                  type="checkbox"
                                  checked={r.etapas_afectadas?.includes(et) || false}
                                  onChange={() => handleCheckboxChange(riesgo, et)}
                                  className="mr-1"
                                />
                                {et}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                              <div>
                                <label>Frecuencia (1-5)</label>
                                <input type="number" min="1" max="5" className="border w-full p-1 rounded" value={r.frecuencia || ''} onChange={(e) => handleChange(riesgo, 'frecuencia', e.target.value)} />
                              </div>
                              <div>
                                <label>Impacto (1-5)</label>
                                <input type="number" min="1" max="5" className="border w-full p-1 rounded" value={r.impacto || ''} onChange={(e) => handleChange(riesgo, 'impacto', e.target.value)} />
                              </div>
                              <div>
                                <label>% Importancia Impacto</label>
                                <input type="number" min="0" max="100" className="border w-full p-1 rounded" value={r.importanciaImpacto || ''} onChange={(e) => handleChange(riesgo, 'importanciaImpacto', e.target.value)} />
                              </div>
                              <div>
                                <label>% Importancia Frecuencia</label>
                                <input type="number" min="0" max="100" className="border w-full p-1 rounded" value={r.importanciaFrecuencia || ''} disabled />
                              </div>
                            </div>
                            <p className="text-sm mt-2 text-gray-800">
                              <strong>Score Base:</strong> {scoreBase.toFixed(2)} | <strong>Score Final:</strong> {scoreFinal.toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

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
          </>
        )}
      </div>
    </div>
  );
}

export default Participante;

