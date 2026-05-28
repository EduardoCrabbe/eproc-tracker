import React from 'react';
import { Users, TrendingUp, Award, UserPlus } from 'lucide-react';

export default function EquipeCS() {
  const equipe = [
    { id: 1, nome: 'Edu crabbe', email: 'eduardo@reisrevisional.com.br', nivel: 1, totalClientes: 100, atendidos: 60, quitacoes: 4, comentarios: 12, ganhos: 345.50 },
    { id: 2, nome: 'Ana Souza', email: 'ana@reisrevisional.com.br', nivel: 3, totalClientes: 120, atendidos: 100, quitacoes: 8, comentarios: 20, ganhos: 850.00 }
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy">Equipe CS</h2>
          <p className="text-brand-bronze mt-1">Acompanhe a volumetria e ganhos de toda a sua equipe de Customer Success.</p>
        </div>
        <div>
          <button className="bg-brand-navy text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-blue-900 flex items-center gap-2 transition-colors">
            <UserPlus className="w-5 h-5 text-brand-gold" />
            Adicionar CS
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-brand-cream rounded-xl text-brand-bronze">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Tamanho da Equipe</p>
            <p className="text-2xl font-bold text-brand-navy">2 CSs</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-brand-cream rounded-xl text-brand-bronze">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Atendimentos</p>
            <p className="text-2xl font-bold text-brand-navy">160</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-brand-cream rounded-xl text-brand-bronze">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Comissões Pagas</p>
            <p className="text-2xl font-bold text-brand-navy">R$ 1.195,50</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-brand-cream border-b border-slate-100 text-brand-bronze text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">CS</th>
              <th className="px-6 py-4 font-bold text-center">Nível</th>
              <th className="px-6 py-4 font-bold text-center">Total Clientes</th>
              <th className="px-6 py-4 font-bold text-center">Atendidos</th>
              <th className="px-6 py-4 font-bold text-center">Faltam Atender</th>
              <th className="px-6 py-4 font-bold text-center">Quitações</th>
              <th className="px-6 py-4 font-bold text-center">Comentários</th>
              <th className="px-6 py-4 font-bold text-right">Ganhos (R$)</th>
              <th className="px-6 py-4 font-bold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipe.map((cs, index) => {
              const faltantes = cs.totalClientes - cs.atendidos;
              const atendidosPct = cs.totalClientes > 0 ? Math.round((cs.atendidos / cs.totalClientes) * 100) : 0;
              const faltantesPct = cs.totalClientes > 0 ? Math.round((faltantes / cs.totalClientes) * 100) : 0;

              return (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-brand-navy">{cs.nome}</div>
                    <div className="text-xs text-slate-500">{cs.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-brand-bronze text-center">{cs.nivel}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium text-center">{cs.totalClientes}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold text-center">
                    {cs.atendidos} <span className="text-xs font-normal text-emerald-500/70">({atendidosPct}%)</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500 font-bold text-center">
                    {faltantes} <span className="text-xs font-normal text-red-400/70">({faltantesPct}%)</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600 text-center">
                    {cs.quitacoes}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-500 text-center">
                    {cs.comentarios}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-brand-navy text-right">R$ {cs.ganhos.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-brand-bronze hover:text-brand-navy font-bold underline">Ver Planilha</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
