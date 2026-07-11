import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useUI } from "./UIContext";
import { useAuth } from "./AuthContext";
import { useFinancials } from "./FinancialContext";

const AdContext = createContext(undefined);

export const AdProvider = ({ children }) => {
  const { addNotification, navigateTo } = useUI();
  const { currentUser, refreshProfile } = useAuth();
  const { setFinancials } = useFinancials();

  const [ads, setAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reports, setReports] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);

  // Search & Filter state (client-side, no need for Firestore)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchPriceMin, setSearchPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");
  const [searchCondition, setSearchCondition] = useState("");
  const [searchPriceType, setSearchPriceType] = useState("");
  const [searchSort, setSearchSort] = useState("recent");

  // Real-time listener for ads from Firestore
  useEffect(() => {
    const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAds(adsData);
      setAdsLoading(false);
    }, (err) => {
      console.error("Ads listener error:", err);
      setAdsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for reports
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      setReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Sync favorites from current user profile
  useEffect(() => {
    if (currentUser?.favorites) {
      setFavorites(currentUser.favorites);
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  const createAd = async (adData, isPremium = false, paymentDetails = null) => {
    if (!currentUser) return;
    try {
      const newAd = {
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
        createdAt: serverTimestamp(),
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        featured: isPremium,
        status: isPremium ? "ativo" : "pendente",
        videoUrl: adData.videoUrl || "",
        images: adData.images.length > 0
          ? adData.images
          : ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop"],
        features: adData.features || {}
      };

      await addDoc(collection(db, "ads"), newAd);

      // Update user's totalAds counter in Firestore
      await updateDoc(doc(db, "users", currentUser.id), {
        totalAds: (currentUser.totalAds || 0) + 1,
        activeAds: (currentUser.activeAds || 0) + (isPremium ? 1 : 0)
      });
      await refreshProfile();

      if (isPremium && paymentDetails) {
        const newTx = {
          id: `tx_${Date.now()}`,
          date: "Hoje",
          user: currentUser.name,
          plan: paymentDetails.planName || "Destaque Premium",
          amount: parseFloat(paymentDetails.amount),
          gateway: paymentDetails.gateway,
          status: "sucesso",
          createdAt: Date.now()
        };

        await addDoc(collection(db, "transactions"), newTx);
        setFinancials(prev => ({
          ...prev,
          revenueTotal: prev.revenueTotal + newTx.amount,
          transactions: [newTx, ...prev.transactions]
        }));

        addNotification("success", "Pagamento Confirmado!", `Plano de destaque premium ativo via ${paymentDetails.gateway}!`);
      } else {
        addNotification("success", "Anúncio Publicado!", "O seu anúncio foi enviado e aguarda aprovação do administrador.");
      }

      navigateTo("dashboard");
    } catch (err) {
      console.error("createAd error:", err);
      addNotification("error", "Erro", "Não foi possível publicar o anúncio. Tente novamente.");
    }
  };

  const toggleFavorite = async (adId) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para guardar anúncios nos favoritos.");
      return;
    }
    try {
      const userRef = doc(db, "users", currentUser.id);
      const isFav = favorites.includes(adId);
      if (isFav) {
        await updateDoc(userRef, { favorites: favorites.filter(id => id !== adId) });
        setFavorites(prev => prev.filter(id => id !== adId));
        addNotification("success", "Removido", "Anúncio removido dos favoritos.");
      } else {
        await updateDoc(userRef, { favorites: [...favorites, adId] });
        setFavorites(prev => [...prev, adId]);
        addNotification("success", "Favoritado", "Anúncio guardado nos favoritos!");
      }
    } catch (err) {
      console.error("toggleFavorite error:", err);
    }
  };

  const approveAd = async (adId) => {
    try {
      await updateDoc(doc(db, "ads", adId), { status: "ativo" });
      addNotification("success", "Anúncio Aprovado", "O anúncio agora está visível para o público.");
    } catch (err) {
      console.error(err);
    }
  };

  const rejectAd = async (adId) => {
    try {
      await updateDoc(doc(db, "ads", adId), { status: "expirado" });
      addNotification("warning", "Anúncio Rejeitado", "O anúncio foi marcado como expirado.");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAdAdmin = async (adId) => {
    try {
      await deleteDoc(doc(db, "ads", adId));
      addNotification("success", "Anúncio Eliminado", "O anúncio foi removido permanentemente.");
    } catch (err) {
      console.error(err);
    }
  };

  const reportAd = async (adId, reason) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para denunciar anúncios.");
      return;
    }
    try {
      await addDoc(collection(db, "reports"), {
        adId,
        reason,
        reporter: currentUser.name,
        reporterId: currentUser.id,
        date: "Agora mesmo",
        createdAt: Date.now()
      });
      addNotification("success", "Denúncia Enviada", "Os nossos moderadores vão analisar de imediato.");
    } catch (err) {
      console.error(err);
    }
  };

  const dismissReport = async (reportId) => {
    try {
      await deleteDoc(doc(db, "reports", reportId));
      addNotification("success", "Denúncia Ignorada", "A denúncia foi encerrada.");
    } catch (err) {
      console.error(err);
    }
  };

  const promoteAdToPremium = async (adId, planName, amount, gateway) => {
    try {
      await updateDoc(doc(db, "ads", adId), { featured: true, status: "ativo" });

      const newTx = {
        id: `tx_${Date.now()}`,
        date: "Hoje",
        user: currentUser.name,
        plan: planName,
        amount,
        gateway,
        status: "sucesso",
        createdAt: Date.now()
      };
      await addDoc(collection(db, "transactions"), newTx);
      setFinancials(prev => ({
        ...prev,
        revenueTotal: prev.revenueTotal + amount,
        transactions: [newTx, ...prev.transactions]
      }));

      addNotification("success", "Destaque Premium!", `Anúncio destacado com sucesso via ${gateway}!`);
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredAds = () => {
    return ads.filter((ad) => {
      if (ad.status !== "ativo") return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!ad.title.toLowerCase().includes(q) &&
            !ad.description.toLowerCase().includes(q) &&
            !(ad.subcategory || "").toLowerCase().includes(q)) return false;
      }
      if (searchCategory && ad.category !== searchCategory) return false;
      if (searchProvince && ad.location?.province?.toLowerCase() !== searchProvince.toLowerCase()) return false;
      if (searchCity && ad.location?.city?.toLowerCase() !== searchCity.toLowerCase()) return false;
      if (searchPriceMin && ad.price < parseFloat(searchPriceMin)) return false;
      if (searchPriceMax && ad.price > parseFloat(searchPriceMax)) return false;
      if (searchCondition && ad.condition?.toLowerCase() !== searchCondition.toLowerCase()) return false;
      if (searchPriceType && ad.priceType?.toLowerCase() !== searchPriceType.toLowerCase()) return false;
      return true;
    }).sort((a, b) => {
      if (searchSort === "price-asc") return a.price - b.price;
      if (searchSort === "price-desc") return b.price - a.price;
      if (searchSort === "views") return (b.views || 0) - (a.views || 0);
      const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt || 0);
      const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt || 0);
      return bTime - aTime;
    });
  };

  return (
    <AdContext.Provider
      value={{
        ads,
        setAds,
        adsLoading,
        favorites,
        reports,
        searchQuery, setSearchQuery,
        searchCategory, setSearchCategory,
        searchProvince, setSearchProvince,
        searchCity, setSearchCity,
        searchPriceMin, setSearchPriceMin,
        searchPriceMax, setSearchPriceMax,
        searchCondition, setSearchCondition,
        searchPriceType, setSearchPriceType,
        searchSort, setSearchSort,
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
  if (!context) throw new Error("useAd must be used within an AdProvider");
  return context;
};
