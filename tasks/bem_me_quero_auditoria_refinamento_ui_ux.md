# Bem Me Quero Maquiagens — Auditoria, refinamento e implementação de UI/UX

> **Instrução operacional para o assistente de código:** analise a aplicação existente, identifique problemas reais, implemente melhorias compatíveis com o projeto e valide o resultado. Este documento é um guia de execução, não uma solicitação de redesenho integral nem de substituição da arquitetura.

## 1. Contexto e objetivo

A **Bem Me Quero Maquiagens** é uma vitrine virtual de produtos de maquiagem e beleza, com origem em uma loja do Instagram. A aplicação disponibiliza uma landing page pública com produtos e categorias, além de rotas administrativas (`/admin`) destinadas ao cadastro e à manutenção de conteúdo e produtos. A experiência comercial pode encaminhar o cliente ao WhatsApp; **não presuma que exista checkout, carrinho ou pagamento integrado** sem confirmar no código.

A direção de produto já definida é **Soft Luxury E-commerce**: uma boutique de beleza online com estética premium, minimalista, suave, feminina, profissional e contemporânea. A referência principal de **UI/UX e estilização** é **Primavera Gloss**, da Shopify (`https://themes.shopify.com/themes/primavera/presets/gloss`). A referência **Skin Story — Premium Beauty & Skincare E-Commerce UI** (`https://www.behance.net/gallery/243255887/Skin-Story-Premium-Beauty-Skincare-E-Commerce-UI`) orienta a organização geral das seções, sem ditar a linguagem visual.

### Preservar obrigatoriamente

- **Navbar integrada/sobreposta ao hero banner no topo da página.** Isso é uma decisão intencional e aprovada. **Não** separe navbar e hero por um fundo sólido no estado inicial. Melhore a legibilidade com tratamento sutil de contraste, se necessário.
- Imagem do hero com os **produtos reais da loja à direita** e textos à esquerda. Não substitua o asset atual sem necessidade e autorização.
- **Categorias em círculos padronizados**, com nomes centralizados abaixo, seguindo a organização visual do Primavera Gloss.
- Identidade de cores rosa pastel, verde-sálvia e off-white; tipografia serifada editorial em títulos e sans-serif legível nos elementos funcionais.
- Conteúdo, dados e integrações do catálogo e do painel administrativo, rotas, links funcionais e comportamento de navegação.
- Estilo sóbrio e sofisticado. **Evite efeitos chamativos, parallax pesado, glassmorphism excessivo, gradientes artificiais, partículas, animações 3D e excesso de sombras.**

### Estrutura da landing page que deve ser respeitada

1. Barra de anúncios (quando presente) e navbar integrada ao hero.
2. Hero banner principal.
3. Comprar por categoria (cards circulares).
4. Best Sellers / Mais vendidos.
5. Banner promocional.
6. Products / Catálogo.
7. Banner editorial ou institucional.
8. Depoimentos.
9. Benefícios da loja (ex.: frete, suporte, pagamentos — **somente promessas verdadeiras e configuradas**).
10. Footer com navegação, contatos e redes sociais.

Não reordene seções sem uma razão funcional documentada.

---

## 2. Estratégia de execução

Você deve **revisar, implementar e melhorar**, não apenas escrever recomendações.

### Etapa A — Inspeção do repositório

1. Reconheça a stack atual (framework, linguagem, estilização, sistema de componentes, roteamento e assets), sem presumir Next.js, Tailwind ou Motion.
2. Localize os componentes de `navbar`, `hero`, categorias, cards de produtos, filtros, banners, depoimentos, benefícios, footer e os principais componentes do `/admin`.
3. Inspecione os design tokens, estilos globais, assets, fontes, estados de interação, breakpoints e dependências já instaladas.
4. Analise as interfaces em desktop e mobile **com browser/preview/capturas, caso essas ferramentas estejam disponíveis**. Se não estiverem, use inspeção estática e informe a limitação.
5. Registre problemas observáveis, evitando justificar mudanças com preferências abstratas.
6. Verifique fluxos reais: links, ancoragem de seções, busca, filtro, páginas de produto, WhatsApp, login e formulários admin, quando existentes.

### Etapa B — Priorização e implementação

- Priorize **alto impacto + baixo risco**: contraste, espaçamento, tipografia, consistência dos componentes, fotos, estados de foco/hover e responsividade.
- Depois implemente a melhoria de navegação e feedback; animações discretas por último.
- Faça alterações incrementais, reaproveitando os padrões atuais e **sem introduzir bibliotecas desnecessárias**.
- Não crie funcionalidades fictícias, reviews falsos, preços exemplificativos em produção, categorias inexistentes nem promessas comerciais não verificadas.
- Não interrompa o trabalho em uma proposta conceitual: **edite os arquivos e valide a implementação**, conforme os recursos disponíveis.

### Etapa C — Verificação

- Execute lint, checagem de tipos, build e testes existentes, quando houver e forem executáveis.
- Verifique desktop (1440 px), laptop (1024–1280 px), tablet (~768 px) e mobile (375–430 px); ajuste conforme breakpoints existentes.
- Verifique performance, carregamento, contrastes, estados de teclado e ausência de overflow horizontal.
- Entregue resumo dos arquivos alterados, mudanças realizadas, testes executados e pendências reais.

---

## 3. Design system e princípios de estilização

### 3.1 Paleta (referências, não substituição cega de tokens existentes)

| Papel               | Cor de referência | Aplicação                                   |
| ------------------- | ----------------- | ------------------------------------------- |
| Off-white principal | `#FFFAF7`         | Fundo de seções, cards leves                |
| Rosa pastel         | `#F8E1DD`         | Fundos editoriais e destaques sutis         |
| Rosa antigo         | `#CB8F98`         | Detalhes de marca, acentos pontuais         |
| Verde-sálvia        | `#A4AF85`         | Fundos de categoria e detalhes decorativos  |
| Verde de ação       | `#4C7651`         | Botões e links de ação, sujeito a contraste |
| Verde escuro        | `#26382B`         | Textos principais, ícones e links           |

Evite usar todas as cores simultaneamente em uma seção. Controle a saturação e priorize legibilidade. **Valide contraste real** (texto normal >= 4,5:1 e texto grande >= 3:1 como alvo WCAG AA); se uma combinação não atingir o requisito, use tom mais escuro em vez de sacrificar legibilidade.

### 3.2 Tipografia fluida e hierarquia

- Preserve as fontes aprovadas e efetivamente usadas no projeto. Como direção: **serifada editorial** para hero/títulos e **sans-serif** para navegação, preço, descrição e controles.
- Crie ou revise a escala tipográfica responsiva: títulos `clamp()`, parágrafos legíveis, `line-height` generoso, poucas variações de peso.
- Estabeleça uma hierarquia consistente: eyebrow pequeno -> título editorial -> apoio -> CTA.
- Não deixe títulos gigantes quebrados de forma ruim no mobile ou textos sobrepostos a embalagens.
- Garanta contraste e legibilidade de preços, badges e textos auxiliares; evite fonte pequena demais.

Exemplo apenas como ponto de partida, adaptável aos tokens atuais:

```css
.hero-title {
  font-size: clamp(2.7rem, 5vw, 5.7rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
}
.section-title {
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  line-height: 1.08;
}
```

### 3.3 Ritmo visual e espaçamento

Adote uma escala coerente, preferencialmente em múltiplos de 4/8 px, respeitando o design system existente:

| Relação                      | Ponto de partida              |
| ---------------------------- | ----------------------------- |
| Nome e preço                 | 8 px                          |
| Imagem e título da categoria | 16–20 px                      |
| Título e descrição de seção  | 16–24 px                      |
| Entre cards                  | 20–32 px                      |
| Padding lateral desktop      | 48–64 px (ajustar à largura)  |
| Entre seções da home         | 80–120 px (reduzir no mobile) |

Priorize **alinhamento, consistência de margens, linhas-base e densidade visual**. Evite que diferentes seções pareçam produzidas por templates desconectados.

### 3.4 Consistent Radius — raios coerentes

Utilize uma escala pequena de arredondamentos:

- Controles compactos: ~8 px.
- Cards e containers: ~12–16 px.
- Pills/chips: totalmente arredondados.
- **Categorias: círculos perfeitos, `border-radius: 50%`, proporção 1:1.**

Não aplique `rounded-full` indiscriminadamente a todos os componentes.

### 3.5 Soft Shadows — profundidade muito sutil

Utilize sombras apenas onde ajudarem na hierarquia: dropdowns, painéis flutuantes, cards em hover, popovers. Preferir sombras suaves e bordas discretas; evitar sombras profundas com aspecto de dashboard genérico.

### 3.6 Layered Surfaces — camadas sutis

Distinga seções por variações discretas de off-white, rosa muito claro e branco. Não transforme cada bloco da página em uma caixa; use alternância de fundos, espaço em branco e fotografia para criar ritmo.

### 3.7 Tokens CSS sugeridos

Não sobrescreva tokens existentes sem conferir os impactos. Use estes apenas como referência:

```css
:root {
  --color-surface: #fffaf7;
  --color-blush: #f8e1dd;
  --color-rose: #cb8f98;
  --color-sage: #a4af85;
  --color-primary: #4c7651;
  --color-ink: #26382b;

  --shadow-soft: 0 4px 16px rgba(38, 56, 43, 0.06);
  --shadow-hover: 0 10px 30px rgba(38, 56, 43, 0.1);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  --duration-fast: 160ms;
  --duration-normal: 280ms;
  --duration-slow: 480ms;
  --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 4. Hero + navbar: preservar integração, elevar legibilidade

**Regra inegociável:** a navbar fica **sobre o hero** no topo da página. Não inserir faixa sólida separando os dois.

### Revisar

- Legibilidade da logo rosa/verde contra o fundo rosa do banner.
- Contraste de links/ícones, especialmente sobre os produtos e as flores do lado direito.
- Alinhamento da logo, navegação central e ícones.
- Tratamento dos textos do hero e distância entre título, descrição e CTA.
- Sobreposição e comportamento em mobile.

### Implementar, se necessário

- **Gradient scrim** na área superior da fotografia, com cor clara/off-white, transparente no fim e sem linha de separação. Overlay atrás do texto e à frente da imagem, `pointer-events: none`.
- Ajustar intensidade do scrim **com base no resultado visual**, sem clarear demais os produtos.
- Se o hero precisar de contraste adicional no lado esquerdo, um segundo gradiente **horizontal e muito sutil**, limitado à área de texto.
- Tons escuros e consistentes em links/ícones; versão monocromática da logo **somente se o tratamento de contraste não for suficiente** e se houver asset apropriado.
- Hover minimalista e foco visível para links da navbar; tamanho adequado para targets de toque.
- Se o projeto já tiver navbar sticky: permitir uma transição discreta para fundo legível **após sair do hero**, mantendo transparência no topo. Não adicionar sticky sem necessidade.

Exemplo **conceitual** para adaptar, não colar sem conferir camadas:

```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 230px;
  background: linear-gradient(
    to bottom,
    rgba(255, 250, 247, 0.7),
    rgba(255, 250, 247, 0.33) 48%,
    rgba(255, 250, 247, 0) 100%
  );
  pointer-events: none;
  z-index: 1;
}
```

**Resultado:** navbar visualmente integrada à fotografia, porém mais legível, com hierarquia mais clara e aparência editorial.

---

## 5. Categorias: círculos padronizados como Primavera Gloss

- Preservar título, subtítulo e link "Ver todas as categorias" da seção.
- Imagens **circulares 1:1** com mesmo diâmetro, alinhamento e espaçamento.
- Quatro círculos em uma linha no desktop **se couber sem compressão**; duas colunas no mobile; adaptar tablet de acordo com espaço real.
- Fotos com linguagem fotográfica homogênea, produto centralizado, fundo suave e escala semelhante.
- Nomes centralizados **abaixo** dos círculos; serifada editorial, sem botões chamativos dentro das imagens.
- Manter o item inteiro clicável e foco visível.
- `object-fit: contain` para produtos recortados em fundo transparente; `cover` apenas quando o enquadramento editorial tolerar corte.
- Se imagens não estiverem padronizadas, preferir preparar o fluxo de **imagem de capa por categoria** no admin e documentar os assets pendentes, sem inventar produtos.
- Hover: `scale(1.03)` **somente na imagem**, contida no círculo; transição 250–350 ms; sem distorção nem layout shift.

---

## 6. Fotografia e consistência visual

Este é um dos itens de maior impacto. Faça uma auditoria das fotos dos produtos reais da loja:

- Consistência de resolução, proporção, enquadramento, fundo, iluminação e espaço ao redor.
- Uso de fotos reais nos cards; evitar placeholders genéricos e fotografias de produtos que a loja não possui.
- Proporção fixa e comportamento de recorte por contexto (categoria, card de catálogo, hero, banner editorial).
- Segunda foto em hover **somente quando houver uma segunda imagem real** para o produto.
- Não forçar ampliação de imagem de baixa resolução além de sua dimensão útil.
- Preferir WebP/AVIF quando a infraestrutura permitir, com qualidade equilibrada, `srcset`/`sizes`, lazy loading para imagens abaixo da dobra e prioridade para a imagem principal do hero.
- Preservar rótulos e identidade das embalagens; **não gerar ou alterar texto dos produtos com IA sem revisar fidelidade**.

---

## 7. Motion Design e microinterações

**Princípio:** animação deve reforçar feedback, continuidade e fluidez. Não deve competir com fotografia e conteúdo comercial.

### 7.1 Scroll Reveal

- Entradas discretas de títulos, textos ou blocos ao entrar na viewport: pequena distância vertical (~12–24 px), com opacidade.
- Duração ~400–600 ms; executar uma vez quando apropriado; evitar atraso excessivo que deixe conteúdo invisível.
- Não ocultar conteúdo crítico enquanto scripts de animação não carregam.

### 7.2 Image Zoom on Hover

- Em cards de produtos e categorias: aumentar a imagem interna em ~3% sem mover o card.
- `overflow: hidden` no container; 250–350 ms, easing suave.
- Não aplicar zoom em toda a página ou em elementos textuais.

### 7.3 Feedback tátil em botões (sem magnetismo real)

- Hover com mudança discreta de tom e/ou deslocamento mínimo.
- Pressed com `scale(0.98)` por curto período, quando fizer sentido.
- Feedback de loading/disabled sem bloquear controles indefinidamente.
- Evitar botões que perseguem o cursor.

### 7.4 Stagger Animation

- Opcional em cards de categorias e best sellers: entrada em sequência com intervalos de ~50–80 ms.
- Limitar a poucos elementos visíveis; não atrasar renderização de grandes listas.
- Garantir que filtros, rolagens repetidas e alteração de categoria não provoquem animações cansativas.

### 7.5 Respeitar preferências e performance

- Suportar `prefers-reduced-motion` e teclado.
- Preferir animar `transform` e `opacity`; evitar `width`, `height`, `top`, sombras animadas pesadas ou layouts que causem reflow.
- Use CSS para transições simples; use Motion ou biblioteca já instalada apenas se realmente necessária. **Não adicione GSAP/Framer Motion só por adicionar**.

Exemplo:

```css
.category-image img {
  transition: transform var(--duration-normal) var(--ease-premium);
}
@media (hover: hover) and (pointer: fine) {
  .category-link:hover .category-image img {
    transform: scale(1.03);
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Ajuste este exemplo ao código real; evite resets globais que desabilitem animações importantes sem análise.

---

## 8. Product Cards — refinar a vitrine

Cada card deve facilitar leitura e comparação rápida. Auditar:

- Imagem principal bem enquadrada; área visual e proporções consistentes.
- Nome, marca quando útil, preço atual e preço anterior apenas se desconto verdadeiro.
- Estado de disponibilidade real (em estoque, indisponível) somente se existe dado confiável.
- CTA com texto específico para o fluxo real, ex.: "Ver produto", "Consultar disponibilidade" ou "Pedir pelo WhatsApp".
- Hover discreto: imagem sutilmente ampliada, sombra leve se houver, transição suave; não deslocar conteúdo de outros cards.
- **Hover image swap** opcional se existir foto secundária real.
- Não saturar cards com botões, badges, selos e ícones sem função.
- Cards navegáveis por teclado e labels acessíveis.

### Best Sellers

- Mostrar poucos itens em destaque, mantendo consistência com o catálogo.
- Seleção configurável pelo admin, caso essa estrutura já exista ou seja facilmente extensível.
- Não declarar "mais vendido" sem critério; se o projeto só permite destaques manuais, preferir "Destaques" no conteúdo até haver dados suficientes.

---

## 9. Filtros, busca e navegação

Melhorias condicionais ao que já existe:

- Chips de categoria com estado selecionado claro e opção de limpar.
- Busca com feedback de resultado e estado vazio bem escrito.
- Filtros de preço/disponibilidade **apenas se os dados suportarem**; não criar opções sem correspondência no catálogo.
- Ordenação previsível (nome, preço, destaques) quando pertinente.
- Manter URL/estado de navegação coerente, se a arquitetura já suporta query params.
- Evitar criar um checkout/carrinho inexistente.
- Nas rotas de produto, explicar claramente como consultar ou pedir no WhatsApp, de acordo com a operação da loja.

---

## 10. Feedback, skeletons e estados de interface

Implemente uma experiência consistente para:

- **Loading:** skeletons discretos para grades de produtos carregadas assincronamente, sem flashes ou layout shift.
- **Empty:** nenhum produto encontrado; chamada para limpar filtros ou voltar ao catálogo.
- **Error:** mensagens simples com possibilidade de tentar novamente quando aplicável.
- **Success:** confirmação clara em formulários e ações do admin.
- **Disabled:** diferenciação visual sem simular ação clicável.
- **Keyboard focus:** `:focus-visible` bem definido em todos os controles.
- **Responsive feedback:** hover apenas em dispositivos com hover; estado de clique e foco em mobile.

Não adicione skeleton onde o conteúdo aparece de forma instantânea e estática.

---

## 11. Progressive Disclosure e microcopy

- Exiba primeiro o que ajuda a escolher: imagem, nome, preço, informação essencial e CTA.
- Deixe especificações longas, instruções detalhadas, variações e observações na página de produto ou em detalhes expansíveis.
- Corrija textos vagos e genéricos: prefira ações claras como "Ver detalhes" ou "Pedir pelo WhatsApp" quando correspondem à função.
- Preserve o tom de voz da marca: acolhedor, delicado e profissional, evitando clichês excessivos.
- Depoimentos: usar apenas relatos reais e autorizados; se ainda não existirem, não inventar avaliações.
- Benefícios como "frete grátis", "suporte online" e "pagamento flexível" somente se forem oferecidos e houver condições definidas; tornar a configuração editável caso isso já se encaixe no CMS/admin.

---

## 12. Experiência mobile e acessibilidade

### Mobile-first

- Verificar navbar sobre o hero sem texto competindo com produtos, ícones ou flores.
- Tratar imagem do hero com `object-position`, imagem mobile específica **somente se disponível e necessária**, ou disposição alternativa de textos no mobile sem abandonar a identidade visual.
- Categorias em 2 colunas com círculos idênticos e nomes legíveis.
- Cards de catálogo em 2 colunas quando houver espaço; caso contrário ajustar à largura real.
- Menus, busca, filtros e botões com áreas de toque confortáveis (alvo aproximado >= 44x44 px quando possível).
- Evitar overflow horizontal, elementos cortados e layout shifts.

### Acessibilidade

- Estrutura semântica de headings e landmark tags.
- Textos alternativos adequados (não repetir o nome do produto desnecessariamente).
- Contrastes medidos sobre fotografia **e nos diferentes estados responsivos**.
- Navegação de teclado, ordem de foco, foco visível, labels de ícones, status de loading e mensagens de validação.
- Animações reduzidas conforme preferência do usuário.
- Não depender apenas de cor ou hover para comunicar seleção/erro.

---

## 13. Performance percebida e qualidade técnica

- Priorizar LCP/hero (imagem apropriada e corretamente dimensionada, com preload/priority somente quando justificável).
- Lazy-load imagens abaixo da primeira dobra.
- Reservar espaço para imagens, evitar mudanças de layout.
- Minimizar JavaScript e dependências novas.
- Usar `srcset`/`sizes` ou otimização do framework; ajustar formatos e qualidade sem deixar embalagens ilegíveis.
- Evitar re-renderizações e animações contínuas em seções que não precisam.
- Verificar layout em diferentes DPR/retina: não resolver nitidez apenas esticando bitmaps.
- Inspecionar console para warnings e falhas de assets.

---

## 14. `/admin`: consistência visual sem virar uma segunda landing page

O painel administrativo deve ser mais funcional, mas usar tokens, tipografia secundária, ícones e estados consistentes com a marca.

Revisar:

- Formulários, labels, mensagens de erro, estados de salvamento.
- Listas/tabelas de produtos com busca e filtros úteis, quando existentes.
- Upload e preview de imagens sem distorção.
- Campos e cadastro para imagem de categoria, foto secundária e destaques **apenas se apropriado à arquitetura e ao escopo já existente**.
- Ações destrutivas com confirmação, estados de loading, sucessos e falhas.
- Contraste, navegação de teclado, espaçamentos e responsividade.

**Não reescreva o admin inteiro para padronizar a aparência.** Corrija inconsistências de forma incremental.

---

## 15. Matriz de priorização

| Item                                    | Impacto potencial | Esforço provável | Prioridade |
| --------------------------------------- | ----------------- | ---------------- | ---------- |
| Consistência de fotos e enquadramentos  | Muito alto        | Médio            | P0         |
| Tipografia, espaçamentos e alinhamentos | Muito alto        | Baixo            | P0         |
| Navbar sobre hero: contraste e foco     | Alto              | Baixo            | P0         |
| Categorias circulares padronizadas      | Alto              | Baixo–Médio      | P0         |
| Product cards + hover discreto          | Alto              | Baixo–Médio      | P1         |
| Busca, filtros e estados selecionados   | Alto              | Médio            | P1         |
| Loading, vazios, erros e feedback       | Alto              | Médio            | P1         |
| Acessibilidade e responsividade         | Muito alto        | Variável         | P0/P1      |
| Scroll reveal e stagger pontual         | Médio             | Baixo            | P2         |
| Sombras, camadas e refinamentos finais  | Médio             | Baixo            | P2         |

**P0:** realizar antes do polimento cosmético. **P1:** melhorar experiências recorrentes. **P2:** somente após interface estável e coerente.

---

## 16. Critérios de aceitação

### Identidade e layout

- [ ] A navbar **continua integrada** à imagem do hero no topo.
- [ ] Logo, links e ícones são legíveis em diferentes breakpoints.
- [ ] Hero mantém o asset aprovado, produtos à direita e texto à esquerda quando houver espaço.
- [ ] Todas as seções seguem a mesma hierarquia tipográfica e escala de espaçamento.
- [ ] Cores, raios, sombras e botões estão consistentes com os tokens do projeto.
- [ ] Categorias exibem imagens **circulares idênticas em tamanho**, com nomes centralizados e sem distorção.
- [ ] Fotos dos produtos têm enquadramento consistente e são fiéis aos itens vendidos.

### Interações e UX

- [ ] Hover, clique, foco, loading, vazio e erro têm feedback adequado.
- [ ] Animações são discretas e respeitam `prefers-reduced-motion`.
- [ ] Todos os links e ações da vitrine funcionam, inclusive redirecionamentos comerciais aplicáveis.
- [ ] Filtros, se existentes, comunicam seleção e permitem reversão.
- [ ] Não há promessas comerciais, promoções, depoimentos ou dados fictícios adicionados.

### Qualidade técnica

- [ ] Layout responsivo sem overflow ou sobreposições indevidas.
- [ ] Contraste e acessibilidade auditados nos principais fluxos.
- [ ] Imagens têm dimensões adequadas e não provocam layout shift significativo.
- [ ] Dependências novas foram evitadas ou justificadas.
- [ ] Lint, typecheck, build e testes disponíveis foram executados, com resultado reportado.
- [ ] Rotas, dados e integrações do `/admin` e do catálogo não foram quebrados.

---

## 17. Formato de entrega esperado do assistente de código

Ao finalizar, informe de forma objetiva:

1. **Diagnóstico breve:** problemas identificados, classificados por prioridade e componente.
2. **Implementações realizadas:** o que mudou em cada seção (navbar/hero, categorias, cards, catálogo, admin etc.).
3. **Arquivos alterados:** nomes/caminhos reais dos arquivos modificados.
4. **Decisões de design:** por que os ajustes preservam a estética premium minimalista.
5. **Validações:** breakpoints, acessibilidade, build, lint e testes de navegação realmente executados.
6. **Pendências:** melhorias dependentes de assets, dados reais ou definições comerciais; **não inventar que foram concluídas**.

**Não pare na análise:** implemente as melhorias priorizadas no repositório atual, sem redesenhar tudo e sem alterar decisões de design já aprovadas. Se uma ferramenta de preview ou execução estiver indisponível, faça o máximo possível com o código e registre a limitação explicitamente.
