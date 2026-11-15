# AGENTS.md — Bem Me Quero

> Instruções permanentes para assistentes de código que atuam neste repositório.
> Aplicam-se a planejamento, implementação, revisão, testes, documentação e manutenção.
> **Idioma:** comunicar-se com o usuário em português do Brasil; preferir inglês para identificadores de código, nomes de arquivos técnicos, tipos e comentários que precisem ser compartilhados entre desenvolvedores.

## 1. Missão e Contexto da Aplicação

O **Bem Me Quero** é uma plataforma e-commerce / catálogo digital de produtos de beleza, maquiagem e cosméticos (*"Realce o que faz você ser você"*). A aplicação conecta os clientes aos produtos com um visual editorial acolhedor, sofisticado e intuitivo, facilitando a navegação por categorias, detalhes do produto, seleção de variantes e conversão via WhatsApp ou atendimento personalizado.

A arquitetura combina um **storefront Next.js (App Router, React 19, Server Components)** com o **Payload CMS v4** executado no ambiente de nuvem do **Figma Make** (`@payloadcms/figma`).

**Diretrizes de interface e conteúdo (mandato de GEMINI.md):**
- **Interface e Conteúdo:** Não adicionar textos inúteis, óbvios ou prolixos que não agregam em nada. O aplicativo tem que ser direto, limpo e intuitivo por design, sem parágrafos autoexplicativos ou mensagens decorativas desnecessárias.
- **Identidade Visual:** Paleta suave e acolhedora (`#f8e1dd`, `#596a49`, etc.), tipografia com toque editorial, foco na fotografia dos produtos e clareza de preços, disponibilidade e variantes.
- **Experiência do Usuário:** Carregamento ultra-rápido, visual mobile-first e desktop impecável, imagens otimizadas com o loader customizado da plataforma e rotas limpas (`/`, `/produtos`, `/produto/[slug]`).

## 2. Regra universal: pnpm é obrigatório

**USE SEMPRE `pnpm` para gerenciar dependências e executar scripts do projeto. Sem exceções silenciosas.**

- Instalar dependências existentes: `pnpm install` (preferir `pnpm install --frozen-lockfile` em CI).
- Adicionar dependência de runtime: `pnpm add <package>`.
- Adicionar dependência de desenvolvimento: `pnpm add -D <package>`.
- Remover dependência: `pnpm remove <package>`.
- Atualizar dependências: `pnpm update <package>` (justificar mudanças relevantes).
- Executar scripts: `pnpm dev`, `pnpm build`, `pnpm format`, `pnpm generate:types`, `pnpm generate:importmap` **somente se o script existir no package.json**.
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

| Contexto / gatilho | Skills prioritárias |
|---|---|
| Início de sessão, regras, contexto da loja e escopo | `using-agent-skills`, `context-engineering`, `spec-driven-development` quando faltar especificação |
| Quebrar demandas do e-commerce em tarefas e entregas incrementais | `planning-and-task-breakdown`, `incremental-implementation` |
| Design de vitrine, banners, cards de produto, layout editorial de beleza e estética anti-slop | `frontend-design`, `design-taste-frontend`, `frontend-ui-engineering`, `ui-taste` |
| Componentes da loja, microinterações, responsividade e acessibilidade (WCAG) | `frontend-ui-engineering`, `web-design-guidelines`, `apple-design` para interações/gestos táteis fluidos, `shadcn` quando adotado |
| Implementar/otimizar React 19 e Next.js App Router (Server Components, ISR, hooks de cache, Server Actions) | `vercel-react-best-practices`, `source-driven-development` |
| Modelagem de dados Payload CMS (coleções `Products`, `Categories`, `Banners`, `Testimonials`, `Media`, globals `StoreSettings`), schemas e contratos | `api-and-interface-design`, `domain-modeling`, `codebase-design`, e `payload-data-modeling` / `payload-framework` se disponíveis no runtime Make |
| Alterações de regras de negócio da loja (cálculos de preço, filtros, busca, variantes, mutations, bugs) | `test-driven-development` (ou `tdd`), `debugging-and-error-recovery`, `diagnosing-bugs` |
| Testes visuais em navegador real, responsividade mobile/desktop e fluxo de compra/navegação | `agent-browser`; `browser-testing-with-devtools` quando o MCP correspondente estiver ativo |
| Otimização de Web Vitals, LCP de imagens (Next Image + custom loader), carregamento rápido e bundle | `performance-optimization`, `vercel-react-best-practices` |
| Segurança de mutations, controle de acesso (`publicOrEditor`, `editorOnly`), uploads e sanitização de dados | `security-and-hardening`, `security-audit` |
| Revisão de código, qualidade, simplificação e refatoração | `code-review-and-quality`, `code-review` quando houver diff/base, `code-simplification` quando apropriado |
| Commits, branches e versionamento | `git-workflow-and-versioning` |
| Decisões arquiteturais, ADRs e documentação | `documentation-and-adrs`, `domain-modeling` |
| CI/CD, esteira de deploy, qualidade e pré-lançamento | `ci-cd-and-automation`, `constraint-driven-development`, `shipping-and-launch` |
| Hipóteses de UX/UI ou ideias de novas seções/features da loja | `doubt-driven-development`, `prototype`, `idea-refine`, `interview-me` |

*Nota sobre skills específicas do runtime Figma Make/Payload:* caso o ambiente forneça as skills embutidas da plataforma (`payload-framework`, `payload-content`, `payload-auth`, `payload-data-modeling`, `nextjs-docs`), siga estritamente seus direcionamentos para tarefas de CMS, auth e dados.

## 4. Stack e Arquitetura da Loja

- **Framework:** Next.js (App Router) + React 19 + TypeScript estrito.
- **CMS & Backend:** Payload CMS v4 (`@payloadcms/next`, `@payloadcms/figma`, Lexical RichText).
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/postcss`, importado via `@import "tailwindcss"` em `src/app/(frontend)/styles.css`) + Lucide React para ícones.
- **Tipagem:** TypeScript com `payload-types.ts` autogerado pelo Payload.
- **Otimização de Imagens:** `next/image` integrado com o custom loader `figma-image-loader.ts`.
- **Runtime & Deployment:** Figma Make (`.figma/make/*`), sboxd em porta `$PORT` (default 3000).

### Separação de Módulos e Rotas

- `src/app/(frontend)/`: Aplicação da loja para clientes (Home, Catálogo `/produtos`, Detalhe do Produto `/produto/[slug]`, Layout, Estilos).
- `src/app/(payload)/`: Painel administrativo do Payload e rotas da API (`/admin`, `/api/*`). **NUNCA modificar arquivos nesta pasta**.
- `src/collections/`: Definições das coleções de dados (`Products`, `Categories`, `Banners`, `Testimonials`, `Media`, `Folders`, `Tags`, `Admins`).
- `src/globals/`: Globals de configuração (`StoreSettings`).
- `src/components/`: Componentes da interface da loja (`ProductCard`, `ProductExplorer`, `BannerSection`, `StoreHeader`, `StoreFooter`, etc.).
- `src/lib/`: Utilitários de acesso a dados (`store-data.ts`, `payload.ts`), helpers do Figma Make e revalidação.
- `src/access/`: Regras de acesso e autorização (`publicOrEditor.ts`).
- `src/hooks/`: Hooks de ciclo de vida do Payload (`revalidateStore.ts`).

## 5. Regras Críticas do Runtime e Integridade do Payload

### Regras do Payload Gerenciado pelo Figma
Este não é um projeto Payload self-hosted comum. O Figma Cloud provê o banco de dados, autenticação, armazenamento de arquivos e secrets via `@payloadcms/figma`.
- **Sempre usar `buildFigmaConfig()`** em `src/payload.config.ts`. NUNCA substituir por `buildConfig()` cru do Payload.
- **NÃO configurar nem adicionar:** `db`, `secret`, `editor` padrão, adapters de banco (Postgres/Mongo/SQLite), plugins manuais de cloud storage ou scripts/arquivos de migrations DDL.
- Se comandos reclamarem de variáveis de ambiente do backend ausentes no shell interativo, entenda que é uma limitação do contexto de execução fora do sboxd/Make. Não invente secrets falsos.

### Integridade de Dados e Acesso
- Mutações originadas por usuários devem ser validadas e permitidas explicitamente no servidor com retorno estruturado de erros.
- Conceder criação anônima apenas através de regras estreitas de acesso à coleção, protegendo campos de fluxo de trabalho do servidor com permissões field-level `create` e `update`.
- Chamadas públicas à Local API do Payload devem passar `overrideAccess: false` e repassar o `user` autenticado quando existir.
- Preservar o tipo de ID de documento gerado em `payload-types.ts` (não assumir que IDs são numéricos).
- Imagens gerenciadas pelo CMS devem ser modeladas como relacionamentos de upload para a coleção `Media`.

### Imagens do CMS e figma-image-loader.ts
- Passar a URL do upload (`media.url`) para `next/image`.
- **Manter o custom loader** `figma-image-loader.ts`. NUNCA criar proxy `/media/[id]`, pois falhará após o Publish.
- O loader cuida de passar parâmetros de redimensionamento para URLs relativas `/api/<collection>/file/...`. Não é necessário `images.remotePatterns`.
- Garantir dimensões válidas (width/height ou layout fill) em todas as exibições de imagens.

### Caching e Revalidação (ISR)
- Em requisições de storefront, usar dados cacheados com tags (`unstable_cache` ou `fetch` com tags) e revalidar via hooks de coleção (`revalidateStore`).
- Server Components não contêm manipuladores de eventos (`onClick`, `onChange`); use Client Component boundaries (`'use client'`).
- Quando um Client Component chamar uma Server Action dentro de `useTransition`, mantenha `revalidatePath` FORA da action; retorne um resultado serializável e execute `router.refresh()` no cliente após o sucesso.

### Slug e Tratamento de Not-Found
- Para rotas dinâmicas de produtos e categorias, usar sempre o utilitário `findBySlug()` de `src/lib/payload.ts` e invocar `notFound()` quando o registro não existir. Nunca duplicar queries inline ad-hoc.

### Modelagem de Autenticação
- Três camadas de autorização distintas:
  1. Acesso Figma/Make: controla quem visualiza e edita o arquivo Make.
  2. Payload Admin auth: controla quem gerencia o CMS (`/admin`), restrito a `Admins` via Figma SSO.
  3. Autenticação da Loja/App: caso seja solicitado login para clientes públicos, criar coleção `Users` dedicada e separada de `Admins`. Nunca conceder acesso de admin para usuários finais.

### Segurança de Schema e Evolução de Coleções
- **Greenfield (adições):** criação de novos campos opcionais, coleções e relacionamentos pode prosseguir com preview sucinto.
- **Destrutivas ou de quebra:** remoção de campos, renomeações, alteração de tipos, adição de restrições `required`/`unique` ou exclusão em massa exigem confirmação prévia com o usuário (`ask_user`), informando risco de perda de dados e plano de migração.

## 6. Padrões de Interface e Código

- **Direto e objetivo:** Seguir à risca o `GEMINI.md`: interface limpa, sem textos óbvios, prolixos ou autoexplicativos. Botões claros, títulos expressivos e descrições úteis de produtos.
- **TypeScript Estrito:** Proibido o uso de `any`, `@ts-ignore` ou `eslint-disable` sem autorização/justificativa.
- **Tailwind CSS v4:** Usar classes utilitárias de Tailwind nos componentes JSX. Manter `styles.css` restrito ao import do Tailwind, tokens de design e estilos verdadeiramente globais.
- **Acessibilidade e Usabilidade:** Foco visível em elementos interativos, contraste de texto sobre fundos de cor clara, navegação funcional por teclado e suporte a leitores de tela.
- **Segurança de Segredos:** Nunca expor variáveis de ambiente de backend ou segredos no cliente ou em variáveis com prefixo `NEXT_PUBLIC_*`.

## 7. Fluxo de Trabalho Obrigatório por Tarefa

### Antes de codificar
1. Ler a solicitação do usuário, este `AGENTS.md` e o `GEMINI.md`.
2. Descobrir e ler as skills pertinentes na matriz de roteamento (seção 3).
3. Inspecionar `package.json`, scripts existentes e arquivos afetados antes de alterar código.
4. Identificar se a mudança afeta schemas, rotas ou dados da loja.

### Durante a implementação
1. Fazer mudanças cirúrgicas e consistentes com o padrão existente.
2. Usar exclusivamente `pnpm` para dependências ou scripts.
3. Se envolver lógica de negócio, validar com testes ou reprodução controlada.

### Ao concluir
1. Executar os scripts de verificação disponíveis via `pnpm` (ex: `pnpm format`).
2. Verificar no navegador real via `agent-browser` para mudanças visuais e de interação na loja.
3. Responder em pt-BR com: **o que mudou**, **skills efetivamente utilizadas**, **comandos/testes executados**, **resultado** e **eventuais pendências**.

---

**Resumo operacional para o agente:** descubra e aplique as skills relevantes, **use sempre pnpm**, mantenha a interface da Bem Me Quero direta, limpa e elegante, e respeite rigorosamente as regras do Next.js App Router e do Payload CMS no Figma Make.
