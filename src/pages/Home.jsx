import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/edificio.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* CONTENEDOR CENTRAL */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
        }}
      >
        {/* LOGO */}
        <img
          src="/proyecto.jpg"
          alt="Logo del Proyecto"
          style={{
            width: '160px',
            height: 'auto',
            marginBottom: '20px',
          }}
        />

        {/* TÍTULOS */}
        <h1
          style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            color: '#222',
            marginBottom: '1rem',
          }}
        >
          P6 – Proyecto Riesgos
        </h1>
        <h2
          style={{
            fontSize: '1.1rem',
            color: '#333',
            marginBottom: '2rem',
            lineHeight: '1.4',
          }}
        >
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

        {/* BOTÓN */}
        <button
          onClick={() => navigate('/participante')}
          style={{
            padding: '12px 28px',
            fontSize: '1rem',
            backgroundColor: '#1e90ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '240px',
          }}
        >
          Participar en Sesión
        </button>
      </div>
    </div>
  );
}

export default Home;

