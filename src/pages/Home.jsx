import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f4f1ee 60%, #ffffff 40%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Logo Ciudad Madera en la esquina superior izquierda */}
      <img
        src="/proyecto.jpg"
        alt="Logo del Proyecto"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '120px',
          height: 'auto',
          zIndex: 2
        }}
      />

      {/* Imagen del edificio en el fondo derecho */}
      <img
        src="/edificio.jpg"
        alt="Edificio Madera"
        style={{
          position: 'absolute',
          right: '0',
          bottom: '0',
          maxHeight: '100%',
          maxWidth: '45%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: 0.95
        }}
      />

      {/* Contenido central */}
      <div style={{
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#222' }}>
          Focus Group – Proyectos P6
        </h1>
        <h2 style={{
          fontSize: '1.3rem',
          color: '#333',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Evaluación de riesgos en construcción industrializada en madera
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="sesion" style={{ fontWeight: 'bold' }}>Seleccione una sesión:</label><br />
          <select id="sesion" style={{
            padding: '8px',
            borderRadius: '6px',
            marginTop: '8px',
            minWidth: '200px'
          }}>
            <option value="">-- Seleccionar --</option>
            <option value="Simulación">Simulación</option>
            <option value="Sesión 1">Sesión 1</option>
            <option value="Sesión 2">Sesión 2</option>
            <option value="Sesión Final">Sesión Final</option>
          </select>
        </div>

        <button
          onClick={() => navigate('/participante')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#1e90ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Participar en Sesión
        </button>
      </div>
    </div>
  );
}

export default Home;
