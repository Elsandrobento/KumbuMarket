import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_CHATS, USERS } from "../data/mockData";
import { useUI } from "./UIContext";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { addNotification, navigateTo } = useUI();
  const { currentUser, users } = useAuth();
  
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("kumbu_chats");
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem("kumbu_chats", JSON.stringify(chats));
  }, [chats]);

  const startChat = (adId, sellerId) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para contactar o vendedor.");
      return;
    }

    if (currentUser.id === sellerId) {
      addNotification("warning", "Operação Inválida", "Não pode iniciar um chat no seu próprio anúncio.");
      return;
    }

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

    // The message is sent successfully. 
    // We no longer trigger auto-replies. Users must log into the other account to reply.
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setSelectedChatId(null);
    addNotification("success", "Conversa Apagada", "A conversa foi eliminada com sucesso.");
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChatId,
        setSelectedChatId,
        startChat,
        sendChatMessage,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
