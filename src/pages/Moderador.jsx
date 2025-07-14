import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function Moderador() {
  const [respuestas, setRespuestas] = useState([])
  const [sesionSeleccionada, setSesionSeleccionada] = useState('simulacion')

  useEffect(() => {
    fetchRespuestas()
    const subscription = supabase
      .channel('realtime_riesgos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'respuestas' }, fetchRespuestas)
      .subscribe()
    return () => supabase.removeChannel(subscription)
  }, [sesionSeleccionada])

  const fetchRespuestas = async () => {
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .eq('sesion', sesionSeleccionada)
      .order('timestamp', { ascending: false })

    if (!error) setRespuestas(data)
  }

  const riesgosAgrupados = respuestas.reduce((acc, r) => {
    const clave = `${r.etapa}-${r.riesgo}`
    if (!acc[clave]) acc[clave] = []
    acc[clave].push(r)
    return acc
  }, {})

  const resumen = Object.entries(riesgosAgrupados).map(([clave, items]) => {
    const [etapa, riesgo] = clave.split('-')
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
    <div style={{ padding: '20px' }}>
      <h2 className="text-xl font-bold mb-4">Panel del Moderador</h2>

      <label className="font-semibold mr-2">Seleccionar sesión:</label>
      <select
        className="border p-1 rounded mb-4"
        value={sesionSeleccionada}
        onChange={(e) => setSesionSeleccionada(e.target.value)}
      >
        <option value="simulacion">Simulación</option>
        <option value="final">Sesión Final</option>
      </select>

      <h3 className="font-bold mt-6 mb-2">Ranking de Riesgos</h3>
      <table border="1" cellPadding="5" className="mb-6 w-full">
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Riesgo</th>
            <th>Impacto</th>
            <th>Frecuencia</th>
            <th>Score Base</th>
            <th>Score Final</th>
          </tr>
        </thead>
        <tbody>
          {resumen.map((r, idx) => (
            <tr key={idx}>
              <td>{r.etapa}</td>
              <td>{r.riesgo}</td>
              <td>{r.impacto.toFixed(2)}</td>
              <td>{r.frecuencia.toFixed(2)}</td>
              <td>{r.scoreBase.toFixed(2)}</td>
              <td>{r.scoreFinal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold mb-2">Gráfico de Score Final</h3>
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
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th></th>
            {[1, 2, 3, 4, 5].map(i => <th key={i}>Impacto {i}</th>)}
          </tr>
        </thead>
        <tbody>
          {[5, 4, 3, 2, 1].map(f => (
            <tr key={f}>
              <th>Frecuencia {f}</th>
              {[1, 2, 3, 4, 5].map(i => {
                const riesgosCelda = resumen.filter(r => Math.round(r.impacto) === i && Math.round(r.frecuencia) === f)
                return (
                  <td key={i} style={{ backgroundColor: getColor(i, f), minWidth: '120px' }}>
                    {riesgosCelda.map(r => (
                      <div key={r.riesgo} style={{ fontSize: '12px' }}>{r.riesgo}</div>
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
