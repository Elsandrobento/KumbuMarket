import React, { useState } from "react";
import { X, Shield, Star, Sparkles, User, Key, Mail } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, loginUser } = useApp();
  const [emailInput, setEmailInput] = useState("");

  if (!showAuthModal) return null;

  const quickPersonas = [
    {
      name: "Kumbu Admin",
      email: "admin@kumbumarket.ao",
      role: "Administrador Geral",
      desc: "Moderar anúncios, gerir denúncias e ver faturação total do SaaS.",
      icon: <Shield className="w-5 h-5 text-danger" />,
      colorClass: "border-red-500/20 bg-red-50/50 hover:bg-red-100/40 dark:bg-red-950/20 dark:hover:bg-red-900/30"
    },
    {
      name: "Carlos Silva",
      email: "carlos@kumbu.com",
      role: "Vendedor Pro (Plano Pro)",
      desc: "Visualizar anúncios ativos/destacados e estatísticas de tráfego.",
      icon: <Sparkles className="w-5 h-5 text-featured" />,
      colorClass: "border-amber-500/20 bg-amber-50/50 hover:bg-amber-100/40 dark:bg-amber-950/20 dark:hover:bg-amber-900/30"
    },
    {
      name: "Dina Santos",
      email: "dina@kumbu.com",
      role: "Vendedor Standard",
      desc: "Simular envio de anúncios gratuitos para a fila de moderação.",
      icon: <User className="w-5 h-5 text-primary" />,
      colorClass: "border-emerald-500/20 bg-emerald-50/50 hover:bg-emerald-100/40 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30"
    }
  ];

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      loginUser(emailInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl glass animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-2">
            Entrar no <span className="text-primary">KumbuMarket</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Escolha um dos perfis pré-configurados abaixo para aceder instantaneamente ou digite um e-mail.
          </p>
        </div>

        {/* Quick Credentials / Personas */}
        <div className="flex flex-col gap-3 mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            Acesso Rápido de Simulação
          </span>
          <div className="flex flex-col gap-3">
            {quickPersonas.map((persona) => (
              <button
                key={persona.email}
                onClick={() => loginUser(persona.email)}
                className={`flex items-start gap-4 p-4 text-left rounded-2xl border transition-all ${persona.colorClass} group`}
              >
                <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm shrink-0">
                  {persona.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {persona.name}
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      {persona.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {persona.desc}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground mt-2 block opacity-70">
                    E-mail: {persona.email}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-border" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ou manual</span>
          <hr className="flex-1 border-border" />
        </div>

        {/* Manual Login */}
        <form onSubmit={handleManualLogin} className="flex flex-col gap-3">
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5" />
            <input
              type="text"
              placeholder="Digite qualquer e-mail (ex: carlos@kumbu.com)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.99]"
          >
            Iniciar Sessão
          </button>
        </form>

      </div>
    </div>
  );
};
