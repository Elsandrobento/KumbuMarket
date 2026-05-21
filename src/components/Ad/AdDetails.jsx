import React, { useState } from "react";
import { 
  Heart, MapPin, Share2, AlertTriangle, Phone, MessageSquare, 
  ArrowLeft, Star, Sparkles, ShieldAlert, Award, Calendar, 
  ChevronLeft, ChevronRight, CheckCircle2, ChevronRight as ChevronRightIcon 
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdDetails = () => {
  const { 
    selectedAd, 
    navigateTo, 
    toggleFavorite, 
    favorites, 
    startChat, 
    getSellerById, 
    reportAd,
    addSellerReview
  } = useApp();

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [shareToast, setShareToast] = useState(false);
  
  // Review submission states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!selectedAd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <p className="text-muted-foreground">Nenhum anúncio selecionado.</p>
        <button onClick={() => navigateTo("home")} className="mt-4 text-primary font-bold hover:underline">
          Voltar para o Início
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(selectedAd.id);
  const seller = getSellerById(selectedAd.sellerId);

  // Format currency helper
  const formatPrice = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleReport = (e) => {
    e.preventDefault();
    if (reportReason.trim()) {
      reportAd(selectedAd.id, reportReason.trim());
      setShowReportModal(false);
      setReportReason("");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewComment.trim()) {
      addSellerReview(seller.id, reviewRating, reviewComment.trim());
      setReviewComment("");
      setShowReviewForm(false);
    }
  };

  // E-commerce pricing variables
  const hasDiscount = selectedAd.featured || selectedAd.price > 500000;
  const discountPercent = selectedAd.featured ? 15 : 10;
  const originalPrice = hasDiscount ? selectedAd.price * (1 + discountPercent / 100) : null;

  // Seller reputation rating colors
  const getReputationColor = (rating) => {
    if (rating >= 4.5) return "bg-emerald-500";
    if (rating >= 3.5) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Clipboard Alert */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Link copiado para a área de transferência!</span>
        </div>
      )}

      {/* Navigation breadcrumb */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-4 text-xs font-medium text-slate-500">
        <button 
          onClick={() => navigateTo("search")}
          className="flex items-center gap-1 hover:text-slate-900 transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar à lista
        </button>
        <div className="flex items-center gap-2 text-[11px]">
          <span>Início</span>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="capitalize">{selectedAd.category}</span>
          <ChevronRightIcon className="w-3 h-3" />
          <span className="text-slate-700 truncate max-w-[120px] sm:max-w-[200px]">{selectedAd.title}</span>
        </div>
      </div>

      {/* Main Grid: Left Column for Gallery/Details, Right Column for Buy Box */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Gallery, Description, Specs */}
        <div className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          
          {/* 1. Interactive Gallery layout (Amazon-style thumb strip on left, active view on right) */}
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Thumbnails strip (Hidden on mobile scroll, vertical on tablet/desktop) */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible shrink-0 sm:w-20 no-scrollbar order-2 sm:order-1">
              {selectedAd.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden bg-slate-50 shrink-0 transition-all ${
                    idx === activeImgIdx ? "border-emerald-600 shadow-sm" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Big Active Image Display */}
            <div className="flex-1 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative order-1 sm:order-2">
              <img
                src={selectedAd.images[activeImgIdx]}
                alt={selectedAd.title}
                className="w-full h-full object-cover"
              />

              {/* Arrow controls overlays for quick slide switching */}
              <button
                onClick={() => setActiveImgIdx((prev) => (prev - 1 + selectedAd.images.length) % selectedAd.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImgIdx((prev) => (prev + 1) % selectedAd.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Destaque gold flag overlay */}
              {selectedAd.featured && (
                <span className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-[9px] font-extrabold px-3 py-1 rounded shadow tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Destaque Gold
                </span>
              )}
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* 2. Technical Specifications Grid (Clean table format) */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Características Principais
            </h3>
            {selectedAd.features && Object.keys(selectedAd.features).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden text-xs">
                {Object.entries(selectedAd.features).map(([key, val]) => (
                  <div key={key} className="flex items-center bg-white p-3 justify-between">
                    <span className="text-slate-400 capitalize font-medium">{key}</span>
                    <span className="text-slate-800 font-extrabold">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Sem especificações técnicas fornecidas.</p>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* 3. Description Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Descrição do Artigo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedAd.description}
            </p>
          </div>

          {/* YouTube video section if available */}
          {selectedAd.videoUrl && (
            <>
              <hr className="border-slate-100" />
              <div className="flex flex-col gap-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Vídeo de Apresentação
                </h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <iframe
                    src={selectedAd.videoUrl.replace("watch?v=", "embed/")}
                    title="Apresentação do Produto"
                    className="w-full h-full border-none"
                    allowFullScreen
                  />
                </div>
              </div>
            </>
          )}

          <hr className="border-slate-100" />

          {/* 4. Geolocalized Map (Mock Map card) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Localização do Negócio
              </h3>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {selectedAd.location.city}, {selectedAd.location.province}
              </span>
            </div>

            {/* Pulsing geolocalization mockup */}
            <div className="h-44 w-full rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
              {/* Simulated Map Background pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute top-1/3 left-1/4 w-12 h-1 bg-slate-300 rounded transform rotate-45" />
              <div className="absolute top-2/3 left-1/2 w-20 h-1 bg-slate-300 rounded transform -rotate-12" />
              <div className="absolute top-1/2 right-1/4 w-16 h-1.5 bg-slate-300 rounded transform rotate-90" />
              
              {/* Pulsing Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center pulse-online">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <span className="text-[9px] bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded shadow mt-1">
                  Localização Negócio
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Buy Box (Sticky Details and Action Panel) */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-20">
          
          {/* Buy Box Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
            
            {/* Condition & Views Header */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span className="uppercase">{selectedAd.condition || "Usado"} | {selectedAd.date}</span>
              <span>{selectedAd.views} visualizações</span>
            </div>

            {/* Title */}
            <h1 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {selectedAd.title}
            </h1>

            {/* Heart and Share options */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Partilhar
              </button>
              <button
                onClick={() => toggleFavorite(selectedAd.id)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors ml-auto"
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                {isFav ? "Guardado" : "Guardar nos Favoritos"}
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Struck-out pricing block */}
            <div className="flex flex-col gap-1">
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatPrice(selectedAd.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Preço {selectedAd.priceType}
              </span>
            </div>

            {/* Free Shipping Highlight Banner */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-700 flex items-start gap-2.5 text-xs">
              <Award className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-extrabold">Frete Grátis ou Entrega Direta</span>
                <p className="text-[10px] text-emerald-600 mt-0.5">
                  Anunciante com plano gold ativo. Entrega gratuita garantida no município de {selectedAd.location.city}.
                </p>
              </div>
            </div>

            {/* Seller Reputation Meter Card (Termómetro) */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Vendedor: {seller.name}</span>
                {seller.verified && (
                  <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    ✔ Verificado
                  </span>
                )}
              </div>

              {/* Termómetro Bar */}
              <div className="flex gap-1.5 h-1.5 mt-1.5 rounded-full overflow-hidden">
                <div className={`flex-1 h-full ${seller.rating < 3.5 ? getReputationColor(seller.rating) : "bg-slate-200"}`} />
                <div className={`flex-1 h-full ${seller.rating >= 3.5 && seller.rating < 4.5 ? getReputationColor(seller.rating) : "bg-slate-200"}`} />
                <div className={`flex-1 h-full ${seller.rating >= 4.5 ? getReputationColor(seller.rating) : "bg-slate-200"}`} />
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-0.5">
                <span>Pouco fiável</span>
                <span>Médio</span>
                <span className="text-emerald-600">Reputação Verde (Excelente)</span>
              </div>

              <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-600">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>{seller.rating} ({seller.reviewsCount || 0} avaliações)</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Action CTAs */}
            <div className="flex flex-col gap-2.5">
              
              {/* Messenger-style negotiation chat trigger */}
              <button
                onClick={() => startChat(selectedAd.id, selectedAd.sellerId)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span>Negociar / Chat Interno</span>
              </button>

              {/* Simulated buy button directly */}
              <button
                onClick={() => startChat(selectedAd.id, selectedAd.sellerId)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-sm transition-all text-center"
              >
                Comprar Agora
              </button>

              {/* Reveal telephone details */}
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{showPhone ? selectedAd.contact : "Revelar Telemóvel"}</span>
              </button>

              {/* Send WhatsApp message */}
              <a
                href={`https://wa.me/${selectedAd.contact.replace(/\s+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 border border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.21-3.864c1.649.98 3.264 1.498 4.908 1.499 5.392.001 9.775-4.381 9.778-9.778.002-2.614-1.015-5.071-2.868-6.924C16.237 3.08 13.784 2.062 12.01 2.062c-5.398 0-9.78 4.382-9.783 9.78-.001 1.77.473 3.5 1.373 5.02L2.613 21.33l4.81-1.258-.156.064z"/>
                </svg>
                <span>Enviar WhatsApp</span>
              </a>

            </div>

            {/* Safety instructions card */}
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-[10px] flex gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <div className="flex flex-col gap-0.5 leading-normal">
                <span className="font-extrabold uppercase">Atenção ao Comprar:</span>
                <p>Nunca transfira dinheiro por adiantado para garantir a viatura ou o produto. Exija ver o produto em pessoa e certifique-se das suas condições mecânicas ou físicas num local movimentado.</p>
              </div>
            </div>

            {/* Admin reported button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="text-[10px] font-bold text-red-500 hover:underline text-center mt-1"
            >
              Denunciar Anúncio Suspeito
            </button>

          </div>

          {/* Vendedor Review Form Overlay */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Avaliar Vendedor</span>
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-primary hover:underline text-[10px]"
              >
                {showReviewForm ? "Cancelar" : "Escrever Avaliação"}
              </button>
            </h3>

            {showReviewForm ? (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Classificação:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className="text-yellow-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${reviewRating >= num ? "fill-yellow-400" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Escreva a sua experiência com este vendedor..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary h-16 bg-slate-50"
                  required
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold py-1.5 rounded transition-all"
                >
                  Submeter Avaliação
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto no-scrollbar">
                {seller.reviews && seller.reviews.length > 0 ? (
                  seller.reviews.map((r) => (
                    <div key={r.id} className="p-2 bg-slate-50 border border-slate-100 rounded text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">{r.author}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-500 mt-1">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground text-center py-2">Sem avaliações recentes.</p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Denounce modal overlay popup */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl z-50 animate-slide-up text-left">
            <h3 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Denunciar Anúncio
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Por favor, indique a razão pela qual este anúncio infringe as regras da nossa plataforma.
            </p>
            <form onSubmit={handleReport} className="flex flex-col gap-3">
              <textarea
                placeholder="Exemplo: Preço suspeito de fraude, fotos retiradas da internet, vendedor exige sinal..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary h-24 bg-slate-50 dark:bg-slate-900"
                required
              />
              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  Enviar Denúncia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
