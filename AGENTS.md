# AGENTS.md — Bem Me Quero

> Instruções permanentes para assistentes de código que atuam neste repositório.
> Aplicam-se a planejamento, implementação, revisão, testes, documentação e manutenção.
> **Idioma:** comunicar-se com o usuário em português do Brasil; preferir inglês para identificadores de código, nomes de arquivos técnicos, tipos e comentários que precisem ser compartilhados entre desenvolvedores.

## 1. Missão e Contexto da Aplicação

O **Bem Me Quero** é uma plataforma e-commerce / catálogo digital de produtos de beleza, maquiagem e cosméticos (_"Realce o que faz você ser você"_). A aplicação conecta os clientes aos produtos com um visual editorial acolhedor, sofisticado e intuitivo, facilitando a navegação por categorias, detalhes do produto, seleção de variantes e conversão via WhatsApp ou atendimento personalizado.

A arquitetura é construída inteiramente sobre **Next.js (App Router, React 19, Server Components)** com **Tailwind CSS v4** e **TypeScript estrito**, operando de forma autônoma, leve e de alta performance.

**Diretrizes de interface e conteúdo (mandato de GEMINI.md):**

- **Interface e Conteúdo:** Não adicionar textos inúteis, óbvios ou prolixos que não agregam em nada. O aplicativo tem que ser direto, limpo e intuitivo por design, sem parágrafos autoexplicativos ou mensagens decorativas desnecessárias.
- **Identidade Visual:** Paleta suave e acolhedora (`#f8e1dd`, `#596a49`, etc.), tipografia com toque editorial (Cormorant Garamond + DM Sans), foco na fotografia dos produtos e clareza de preços, disponibilidade e variantes.
- **Experiência do Usuário:** Carregamento ultra-rápido, visual mobile-first e desktop impecável, imagens otimizadas com `next/image` e rotas semânticas (`/`, `/produtos`, `/produto/[slug]`).

## 2. Regra universal: pnpm é obrigatório

**USE SEMPRE `pnpm` para gerenciar dependências e executar scripts do projeto. Sem exceções silenciosas.**

- Instalar dependências existentes: `pnpm install` (preferir `pnpm install --frozen-lockfile` em CI).
- Adicionar dependência de runtime: `pnpm add <package>`.
- Adicionar dependência de desenvolvimento: `pnpm add -D <package>`.
- Remover dependência: `pnpm remove <package>`.
- Atualizar dependências: `pnpm update <package>` (justificar mudanças relevantes).
- Executar scripts: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm format` **somente se o script existir no package.json**.
- Executar binários locais: `pnpm exec <binary>`; executores temporários quando necessários e autorizados: `pnpm dlx <package>`.
- Ferramentas que instruem rodar `npx` devem ser adaptadas para `pnpm dlx` ou `pnpm exec`, conforme o caso.

**Proibido:** usar `npm`, `npx`, `yarn` ou `bun` para instalar, remover ou atualizar dependências ou executar comandos equivalentes do projeto; gerar ou manter `package-lock.json`, `yarn.lock` ou `bun.lock*`; alterar o gerenciador por conveniência. Lockfile canônico: `pnpm-lock.yaml`.

## 3. Regra universal: utilizar as skills disponíveis

As skills disponibilizadas pelo usuário fazem parte do fluxo de trabalho. **O agente deve descobrir, consultar e aplicar as skills relevantes antes de executar uma tarefa**, não apenas citá-las na resposta.

### Protocolo obrigatório de skills

1. **No início da sessão ou ao mudar de tipo de trabalho**, procurar e ler a skill `using-agent-skills` (se instalada), seguindo seu método de descoberta e invocação. Para organizar contexto, usar `context-engineering` quando pertinente.
2. Antes de cada tarefa, identificar quais skills da matriz abaixo são relevantes. Localizar a instrução real da skill (`SKILL.md` ou interface disponibilizada pelo ambiente), **ler o conteúdo** e executar seu workflow quando viável.
3. Priorizar skills especializadas em vez de inventar processos paralelos. Combinar apenas as necessárias; não disparar todas em toda mudança.
4. Skills são **orientações de execução**, não autorização para expandir escopo, modificar arquivos fora do pedido, transmitir dados ou instalar ferramentas desnecessárias.
5. Se uma skill não estiver instalada, não puder ser lida ou exigir integração indisponível, **não simular sua execução**: registrar a limitação brevemente e aplicar o processo equivalente disponível.
6. Ao concluir uma tarefa de implementação, mencionar sucintamente **quais skills efetivamente foram utilizadas**, o que foi testado e o que ficou pendente. Nunca alegar testes, leituras ou verificações que não ocorreram.

### Matriz de roteamento (skills fornecidas para o contexto Bem Me Quero)

| Contexto / gatilho                                                                                            | Skills prioritárias                                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Início de sessão, regras, contexto da loja e escopo                                                           | `using-agent-skills`, `context-engineering`, `spec-driven-development` quando faltar especificação                                |
| Quebrar demandas do e-commerce em tarefas e entregas incrementais                                             | `planning-and-task-breakdown`, `incremental-implementation`                                                                       |
| Design de vitrine, banners, cards de produto, layout editorial de beleza e estética anti-slop                 | `frontend-design`, `design-taste-frontend`, `frontend-ui-engineering`, `ui-taste`                                                 |
| Componentes da loja, microinterações, responsividade e acessibilidade (WCAG)                                  | `frontend-ui-engineering`, `web-design-guidelines`, `apple-design` para interações/gestos táteis fluidos, `shadcn` quando adotado |
| Implementar/otimizar React 19 e Next.js App Router (Server Components, SSG, Static Params, Client boundaries) | `vercel-react-best-practices`, `source-driven-development`                                                                        |
| Modelagem de catálogo, tipos de produto, variantes e contratos de dados (`src/lib/store-data.ts`)             | `api-and-interface-design`, `domain-modeling`, `codebase-design`                                                                  |
| Alterações de regras de negócio da loja (cálculos de preço, filtros, busca, variantes, carrinho, WhatsApp)    | `test-driven-development` (ou `tdd`), `debugging-and-error-recovery`, `diagnosing-bugs`                                           |
| Testes visuais em navegador real, responsividade mobile/desktop e fluxo de compra/navegação                   | `agent-browser`; `browser-testing-with-devtools` quando o MCP correspondente estiver ativo                                        |
| Otimização de Web Vitals, LCP de imagens (`next/image`), carregamento instantâneo e bundle Next.js            | `performance-optimization`, `vercel-react-best-practices`                                                                         |
| Segurança de formulários, inputs de usuário, sanitização de dados e URLs externas                             | `security-and-hardening`, `security-audit`                                                                                        |
| Revisão de código, qualidade, simplificação e refatoração                                                     | `code-review-and-quality`, `code-review` quando houver diff/base, `code-simplification` quando apropriado                         |
| Commits, branches e versionamento                                                                             | `git-workflow-and-versioning`                                                                                                     |
| Decisões arquiteturais, ADRs e documentação                                                                   | `documentation-and-adrs`, `domain-modeling`                                                                                       |
| CI/CD, esteira de deploy, qualidade e pré-lançamento                                                          | `ci-cd-and-automation`, `constraint-driven-development`, `shipping-and-launch`                                                    |
| Hipóteses de UX/UI ou ideias de novas seções/features da loja                                                 | `doubt-driven-development`, `prototype`, `idea-refine`, `interview-me`                                                            |

## 4. Stack e Arquitetura da Loja

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript estrito.
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/postcss`, importado via `@import "tailwindcss"` em `src/app/styles.css`) + Lucide React para ícones.
- **Tipagem:** TypeScript em modo estrito.
- **Imagens:** `next/image` nativo configurado para otimização automática no `next.config.ts`.
- **Camada de Dados:** Módulo desacoplado em `src/lib/store-data.ts` com funções tipadas assíncronas (`getProducts`, `getCategories`, `getProductBySlug`, `getBanners`, `getTestimonials`, `getStoreSettings`).

### Estrutura de Diretórios e Módulos

- `src/app/`: Rotas canônicas do Next.js App Router:
  - `src/app/layout.tsx`: Root Layout com fontes Google (DM Sans e Cormorant Garamond), Header e Footer.
  - `src/app/page.tsx`: Página inicial (Hero, Categorias, Mais Vendidos, Campanha, Explorer, Institucional, Depoimentos e Benefícios).
  - `src/app/produtos/page.tsx`: Catálogo completo com filtros interativos.
  - `src/app/produto/[slug]/page.tsx`: Detalhe do produto com galeria de fotos, variantes, conversão via WhatsApp e produtos relacionados.
  - `src/app/not-found.tsx`: Página 404 personalizada e elegante.
  - `src/app/styles.css`: Estilos globais e tokens Tailwind v4.
- `src/components/`: Componentes modulares da interface (`ProductCard`, `ProductExplorer`, `BannerSection`, `BrandMark`, `StoreHeader`, `StoreFooter`).
- `src/lib/`: Dados e utilitários da loja (`store-data.ts`).
- `public/`: Assets estáticos (`favicon.svg`, etc.).

## 5. Padrões de Interface e Código

- **Padronização e Reutilização Global (Mandatório):** Se uma feature — seja de função/lógica (helpers, formatação, validação, hooks) ou de estilização UI/UX (botões, cards, badges, modais, formulários, tipografia) — for implementada ou alterada e for utilizada mais de uma vez (irá aparecer mais de uma vez no site), ela **DEVE** ser criada de forma global e reutilizável (em `src/components/`, `src/lib/` ou tokens em `src/app/styles.css`). É proibido duplicar lógica ou aplicar estilos pontuais/isolados que causem fragmentação. Toda alteração em elementos recorrentes deve ser centralizada para manter a aplicação 100% padronizada e consistente.
- **Direto e objetivo:** Seguir à risca o `GEMINI.md`: interface limpa, sem textos óbvios, prolixos ou autoexplicativos. Botões claros, títulos expressivos e descrições úteis de produtos.
- **TypeScript Estrito:** Proibido o uso de `any`, `@ts-ignore` ou `eslint-disable` sem autorização/justificativa.
- **Tailwind CSS v4:** Usar classes utilitárias de Tailwind nos componentes JSX.
- **Acessibilidade e Usabilidade:** Foco visível em elementos interativos, contraste de texto sobre fundos de cor clara, navegação funcional por teclado e suporte a leitores de tela.
- **Links de WhatsApp:** Utilizar codificação correta de URL (`encodeURIComponent`) e formato internacional sem caracteres especiais para acionamento direto do app.

## 6. Fluxo de Trabalho Obrigatório por Tarefa

### Antes de codificar

1. Ler a solicitação do usuário, este `AGENTS.md` e o `GEMINI.md`.
2. Descobrir e ler as skills pertinentes na matriz de roteamento (seção 3).
3. Inspecionar `package.json` e arquivos afetados antes de alterar código.

### Durante a implementação

1. Fazer mudanças cirúrgicas e consistentes com o padrão existente.
2. Usar exclusivamente `pnpm` para dependências ou scripts.
3. Se envolver lógica de negócio, validar com testes ou reprodução controlada.

### Ao concluir

1. Executar os scripts de verificação disponíveis via `pnpm` (ex: `pnpm build`, `pnpm format`).
2. Verificar no navegador real via `agent-browser` para mudanças visuais e de interação na loja.
3. Responder em pt-BR com: **o que mudou**, **skills efetivamente utilizadas**, **comandos/testes executados**, **resultado** e **eventuais pendências**.

---

**Resumo operacional para o agente:** descubra e aplique as skills relevantes, **use sempre pnpm**, mantenha a interface da Bem Me Quero direta, limpa e elegante, e garanta a autonomia e performance nativa do Next.js.
