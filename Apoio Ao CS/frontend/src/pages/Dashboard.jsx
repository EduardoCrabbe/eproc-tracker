import React, { useState } from 'react';
import { Users, AlertOctagon, AlertTriangle, CheckCircle2, Search, PlusCircle, Calendar as CalendarIcon, Clock, Filter, AlertCircle, RefreshCw, BellRing } from 'lucide-react';

export default function Dashboard({ role }) {
  const isManager = role === 'Gerente' || role === 'Supervisor';

  const [tarefas, setTarefas] = useState([
    { id: 1, cs: 'Edu crabbe', setor: 'Sistema Automático', classificacao: 'CRÍTICA/URGENTE', data: '2026-05-27', detalhes: 'Falar com o cliente Eduardo Crabbe (Crítico) em 6 dias.', mesAnterior: false, auto: true },
    { id: 2, cs: 'Ana Souza', setor: 'Mediação/Negociação', classificacao: 'REGULAR', data: '2026-04-28', detalhes: 'Tarefa antiga não resolvida.', mesAnterior: true, auto: false },
    { id: 3, cs: 'Edu crabbe', setor: 'Sistema Automático', classificacao: 'LEMBRETE', data: '2026-06-15', detalhes: 'Falar com o cliente Ana Souza (Atenção) em 14 dias.', mesAnterior: false, auto: true }
  ]);

  const [novaTarefa, setNovaTarefa] = useState({
    setor: 'Mediação/Negociação',
    classificacao: 'REGULAR',
    data: '',
    detalhes: ''
  });

  const [filtroCS, setFiltroCS] = useState('Todos');

  const stats = [
    { label: 'Processos Monitorados', value: '3', trend: '+2.4% desde ontem', icon: Users, color: 'text-brand-navy', bg: 'bg-slate-100' },
    { label: 'Risco Crítico', value: '3', trend: '+2.4% desde ontem', icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Em Atenção', value: '0', trend: '+2.4% desde ontem', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Regularizados', value: '0', trend: '+2.4% desde ontem', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const handleAddTarefa = (e) => {
    e.preventDefault();
    if (!novaTarefa.data || !novaTarefa.detalhes) return;
    
    setTarefas([
      ...tarefas, 
      { 
        id: Date.now(), 
        cs: isManager ? 'Gerente' : 'Edu crabbe', 
        ...novaTarefa, 
        mesAnterior: false
      }
    ]);
    
    setNovaTarefa({
      setor: 'Mediação/Negociação',
      classificacao: 'REGULAR',
      data: '',
      detalhes: ''
    });
  };

  const deleteTarefa = (id) => {
    // Agora exclui a tarefa (não vai mais acumular no banco)
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  const adiarTarefa = (id) => {
    // Reprograma a tarefa que veio do mês anterior
    setTarefas(tarefas.map(t => t.id === id ? { ...t, mesAnterior: false, data: new Date().toISOString().split('T')[0] } : t));
  };

  // Ordenar por data (mais antigas primeiro)
  let tarefasFiltradas = [...tarefas].sort((a, b) => new Date(a.data) - new Date(b.data));
  
  if (isManager && filtroCS !== 'Todos') {
    tarefasFiltradas = tarefasFiltradas.filter(t => t.cs === filtroCS);
  } else if (!isManager) {
    tarefasFiltradas = tarefasFiltradas.filter(t => t.cs === 'Edu crabbe'); // Mock current user
  }

  const getClassificacaoStyle = (tipo) => {
    switch(tipo) {
      case 'CRÍTICA/URGENTE': return 'bg-red-100 text-red-700 border-red-200';
      case 'REGULAR': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'LEMBRETE': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-brand-navy">Painel de Controle</h2>
        <p className="text-brand-bronze mt-1">Visão geral da saúde jurídica e organização diária.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className={`text-4xl font-bold ${stat.color === 'text-brand-navy' ? 'text-brand-navy' : stat.color}`}>{stat.value}</p>
              <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
                <span className="text-lg leading-none">↗</span> {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-gold" />
              Organização e Tarefas
            </h3>
            <p className="text-sm text-slate-500 mt-1">Gerencie prioridades entre setores para não perder prazos.</p>
          </div>
          
          {isManager && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-bronze" />
              <select 
                value={filtroCS}
                onChange={(e) => setFiltroCS(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg p-2 text-slate-700 bg-white focus:outline-none focus:border-brand-gold"
              >
                <option value="Todos">Visualizar Todos (Equipe)</option>
                <option value="Edu crabbe">Edu crabbe</option>
                <option value="Ana Souza">Ana Souza</option>
              </select>
            </div>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Nova Tarefa */}
          <div className="bg-brand-cream/50 p-5 rounded-xl border border-slate-100 h-fit">
            <h4 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-brand-bronze" />
              Nova Tarefa
            </h4>
            <form onSubmit={handleAddTarefa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Setor</label>
                <select 
                  value={novaTarefa.setor}
                  onChange={e => setNovaTarefa({...novaTarefa, setor: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                >
                  <option value="Mediação/Negociação">Mediação/Negociação</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Jurídico">Jurídico</option>
                  <option value="Gestão">Gestão</option>
                  <option value="Atendimento">Atendimento</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Classificação</label>
                <select 
                  value={novaTarefa.classificacao}
                  onChange={e => setNovaTarefa({...novaTarefa, classificacao: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                >
                  <option value="CRÍTICA/URGENTE">Crítica / Urgente</option>
                  <option value="REGULAR">Regular</option>
                  <option value="LEMBRETE">Lembrete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Prazo / Data</label>
                <input 
                  type="date"
                  value={novaTarefa.data}
                  onChange={e => setNovaTarefa({...novaTarefa, data: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Detalhes</label>
                <textarea 
                  value={novaTarefa.detalhes}
                  onChange={e => setNovaTarefa({...novaTarefa, detalhes: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none resize-none h-20"
                  placeholder="Descreva o que precisa ser feito..."
                  required
                />
              </div>

              <button type="submit" className="w-full bg-brand-navy hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md text-sm">
                Adicionar Tarefa
              </button>
            </form>
          </div>

          {/* Lista de Tarefas */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-bronze" />
              Tarefas Pendentes
            </h4>
            
            {tarefasFiltradas.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Nenhuma tarefa pendente no momento.
              </div>
            ) : (
              tarefasFiltradas.map((tarefa) => (
                <div key={tarefa.id} className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${tarefa.mesAnterior ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                  
                  <div className="flex flex-1 items-start gap-4">
                    <button 
                      onClick={() => deleteTarefa(tarefa.id)}
                      className="mt-1 rounded-full w-5 h-5 flex items-center justify-center border border-slate-300 text-transparent hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors flex-shrink-0"
                      title="Concluir e Excluir"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getClassificacaoStyle(tarefa.classificacao)}`}>
                          {tarefa.classificacao}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                          {tarefa.setor}
                        </span>
                        <span className="text-xs text-brand-bronze font-medium ml-auto flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" /> {new Date(tarefa.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </span>
                      </div>
                      <p className="text-sm text-brand-navy font-medium">
                        {tarefa.detalhes}
                      </p>
                      {isManager && (
                        <p className="text-xs text-slate-400 mt-2 font-medium">Resp: {tarefa.cs}</p>
                      )}
                    </div>
                  </div>

                  {/* Alerta de Virada de Mês */}
                  {tarefa.mesAnterior && (
                    <div className="flex flex-col gap-2 items-end w-full md:w-auto mt-4 md:mt-0 p-3 bg-white rounded-lg border border-amber-100 shadow-sm">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <AlertCircle className="w-4 h-4" /> Tarefa do mês anterior
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => adiarTarefa(tarefa.id)}
                          className="text-[10px] uppercase font-bold text-brand-navy bg-brand-gold/20 hover:bg-brand-gold hover:text-white border border-brand-gold px-2 py-1.5 rounded transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Adiar
                        </button>
                        <button 
                          onClick={() => deleteTarefa(tarefa.id)}
                          className="text-[10px] uppercase font-bold text-red-500 hover:bg-red-50 border border-red-200 px-2 py-1.5 rounded transition-colors"
                        >
                          Excluir Agora
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
