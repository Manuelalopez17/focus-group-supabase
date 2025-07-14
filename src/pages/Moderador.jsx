import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Moderador() {
  const [respuestas, setRespuestas] = useState([])

  useEffect(() => {
    fetchRespuestas()
    const subscription = supabase
      .channel('realtime_riesgos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'respuestas'
      }, () => {
        fetchRespuestas()
      })
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

  // Calcular promedios por riesgo
  const calcularPromedios = () => {
    const agrupado = {}
    respuestas.forEach(r => {
      const clave = `${r.etapa} - ${r.riesgo}`
      const base = r.impacto * r.frecuencia
      const final = base * ((r.importancia_impacto / 5 + r.importancia_frecuencia / 5) / 2)

      if (!agrupado[clave]) {
        agrupado[clave] = { total: 0, count: 0 }
      }

      agrupado[clave].total += final
      agrupado[clave].count += 1
    })

    const etiquetas = Object.keys(agrupado)
    const valores = etiquetas.map(k => (agrupado[k].total / agrupado[k].count).toFixed(2))

    return { etiquetas, valores }
  }

  const { etiquetas, valores } = calcularPromedios()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel del Moderador</h2>

      {/* Sección 1: Tabla de respuestas */}
      <h3>Respuestas en tiempo real</h3>
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

      {/* Sección 2: Gráfico de barras */}
      <h3 style={{ marginTop: '40px' }}>Promedio de Score Final por Riesgo</h3>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <Bar
          data={{
            labels: etiquetas,
            datasets: [
              {
                label: 'Score Final Promedio',
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.7)'
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>

      {/* Sección 3: Matriz 5x5 */}
      <h3 style={{ marginTop: '40px' }}>Matriz 5x5 – Impacto vs. Frecuencia</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th></th>
            {[1, 2, 3, 4, 5].map(f => <th key={f}>F{f}</th>)}
          </tr>
        </thead>
        <tbody>
          {[5, 4, 3, 2, 1].map(i => (
            <tr key={i}>
              <th>I{i}</th>
              {[1, 2, 3, 4, 5].map(f => {
                const riesgos = respuestas.filter(r => r.impacto === i && r.frecuencia === f)
                return (
                  <td key={`${i}-${f}`} style={{ width: '100px', height: '60px', fontSize: '10px' }}>
                    {riesgos.map(r => (
                      <div key={r.id}>{r.riesgo}</div>
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

