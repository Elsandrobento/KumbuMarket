import React from "react";
import { Search, ShieldCheck, MapPin, TrendingUp, Sparkles, Car, Home, Smartphone, Briefcase, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Hero = () => {
  const { navigateTo, setSearchCategory, setSearchQuery } = useApp();

  const handleCategoryClick = (catId) => {
    setSearchCategory(catId);
    setSearchQuery("");
    navigateTo("search");
  };

  const quickCategories = [
    { id: "viaturas", label: "Viaturas", icon: <Car className="w-5 h-5" />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "imoveis", label: "Imóveis", icon: <Home className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "tecnologia", label: "Tecnologia", icon: <Smartphone className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "servicos", label: "Serviços", icon: <Briefcase className="w-5 h-5" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
  ];

  return (
    <div className="w-full bg-white border-b border-border relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Column: Text & Search */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:max-w-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase">O Maior Mercado Online de Angola</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Compre e venda de forma <span className="text-primary">segura</span> e <span className="text-primary">rápida</span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
            Desde imóveis e viaturas até tecnologia e moda. O KumbuMarket liga compradores e vendedores de todo o país com proteção total.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl mt-4 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigateTo("search")}
              className="flex-1 flex items-center justify-between px-6 py-4 bg-slate-50 border border-border hover:border-primary/40 rounded-2xl text-slate-500 hover:text-slate-700 transition-colors shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">O que estás à procura?</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => navigateTo("create-ad")}
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              Anunciar Grátis
            </button>
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Populares:</span>
            {quickCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${cat.color} hover:shadow-md transition-all font-semibold text-sm`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Featured Image / Stats */}
        <div className="flex-1 w-full lg:max-w-md relative hidden md:block">
          {/* Main Visual Card */}
          <div className="relative z-10 bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100 rotate-1 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80" 
              alt="KumbuMarket App" 
              className="w-full h-[400px] object-cover rounded-[1.5rem]"
            />
            
            {/* Floating Badge 1 */}
            <div className="absolute -left-6 top-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Transações</p>
                <p className="text-sm font-black text-slate-800">100% Seguras</p>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute -right-8 bottom-16 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-delayed">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Anúncios Ativos</p>
                <p className="text-sm font-black text-slate-800">+10.000 Ofertas</p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-primary opacity-20 rounded-[3rem] blur-3xl -z-10 translate-x-8 translate-y-8" />
        </div>

      </div>
    </div>
  );
};
