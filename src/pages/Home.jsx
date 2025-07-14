import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: 'url("/edificio.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Fondo semitransparente para legibilidad */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        <img
          src="/proyecto.jpg"
          alt="Logo Ciudad Madera"
          style={{
            width: '160px',
            marginBottom: '20px'
          }}
        />

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#222' }}>
          P6 – Proyecto Riesgos
        </h1>
        <h2 style={{ fontSize: '1.1rem', color: '#444', marginBottom: '2rem' }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

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
      </div>
    </div>
  );
}

export default Home;

