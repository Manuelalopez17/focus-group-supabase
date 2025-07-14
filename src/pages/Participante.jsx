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

function Participante() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
  const [sesion, setSesion] = useState('Simulación');
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
    const scoreFinal = scoreBase * (impF + impI) / 100;
    return { scoreBase, scoreFinal };
  };

  const handleSubmit = async () => {
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
        score_final: scoreFinal
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
  };

  const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/edificio.jpg')" }}
    >
      <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-8 w-full max-w-6xl mx-4 overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          P6 – Proyecto Riesgos
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
          <div className="w-full md:w-1/2">
            <label className="block mb-1 font-semibold text-gray-800">Seleccione la sesión:</label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={sesion}
              onChange={(e) => setSesion(e.target.value)}
            >
              <option value="Simulación">Simulación</option>
              <option value="Sesión Final">Sesión Final</option>
            </select>
          </div>
          <div className="w-full md:w-1/2">
            <label className="block mb-1 font-semibold text-gray-800">Seleccione etapa del proyecto:</label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={etapaSeleccionada}
              onChange={(e) => {
                setEtapaSeleccionada(e.target.value);
                setRespuestas({});
              }}
            >
              <option value="">-- Seleccione --</option>
              {Object.keys(riesgosPorEtapa).map((etapa) => (
                <option key={etapa} value={etapa}>{etapa}</option>
              ))}
            </select>
          </div>
        </div>

        {riesgos.map((riesgo, index) => {
          const r = respuestas[riesgo] || {};
          const { scoreBase, scoreFinal } = calcularScore(r);

          return (
            <div key={index} className="border p-4 mb-4 rounded bg-white shadow">
              <p className="font-semibold mb-2">{riesgo}</p>
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
                  <label>% Importancia Frecuencia</label>
                  <input type="number" min="0" max="100" className="border w-full p-1 rounded" value={r.importanciaFrecuencia || ''} onChange={(e) => handleChange(riesgo, 'importanciaFrecuencia', e.target.value)} />
                </div>
                <div>
                  <label>% Importancia Impacto</label>
                  <input type="number" min="0" max="100" className="border w-full p-1 rounded" value={r.importanciaImpacto || ''} onChange={(e) => handleChange(riesgo, 'importanciaImpacto', e.target.value)} />
                </div>
              </div>
              <p className="text-sm mt-2">
                <strong>Score Base:</strong> {scoreBase.toFixed(2)} | <strong>Score Final Ponderado:</strong> {scoreFinal.toFixed(2)}
              </p>
            </div>
          );
        })}

        {etapaSeleccionada && riesgos.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded mt-4"
            >
              Enviar evaluación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Participante;
