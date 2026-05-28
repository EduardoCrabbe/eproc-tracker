import React from 'react';
import { Settings } from 'lucide-react';

export default function EprocTracker() {
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col justify-center items-center">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Em manutenção</h2>
      <p className="text-slate-500 text-center max-w-md">
        A integração automatizada com o Eproc está sendo desenvolvida (Fase 2). Por enquanto, acompanhe seus clientes pela aba Meus Clientes.
      </p>
    </div>
  );
}
