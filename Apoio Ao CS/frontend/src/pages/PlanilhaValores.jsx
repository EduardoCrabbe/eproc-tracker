import React from 'react';
import { Construction } from 'lucide-react';

export default function PlanilhaValores() {
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col justify-center items-center">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
        <Construction className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Em manutenção</h2>
      <p className="text-slate-500 text-center max-w-md">
        A automação de cálculo de redução de dívida via IA (Fase 2) está sendo construída. Logo você poderá inserir os dados do DataJuri aqui.
      </p>
    </div>
  );
}
