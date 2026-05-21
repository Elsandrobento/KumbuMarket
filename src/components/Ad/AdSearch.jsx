import React, { useState, useEffect } from "react";
import { 
  Search, MapPin, SlidersHorizontal, ArrowUpDown, RefreshCw, X, 
  Home as HomeIcon, Car as CarIcon, Briefcase as BriefcaseIcon, 
  Smartphone as PhoneIcon, Shirt as ShirtIcon, Wrench as WrenchIcon, 
  Cpu as CpuIcon, Hammer as HammerIcon, Leaf as LeafIcon, Layers as LayersIcon,
  Check
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AdCard } from "./AdCard";
import { PROVINCES, CATEGORIES } from "../../data/mockData";

export const AdSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    searchProvince,
    setSearchProvince,
    searchCity,
    setSearchCity,
    searchPriceMin,
    setSearchPriceMin,
    searchPriceMax,
    setSearchPriceMax,
    searchCondition,
    setSearchCondition,
    searchPriceType,
    setSearchPriceType,
    searchSort,
    setSearchSort,
    getFilteredAds
  } = useApp();

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync local query with global
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const resetFilters = () => {
    setLocalQuery("");
    setSearchQuery("");
    setSearchCategory("");
    setSearchProvince("");
    setSearchCity("");
    setSearchPriceMin("");
    setSearchPriceMax("");
    setSearchCondition("");
    setSearchPriceType("");
    setSearchSort("recent");
  };

  const filteredAds = getFilteredAds();

  // Find active cities based on province
  const activeProvObj = PROVINCES.find(p => p.name === searchProvince);
  const cities = activeProvObj ? activeProvObj.cities : [];

  const getCategoryIcon = (iconName) => {
    const classProps = "w-4 h-4 shrink-0 transition-colors";
    switch (iconName) {
      case "Home": return <HomeIcon className={classProps} />;
      case "Car": return <CarIcon className={classProps} />;
      case "Briefcase": return <BriefcaseIcon className={classProps} />;
      case "Smartphone": return <PhoneIcon className={classProps} />;
      case "Shirt": return <ShirtIcon className={classProps} />;
      case "Wrench": return <WrenchIcon className={classProps} />;
      case "Cpu": return <CpuIcon className={classProps} />;
      case "Hammer": return <HammerIcon className={classProps} />;
      case "Leaf": return <LeafIcon className={classProps} />;
      default: return <LayersIcon className={classProps} />;
    }
  };

  const hasActiveFilters = 
    searchQuery || searchCategory || searchProvince || searchCity || 
    searchPriceMin || searchPriceMax || searchCondition || searchPriceType;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Header Search Bar Box - High Fidelity Style */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-premium mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <form onSubmit={handleQuerySubmit} className="flex-1 flex items-center bg-muted/40 border border-border/60 hover:border-border rounded-2xl px-4 py-1.5 gap-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="O que procura em Angola? Carro, telemóvel, vivenda..."
            className="w-full bg-transparent border-none text-foreground placeholder-muted-foreground text-xs sm:text-sm py-2.5 focus:outline-none"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => { setLocalQuery(""); setSearchQuery(""); }}
              className="p-1 rounded-full bg-muted/65 hover:bg-muted text-muted-foreground transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowFiltersMobile(true)}
            className="md:hidden flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-2xl border border-border transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" /> Filtros
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/10 dark:hover:bg-red-950/20 text-red-600 font-bold text-xs px-5 py-3.5 rounded-2xl border border-red-100 dark:border-red-900/30 transition-all"
              title="Limpar todos os filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Layout Grid: Sidebar Filters vs Ads Display Grid */}
      <div className="flex gap-8 items-start">
        
        {/* Sidebar Filters (Desktop Only) */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col gap-6 p-6 bg-card border border-border rounded-3xl shadow-premium">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filtrar Resultados
            </span>
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="text-[10px] text-red-500 hover:underline font-bold"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {/* Category Filter - Premium List style */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Categorias</label>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSearchCategory("")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  !searchCategory
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayersIcon className="w-4 h-4 shrink-0" />
                  <span>Todas as Categorias</span>
                </div>
              </button>
              
              {CATEGORIES.map((c) => {
                const isSelected = searchCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSearchCategory(c.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(c.icon)}
                      <span>{c.name}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-muted rounded-md text-muted-foreground font-semibold">
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Province Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Província</label>
            <div className="relative">
              <select
                value={searchProvince}
                onChange={(e) => { setSearchProvince(e.target.value); setSearchCity(""); }}
                className="w-full p-3 pl-9 text-xs rounded-xl border border-border bg-background text-foreground font-bold focus:ring-1 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Todas as Províncias</option>
                {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <MapPin className="w-4 h-4 text-primary absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* City Filter */}
          {searchProvince && (
            <div className="flex flex-col gap-1.5 animate-slide-up">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Município</label>
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="">Todos os Municípios</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          <hr className="border-border/60" />

          {/* Condition Filter - Custom Clickable Pills */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Estado do Artigo</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { val: "", label: "Todos" },
                { val: "novo", label: "Novo" },
                { val: "como novo", label: "Como Novo" },
                { val: "usado", label: "Usado" }
              ].map((cond) => {
                const isSelected = searchCondition === cond.val;
                return (
                  <button
                    key={cond.val}
                    onClick={() => setSearchCondition(cond.val)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-background hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {cond.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Type Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Tipo de Negócio</label>
            <div className="flex flex-col gap-1.5">
              {[
                { val: "", label: "Qualquer tipo" },
                { val: "negociável", label: "Negociável" },
                { val: "preço fixo", label: "Preço Fixo" }
              ].map((type) => {
                const isSelected = searchPriceType === type.val;
                return (
                  <button
                    key={type.val}
                    onClick={() => setSearchPriceType(type.val)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 dark:bg-slate-800 dark:border-slate-800 text-white"
                        : "bg-background hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    <span>{type.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Price Range inputs */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Faixa de Preço (AOA)</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={searchPriceMin}
                  onChange={(e) => setSearchPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground text-center font-bold focus:outline-none focus:border-primary"
                />
              </div>
              <span className="text-muted-foreground text-xs font-semibold">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  value={searchPriceMax}
                  onChange={(e) => setSearchPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground text-center font-bold focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

        </aside>

        {/* Search Results Display Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Results Summary and Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4 text-xs text-muted-foreground font-semibold">
            <span>
              Encontrámos <strong className="text-foreground">{filteredAds.length}</strong> anúncios {searchProvince ? `em ${searchProvince}` : "em Angola"}
            </span>
            
            <div className="flex items-center gap-1.5 self-end sm:self-auto bg-card border border-border rounded-xl px-3 py-1.5 shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-primary shrink-0" />
              <select
                value={searchSort}
                onChange={(e) => setSearchSort(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-foreground font-bold cursor-pointer text-xs focus:outline-none"
              >
                <option value="recent">Mais Recentes</option>
                <option value="views">Mais Relevantes</option>
                <option value="price-asc">Preço: Menor a Maior</option>
                <option value="price-desc">Preço: Maior a Menor</option>
              </select>
            </div>
          </div>

          {/* Ads Listings Grid */}
          {filteredAds.length === 0 ? (
            <div className="text-center py-20 px-6 bg-card rounded-3xl border border-border flex flex-col items-center gap-4 shadow-premium">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-md font-bold text-foreground">Nenhum anúncio encontrado</h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Não conseguimos encontrar resultados para a sua seleção de filtros. Tente alargar a sua pesquisa ou limpe os filtros ativos.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}

        </div>

      </div>

      {/* MOBILE FILTERS SHEET MODAL */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-card w-80 h-full p-6 shadow-2xl border-l border-border flex flex-col gap-5 overflow-y-auto animate-slide-up relative">
            
            {/* Close button */}
            <button
              onClick={() => setShowFiltersMobile(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-black uppercase text-primary tracking-widest mt-2">Kumbu Filters</span>
            <h3 className="text-md font-bold text-foreground">Filtros de Pesquisa</h3>
            <hr className="border-border/60" />

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Categoria</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold"
              >
                <option value="">Todas as Categorias</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Província</label>
              <select
                value={searchProvince}
                onChange={(e) => { setSearchProvince(e.target.value); setSearchCity(""); }}
                className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold"
              >
                <option value="">Todas as Províncias</option>
                {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>

            {/* City */}
            {searchProvince && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Município / Cidade</label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold"
                >
                  <option value="">Todos os Municípios</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {/* Condition */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Estado do Artigo</label>
              <select
                value={searchCondition}
                onChange={(e) => setSearchCondition(e.target.value)}
                className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold"
              >
                <option value="">Todos os Estados</option>
                <option value="novo">Novo</option>
                <option value="como novo">Como Novo</option>
                <option value="usado">Usado</option>
              </select>
            </div>

            {/* Price Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Tipo de Preço</label>
              <select
                value={searchPriceType}
                onChange={(e) => setSearchPriceType(e.target.value)}
                className="p-3 text-xs rounded-xl border border-border bg-background text-foreground font-bold"
              >
                <option value="">Negociável / Fixo</option>
                <option value="negociável">Negociável</option>
                <option value="preço fixo">Preço Fixo</option>
              </select>
            </div>

            {/* Prices */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Preço Mínimo / Máximo (AOA)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={searchPriceMin}
                  onChange={(e) => setSearchPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground text-center font-bold"
                />
                <input
                  type="number"
                  value={searchPriceMax}
                  onChange={(e) => setSearchPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground text-center font-bold"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFiltersMobile(false)}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl shadow-md mt-4 transition-all"
            >
              Aplicar Filtros
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
