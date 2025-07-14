import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f4f1ee, #d0e9d1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* LOGO en la esquina superior izquierda */}
      <img
        src="/proyecto.jpg"
        alt="Logo del Proyecto"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '100px',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      />

      {/* CONTENIDO CENTRAL */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '40px' // para no tapar con el logo
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#222',
          marginBottom: '1rem'
        }}>
          Focus Group – Proyectos P6
        </h1>
        <h2 style={{
          fontSize: '1.3rem',
          color: '#333',
          marginBottom: '2.5rem',
          maxWidth: '90%',
          lineHeight: '1.5'
        }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

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
              minWidth: '200px'
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
              minWidth: '200px'
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
