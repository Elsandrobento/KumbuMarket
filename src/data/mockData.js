// KumbuMarket SaaS Mock Database
// 18 Províncias de Angola e principais municípios
export const PROVINCES = [
  { id: "luanda", name: "Luanda", cities: ["Talatona", "Belas", "Kilamba", "Viana", "Cacuaco", "Cazenga", "Maianga", "Samba", "Rangel", "Sambizanga"] },
  { id: "benguela", name: "Benguela", cities: ["Benguela", "Lobito", "Catumbela", "Baía Farta", "Ganda", "Cubal", "Caimbambo"] },
  { id: "huila", name: "Huíla", cities: ["Lubango", "Chibia", "Humpata", "Caconda", "Matala", "Quipungo"] },
  { id: "huambo", name: "Huambo", cities: ["Huambo", "Caála", "Bailundo", "Londuimbali", "Ekunha"] },
  { id: "cabinda", name: "Cabinda", cities: ["Cabinda", "Cacongo", "Buco-Zau", "Belize"] },
  { id: "cuanza_sul", name: "Cuanza Sul", cities: ["Sumbe", "Porto Amboim", "Cela (Waku Kungo)", "Amboim (Gabela)", "Libolo"] },
  { id: "cuanza_norte", name: "Cuanza Norte", cities: ["N'dalatandu", "Cambambe", "Ambaca", "Golungo Alto"] },
  { id: "uige", name: "Uíge", cities: ["Uíge", "Negage", "Maquela do Zombo", "Sanza Pombo"] },
  { id: "malanje", name: "Malanje", cities: ["Malanje", "Cacuso", "Calandula", "Cangandala"] },
  { id: "namibe", name: "Namibe", cities: ["Moçâmedes", "Tômbwa", "Bibala", "Camucuio"] },
  { id: "zaire", name: "Zaire", cities: ["M'banza Kongo", "Soyo", "Nzeto", "Cuimba"] },
  { id: "moxico", name: "Moxico", cities: ["Luena", "Cameia", "Camanongue", "Luau"] },
  { id: "bie", name: "Bié", cities: ["Cuito", "Andulo", "Camacupa", "Chinguar"] },
  { id: "lunda_norte", name: "Lunda Norte", cities: ["Dundo", "Chitato", "Cambulo", "Capenda-Camulemba"] },
  { id: "lunda_sul", name: "Lunda Sul", cities: ["Saurimo", "Cacolo", "Dala", "Muonda"] },
  { id: "cunene", name: "Cunene", cities: ["Ondjiva", "Cahama", "Namacunde", "Cuanhama"] },
  { id: "cuando_cubango", name: "Cuando Cubango", cities: ["Menongue", "Calai", "Mavinga", "Cuito Cuanavale"] },
  { id: "bengo", name: "Bengo", cities: ["Caxito", "Dande", "Ambriz", "Nambuangongo"] }
];

export const CATEGORIES = [
  { id: "imoveis", name: "Imóveis", icon: "Home", count: 1420 },
  { id: "viaturas", name: "Viaturas", icon: "Car", count: 2850 },
  { id: "empregos", name: "Empregos", icon: "Briefcase", count: 850 },
  { id: "electronicos", name: "Electrónicos", icon: "Smartphone", count: 3410 },
  { id: "moda", name: "Moda", icon: "Shirt", count: 1980 },
  { id: "servicos", name: "Serviços", icon: "Wrench", count: 920 },
  { id: "tecnologia", name: "Tecnologia", icon: "Cpu", count: 1150 },
  { id: "construcao", name: "Construção", icon: "Hammer", count: 640 },
  { id: "agricultura", name: "Agricultura", icon: "Leaf", count: 430 },
  { id: "outros", name: "Outros", icon: "Layers", count: 520 }
];

export const USERS = [
  {
    id: "user_1",
    name: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
    verified: true,
    rating: 4.8,
    reviewsCount: 122,
    phone: "+244 923 456 789",
    whatsapp: "+244923456789",
    joinedDate: "Membro desde Nov 2024",
    role: "seller",
    plan: "Pro Kumbu",
    totalAds: 18,
    activeAds: 12,
    adViews: 24500,
    messagesCount: 42,
    reviews: [
      { id: "rev_1", author: "António Neto", rating: 5, comment: "Excelente vendedor! O carro estava impecável e o negócio foi muito transparente.", date: "Há 3 dias" },
      { id: "rev_2", author: "Sofia Castro", rating: 4, comment: "Muito prestativo. Negociámos um pouco o preço e correu tudo bem.", date: "Há 1 semana" }
    ]
  },
  {
    id: "user_2",
    name: "Dina Santos",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=200&fit=crop",
    verified: true,
    rating: 4.9,
    reviewsCount: 85,
    phone: "+244 912 987 654",
    whatsapp: "+244912987654",
    joinedDate: "Membro desde Jan 2025",
    role: "seller",
    plan: "Free",
    totalAds: 6,
    activeAds: 4,
    adViews: 8100,
    messagesCount: 19,
    reviews: [
      { id: "rev_3", author: "Manuel Garcia", rating: 5, comment: "Apartamento exatamente como descrito nas fotos. Muito simpática.", date: "Há 2 dias" }
    ]
  },
  {
    id: "user_3",
    name: "Edmilson Costa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=200&fit=crop",
    verified: false,
    rating: 4.2,
    reviewsCount: 14,
    phone: "+244 931 112 233",
    whatsapp: "+244931112233",
    joinedDate: "Membro desde Março 2026",
    role: "seller",
    plan: "Free",
    totalAds: 2,
    activeAds: 2,
    adViews: 450,
    messagesCount: 3,
    reviews: []
  },
  {
    id: "user_admin",
    name: "Kumbu Admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
    verified: true,
    rating: 5.0,
    reviewsCount: 1,
    phone: "+244 900 000 000",
    whatsapp: "+244900000000",
    joinedDate: "Administrador Geral",
    role: "admin",
    plan: "Master Plan",
    totalAds: 0,
    activeAds: 0,
    adViews: 0,
    messagesCount: 0,
    reviews: []
  }
];

export const INITIAL_ADS = [
  {
    id: "ad_1",
    title: "Toyota Land Cruiser Prado V6 L200",
    description: "Toyota Land Cruiser Prado à venda em Luanda, em excelentes condições mecânicas e de chapa. Caixa automática, motor V6 a gasolina super potente e silencioso. Ar condicionado gelando a 100%, estofos em pele creme sem rasgos. Toda a manutenção feita a tempo com peças originais. Vidros fumados homologados. Ideal para a família ou para as estradas do nosso interior. Aceito pagamento por transferência bancária ou cash. Venha ver e testar no Talatona.",
    category: "viaturas",
    subcategory: "Carros de Passeio",
    price: 38500000,
    priceType: "Negociável",
    condition: "Usado",
    location: { province: "Luanda", city: "Talatona" },
    contact: "+244 923 456 789",
    views: 1420,
    date: "Há 2 horas",
    sellerId: "user_1",
    featured: true,
    status: "ativo",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Exemplo
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&h=500&fit=crop"
    ],
    features: {
      marca: "Toyota",
      modelo: "Land Cruiser Prado",
      ano: "2018",
      quilometragem: "85.000 km",
      combustivel: "Gasolina",
      caixa: "Automática"
    }
  },
  {
    id: "ad_2",
    title: "Vivenda V4 de Luxo no Condomínio Jardim de Rosas",
    description: "Excelente oportunidade de adquirir uma Vivenda V4 de alto padrão num dos melhores condomínios fechados de Luanda (Jardim de Rosas). A casa conta com 4 suites espaçosas com roupeiros embutidos, cozinha moderna totalmente equipada, sala ampla para dois ambientes, quintal com piscina privativa, churrasqueira, anexo com lavandaria e garagem para 3 viaturas. Segurança privada 24h, fornecimento regular de água e luz com gerador industrial de suporte do condomínio. Pronta a entrar!",
    category: "imoveis",
    subcategory: "Vivendas & Casas",
    price: 220000000,
    priceType: "Negociável",
    condition: "Como Novo",
    location: { province: "Luanda", city: "Belas" },
    contact: "+244 912 987 654",
    views: 3100,
    date: "Há 1 dia",
    sellerId: "user_2",
    featured: true,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop"
    ],
    features: {
      quartos: "4",
      banheiros: "5",
      area: "350 m²",
      tipo: "Venda",
      mobilado: "Sim"
    }
  },
  {
    id: "ad_3",
    title: "iPhone 15 Pro Max 256GB - Selado",
    description: "Vendo iPhone 15 Pro Max de 256GB, cor Titanium Natural, totalmente selado na caixa original. Garantia Apple de 1 ano. Ofereço capa premium e película de vidro temperado. Equipamento original comprado em Portugal, com fatura oficial. Não aceito trocas por outros telemóveis, apenas venda cash ou transferência imediata via Multicaixa Express na entrega em mãos (Luanda - Talatona/Maianga). Preço fixo não negociável.",
    category: "electronicos",
    subcategory: "Telemóveis & Tablets",
    price: 950000,
    priceType: "Preço Fixo",
    condition: "Novo",
    location: { province: "Luanda", city: "Maianga" },
    contact: "+244 923 456 789",
    views: 4520,
    date: "Há 4 horas",
    sellerId: "user_1",
    featured: false,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=500&fit=crop"
    ],
    features: {
      marca: "Apple",
      modelo: "iPhone 15 Pro Max",
      armazenamento: "256 GB",
      garantia: "1 Ano Apple"
    }
  },
  {
    id: "ad_4",
    title: "Smart TV LG OLED 65'' 4K C3 2024",
    description: "Excelente Smart TV LG OLED Evo de 65 polegadas série C3. Tela OLED perfeita com pretos puros e cores incríveis. Taxa de atualização de 120Hz ideal para gamers (PS5/Xbox Series X). Processador Alpha 9 Gen 6 AI. 4 entradas HDMI 2.1. Dolby Vision e Dolby Atmos. TV com menos de 3 meses de uso, impecável, ainda com os plásticos de proteção nas laterais. Tenho a caixa e todos os acessórios de origem. Motivo de venda: mudança de residência.",
    category: "electronicos",
    subcategory: "TVs & Áudio",
    price: 1200000,
    priceType: "Negociável",
    condition: "Como Novo",
    location: { province: "Benguela", city: "Lobito" },
    contact: "+244 912 987 654",
    views: 920,
    date: "Há 3 dias",
    sellerId: "user_2",
    featured: false,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=800&h=500&fit=crop"
    ],
    features: {
      marca: "LG",
      modelo: "OLED65C3",
      estado: "Impecável",
      garantia: "Nacional (18 meses)"
    }
  },
  {
    id: "ad_5",
    title: "Contabilista Sénior Freelancer - Declarações AGT",
    description: "Ofereço serviços especializados de Contabilidade e Assessoria Fiscal para PME e Freelancers em Angola. Elaboração de demonstrações financeiras, submissão de declarações de IVA, IRT, II (Imposto Industrial) no portal da AGT. Recuperação de contabilidade em atraso, planeamento fiscal legal e fecho de contas. Profissionalismo, rigor e confidencialidade. Reuniões presenciais em Luanda ou trabalho 100% remoto para outras províncias. Contacte para um orçamento.",
    category: "servicos",
    subcategory: "Contabilidade & Legal",
    price: 75000,
    priceType: "Negociável",
    condition: "N/A",
    location: { province: "Luanda", city: "Talatona" },
    contact: "+244 931 112 233",
    views: 310,
    date: "Há 5 dias",
    sellerId: "user_3",
    featured: false,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop"
    ],
    features: {
      experiencia: "Mais de 8 Anos",
      modalidade: "Remoto / Presencial",
      faturacao: "Sim (Passo Fatura)"
    }
  },
  {
    id: "ad_6",
    title: "Terreno Agro-Industrial 15 Hectares - Waku Kungo",
    description: "Excelente terreno agrícola plano com 15 hectares localizado no Waku Kungo (Cela), província do Cuanza Sul. Terra extremamente fértil, perfeita para cultivo de hortícolas, milho, soja, batata ou para criação de gado. O terreno é banhado por um riacho permanente, o que facilita a irrigação durante o ano inteiro. Acesso fácil a apenas 2 km da estrada nacional principal. Vedado em 3 lados, com licença de exploração e documentação em ordem (croqui e certidão comunitária).",
    category: "agricultura",
    subcategory: "Terrenos Agrícolas",
    price: 18000000,
    priceType: "Negociável",
    condition: "N/A",
    location: { province: "Cuanza_sul", city: "Cela (Waku Kungo)" },
    contact: "+244 923 456 789",
    views: 890,
    date: "Há 1 semana",
    sellerId: "user_1",
    featured: true,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop"
    ],
    features: {
      area: "15 Hectares",
      agua: "Rio no local",
      acesso: "Muito Bom",
      documentos: "Legalizado"
    }
  },
  {
    id: "ad_7",
    title: "Precisa-se de Gestor de Tráfego Pago / Social Media",
    description: "Agência de Marketing Digital em Luanda está a recrutar um profissional qualificado em regime presencial/híbrido. Requisitos: Experiência comprovada em gestão de campanhas (Meta Ads e Google Ads), domínio de ferramentas de análise (Google Analytics, Pixels), criatividade para copy e estratégia de conteúdo. Oferecemos salário atrativo compatível com a experiência, subsídio de alimentação, bónus por alcance de metas de clientes e ambiente dinâmico de crescimento rápido.",
    category: "empregos",
    subcategory: "Marketing & Comunicação",
    price: 350000,
    priceType: "Preço Fixo",
    condition: "N/A",
    location: { province: "Luanda", city: "Samba" },
    contact: "+244 931 112 233",
    views: 1280,
    date: "Há 1 dia",
    sellerId: "user_3",
    featured: false,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop"
    ],
    features: {
      contrato: "Tempo Inteiro (CLT)",
      salario: "350.000 AOA / Mês",
      experiencia: "Mínimo 2 anos"
    }
  },
  {
    id: "ad_8",
    title: "Ténis Nike Air Force 1 '07 - Originais",
    description: "Ténis Nike Air Force 1 '07 totalmente originais, brancos clássicos, no tamanho 42. Comprei na loja da Nike no exterior do país, infelizmente ficou-me apertado e por isso estou a vender. Usados apenas uma única vez para experimentar dentro de casa. Estão rigorosamente novos, limpos, na caixa original de fábrica. Entrego pessoalmente no Kilamba, Viana ou Talatona. Preço ligeiramente negociável.",
    category: "moda",
    subcategory: "Calçado",
    price: 68000,
    priceType: "Negociável",
    condition: "Como Novo",
    location: { province: "Luanda", city: "Kilamba" },
    contact: "+244 923 456 789",
    views: 2010,
    date: "Há 6 horas",
    sellerId: "user_1",
    featured: false,
    status: "ativo",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=500&fit=crop"
    ],
    features: {
      marca: "Nike",
      tamanho: "42",
      genero: "Unissexo",
      cor: "Branco"
    }
  },
  {
    id: "ad_p1",
    title: "Hyundai Santa Fe 2021 Luxury Pack",
    description: "Anúncio pendente criado para simulação do fluxo de aprovação do painel de administração. Hyundai Santa Fe em estado de novo, com 32.000 km reais. Caixa automática de 8 velocidades, teto panorâmico panorâmico de ponta a ponta. Sensores de estacionamento 360 e câmara traseira de alta definição. Um único dono em Luanda. Importado legalmente.",
    category: "viaturas",
    subcategory: "Carros de Passeio",
    price: 28000000,
    priceType: "Negociável",
    condition: "Como Novo",
    location: { province: "Luanda", city: "Talatona" },
    contact: "+244 923 456 789",
    views: 0,
    date: "Agora mesmo",
    sellerId: "user_1",
    featured: false,
    status: "pendente",
    videoUrl: "",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop"
    ],
    features: {
      marca: "Hyundai",
      modelo: "Santa Fe",
      ano: "2021",
      quilometragem: "32.000 km",
      combustivel: "Gasóleo",
      caixa: "Automática"
    }
  }
];

export const INITIAL_CHATS = [
  {
    id: "chat_1",
    adId: "ad_3", // iPhone 15
    buyerId: "user_2", // Dina Santos
    sellerId: "user_1", // Carlos Silva
    unread: false,
    messages: [
      { id: "m1", senderId: "user_2", text: "Olá Carlos! O iPhone ainda está disponível?", timestamp: "14:20" },
      { id: "m2", senderId: "user_1", text: "Olá Dina, boa tarde! Sim, ainda está disponível sim.", timestamp: "14:22" },
      { id: "m3", senderId: "user_2", text: "Excelente! Aceita 900.000 AOA cash hoje mesmo?", timestamp: "14:25" },
      { id: "m4", senderId: "user_1", text: "Obrigado pela oferta Dina, mas o preço é fixo de 950.000 AOA. O telemóvel está selado na caixa.", timestamp: "14:30" }
    ]
  },
  {
    id: "chat_2",
    adId: "ad_1", // Land Cruiser
    buyerId: "user_3", // Edmilson
    sellerId: "user_1", // Carlos Silva
    unread: true,
    messages: [
      { id: "m5", senderId: "user_3", text: "Boa tarde senhor Carlos. Gostaria de saber o estado da caixa de velocidade do Land Cruiser.", timestamp: "Ontem" },
      { id: "m6", senderId: "user_1", text: "Boa tarde. A caixa está impecável, passou na última revisão geral no mês passado sem qualquer apontamento.", timestamp: "Ontem" },
      { id: "m7", senderId: "user_3", text: "Perfeito. Posso ir ver o carro amanhã no Talatona por volta das 10h?", timestamp: "Há 1 hora" }
    ]
  }
];

export const FINANCIALS = {
  revenueTotal: 4850000, // em Kwanza (AOA)
  revenueHistory: [
    { name: "Jan", receita: 850000, vendas: 12 },
    { name: "Fev", receita: 980000, vendas: 15 },
    { name: "Mar", receita: 1100000, vendas: 19 },
    { name: "Abr", receita: 1420000, vendas: 24 },
    { name: "Mai", receita: 1650000, vendas: 30 }
  ],
  transactions: [
    { id: "tx_1", date: "21 Mai 2026", user: "Carlos Silva", plan: "Pro Destaque", amount: 45000, gateway: "Multicaixa Express", status: "sucesso" },
    { id: "tx_2", date: "20 Mai 2026", user: "Dina Santos", plan: "Pro Destaque", amount: 45000, gateway: "Referência Bancária", status: "sucesso" },
    { id: "tx_3", date: "18 Mai 2026", user: "Carlos Silva", plan: "Subscrição Mensal Pro", amount: 150000, gateway: "Stripe (Cartão)", status: "sucesso" },
    { id: "tx_4", date: "15 Mai 2026", user: "Mateus Pedro", plan: "Renovação de Anúncio", amount: 10000, gateway: "PayPal", status: "falhado" }
  ],
  stats: {
    activeAds: 8,
    pendingAds: 1,
    newUsers: 142,
    conversionRate: "4.8%"
  }
};
