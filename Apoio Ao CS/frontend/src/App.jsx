import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AreaCS from './pages/AreaCS';
import Bonus from './pages/Bonus';
import EprocTracker from './pages/EprocTracker';
import PlanilhaValores from './pages/PlanilhaValores';
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
      <div className="flex h-screen bg-brand-cream text-brand-navy font-sans">
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
              <Route path="/planilha-valores" element={<PlanilhaValores />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
