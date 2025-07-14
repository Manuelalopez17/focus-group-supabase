import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#1a1a1a',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Focus Group – Riesgos en Construcción
      </h1>

      <img
        src="/proyecto.jpg"
        alt="Imagen del Proyecto"
        style={{
          width: '300px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />

      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/participante">
          <button style={botonEstilo}>Participante</button>
        </Link>
        <Link to="/moderador">
          <button style={botonEstilo}>Moderador</button>
        </Link>
      </div>
    </div>
  )
}

const botonEstilo = {
  padding: '12px 24px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
}

export default Home
