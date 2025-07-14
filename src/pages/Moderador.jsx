import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function Moderador() {
  const [respuestas, setRespuestas] = useState([])
  const [sesionSeleccionada, setSesionSeleccionada] = useState('simulacion')

  useEffect(() => {
    fetchRespuestas()

    const subscription = supabase
      .channel('realtime_riesgos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'respuestas' },
        () => {
          fetchRespuestas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [sesionSeleccionada])

  const fetchRespuestas = async () => {
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .eq('sesion', sesionSeleccionada)

    if (!error && data) setRespuestas(data)
  }

  const calcularPromedios = () => {
    const agrupados = {}
    for (const r of respuestas) {
      const clave = `${r.etapa}||${r.riesgo}`
      if (!agrupados[clave]) {
        agrupados[clave] = {
          etapa: r.etapa,
          riesgo: r.riesgo,
          frecuencia: [],
          impacto: [],
          importancia_frecuencia: [],
          importancia_impacto: []
        }
      }
      agrupados[clave].frecuencia.push(r.frecuencia)
      agrupados[clave].impacto.push(r.impacto)
      agrupados[clave].importancia_frecuencia.push(r.importancia_frecuencia)
      agrupados[clave].importancia_impacto.push(r.importancia_impacto)
    }

    return Object.values(agrupados).map((grupo) => {
      const promedio = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
      const frecuencia = promedio(grupo.frecuencia)
      const impacto = promedio(grupo.impacto)
      const importancia_frecuencia = promedio(grupo.importancia_frecuencia)
      const importancia_impacto = promedio(grupo.importancia_impacto)
      const score_base = frecuencia * impacto
      const score_final = score_base * (importancia_frecuencia + importancia_impacto) / 100

      return {
        etapa: grupo.etapa,
        riesgo: grupo.riesgo,
        frecuencia: frecuencia.toFixed(2),
        impacto: impacto.toFixed(2),
        importancia_frecuencia: importancia_frecuencia.toFixed(2),
        importancia_impacto: importancia_impacto.toFixed(2),
        score_base: score_base.toFixed(2),
        score_final: score_final.toFixed(2)
      }
    }).sort((a, b) => b.score_final - a.score_final)
  }

  const promedios = calcularPromedios()

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel del Moderador</h2>

      <label className="block mb-2 font-semibold">Seleccionar sesión:</label>
      <select
        className="border p-2 mb-6 rounded"
        value={sesionSeleccionada}
        onChange={(e) => setSesionSeleccionada(e.target.value)}
      >
        <option value="simulacion">Simulación</option>
        <option value="sesion_final">Sesión Final</option>
      </select>

      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Etapa</th>
            <th className="border px-2 py-1">Riesgo</th>
            <th className="border px-2 py-1">Frecuencia</th>
            <th className="border px-2 py-1">Impacto</th>
            <th className="border px-2 py-1">Importancia F</th>
            <th className="border px-2 py-1">Importancia I</th>
            <th className="border px-2 py-1">Score Base</th>
            <th className="border px-2 py-1">Score Final</th>
          </tr>
        </thead>
        <tbody>
          {promedios.map((r, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{r.etapa}</td>
              <td className="border px-2 py-1">{r.riesgo}</td>
              <td className="border px-2 py-1">{r.frecuencia}</td>
              <td className="border px-2 py-1">{r.impacto}</td>
              <td className="border px-2 py-1">{r.importancia_frecuencia}</td>
              <td className="border px-2 py-1">{r.importancia_impacto}</td>
              <td className="border px-2 py-1">{r.score_base}</td>
              <td className="border px-2 py-1 font-bold">{r.score_final}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Moderador

