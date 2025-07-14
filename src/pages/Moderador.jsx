import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function Moderador() {
  const [respuestas, setRespuestas] = useState([])

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
  }, [])

  const fetchRespuestas = async () => {
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .order('timestamp', { ascending: false })

    if (!error) setRespuestas(data)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel del Moderador</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Riesgo</th>
            <th>Impacto</th>
            <th>Frecuencia</th>
            <th>Score Base</th>
            <th>Importancia I</th>
            <th>Importancia F</th>
            <th>Score Final</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {respuestas.map((r) => {
            const base = r.impacto * r.frecuencia
            const final =
              base * ((r.importancia_impacto / 5 + r.importancia_frecuencia / 5) / 2)
            return (
              <tr key={r.id}>
                <td>{r.etapa}</td>
                <td>{r.riesgo}</td>
                <td>{r.impacto}</td>
                <td>{r.frecuencia}</td>
                <td>{base}</td>
                <td>{r.importancia_impacto}</td>
                <td>{r.importancia_frecuencia}</td>
                <td>{final.toFixed(2)}</td>
                <td>{new Date(r.timestamp).toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Moderador
