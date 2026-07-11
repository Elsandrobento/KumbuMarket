import React, { createContext, useContext, useState, useEffect } from "react";
import { FINANCIALS } from "../data/mockData";

const FinancialContext = createContext(undefined);

export const FinancialProvider = ({ children }) => {
  const [financials, setFinancials] = useState(() => {
    const saved = localStorage.getItem("kumbu_financials");
    return saved ? JSON.parse(saved) : FINANCIALS;
  });

  useEffect(() => {
    localStorage.setItem("kumbu_financials", JSON.stringify(financials));
  }, [financials]);

  return (
    <FinancialContext.Provider
      value={{
        financials,
        setFinancials
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancials = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancials must be used within a FinancialProvider");
  }
  return context;
};
