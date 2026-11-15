export type MediaValue = {
  id: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type CategoryView = {
  id: string | number
  name: string
  slug: string
  description?: string | null
  image?: MediaValue | string | number | null
}

export type ProductView = {
  id: string | number
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number | null
  category?: CategoryView | string | number | null
  images?: Array<MediaValue | string | number> | null
  availability?: 'available' | 'low' | 'unavailable' | null
  featured?: boolean | null
  badge?: 'none' | 'best-seller' | 'new' | 'highlight' | 'offer' | null
  variants?: Array<{ id?: string | null; name: string; color?: string | null }> | null
  details?: string | null
  usage?: string | null
}

export type BannerView = {
  id: string | number
  placement: 'hero' | 'campaign' | 'institutional'
  desktopImage?: MediaValue | string | number | null
  mobileImage?: MediaValue | string | number | null
  eyebrow?: string | null
  title: string
  description?: string | null
  buttonLabel?: string | null
  link?: string | null
}

export type TestimonialView = {
  id: string | number
  displayName: string
  text: string
  rating?: number | null
}

export type SettingsView = {
  storeName?: string | null
  logo?: MediaValue | string | number | null
  instagram?: string | null
  whatsapp?: string | null
  shortText?: string | null
  contactMessage?: string | null
  benefits?: {
    shippingTitle?: string | null
    shippingText?: string | null
    supportTitle?: string | null
    supportText?: string | null
    paymentTitle?: string | null
    paymentText?: string | null
  } | null
  usefulLinks?: Array<{ id?: string | null; label: string; url: string }> | null
}

export const STORE_CATEGORIES: CategoryView[] = [
  {
    id: 'cat-labios',
    name: 'Lábios',
    slug: 'labios',
    description: 'Batons cremosos, mates, gloss labial e hidratantes com cores apaixonantes.',
    image: {
      id: 'img-cat-labios',
      url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Lábios - Batons e Gloss',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'cat-olhos',
    name: 'Olhos',
    slug: 'olhos',
    description: 'Máscaras de cílios, delineadores, sombras e lápis para um olhar marcante.',
    image: {
      id: 'img-cat-olhos',
      url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Olhos - Máscaras e Sombras',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'cat-pele',
    name: 'Pele',
    slug: 'pele',
    description: 'Bases, corretivos, blushes e iluminadores para um acabamento leve e radiante.',
    image: {
      id: 'img-cat-pele',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Pele - Bases e Blushes',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Séruns, brumas hidratantes e óleos faciais para preparar e cuidar da sua pele.',
    image: {
      id: 'img-cat-skincare',
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Skincare - Séruns e Brumas',
      width: 800,
      height: 1000,
    },
  },
]

export const STORE_PRODUCTS: ProductView[] = [
  {
    id: 'prod-gloss-labial',
    name: 'Gloss Labial Hidratante Brilho Espelhado',
    slug: 'gloss-labial-hidratante-brilho-espelhado',
    description:
      'Fórmula enriquecida com ácido hialurônico e óleo de jojoba. Proporciona brilho espelhado intenso sem sensação pegajosa, deixando os lábios macios e volumosos.',
    price: 42.9,
    salePrice: 38.9,
    category: STORE_CATEGORIES[0],
    images: [
      {
        id: 'img-gloss-1',
        url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        alt: 'Gloss Labial Hidratante',
      },
      {
        id: 'img-gloss-2',
        url: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80',
        alt: 'Textura do Gloss Labial',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'best-seller',
    variants: [
      { id: 'v-1', name: 'Rosa Delicado', color: '#e899a2' },
      { id: 'v-2', name: 'Nude Brilho', color: '#c98f7e' },
      { id: 'v-3', name: 'Cereja Suave', color: '#a83248' },
    ],
    details: 'Contém 5ml. Vegano e cruelty-free. Dermatologicamente testado.',
    usage: 'Aplique diretamente sobre os lábios limpos ou por cima do seu batom favorito.',
  },
  {
    id: 'prod-batom-matte',
    name: 'Batom Matte Aveludado Longa Duração',
    slug: 'batom-matte-aveludado-longa-duracao',
    description:
      'Alta pigmentação em uma única passada com acabamento matte aveludado que não resseca os lábios. Conforto e durabilidade para acompanhar todo o seu dia.',
    price: 49.9,
    salePrice: null,
    category: STORE_CATEGORIES[0],
    images: [
      {
        id: 'img-batom-1',
        url: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=800&q=80',
        alt: 'Batom Matte Aveludado',
      },
      {
        id: 'img-batom-2',
        url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        alt: 'Detalhe do Batom Matte',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'highlight',
    variants: [
      { id: 'v-4', name: 'Nude Clássico', color: '#b57b6d' },
      { id: 'v-5', name: 'Terracota', color: '#a05244' },
      { id: 'v-6', name: 'Vinho Elegante', color: '#61242e' },
    ],
    details: 'Peso líquido: 3.8g. Enriquecido com manteiga de karité e vitamina E.',
    usage: 'Comece delineando o arco do cupido e preencha suavemente todo o lábio.',
  },
  {
    id: 'prod-mascara-cilios',
    name: 'Máscara de Cílios Volume & Alongamento Intenso',
    slug: 'mascara-cilios-volume-alongamento-intenso',
    description:
      'Pincel anatômico que alcança desde a raiz até as pontas, separando os fios sem formar grumos. Resistente à água e com pigmento preto ultra profundo.',
    price: 54.9,
    salePrice: 47.9,
    category: STORE_CATEGORIES[1],
    images: [
      {
        id: 'img-mascara-1',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        alt: 'Máscara de Cílios Volume Intenso',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'best-seller',
    variants: [{ id: 'v-7', name: 'Preto Intenso', color: '#1a1a1a' }],
    details: 'Volume: 10ml. Fórmula oftalmologicamente testada, segura para usuárias de lentes.',
    usage: 'Aplique da raiz às pontas em movimentos de zigue-zague para máximo volume.',
  },
  {
    id: 'prod-paleta-sombras',
    name: 'Paleta de Sombras Neutras e Iluminadas',
    slug: 'paleta-sombras-neutras-iluminadas',
    description:
      'Nove tons versáteis e altamente pigmentados entre mates aveludados e cintilantes acetinados. Perfeita para makes do dia a dia e produções marcantes para a noite.',
    price: 89.9,
    salePrice: 79.9,
    category: STORE_CATEGORIES[1],
    images: [
      {
        id: 'img-paleta-1',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        alt: 'Paleta de Sombras Neutras',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'highlight',
    details: 'Estojo compacto com espelho interno. Textura macia que esfuma sem marcar.',
    usage: 'Aplique com pincel apropriado ou com a ponta dos dedos para intensificar o brilho.',
  },
  {
    id: 'prod-blush-liquido',
    name: 'Blush Líquido Efeito Natural Pêssego Dourado',
    slug: 'blush-liquido-efeito-natural-pessego',
    description:
      'Textura leve e fácil de espalhar que se funde perfeitamente com a pele, proporcionando um ar saudável e radiante que dura o dia todo.',
    price: 45.9,
    salePrice: 39.9,
    category: STORE_CATEGORIES[2],
    images: [
      {
        id: 'img-blush-1',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        alt: 'Blush Líquido Pêssego',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'offer',
    variants: [
      { id: 'v-8', name: 'Pêssego Dourado', color: '#f09b83' },
      { id: 'v-9', name: 'Rosa Chá', color: '#e38a92' },
      { id: 'v-10', name: 'Ameixa Suave', color: '#9c485c' },
    ],
    details: 'Contém 8ml. Enriquecido com esqualano vegetal.',
    usage: 'Deposite uma pequena gotinha nas maçãs do rosto e esfume com os dedos ou esponjinha.',
  },
  {
    id: 'prod-base-glow',
    name: 'Base Líquida Acabamento Natural Glow',
    slug: 'base-liquida-acabamento-natural-glow',
    description:
      'Cobertura média construível com acabamento viçoso e natural. Uniformiza o tom da pele sem pesar ou craquelar ao longo do dia.',
    price: 69.9,
    salePrice: null,
    category: STORE_CATEGORIES[2],
    images: [
      {
        id: 'img-base-1',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        alt: 'Base Líquida Natural Glow',
      },
    ],
    availability: 'available',
    featured: false,
    badge: 'new',
    variants: [
      { id: 'v-11', name: 'Tom 01 Claro', color: '#f2d3be' },
      { id: 'v-12', name: 'Tom 02 Médio Claro', color: '#e2bda0' },
      { id: 'v-13', name: 'Tom 03 Médio', color: '#cf9f7e' },
      { id: 'v-14', name: 'Tom 04 Bronze', color: '#a57252' },
    ],
    details: '30ml com válvula dosadora pump. FPS 20 e proteção UVA/UVB.',
    usage: 'Espalhe uniformemente sobre o rosto com pincel ou esponja umedecida.',
  },
  {
    id: 'prod-serum-facial',
    name: 'Sérum Facial Hidratante com Ácido Hialurônico',
    slug: 'serum-facial-hidratante-acido-hialuronico',
    description:
      'Hidratação profunda e prolongada para preparar a pele antes da maquiagem. Toque seco, rápida absorção e efeito primer que melhora a durabilidade da make.',
    price: 64.9,
    salePrice: 56.9,
    category: STORE_CATEGORIES[3],
    images: [
      {
        id: 'img-serum-1',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        alt: 'Sérum Facial Hidratante',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'highlight',
    details: 'Frasco conta-gotas de 30ml. Livre de óleos minerais e parabenos.',
    usage: 'Aplique de 3 a 4 gotas no rosto limpo pela manhã e à noite, massageando suavemente.',
  },
  {
    id: 'prod-bruma-fixadora',
    name: 'Bruma Fixadora e Hidratante Iluminadora',
    slug: 'bruma-fixadora-hidratante-iluminadora',
    description:
      'Fixa a maquiagem por até 12 horas, remove o aspecto pesado de pó e devolve o viço natural à pele com partículas ultrafinas de brilho.',
    price: 44.9,
    salePrice: null,
    category: STORE_CATEGORIES[3],
    images: [
      {
        id: 'img-bruma-1',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        alt: 'Bruma Fixadora Iluminadora',
      },
    ],
    availability: 'low',
    featured: false,
    badge: 'new',
    details: 'Frasco spray 120ml. Enriquecida com camomila e aloe vera.',
    usage: 'Borrife a uma distância de 25cm do rosto antes e após a maquiagem.',
  },
]

export const STORE_BANNERS: BannerView[] = [
  {
    id: 'banner-hero',
    placement: 'hero',
    eyebrow: 'Beleza para seu dia a dia',
    title: 'Realce o que faz você ser você.',
    description: 'Seus favoritos de maquiagem, escolhidos com carinho.',
    buttonLabel: 'Explorar produtos',
    link: '/#produtos',
    desktopImage: {
      id: 'hero-desktop',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=85',
      alt: 'Campanha Bem Me Quero Maquiagens',
    },
    mobileImage: {
      id: 'hero-mobile',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      alt: 'Campanha Bem Me Quero Maquiagens',
    },
  },
  {
    id: 'banner-campaign',
    placement: 'campaign',
    eyebrow: 'Coleção Leveza',
    title: 'Texturas que abraçam a sua pele',
    description:
      'Produtos multifuncionais desenvolvidos para valorizar sua beleza única de forma descomplicada.',
    buttonLabel: 'Conhecer produtos',
    link: '/produtos',
    desktopImage: {
      id: 'campaign-desktop',
      url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=80',
      alt: 'Destaque Coleção Leveza',
    },
  },
  {
    id: 'banner-institutional',
    placement: 'institutional',
    eyebrow: 'Sobre nós',
    title: 'Mais que maquiagem: um momento só seu.',
    description:
      'Na Bem Me Quero, acreditamos que se maquiar é um ritual de carinho e autocuidado. Escolhemos cada fórmula para que você se sinta radiante, confortável e confiante todos os dias.',
    buttonLabel: 'Falar no WhatsApp',
    link: 'https://wa.me/5511999999999',
    desktopImage: {
      id: 'inst-desktop',
      url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1400&q=80',
      alt: 'Institucional Bem Me Quero',
    },
  },
]

export const STORE_TESTIMONIALS: TestimonialView[] = [
  {
    id: 'test-1',
    displayName: 'Camila Rocha',
    text: 'Amei o gloss e o batom matte! As cores são ainda mais lindas pessoalmente e não ressecam nada a boca. O atendimento no WhatsApp foi impecável!',
    rating: 5,
  },
  {
    id: 'test-2',
    displayName: 'Juliana Mendes',
    text: 'A base tem uma cobertura linda e leve, exatamente como eu procurava pro meu dia a dia no trabalho. A entrega chegou super bem embalada e com cheirinho gostoso.',
    rating: 5,
  },
  {
    id: 'test-3',
    displayName: 'Beatriz Silveira',
    text: 'A máscara de cílios e o blush líquido já viraram meus queridinhos oficiais! Duram o dia todo sem borrar. Já recomendei pra todas as minhas amigas.',
    rating: 5,
  },
]

export const STORE_SETTINGS: SettingsView = {
  storeName: 'Bem Me Quero Maquiagens',
  instagram: 'https://instagram.com/bemmequero.make',
  whatsapp: '5511999999999',
  shortText:
    'Produtos de maquiagem e cuidados escolhidos com carinho para realçar o que faz você ser você.',
  contactMessage: 'Olá! Vim pelo site da Bem Me Quero e gostaria de consultar a disponibilidade de',
  benefits: {
    shippingTitle: 'Frete facilitado',
    shippingText: 'Entrega rápida e segura para todo o Brasil.',
    supportTitle: 'Atendimento com carinho',
    supportText: 'Tire suas dúvidas e faça seu pedido direto pelo WhatsApp.',
    paymentTitle: 'Pagamento flexível',
    paymentText: 'Pague via Pix ou parcele suas compras no cartão de crédito.',
  },
  usefulLinks: [
    { id: 'link-1', label: 'Início', url: '/' },
    { id: 'link-2', label: 'Catálogo de Produtos', url: '/produtos' },
    { id: 'link-3', label: 'Categorias', url: '/#categorias' },
    { id: 'link-4', label: 'Fale Conosco', url: 'https://wa.me/5511999999999' },
  ],
}

export async function getCategories(): Promise<CategoryView[]> {
  return STORE_CATEGORIES
}

export async function getProducts(): Promise<ProductView[]> {
  return STORE_PRODUCTS
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const product = STORE_PRODUCTS.find((p) => p.slug === slug)
  return product ?? null
}

export async function getBanners(): Promise<BannerView[]> {
  return STORE_BANNERS
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  return STORE_TESTIMONIALS
}

export async function getStoreSettings(): Promise<SettingsView> {
  return STORE_SETTINGS
}
