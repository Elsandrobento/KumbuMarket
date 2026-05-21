import React, { useState } from "react";
import { MessageSquare, Bell, User, PlusCircle, Search, LogOut, LayoutDashboard, Shield, Heart, MapPin, ChevronDown, ShoppingBag } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PROVINCES } from "../../data/mockData";

export const Header = () => {
  const {
    currentUser,
    currentView,
    navigateTo,
    logoutUser,
    setShowAuthModal,
    chats,
    favorites,
    reports,
    ads,
    searchProvince,
    setSearchProvince,
    setSearchQuery,
    setSearchCategory
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const unreadChats = chats.filter(c => c.unread).length;
  const pendingAdsCount = ads.filter(a => a.status === "pendente").length;

  const adminNotifications = currentUser?.role === "admin" ? [
    { id: 1, text: `${pendingAdsCount} anúncios aguardando moderação`, view: "admin" },
    { id: 2, text: `${reports.length} denúncias pendentes de análise`, view: "admin" }
  ] : [
    { id: 1, text: "O seu anúncio 'Toyota Land Cruiser' recebeu 245 visitas hoje!", view: "dashboard" },
    { id: 2, text: "Dina Santos enviou-lhe uma proposta no chat.", view: "chat" }
  ];

  const handleActionClick = (view) => {
    navigateTo(view);
    setShowProfileMenu(false);
    setShowNotifications(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    // Reset category if doing a global search
    setSearchCategory("");
    navigateTo("search");
  };

  const handleProvinceSelect = (provName) => {
    setSearchProvince(provName);
    setShowProvinceDropdown(false);
    navigateTo("search");
  };

  return (
    <header className="w-full bg-[#fff159] text-slate-800 border-b border-yellow-400 shadow-sm sticky top-0 z-40">
      {/* Container matching Mercado Livre Layout */}
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex flex-col gap-2">
        
        {/* ROW 1: Brand Logo, Search Bar, Quick Ads Banner/CTA */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            onClick={() => navigateTo("home")}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-black tracking-tight">K</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-md font-black tracking-tight text-slate-900">
                Kumbu<span className="text-emerald-600">Market</span>
              </span>
              <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-0.5">
                Angola SaaS
              </span>
            </div>
          </div>

          {/* Search Box - Big and Centered */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative flex items-center shadow-sm"
          >
            <input
              type="text"
              placeholder="Buscar produtos, marcas, viaturas e muito mais..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-4 pr-12 py-2 text-sm rounded-md bg-white text-slate-800 placeholder-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <button 
              type="submit"
              className="absolute right-0 h-full px-4 rounded-r-md border-l border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* SaaS Plan promotion banner / CTA */}
          <div className="hidden lg:flex items-center shrink-0">
            <span className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1 rounded-md shadow-sm">
              ✨ Destaque Gold Auto-Aprovado
            </span>
          </div>

        </div>

        {/* ROW 2: Localization, Navigation Links, Auth Actions */}
        <div className="flex items-center justify-between text-xs font-medium pt-1 border-t border-yellow-300/40">
          
          {/* Left Side: Enviar Para (Province selector) */}
          <div className="relative flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 transition-all select-none">
            <MapPin className="w-4 h-4 text-slate-800 shrink-0" />
            <div 
              className="flex flex-col text-[10px] leading-tight"
              onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
            >
              <span className="text-slate-500">Enviar para</span>
              <span className="font-bold flex items-center gap-0.5">
                {searchProvince || "Angola"} <ChevronDown className="w-3 h-3" />
              </span>
            </div>

            {/* Province selection dropdown popover */}
            {showProvinceDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border bg-card p-3 shadow-xl glass z-50 animate-slide-up text-left">
                <h4 className="text-xs font-bold text-foreground mb-2 px-2 border-b border-border pb-1">
                  Selecionar Província
                </h4>
                <div className="max-h-60 overflow-y-auto flex flex-col gap-1 no-scrollbar">
                  <button
                    onClick={() => handleProvinceSelect("")}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted font-semibold text-primary transition-all text-xs"
                  >
                    Todas as Províncias
                  </button>
                  {PROVINCES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProvinceSelect(p.name)}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted text-foreground transition-all text-xs"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation Links (Categories, Ofertas, SaaS Plans) */}
          <div className="hidden md:flex items-center gap-5 text-slate-600">
            <button 
              onClick={() => {
                setSearchCategory("");
                navigateTo("search");
              }} 
              className="hover:text-slate-900 transition-colors"
            >
              Categorias
            </button>
            <button 
              onClick={() => {
                setSearchQuery("");
                navigateTo("search");
              }} 
              className="hover:text-slate-900 transition-colors"
            >
              Ofertas do Dia
            </button>
            <button 
              onClick={() => navigateTo(currentUser ? "create-ad" : "dashboard")}
              className="hover:text-slate-900 transition-colors font-bold text-emerald-700"
            >
              Vender
            </button>
            <button 
              onClick={() => navigateTo("home")}
              className="hover:text-slate-900 transition-colors"
            >
              Histórico
            </button>
          </div>

          {/* Right Side: Auth / Dashboard CTA / Messages / Notifications */}
          <div className="flex items-center gap-4 text-slate-700 shrink-0">
            
            {currentUser ? (
              <>
                {/* User Menu Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1.5 hover:text-slate-900 transition-all font-semibold focus:outline-none"
                  >
                    <span>Olá, {currentUser.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl glass z-50 animate-slide-up text-left">
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-bold text-foreground truncate">{currentUser.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                            {currentUser.plan}
                          </span>
                          {currentUser.verified && (
                            <span className="text-[9px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                              Verificado
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="py-1 text-xs">
                        <button
                          onClick={() => handleActionClick("dashboard")}
                          className="w-full flex items-center gap-2 px-3 py-2 font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Meu Dashboard
                        </button>
                        <button
                          onClick={() => handleActionClick("dashboard")}
                          className="w-full flex items-center gap-2 px-3 py-2 font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                        >
                          <Heart className="w-4 h-4" />
                          Meus Favoritos ({favorites.length})
                        </button>
                        
                        {currentUser.role === "admin" && (
                          <button
                            onClick={() => handleActionClick("admin")}
                            className="w-full flex items-center gap-2 px-3 py-2 font-semibold text-primary hover:bg-primary-light rounded-lg transition-all"
                          >
                            <Shield className="w-4 h-4" />
                            Painel Admin {pendingAdsCount > 0 && `(${pendingAdsCount})`}
                          </button>
                        )}
                      </div>
                      
                      <div className="border-t border-border pt-1">
                        <button
                          onClick={() => {
                            logoutUser();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 font-medium text-red-500 hover:bg-red-50 hover:dark:bg-red-950/20 rounded-lg transition-all text-xs"
                        >
                          <LogOut className="w-4 h-4" />
                          Terminar Sessão
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Favorites Quicklink */}
                <button 
                  onClick={() => navigateTo("dashboard")}
                  className="hover:text-slate-900 relative transition-all"
                  title="Favoritos"
                >
                  <Heart className="w-4.5 h-4.5" />
                </button>

                {/* Messages Quicklink */}
                <button 
                  onClick={() => navigateTo("chat")}
                  className="hover:text-slate-900 relative transition-all"
                  title="Mensagens"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  {unreadChats > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-[8px] font-bold text-white flex items-center justify-center pulse-online">
                      {unreadChats}
                    </span>
                  )}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="hover:text-slate-900 relative transition-all animate-none"
                    title="Notificações"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {adminNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-600" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl glass z-50 animate-slide-up text-left">
                      <h3 className="text-xs font-bold text-foreground mb-3 flex items-center justify-between">
                        <span>Notificações</span>
                        <span className="text-[9px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold">Recentes</span>
                      </h3>
                      <div className="flex flex-col gap-2">
                        {adminNotifications.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              navigateTo(n.view);
                              setShowNotifications(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-all text-xs border border-transparent hover:border-border"
                          >
                            <p className="text-foreground leading-snug">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hover:text-slate-900 transition-all font-semibold"
                >
                  Criar conta
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hover:text-slate-900 transition-all font-semibold border-l border-yellow-400 pl-3"
                >
                  Entrar
                </button>
              </div>
            )}

            {/* Quick Sell CTA */}
            <button
              onClick={() => navigateTo(currentUser ? "create-ad" : "dashboard")}
              className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-sm hover:shadow transition-all flex items-center gap-1 active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Anunciar</span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};
