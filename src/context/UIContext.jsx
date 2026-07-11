import React, { createContext, useContext, useState, useEffect } from "react";

const UIContext = createContext(undefined);

export const UIProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("home");
  const [selectedAd, setSelectedAd] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Dark Mode — persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("kumbu_dark") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("kumbu_dark", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const addNotification = (type, title, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const navigateTo = (view, ad = null, onNavigateAd = null) => {
    setCurrentView(view);
    if (ad) {
      setSelectedAd(ad);
      if (view === "ad-details" && onNavigateAd) {
        onNavigateAd(ad.id);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <UIContext.Provider
      value={{
        currentView,
        selectedAd,
        notifications,
        showAuthModal,
        setShowAuthModal,
        darkMode,
        toggleDarkMode,
        addNotification,
        navigateTo,
        setCurrentView,
        setSelectedAd
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
