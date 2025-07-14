import { useState } from 'react';

const riesgosPorEtapa = {
  Diseño: [
    'Riesgo 1 en Diseño',
    'Riesgo 2 en Diseño',
    'Riesgo 3 en Diseño'
  ],
  Construcción: [
    'Riesgo 1 en Construcción',
    'Riesgo 2 en Construcción',
    'Riesgo 3 en Construcción'
  ],
  Industrialización: [
    'Riesgo 1 en Industrialización',
    'Riesgo 2 en Industrialización',
    'Riesgo 3 en Industrialización'
  ]
};

function Participante() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
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

  const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Evaluación de Riesgos – Participante</h2>

      <label className="block mb-2 font-semibold">Seleccione etapa del proyecto:</label>
      <select
        className="border p-2 mb-6 rounded"
        value={etapaSeleccionada}
        onChange={(e) => {
          setEtapaSeleccionada(e.target.value);
          setRespuestas({});
        }}
      >
        <option value="">-- Seleccione --</option>
        {Object.keys(riesgosPorEtapa).map((etapa) => (
          <option key={etapa} value={etapa}>
            {etapa}
          </option>
        ))}
      </select>

      {riesgos.map((riesgo, index) => {
        const r = respuestas[riesgo] || {};
        const { scoreBase, scoreFinal } = calcularScore(r);

        return (
          <div key={index} className="border p-4 mb-4 rounded shadow-sm bg-white">
            <p className="font-semibold mb-2">{riesgo}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              <div>
                <label>Frecuencia (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="border w-full p-1 rounded"
                  value={r.frecuencia || ''}
                  onChange={(e) => handleChange(riesgo, 'frecuencia', e.target.value)}
                />
              </div>
              <div>
                <label>Impacto (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="border w-full p-1 rounded"
                  value={r.impacto || ''}
                  onChange={(e) => handleChange(riesgo, 'impacto', e.target.value)}
                />
              </div>
              <div>
                <label>% Importancia Frecuencia</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="border w-full p-1 rounded"
                  value={r.importanciaFrecuencia || ''}
                  onChange={(e) => handleChange(riesgo, 'importanciaFrecuencia', e.target.value)}
                />
              </div>
              <div>
                <label>% Importancia Impacto</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="border w-full p-1 rounded"
                  value={r.importanciaImpacto || ''}
                  onChange={(e) => handleChange(riesgo, 'importanciaImpacto', e.target.value)}
                />
              </div>
            </div>

            <p className="text-sm mt-2">
              <strong>Score Base:</strong> {scoreBase.toFixed(2)} | <strong>Score Final Ponderado:</strong> {scoreFinal.toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Participante;
