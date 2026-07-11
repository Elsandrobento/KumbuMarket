import React, { createContext, useContext } from "react";
import { UIProvider, useUI } from "./UIContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { FinancialProvider, useFinancials } from "./FinancialContext";
import { AdProvider, useAd } from "./AdContext";
import { ChatProvider, useChat } from "./ChatContext";

// AppContext — KumbuMarket Global State Composer
const AppContext = createContext(undefined);

// Provide the contexts in the correct hierarchical order
export const AppProvider = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <FinancialProvider>
          <AdProvider>
            <ChatProvider>
              <AppComposer>{children}</AppComposer>
            </ChatProvider>
          </AdProvider>
        </FinancialProvider>
      </AuthProvider>
    </UIProvider>
  );
};

// Internal composer to gather all context values
const AppComposer = ({ children }) => {
  const ui = useUI();
  const auth = useAuth();
  const financials = useFinancials();
  const ad = useAd();
  const chat = useChat();

  return (
    <AppContext.Provider
      value={{
        ...ui,
        ...auth,
        ...financials,
        ...ad,
        ...chat
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
