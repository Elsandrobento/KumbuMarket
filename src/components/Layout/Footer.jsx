import React from "react";
import { MessageSquare, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Footer = () => {
  const { navigateTo, setSearchCategory, addNotification } = useApp();

  const handleDummyClick = (e, name) => {
    e.preventDefault();
    addNotification("info", name, "Funcionalidade de demonstração do ecossistema KumbuMarket SaaS.");
  };

  const handleCategoryClick = (catId) => {
    setSearchCategory(catId);
    navigateTo("search");
  };

  return (
    <footer className="bg-card border-t border-border mt-12 pb-20 md:pb-8 pt-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Info and Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo("home")}>
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white text-lg font-bold">K</span>
              </div>
              <span className="text-md font-black tracking-tight text-foreground">
                Kumbu<span className="text-primary">Market</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O principal ecossistema SaaS de classificados de compra e venda em Angola. Conectamos milhares de angolanos com segurança, modernidade e facilidade todos os dias.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground mt-2">
              <a href="#" onClick={(e) => handleDummyClick(e, "Facebook")} className="hover:text-primary transition-colors" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => handleDummyClick(e, "Instagram")} className="hover:text-primary transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => handleDummyClick(e, "LinkedIn")} className="hover:text-primary transition-colors" title="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Hot categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Categorias Quentes</h4>
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <button onClick={() => handleCategoryClick("viaturas")} className="text-left hover:text-primary transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary" /> Viaturas & Peças
              </button>
              <button onClick={() => handleCategoryClick("imoveis")} className="text-left hover:text-primary transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary" /> Imóveis & Casas
              </button>
              <button onClick={() => handleCategoryClick("electronicos")} className="text-left hover:text-primary transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary" /> Telemóveis & Electrónicos
              </button>
              <button onClick={() => handleCategoryClick("servicos")} className="text-left hover:text-primary transition-colors flex items-center gap-1 group">
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary" /> Serviços e Empregos
              </button>
            </div>
          </div>

          {/* Column 3: Corporate */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Empresa</h4>
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <a href="#" onClick={(e) => handleDummyClick(e, "Sobre Nós")} className="hover:text-primary transition-colors">Sobre Nós</a>
              <a href="#" onClick={(e) => handleDummyClick(e, "Planos Premium & Monetização")} className="hover:text-primary transition-colors">Planos Premium & Monetização</a>
              <a href="#" onClick={(e) => handleDummyClick(e, "Termos & Condições de Uso")} className="hover:text-primary transition-colors">Termos & Condições de Uso</a>
              <a href="#" onClick={(e) => handleDummyClick(e, "Política de Privacidade")} className="hover:text-primary transition-colors">Política de Privacidade</a>
            </div>
          </div>

          {/* Column 4: Contact & App */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Contactos</h4>
            <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Via S8, Talatona, Luanda - Angola</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+244 923 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contacto@kumbumarket.ao</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground pb-4">
          <p>© {new Date().getFullYear()} KumbuMarket. Todos os direitos reservados. Feito com amor em Angola.</p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Idioma:</span>
            <span onClick={() => addNotification("info", "Idioma", "Português de Angola é o idioma ativo por defeito.")} className="hover:text-primary cursor-pointer transition-all underline">Português</span>
            <span className="text-border">|</span>
            <span className="font-semibold text-foreground">Moeda:</span>
            <span className="text-primary font-bold">Kwanza (AOA)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
