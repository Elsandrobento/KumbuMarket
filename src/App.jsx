import React from "react";
import { AppProvider, useApp } from "./context/AppContext";

// Import Layout Components
import { Header } from "./components/Layout/Header";
import { BottomNav } from "./components/Layout/BottomNav";
import { Footer } from "./components/Layout/Footer";
import { NotificationToast } from "./components/Layout/Notification";
import { AuthModal } from "./components/Common/AuthModal";

// Import Page Views
import { Hero } from "./components/Home/Hero";
import { CategoryGrid } from "./components/Home/CategoryGrid";
import { AdSection } from "./components/Home/AdSection";
import { AdSearch } from "./components/Ad/AdSearch";
import { AdDetails } from "./components/Ad/AdDetails";
import { CreateAd } from "./components/Ad/CreateAd";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { UserDashboard } from "./components/Dashboard/UserDashboard";
import { AdminPanel } from "./components/Admin/AdminPanel";

function AppContent() {
  const { currentView, notifications } = useApp();

  // Render the appropriate main view based on current state view
  const renderMainView = () => {
    switch (currentView) {
      case "home":
        return (
          <>
            <Hero />
            <CategoryGrid />
            <AdSection />
          </>
        );
      case "search":
        return <AdSearch />;
      case "ad-details":
        return <AdDetails />;
      case "create-ad":
        return <CreateAd />;
      case "chat":
        return <ChatWindow />;
      case "dashboard":
        return <UserDashboard />;
      case "admin":
        return <AdminPanel />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-2xl font-bold text-foreground">Página não encontrada</h2>
            <p className="text-muted-foreground mt-2">Esta secção ainda não está disponível ou foi movida.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Premium Desktop and Tablet Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full pb-16 md:pb-0">
        {renderMainView()}
      </main>

      {/* Responsive Floating Bottom Navigation for Mobile Devices */}
      <BottomNav />

      {/* High-fidelity Brand Footer */}
      <Footer />

      {/* Actionable Success/Warn/Info Floating Toast Alerts */}
      <NotificationToast notifications={notifications} />

      {/* Global simulated credentials modal pop-up */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
