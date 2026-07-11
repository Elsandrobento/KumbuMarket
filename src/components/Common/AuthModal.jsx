import React, { useState } from "react";
import { X, Shield, Star, Sparkles, User, Key, Mail, UserPlus, Phone } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, loginUser, registerUser } = useApp();
  
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  
  // Login State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  if (!showAuthModal) return null;

  const quickPersonas = [
    {
      name: "Kumbu Admin",
      email: "admin@kumbumarket.ao",
      role: "Administrador Geral",
      desc: "Moderar anúncios, gerir denúncias e ver faturação.",
      icon: <Shield className="w-5 h-5 text-danger" />,
      colorClass: "border-red-500/20 bg-red-50/50 hover:bg-red-100/40 dark:bg-red-950/20 dark:hover:bg-red-900/30"
    },
    {
      name: "Carlos Silva",
      email: "carlos@kumbu.com",
      role: "Vendedor Pro",
      desc: "Anúncios ativos/destacados e estatísticas de tráfego.",
      icon: <Sparkles className="w-5 h-5 text-featured" />,
      colorClass: "border-amber-500/20 bg-amber-50/50 hover:bg-amber-100/40 dark:bg-amber-950/20 dark:hover:bg-amber-900/30"
    },
    {
      name: "Dina Santos",
      email: "dina@kumbu.com",
      role: "Vendedor Standard",
      desc: "Simular envio de anúncios para a moderação.",
      icon: <User className="w-5 h-5 text-primary" />,
      colorClass: "border-emerald-500/20 bg-emerald-50/50 hover:bg-emerald-100/40 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30"
    }
  ];

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      loginUser(emailInput.trim(), passwordInput);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regName.trim() && regPhone.trim() && regPassword.trim()) {
      registerUser({
        name: regName.trim(),
        phone: regPhone.trim(),
        password: regPassword.trim()
      });
      setShowAuthModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl glass animate-slide-up max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6 mt-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-2">
            {activeTab === "login" ? "Entrar no " : "Criar conta no "}
            <span className="text-primary">KumbuMarket</span>
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-muted rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Criar Conta
          </button>
        </div>

        {activeTab === "login" ? (
          <>
            {/* Quick Credentials / Personas */}
            <div className="flex flex-col gap-3 mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Acesso Rápido de Simulação
              </span>
              <div className="flex flex-col gap-3">
                {quickPersonas.map((persona) => (
                  <button
                    key={persona.email}
                    onClick={() => loginUser(persona.email, "1234")}
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
                      <span className="text-[10px] font-mono text-muted-foreground mt-1 block opacity-70">
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
                  placeholder="E-mail (ex: carlos@kumbu.com)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-muted-foreground absolute left-3.5" />
                <input
                  type="password"
                  placeholder="Palavra-passe (1234)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                Iniciar Sessão
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">Nome Completo</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Ex: João Baptista"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">Número de Telefone</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5" />
                <input
                  type="tel"
                  placeholder="Ex: +244 923 000 000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">Palavra-passe</label>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 text-muted-foreground absolute left-3.5" />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" /> Criar Conta Gratuita
            </button>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Ao criar uma conta, aceitas os Termos de Serviço e Política de Privacidade do KumbuMarket.
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
