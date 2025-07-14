import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(to bottom right, #f4f1ee, #d0e9d1)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '900px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#222', marginBottom: '1rem' }}>
          Focus Group – Proyectos P6
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '2rem' }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>
        <img
          src="/proyecto.jpg"
          alt="Logo del proyecto"
          style={{
            width: '300px',
            maxWidth: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/participante')}
            style={{
              backgroundColor: '#1e90ff',
              color: '#fff',
              padding: '12px 24px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            Participar en Sesión
          </button>
          <button
            onClick={() => navigate('/moderador')}
            style={{
              backgroundColor: '#9b59b6',
              color: '#fff',
              padding: '12px 24px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            Panel Administrador
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
