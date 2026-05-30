import React, { useState, useEffect } from 'react';
import { UploadCloud, Plus, Search, CheckCircle, MessageCircle, Filter, X, Clock, AlertOctagon, AlertTriangle, Users, User, PhoneForwarded, PieChart } from 'lucide-react';

export default function AreaCS() {
  const username = "educrabbe"; 
  const API_URL = "http://127.0.0.1:8000/api/areacs";

  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [now, setNow] = useState(Date.now());
  
  const [modalQuitar, setModalQuitar] = useState(null);
  const [datasQuitar, setDatasQuitar] = useState({ dataBoleto: '', dataPagamento: '' });

  useEffect(() => {
    fetchClientes();
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/clientes?user=${username}`);
      if (res.ok) {
        const data = await res.json();
        setClientes(data.clientes || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload?user=${username}`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        alert("Planilha de clientes carregada com sucesso!");
        fetchClientes();
      } else {
        alert("Erro ao carregar planilha.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    }
  };

  const handleAtendimento = async (id) => {
    try {
      const res = await fetch(`${API_URL}/atendimento/${id}?user=${username}`, { method: "POST" });
      if (res.ok) fetchClientes();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDesfazerAtendimento = async (id) => {
    try {
      const res = await fetch(`${API_URL}/atendimento/${id}?user=${username}`, { method: "DELETE" });
      if (res.ok) fetchClientes();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTentativa = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tentativa/${id}?user=${username}`, { method: "POST" });
      if (res.ok) fetchClientes();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmarQuitar = async (e) => {
    e.preventDefault();
    if (!datasQuitar.dataBoleto || !datasQuitar.dataPagamento) return;
    
    try {
      const res = await fetch(`${API_URL}/quitar/${modalQuitar.id}?user=${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          codigo_dj: modalQuitar.id,
          data_boleto: datasQuitar.dataBoleto, 
          data_pagamento: datasQuitar.dataPagamento 
        })
      });
      if (res.ok) {
        fetchClientes();
        setModalQuitar(null);
        setDatasQuitar({ dataBoleto: '', dataPagamento: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeField = async (id, field, valor) => {
    try {
      const res = await fetch(`${API_URL}/cliente/${id}?user=${username}&campo=${field}&valor=${valor}`, {
        method: "PUT"
      });
      if (res.ok) fetchClientes();
    } catch (e) {
      console.error(e);
    }
  };

  const clientesVisiveis = clientes.filter(c => {
    if (c.status !== 'Ativo') return false;
    if (filtroTipo !== 'Todos' && c.contrato !== filtroTipo) return false;
    if (busca) {
      const termo = busca.toLowerCase();
      if (!c.nome.toLowerCase().includes(termo) && !c.id.toLowerCase().includes(termo)) return false;
    }
    return true;
  });

  // Calculos da Tela Area CS
  const totalAtivos = clientes.filter(c => c.status === 'Ativo').length;
  const atendidos = clientes.filter(c => c.status === 'Ativo' && c.contatos > 0).length;
  const naoAtendidos = totalAtivos - atendidos;
  const pctAtendidos = totalAtivos > 0 ? Math.round((atendidos / totalAtivos) * 100) : 0;
  const pctNaoAtendidos = totalAtivos > 0 ? Math.round((naoAtendidos / totalAtivos) * 100) : 0;

  const getCriticidadeStyle = (nivel) => {
    if (nivel === 'Crítico') return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    if (nivel === 'Atenção') return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
  };

  return (
    <div className="space-y-6 pb-12 relative">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy dark:text-white">Meus Clientes</h2>
          <p className="text-brand-bronze mt-1">Gerencie sua lista, filtre contratos e registre atendimentos e tentativas.</p>
        </div>
        <div className="flex gap-3">
          <label className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-navy dark:text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-slate-50 dark:bg-[#0B192C] flex items-center gap-2 transition-colors cursor-pointer">
            <UploadCloud className="w-5 h-5 text-brand-bronze" />
            Importar Planilha
            <input type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </header>

      {/* Mini-Dashboard AreaCS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg"><Users className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Total de Clientes</p>
            <p className="text-2xl font-black text-brand-navy dark:text-white">{totalAtivos}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg"><PieChart className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Atendidos</p>
            <p className="text-2xl font-black text-emerald-600">{atendidos} <span className="text-sm font-medium text-slate-400">({pctAtendidos}%)</span></p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-lg"><AlertOctagon className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Não Atendidos</p>
            <p className="text-2xl font-black text-rose-600">{naoAtendidos} <span className="text-sm font-medium text-slate-400">({pctNaoAtendidos}%)</span></p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">Progresso da Base</p>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${pctAtendidos}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Localização Rápida (Nome ou ID)..." 
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-brand-navy shadow-sm transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-brand-bronze" />
            <select 
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="w-full md:w-auto text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-brand-navy shadow-sm cursor-pointer"
            >
              <option value="Todos">Filtrar por: Todos os Tipos</option>
              <option value="Veículo">Apenas Veículo</option>
              <option value="Empréstimo">Apenas Empréstimo</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-brand-cream dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-brand-bronze text-xs uppercase tracking-wider">
                <th className="px-4 py-4 font-bold">ID DataJuri</th>
                <th className="px-4 py-4 font-bold">Nome do Cliente</th>
                <th className="px-4 py-4 font-bold">Criticidade</th>
                <th className="px-4 py-4 font-bold">Contrato / Proc.</th>
                <th className="px-4 py-4 font-bold text-center">Atendimento</th>
                <th className="px-4 py-4 font-bold text-center">Tentativas</th>
                <th className="px-4 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientesVisiveis.map((cliente) => {
                let isBlocked = false;
                let timerDisplay = null;
                
                if (cliente.contatos >= 6) {
                  isBlocked = true;
                  timerDisplay = "Limite atingido";
                } else if (cliente.ultimoContato) {
                  const diffMs = now - cliente.ultimoContato;
                  const diffHoras = diffMs / (1000 * 60 * 60);
                  
                  if (diffHoras < 72) {
                    isBlocked = true;
                    const horasRestantes = Math.floor(72 - diffHoras);
                    const minRestantes = Math.floor(((72 - diffHoras) * 60) % 60);
                    timerDisplay = `${horasRestantes}h ${minRestantes}m`;
                  }
                }

                const isCritical = cliente.criticidade === 'Crítico';

                return (
                  <tr key={cliente.id} className={`transition-colors ${isCritical ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50 dark:bg-[#0B192C]'}`}>
                    <td className="px-4 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{cliente.id}</td>
                    <td className="px-4 py-4">
                      <div className={`text-sm font-bold flex items-center gap-2 ${isCritical ? 'text-red-700' : 'text-brand-navy dark:text-white'}`}>
                        {cliente.nome}
                        {isCritical && <AlertOctagon className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{cliente.uf}</div>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={cliente.criticidade}
                        onChange={(e) => handleChangeField(cliente.id, 'criticidade', e.target.value)}
                        className={`text-xs border rounded-lg p-1.5 focus:outline-none cursor-pointer font-bold transition-colors shadow-sm ${getCriticidadeStyle(cliente.criticidade)}`}
                      >
                        <option value="Crítico">Crítico (Semanal)</option>
                        <option value="Atenção">Atenção (Quinzenal)</option>
                        <option value="Regular">Regular (Mensal)</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 space-y-1">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${cliente.contrato === 'Veículo' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}>
                        {cliente.contrato}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">Processo:</span>
                        <select 
                          value={cliente.processos}
                          onChange={(e) => handleChangeField(cliente.id, 'processos', e.target.value)}
                          className={`text-[10px] border rounded p-0.5 focus:outline-none cursor-pointer font-bold ${cliente.processos === 'Sim' ? 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'}`}
                        >
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleAtendimento(cliente.id)}
                          disabled={isBlocked}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${isBlocked ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed' : 'bg-brand-cream dark:bg-slate-900/50 text-brand-navy dark:text-white border-brand-gold hover:bg-brand-gold hover:text-white shadow-sm hover:shadow'}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {cliente.contatos > 0 ? `Atendido (${cliente.contatos})` : 'Atender'}
                        </button>
                        
                        {cliente.contatos > 0 && !isBlocked && (
                          <button 
                            onClick={() => handleDesfazerAtendimento(cliente.id)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                            title="Desfazer Atendimento (foi clicado por engano)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {isBlocked && (
                        <p className={`text-[10px] font-bold mt-1 flex items-center justify-center gap-1 ${cliente.contatos >= 6 ? 'text-slate-400' : 'text-amber-600'}`}>
                          {cliente.contatos < 6 && <Clock className="w-3 h-3" />}
                          {timerDisplay}
                        </p>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => handleTentativa(cliente.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
                        title="Marcar tentativa sem retorno"
                      >
                        <PhoneForwarded className="w-4 h-4 text-orange-500" />
                        {cliente.tentativas > 0 ? `+${cliente.tentativas}` : 'Tentativa'}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => setModalQuitar(cliente)}
                        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {clientesVisiveis.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <p>Nenhum cliente cadastrado. Importe sua planilha do DataJuri.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Quitação */}
      {modalQuitar && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-brand-cream dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center">
              <h3 className="font-bold text-brand-navy dark:text-white text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Quitar Contrato
              </h3>
              <button onClick={() => setModalQuitar(null)} className="text-slate-400 hover:text-slate-600 dark:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={confirmarQuitar} className="p-6 space-y-4">
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Registrando liquidação de:</p>
                <p className="text-lg font-bold text-brand-navy dark:text-white">{modalQuitar.nome}</p>
                <p className="text-xs text-brand-bronze uppercase font-bold">{modalQuitar.id}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">Data do Envio do Boleto</label>
                <input 
                  type="date"
                  required
                  value={datasQuitar.dataBoleto}
                  onChange={e => setDatasQuitar({...datasQuitar, dataBoleto: e.target.value})}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">Data do Pagamento Efetuado</label>
                <input 
                  type="date"
                  required
                  value={datasQuitar.dataPagamento}
                  onChange={e => setDatasQuitar({...datasQuitar, dataPagamento: e.target.value})}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalQuitar(null)}
                  className="flex-1 bg-slate-100 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 shadow-md transition-colors"
                >
                  Confirmar Quitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
