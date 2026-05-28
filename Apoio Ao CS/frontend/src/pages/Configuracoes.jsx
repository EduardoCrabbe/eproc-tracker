import React from 'react';

export default function Configuracoes() {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>
        <p className="text-slate-500 mt-1">Acesso restrito para Supervisor e Gerente.</p>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Gerenciamento de Equipe</h3>
        <p className="text-sm text-slate-500 mb-4">
          Atribua o nível de bônus para cada Customer Success. O nível afeta diretamente o cálculo de comissionamento de cada um.
        </p>
        
        <table className="w-full text-left border-collapse mb-4">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-2 font-medium">Nome do CS</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Nível Atual</th>
              <th className="px-4 py-2 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-700 font-medium">Eduardo CS</td>
              <td className="px-4 py-3 text-slate-500">eduardo@reisrevisional.com.br</td>
              <td className="px-4 py-3">
                <select className="border border-slate-200 rounded p-1 text-slate-700 bg-white">
                  <option>Nível 1</option>
                  <option>Nível 2</option>
                  <option selected>Nível 3</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <button className="text-blue-600 hover:text-blue-800 font-medium">Salvar</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-700 font-medium">Ana Souza</td>
              <td className="px-4 py-3 text-slate-500">ana@reisrevisional.com.br</td>
              <td className="px-4 py-3">
                <select className="border border-slate-200 rounded p-1 text-slate-700 bg-white">
                  <option selected>Nível 1</option>
                  <option>Nível 2</option>
                  <option>Nível 3</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <button className="text-blue-600 hover:text-blue-800 font-medium">Salvar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Prompt da Inteligência Artificial</h3>
        <p className="text-sm text-slate-500 mb-4">
          Este é o prompt base que a IA usará para transcrever áudios e sumarizar os atendimentos do CS. Lembre-se de instruir a IA a falar em primeira pessoa.
        </p>
        
        <textarea 
          className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          defaultValue="Aja como se fosse eu (um CS da Reis Revisional). Crie um resumo amigável do atendimento transcrito..."
        ></textarea>

        <div className="flex justify-end mt-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-sm hover:bg-blue-700 transition-colors">
            Salvar Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
