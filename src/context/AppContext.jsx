import React, { createContext, useContext, useState, useEffect } from "react";
import { USERS, INITIAL_ADS, INITIAL_CHATS, FINANCIALS, PROVINCES } from "../data/mockData";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState("home");
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("kumbu_user");
    return saved && saved !== "null" ? JSON.parse(saved) : null; // Guest by default to match Mercado Livre / Amazon experience
  });

  // DB states (Ads, Chats, Financials, Users)
  const [ads, setAds] = useState(() => {
    const saved = localStorage.getItem("kumbu_ads");
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("kumbu_chats");
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("kumbu_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = [...parsed];
        USERS.forEach(mockUser => {
          if (!merged.some(u => u.id === mockUser.id)) {
            merged.push(mockUser);
          }
        });
        return merged;
      } catch (e) {
        return USERS;
      }
    }
    return USERS;
  });

  const [financials, setFinancials] = useState(() => {
    const saved = localStorage.getItem("kumbu_financials");
    return saved ? JSON.parse(saved) : FINANCIALS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("kumbu_favorites");
    return saved ? JSON.parse(saved) : ["ad_3"]; // Pre-favorite iPhone 15 by default
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem("kumbu_reports");
    return saved ? JSON.parse(saved) : [
      { id: "rep_1", adId: "ad_8", reason: "Preço suspeito de falsificação", reporter: "Edmilson Costa", date: "Há 1 dia" }
    ];
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchPriceMin, setSearchPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");
  const [searchCondition, setSearchCondition] = useState("");
  const [searchPriceType, setSearchPriceType] = useState("");
  const [searchSort, setSearchSort] = useState("recent");

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("kumbu_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("kumbu_ads", JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem("kumbu_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("kumbu_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("kumbu_financials", JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem("kumbu_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("kumbu_reports", JSON.stringify(reports));
  }, [reports]);

  // Toast Notification Helper
  const addNotification = (type, title, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Navigation router
  const navigateTo = (view, ad = null) => {
    setCurrentView(view);
    if (ad) {
      setSelectedAd(ad);
      // Increment views count on viewing detail
      if (view === "ad-details") {
        setAds((prev) =>
          prev.map((item) =>
            item.id === ad.id ? { ...item, views: item.views + 1 } : item
          )
        );
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auth Operations
  const registerUser = (userData) => {
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.name}`,
      banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
      verified: false,
      rating: 5.0,
      reviewsCount: 0,
      phone: userData.phone || "+244 923 000 000",
      whatsapp: userData.phone ? userData.phone.replace(/\s+/g, "") : "+244923000000",
      joinedDate: "Membro desde Hoje",
      role: "seller",
      plan: "Free",
      totalAds: 0,
      activeAds: 0,
      adViews: 0,
      messagesCount: 0,
      reviews: []
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addNotification("success", "Conta Criada!", `Bem-vindo ao KumbuMarket, ${userData.name}!`);
    navigateTo("home");
  };

  const loginUser = (emailOrId) => {
    const clean = emailOrId.toLowerCase().trim();
    
    // Attempt to resolve based on credentials
    let found = null;
    if (clean === "admin" || clean.includes("admin") || clean === "admin@kumbumarket.ao") {
      found = users.find(u => u.role === "admin") || USERS.find(u => u.role === "admin");
    } else if (clean.includes("carlos") || clean === "carlos@kumbu.com") {
      found = users.find(u => u.id === "user_1") || USERS.find(u => u.id === "user_1");
    } else if (clean.includes("dina") || clean === "dina@kumbu.com") {
      found = users.find(u => u.id === "user_2") || USERS.find(u => u.id === "user_2");
    } else if (clean.includes("edmilson") || clean === "edmilson@kumbu.com") {
      found = users.find(u => u.id === "user_3") || USERS.find(u => u.id === "user_3");
    } else {
      // Find matches in users array
      found = users.find(u => u.id === emailOrId || u.name.toLowerCase().includes(clean));
    }

    // Default fallback if not found
    if (!found) {
      // Create a temporary/new seller user for this email
      found = {
        id: `user_${Date.now()}`,
        name: emailOrId.split("@")[0],
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${emailOrId}`,
        banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
        verified: false,
        rating: 5.0,
        reviewsCount: 0,
        phone: "+244 923 000 000",
        whatsapp: "+244923000000",
        joinedDate: "Membro desde Hoje",
        role: "seller",
        plan: "Free",
        totalAds: 0,
        activeAds: 0,
        adViews: 0,
        messagesCount: 0,
        reviews: []
      };
      setUsers(prev => [...prev, found]);
    } else {
      // If we found the user in USERS but they aren't in the state 'users', let's add them
      if (!users.some(u => u.id === found.id)) {
        setUsers(prev => [...prev, found]);
      }
    }

    setCurrentUser(found);
    setShowAuthModal(false);
    
    if (found.role === "admin") {
      addNotification("success", "Painel Administrativo", "Autenticado como Administrador.");
      navigateTo("admin");
    } else {
      addNotification("success", "Sessão Iniciada", `Bem-vindo de volta, ${found.name}!`);
      navigateTo("dashboard");
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("kumbu_user");
    addNotification("success", "Sessão Terminada", "Sessão encerrada com sucesso.");
    navigateTo("home");
  };

  const changeUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
    addNotification("success", "Papel Alterado", `Utilizador promovido para ${newRole}.`);
  };

  const toggleVerifyUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, verified: !prev.verified }));
    }
    addNotification("success", "Status de Verificação", "Alterado selo de verificação com sucesso.");
  };

  // Ads Operations
  const createAd = (adData, isPremium = false, paymentDetails = null) => {
    const newAd = {
      id: `ad_${Date.now()}`,
      title: adData.title,
      description: adData.description,
      category: adData.category,
      subcategory: adData.subcategory || "Geral",
      price: parseFloat(adData.price),
      priceType: adData.priceType || "Negociável",
      condition: adData.condition || "Usado",
      location: {
        province: adData.province || "Luanda",
        city: adData.city || "Talatona"
      },
      contact: adData.contact || currentUser.phone,
      views: 0,
      date: "Agora mesmo",
      sellerId: currentUser.id,
      featured: isPremium,
      status: isPremium ? "ativo" : "pendente", // Premium plans auto-approve, free plans go to moderation queue!
      videoUrl: adData.videoUrl || "",
      images: adData.images.length > 0 ? adData.images : ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop"],
      features: adData.features || {}
    };

    setAds((prev) => [newAd, ...prev]);

    // Update user stats
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, totalAds: u.totalAds + 1, activeAds: u.activeAds + (isPremium ? 1 : 0) }
          : u
      )
    );
    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        totalAds: prev.totalAds + 1,
        activeAds: prev.activeAds + (isPremium ? 1 : 0)
      }));
    }

    if (isPremium && paymentDetails) {
      // Add transaction record
      const newTx = {
        id: `tx_${Date.now()}`,
        date: "Hoje",
        user: currentUser.name,
        plan: paymentDetails.planName || "Destaque Premium",
        amount: parseFloat(paymentDetails.amount),
        gateway: paymentDetails.gateway,
        status: "sucesso"
      };

      setFinancials((prev) => ({
        ...prev,
        revenueTotal: prev.revenueTotal + newTx.amount,
        transactions: [newTx, ...prev.transactions]
      }));

      addNotification("success", "Pagamento Confirmado!", `Plano de destaque premium ativo via ${paymentDetails.gateway}! Seu anúncio já está destacado.`);
    } else {
      addNotification("success", "Anúncio Publicado!", "O seu anúncio foi enviado e aguarda aprovação rápida do administrador.");
    }

    navigateTo("dashboard");
  };

  const toggleFavorite = (adId) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para guardar anúncios nos favoritos.");
      return;
    }
    setFavorites((prev) => {
      const isFav = prev.includes(adId);
      if (isFav) {
        addNotification("success", "Removido", "Anúncio removido dos favoritos.");
        return prev.filter((id) => id !== adId);
      } else {
        addNotification("success", "Favoritado", "Anúncio guardado nos favoritos!");
        return [...prev, adId];
      }
    });
  };

  // Chat Operations
  const startChat = (adId, sellerId) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para contactar o vendedor.");
      return;
    }

    if (currentUser.id === sellerId) {
      addNotification("warning", "Operação Inválida", "Não pode iniciar um chat no seu próprio anúncio.");
      return;
    }

    // Check if chat already exists
    const existing = chats.find(
      (c) => c.adId === adId && c.buyerId === currentUser.id && c.sellerId === sellerId
    );

    if (existing) {
      setSelectedChatId(existing.id);
      navigateTo("chat");
    } else {
      const newChat = {
        id: `chat_${Date.now()}`,
        adId,
        buyerId: currentUser.id,
        sellerId,
        unread: false,
        messages: [
          {
            id: `m_${Date.now()}`,
            senderId: "system",
            text: "Chat de Negociação Iniciado! Mantenha a sua segurança, evite pagamentos adiantados sem ver a mercadoria.",
            timestamp: "Agora"
          }
        ]
      };
      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
      navigateTo("chat");
    }
  };

  const sendChatMessage = (chatId, text, image = null) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: text,
      image: image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          unread: false,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    setChats(updatedChats);

    // Auto-respond buyer/seller bot simulator
    const recipientId = chat.buyerId === currentUser.id ? chat.sellerId : chat.buyerId;
    const recipientUser = users.find((u) => u.id === recipientId) || USERS.find((u) => u.id === recipientId);
    
    // Choose automated reply text
    const responses = [
      "Olá! Sim, ainda está disponível. Aceita vir ver amanhã?",
      "O preço é ligeiramente negociável. Qual é a sua proposta?",
      "Podemos encontrar-nos num local público para testar a mercadoria. Sugiro o Shopping de Belas.",
      "Excelente, pode mandar o seu contacto de WhatsApp para facilitarmos a comunicação?",
      "Ok, vou analisar e já lhe dou uma resposta definitiva. Obrigado pelo interesse!",
      "Está em perfeitas condições. Quase não foi usado."
    ];

    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      const replyMessage = {
        id: `m_reply_${Date.now()}`,
        senderId: recipientId,
        text: replyMessageText(text, randomReply),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats((current) =>
        current.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              unread: true,
              messages: [...c.messages, replyMessage]
            };
          }
          return c;
        })
      );

      addNotification("info", recipientUser?.name || "KumbuUser", `Enviou-lhe uma nova mensagem no chat.`);
    }, 3000);
  };

  const replyMessageText = (inputText, fallback) => {
    const lower = inputText.toLowerCase();
    if (lower.includes("preço") || lower.includes("quanto") || lower.includes("desconto")) {
      return "Podemos negociar um bocado sim, mas por favor faça uma proposta razoável.";
    }
    if (lower.includes("disponivel") || lower.includes("ainda tem") || lower.includes("ativo")) {
      return "Sim, o artigo ainda está disponível e pronto a entregar.";
    }
    if (lower.includes("whatsapp") || lower.includes("contacto") || lower.includes("número")) {
      return "Claro, podes ligar-me ou mandar mensagem no WhatsApp pelo contacto que está no anúncio.";
    }
    if (lower.includes("encontro") || lower.includes("onde") || lower.includes("ver")) {
      return "Podemos fechar negócio num local seguro em Luanda, de preferência num shopping ou bomba de combustível movimentada.";
    }
    return fallback;
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setSelectedChatId(null);
    addNotification("success", "Conversa Apagada", "A conversa foi eliminada com sucesso.");
  };

  // Admin Moderation Operations
  const approveAd = (adId) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: "ativo" } : ad))
    );

    // Update ad owner's activeAds count
    const targetAd = ads.find(a => a.id === adId);
    if (targetAd) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetAd.sellerId
            ? { ...u, activeAds: u.activeAds + 1 }
            : u
        )
      );
      if (currentUser && currentUser.id === targetAd.sellerId) {
        setCurrentUser(prev => ({ ...prev, activeAds: prev.activeAds + 1 }));
      }
    }

    addNotification("success", "Anúncio Aprovado", "O anúncio agora está visível para todo o público.");
  };

  const rejectAd = (adId) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: "expirado" } : ad))
    );
    addNotification("warning", "Anúncio Rejeitado", "O anúncio foi marcado como expirado/rejeitado.");
  };

  const deleteAdAdmin = (adId) => {
    setAds(prev => prev.filter(ad => ad.id !== adId));
    addNotification("success", "Anúncio Eliminado", "O anúncio foi removido permanentemente da base de dados.");
  };

  const reportAd = (adId, reason) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para denunciar anúncios.");
      return;
    }
    const newReport = {
      id: `rep_${Date.now()}`,
      adId,
      reason,
      reporter: currentUser.name,
      date: "Agora mesmo"
    };
    setReports(prev => [newReport, ...prev]);
    addNotification("success", "Denúncia Enviada", "Obrigado pela sua denúncia. Os nossos moderadores vão analisar de imediato.");
  };

  const dismissReport = (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    addNotification("success", "Denúncia Ignorada", "A denúncia foi encerrada com sucesso.");
  };

  // Seller rating and review
  const addSellerReview = (sellerId, ratingScore, commentText) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para deixar uma avaliação.");
      return;
    }

    const newRev = {
      id: `rev_${Date.now()}`,
      author: currentUser.name,
      rating: ratingScore,
      comment: commentText,
      date: "Agora mesmo"
    };

    setUsers(prev => prev.map(u => {
      if (u.id === sellerId) {
        const updatedReviews = [newRev, ...(u.reviews || [])];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...u,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: parseFloat(avg.toFixed(1))
        };
      }
      return u;
    }));

    addNotification("success", "Avaliação Registada", "Agradecemos o seu feedback sobre este vendedor.");
  };

  // Premium ad manual activation simulator
  const promoteAdToPremium = (adId, planName, amount, gateway) => {
    setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, featured: true, status: "ativo" } : ad));
    
    const newTx = {
      id: `tx_${Date.now()}`,
      date: "Hoje",
      user: currentUser.name,
      plan: planName,
      amount: amount,
      gateway: gateway,
      status: "sucesso"
    };

    setFinancials((prev) => ({
      ...prev,
      revenueTotal: prev.revenueTotal + amount,
      transactions: [newTx, ...prev.transactions]
    }));

    addNotification("success", "Destaque Premium!", `Anúncio destacado com sucesso via ${gateway}!`);
  };

  // Helper lists
  const getSellerById = (id) => {
    return users.find((u) => u.id === id) || USERS.find((u) => u.id === id) || USERS[0];
  };

  // Filtered ads getter
  const getFilteredAds = () => {
    return ads.filter((ad) => {
      // Don't show inactive ads in search results, unless current user is admin or is owner viewing them on dashboard
      if (ad.status !== "ativo") return false;

      // Query match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(query);
        const matchesDesc = ad.description.toLowerCase().includes(query);
        const matchesCat = ad.subcategory.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Category match
      if (searchCategory && ad.category !== searchCategory) return false;

      // Location match
      if (searchProvince && ad.location.province.toLowerCase() !== searchProvince.toLowerCase()) return false;
      if (searchCity && ad.location.city.toLowerCase() !== searchCity.toLowerCase()) return false;

      // Price match
      if (searchPriceMin && ad.price < parseFloat(searchPriceMin)) return false;
      if (searchPriceMax && ad.price > parseFloat(searchPriceMax)) return false;

      // Condition match
      if (searchCondition && ad.condition.toLowerCase() !== searchCondition.toLowerCase()) return false;

      // Price Type match
      if (searchPriceType && ad.priceType.toLowerCase() !== searchPriceType.toLowerCase()) return false;

      return true;
    }).sort((a, b) => {
      if (searchSort === "price-asc") return a.price - b.price;
      if (searchSort === "price-desc") return b.price - a.price;
      if (searchSort === "views") return b.views - a.views;
      // Default: recent
      return 1; // standard sorting mock
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedAd,
        selectedChatId,
        notifications,
        currentUser,
        ads,
        chats,
        users,
        financials,
        favorites,
        reports,
        searchQuery,
        searchCategory,
        searchProvince,
        searchCity,
        searchPriceMin,
        searchPriceMax,
        searchCondition,
        searchPriceType,
        searchSort,
        setSearchQuery,
        setSearchCategory,
        setSearchProvince,
        setSearchCity,
        setSearchPriceMin,
        setSearchPriceMax,
        setSearchCondition,
        setSearchPriceType,
        setSearchSort,
        navigateTo,
        registerUser,
        loginUser,
        logoutUser,
        changeUserRole,
        toggleVerifyUser,
        createAd,
        toggleFavorite,
        startChat,
        sendChatMessage,
        deleteChat,
        approveAd,
        rejectAd,
        deleteAdAdmin,
        reportAd,
        dismissReport,
        addSellerReview,
        promoteAdToPremium,
        getSellerById,
        getFilteredAds,
        addNotification,
        showAuthModal,
        setShowAuthModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
