import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Upload, X, Check, CreditCard, Sparkles, Building, Car, Smartphone } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PROVINCES } from "../../data/mockData";
import { PaymentModal } from "../Common/PaymentModal";

export const CreateAd = () => {
  const { createAd, currentUser, navigateTo, addNotification } = useApp();

  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("gratis");

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("viaturas");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("Negociável");
  const [condition, setCondition] = useState("Usado");
  
  // Location
  const [province, setProvince] = useState("Luanda");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState(currentUser?.phone || "");
  const [videoUrl, setVideoUrl] = useState("");

  // Base64 Images List
  const [images, setImages] = useState([]);

  // Category Specific Features
  const [features, setFeatures] = useState({});

  // Dynamic Cities List based on Province
  const activeProvinceObj = PROVINCES.find(p => p.name === province);
  const cities = activeProvinceObj ? activeProvinceObj.cities : [];

  useEffect(() => {
    if (cities.length > 0) {
      setCity(cities[0]);
    }
  }, [province]);

  // Clean features when category changes
  useEffect(() => {
    setFeatures({});
    setSubcategory("");
  }, [category]);

  // Handle local image file reading as Base64 Data URL!
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check limit
    const limit = selectedPlan === "gratis" ? 3 : selectedPlan === "destaque" ? 8 : 15;
    if (images.length + files.length > limit) {
      addNotification(
        "warning", 
        "Limite Excedido", 
        `O seu plano (${selectedPlan.toUpperCase()}) permite no máximo ${limit} imagens.`
      );
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateFeature = (key, value) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!title || !description || !price) {
        addNotification("warning", "Campos Incompletos", "Por favor preencha o título, descrição e preço.");
        return;
      }
    }
    if (step === 3) {
      if (images.length === 0) {
        addNotification("warning", "Sem Imagens", "Adicione pelo menos uma imagem para o anúncio.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePublishSubmit = (e) => {
    e.preventDefault();

    if (selectedPlan === "gratis") {
      // Direct submission
      const adData = {
        title, description, category, subcategory, price, priceType, condition, province, city, contact, videoUrl, images, features
      };
      createAd(adData, false);
    } else {
      // Trigger payment
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (gatewayUsed) => {
    setShowPayment(false);
    
    const adData = {
      title, description, category, subcategory, price, priceType, condition, province, city, contact, videoUrl, images, features
    };

    const paymentDetails = {
      planName: selectedPlan === "destaque" ? "Plano Destaque Kumbu" : "Plano Premium Gold",
      amount: selectedPlan === "destaque" ? 25000 : 45000,
      gateway: gatewayUsed
    };

    createAd(adData, true, paymentDetails);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Step Wizard Bar */}
      <div className="flex items-center justify-between mb-8 bg-card border border-border p-4 rounded-2xl shadow-sm">
        {[
          { num: 1, text: "Geral" },
          { num: 2, text: "Detalhes" },
          { num: 3, text: "Mídia & Local" },
          { num: 4, text: "Monetização" }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              step === s.num
                ? "bg-primary text-white scale-110 shadow-md"
                : step > s.num
                  ? "bg-emerald-100 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}>
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={`hidden sm:inline text-xs font-bold ${step === s.num ? "text-primary" : "text-muted-foreground"}`}>
              {s.text}
            </span>
            {s.num < 4 && <ChevronRight className="hidden sm:block w-4 h-4 text-muted-foreground/50" />}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-premium overflow-hidden p-6 sm:p-8">
        
        {/* Step 1: General Info */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest">Informações do Anúncio</h2>
            <hr className="border-border/60" />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Título do Anúncio *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Toyota Hilux 2020 3.0 Automática"
                className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="viaturas">Viaturas & Veículos</option>
                  <option value="imoveis">Imóveis & Casas</option>
                  <option value="electronicos">Telemóveis & Electrónicos</option>
                  <option value="empregos">Empregos & Recrutamento</option>
                  <option value="moda">Moda & Calçado</option>
                  <option value="servicos">Serviços & Autônomos</option>
                  <option value="tecnologia">Informática & TI</option>
                  <option value="construcao">Materiais de Construção</option>
                  <option value="agricultura">Agricultura & Animais</option>
                  <option value="outros">Outros Negócios</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Subcategoria (Opcional)</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="Ex: Carros de Passeio, Suites, Portáteis"
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 sm:col-span-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Preço (AOA) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Preço em Kwanza"
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Condições do Preço *</label>
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Negociável">Negociável</option>
                  <option value="Preço Fixo">Preço Fixo</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Estado do Artigo *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Usado">Usado</option>
                  <option value="Como Novo">Como Novo</option>
                  <option value="Novo">Novo</option>
                  <option value="N/A">Não Aplicável (Serviços/Empregos)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Descrição rica do anúncio *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhadamente o seu produto ou serviço. Inclua informações sobre manutenção, falhas, motivos de venda, acessórios inclusos para acelerar a sua venda."
                rows={5}
                className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Dynamic Category Specs */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              {category === "viaturas" && <Car className="w-5 h-5 text-primary" />}
              {category === "imoveis" && <Building className="w-5 h-5 text-primary" />}
              {(category === "electronicos" || category === "tecnologia") && <Smartphone className="w-5 h-5 text-primary" />}
              Características Detalhadas ({category.toUpperCase()})
            </h2>
            <p className="text-xs text-muted-foreground">
              Fornecer filtros específicos de categoria melhora a relevância do seu anúncio nas buscas em 80%!
            </p>
            <hr className="border-border/60" />

            {/* Dynamic Fields for Vehicles */}
            {category === "viaturas" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Marca *</label>
                  <input
                    type="text"
                    value={features.marca || ""}
                    onChange={(e) => updateFeature("marca", e.target.value)}
                    placeholder="Ex: Toyota, Hyundai, Kia"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Modelo *</label>
                  <input
                    type="text"
                    value={features.modelo || ""}
                    onChange={(e) => updateFeature("modelo", e.target.value)}
                    placeholder="Ex: Hilux, I30, Sportage"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Ano de Fabrico</label>
                  <input
                    type="number"
                    value={features.ano || ""}
                    onChange={(e) => updateFeature("ano", e.target.value)}
                    placeholder="Ex: 2018"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Quilometragem</label>
                  <input
                    type="text"
                    value={features.quilometragem || ""}
                    onChange={(e) => updateFeature("quilometragem", e.target.value)}
                    placeholder="Ex: 85.000 km"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Combustível</label>
                  <select
                    value={features.combustivel || "Gasolina"}
                    onChange={(e) => updateFeature("combustivel", e.target.value)}
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Gasóleo">Gasóleo</option>
                    <option value="Híbrido / Elétrico">Híbrido / Elétrico</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Caixa de Velocidades</label>
                  <select
                    value={features.caixa || "Automática"}
                    onChange={(e) => updateFeature("caixa", e.target.value)}
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dynamic Fields for Real Estate */}
            {category === "imoveis" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Quartos *</label>
                  <input
                    type="number"
                    value={features.quartos || ""}
                    onChange={(e) => updateFeature("quartos", e.target.value)}
                    placeholder="Ex: 3"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Casas de Banho</label>
                  <input
                    type="number"
                    value={features.banheiros || ""}
                    onChange={(e) => updateFeature("banheiros", e.target.value)}
                    placeholder="Ex: 2"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Área Total (m²)</label>
                  <input
                    type="text"
                    value={features.area || ""}
                    onChange={(e) => updateFeature("area", e.target.value)}
                    placeholder="Ex: 120 m²"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Tipo de Imóvel</label>
                  <select
                    value={features.tipo || "Venda"}
                    onChange={(e) => updateFeature("tipo", e.target.value)}
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  >
                    <option value="Venda">Venda</option>
                    <option value="Arrendamento">Arrendamento (Aluguer)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Mobilado?</label>
                  <select
                    value={features.mobilado || "Não"}
                    onChange={(e) => updateFeature("mobilado", e.target.value)}
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  >
                    <option value="Não">Não (Vazio)</option>
                    <option value="Sim">Sim (Semi-Mobilado / Total)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dynamic Fields for Electronics/Tech */}
            {(category === "electronicos" || category === "tecnologia") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Marca</label>
                  <input
                    type="text"
                    value={features.marca || ""}
                    onChange={(e) => updateFeature("marca", e.target.value)}
                    placeholder="Ex: Apple, Samsung, Dell"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Modelo</label>
                  <input
                    type="text"
                    value={features.modelo || ""}
                    onChange={(e) => updateFeature("modelo", e.target.value)}
                    placeholder="Ex: iPhone 15 Pro Max, Latitude 5420"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Armazenamento (GB/TB)</label>
                  <input
                    type="text"
                    value={features.armazenamento || ""}
                    onChange={(e) => updateFeature("armazenamento", e.target.value)}
                    placeholder="Ex: 256 GB, 16GB RAM"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Tempo de Garantia</label>
                  <input
                    type="text"
                    value={features.garantia || ""}
                    onChange={(e) => updateFeature("garantia", e.target.value)}
                    placeholder="Ex: 6 meses, Selado na Caixa"
                    className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Standard fallback message for other categories */}
            {category !== "viaturas" && category !== "imoveis" && category !== "electronicos" && category !== "tecnologia" && (
              <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/30">
                Sem campos específicos necessários para esta categoria. Avance para a próxima etapa.
              </div>
            )}

          </div>
        )}

        {/* Step 3: Media & Location */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest">Mídias & Geolocalização</h2>
            <hr className="border-border/60" />

            {/* Simulated uploader to base64 DataURLs */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Galeria de Imagens *</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Upload Trigger box */}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary bg-muted/30 hover:bg-primary-light/10 flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all gap-1.5 group select-none">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-bold text-foreground">Selecionar Ficheiros</span>
                  <span className="text-[8px] text-muted-foreground">PNG ou JPG</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* File Previews */}
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/60 hover:bg-danger text-white transition-all shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] font-bold text-white bg-slate-950/50 px-1.5 py-0.5 rounded">
                      Foto {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Link de Vídeo (Opcional)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/watch?v=..."
                className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Província *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground cursor-pointer"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Município / Cidade *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-3 text-sm rounded-xl border border-border bg-background text-foreground cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Número de Contacto *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ex: +244 923 456 789"
                className="p-3 text-sm rounded-xl border border-border bg-background text-foreground"
                required
              />
            </div>

          </div>
        )}

        {/* Step 4: Monetization / Plans */}
        {step === 4 && (
          <div className="flex flex-col gap-5 animate-slide-up">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              SaaS Monetização — Destacar Anúncio
            </h2>
            <p className="text-xs text-muted-foreground">
              Destaque o seu anúncio para obter até 15 vezes mais visualizações e contactos rápidos de compradores.
            </p>
            <hr className="border-border/60" />

            {/* Plans List */}
            <div className="flex flex-col gap-3">
              {[
                {
                  id: "gratis",
                  name: "Grátis Simples",
                  price: "0 AOA",
                  duration: "30 Dias de exibição",
                  imgLimit: "Máximo 3 fotos",
                  badge: "Pendente para moderação do admin",
                  features: ["Inserção no catálogo geral", "Pesquisas padrão por raio"],
                  premium: false
                },
                {
                  id: "destaque",
                  name: "Kumbu Destaque",
                  price: "25.000 AOA",
                  duration: "30 Dias em destaque",
                  imgLimit: "Até 8 fotos",
                  badge: "Aprovação instantânea automatizada",
                  features: ["Selo dourado de destaque", "Exibição na secção principal de Destaques", "Destaque prioritário no WhatsApp"],
                  premium: true
                },
                {
                  id: "premium",
                  name: "SaaS Premium Gold",
                  price: "45.000 AOA",
                  duration: "45 Dias em destaque",
                  imgLimit: "Até 15 fotos + Link Vídeo",
                  badge: "Selo Vendedor Ouro + Auto-Aprovação",
                  features: ["Topo da lista de pesquisas", "Selo Ouro Exclusivo", "Renovação gratuita após 15 dias", "Relatório de visitas semanal no dashboard"],
                  premium: true
                }
              ].map((plan) => {
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      // Clear images above limit
                      const limit = plan.id === "gratis" ? 3 : plan.id === "destaque" ? 8 : 15;
                      if (images.length > limit) {
                        setImages(prev => prev.slice(0, limit));
                        addNotification("info", "Limite de Imagens Ajustado", `As suas fotos foram ajustadas para o limite de ${limit} do plano.`);
                      }
                    }}
                    className={`flex flex-col md:flex-row items-stretch md:items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary-light/10 shadow-md"
                        : plan.premium
                          ? "border-amber-300 bg-amber-500/5 hover:bg-amber-500/10"
                          : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          plan.premium ? "text-amber-600" : "text-slate-600"
                        }`}>{plan.name}</span>
                        {plan.premium && (
                          <span className="flex items-center gap-0.5 bg-amber-500 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded">
                            <Sparkles className="w-2 h-2 fill-current" /> Destaque
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground leading-normal flex flex-wrap gap-x-2 gap-y-1 mt-1 font-medium">
                        <span>🕒 {plan.duration}</span>
                        <span>•</span>
                        <span>📷 {plan.imgLimit}</span>
                      </div>

                      {/* Small checklist of items */}
                      <ul className="text-[10px] text-muted-foreground/80 list-disc pl-4 mt-2 flex flex-col gap-0.5">
                        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    {/* Price and selector check */}
                    <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-border/40 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className={`text-base font-extrabold ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {plan.price}
                        </span>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-border bg-card"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-border/60 pt-6 mt-8">
          
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 px-5 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl border border-border transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md transition-all ml-auto"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublishSubmit}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-lg transition-all ml-auto transform hover:scale-[1.01]"
            >
              {selectedPlan === "gratis" ? "Publicar Anúncio Grátis" : "Proceder ao Pagamento"}
            </button>
          )}

        </div>

      </div>

      {/* Payment Gateway Modal Popup */}
      {showPayment && (
        <PaymentModal
          amount={selectedPlan === "destaque" ? 25000 : 45000}
          planName={selectedPlan === "destaque" ? "Kumbu Destaque" : "SaaS Premium Gold"}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
