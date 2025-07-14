import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState('');

  const irAParticipante = () => {
    if (!sesion) {
      alert('Por favor seleccione una sesión.');
      return;
    }
    navigate(`/participante?sesion=${encodeURIComponent(sesion)}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom right, #f4f1ee, #d0e9d1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* LOGO SUPERIOR IZQUIERDA */}
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

      <h1 style={{
        fontSize: '2.8rem',
        fontWeight: 'bold',
        color: '#222',
        marginBottom: '1rem'
      }}>
        Focus Group – Proyectos P6
      </h1>
      <h2 style={{
        fontSize: '1.4rem',
        color: '#333',
        marginBottom: '2rem',
        maxWidth: '90%',
        lineHeight: '1.5'
      }}>
        Evaluación de riesgos en construcción industrializada en madera
      </h2>

      {/* SELECCIÓN DE SESIÓN */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Seleccione una sesión:</label>
        <select
          value={sesion}
          onChange={(e) => setSesion(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px' }}
        >
          <option value="">-- Seleccionar --</option>
          <option value="Simulación">Simulación</option>
          <option value="Sesión 1">Sesión 1</option>
          <option value="Sesión 2">Sesión 2</option>
          <option value="Sesión Final">Sesión Final</option>
        </select>
      </div>

      {/* BOTÓN DE INGRESO */}
      <button
        onClick={irAParticipante}
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
  );
}

export default Home;
