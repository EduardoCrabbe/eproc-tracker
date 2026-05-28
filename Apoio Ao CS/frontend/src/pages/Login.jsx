import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center text-center">
        
        <div className="mb-10 flex flex-col items-center">
          <h1 className="text-4xl font-serif tracking-widest text-brand-navy border-b-2 border-brand-bronze/50 pb-2 px-8">APOIO</h1>
          <span className="text-sm tracking-[0.4em] mt-3 text-brand-navy font-medium">ao CS</span>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-brand-navy mb-3">Bem-vindo</h2>
          <p className="text-brand-bronze text-sm px-4 leading-relaxed">
            Faça login para acessar a plataforma de apoio ao Customer Success.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="w-full">
          <button 
            type="submit" 
            className="w-full bg-brand-bronze hover:bg-[#7a5f3b] text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Entrar com Google
          </button>
        </form>

      </div>
    </div>
  );
}
