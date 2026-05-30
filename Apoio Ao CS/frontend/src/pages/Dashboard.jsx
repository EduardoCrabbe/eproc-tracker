import React, { useState, useEffect } from 'react';
import { Users, AlertOctagon, AlertTriangle, CheckCircle2, Search, PlusCircle, Calendar as CalendarIcon, Clock, Filter, AlertCircle, RefreshCw, PhoneForwarded, DollarSign } from 'lucide-react';

export default function Dashboard({ role }) {
  const isManager = role === 'Gerente' || role === 'Supervisor';
  const username = "educrabbe"; // Simulação
  const API_URL = "http://127.0.0.1:8000/api/dashboard/stats";

  const [stats, setStats] = useState({
    totalClientes: 0,
    naoAtendidos: 0, naoAtendidosPct: 0,
    tentativas: 0,
    atendidos: 0, atendidosPct: 0,
    ganhosTotais: 0,
    prioridades: []
  });

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}?user=${username}`);
      const data = await res.json();
      setStats(data);
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy">Painel de Controle</h2>
          <p className="text-brand-bronze mt-1">Visão geral do comissionamento e saúde dos atendimentos.</p>
        </div>
        <button onClick={fetchStats} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-brand-bronze" /> Atualizar Dados
        </button>
      </header>
      
      {/* Cards de Métricas Reais do CRM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500">Não Atendidos</h3>
            <div className="p-2 rounded-lg bg-red-50 text-red-500"><AlertOctagon className="w-5 h-5" /></div>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500">{stats.naoAtendidos}</p>
            <p className="text-xs text-slate-400 font-bold mt-1">Representa {stats.naoAtendidosPct}% da base</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500">Tentativas sem Retorno</h3>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-500"><PhoneForwarded className="w-5 h-5" /></div>
          </div>
          <div>
            <p className="text-4xl font-bold text-orange-500">{stats.tentativas}</p>
            <p className="text-xs text-slate-400 font-bold mt-1">Esforço não comissionado</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500">Clientes Atendidos</h3>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <div>
            <p className="text-4xl font-bold text-emerald-500">{stats.atendidos}</p>
            <p className="text-xs text-slate-400 font-bold mt-1">Representa {stats.atendidosPct}% da base</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-navy to-blue-900 p-6 rounded-2xl shadow-md border border-blue-800 flex flex-col justify-between text-white">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel de Prioridades do CRM (Críticos e Atenção) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Radar de Prioridades
          </h3>
          <p className="text-sm text-slate-500 mb-4">Clientes que exigem retorno Semanal ou Quinzenal.</p>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {stats.prioridades.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                Nenhuma prioridade na sua base.
              </div>
            ) : (
              stats.prioridades.map(cliente => {
                let statusTempo = "Nunca Atendido";
                let isAtrasado = false;
                
                if (cliente.ultimoContato) {
                  const diffHoras = (now - cliente.ultimoContato) / (1000 * 60 * 60);
                  const limiteHoras = cliente.criticidade === 'Crítico' ? (7 * 24) : (15 * 24); // Semanal vs Quinzenal
                  
                  if (diffHoras > limiteHoras) {
                    isAtrasado = true;
                    statusTempo = `Atrasado há ${Math.floor((diffHoras - limiteHoras) / 24)} dias`;
                  } else {
                    const horasRestantes = limiteHoras - diffHoras;
                    statusTempo = `Restam ${Math.floor(horasRestantes / 24)} dias`;
                  }
                } else {
                  isAtrasado = true; // Nunca atendido é considerado atrasado se for prioridade
                }

                return (
                  <div key={cliente.id} className={`p-4 rounded-xl border ${isAtrasado ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-bold ${isAtrasado ? 'text-red-700' : 'text-brand-navy'}`}>{cliente.nome}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{cliente.id}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cliente.criticidade === 'Crítico' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {cliente.criticidade}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <Clock className={`w-4 h-4 ${isAtrasado ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className={`text-xs font-bold ${isAtrasado ? 'text-red-600' : 'text-slate-500'}`}>{statusTempo}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Agenda Antiga (Nova Tarefa) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
            <div>
              <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-brand-gold" />
                Bloco de Notas / Tarefas Extras
              </h3>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-cream/50 p-5 rounded-xl border border-slate-100 h-fit">
              <form onSubmit={handleAddTarefa} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Setor</label>
                  <select value={novaTarefa.setor} onChange={e => setNovaTarefa({...novaTarefa, setor: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none">
                    <option value="Mediação/Negociação">Mediação/Negociação</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Classificação</label>
                  <select value={novaTarefa.classificacao} onChange={e => setNovaTarefa({...novaTarefa, classificacao: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none">
                    <option value="CRÍTICA/URGENTE">Crítica / Urgente</option>
                    <option value="REGULAR">Regular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Data</label>
                  <input type="date" value={novaTarefa.data} onChange={e => setNovaTarefa({...novaTarefa, data: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Detalhes</label>
                  <textarea value={novaTarefa.detalhes} onChange={e => setNovaTarefa({...novaTarefa, detalhes: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none resize-none h-16" required />
                </div>
                <button type="submit" className="w-full bg-brand-navy hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg shadow-md text-sm">Adicionar Tarefa</button>
              </form>
            </div>

            <div className="space-y-3">
              {tarefasFiltradas.map((tarefa) => (
                <div key={tarefa.id} className="p-3 rounded-xl border bg-white border-slate-200 hover:shadow-md flex items-start gap-3">
                  <button onClick={() => deleteTarefa(tarefa.id)} className="mt-1 rounded-full w-5 h-5 border border-slate-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></button>
                  <div>
                    <div className="flex gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getClassificacaoStyle(tarefa.classificacao)}`}>{tarefa.classificacao}</span>
                    </div>
                    <p className="text-sm text-brand-navy font-medium">{tarefa.detalhes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
