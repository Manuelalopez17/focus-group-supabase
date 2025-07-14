import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Participante() {
  const [etapa, setEtapa] = useState('')
  const [riesgo, setRiesgo] = useState('')
  const [impacto, setImpacto] = useState(1)
  const [frecuencia, setFrecuencia] = useState(1)
  const [importanciaImpacto, setImportanciaImpacto] = useState(1)
  const [importanciaFrecuencia, setImportanciaFrecuencia] = useState(1)
  const [mensaje, setMensaje] = useState('')

  const scoreBase = impacto * frecuencia
  const scoreFinal =
    scoreBase * (importanciaImpacto / 5 + importanciaFrecuencia / 5) / 2

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('respuestas').insert([
      {
        etapa,
        riesgo,
        impacto,
        frecuencia,
        importancia_impacto: importanciaImpacto,
        importancia_frecuencia: importanciaFrecuencia
      }
    ])

    if (error) {
      setMensaje('Error al guardar la respuesta.')
    } else {
      setMensaje('Respuesta enviada correctamente.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Evaluación de Riesgo</h2>
      <form onSubmit={handleSubmit}>
        <label>Etapa:</label>
        <input value={etapa} onChange={(e) => setEtapa(e.target.value)} required />

        <label>Riesgo:</label>
        <input value={riesgo} onChange={(e) => setRiesgo(e.target.value)} required />

        <label>Impacto (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={impacto}
          onChange={(e) => setImpacto(Number(e.target.value))}
        />

        <label>Frecuencia (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={frecuencia}
          onChange={(e) => setFrecuencia(Number(e.target.value))}
        />

        <label>Importancia Impacto (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={importanciaImpacto}
          onChange={(e) => setImportanciaImpacto(Number(e.target.value))}
        />

        <label>Importancia Frecuencia (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={importanciaFrecuencia}
          onChange={(e) => setImportanciaFrecuencia(Number(e.target.value))}
        />

        <div>Score base: {scoreBase}</div>
        <div>Score final: {scoreFinal.toFixed(2)}</div>

        <button type="submit">Enviar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default Participante
