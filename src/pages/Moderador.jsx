import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function Moderador() {
  const [respuestas, setRespuestas] = useState([])
  const [sesionSeleccionada, setSesionSeleccionada] = useState('Simulación')
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('')

  useEffect(() => {
    const obtenerDatos = async () => {
      let query = supabase.from('respuestas').select('*').eq('sesion', sesionSeleccionada)
      if (etapaSeleccionada) query = query.eq('etapa', etapaSeleccionada)
      const { data, error } = await query.order('timestamp', { ascending: false })
      if (!error) setRespuestas(data)
      else console.error("Error al obtener datos:", error)
    }

    obtenerDatos()

    const canal = supabase
      .channel('realtime_riesgos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'respuestas' }, (payload) => {
        if (payload.new?.sesion === sesionSeleccionada) {
          obtenerDatos()
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [sesionSeleccionada, etapaSeleccionada])

  const etapasUnicas = [...new Set(respuestas.map(r => r.etapa))]

  const riesgosAgrupados = respuestas.reduce((acc, r) => {
    const clave = `${r.etapa}||${r.riesgo}`
    if (!acc[clave]) acc[clave] = []
    acc[clave].push(r)
    return acc
  }, {})

  const resumen = Object.entries(riesgosAgrupados).map(([clave, items]) => {
    const [etapa, riesgo] = clave.split('||')
    const promedio = (campo) => items.reduce((acc, val) => acc + val[campo], 0) / items.length
    const impacto = promedio('impacto')
    const frecuencia = promedio('frecuencia')
    const scoreBase = impacto * frecuencia
    const scoreFinal = promedio('score_final')
    return { etapa, riesgo, impacto, frecuencia, scoreBase, scoreFinal }
  }).sort((a, b) => b.scoreFinal - a.scoreFinal)

  const getColor = (impacto, frecuencia) => {
    const matriz = [
      ['#DFF0D8', '#DFF0D8', '#FCF8E3', '#F2DEDE', '#F2DEDE'],
      ['#DFF0D8', '#FCF8E3', '#FCF8E3', '#F2DEDE', '#F2DEDE'],
      ['#FCF8E3', '#FCF8E3', '#F2DEDE', '#F2DEDE', '#F2DEDE'],
      ['#F2DEDE', '#F2DEDE', '#F2DEDE', '#F2DEDE', '#F2DEDE'],
      ['#F2DEDE', '#F2DEDE', '#F2DEDE', '#F2DEDE', '#F2DEDE']
    ]
    return matriz[frecuencia - 1]?.[impacto - 1] || '#FFFFFF'
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel del Moderador</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="font-semibold">Sesión:</label>
        <select className="border p-1 rounded" value={sesionSeleccionada} onChange={(e) => setSesionSeleccionada(e.target.value)}>
          <option value="Simulación">Simulación</option>
          <option value="Sesión Final">Sesión Final</option>
        </select>

        <label className="font-semibold">Etapa:</label>
        <select className="border p-1 rounded" value={etapaSeleccionada} onChange={(e) => setEtapaSeleccionada(e.target.value)}>
          <option value="">Todas</option>
          {etapasUnicas.map((etapa, idx) => (
            <option key={idx} value={etapa}>{etapa}</option>
          ))}
        </select>
      </div>

      <h3 className="font-bold mt-4 mb-2">Registros en Tiempo Real</h3>
      <table className="table-auto text-sm w-full border mb-6">
        <thead>
          <tr>
            <th className="border px-2 py-1">Etapa</th>
            <th className="border px-2 py-1">Riesgo</th>
            <th className="border px-2 py-1">Impacto</th>
            <th className="border px-2 py-1">Frecuencia</th>
            <th className="border px-2 py-1">Importancia I</th>
            <th className="border px-2 py-1">Importancia F</th>
            <th className="border px-2 py-1">Score Final</th>
          </tr>
        </thead>
        <tbody>
          {respuestas.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{r.etapa}</td>
              <td className="border px-2 py-1">{r.riesgo}</td>
              <td className="border px-2 py-1">{r.impacto}</td>
              <td className="border px-2 py-1">{r.frecuencia}</td>
              <td className="border px-2 py-1">{r.importancia_impacto}</td>
              <td className="border px-2 py-1">{r.importancia_frecuencia}</td>
              <td className="border px-2 py-1">{r.score_final?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold mb-2">Ranking de Riesgos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={resumen.slice(0, 10)} layout="vertical" margin={{ left: 60 }}>
          <XAxis type="number" />
          <YAxis dataKey="riesgo" type="category" width={200} />
          <Tooltip />
          <Bar dataKey="scoreFinal">
            {resumen.slice(0, 10).map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#82ca9d" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <h3 className="font-bold mt-6 mb-2">Matriz de Riesgos (5x5)</h3>
      <table className="border text-xs">
        <thead>
          <tr>
            <th className="border px-2 py-1"> </th>
            {[1, 2, 3, 4, 5].map(i => (
              <th key={i} className="border px-2 py-1">Impacto {i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[5, 4, 3, 2, 1].map(f => (
            <tr key={f}>
              <th className="border px-2 py-1">Frecuencia {f}</th>
              {[1, 2, 3, 4, 5].map(i => {
                const riesgosCelda = resumen.filter(r => Math.round(r.impacto) === i && Math.round(r.frecuencia) === f)
                return (
                  <td key={i} style={{ backgroundColor: getColor(i, f), minWidth: '120px' }} className="border p-1">
                    {riesgosCelda.map(r => (
                      <div key={r.riesgo}>{r.riesgo}</div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Moderador
