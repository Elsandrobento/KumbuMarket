import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useUI } from "./UIContext";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { addNotification, navigateTo } = useUI();
  const { currentUser } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState({}); // { chatId: [messages] }

  // Real-time listener for chats where currentUser is buyer OR seller
  useEffect(() => {
    if (!currentUser?.id) {
      setChats([]);
      return;
    }

    // Firestore doesn't support OR queries across different fields with onSnapshot easily,
    // so we run two queries and merge
    const buyerQuery = query(
      collection(db, "chats"),
      where("buyerId", "==", currentUser.id),
      orderBy("updatedAt", "desc")
    );
    const sellerQuery = query(
      collection(db, "chats"),
      where("sellerId", "==", currentUser.id),
      orderBy("updatedAt", "desc")
    );

    const merged = {};

    const unsubBuyer = onSnapshot(buyerQuery, (snap) => {
      snap.docs.forEach(d => { merged[d.id] = { id: d.id, ...d.data() }; });
      setChats(Object.values(merged).sort((a, b) => {
        const aT = a.updatedAt?.seconds || 0;
        const bT = b.updatedAt?.seconds || 0;
        return bT - aT;
      }));
    });

    const unsubSeller = onSnapshot(sellerQuery, (snap) => {
      snap.docs.forEach(d => { merged[d.id] = { id: d.id, ...d.data() }; });
      setChats(Object.values(merged).sort((a, b) => {
        const aT = a.updatedAt?.seconds || 0;
        const bT = b.updatedAt?.seconds || 0;
        return bT - aT;
      }));
    });

    return () => {
      unsubBuyer();
      unsubSeller();
    };
  }, [currentUser?.id]);

  // Listen to messages for the selected chat
  useEffect(() => {
    if (!selectedChatId) return;

    const q = query(
      collection(db, "chats", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChatMessages(prev => ({ ...prev, [selectedChatId]: msgs }));
    });

    return () => unsub();
  }, [selectedChatId]);

  const startChat = async (adId, sellerId, adTitle) => {
    if (!currentUser) {
      addNotification("warning", "Acesso Restrito", "Inicie sessão para contactar o vendedor.");
      return;
    }

    if (currentUser.id === sellerId) {
      addNotification("warning", "Operação Inválida", "Não pode iniciar um chat no seu próprio anúncio.");
      return;
    }

    // Check if a chat already exists for this ad+buyer+seller
    const existing = chats.find(
      c => c.adId === adId && c.buyerId === currentUser.id && c.sellerId === sellerId
    );

    if (existing) {
      setSelectedChatId(existing.id);
      navigateTo("chat");
      return;
    }

    try {
      // Create new chat document
      const chatRef = await addDoc(collection(db, "chats"), {
        adId,
        adTitle: adTitle || "",
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerAvatar: currentUser.avatar || "",
        sellerId,
        unreadBuyer: 0,
        unreadSeller: 0,
        lastMessage: "Chat iniciado",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add system welcome message
      await addDoc(collection(db, "chats", chatRef.id, "messages"), {
        senderId: "system",
        text: "Chat de Negociação Iniciado! Mantenha a sua segurança, evite pagamentos adiantados sem ver a mercadoria.",
        createdAt: serverTimestamp()
      });

      setSelectedChatId(chatRef.id);
      navigateTo("chat");
    } catch (err) {
      console.error("startChat error:", err);
      addNotification("error", "Erro", "Não foi possível iniciar o chat.");
    }
  };

  const sendChatMessage = async (chatId, text, image = null) => {
    if (!currentUser || !chatId) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: text || "",
        image: image || null,
        createdAt: serverTimestamp()
      });

      // Update the chat's lastMessage and updatedAt
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: text || "📷 Imagem",
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("sendChatMessage error:", err);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await deleteDoc(doc(db, "chats", chatId));
      setSelectedChatId(null);
      addNotification("success", "Conversa Apagada", "A conversa foi eliminada com sucesso.");
    } catch (err) {
      console.error(err);
    }
  };

  // Get messages for a specific chat (from the real-time listener cache)
  const getMessages = (chatId) => {
    return chatMessages[chatId] || [];
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
        deleteChat,
        getMessages,
        chatMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
