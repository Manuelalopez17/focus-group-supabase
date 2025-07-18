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

const todasLasEtapas = [
  "Suministro", "Prefactibilidad", "Factibilidad", "Planeación", "Contratación",
  "Diseño", "Fabricación", "Logística y Transporte", "Montaje", "Construcción",
  "Puesta en marcha", "Disposición final", "Postventa", "Operación", "Mantenimiento",
  "Evaluación", "Reutilización", "Fin de vida", "Supervisión", "Control de calidad", "Interventoría"
];

const sesiones = [
  "Simulación",
  "Sesión 1",
  "Sesión 2",
  "Sesión 3",
  "Sesión Final"
];

function Participante() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
  const [sesion, setSesion] = useState('Simulación');
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [evaluando, setEvaluando] = useState(false);

  const handleChange = (riesgo, campo, valor) => {
    const nuevo = { ...respuestas };
    if (!nuevo[riesgo]) nuevo[riesgo] = {};

    if (campo === 'importanciaImpacto') {
      const importanciaImpacto = parseFloat(valor) || 0;
      const importanciaFrecuencia = 100 - importanciaImpacto;
      nuevo[riesgo]['importanciaImpacto'] = importanciaImpacto;
      nuevo[riesgo]['importanciaFrecuencia'] = importanciaFrecuencia;
    } else if (campo === 'etapas_afectadas') {
      const opciones = Array.from(e.target.selectedOptions, option => option.value);
      nuevo[riesgo]['etapas_afectadas'] = opciones;
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
    if (!nombre || !empresa || !experiencia || !etapaSeleccionada) {
      alert("Por favor complete todos los campos.");
      return;
    }

    for (const riesgo of Object.keys(respuestas)) {
      const r = respuestas[riesgo];
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
        experiencia_anios: experiencia,
        etapas_afectadas: r.etapas_afectadas || []
      }]);

      if (error) {
        console.error('Error al guardar en Supabase:', error);
        alert(`Error al guardar el riesgo: ${riesgo}`);
        return;
      }
    }

    alert('Respuestas enviadas correctamente.');
    setEvaluando(false);
    setRespuestas({});
    setEtapaSeleccionada('');
    setNombre('');
    setEmpresa('');
    setExperiencia('');
  };

  const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];

  return (
    <div style={{
      backgroundImage: 'url("/edificio.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: '40px',
        borderRadius: '12px',
        width: '90%',
        maxHeight: '90%',
        overflowY: 'auto'
      }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>P6 – Proyecto Riesgos</h1>
        <h2 style={{ textAlign: 'center' }}>Evaluación de riesgos en construcción industrializada en madera</h2>

        {!evaluando ? (
          <>
            <input className="border p-2 m-2" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input className="border p-2 m-2" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            <input className="border p-2 m-2" placeholder="Años de experiencia" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />

            <select className="border p-2 m-2" value={sesion} onChange={(e) => setSesion(e.target.value)}>
              {sesiones.map(s => <option key={s}>{s}</option>)}
            </select>

            <select className="border p-2 m-2" value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
              <option value="">-- Seleccione Etapa --</option>
              {Object.keys(riesgosPorEtapa).map(etapa => <option key={etapa}>{etapa}</option>)}
            </select>

            <button
              className="bg-blue-500 text-white p-2 rounded m-2"
              onClick={() => {
                if (!nombre || !empresa || !experiencia || !etapaSeleccionada) {
                  alert("Complete todos los campos.");
                  return;
                }
                setEvaluando(true);
              }}>
              Comenzar evaluación
            </button>
          </>
        ) : (
          <>
            {riesgos.map((riesgo, index) => {
              const r = respuestas[riesgo] || {};
              const { scoreBase, scoreFinal } = calcularScore(r);

              return (
                <div key={index} className="border p-4 my-4 bg-white rounded">
                  <strong>{riesgo}</strong>

                  {sesion === 'Sesión 2' ? (
                    <div className="mt-2">
                      <label>¿Qué etapas afecta este riesgo?</label>
                      <select
                        multiple
                        className="w-full border p-2 mt-1"
                        value={r.etapas_afectadas || []}
                        onChange={(e) => handleChange(riesgo, 'etapas_afectadas', e)}
                      >
                        {todasLasEtapas.map(etapa => (
                          <option key={etapa} value={etapa}>{etapa}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <label>Frecuencia (1-5)</label>
                        <input type="number" min="1" max="5" value={r.frecuencia || ''} onChange={(e) => handleChange(riesgo, 'frecuencia', e.target.value)} className="w-full border p-1 rounded" />
                      </div>
                      <div>
                        <label>Impacto (1-5)</label>
                        <input type="number" min="1" max="5" value={r.impacto || ''} onChange={(e) => handleChange(riesgo, 'impacto', e.target.value)} className="w-full border p-1 rounded" />
                      </div>
                      <div>
                        <label>% Importancia Impacto</label>
                        <input type="number" min="0" max="100" value={r.importanciaImpacto || ''} onChange={(e) => handleChange(riesgo, 'importanciaImpacto', e.target.value)} className="w-full border p-1 rounded" />
                      </div>
                      <div>
                        <label>% Importancia Frecuencia</label>
                        <input value={r.importanciaFrecuencia || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
                      </div>
                    </div>
                  )}

                  {sesion !== 'Sesión 2' && (
                    <p className="text-sm mt-2">
                      <strong>Score Base:</strong> {scoreBase.toFixed(2)} | <strong>Score Final:</strong> {scoreFinal.toFixed(2)}
                    </p>
                  )}
                </div>
              );
            })}

            <button className="bg-blue-600 text-white p-3 mt-4 rounded" onClick={handleSubmit}>Enviar evaluación</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Participante;
