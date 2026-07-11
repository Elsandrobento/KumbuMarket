import React, { useState, useEffect, useRef } from "react";
import { Send, Image, MoreVertical, ShieldAlert, Phone, Trash2, ArrowLeft, MessageCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ChatWindow = () => {
  const {
    chats,
    selectedChatId,
    setSelectedChatId,
    sendChatMessage,
    deleteChat,
    currentUser,
    getSellerById,
    ads,
    addNotification
  } = useApp();

  const [messageText, setMessageText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-card border border-border rounded-3xl shadow-premium flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h3 className="text-md font-bold text-foreground">Sessão Necessária</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Inicie sessão para poder utilizar o chat interno de negociação e conversar em tempo real com compradores ou vendedores.
        </p>
      </div>
    );
  }

  // Filter chats where current user is participant (buyer or seller)
  const myChats = chats.filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id);

  useEffect(() => {
    if (!selectedChatId && window.innerWidth >= 768 && myChats.length > 0) {
      setSelectedChatId(myChats[0].id);
    }
  }, [selectedChatId, myChats.length, setSelectedChatId]);

  const activeChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (activeChat?.messages) {
      scrollToBottom();
    }
  }, [activeChat?.messages]);

  // Info about recipient
  const recipient = activeChat
    ? getSellerById(activeChat.buyerId === currentUser.id ? activeChat.sellerId : activeChat.buyerId)
    : null;

  // Info about Ad linked
  const ad = activeChat ? ads.find(a => a.id === activeChat.adId) : null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendChatMessage(selectedChatId, messageText);
    setMessageText("");
  };

  // Simulated image attachments
  const handleAttachImage = () => {
    const mockImageUrls = [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&fit=crop",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&fit=crop"
    ];
    const randomImg = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    sendChatMessage(selectedChatId, "Anexou uma imagem", randomImg);
    addNotification("success", "Imagem Anexada", "Imagem de demonstração adicionada à conversa.");
  };

  const handleBlockUser = () => {
    addNotification("warning", "Utilizador Bloqueado", `${recipient.name} foi bloqueado temporariamente.`);
    setShowOptions(false);
  };

  const handleDeleteConversation = () => {
    if (confirm("Tem a certeza que deseja apagar todo o histórico desta conversa?")) {
      deleteChat(selectedChatId);
      setShowOptions(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      <div className="bg-card border border-border rounded-3xl shadow-premium overflow-hidden h-[70vh] flex">
        
        {/* Left Side: Conversations List */}
        <div className={`w-full md:w-80 border-r border-border flex flex-col shrink-0 ${
          selectedChatId ? "hidden md:flex" : "flex"
        }`}>
          
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Minhas Conversas</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Classificados KumbuMarket</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 no-scrollbar">
            {myChats.length === 0 ? (
              <div className="text-center py-12 px-4 flex flex-col items-center gap-2 mt-12">
                <MessageCircle className="w-8 h-8 text-muted-foreground/60" />
                <span className="text-xs font-semibold text-muted-foreground">Sem conversas ativas</span>
                <p className="text-[10px] text-muted-foreground/80 max-w-[180px] leading-relaxed">
                  Clique em "Enviar Mensagem" na página de qualquer anúncio para negociar.
                </p>
              </div>
            ) : (
              myChats.map((chat) => {
                const partnerId = chat.buyerId === currentUser.id ? chat.sellerId : chat.buyerId;
                const partner = getSellerById(partnerId);
                const linkedAd = ads.find(a => a.id === chat.adId);
                const lastMsg = chat.messages[chat.messages.length - 1];
                const isSelected = selectedChatId === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light/10"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-foreground truncate">{partner.name}</h4>
                        <span className="text-[9px] text-muted-foreground">{lastMsg ? lastMsg.timestamp : ""}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate font-semibold text-primary/80 mt-0.5">
                        {linkedAd ? linkedAd.title : "Artigo Geral"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {lastMsg ? lastMsg.text : "Nenhuma mensagem."}
                      </p>
                    </div>

                    {chat.unread && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 pulse-online" />
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Side: Chat Conversation Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/10 ${
          !selectedChatId ? "hidden md:flex justify-center items-center text-center p-8" : "flex"
        }`}>
          {activeChat ? (
            <>
              {/* Active Header */}
              <div className="p-3 border-b border-border bg-card flex items-center justify-between shadow-sm">
                
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedChatId(null)}
                    className="md:hidden p-1 rounded-full hover:bg-muted"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  
                  <div className="relative">
                    <img
                      src={recipient.avatar}
                      alt={recipient.name}
                      className="w-9 h-9 rounded-full object-cover border border-border"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{recipient.name}</h4>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Ativo agora
                    </span>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1 relative">
                  
                  {/* WhatsApp contact redirect shortcut */}
                  <a
                    href={`https://wa.me/${recipient.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full hover:bg-muted text-emerald-600 hover:text-emerald-700"
                    title="Chamar no WhatsApp"
                  >
                    <Phone className="w-4.5 h-4.5" />
                  </a>

                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>

                  {/* Dropdown Options */}
                  {showOptions && (
                    <div className="absolute right-0 top-10 w-48 rounded-xl border border-border bg-card p-1 shadow-lg glass z-50 animate-slide-up">
                      <button
                        onClick={handleBlockUser}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg text-left"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Bloquear Vendedor
                      </button>
                      <button
                        onClick={handleDeleteConversation}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        Apagar Conversa
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Linked Ad Floating Bar */}
              {ad && (
                <div 
                  onClick={() => navigateTo("ad-details", ad)}
                  className="bg-card/70 border-b border-border/60 p-2.5 flex items-center justify-between cursor-pointer hover:bg-card transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={ad.images[0]}
                      alt=""
                      className="w-10 h-7 rounded object-cover border border-border/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-foreground truncate">{ad.title}</h4>
                      <span className="text-[10px] text-primary font-black">
                        {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(ad.price)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground hover:bg-primary hover:text-white transition-all uppercase tracking-wider">
                    Ver Anúncio
                  </span>
                </div>
              )}

              {/* Messages List Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar">
                {activeChat.messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  const isSystem = m.senderId === "system";

                  if (isSystem) {
                    return (
                      <div key={m.id} className="text-center py-2 px-4 max-w-sm mx-auto rounded-xl bg-slate-100 dark:bg-slate-900 border border-border text-[9px] font-semibold text-muted-foreground uppercase tracking-wider leading-relaxed">
                        {m.text}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[70%] ${
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      {/* Message bubble */}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-card border border-border text-foreground rounded-tl-none"
                        }`}
                      >
                        {m.text}

                        {/* Image attachment rendering */}
                        {m.image && (
                          <img
                            src={m.image}
                            alt=""
                            className="mt-2 rounded-xl max-h-48 object-cover w-full border border-border/10 cursor-pointer"
                          />
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[8px] text-muted-foreground mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAttachImage}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Anexar Imagem Mock"
                >
                  <Image className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escreve uma mensagem de negociação..."
                  className="flex-1 p-2.5 text-xs rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-primary hover:bg-primary-hover text-white shadow-md transition-all shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Sem conversa selecionada</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Selecione uma negociação no painel esquerdo ou visite anúncios para iniciar novas ofertas!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
