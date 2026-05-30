import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AreaCS from './pages/AreaCS';
import Bonus from './pages/Bonus';
import EprocTracker from './pages/EprocTracker';
import Configuracoes from './pages/Configuracoes';
import EquipeCS from './pages/EquipeCS';
import Quitacoes from './pages/Quitacoes';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('Gerente'); // Defaulting to Gerente for mock preview

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-brand-cream text-brand-navy font-sans relative">
        
        {/* Seletor de Perfil (Flutuante para Testes) */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-xl border border-slate-200 z-50 flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Visualizando como:</span>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-brand-navy text-white text-sm font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer"
          >
            <option value="Gerente">Gerente / Supervisor</option>
            <option value="CS">Agente CS (Normal)</option>
          </select>
        </div>

        <Sidebar role={role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard role={role} />} />
              <Route path="/meus-clientes" element={<AreaCS />} />
              <Route path="/equipe-cs" element={<EquipeCS />} />
              <Route path="/quitacoes" element={<Quitacoes role={role} />} />
              <Route path="/bonus" element={<Bonus />} />
              <Route path="/eproc-tracker" element={<EprocTracker />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
