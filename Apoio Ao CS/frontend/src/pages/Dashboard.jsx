import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertOctagon, AlertTriangle, CheckCircle2, Search, PlusCircle, Calendar as CalendarIcon, Clock, Filter, AlertCircle, RefreshCw, PhoneForwarded, DollarSign, BellRing } from 'lucide-react';

export default function Dashboard({ role }) {
  const isManager = role === 'Gerente' || role === 'Supervisor';
  const username = "educrabbe"; // Simulação
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/dashboard/stats";
  const EPROC_URL = "http://127.0.0.1:8000/api/clientes";

  const [stats, setStats] = useState({
    totalClientes: 0,
    naoAtendidos: 0, naoAtendidosPct: 0,
    tentativas: 0,
    atendidos: 0, atendidosPct: 0,
    ganhosTotais: 0,
    prioridades: []
  });

  const [now, setNow] = useState(Date.now());
  const [alertasCriticos, setAlertasCriticos] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchEprocAlerts();
    const interval = setInterval(() => {
      setNow(Date.now());
      fetchEprocAlerts();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchEprocAlerts = async () => {
    try {
      const res = await fetch(`${EPROC_URL}?user=${username}`);
      if (res.ok) {
        const data = await res.json();
        const qtdCriticos = data.clientes?.filter(c => 
          c.triagem && (c.triagem.includes("VERMELHO") || c.triagem.includes("REQUER"))
        ).length || 0;
        setAlertasCriticos(qtdCriticos);
      }
    } catch (e) {
      console.error("Erro ao buscar alertas do Eproc", e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}?user=${username}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Erro ao buscar stats do dashboard", e);
    }
  };

  // Agenda / Tarefas originais
  const [tarefas, setTarefas] = useState([
    { id: 1, cs: 'Edu crabbe', setor: 'Sistema Automático', classificacao: 'CRÍTICA/URGENTE', data: '2026-05-27', detalhes: 'Falar com o cliente Eduardo Crabbe (Crítico) em 6 dias.', mesAnterior: false, auto: true }
  ]);

  const [novaTarefa, setNovaTarefa] = useState({
    setor: 'Mediação/Negociação',
    classificacao: 'REGULAR',
    data: '',
    detalhes: ''
  });

  const [filtroCS, setFiltroCS] = useState('Todos');

  const handleAddTarefa = (e) => {
    e.preventDefault();
    if (!novaTarefa.data || !novaTarefa.detalhes) return;
    
    setTarefas([...tarefas, { id: Date.now(), cs: isManager ? 'Gerente' : 'Edu crabbe', ...novaTarefa, mesAnterior: false }]);
    setNovaTarefa({ setor: 'Mediação/Negociação', classificacao: 'REGULAR', data: '', detalhes: '' });
  };

  const deleteTarefa = (id) => setTarefas(tarefas.filter(t => t.id !== id));
  
  const adiarTarefa = (id) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, mesAnterior: false, data: new Date().toISOString().split('T')[0] } : t));
  };

  let tarefasFiltradas = [...tarefas].sort((a, b) => new Date(a.data) - new Date(b.data));
  if (isManager && filtroCS !== 'Todos') tarefasFiltradas = tarefasFiltradas.filter(t => t.cs === filtroCS);
  else if (!isManager) tarefasFiltradas = tarefasFiltradas.filter(t => t.cs === 'Edu crabbe'); 

  const getClassificacaoStyle = (tipo) => {
    switch(tipo) {
      case 'CRÍTICA/URGENTE': return 'bg-red-100 text-red-700 border-red-200';
      case 'REGULAR': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'LEMBRETE': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Tarja de Alertas Críticos (Eproc) */}
      {alertasCriticos > 0 && (
        <div className="bg-red-600/95 border-b-4 border-brand-gold text-white px-6 py-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <BellRing className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-brand-gold uppercase tracking-wider">Atenção Necessária!</h3>
              <p className="text-sm font-medium">Foram detectados <span className="font-bold underline">{alertasCriticos} clientes</span> com mandados ou petições críticas na última varredura do robô.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/eproc-tracker')}
            className="bg-brand-gold text-brand-navy hover:bg-yellow-400 font-bold px-6 py-2.5 rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Verificar Agora
          </button>
        </div>
      )}

      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy dark:text-white">Painel de Controle</h2>
          <p className="text-brand-bronze mt-1">Visão geral do comissionamento e saúde dos atendimentos.</p>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
          <RefreshCw className="w-4 h-4" />
          Atualizar Dados
        </button>
      </header>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Não Atendidos</span>
            <AlertCircle className="w-5 h-5 text-red-400 bg-red-50 dark:bg-red-900/30 p-1 rounded-md" />
          </div>
          <div>
            <div className="text-4xl font-black text-red-500">{stats.naoAtendidos}</div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">Representa {stats.naoAtendidosPct}% da base</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Tentativas sem Retorno</span>
            <PhoneForwarded className="w-5 h-5 text-orange-400 bg-orange-50 dark:bg-orange-900/30 p-1 rounded-md" />
          </div>
          <div>
            <div className="text-4xl font-black text-orange-500">{stats.tentativas}</div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">Esforço não comissionado</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Clientes Atendidos</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded-md" />
          </div>
          <div>
            <div className="text-4xl font-black text-emerald-500">{stats.atendidos}</div>
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">Representa {stats.atendidosPct}% da base</div>
          </div>
        </div>

        <div className="bg-brand-navy dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-brand-navy/10 dark:border-slate-800 flex flex-col justify-between transform hover:scale-[1.02] transition-transform text-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-blue-200">Ganhos Estimados</h3>
            <div className="p-2 rounded-lg bg-white/10 text-brand-gold"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div>
            <p className="text-4xl font-black text-brand-gold">{formatCurrency(stats.ganhosTotais)}</p>
            <p className="text-xs text-blue-300 font-medium mt-1">Baseado na volumetria de hoje</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar de Prioridades */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-brand-navy dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Radar de Prioridades
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Clientes que exigem retorno Semanal ou Quinzenal.</p>
          
          <div className="space-y-3">
            {(!stats.prioridades || stats.prioridades.length === 0) ? (
              <div className="bg-white/50 dark:bg-[#112240]/50 border border-slate-100 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400 dark:text-slate-500 border-dashed">
                Nenhuma prioridade na sua base.
              </div>
            ) : (
              stats.prioridades.map((item) => {
                const isAtrasado = true; // Simplified for display
                return (
                  <div key={item.id} className="bg-white dark:bg-[#112240] p-4 rounded-xl shadow-sm border-l-4 border-l-red-500 border-t border-r border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-brand-navy dark:text-white">{item.nome}</h4>
                      <span className="text-xs font-bold text-red-500 uppercase">{item.criticidade}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {item.ultimoContato ? 'Atrasado' : 'Atrasado'}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">Tempo Restante</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Bloco de Notas */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-brand-cream/50 dark:bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-bold text-brand-navy dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-gold" />
              Bloco de Notas / Tarefas Extras
            </h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <form onSubmit={handleAddTarefa} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Setor</label>
                  <select value={novaTarefa.setor} onChange={e => setNovaTarefa({...novaTarefa, setor: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-brand-navy dark:text-slate-200 focus:outline-none focus:border-brand-gold">
                    <option>Mediação/Negociação</option>
                    <option>Jurídico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Classificação</label>
                  <select value={novaTarefa.classificacao} onChange={e => setNovaTarefa({...novaTarefa, classificacao: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-brand-navy dark:text-slate-200 focus:outline-none focus:border-brand-gold">
                    <option value="REGULAR">Regular</option>
                    <option value="CRÍTICA/URGENTE">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Data</label>
                  <input type="date" value={novaTarefa.data} onChange={e => setNovaTarefa({...novaTarefa, data: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-brand-navy dark:text-slate-200 focus:outline-none focus:border-brand-gold" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Detalhes</label>
                  <textarea rows="3" value={novaTarefa.detalhes} onChange={e => setNovaTarefa({...novaTarefa, detalhes: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-brand-navy dark:text-slate-200 focus:outline-none focus:border-brand-gold" required></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-navy dark:bg-brand-gold text-white dark:text-brand-navy font-bold py-3 rounded-xl hover:bg-[#002866] dark:hover:bg-yellow-500 transition-colors">
                  Adicionar Tarefa
                </button>
              </form>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {tarefasFiltradas.length === 0 ? (
                <div className="text-center text-slate-400 dark:text-slate-500 text-sm mt-8">Nenhuma tarefa agendada.</div>
              ) : (
                tarefasFiltradas.map((tarefa) => (
                  <div key={tarefa.id} className="p-3 rounded-xl border bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:shadow-md flex items-start gap-3">
                    <button onClick={() => deleteTarefa(tarefa.id)} className="mt-1 rounded-full w-5 h-5 border border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white flex items-center justify-center flex-shrink-0 transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                    <div>
                      <div className="flex gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getClassificacaoStyle(tarefa.classificacao)}`}>{tarefa.classificacao}</span>
                      </div>
                      <p className="text-sm text-brand-navy dark:text-slate-300 font-medium">{tarefa.detalhes}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
