import React from "react";
import * as Icons from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";

export const CategoryGrid = () => {
  const { navigateTo, setSearchCategory, setSearchQuery } = useApp();

  const handleCategoryClick = (catId) => {
    setSearchCategory(catId);
    setSearchQuery(""); // Clear text query
    navigateTo("search");
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Navegar por Categorias
        </h2>
        <p className="text-xs text-muted-foreground">
          Explore o que há de mais quente no mercado angolano agora mesmo.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {CATEGORIES.map((cat) => {
          // Dynamic Lucide Icon Resolution
          const IconComponent = Icons[cat.icon] || Icons.Layers;

          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border/80 shadow-premium hover:shadow-premium-hover cursor-pointer transition-all text-center group"
            >
              {/* Icon Container with subtle gradient hover */}
              <div className="w-12 h-12 rounded-xl bg-primary-light group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-3 transition-all duration-300">
                <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>

              {/* Title */}
              <span className="text-xs font-bold text-foreground leading-tight truncate w-full">
                {cat.name}
              </span>

              {/* Ads Count */}
              <span className="text-[10px] text-muted-foreground mt-1 font-medium bg-muted px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>
      
    </section>
  );
};
