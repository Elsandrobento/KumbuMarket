import React, { createContext, useContext, useState, useEffect } from "react";
import { USERS } from "../data/mockData";
import { useUI } from "./UIContext";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { addNotification, navigateTo, setShowAuthModal } = useUI();

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("kumbu_user");
    return saved && saved !== "null" ? JSON.parse(saved) : null;
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

  useEffect(() => {
    localStorage.setItem("kumbu_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("kumbu_users", JSON.stringify(users));
  }, [users]);

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

  const loginUser = (emailOrId, password) => {
    const clean = emailOrId.toLowerCase().trim();

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
      found = users.find(u => u.id === emailOrId || u.name.toLowerCase().includes(clean));
    }

    if (!found) {
      addNotification("error", "Utilizador não encontrado", "E-mail inválido. Contas demo: admin, carlos, dina, edmilson");
      return false;
    }

    if (password && password.trim() !== "" && password !== "1234" && password !== "admin123" && password !== "kumbu") {
      addNotification("error", "Password Incorreta", "Password errada. Em modo demo, use: 1234");
      return false;
    }

    if (!users.some(u => u.id === found.id)) {
      setUsers(prev => [...prev, found]);
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
    return true;
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

  const getSellerById = (id) => {
    return users.find((u) => u.id === id) || USERS.find((u) => u.id === id) || USERS[0];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        registerUser,
        loginUser,
        logoutUser,
        changeUserRole,
        toggleVerifyUser,
        addSellerReview,
        getSellerById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
