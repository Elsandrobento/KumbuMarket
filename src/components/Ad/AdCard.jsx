import React from "react";
import { Heart, MapPin, Eye, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdCard = ({ ad }) => {
  const { navigateTo, toggleFavorite, favorites, getSellerById } = useApp();
  
  const isFav = favorites.includes(ad.id);
  const seller = getSellerById(ad.sellerId);

  // Format currency helper
  const formatPrice = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(ad.id);
  };

  // Mock robust e-commerce pricing with struck-out values and discounts
  // Carlos Silva's Pro Ads or Gold featured ads get discount tags
  const hasDiscount = ad.featured || ad.price > 500000;
  const discountPercent = ad.featured ? 15 : 10;
  const originalPrice = hasDiscount ? ad.price * (1 + discountPercent / 100) : null;

  return (
    <div
      onClick={() => navigateTo("ad-details", ad)}
      className={`group relative flex flex-col rounded-xl bg-white text-slate-800 border transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl ${
        ad.featured
          ? "border-amber-400/80 ring-1 ring-amber-400/30"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Top Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />

        {/* Dynamic Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {/* Gold SaaS Featured Badge */}
          {ad.featured && (
            <span className="flex items-center gap-1 bg-amber-500 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-sm tracking-wider">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              Destaque Gold
            </span>
          )}

          {/* Condition Badge */}
          {ad.condition && ad.condition !== "N/A" && (
            <span className="bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm">
              {ad.condition}
            </span>
          )}
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 p-2 rounded-full shadow-md text-slate-400 hover:text-red-500 hover:scale-110 transition-all z-10 bg-white border border-slate-100/50"
          title="Guardar nos Favoritos"
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Image count or views quick overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/60 text-white text-[8px] font-extrabold">
          <Eye className="w-2.5 h-2.5 mr-0.5" />
          <span>{ad.views}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col gap-2">
        
        {/* Category & Date */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
          <span>{ad.subcategory || "Geral"}</span>
          <span>{ad.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-medium text-slate-700 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[36px]">
          {ad.title}
        </h3>

        {/* Struck-through Pricing & Discount Tag */}
        <div className="flex flex-col gap-0.5 mt-auto">
          {originalPrice && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-none">
              {formatPrice(ad.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] font-bold text-emerald-600">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Shipping badge / Negotiable tags */}
        <div className="flex items-center gap-2">
          {ad.featured ? (
            <span className="text-[10px] text-emerald-600 font-extrabold">
              Frete Grátis Luanda
            </span>
          ) : (
            <span className="text-[10px] text-slate-500">
              Entrega a combinar
            </span>
          )}
          <span className="text-slate-300">•</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase">
            {ad.priceType}
          </span>
        </div>

        {/* Location & Seller Badge */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{ad.location.city}, {ad.location.province}</span>
          </div>

          {/* Seller Verified Badge */}
          {seller?.verified && (
            <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded-full select-none" title="Vendedor Verificado">
              ✔ Verificado
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
