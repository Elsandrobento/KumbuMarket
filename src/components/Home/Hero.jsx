import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, CreditCard, Sparkles, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Hero = () => {
  const { navigateTo, setSearchCategory, setSearchQuery } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Super Ofertas de Viaturas em Luanda",
      subtitle: "Toyota Land Cruiser, Hilux e muito mais com preços negociáveis.",
      cta: "Ver Viaturas",
      category: "viaturas",
      bgGradient: "from-slate-900 via-indigo-950 to-slate-900",
      badge: "Destaque da Semana",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Planos SaaS Kumbu Destaque Gold",
      subtitle: "Aumente as suas vendas em até 10x com destaque gold auto-aprovado.",
      cta: "Destacar Anúncio",
      view: "create-ad",
      bgGradient: "from-emerald-950 via-teal-900 to-emerald-950",
      badge: "Kumbu Monetização",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Imóveis & Vivendas no Jardim de Rosas",
      subtitle: "Encontre a vivenda V4 dos seus sonhos com piscina e segurança 24h.",
      cta: "Explorar Casas",
      category: "imoveis",
      bgGradient: "from-slate-900 via-slate-950 to-slate-900",
      badge: "Imobiliária Angola",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=400&fit=crop"
    }
  ];

  // Auto-play slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCtaClick = (slide) => {
    if (slide.category) {
      setSearchCategory(slide.category);
      setSearchQuery("");
      navigateTo("search");
    } else if (slide.view) {
      navigateTo(slide.view);
    }
  };

  const benefits = [
    {
      id: 1,
      title: "Pagamento 100% Seguro",
      desc: "Multicaixa Express & Ref Bancária",
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 2,
      title: "Compra Protegida",
      desc: "Negociações e encontros seguros",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 3,
      title: "18 Províncias de Angola",
      desc: "De Cabinda ao Cunene",
      icon: <Truck className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 4,
      title: "Garantia Kumbu SaaS",
      desc: "Planos e reembolsos flexíveis",
      icon: <RefreshCw className="w-5 h-5 text-emerald-600" />
    }
  ];

  return (
    <div className="w-full bg-slate-100 pb-2">
      {/* 1. Large Sliding Banner Carousel (Amazon/Mercado Livre Style) */}
      <div className="relative h-[240px] sm:h-[340px] lg:h-[400px] overflow-hidden w-full group">
        
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full flex transition-all duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95 pointer-events-none"
              }`}
            >
              {/* Background gradient layout */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-95 z-10`} />
              
              {/* Slide Content wrapper */}
              <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full h-full flex flex-col md:flex-row items-center justify-between gap-8 relative z-20 text-white py-6">
                
                <div className="flex flex-col items-start text-left gap-3 max-w-xl">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                    {slide.badge}
                  </span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-md drop-shadow">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => handleCtaClick(slide)}
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    {slide.cta}
                  </button>
                </div>

                {/* Cover Image */}
                <div className="hidden md:block w-1/2 max-w-md aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                </div>

              </div>
            </div>
          );
        })}

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-all border border-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-all border border-white/5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>

      {/* 2. Horizontal Benefits Bar (Mercado Livre Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-card border border-border shadow-premium rounded-2xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
          {benefits.map((benefit, idx) => (
            <div 
              key={benefit.id}
              className={`flex items-center gap-3.5 ${
                idx > 1 ? "pt-4 md:pt-0" : ""
              } ${idx % 2 !== 0 ? "pl-2 sm:pl-0" : ""} md:pl-6`}
            >
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 shrink-0">
                {benefit.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-foreground tracking-tight truncate leading-tight">
                  {benefit.title}
                </span>
                <span className="text-[10px] text-muted-foreground truncate leading-normal mt-0.5">
                  {benefit.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
