import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Focus Group – Riesgos en Construcción
      </h1>
      <img
        src="/ciudadmadera.png"
        alt="Logo del Proyecto"
        className="w-64 md:w-80 mb-6 shadow-lg rounded-xl"
      />
      <div className="flex gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
          onClick={() => navigate("/participante")}
        >
          Participante
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
          onClick={() => navigate("/moderador")}
        >
          Moderador
        </button>
      </div>
    </div>
  );
}

export default Home;

