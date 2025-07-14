import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Focus Group - Riesgos en Construcción</h1>
      <img
        src="/proyecto.jpg"
        alt="Imagen del Proyecto"
        style={{ width: '300px', marginTop: '20px', borderRadius: '10px' }}
      />
      <div style={{ marginTop: '30px' }}>
        <Link to="/participante">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>Participante</button>
        </Link>
        <Link to="/moderador">
          <button style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '20px' }}>
            Moderador
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
