import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { USERS } from "../data/mockData";
import { useUI } from "./UIContext";

const AuthContext = createContext(undefined);

// Demo accounts seeding — predefined so anyone can log in to test
const DEMO_ACCOUNTS = [
  {
    email: "admin@kumbumarket.ao",
    password: "admin123",
    profile: {
      name: "Kumbu Admin",
      role: "admin",
      plan: "Enterprise",
      verified: true,
      phone: "+244 900 000 000",
      whatsapp: "+244900000000",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
      banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
      rating: 5.0,
      reviewsCount: 0,
      joinedDate: "Fundador",
      totalAds: 0,
      activeAds: 0,
      adViews: 0,
      messagesCount: 0,
      reviews: [],
      favorites: []
    }
  },
  {
    email: "carlos@kumbu.com",
    password: "kumbu123",
    profile: {
      name: "Carlos Silva",
      role: "seller",
      plan: "Pro",
      verified: true,
      phone: "+244 923 456 789",
      whatsapp: "+244923456789",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=carlos",
      banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
      rating: 4.8,
      reviewsCount: 24,
      joinedDate: "Membro desde 2022",
      totalAds: 8,
      activeAds: 5,
      adViews: 3450,
      messagesCount: 12,
      reviews: [],
      favorites: []
    }
  },
  {
    email: "dina@kumbu.com",
    password: "kumbu123",
    profile: {
      name: "Dina Santos",
      role: "seller",
      plan: "Free",
      verified: false,
      phone: "+244 912 345 678",
      whatsapp: "+244912345678",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=dina",
      banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
      rating: 4.5,
      reviewsCount: 7,
      joinedDate: "Membro desde 2023",
      totalAds: 3,
      activeAds: 2,
      adViews: 890,
      messagesCount: 5,
      reviews: [],
      favorites: []
    }
  }
];

export const AuthProvider = ({ children }) => {
  const { addNotification, navigateTo, setShowAuthModal } = useUI();

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [users, setUsers] = useState(USERS); // still holds local mock users for getSellerById
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profileRef = doc(db, "users", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profile = { id: firebaseUser.uid, ...profileSnap.data() };
          setCurrentUserProfile(profile);
          setCurrentUser(profile);
        }
      } else {
        setCurrentUser(null);
        setCurrentUserProfile(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper to ensure demo accounts exist in Firebase Auth + Firestore
  const ensureDemoAccount = async (demoAccount) => {
    try {
      // Try to sign in first
      const result = await signInWithEmailAndPassword(auth, demoAccount.email, demoAccount.password);
      // Check if Firestore profile exists
      const profileRef = doc(db, "users", result.user.uid);
      const snap = await getDoc(profileRef);
      if (!snap.exists()) {
        // Create profile if missing
        await setDoc(profileRef, {
          ...demoAccount.profile,
          email: demoAccount.email,
          createdAt: Date.now()
        });
      }
      return result.user;
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        // Create the demo account
        const result = await createUserWithEmailAndPassword(auth, demoAccount.email, demoAccount.password);
        const profileRef = doc(db, "users", result.user.uid);
        await setDoc(profileRef, {
          ...demoAccount.profile,
          email: demoAccount.email,
          createdAt: Date.now()
        });
        return result.user;
      }
      throw err;
    }
  };

  const registerUser = async (userData) => {
    try {
      // Generate a unique email from phone for users who only provide phone
      const email = userData.email || `${userData.phone.replace(/\D/g, "")}@kumbu.ao`;
      const result = await createUserWithEmailAndPassword(auth, email, userData.password);

      const newProfile = {
        name: userData.name,
        email: email,
        phone: userData.phone || "",
        whatsapp: (userData.phone || "").replace(/\s+/g, ""),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.name}`,
        banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
        verified: false,
        rating: 5.0,
        reviewsCount: 0,
        joinedDate: "Membro desde Hoje",
        role: "seller",
        plan: "Free",
        totalAds: 0,
        activeAds: 0,
        adViews: 0,
        messagesCount: 0,
        reviews: [],
        favorites: [],
        createdAt: Date.now()
      };

      await setDoc(doc(db, "users", result.user.uid), newProfile);

      setShowAuthModal(false);
      addNotification("success", "Conta Criada!", `Bem-vindo ao KumbuMarket, ${userData.name}!`);
      navigateTo("home");
    } catch (err) {
      console.error("Register error:", err);
      if (err.code === "auth/email-already-in-use") {
        addNotification("error", "Email já registado", "Este email ou telefone já tem uma conta. Tente iniciar sessão.");
      } else {
        addNotification("error", "Erro ao criar conta", err.message);
      }
    }
  };

  const loginUser = async (emailOrId, password) => {
    const clean = emailOrId.toLowerCase().trim();

    // Check if it's a demo account request
    const demoMatch = DEMO_ACCOUNTS.find(
      da => da.email === clean ||
            clean.includes(da.profile.name.split(" ")[0].toLowerCase())
    );

    try {
      if (demoMatch) {
        await ensureDemoAccount(demoMatch);
        // onAuthStateChanged will update the state
        setShowAuthModal(false);

        if (demoMatch.profile.role === "admin") {
          addNotification("success", "Painel Administrativo", "Autenticado como Administrador.");
          navigateTo("admin");
        } else {
          addNotification("success", "Sessão Iniciada", `Bem-vindo de volta, ${demoMatch.profile.name}!`);
          navigateTo("dashboard");
        }
        return true;
      }

      // Regular email login
      await signInWithEmailAndPassword(auth, clean, password || "");
      setShowAuthModal(false);
      addNotification("success", "Sessão Iniciada", "Bem-vindo de volta!");
      navigateTo("dashboard");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        addNotification("error", "Password Incorreta", "Password errada. Contas demo: use 'admin123' para admin, 'kumbu123' para os outros.");
      } else if (err.code === "auth/user-not-found") {
        addNotification("error", "Utilizador não encontrado", "Conta não existe. Cria uma conta nova.");
      } else {
        addNotification("error", "Erro de Sessão", err.message);
      }
      return false;
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentUserProfile(null);
    addNotification("success", "Sessão Terminada", "Sessão encerrada com sucesso.");
    navigateTo("home");
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => ({ ...prev, role: newRole }));
      }
      addNotification("success", "Papel Alterado", `Utilizador promovido para ${newRole}.`);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleVerifyUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const newVal = !snap.data().verified;
        await updateDoc(userRef, { verified: newVal });
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(prev => ({ ...prev, verified: newVal }));
        }
      }
      addNotification("success", "Verificação Alterada", "Selo de verificação atualizado.");
    } catch (err) {
      console.error(err);
    }
  };

  const addSellerReview = async (sellerId, ratingScore, commentText) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para deixar uma avaliação.");
      return;
    }
    try {
      const sellerRef = doc(db, "users", sellerId);
      const snap = await getDoc(sellerRef);
      if (snap.exists()) {
        const data = snap.data();
        const newRev = {
          id: `rev_${Date.now()}`,
          author: currentUser.name,
          rating: ratingScore,
          comment: commentText,
          date: "Agora mesmo"
        };
        const reviews = [newRev, ...(data.reviews || [])];
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await updateDoc(sellerRef, {
          reviews,
          reviewsCount: reviews.length,
          rating: parseFloat(avg.toFixed(1))
        });
      }
      addNotification("success", "Avaliação Registada", "Agradecemos o seu feedback!");
    } catch (err) {
      console.error(err);
    }
  };

  const getSellerById = async (id) => {
    try {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (e) {}
    // fallback to mock
    return USERS.find(u => u.id === id) || USERS[0];
  };

  // Refresh current user's profile from Firestore
  const refreshProfile = async () => {
    if (currentUser?.id) {
      const snap = await getDoc(doc(db, "users", currentUser.id));
      if (snap.exists()) {
        const profile = { id: snap.id, ...snap.data() };
        setCurrentUser(profile);
        setCurrentUserProfile(profile);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        authLoading,
        registerUser,
        loginUser,
        logoutUser,
        changeUserRole,
        toggleVerifyUser,
        addSellerReview,
        getSellerById,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
