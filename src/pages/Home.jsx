import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState('');

  const handleClick = () => {
    if (!sesion) {
      alert('Por favor seleccione una sesión antes de continuar.');
      return;
    }
    navigate(`/participante?sesion=${encodeURIComponent(sesion)}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/edificio.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}>
        <img
          src="/proyecto.jpg"
          alt="Logo del Proyecto"
          style={{
            width: '160px',
            marginBottom: '20px'
          }}
        />
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '0.5rem'
        }}>
          Focus Group – Proyectos P6
        </h1>
        <h2 style={{
          fontSize: '1.1rem',
          color: '#555',
          marginBottom: '1.8rem'
        }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

        <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Seleccione una sesión:</label>
        <select
          value={sesion}
          onChange={(e) => setSesion(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            width: '100%',
            marginBottom: '20px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">-- Seleccionar --</option>
          <option value="Simulación">Simulación</option>
          <option value="Sesión 1">Sesión 1</option>
          <option value="Sesión 2">Sesión 2</option>
          <option value="Sesión Final">Sesión Final</option>
        </select>

        <button
          onClick={handleClick}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#1e90ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Participar en Sesión
        </button>
      </div>
    </div>
  );
}

export default Home;
