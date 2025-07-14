import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      background: 'linear-gradient(to bottom right, #f4f1ee, #d0e9d1)',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#222' }}>
        Focus Group – Proyectos P6
      </h1>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#333' }}>
        Evaluación de riesgos en construcción industrializada en madera
      </h2>
      <img
        src="/proyecto.jpg"
        alt="Logo del proyecto"
        style={{ width: '300px', maxWidth: '80%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/participante')}
          style={{
            backgroundColor: '#1e90ff',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Participar en Sesión
        </button>
        <button
          onClick={() => navigate('/moderador')}
          style={{
            backgroundColor: '#9b59b6',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Panel Administrador
        </button>
      </div>
    </div>
  );
}

export default Home;

