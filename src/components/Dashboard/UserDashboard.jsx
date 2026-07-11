import React, { useState } from "react";
import { 
  User, Eye, MessageSquare, Plus, Edit2, ShieldAlert, Heart, Star, 
  Sparkles, LogOut, Check, ChevronRight, Globe, Camera, Phone, Settings, Trash2, Landmark, BarChart2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";

export const UserDashboard = () => {
  const {
    currentUser,
    ads,
    favorites,
    toggleFavorite,
    navigateTo,
    logoutUser,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState("my-ads"); // my-ads, favorites, settings

  // Form profile edits
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "");
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || "");
  const [profileBanner, setProfileBanner] = useState(currentUser?.banner || "");

  if (!currentUser) return null;

  // Filter ads created by this user
  const myAds = ads.filter(ad => ad.sellerId === currentUser.id);
  // Filter favorite ads objects
  const myFavs = ads.filter(ad => favorites.includes(ad.id));

  // Compute total views of user ads
  const totalViews = myAds.reduce((sum, ad) => sum + ad.views, 0);

  const mockChartData = [
    { name: "Seg", views: Math.floor(totalViews * 0.1) || 12 },
    { name: "Ter", views: Math.floor(totalViews * 0.15) || 18 },
    { name: "Qua", views: Math.floor(totalViews * 0.12) || 14 },
    { name: "Qui", views: Math.floor(totalViews * 0.2) || 25 },
    { name: "Sex", views: Math.floor(totalViews * 0.25) || 40 },
    { name: "Sáb", views: Math.floor(totalViews * 0.18) || 30 },
    { name: "Dom", views: Math.floor(totalViews * 0.3) || 50 },
  ];

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    // Simulate saving profile
    addNotification("success", "Perfil Atualizado", "As alterações do seu perfil foram persistidas com sucesso.");
  };

  const handleSimulateUpgrade = () => {
    addNotification("success", "Plano Atualizado", "O seu plano Pro Kumbu foi ativado! Desfrute de destaque ilimitado e selo verificado.");
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0
    }).format(value);
  };

  const isPro = currentUser.plan === "Pro Kumbu" || currentUser.plan === "Master Plan";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 2-Column Split Dashboard Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Seller Identity & SaaS Stats Card */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          
          {/* Main User Card */}
          <div className="bg-card border border-border/80 rounded-3xl shadow-premium overflow-hidden flex flex-col relative">
            {/* Header Banner Background */}
            <div className="h-28 w-full bg-slate-900 relative overflow-hidden">
              <img
                src={profileBanner}
                alt=""
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
            </div>

            {/* Profile Avatar Overlay */}
            <div className="px-6 pb-6 relative flex flex-col items-center text-center -mt-10">
              <div className="relative group">
                <img
                  src={profileAvatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-lg bg-card"
                />
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white border-2 border-card hover:scale-105 transition-all">
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <h3 className="text-sm font-black text-foreground mt-3 flex items-center gap-1.5 justify-center">
                {currentUser.name}
                {currentUser.verified && (
                  <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Verificado
                  </span>
                )}
              </h3>
              <span className="text-[10px] text-muted-foreground font-semibold mt-1">
                {currentUser.joinedDate}
              </span>

              {/* Reputation Rating */}
              <div className="flex items-center gap-1 mt-2.5 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-border/60">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-foreground">{currentUser.rating}</span>
                <span className="text-[10px] text-muted-foreground">({currentUser.reviewsCount || 0} avaliações)</span>
              </div>

              <hr className="w-full border-border/60 my-4" />

              {/* SaaS Subscription Info */}
              <div className="w-full flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Subscrição SaaS:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isPro 
                      ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {currentUser.plan}
                  </span>
                </div>

                {isPro ? (
                  <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/25 p-3 rounded-2xl flex flex-col gap-1.5 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-amber-600 stroke-none" /> Benefícios Ativos Pro
                    </span>
                    <p className="text-[9px] text-muted-foreground leading-normal">
                      • Visibilidade 10x maior nas prateleiras da home<br />
                      • Anúncios Gold Featured ilimitados<br />
                      • Suporte via WhatsApp priorizado
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/20 p-3 rounded-2xl flex flex-col gap-2 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Migre para o Plano Pro</span>
                    <p className="text-[9px] text-muted-foreground leading-normal">
                      Aumente as suas vendas em Angola! Obtenha destaque ilimitado, relatórios e selo de verificação oficial.
                    </p>
                    <button
                      onClick={handleSimulateUpgrade}
                      className="w-full py-1.5 bg-primary hover:bg-primary-hover text-white text-[9px] font-black rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Upgrade por 45.000 AOA/mês
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-border/80 flex flex-col gap-2">
              <button
                onClick={() => navigateTo("create-ad")}
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Criar Novo Anúncio
              </button>
              <button
                onClick={logoutUser}
                className="w-full bg-card hover:bg-muted text-red-500 border border-red-200 dark:border-red-900/30 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Terminar Sessão
              </button>
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="bg-card border border-border/80 p-4 rounded-3xl shadow-sm flex flex-col gap-2 text-xs">
            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Suporte Integrado</span>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">Ajuda ao Vendedor</p>
                <span className="text-[10px] text-muted-foreground">+244 923 000 111 (WhatsApp)</span>
              </div>
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: Tab Navigation & Tab Contents */}
        <div className="flex-1 w-full flex flex-col gap-6">
          
          {/* Main User Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Anúncios Criados", val: myAds.length, icon: <Plus className="w-4 h-4 text-primary" />, desc: "Registados" },
              { label: "Total de Visualizações", val: totalViews.toLocaleString(), icon: <Eye className="w-4 h-4 text-blue-500" />, desc: "De todos os anúncios" },
              { label: "Contactos Recentes", val: currentUser.messagesCount || 0, icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, desc: "Clientes no chat" },
              { label: "Nota do Anunciante", val: `${currentUser.rating} / 5.0`, icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />, desc: "Média geral" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 bg-card border border-border/80 rounded-2xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">{stat.label}</span>
                  <span className="text-base font-black text-foreground leading-tight">{stat.val}</span>
                  <span className="text-[9px] text-muted-foreground leading-none">{stat.desc}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Subpages Navigation Tabs */}
          <div className="flex gap-1.5 border-b border-border pb-3">
            {[
              { id: "my-ads", label: `Meus Anúncios (${myAds.length})` },
              { id: "favorites", label: `Favoritos Guardados (${myFavs.length})` },
              { id: "stats", label: "Métricas" },
              { id: "settings", label: "Definições de Perfil" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-emerald-500/5"
                    : "text-muted-foreground hover:text-foreground bg-card border border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Pane */}
          <div className="min-h-[40vh]">
            
            {/* A. MY ADS TAB */}
            {activeTab === "my-ads" && (
              <div className="flex flex-col gap-4">
                {myAds.length === 0 ? (
                  <div className="text-center py-20 px-6 bg-card rounded-3xl border border-border flex flex-col items-center gap-4 shadow-premium">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 text-muted-foreground/60 flex items-center justify-center">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">Não possui nenhum anúncio ativo</h4>
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                      Desapegue do que já não usa! Publique o seu primeiro anúncio gratuitamente para milhares de compradores em Angola.
                    </p>
                    <button
                      onClick={() => navigateTo("create-ad")}
                      className="px-6 py-3 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md mt-2 transition-all"
                    >
                      Publicar Primeiro Anúncio
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {myAds.map((ad) => (
                      <div
                        key={ad.id}
                        className="p-4 rounded-2xl bg-card border border-border hover:border-border-hover flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigateTo("ad-details", ad)}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={ad.images[0]}
                            alt=""
                            className="w-18 h-13 rounded-xl object-cover border border-border/40 shrink-0 shadow-sm"
                          />
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{ad.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-black text-primary">{formatPrice(ad.price)}</span>
                              <span className="text-[9px] text-muted-foreground">• {ad.views} visualizações</span>
                            </div>
                            
                            {/* Status Labels */}
                            <div className="flex gap-2 items-center mt-1">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                ad.status === "ativo"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
                                  : ad.status === "pendente"
                                    ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20"
                                    : "bg-red-500/10 text-red-600 dark:bg-red-500/20"
                              }`}>
                                {ad.status}
                              </span>
                              {ad.featured && (
                                <span className="bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5 fill-white stroke-none" /> Destaque Gold
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigateTo("ad-details", ad)}
                            className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline"
                          >
                            Gerir <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          {ad.status === "pendente" && (
                            <p className="text-[8px] font-bold text-amber-500 text-right max-w-[120px] leading-tight">
                              Aguardando aprovação do Administrador
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* B. FAVORITES TAB */}
            {activeTab === "favorites" && (
              <div className="flex flex-col gap-4">
                {myFavs.length === 0 ? (
                  <div className="text-center py-20 px-6 bg-card rounded-3xl border border-border flex flex-col items-center gap-3 shadow-premium">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 text-muted-foreground/50 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-muted-foreground">Sem favoritos guardados</h4>
                    <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                      Quando encontrar um artigo do seu agrado, clique no ícone de coração para o guardar aqui.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myFavs.map((ad) => (
                      <div
                        key={ad.id}
                        className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigateTo("ad-details", ad)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={ad.images[0]}
                            alt=""
                            className="w-16 h-12 rounded-xl object-cover border border-border/40 shrink-0"
                          />
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-foreground truncate">{ad.title}</h4>
                            <span className="text-xs font-extrabold text-primary">{formatPrice(ad.price)}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(ad.id);
                          }}
                          className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 shrink-0 border border-border hover:border-red-200 transition-all"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* C. STATS TAB */}
            {activeTab === "stats" && (
              <div className="bg-card border border-border p-6 rounded-3xl shadow-premium">
                 <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
                   <BarChart2 className="w-5 h-5 text-primary" />
                   <div>
                     <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Visualizações ao longo do tempo</h3>
                     <p className="text-[10px] text-muted-foreground">Métrica de alcance dos seus anúncios nos últimos 7 dias</p>
                   </div>
                 </div>
                 
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: "currentColor", opacity: 0.5}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: "currentColor", opacity: 0.5}} dx={-10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#10b981' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          name="Visualizações"
                          stroke="#10b981" 
                          strokeWidth={3} 
                          dot={{r: 4, strokeWidth: 2, fill: "var(--card)"}} 
                          activeDot={{r: 6, strokeWidth: 0}} 
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            )}

            {/* D. PROFILE SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-card border border-border p-6 rounded-3xl shadow-premium max-w-2xl">
                <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                  <div className="border-b border-border pb-3 mb-2">
                    <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
                      Dados Cadastrais do Vendedor
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Estes dados são públicos nos seus anúncios para contacto direto dos compradores.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Nome Completo ou Loja *</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold focus:outline-none focus:border-primary"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Telemóvel de Contacto *</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">URL do Avatar / Imagem de Perfil</label>
                    <input
                      type="url"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      className="p-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">URL da Capa de Fundo (Banner)</label>
                    <input
                      type="url"
                      value={profileBanner}
                      onChange={(e) => setProfileBanner(e.target.value)}
                      className="p-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-black py-3.5 px-6 rounded-xl shadow-md self-start transition-all hover:scale-[1.01] mt-2 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" /> Guardar Definições
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
