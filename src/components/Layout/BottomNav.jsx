import React from "react";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const BottomNav = () => {
  const { currentView, navigateTo, chats, currentUser } = useApp();
  const unreadChats = chats.filter(c => c.unread).length;

  const navItems = [
    { id: "home", label: "Início", icon: <Home className="w-5 h-5" /> },
    { id: "search", label: "Pesquisar", icon: <Search className="w-5 h-5" /> },
    { id: "create-ad", label: "Anunciar", icon: <PlusCircle className="w-6 h-6 text-primary" />, highlight: true },
    { id: "chat", label: "Mensagens", icon: <MessageSquare className="w-5 h-5" />, badge: unreadChats },
    { id: "dashboard", label: "Perfil", icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 border-t border-border glass shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = currentView === item.id || (item.id === "dashboard" && currentView === "admin");
        
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id === "create-ad" && !currentUser ? "dashboard" : item.id)}
            className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-xl transition-all ${
              isActive 
                ? item.highlight ? "scale-105" : "text-primary nav-active-glow" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {/* Icon wrapper */}
            <div className={`p-1 rounded-full ${item.highlight ? "bg-primary-light p-1.5 shadow-sm" : ""}`}>
              {item.icon}
            </div>

            {/* Badge Indicator */}
            {item.badge > 0 ? (
              <span className="absolute top-1.5 right-4 w-4 h-4 rounded-full bg-danger text-[9px] font-bold text-white flex items-center justify-center pulse-online">
                {item.badge}
              </span>
            ) : null}

            {/* Active Glow Dot */}
            {isActive && !item.highlight && (
              <span className="absolute bottom-0 w-1 h-1 rounded-full bg-primary" />
            )}

            {/* Label */}
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
