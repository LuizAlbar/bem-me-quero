import * as dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcryptjs'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { users, categories, products, banners, testimonials, storeSettings } from '../src/db/schema'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

if (!connectionString) {
  console.error('ERRO: DATABASE_URL ou DIRECT_URL não definida no .env')
  process.exit(1)
}

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...')

  try {
    // 1. Limpeza prévia para garantir idempotência
    await db.delete(products)
    await db.delete(categories)
    await db.delete(banners)
    await db.delete(testimonials)
    await db.delete(storeSettings)
    await db.delete(users)

    // 2. Usuário Administrador
    console.log('👤 Criando usuária administradora...')
    const passwordHash = await bcrypt.hash('admin123', 10)
    const [adminUser] = await db
      .insert(users)
      .values({
        name: 'Larissa - Bem Me Quero',
        email: 'larissa@bemmequero.com.br',
        passwordHash,
        role: 'admin',
      })
      .returning()

    console.log(`   Usuária criada: ${adminUser.email}`)

    // 3. Categorias
    console.log('🏷️ Inserindo categorias...')
    const [catLabios, catOlhos, catPele, catSkincare] = await db
      .insert(categories)
      .values([
        {
          name: 'Lábios',
          slug: 'labios',
          description: 'Batons cremosos, mates, gloss labial e hidratantes com cores apaixonantes.',
          imageUrl:
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
          order: 1,
          visible: true,
        },
        {
          name: 'Olhos',
          slug: 'olhos',
          description: 'Máscaras de cílios, delineadores, sombras e lápis para um olhar marcante.',
          imageUrl:
            'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
          order: 2,
          visible: true,
        },
        {
          name: 'Pele',
          slug: 'pele',
          description:
            'Bases, corretivos, blushes e iluminadores para um acabamento leve e radiante.',
          imageUrl:
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
          order: 3,
          visible: true,
        },
        {
          name: 'Skincare',
          slug: 'skincare',
          description:
            'Séruns, brumas hidratantes e óleos faciais para preparar e cuidar da sua pele.',
          imageUrl:
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
          order: 4,
          visible: true,
        },
      ])
      .returning()

    // 4. Produtos
    console.log('💄 Inserindo produtos...')
    await db.insert(products).values([
      {
        name: 'Gloss Labial Hidratante Brilho Espelhado',
        slug: 'gloss-labial-hidratante-brilho-espelhado',
        description:
          'Fórmula enriquecida com ácido hialurônico e óleo de jojoba. Proporciona brilho espelhado intenso sem sensação pegajosa, deixando os lábios macios e volumosos.',
        price: '42.90',
        salePrice: '38.90',
        categoryId: catLabios.id,
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
        name: 'Batom Matte Aveludado Longa Duração',
        slug: 'batom-matte-aveludado-longa-duracao',
        description:
          'Alta pigmentação em uma única passada com acabamento matte aveludado que não resseca os lábios. Conforto e durabilidade para acompanhar todo o seu dia.',
        price: '49.90',
        salePrice: null,
        categoryId: catLabios.id,
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
        name: 'Máscara de Cílios Volume & Alongamento Intenso',
        slug: 'mascara-cilios-volume-alongamento-intenso',
        description:
          'Pincel anatômico que alcança desde a raiz até as pontas, separando os fios sem formar grumos. Resistente à água e com pigmento preto ultra profundo.',
        price: '54.90',
        salePrice: '47.90',
        categoryId: catOlhos.id,
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
        details:
          'Volume: 10ml. Fórmula oftalmologicamente testada, segura para usuárias de lentes.',
        usage: 'Aplique da raiz às pontas em movimentos de zigue-zague para máximo volume.',
      },
      {
        name: 'Paleta de Sombras Neutras e Iluminadas',
        slug: 'paleta-sombras-neutras-iluminadas',
        description:
          'Nove tons versáteis e altamente pigmentados entre mates aveludados e cintilantes acetinados. Perfeita para makes do dia a dia e produções marcantes para a noite.',
        price: '89.90',
        salePrice: '79.90',
        categoryId: catOlhos.id,
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
        variants: [],
        details: 'Estojo compacto com espelho interno. Textura macia que esfuma sem marcar.',
        usage: 'Aplique com pincel apropriado ou com a ponta dos dedos para intensificar o brilho.',
      },
      {
        name: 'Blush Líquido Efeito Natural Pêssego Dourado',
        slug: 'blush-liquido-efeito-natural-pessego',
        description:
          'Textura leve e fácil de espalhar que se funde perfeitamente com a pele, proporcionando um ar saudável e radiante que dura o dia todo.',
        price: '45.90',
        salePrice: '39.90',
        categoryId: catPele.id,
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
        usage:
          'Deposite uma pequena gotinha nas maçãs do rosto e esfume com os dedos ou esponjinha.',
      },
      {
        name: 'Base Líquida Acabamento Natural Glow',
        slug: 'base-liquida-acabamento-natural-glow',
        description:
          'Cobertura média construível com acabamento viçoso e natural. Uniformiza o tom da pele sem pesar ou craquelar ao longo do dia.',
        price: '69.90',
        salePrice: null,
        categoryId: catPele.id,
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
        name: 'Sérum Facial Hidratante com Ácido Hialurônico',
        slug: 'serum-facial-hidratante-acido-hialuronico',
        description:
          'Hidratação profunda e prolongada para preparar a pele antes da maquiagem. Toque seco, rápida absorção e efeito primer que melhora a durabilidade da make.',
        price: '64.90',
        salePrice: '56.90',
        categoryId: catSkincare.id,
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
        variants: [],
        details: 'Frasco conta-gotas de 30ml. Livre de óleos minerais e parabenos.',
        usage:
          'Aplique de 3 a 4 gotas no rosto limpo pela manhã e à noite, massageando suavemente.',
      },
      {
        name: 'Bruma Fixadora e Hidratante Iluminadora',
        slug: 'bruma-fixadora-hidratante-iluminadora',
        description:
          'Fixa a maquiagem por até 12 horas, remove o aspecto pesado de pó e devolve o viço natural à pele com partículas ultrafinas de brilho.',
        price: '44.90',
        salePrice: null,
        categoryId: catSkincare.id,
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
        variants: [],
        details: 'Frasco spray 120ml. Enriquecida com camomila e aloe vera.',
        usage: 'Borrife a uma distância de 25cm do rosto antes e após a maquiagem.',
      },
    ])

    // 5. Banners
    console.log('🖼️ Inserindo banners...')
    await db.insert(banners).values([
      {
        placement: 'hero',
        eyebrow: 'Beleza para seu dia a dia',
        title: 'Realce o que faz você ser você.',
        description: 'Seus favoritos de maquiagem, escolhidos com carinho.',
        buttonLabel: 'Explorar produtos',
        link: '/#produtos',
        desktopImageUrl:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=85',
        mobileImageUrl:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        order: 1,
      },
      {
        placement: 'campaign',
        eyebrow: 'Coleção Leveza',
        title: 'Texturas que abraçam a sua pele',
        description:
          'Produtos multifuncionais desenvolvidos para valorizar sua beleza única de forma descomplicada.',
        buttonLabel: 'Conhecer produtos',
        link: '/produtos',
        desktopImageUrl:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=80',
        order: 2,
      },
      {
        placement: 'institutional',
        eyebrow: 'Sobre nós',
        title: 'Mais que maquiagem: um momento só seu.',
        description:
          'Na Bem Me Quero, acreditamos que se maquiar é um ritual de carinho e autocuidado. Escolhemos cada fórmula para que você se sinta radiante, confortável e confiante todos os dias.',
        buttonLabel: 'Falar no WhatsApp',
        link: 'https://wa.me/5511999999999',
        desktopImageUrl:
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1400&q=80',
        order: 3,
      },
    ])

    // 6. Depoimentos
    console.log('💬 Inserindo depoimentos...')
    await db.insert(testimonials).values([
      {
        displayName: 'Camila Rocha',
        text: 'Amei o gloss e o batom matte! As cores são ainda mais lindas pessoalmente e não ressecam nada a boca. O atendimento no WhatsApp foi impecável!',
        rating: 5,
        order: 1,
      },
      {
        displayName: 'Juliana Mendes',
        text: 'A base tem uma cobertura linda e leve, exatamente como eu procurava pro meu dia a dia no trabalho. A entrega chegou super bem embalada e com cheirinho gostoso.',
        rating: 5,
        order: 2,
      },
      {
        displayName: 'Beatriz Silveira',
        text: 'A máscara de cílios e o blush líquido já viraram meus queridinhos oficiais! Duram o dia todo sem borrar. Já recomendei pra todas as minhas amigas.',
        rating: 5,
        order: 3,
      },
    ])

    // 7. Configurações da Loja
    console.log('⚙️ Inserindo configurações da loja...')
    await db.insert(storeSettings).values({
      storeName: 'Bem Me Quero Maquiagens',
      whatsapp: '5511999999999',
      instagram: 'https://instagram.com/bemmequero.make',
      shortText:
        'Produtos de maquiagem e cuidados escolhidos com carinho para realçar o que faz você ser você.',
      contactMessage:
        'Olá! Vim pelo site da Bem Me Quero e gostaria de consultar a disponibilidade de',
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
    })

    console.log('🎉 Seed finalizado com sucesso!')
  } catch (error) {
    console.error('❌ Erro no seed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

seed()
