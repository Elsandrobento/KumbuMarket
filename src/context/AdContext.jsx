import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_ADS } from "../data/mockData";
import { useUI } from "./UIContext";
import { useAuth } from "./AuthContext";
import { useFinancials } from "./FinancialContext";

const AdContext = createContext(undefined);

export const AdProvider = ({ children }) => {
  const { addNotification, navigateTo } = useUI();
  const { currentUser, setUsers, setCurrentUser } = useAuth();
  const { setFinancials } = useFinancials();

  const [ads, setAds] = useState(() => {
    const saved = localStorage.getItem("kumbu_ads");
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("kumbu_favorites");
    return saved ? JSON.parse(saved) : ["ad_3"];
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem("kumbu_reports");
    return saved ? JSON.parse(saved) : [
      { id: "rep_1", adId: "ad_8", reason: "Preço suspeito de falsificação", reporter: "Edmilson Costa", date: "Há 1 dia" }
    ];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchPriceMin, setSearchPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");
  const [searchCondition, setSearchCondition] = useState("");
  const [searchPriceType, setSearchPriceType] = useState("");
  const [searchSort, setSearchSort] = useState("recent");

  useEffect(() => {
    localStorage.setItem("kumbu_ads", JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem("kumbu_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("kumbu_reports", JSON.stringify(reports));
  }, [reports]);

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
      createdAt: Date.now(),
      sellerId: currentUser.id,
      featured: isPremium,
      status: isPremium ? "ativo" : "pendente",
      videoUrl: adData.videoUrl || "",
      images: adData.images.length > 0 ? adData.images : ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop"],
      features: adData.features || {}
    };

    setAds((prev) => [newAd, ...prev]);

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

  const approveAd = (adId) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: "ativo" } : ad))
    );

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

  const getFilteredAds = () => {
    return ads.filter((ad) => {
      if (ad.status !== "ativo") return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(query);
        const matchesDesc = ad.description.toLowerCase().includes(query);
        const matchesCat = ad.subcategory.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      if (searchCategory && ad.category !== searchCategory) return false;
      if (searchProvince && ad.location.province.toLowerCase() !== searchProvince.toLowerCase()) return false;
      if (searchCity && ad.location.city.toLowerCase() !== searchCity.toLowerCase()) return false;
      if (searchPriceMin && ad.price < parseFloat(searchPriceMin)) return false;
      if (searchPriceMax && ad.price > parseFloat(searchPriceMax)) return false;
      if (searchCondition && ad.condition.toLowerCase() !== searchCondition.toLowerCase()) return false;
      if (searchPriceType && ad.priceType.toLowerCase() !== searchPriceType.toLowerCase()) return false;
      return true;
    }).sort((a, b) => {
      if (searchSort === "price-asc") return a.price - b.price;
      if (searchSort === "price-desc") return b.price - a.price;
      if (searchSort === "views") return b.views - a.views;
      const aTime = a.createdAt || parseInt((a.id || "ad_0").replace("ad_", "")) || 0;
      const bTime = b.createdAt || parseInt((b.id || "ad_0").replace("ad_", "")) || 0;
      return bTime - aTime;
    });
  };

  return (
    <AdContext.Provider
      value={{
        ads,
        setAds,
        favorites,
        reports,
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
        createAd,
        toggleFavorite,
        approveAd,
        rejectAd,
        deleteAdAdmin,
        reportAd,
        dismissReport,
        promoteAdToPremium,
        getFilteredAds
      }}
    >
      {children}
    </AdContext.Provider>
  );
};

export const useAd = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error("useAd must be used within an AdProvider");
  }
  return context;
};
