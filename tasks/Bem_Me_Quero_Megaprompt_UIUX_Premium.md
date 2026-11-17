# MEGAPROMPT — BEM ME QUERO MAQUIAGENS

## Auditoria profunda, implementação de refinamento premium, motion design, qualidade visual e acessibilidade

> **Papel:** você é um agente de código que deve atuar como **Design Engineer Sênior + UI/UX Designer de e-commerce beauty + Especialista em Motion Design, Acessibilidade e Performance Web**.
>
> **Missão:** analisar o estado real da aplicação, corrigir os problemas já identificados e **implementar** um refinamento de ponta a ponta, com uma estética de boutique de cosméticos premium. Não entregar apenas conceitos ou sugestões; executar as melhorias viáveis, testar visualmente e documentar o resultado.
>
> **Ordem de execução obrigatória:** (1) corrigir categorias circulares; (2) integrar `assets/sessions/banner-2.png`; (3) realizar auditoria e corrigir problemas de credibilidade visual; (4) estabelecer tokens, profundidade e motion acessível; (5) melhorar UX, estados de carregamento e performance; (6) validar no navegador e corrigir regressões.

---

## 0. Contexto da aplicação e decisões já aprovadas

**Projeto:** Bem Me Quero Maquiagens, vitrine virtual de produtos de maquiagem e skincare de uma loja que divulga seus produtos no Instagram. Existe ou está planejada uma rota `/admin` para cadastrar e gerenciar os produtos exibidos no site público. O fluxo comercial pode redirecionar o cliente ao WhatsApp, de acordo com as funcionalidades realmente implementadas.

**Referência principal de UI/UX e acabamento visual:** [Primavera Gloss — Shopify](https://themes.shopify.com/themes/primavera/presets/gloss). **Referência de estrutura editorial:** [Skin Story — Behance](https://www.behance.net/gallery/243255887/Skin-Story-Premium-Beauty-Skincare-E-Commerce-UI).

**Conceito de marca:** Soft Luxury Beauty Boutique. O objetivo é parecer uma operação comercial confiável e bem cuidada, com arte-direção sofisticada, e **não** uma landing page genérica cheia de truques de IA.

**Identidade atual a preservar:** rosa pastel, rosa antigo, verde-sálvia, verde-escuro, off-white; títulos serifados editoriais; textos de interface em sans-serif; fotos de produtos como protagonistas; curvas e cantos suaves.

### Decisões de design NÃO negociáveis

1. **A navbar deve continuar integrada/sobreposta ao hero banner.** Essa sobreposição é intencional. **Não dividir a navbar e o hero** nem aplicar uma faixa branca opaca no estado inicial. O gradient scrim do topo já foi aplicado e deve ser preservado/aperfeiçoado somente se a inspeção no navegador demonstrar necessidade.
2. O hero principal e a fotografia dos produtos foram aprovados. Não trocar o banner por imagem genérica e não descaracterizar a composição.
3. A seção **Comprar por Categoria deve voltar a ter círculos**; cada item terá **somente a imagem circular e o nome centralizado abaixo**. Remover descrição individual e seta.
4. O banner editorial intermediário já possui nova imagem no projeto em **`assets/sessions/banner-2.png`**. Não gerar outra imagem nem voltar à fotografia antiga.
5. Reutilizar os componentes, roteamento, design tokens e estrutura reais do repositório. Não introduzir frameworks/bibliotecas de efeito sem necessidade.
6. **Não inventar depoimentos, nomes de clientes, avaliações, promoções, descontos, disponibilidade, políticas comerciais, frete grátis ou condições de pagamento.** Validar dados reais com a origem/admin ou tratar como conteúdo pendente sem publicá-lo como fato.
7. Trabalhar como **refinamento profundo**, não reescrever a aplicação. Manter UX e funções já aprovadas. Evitar regressões.
8. Acessibilidade e performance são parte do resultado visual premium, não tarefas opcionais para depois.

---

## 1. Fontes de evidência e limites da auditoria inicial

O material de referência fornecido é um **PDF de impressão com 7 páginas**, de 17/11/2026, intitulado _Bem Me Quero Maquiagens | Realce o que faz você ser você_. Trate-o como um **snapshot**, não como substituto do navegador nem como fotografia necessariamente atualizada do repositório.

### Observações VISUALMENTE confirmáveis no PDF

| Página | Elemento observado                | Problema / oportunidade                                                                                                                                                                     |
| ------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Hero, navbar, barra de anúncios   | Boa composição e identidade; inspecionar legibilidade real da navbar sobre a foto, proporção, CTA, foco e scroll. A impressão não prova como o gradient scrim se comporta.                  |
| 2      | Comprar por categoria             | **Regressão confirmada:** 4 imagens retangulares, descrições curtas e setas; devem voltar a ser círculos com apenas o nome.                                                                 |
| 2–3    | Destaques                         | Layout de produtos relativamente limpo, porém com imagens de estoque/referência visual repetidas; badges e cards precisam de melhor consistência e feedback.                                |
| 3      | Banner editorial "Coleção Leveza" | O snapshot ainda exibe o flatlay antigo da paleta; substituir com o asset novo e conservar split-screen.                                                                                    |
| 4–5    | Catálogo e filtros                | Há busca, categorias e ordenação, mas é preciso melhorar clareza, feedback, estados vazios, loading e consistência das imagens.                                                             |
| 3–5    | Fotos em cards                    | **Problema importante de credibilidade:** mesma imagem usada para produtos distintos (ex.: máscara/paleta; blush/base; sérum/bruma), às vezes sem correspondência evidente com a descrição. |
| 5–6    | Sobre nós                         | Boa intenção editorial, mas revisar foto, copy, alinhamento, CTA e material visual para não parecer um bloco genérico.                                                                      |
| 6      | Depoimentos                       | Blocos textuais quase sem superfície; revisar legibilidade, autenticidade, distribuição e apresentação.                                                                                     |
| 7      | Benefícios e footer               | Conteúdos úteis, mas visualmente tímidos e com navegação redundante. Checar veracidade de frete, parcelamento e atendimento.                                                                |

### O que NÃO pode ser concluído apenas pelo PDF

- Motion, hover, scroll reveal, transições, skeleton loading, toast, estados de busca, sticky navbar e todos os aspectos de contraste dependentes de CSS de tela.
- Fidelidade dos fundos, shadows e gradientes: impressões frequentemente ignoram estilos de background.
- Qualidade do mobile, tablet, touch, teclado, leitores de tela e rede lenta.
- Mapeamento real dos dados do `/admin` e quais produtos/depoimentos são publicados.

**Obrigação:** conferir a aplicação REAL em browser e no código antes de afirmar que alguma dessas características está ausente. Separar no relatório: **observado no PDF**, **confirmado no navegador**, **confirmado no código** e **sugestão de design**.

---

## 2. Skills: descoberta, escolha e uso eficiente durante a implementação

O usuário forneceu uma lista extensa de skills disponíveis para o agente. Faça bom uso delas **quando realmente existirem no ambiente**; leia suas instruções locais antes de utilizá-las. **Não apenas cite o nome da skill no relatório: utilize-a para produzir auditoria, código ou validação.**

### Workflow de skills recomendado

| Momento            | Skill(s) prioritária(s)                                                                       | Tarefa concreta                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Início             | `using-agent-skills`, `context-engineering`, `planning-and-task-breakdown`                    | Descobrir as skills instaladas, entender stack/arquitetura, criar plano curto com etapas e checkpoints.                                                                           |
| Auditoria visual   | `design-taste-frontend`, `frontend-design`, `ui-taste`, `web-design-guidelines`               | Diagnosticar hierarquia, fotografia, microcopy, responsividade e sinais de UI genérica; formular correções específicas para esta loja.                                            |
| Refino orquestrado | `impeccable` (se disponível)                                                                  | Usar `critique`/`audit`, depois `layout`, `typeset`, `animate`, `clarify`, `adapt`, `optimize`, e ao final `polish` conforme o workflow oficial e sem rodar comandos redundantes. |
| Implementação      | `frontend-ui-engineering`, `incremental-implementation`                                       | Corrigir em fatias testáveis, reutilizar componentes e tokens; garantir qualidade do código e acessibilidade.                                                                     |
| Movimento          | `apple-design` + `impeccable animate` (se disponível)                                         | Movimento com significado, easing natural, estados interrompíveis, feedback e reduced motion.                                                                                     |
| Performance        | `performance-optimization`, `vercel-react-best-practices` **somente se React/Next.js**        | Avaliar Core Web Vitals, imagens, hydration, tamanho do bundle, renderizações e dependências.                                                                                     |
| Inspeção real      | `agent-browser`, `browser-testing-with-devtools` se o Chrome DevTools MCP estiver configurado | Screenshots, comportamento de hover, scroll, estados de loading, console, network e testes em viewports diversas.                                                                 |
| Componentes        | `shadcn` **somente se o projeto já usar shadcn/ui**                                           | Reutilizar API/composição/a11y de componentes existentes; não instalar a biblioteca só porque ela aparece na lista.                                                               |
| Garantia           | `test-driven-development`, `code-review-and-quality`, `debugging-and-error-recovery`          | Criar testes quando houver lógica nova, revisar diffs, corrigir regressões sem mascarar falhas.                                                                                   |
| Documentação       | `documentation-and-adrs`, `source-driven-development`                                         | Consolidar decisões de UI e verificar APIs atualizadas nas documentações oficiais quando necessário.                                                                              |

**Regras:** não invocar todas as skills indiscriminadamente, não deixar a inspeção em loop infinito, não instalar várias bibliotecas que fazem a mesma coisa. Descobrir a stack primeiro. Preferir CSS/recursos existentes para animações simples. Se uma skill não estiver disponível, registrar a limitação e prosseguir com método equivalente, sem bloquear a entrega.

### Sequência sugerida para Impeccable, caso instalado e configurado

1. Carregar contexto do projeto segundo a skill.
2. `critique`/`audit` no alvo correto **quando o workflow oficial e as ferramentas requeridas estiverem disponíveis**.
3. `layout`, `typeset`, `clarify` para os problemas de hierarquia e cópia.
4. `animate` para a tese de movimento (abaixo).
5. `adapt`, `optimize`, `harden` conforme os defeitos encontrados.
6. `polish` final com verificação visual limitada e documentada.

**Não** afirmar que rodou detector, MCP, análise de performance ou verificação mobile se não os executou.

---

# PARTE A — CORREÇÕES OBRIGATÓRIAS, EXECUTAR PRIMEIRO

## 3. [PRIORIDADE MÁXIMA] Categorias: VOLTAR PARA CÍRCULOS, sem descrição nem seta

**Snapshot da regressão:** página 2 do PDF. O design aprovado anteriormente tinha **quatro imagens circulares padronizadas** e o nome embaixo; um agente alterou inadvertidamente para cards quadrados/retangulares. Corrigir essa regressão antes de mexer no resto.

### Especificação visual EXATA

- Preservar o cabeçalho da seção: eyebrow **COMPRAR POR CATEGORIA**, título **Sua beleza, do seu jeito**, descrição introdutória da seção e link **Ver todas as categorias**. A remoção solicitada se refere às **descrições individuais nos cards**, não ao texto introdutório da seção.
- Cards: **Lábios, Olhos, Pele, Skincare**.
- Cada categoria renderiza **somente dois elementos visuais**: **imagem circular** + **nome centralizado abaixo**.
- **Remover inteiramente** a descrição individual (ex.: "Batons cremosos...", "Máscaras de cílios...") e a seta/ícone de navegação lateral. Não mantê-los invisíveis ocupando espaço.
- Não incluir tag, botão, ícone extra, borda grossa, caixa retangular ou text overlay sobre a imagem.
- Área de clique engloba imagem e nome, implementada como link semântico para o filtro/rota correspondente. `aria-label` adequado; foco visível acessível.
- Imagens com `aspect-ratio: 1 / 1; border-radius: 50%; overflow: hidden;` no viewport circular. Mesma medida visual, enquadramento equilibrado e mesma linha de base.
- Nome centralizado, tipografia serifada editorial já presente, peso regular, verde profundo. Aproximadamente `clamp(1.3rem, 1.7vw, 1.9rem)` como ponto de partida; respeitar tokens reais.
- Espaçamento entre círculo e nome: ~14–20px; separação entre categorias uniformes (gap fluido).
- Desktop: 4 colunas; tablet: 4 se couber confortavelmente, senão 2; mobile: 2 colunas. Sem scroll horizontal não intencional.
- Círculos responsivos: nunca maiores do que a célula do grid; dimensionamento com `width: 100%; max-width: ...; aspect-ratio: 1`.
- Crop: preferir `object-fit: cover` para fotos editoriais já quadradas; `contain` com fundo definido caso o asset tenha transparência e precise do produto inteiro. `object-position` por categoria quando necessário. Não distorcer.
- Utilizar os **assets de categoria padronizados já existentes no projeto**, verificando seus nomes/paths. Não usar fotos do catálogo como substituto automático se isso criar inconsistências.
- Hover em dispositivos que suportem hover: imagem `scale(1.025–1.04)` dentro do recorte circular, com suavização ~260–380ms. Pequena mudança de cor no nome ou sublinhado sutil, sem sombra forte no círculo.
- Focus-visible: outline com offset visível sem cortar o recorte; preferência de movimento reduzido deve retirar o zoom e preservar feedback por cor/foco.
- No mobile, não depender de hover; áreas clicáveis confortáveis.

**Não transformar toda a seção em carrossel** só por ser mais dinâmico. Quatro categorias cabem melhor em grid. A interação deve continuar simples, rápida e previsível.

### Aceite desta correção

- [ ] Quatro círculos perfeitos, **nenhum card quadrado**.
- [ ] Cada item mostra **somente imagem + nome**.
- [ ] Nenhuma descrição individual, seta ou elemento extra.
- [ ] Imagens padronizadas, sem crop ruim e sem distorção.
- [ ] Links funcionam e estão acessíveis via teclado/touch.
- [ ] Desktop, tablet e mobile testados visualmente.

---

## 4. [PRIORIDADE MÁXIMA] Banner editorial intermediário: usar `assets/sessions/banner-2.png`

**Snapshot:** página 3 do PDF ainda mostra, no banner _Coleção Leveza_, um flatlay da paleta de sombras e cosméticos. **O usuário já preparou a imagem substituta no repositório em `assets/sessions/banner-2.png`.**

### Implementar

1. Localizar o componente split-screen do banner intermediário e a fonte atual da imagem.
2. Verificar no filesystem o caminho real de `assets/sessions/banner-2.png`. Determinar corretamente como importar/referenciar conforme a stack (`public/`, `src/`, import estático ou outra estratégia existente). Não presumir que o caminho físico é uma URL pública.
3. Substituir a imagem antiga **apenas nesse componente**. Não trocar hero, categorias, produtos ou Sobre nós.
4. Preservar a estrutura editorial **imagem à esquerda / conteúdo à direita**, com proporção aproximada 55/45, ajustável conforme o enquadramento real. Preservar copy e CTA inicialmente.
5. Preservar bordas externas arredondadas e cortar overflow de imagem no container.
6. Manter a imagem nítida, sem filtros pesados, sem novo texto sobreposto à foto e sem reconstruir a composição no HTML.
7. No desktop: altura equilibrada entre os painéis, sem `object-fit: fill`; no mobile: empilhamento sem cortar o produto principal, eventualmente com `object-position` específico.
8. Refinar o painel direito: rosa pastel suave; eyebrow verde; título serifado grande com `max-width` e `line-height` definidos; copy mais legível; CTA com espaçamento e feedback elegante.
9. CTA existente **Conhecer produtos**: validar para qual coleção/filtro leva; não deixar link decorativo. Se destino incorreto, ajustar para rota/âncora real existente, sem criar coleção fictícia.
10. Considerar alterar a descrição atual "Produtos multifuncionais desenvolvidos..." **apenas depois de verificar a verdade comercial**, pois a loja revende marcas e não deve insinuar que fabrica os produtos. Propor copy adequada para aprovação se a intenção for ambígua.

### Motion com propósito

- Fotografia com microzoom de até 1.02 em hover **somente se não competir** com o motion dos cards vizinhos.
- Conteúdo textual com uma entrada única suave quando surgir na viewport (opacity + deslocamento 10–16px, 400–550ms) ou revelar como um bloco, não cada palavra.
- Botão: hover/focus/active previsível (cor, seta em deslocamento de 2–4px, sem efeitos magnéticos que dificultem clique).
- Sem parallax pesado, sem blur fotográfico, sem formas flutuantes de IA.

### Aceite

- [ ] Banner mostra a imagem do caminho informado.
- [ ] Sem fallback silencioso para o flatlay antigo.
- [ ] Cores, proporção e nitidez preservadas.
- [ ] Conteúdo alinhado e CTA funcional.
- [ ] Mobile com produto enquadrado e sem overflow.

---

## 5. [PRIORIDADE ALTA / CONFIANÇA] Coerência entre imagem, produto e descrição

**Problema observável no PDF:** nos destaques e catálogo há imagens idênticas para produtos distintos; por exemplo, a mesma foto de um conjunto de sombras aparece para máscara e paleta, uma foto de cabelo/pessoa é usada para blush e base, e um produto roxo de skincare é reutilizado para sérum e bruma. Também aparecem embalagens e marcas em fotos de referência que podem não corresponder aos nomes dos itens.

Isto tem **impacto maior do que qualquer animação**: um usuário pode perder confiança ao encontrar uma foto que não representa o item anunciado.

### Ação obrigatória

- Auditar os dados reais de cada produto: `id`, `slug`, `nome`, `categoria`, `imagens`, `preço`, `preço anterior`, `status`, `destaque`, `estoque` (se aplicável).
- Verificar se as imagens são assets corretos de cada produto ou placeholders de demonstração.
- Se a aplicação estiver usando mocks, marcar claramente no diagnóstico; **não publicar dados artificiais como se fossem catálogo real**.
- Onde houver foto real cadastrada, usar a foto correta em todas as superfícies: best sellers, catálogo, resultado de busca, detalhes e compartilhamentos.
- Onde não houver mídia própria, usar placeholder **neutro, honesto e consistente** (ex.: fundo com ícone e "Imagem em breve") ao invés de reciclar fotografia de outro produto.
- Não criar automaticamente embalagens fictícias com rótulos falsos para representar SKUs reais.
- Preservar proporção uniforme de fotografia em cards, com `object-fit` apropriado e prioridade à integridade do produto.
- Se existir no admin, permitir imagem principal e secundárias; adicionar validação e preview; se não existir, propor alteração mínima e só executá-la se estiver claramente no escopo permitido.
- Badges `Destaque`, `Novo`, `Oferta` devem derivar de dados reais. `Oferta` só se preço anterior/promocional válido; `Novo` só por regra verificável ou flag editorial.

**Meta:** catálogo visualmente bonito **e comercialmente verídico**.

---

# PARTE B — DIREÇÃO DE ARTE E SISTEMA DE DESIGN

## 6. Diagnóstico estético: por que o site parece estático, seco e genérico

O PDF mostra uma base de bom gosto (fontes, espaçamento, rosa/verde), mas a experiência tende à monotonia quando todas as seções repetem:

- mesmas superfícies quase brancas;
- grades de cards com pouca diferenciação de estado;
- fotografia de produtos sem curadoria consistente;
- texto em blocos estáticos sem variação deliberada de hierarquia;
- ausência de materialidade perceptível nos elementos interativos;
- poucos sinais de resposta durante navegação, busca e carregamento;
- depoimentos/benefícios com pouca identidade de componente.

**Não resolver isso com animação em todos os elementos.** Resolver com **ritmo visual**: alternar trechos calmos, focos fotográficos e momentos de interação curtos. O resultado deve lembrar uma beauty boutique: editorial no storytelling, preciso no catálogo, funcional no admin.

### Tese de design

**"Delicadeza em repouso, vivacidade na interação."** A página parada é limpa e premium; quando o usuário navega, passa o cursor, abre filtros ou percorre os produtos, a interface responde de maneira elegante e natural. Não repetir o mesmo reveal em tudo.

### Referências de distribuição de energia

- **Hero:** grande momento editorial, já visualmente forte; motion mínimo.
- **Categorias:** fotos circulares padronizadas, sensação de coleção organizada, hover sensível.
- **Best sellers:** cards mais vivos nos estados hover, badges contidos, transição de cards.
- **Banner-2:** um segundo momento editorial, com contraste entre foto e painel rosado.
- **Catálogo:** eficiência, busca/filtros claros, loading honesto.
- **Sobre nós/depoimentos:** profundidade sutil e confiança.
- **Footer:** fechamento forte e organizado, não apenas área extensa e vazia.

---

## 7. Tokens e materialidade — introduzir sem apagar os tokens existentes

Inspecionar primeiro o design system. Criar/normalizar tokens **somente quando faltar** base consistente. Valores abaixo são propostas visuais iniciais, a ajustar com screenshots reais e testes de contraste:

```css
:root {
  /* Exemplos; alinhar ao esquema de tokens atual do repositório */
  --beme-bg: #fffcf9;
  --beme-surface: #ffffff;
  --beme-blush-50: #fff5f2;
  --beme-blush-100: #f8e1dd;
  --beme-rose: #cb8f98;
  --beme-sage: #a4af85;
  --beme-green: #4c7651;
  --beme-ink: #26382b;
  --beme-muted: #606c60;

  --beme-radius-control: 0.75rem;
  --beme-radius-card: 1.125rem;
  --beme-radius-editorial: 1.5rem;
  --beme-radius-pill: 9999px;

  --beme-shadow-soft: 0 4px 18px rgb(38 56 43 / 0.055);
  --beme-shadow-hover: 0 12px 30px rgb(38 56 43 / 0.095);
  --beme-shadow-floating: 0 14px 45px rgb(38 56 43 / 0.12);

  --beme-motion-fast: 150ms;
  --beme-motion-base: 280ms;
  --beme-motion-enter: 480ms;
  --beme-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Não hardcodar a paleta 50 vezes.** Evitar opacidades e cinzas diferentes sem intenção. Usar composição sem sacrificar contraste AA.

### 7.1 Soft Shadows — sombras suaves, seletivas e críveis

- Fundo dos cards de catálogo preferencialmente limpo; sombra **primariamente no hover** se fizer sentido.
- Dropdowns, popovers, menus, busca aberta e mini-carrinho/whatsapp flutuante (caso existam) podem usar a elevação maior.
- Evitar `box-shadow` intenso em fotos circulares: se preciso, usar sombra de **contato** quase imperceptível na imagem, não halo.
- Uma mesma categoria de componente deve usar a mesma elevação.
- Evitar multiplicar shadow + borda grossa + fundo colorido + escala no mesmo hover.

### 7.2 Layered Surfaces — profundidade com superfícies em camadas

- Alternar **três níveis** de superfície: base off-white, branco puro e blush muito claro; reservar verde-sálvia suave para destaques localizados ou uma faixa de comunicação.
- Não aplicar alternância automática de cor em toda seção: definir hierarquia por significado.
- Elevar cards de depoimentos com diferença mínima de fundo, borda sutil e sombra leve; não criar caixas pesadas.
- Uma ou duas seções editoriais podem usar bordas arredondadas maiores; grades de produto, raios moderados.
- Usar espaços de transição entre seções para criar ritmo, sem gaps gigantescos.

### 7.3 Consistent Radius — escala com personalidade

- Inputs/controles: cerca de 10–12px.
- Buttons/cards comuns: 12–18px.
- Banners editoriais: 20–28px, dependendo da largura.
- Categorias: **círculo puro 50%**, sem exceção.
- Chips e filtros: pill.
- A escala é **contextual**, não "colocar 20px em tudo". Cantos mais intensos onde a marca pede delicadeza, mais contidos em interfaces operacionais e de admin.

### 7.4 Ritmo e proporção

- Espaçamentos derivados de escala 4/8, gaps 16–32 em componentes, 64–112 entre seções desktop e redução proporcional em mobile.
- Definir `container max-width`, margens laterais fluidas, alinhamento dos títulos e comprimento de linha, evitando mudanças arbitrárias entre seções.
- Tipografia: títulos serifados com `line-height` editorial, descritivos sans-serif de alta legibilidade; usar `clamp()` e ajustar quebras de linha intencionais; evitar tamanhos mini no catálogo.
- Misturar variantes de CTA apenas quando for necessário diferenciar **primário, secundário e textual**, sem 10 estilos desconectados.

---

# PARTE C — MOTION DESIGN URGENTE, MAS ACESSÍVEL

## 8. Criar um sistema de movimento com propósito (MOTION FIRST, NOT MOTION EVERYWHERE)

O usuário considera este item **urgente**. Implementar um motion system coeso, sem virar um site publicitário de efeitos exagerados.

### Princípios obrigatórios

1. **Feedback:** responder imediatamente a clique, hover, foco, seleção e erro.
2. **Continuidade:** transições ajudam a entender mudança de estado e navegação.
3. **Hierarquia:** revelar conteúdos chave sem tirar controle da leitura.
4. **Marca:** curvas suaves, aceleração natural, sem bounce, elastic, neon, 3D, partículas ou cursor customizado.
5. **Acessibilidade:** `prefers-reduced-motion` não é ajuste posterior; implementar em cada componente animado e testar.
6. **Performance:** priorizar transform/opacity, limitar efeitos caros e não animar medidas que causem reflow.

### Tabela de comportamentos proposta

| Componente/estado  | Movimento                                                           | Intensidade sugerida | Observação                                                            |
| ------------------ | ------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------- |
| CTA principal      | transição de cor + seta 2–4px                                       | 150–250ms            | Feedback instantâneo; não deslocar o botão inteiro de maneira brusca. |
| Card de produto    | imagem `scale(1.025–1.04)` dentro do frame; leve elevação de sombra | 220–350ms            | Card não pode "pular" no layout.                                      |
| Categoria circular | zoom contido no círculo + mudança sutil no título                   | 260–380ms            | Sem seta.                                                             |
| Link navbar        | underline discreto / color                                          | 150–220ms            | Respeitar gradient scrim e contraste do hero.                         |
| Dropdown/filtro    | fade + translateY 4–8px                                             | 170–250ms            | Fechar mais rápido que abrir; foco e escape funcionais.               |
| Feedback de filtro | chip ativo + transição de estado                                    | 120–220ms            | Não bloquear a grade aguardando animação.                             |
| Toast/sucesso      | entrada curta sem grande deslocamento                               | 160–250ms            | Mensagem legível sem desaparecer antes de ser lida.                   |
| Banner editorial   | um reveal focal curto                                               | 400–550ms            | Um por bloco, não palavra por palavra.                                |
| Depoimentos        | reveal da grade ou card destacado                                   | 400–500ms            | Evitar carrossel auto-play agressivo.                                 |
| Skeleton           | shimmer muito sutil OU pulso lento                                  | 800–1500ms           | Reduced motion: skeleton estático; evitar áreas de brilho piscante.   |

### 8.1 Scroll Reveal

- Aplicar **seletivamente** em títulos de seções, blocos editoriais e grupos de cards; não em todos os parágrafos ou botões individualmente.
- Inicial sugerido: `opacity: 0 → 1`, `translateY(10–20px) → 0`, 400–550ms com easing premium.
- Ativar quando o elemento entra na viewport, com threshold/margin apropriados para não esconder conteúdo fora de vista.
- Preferir execução **uma vez** por visita/scroll, sem repetir quando o usuário sobe e desce, exceto quando a interação requer.
- **Critical:** conteúdo deve permanecer visível caso JavaScript falhe ou haja navegação por teclado. Não inicializar toda página em `opacity: 0` sem recuperação.
- Se usuário estiver com reduced motion, revelar sem deslocamento (ou sem animação).

### 8.2 Stagger Animation

- Aplicar somente a **grupos semânticos de irmãos** como os quatro cards de categoria ou primeira fileira de destaques.
- Defasagem inicial ~45–75ms por card; limitar o tempo acumulado total a ~250–350ms.
- Não aplicar stagger longo a uma grade de dezenas de produtos; usuários não devem esperar pela animação para poder comprar.
- Ao filtrar/ordenar, priorizar resposta rápida e evitar reaparecimento coreografado de toda a grade.

### 8.3 Image Zoom on Hover e troca de imagem

- Já existe zoom em alguns pontos? Inspecionar. Consolidar intensidade/easing e garantir comportamento uniforme.
- Escala moderada e `overflow: hidden`. Não aumentar textura/foto até ficar borrada.
- Se produto tiver uma segunda imagem verdadeira, permitir `hover image swap` com crossfade; **não trocar para outra imagem genérica**.
- Em touch, não simular hover; imagem principal deve ser suficiente.

### 8.4 Magnetic-feel Buttons, sem magnetismo literal agressivo

- O sentimento de botão responsivo vem de **feedback tátil visual**, não de perseguir o cursor.
- Aplicar mudança de fundo, ícone deslizante e `active: scale(.985–.995)` ou resposta discreta equivalente.
- Evitar deslocar área clicável sob o mouse (especialmente em mobile, foco e usuários com tremor).
- Garantir foco `:focus-visible` e boa diferença entre hover, pressed, disabled e loading.
- Botões que navegam devem ser `<a>`; botões de ação devem ser `<button>`.

### 8.5 Accessible Motion — IMPLEMENTAÇÃO CRÍTICA

- Toda animação precisa de alternativa sob `@media (prefers-reduced-motion: reduce)` ou mecanismo equivalente da stack.
- Remover/desacelerar grandes deslocamentos, parallax e zoom; preservar **feedback de estado** por cor, opacidade ou ícone.
- Não implementar redução global cega em `animation-duration: .01ms` como único mecanismo se isso destruir estados ou deixar elementos invisíveis.
- Testar com preferência reduzida ativada no navegador.
- Nenhuma transição essencial deve depender de esperar animação para disponibilizar a informação.
- Pausar/remover efeitos contínuos fora da viewport. Evitar qualquer animação permanente que distraia da compra.
- Utilizar IntersectionObserver/CSS nativo adequadamente, desconectar observers/cleanup e prevenir hydration mismatch.

---

# PARTE D — EXPERIÊNCIA DE COMPRA E CONFIANÇA

## 9. Product Cards: de placeholders estáticos a componentes premium

A página tem fotos retangulares, badges, nome e preço. Isso já é boa estrutura; faltam qualidade dos dados, hierarquia e estados de interação.

### Requisitos

- Fotografias coerentes e padronizadas, com escala visual semelhante e contraste adequado entre produtos e fundo.
- Ajustar `border-radius` do frame, clipping e `aspect-ratio`; usar o mesmo padrão em destaques e catálogo, salvo variante editorial deliberada.
- Título do produto com boa altura de linha, sem truncar informação decisiva em desktop/mobile. Se precisar truncar, permitir acesso completo por detalhe/link ou tooltips acessíveis.
- Categoria em texto discreto, preço claramente visível, preço anterior com tachado **somente quando válido**.
- Badge discreto e sem competição visual; consolidar nomenclaturas `Destaque`, `Novo`, `Oferta` conforme significado real.
- Hover: imagem cresce pouco; sombra e border ajustam discretamente; CTA de "Ver detalhes" ou "Consultar" aparece de maneira acessível **sem se tornar inacessível para touch/teclado**.
- Área clicável evidente; não usar dois destinos conflitantes para o mesmo card.
- Se estoque/status existirem, representar disponibilidade de maneira honesta; nunca exibir produto indisponível como comprável sem aviso.
- Reutilizar o mesmo componente entre _Destaques_ e _Catálogo_, com variantes pequenas e justificadas.
- Não acrescentar favoritos/carrinho só por estética se não houver funcionalidade real.

## 10. Catálogo e filtros: Progressive Disclosure

**Snapshot página 4:** chips de categoria, busca, disponibilidade, ordenação e contagem. É um bom começo, mas o bloco funcional pode parecer rígido e técnico.

- Desktop: organizar chips e busca/filtros em uma faixa de ferramentas clara, com hierarquia consistente e pequenos separadores apenas se úteis.
- Mobile: manter busca acessível e abrir filtros adicionais em drawer/sheet **se a quantidade de controles justificar**, preservando chip de categoria ou indicador do filtro ativo.
- Mostrar quantos filtros estão ativos, permitir "Limpar filtros" somente quando houver filtros aplicados.
- Ao aplicar filtro: atualização imediata da contagem, estado de loading adequado caso assíncrono, URL/query params preservados quando houver navegação compartilhável.
- Diferenciar claramente estados: sem resultados, carregando, erro de rede, categoria vazia, produtos indisponíveis.
- **Progressive disclosure:** informações secundárias (especificação, composição, modo de uso, política) devem aparecer na página detalhada/accordion, não entupir o card.
- Não esconder ações principais atrás de hover, só atrás de um clique se isso melhora a legibilidade mobile.
- Evitar "Mais recentes" se não houver data de cadastro/ordenação real.

## 11. Microcopy: falar como boutique, não como template

Revisar tom de voz e clareza com base na **função real**. Preservar o que funciona; mudar somente o necessário.

Exemplos de revisão **sujeitos a validação da loja**:

| Atual/estilo                                     | Oportunidade                                             | Condição                                                         |
| ------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------- |
| "Conhecer produtos"                              | "Explorar a seleção"                                     | Se levar a uma coleção/curadoria real.                           |
| "Nossa seleção" / "Seleção da loja" / "Destaque" | Diferenciar curadoria, promoções e novidades             | Não repetir badges vagos em cada card.                           |
| "Produtos multifuncionais desenvolvidos..."      | "Uma seleção de produtos para valorizar a sua beleza..." | Se a loja for revendedora; não declarar fabricação própria.      |
| "Frete facilitado"                               | Explicar regra verdadeira de entrega                     | Não dizer "grátis", "todo o Brasil" ou "rápido" sem confirmação. |
| "Pagamento flexível"                             | Explicar Pix/parcelamento real                           | Somente se realmente disponível.                                 |
| Botão de produto                                 | "Ver detalhes" ou "Pedir pelo WhatsApp"                  | Conforme o comportamento implementado.                           |

Exigir consistência ortográfica/diacríticos, concordância, textos de validação de formulários e estados vazios. Não colocar frases genéricas tipo "transforme sua jornada".

## 12. Perceived Performance e Skeleton Loading

O site deve parecer rápido e responder de forma elegante.

### Implementação obrigatória onde houver carregamento assíncrono REAL

- Skeleton de card que reproduz **geometria final**: foto, título e preço, evitando layout shift.
- Skeleton de detalhes de produto, se essa rota carrega dados remotamente.
- Em filtros, preferir preservar o grid existente até a nova resposta chegar, com sinal claro de atualização; skeleton se o tempo de espera justificar.
- Não inserir skeleton artificial em dados síncronos ou instantâneos apenas para "dar vida".
- Exibir estado de erro, tentar novamente quando aplicável e não deixar spinner eterno.
- Configurar dimensões e aspect ratios antecipadamente.
- Priorizar imagem do hero e LCP; carregar abaixo da dobra de forma lazy; responsividade `srcset/sizes`/otimizador da stack.
- Auditar qualidade WebP/AVIF, compressão, DPI/resolução visível, orientação e crop. **Mais pixels sem necessidade não é otimização.**
- Evitar fontes mudando layout; ajustar preloads/`font-display` conforme necessidade.
- Usar somente animações leves que não prejudiquem interação/scroll.

### Metas orientativas, validar em ambiente real

- LCP ≤ 2,5s em condições de referência quando viável.
- CLS ≤ 0,1.
- INP ≤ 200ms.
- Alvos de Lighthouse: Performance/A11y/Best Practices/SEO ≥ 90 **como referência, não prometer sem medição**.
- Registrar números **antes e depois** do trabalho, sempre indicando ambiente, conexão e viewport; se não puder medir, declarar a impossibilidade.

## 13. Navbar integrada ao hero (APENAS POLIR, NÃO DIVIDIR)

- Inspecionar a implementação real do gradient scrim no browser; ele já existe e pode não aparecer no PDF.
- Preservar transparência/integridade da imagem atrás dos links no início da página.
- Melhorar se necessário contraste da logo, navegação e ícones; gradiente superior sutil sem faixa visível nem blur pesado.
- Focus ring e estados de hover dos links.
- Sticky: preservar o comportamento atual; se já houver mudança de fundo no scroll, garantir transição natural e contraste correto. Não inventar sticky se não existir necessidade.
- Validação desktop, mobile, zoom 200% e menu aberto.
- Não aumentar desnecessariamente altura, não separar em card opaco, não adicionar glassmorphism intenso.

## 14. Banner-2, Sobre nós e seções editoriais

- Banner-2: conteúdo e layout especificados na seção 4, com uma única revelação focal.
- Sobre nós: avaliar se a foto usada comunica a Bem Me Quero ou uma marca alheia. Se houver assets reais da loja, preferi-los; sem asset novo, não substituir por ilustração inventada.
- Ajustar comprimento das linhas, espaços entre texto/CTA e alinhamento com eixo editorial.
- Alternância de painéis e superfícies para quebrar monotonia, sem borda/sombra em excesso.
- Evitar que duas seções editoriais consecutivas tenham exatamente a mesma proporção, peso e motion, **sem alterar a ordem da página**.

## 15. Depoimentos: confiança antes da decoração

O PDF (página 6) mostra três depoimentos com aspas, texto e nomes em colunas, praticamente sem superfície diferenciada.

- **Primeiro verificar se são reais/autorizados.** Não publicar depoimentos inventados. Se forem placeholders, substituí-los por estado apropriado ou ocultar a seção conforme decisão do conteúdo; não inventar novos.
- Refinar os cards: fundo muito levemente contrastante, padding generoso, raio 16–20px e borda ou sombra mínima, sem parecer painel corporativo.
- Destacar uma frase-chave se existir autorização para editar conteúdo; preservar o sentido original.
- Nome real, identificação e origem conforme consentimento; não adicionar estrelinhas ou nota "5/5" sem avaliação real.
- Grid de 3 desktop, 1 no mobile, ou carrossel manual **apenas se realmente melhorar o espaço**; sem autoplay forçado.
- Reveal do bloco, hover mínimo, foco/navegação corretos.

## 16. Benefícios e rodapé: fechamento com mais presença

O PDF (página 7) mostra três benefícios: **Frete facilitado**, **Atendimento com carinho**, **Pagamento flexível**; e colunas de footer com alguns links repetidos.

### Benefícios

- Criar uma faixa de reassurance/benefits com superfície destacada (off-white/blush/sage bem suave), ícones de uma única família e espaçamento uniforme.
- Cada benefício: ícone, título curto, frase precisa. No mobile empilhar naturalmente.
- Não exagerar na iconografia nem usar 3 cartões gigantes para uma informação simples.
- Confirmar regras comerciais antes de publicar a copy.

### Footer

- Revisar links duplicados e agrupá-los com nomes objetivos (Explorar, Atendimento, Redes sociais/Informações quando de fato houver destinos).
- Adicionar acessibilidade a ícones Instagram/WhatsApp, links externos com segurança apropriada e destinos corretos.
- Logo adequada à superfície do footer; contraste dos links, copyright e copy institucional.
- Dar ao footer um fim visual claro com espaçamento, superfície própria e hierarquia, sem virar um bloco pesado.

## 17. Admin: consistência e integridade dos dados

Sem screenshots do `/admin`, **não alegar defeitos visuais específicos desse painel**. Inspecionar a rota/código se estiver no escopo.

- Garantir que categorias, imagens, badges e preços sejam gerenciados por dados consistentes; imagens não devem quebrar em vitrine.
- Formulários com label, help, preview, validação e estados loading/success/error.
- Upload de imagem com proporção recomendada, aviso de tamanho e preview antes de salvar; respeitar mecanismo de storage real.
- Status de publicação, visibilidade e campos opcionais claros.
- Admin visualmente mais utilitário que a landing, com marca aplicada discretamente.
- Não abrir mudanças de schema/backend amplas se não forem necessárias para resolver um defeito de UI/UX.

---

# PARTE E — EXECUÇÃO TÉCNICA, QUALIDADE E CONTROLE DE ESCOPO

## 18. Auditoria real no navegador: obrigatório antes e depois

1. Inspecionar repositório: stack, CSS framework, roteamento, componentes, imagens, fontes, data source, status do admin, dependências de animação e testes.
2. Executar app local quando possível e utilizar a skill `agent-browser` (ou ferramenta de navegador configurada) para observar **comportamento real**.
3. Registrar baseline de screenshots em **desktop 1440×900**, **tablet 768×1024** e **mobile 390×844**, ajustando por devices disponíveis.
4. Navegar pelas âncoras/navbar e testar categorias, produto, filtros, busca, links CTA, hover, focus, reduced motion e carga lenta simulada se a ferramenta permitir.
5. Verificar console e rede, status HTTP das imagens, warnings, hydration, overflow e anchors.
6. Depois das alterações, refazer screenshots **nas mesmas dimensões** e comparar visualmente. Uma rodada batelada de revisão e uma confirmação de correção são suficientes, sem ciclos infinitos.
7. Se localhost não for acessível, usar screenshots/fixtures e inspeção estática do repositório; registrar limitações honestamente.

### Checklist detalhado por breakpoint

**Desktop:** hero+navbar, categorias redondas, badges, grid 4 colunas, popovers, sobreposições, tipografia, footer.

**Tablet:** grade/categories sem compressão, filtros distribuídos, banner 2 crop, legibilidade e navegação sem colisão.

**Mobile:** menu, hero texto/foto, grid de categorias 2×2, cards 2 colunas quando viável ou 1 conforme legibilidade real, CTA touch, filtros em sheet se necessário, banner empilhado, acessibilidade de depoimentos, footer.

**Estados especiais:** teclado, zoom 200%, `prefers-reduced-motion: reduce`, imagens lentas, dados vazios, erro de API/storage, filtros sem resultados, categoria sem produtos.

---

## 19. Acessibilidade, semântica e segurança visual

- Preferir WCAG 2.2 AA como referência de acessibilidade aplicável.
- Contraste de texto comum ≥ 4,5:1; grande ≥ 3:1 quando cabível; ícones/interativos com contraste suficiente.
- Áreas interativas com dimensão confortável (preferencialmente ~44×44 CSS px quando possível), sem sobreposição de hit areas.
- Hierarquia H1/H2/H3 correta; links vs botões conforme função.
- Labels e mensagens acessíveis em filtros, busca, seleção e formulários.
- Foco visível em todos os itens clicáveis, inclusive card circular, card produto, botão CTA e redes sociais.
- No conteúdo de imagens: `alt` significativo quando imagem comunica produto; `alt=""` quando puramente decorativa.
- Sem dependência exclusiva de cor para indicar status ou seleção.
- Escape/close em menu/popover, gerenciamento de foco adequado; não introduzir trap.
- Reduced motion obrigatório; testar explicitamente.
- Evitar efeitos flash, rolagem forçada, scroll hijacking, animações infinitas e autocarrosséis intrusivos.

## 20. Performance e arquitetura

- Descobrir qual framework é usado **antes** de prescrever solução.
- Se for Next.js: checar estratégia de imagens, `next/image`, preload/prioridade para LCP e `sizes` corretos; se outra stack, adotar equivalente.
- Evitar pacotes para algo realizável com CSS e IntersectionObserver.
- Se já usar Motion/Framer Motion, reutilizar sem importar a biblioteca inteira desnecessariamente; garantir cleanup, SSR e reduced motion.
- Evitar animações que forcem layout e `will-change` permanente em toda grade.
- Reservar espaço de imagens e cards para prevenir CLS.
- Quando existirem dados remotos, abort/cancel de requests em mudanças rápidas de busca/filtro, estados race-safe e mensagens consistentes.
- Aplicar mudanças como componentes reutilizáveis, não copiar CSS manualmente em cada página.
- Não otimizar números fictícios. Capturar medição real.

## 21. Ordem de implementação e checkpoints

### ETAPA 0 — Diagnóstico e baseline (obrigatória)

- Descobrir stack, scripts e componentes.
- Inspecionar o PDF, observar a app no navegador, classificar certeza de cada observação.
- Listar arquivos prováveis a alterar e risco de regressão.
- Identificar skills disponíveis e plano de uso efetivo.

**Saída curta:** sumário da auditoria com 5 principais achados e plano em etapas. Continuar imediatamente para a implementação.

### ETAPA 1 — P0: correções visuais já decididas

1. **Restaurar categorias redondas e remover descrição/seta individual.**
2. **Trocar a foto do banner editorial por `assets/sessions/banner-2.png`.**
3. Corrigir links, overflow, acessibilidade e enquadramento decorrentes dessas mudanças.
4. Testar desktop e mobile; gerar screenshot comparativa.

### ETAPA 2 — P1: confiança e design system

1. Corrigir imagens de produto não correspondentes ou marcar dados pendentes honestamente.
2. Consolidar tokens de sombras, superfícies, raios, espaçamento, fontes.
3. Refinar cards, CTAs, filtros, estados de foco e seções de conteúdo.
4. Melhorar depoimentos, benefícios e footer sem inventar fatos.

### ETAPA 3 — P1: motion e interação (urgente)

1. Implementar sistema global de duração/easing, sem duplicar lógicas.
2. Scroll reveal seletivo + stagger leve em categorias/destaques.
3. Hover image zoom consistente, botão responsivo e dropdown/filter transitions.
4. Implementar **reduced motion intencional em todos os novos efeitos**.
5. Verificar que motion não interfere com desempenho, foco ou legibilidade.

### ETAPA 4 — P1/P2: perceived performance e estados

1. Skeletons apenas onde há carregamento real.
2. Estados de vazio/erro/busca/feedback.
3. Otimização de imagens e fontes; evitar layout shift.
4. Testes com rede lenta, mobile e teclado; perf audit.

### ETAPA 5 — Verificação e fechamento

- Testes/build/lint/typecheck disponíveis.
- Comparar screenshots; revisar acessibilidade, responsividade e performance.
- Revisão de diff e remoção de CSS morto, hacks e dependências desnecessárias.
- Documentar tokens de design/motion, decisões, pendências honestas e evidências de teste.

> **Não parar na primeira etapa nem apenas propor as demais.** Implementar todas as melhorias viáveis que forem compatíveis com o repositório, organizadas em commits/fatias lógicas. Se alguma depender de fotos reais ou informação comercial que não existe, registrar a pendência sem inventar o dado.

---

## 22. Matriz de prioridade e relação impacto × esforço

| Iniciativa                         | Prioridade        | Por quê                          | Resultado de aceite                                   |
| ---------------------------------- | ----------------- | -------------------------------- | ----------------------------------------------------- |
| Categorias circulares, apenas nome | **P0 / Primeiro** | Decisão aprovada regrediu        | 4 círculos + título, sem descrições/setas             |
| `banner-2.png` no editorial        | **P0 / Segundo**  | Asset novo já entregue           | Foto correta, bom enquadramento e CTA                 |
| Fotos corretas por produto         | **P0/P1**         | Credibilidade comercial          | Sem item representado por produto errado              |
| Accessible Motion                  | **P1 / Urgente**  | Movimento sem exclusão           | Reduced motion e teclado testados                     |
| Scroll reveal seletivo             | **P1 / Urgente**  | Site estático                    | Reveals suaves, uma vez, sem esconder conteúdo        |
| Hover cards / CTA feedback         | **P1 / Urgente**  | Experiência sem resposta visual  | Hovers consistentes e touch-friendly                  |
| Consistent Radius / Shadows        | **P1**            | Aparência pouco refinada         | Tokens compartilhados e hierarquia de elevação        |
| Layered Surfaces                   | **P1**            | Seções muito parecidas           | Ritmo cromático com contraste claro                   |
| Stagger curto                      | **P1/P2**         | Ritmo na primeira visita         | Categorias/destaques com entrada curta                |
| Skeleton / loading                 | **P1**            | Feedback de espera               | Skeleton real, dimensões estáveis                     |
| Progressive disclosure             | **P1**            | Sobrecarga/filtros               | Mobile funcional, informações secundárias sob demanda |
| Microcopy/comercial                | **P1**            | Confiança                        | Copy precisa e sem alegações inventadas               |
| Depoimentos/benefícios/footer      | **P2**            | Fechamento tímido                | Componentes organizados e confiáveis                  |
| Animações especiais opcionais      | **P3**            | Só se tiver benefício comprovado | Nada ornamental sem propósito                         |

---

## 23. Critérios de aceitação globais — não considerar concluído sem conferir

### Conteúdo e fidelidade

- [ ] Categorias **circulares**, sem descrições individuais e sem setas.
- [ ] `banner-2.png` exibido no banner editorial correto.
- [ ] Nenhum produto tem foto de outro SKU sem estar declarado como placeholder.
- [ ] Nenhuma avaliação, promoção, condição de frete ou pagamento foi inventada.
- [ ] Navbar continua **integrada ao hero**, sem faixa opaca no estado inicial.

### Visual / interação

- [ ] Soft shadows coerentes em elementos elevados, sem excesso.
- [ ] Layered surfaces com ritmo claro entre seções, sem poluição visual.
- [ ] Radius consistente com variação contextual (círculos, botões, cards, editoriais).
- [ ] Hover de cards e CTA mais responsivos; links e foco visualmente óbvios.
- [ ] Scroll reveal deliberado e stagger curto em grupos limitados.
- [ ] Depoimentos, benefícios e footer refinados sem parecer template.

### UX / acessibilidade

- [ ] `prefers-reduced-motion` implementado e testado.
- [ ] Teclado, foco, navegação e contraste validados.
- [ ] Estados loading, empty, error e feedback em fluxos realmente assíncronos.
- [ ] Sem scroll horizontal, recortes ruins ou alvos de toque muito pequenos.
- [ ] Busca/filtros funcionam sem flash, perda de estado ou informações inconsistentes.

### Performance / processo

- [ ] Imagens dimensionadas, LCP e CLS avaliados, sem comprometer definição.
- [ ] Sem pacotes redundantes ou efeitos pesados não justificados.
- [ ] Build/lint/typecheck/testes executados conforme scripts disponíveis.
- [ ] Inspeção real em desktop, tablet e mobile, não apenas PDF.
- [ ] Diff revisado; comportamento preexistente preservado.
- [ ] Mudanças documentadas e pendências explicitadas.

---

## 24. Formato OBRIGATÓRIO de entrega do agente

Ao concluir, apresentar:

1. **Resumo executivo** (melhorias implementadas, com ênfase nas duas primeiras correções obrigatórias).
2. **Auditoria inicial e diagnóstico confirmado** — evidências de PDF vs navegador vs código.
3. **Alterações por seção** — categorias, banner-2, cards, catálogo, depoimentos, benefícios, footer, responsividade.
4. **Motion system** — lista concreta de animações, durações e quais componentes usam; confirmação do reduced motion.
5. **Performance e acessibilidade** — medições/testes executados e resultados reais (não inventar números).
6. **Skills utilizadas** — nome + tarefa executada + benefício; listar indisponíveis separadamente, sem fingir uso.
7. **Arquivos alterados** e justificativa curta.
8. **Screenshots de antes/depois** em resoluções equivalentes, quando possível.
9. **Pendências reais** — fotos de produto ausentes, claims não verificados, testes não realizados por limitação técnica.
10. **Próximas prioridades** — somente pendências que exigem dados ou aprovação da loja, não coisas que o agente já poderia ter implementado.

**Sinal de qualidade:** a Bem Me Quero deve continuar suave, feminina e minimalista quando está parada, mas ganhar **vida e profundidade** ao ser utilizada. A interface deve demonstrar o rigor de uma loja profissional de cosméticos: fotografia correta, hierarquia clara, movimento discreto, feedback imediato, acessibilidade e boa performance. **Não confundir premium com sombra excessiva, glassmorphism pesado, animação permanente ou componentes ornamentais.**

**Agora execute o plano no repositório real. Comece pelas categorias redondas e pelo `banner-2.png`, depois avance nas etapas P1, testando após cada fatia e preservando a identidade aprovada.**
