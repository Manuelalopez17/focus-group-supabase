import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Participante from './pages/Participante'
import Moderador from './pages/Moderador'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participante" element={<Participante />} />
        <Route path="/moderador" element={<Moderador />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

