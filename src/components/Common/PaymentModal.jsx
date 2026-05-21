import React, { useState } from "react";
import { X, Check, Smartphone, Landmark, CreditCard, Shield, RefreshCw } from "lucide-react";

export const PaymentModal = ({ amount, planName, onClose, onSuccess }) => {
  const [method, setMethod] = useState("multicaixa"); // multicaixa, reference, stripe, paypal
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = simulated notification wait

  // Format currency helper
  const formatPrice = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (method === "multicaixa") {
      // Simulate Multicaixa Express mobile push notification
      setStep(2);
      setLoading(false);
      
      // Simulate user clicking "Confirm" on their phone after 3.5 seconds!
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onSuccess("Multicaixa Express");
        }, 1500);
      }, 3500);
    } else {
      // Simple checkout simulation
      setTimeout(() => {
        setLoading(false);
        onSuccess(
          method === "reference" ? "Referência Bancária" : 
          method === "stripe" ? "Stripe (Cartão)" : "PayPal"
        );
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border p-6 shadow-2xl glass animate-slide-up flex flex-col gap-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1 pr-8">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest">SaaS Checkout Seguro</span>
          <h3 className="text-md sm:text-lg font-bold text-foreground">Pagamento do Anúncio</h3>
          <p className="text-xs text-muted-foreground">
            A ativar: <span className="font-bold text-foreground">{planName}</span> por <span className="font-extrabold text-primary">{formatPrice(amount)}</span>
          </p>
        </div>

        <hr className="border-border/60" />

        {/* STEP 1: Payment inputs */}
        {step === 1 ? (
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* Left Column: Gateways Select */}
            <div className="w-full md:w-48 flex flex-col gap-2 shrink-0">
              {[
                { id: "multicaixa", label: "MC Express", icon: <Smartphone className="w-4 h-4 text-emerald-500" /> },
                { id: "reference", label: "Referência", icon: <Landmark className="w-4 h-4 text-amber-500" /> },
                { id: "stripe", label: "Cartão / Stripe", icon: <CreditCard className="w-4 h-4 text-blue-500" /> }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setMethod(g.id)}
                  type="button"
                  className={`flex items-center gap-2 p-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                    method === g.id
                      ? "border-primary bg-primary-light/10 text-primary shadow-sm"
                      : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g.icon}
                  {g.label}
                </button>
              ))}
            </div>

            {/* Right Column: Gateways details */}
            <div className="flex-1 flex flex-col justify-between">
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* 1. Multicaixa Express Form */}
                {method === "multicaixa" && (
                  <div className="flex flex-col gap-3">
                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5">
                      <Smartphone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-normal">
                        <strong>Multicaixa Express:</strong> Insira o número de telefone associado ao seu cartão MC Express. Enviaremos um pedido de confirmação de pagamento para a sua aplicação.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Nº de Telefone MC Express *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 923 456 789"
                        className="p-3 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* 2. Bank Reference Form */}
                {method === "reference" && (
                  <div className="flex flex-col gap-3">
                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5">
                      <Landmark className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-normal">
                        <strong>Referência de Pagamento:</strong> Efetue o pagamento em qualquer caixa Multicaixa ou no seu Internet Banking (Pagamento por Referência).
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-muted/60 border border-border/80 flex flex-col gap-2 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-sans uppercase text-[10px]">Entidade:</span>
                        <span className="font-bold text-foreground">10234 (KumbuMarket)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-sans uppercase text-[10px]">Referência:</span>
                        <span className="font-bold text-foreground">928 384 102</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-sans uppercase text-[10px]">Montante:</span>
                        <span className="font-bold text-primary">{formatPrice(amount)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Stripe Form */}
                {method === "stripe" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Número do Cartão *</label>
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        className="p-3 text-sm rounded-xl border border-border bg-background text-foreground"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Validade *</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="p-3 text-sm rounded-xl border border-border bg-background text-foreground"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="p-3 text-sm rounded-xl border border-border bg-background text-foreground"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Safe badge and pay button */}
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground justify-center">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Conexão Encriptada Segura certificada pela EMIS</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirmar e Pagar"
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        ) : (
          /* STEP 2: Simulated Multicaixa Push wait */
          <div className="flex flex-col items-center justify-center text-center py-6 gap-5">
            
            {/* Custom Glowing Phone Ring Indicator */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 pulse-online" />
              <Smartphone className="w-10 h-10 text-emerald-600 dark:text-emerald-400 relative z-10" />
            </div>

            <div className="flex flex-col gap-1 max-w-sm">
              <h4 className="text-sm font-bold text-foreground">Confirme no seu Telemóvel</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Enviámos uma notificação de pagamento de <strong className="text-primary">{formatPrice(amount)}</strong> para o telemóvel <strong>+244 {phone}</strong>.
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-full mt-3 flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Aguardando autorização no Multicaixa Express...
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mt-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Validando autorização bancária...
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
