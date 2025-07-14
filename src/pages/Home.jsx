import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(to right, #f4f1ee 0%, #d0e9d1 100%)',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: '2.8rem', textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', color: '#222' }}>
        Focus Group – Proyectos P6
      </h1>

      <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Evaluación de riesgos en construcción industrializada en madera
      </h2>

      <img
        src="/proyecto.jpg"
        alt="Logo del Proyecto"
        style={{
          width: '300px',
          maxWidth: '100%',
          marginBottom: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/participante')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#1e90ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          Participar en Sesión
        </button>
        <button
          onClick={() => navigate('/moderador')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#9b59b6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          Panel Administrador
        </button>
      </div>
    </div>
  );
}

export default Home;
