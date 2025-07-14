import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cream to-green-100">
      <div className="text-center px-6 py-10 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Focus Group – Proyectos P6
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Evaluación de riesgos en construcción industrializada en madera
        </p>
        <div className="flex justify-center mb-8">
          <img
            src="/proyecto.jpg"
            alt="Logo del proyecto"
            className="w-64 h-auto rounded-xl shadow-md"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/participante">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Participar en Sesión
            </button>
          </Link>
          <Link to="/moderador">
            <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
              Panel Administrador
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
