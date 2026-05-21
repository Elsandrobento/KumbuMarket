import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, Users, CheckCircle, XCircle, Landmark, Activity, BarChart2, FileText, ArrowRight, Settings, Star } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminPanel = () => {
  const {
    ads,
    users,
    financials,
    reports,
    approveAd,
    rejectAd,
    deleteAdAdmin,
    dismissReport,
    toggleVerifyUser,
    changeUserRole,
    currentUser,
    navigateTo
  } = useApp();

  const [adminTab, setAdminTab] = useState("moderation"); // moderation, users, financial, reports

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-card border border-border rounded-3xl shadow-premium flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center animate-pulse">
          <Shield className="w-8 h-8" />
        </div>
        <h3 className="text-md font-bold text-foreground">Acesso Negado</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          O seu utilizador não possui privilégios administrativos. Inicie sessão com uma conta de Administrador para gerir a plataforma.
        </p>
        <button
          onClick={() => navigateTo("home")}
          className="mt-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          Voltar para a Home
        </button>
      </div>
    );
  }

  // Filter pending ads
  const pendingAds = ads.filter(ad => ad.status === "pendente");
  // Active ads
  const activeAds = ads.filter(ad => ad.status === "ativo");

  const formatPrice = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0
    }).format(value);
  };

  const navItems = [
    { id: "moderation", label: "Moderação", count: pendingAds.length, icon: <CheckCircle className="w-4 h-4" /> },
    { id: "users", label: "Utilizadores", count: users.length, icon: <Users className="w-4 h-4" /> },
    { id: "financial", label: "Relatório SaaS", count: null, icon: <BarChart2 className="w-4 h-4" /> },
    { id: "reports", label: "Denúncias", count: reports.length, icon: <AlertTriangle className="w-4 h-4 text-red-500" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Dashboard Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR - Amazon Seller Central Style */}
          <aside className="w-full lg:w-64 shrink-0 bg-card border border-border rounded-3xl shadow-premium overflow-hidden flex flex-col">
            {/* Header/Brand Section */}
            <div className="p-5 border-b border-border bg-slate-900 text-white flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-emerald-400">Kumbu Central</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Console de Controlo</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <img src={currentUser.avatar} alt="" className="w-6.5 h-6.5 rounded-full object-cover border border-white/20" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold truncate leading-tight">{currentUser.name}</p>
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Master Admin</span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAdminTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-emerald-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.id === "reports" && item.count > 0
                            ? "bg-red-500 text-white"
                            : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border mt-auto bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span className="font-semibold">Servidores em Talatona: OK</span>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT DISPLAY PANEL */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-3xl shadow-premium">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Painel SaaS Angola</span>
                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                  {adminTab === "moderation" && "Fila de Moderação de Anúncios"}
                  {adminTab === "users" && "Base de Clientes & Vendedores"}
                  {adminTab === "financial" && "Relatório Geral de Receitas"}
                  {adminTab === "reports" && "Denúncias de Fraude / Spam"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {adminTab === "moderation" && "Aprove ou rejeite anúncios pendentes submetidos por utilizadores nas últimas 24h."}
                  {adminTab === "users" && "Gerencie permissões de utilizadores, atribua cargos administrativos e sele com selo oficial."}
                  {adminTab === "financial" && "Desempenho da faturação das assinaturas Pro Kumbu e Destaques Gold via Multicaixa."}
                  {adminTab === "reports" && "Analise queixas efetuadas pela comunidade e elimine conteúdo nocivo do ecossistema."}
                </p>
              </div>

              {/* Quick action back */}
              <button 
                onClick={() => navigateTo("home")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-xl border border-border transition-all"
              >
                Voltar à Loja <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Metrics Ribbon (changes according to page) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Receita Geral SaaS", val: formatPrice(financials.revenueTotal), icon: <Landmark className="w-4 h-4 text-emerald-500" />, change: "+14% este mês" },
                { label: "Moderação Pendente", val: `${pendingAds.length} Anúncios`, icon: <Activity className="w-4 h-4 text-amber-500" />, change: "Tempo médio: 4m" },
                { label: "Casos de Denúncia", val: `${reports.length} Alertas`, icon: <AlertTriangle className="w-4 h-4 text-red-500" />, change: "Urgência crítica" },
                { label: "Utilizadores Totais", val: `${users.length} Contas`, icon: <Users className="w-4 h-4 text-blue-500" />, change: "+24 nas últimas 48h" }
              ].map((metric, idx) => (
                <div key={idx} className="p-4 bg-card border border-border/80 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{metric.label}</span>
                    <span className="text-sm sm:text-base font-black text-foreground">{metric.val}</span>
                    <span className="text-[9px] text-emerald-600 font-semibold">{metric.change}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-center shrink-0">
                    {metric.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN TAB RENDERERS */}
            <div className="transition-all duration-300">
              
              {/* Tab 1. MODERATION SUBPAGE */}
              {adminTab === "moderation" && (
                <div className="flex flex-col gap-4">
                  {pendingAds.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-card rounded-3xl border border-border flex flex-col items-center gap-3 shadow-premium">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-foreground">Excelente! Fila de moderação vazia</span>
                      <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                        Todos os anúncios submetidos foram devidamente analisados e publicados.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {pendingAds.map((ad) => {
                        const adOwner = users.find(u => u.id === ad.sellerId) || { name: "Vendedor" };
                        
                        return (
                          <div
                            key={ad.id}
                            className="p-4 bg-card border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-emerald-500/30 transition-all"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={ad.images[0]}
                                alt=""
                                className="w-20 h-14 rounded-xl object-cover border border-border/40 shrink-0 shadow-sm"
                              />
                              <div className="min-w-0 flex flex-col gap-1">
                                <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{ad.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                                    {ad.category.toUpperCase()}
                                  </span>
                                  <span>•</span>
                                  <span>Vendedor: <strong className="text-foreground">{adOwner.name}</strong></span>
                                  <span>•</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrice(ad.price)}</span>
                                </div>
                                <span className="text-[9px] text-muted-foreground italic truncate max-w-lg">
                                  "{ad.description}"
                                </span>
                              </div>
                            </div>

                            {/* Moderate Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 md:self-center">
                              <button
                                onClick={() => approveAd(ad.id)}
                                className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                              >
                                <CheckCircle className="w-4 h-4" /> Aprovar
                              </button>
                              <button
                                onClick={() => rejectAd(ad.id)}
                                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/10 dark:hover:bg-red-950/30 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-900/40 transition-all active:scale-95"
                              >
                                <XCircle className="w-4 h-4" /> Rejeitar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2. USERS LIST SUBPAGE */}
              {adminTab === "users" && (
                <div className="bg-card border border-border rounded-3xl shadow-premium overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-widest">Base de Utilizadores Registados</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Mostrando {users.length} utilizadores</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border font-bold uppercase tracking-wider text-muted-foreground text-[9px]">
                          <th className="p-4">Utilizador</th>
                          <th className="p-4">Plano Atual</th>
                          <th className="p-4">Anúncios Criados</th>
                          <th className="p-4">Reputação</th>
                          <th className="p-4">Cargo / Função</th>
                          <th className="p-4 text-center">Selo de Verificação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-border shadow-sm" />
                              <div>
                                <p className="font-bold text-foreground leading-snug">{u.name}</p>
                                <span className="text-[10px] text-muted-foreground font-semibold">{u.phone}</span>
                              </div>
                            </td>
                            <td className="p-4 font-semibold">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.plan === "Pro Kumbu" || u.plan === "Master Plan"
                                  ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {u.plan}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              <span className="font-bold text-foreground">{u.totalAds}</span> criados ({u.activeAds} ativos)
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" /> {u.rating}
                              </span>
                            </td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) => changeUserRole(u.id, e.target.value)}
                                className="p-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                              >
                                <option value="seller">Seller (Vendedor)</option>
                                <option value="admin">Admin (Geral)</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => toggleVerifyUser(u.id)}
                                className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 ${
                                  u.verified
                                    ? "bg-emerald-500 text-white shadow-sm"
                                    : "bg-muted hover:bg-muted/80 text-muted-foreground border border-border"
                                }`}
                              >
                                {u.verified ? "Verificado ✓" : "Atribuir Selo"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3. FINANCIALS & CHARTS SUBPAGE */}
              {adminTab === "financial" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Revenue Analytics Chart Card */}
                  <div className="bg-card border border-border p-5 rounded-3xl shadow-premium">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex flex-col">
                        <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-widest">Estatísticas de Faturação</h3>
                        <span className="text-[10px] text-muted-foreground font-semibold">Crescimento de pagamentos mensais via gateways integrados</span>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold">
                        Margem Operacional: 98.4%
                      </span>
                    </div>
                    
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={financials.revenueHistory}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                          <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))', 
                              borderRadius: '16px',
                              fontSize: '11px',
                              boxShadow: '0 10px 35px -12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value) => [`${value.toLocaleString('pt-AO')} AOA`, "Receita Líquida"]} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="receita" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorReceita)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Transactions Log List */}
                  <div className="bg-card border border-border rounded-3xl shadow-premium overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Histórico de Transações Recentes</h4>
                      <span className="text-[10px] text-muted-foreground font-semibold">Processamento em tempo real</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border font-bold uppercase tracking-wider text-muted-foreground text-[9px]">
                            <th className="p-4">Data</th>
                            <th className="p-4">Utilizador</th>
                            <th className="p-4">Plano Adquirido</th>
                            <th className="p-4">Gateway Utilizado</th>
                            <th className="p-4 text-right">Montante Cobrado</th>
                            <th className="p-4 text-center">Estado do Pagamento</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {financials.transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-muted/10 transition-colors">
                              <td className="p-4 text-muted-foreground font-semibold">{tx.date}</td>
                              <td className="p-4 font-bold">{tx.user}</td>
                              <td className="p-4 font-medium">{tx.plan}</td>
                              <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">{tx.gateway}</td>
                              <td className="p-4 text-right font-black text-primary">{formatPrice(tx.amount)}</td>
                              <td className="p-4 text-center">
                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  tx.status === "sucesso"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 4. REPORTS MODERATOR SUBPAGE */}
              {adminTab === "reports" && (
                <div className="flex flex-col gap-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-card rounded-3xl border border-border flex flex-col items-center gap-3 shadow-premium">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-foreground">Excelente, sem denúncias pendentes</span>
                      <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                        Nenhum anúncio foi denunciado por utilizadores como fraude ou conteúdo abusivo nas últimas horas.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {reports.map((rep) => {
                        const linkedAd = ads.find(a => a.id === rep.adId);
                        
                        return (
                          <div
                            key={rep.id}
                            className="p-5 bg-card border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                          >
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                  Alerta Crítico
                                </span>
                                <span className="text-[9px] text-muted-foreground font-semibold">{rep.date}</span>
                              </div>
                              
                              <p className="text-xs text-foreground font-semibold">
                                Denunciante: <strong className="text-foreground">{rep.reporter}</strong>
                              </p>
                              <div className="text-xs text-red-500 font-bold bg-red-500/5 dark:bg-red-950/10 p-3 rounded-xl border border-red-200/40 dark:border-red-950/30">
                                Motivo alegado: {rep.reason}
                              </div>

                              {linkedAd ? (
                                <div 
                                  onClick={() => navigateTo("ad-details", linkedAd)}
                                  className="text-[10px] text-primary hover:underline cursor-pointer font-black flex items-center gap-1 mt-1"
                                >
                                  Ver Anúncio Vinculado: "{linkedAd.title}" ({formatPrice(linkedAd.price)}) →
                                </div>
                              ) : (
                                <div className="text-[10px] text-red-500 font-bold mt-1">Anúncio correspondente já foi banido.</div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 md:self-center">
                              <button
                                onClick={() => dismissReport(rep.id)}
                                className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold px-4 py-2.5 rounded-xl border border-border transition-all active:scale-95"
                              >
                                Ignorar Caso
                              </button>
                              {linkedAd && (
                                <button
                                  onClick={() => {
                                    if (confirm("Tem a certeza de que deseja eliminar definitivamente o anúncio reportado?")) {
                                      deleteAdAdmin(linkedAd.id);
                                      dismissReport(rep.id);
                                    }
                                  }}
                                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                                >
                                  Banir Anúncio
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
