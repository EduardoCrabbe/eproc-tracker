import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, Settings, LogOut, Activity, Trophy, Calculator, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ role, isDarkMode, toggleDarkMode }) {
  const isManager = role === 'Gerente' || role === 'Supervisor';

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Início' },
    ...(isManager ? [{ to: '/equipe-cs', icon: Users, label: 'Equipe CS' }] : []),
    ...(!isManager ? [{ to: '/meus-clientes', icon: Users, label: 'Meus Clientes' }] : []),
    { to: '/quitacoes', icon: Activity, label: 'Quitações' },
    { to: '/bonus', icon: Trophy, label: 'Bônus e Comissões' },
    { to: '/eproc-tracker', icon: Activity, label: 'Monitoramento' },
    ...(isManager ? [{ to: '/configuracoes', icon: Settings, label: 'Configurações' }] : []),
  ];

  return (
    <aside className="w-64 bg-brand-navy dark:bg-[#071120] text-white flex flex-col shadow-2xl transition-colors duration-300">
      <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 dark:border-slate-800 pt-4">
        <h1 className="text-2xl font-serif tracking-widest text-white border-b border-brand-bronze pb-1 px-4">APOIO</h1>
        <span className="text-xs tracking-[0.3em] mt-2 text-white/80">ao CS</span>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-gold text-brand-navy shadow-md transform scale-[1.02]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 dark:border-slate-800 bg-white/5 dark:bg-slate-900/50">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold text-brand-navy flex items-center justify-center font-bold text-lg">
                E
              </div>
              <div>
                <div className="text-sm font-bold text-white">Edu crabbe</div>
                <div className="text-xs text-brand-gold font-bold tracking-wider">NÍVEL 1</div>
              </div>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-brand-gold"
              title="Alternar Modo Escuro"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Ganhos</span>
            <span className="text-sm font-bold text-white">R$ 0,00</span>
          </div>
        </div>

        <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium px-2 py-2 w-full">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
