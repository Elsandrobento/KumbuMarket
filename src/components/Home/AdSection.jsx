import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Compass, Plus, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { AdCard } from "../Ad/AdCard";
import { useApp } from "../../context/AppContext";

export const AdSection = () => {
  const { ads, navigateTo, currentUser } = useApp();
  const [loading, setLoading] = useState(true);

  // Simulate Premium Skeleton Loading Experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const activeAds = ads.filter(ad => ad.status === "ativo");
  const featuredAds = activeAds.filter(ad => ad.featured).slice(0, 8);
  const recentAds = activeAds.filter(ad => !ad.featured).slice(0, 8);
  const recommendedAds = [...activeAds].sort((a, b) => b.views - a.views).slice(0, 8);

  const renderSkeletons = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3 p-3 rounded-xl border border-slate-200 bg-white min-w-[200px] sm:min-w-[240px] w-[200px] sm:w-[240px] shrink-0">
        <div className="w-full aspect-square rounded-lg skeleton" />
        <div className="h-3 w-1/3 rounded skeleton mt-2" />
        <div className="h-5 w-3/4 rounded skeleton" />
        <div className="h-6 w-1/2 rounded skeleton mt-auto" />
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10 bg-slate-100">
      
      {/* 1. Featured Section: Destaques Gold (Horizontal Shelf) */}
      {featuredAds.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                Destaques Kumbu Gold
              </h2>
              <p className="text-xs text-slate-500">
                Os anúncios com maior visibilidade e garantias premium de Angola.
              </p>
            </div>
            
            <button 
              onClick={() => navigateTo("search")} 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scroll container */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {loading ? renderSkeletons(4) : featuredAds.map(ad => (
              <div key={ad.id} className="min-w-[200px] sm:min-w-[240px] w-[200px] sm:w-[240px] shrink-0">
                <AdCard ad={ad} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interstitial Amazon/Mercado Livre Style Brand Benefit Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Compra protegida em todo o território de Angola
            </h3>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              No KumbuMarket, a segurança é a nossa prioridade. Recomendamos sempre encontrar-se com o vendedor num local público seguro em Luanda ou na sua província antes de efetuar qualquer pagamento.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button 
            onClick={() => navigateTo(currentUser ? "create-ad" : "dashboard")}
            className="flex-1 md:flex-none text-center bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow-sm transition-all"
          >
            Vender Agora
          </button>
          <button
            onClick={() => addNotification("info", "Como Funciona", "1. Cria uma conta gratuita → 2. Publica o teu anúncio → 3. Recebe mensagens de compradores → 4. Fecha negócio em segurança!")}
            className="flex-1 md:flex-none text-center border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-3 rounded-lg transition-all"
          >
            Como Funciona
          </button>
        </div>
      </section>

      {/* 2. Recent Section: Ofertas Relâmpago (Horizontal Shelf) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-emerald-600" />
              Ofertas Relâmpago Recentes
            </h2>
            <p className="text-xs text-slate-500">
              Produtos e viaturas adicionados há poucos minutos com preços especiais.
            </p>
          </div>
          
          <button 
            onClick={() => navigateTo("search")} 
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {loading ? renderSkeletons(4) : recentAds.map(ad => (
            <div key={ad.id} className="min-w-[200px] sm:min-w-[240px] w-[200px] sm:w-[240px] shrink-0">
              <AdCard ad={ad} />
            </div>
          ))}
        </div>
      </section>

      {/* Interstitial Monetization SaaS Banner */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-xl flex flex-col items-start gap-3 relative z-10">
          <span className="text-[9px] uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-0.5 rounded shadow-sm">
            Monetização SaaS
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Quer vender 10x mais rápido no Kumbu?
          </h2>
          <p className="text-xs text-emerald-50 max-w-md leading-relaxed">
            Destaque os seus produtos na nossa prateleira principal e apareça nas primeiras posições de busca nas 18 províncias com pagamentos integrados no Multicaixa Express.
          </p>
          <button
            onClick={() => navigateTo(currentUser ? "create-ad" : "dashboard")}
            className="bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xs px-5 py-3 rounded-lg shadow-md transition-all active:scale-[0.99] mt-1"
          >
            Conhecer Planos de Destaque
          </button>
        </div>
      </section>

      {/* 3. Recommended Section: Mais Procurados (Horizontal Shelf) */}
      {recommendedAds.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-emerald-600" />
                Os Mais Procurados em Angola
              </h2>
              <p className="text-xs text-slate-500">
                Os artigos e serviços com maior número de visualizações e propostas de chat esta semana.
              </p>
            </div>
            
            <button 
              onClick={() => navigateTo("search")} 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scroll container */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {loading ? renderSkeletons(4) : recommendedAds.map(ad => (
              <div key={ad.id} className="min-w-[200px] sm:min-w-[240px] w-[200px] sm:w-[240px] shrink-0">
                <AdCard ad={ad} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
