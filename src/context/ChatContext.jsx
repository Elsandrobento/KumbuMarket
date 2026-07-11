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

    const recipientId = chat.buyerId === currentUser.id ? chat.sellerId : chat.buyerId;
    const recipientUser = users.find((u) => u.id === recipientId) || USERS.find((u) => u.id === recipientId);

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
