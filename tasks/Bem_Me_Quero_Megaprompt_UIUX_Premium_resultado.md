# Bem Me Quero — refinamento premium implementado

Data: 17/11/2026. Escopo: executar `Bem_Me_Quero_Megaprompt_UIUX_Premium.md` sobre o workspace existente, preservando o trabalho anterior de contatos/configurações e o hero aprovado.

## 1. Resumo executivo

- Categorias restauradas como círculos perfeitos, com apenas fotografia e nome, sem descrição individual, seta, borda ou sombra. Grid 2×2 no mobile/tablet e quatro colunas a partir de 1024 px; diâmetro uniforme e máximo de 300 px.
- Banner de campanha usa diretamente `assets/sessions/banner-2.png` por import estático do Next.js. Sem retorno silencioso à imagem antiga. Empilhamento até 1023 px evita recortes excessivos; desktop preserva divisão 55/45.
- Navbar continua transparente e sobreposta ao hero de `100svh`. Fotografia, gradiente superior, logo, textos acessíveis e CTA foram preservados.
- Tokens, motion, feedback, cards, filtros compartilháveis, recuperação de erro, placeholders e upload administrativo refinados sem dependências adicionais.
- **Oito produtos de demonstração e três depoimentos do seed deixaram de ser publicados como conteúdo real.** Registros permanecem íntegros no banco/admin. Promessas de entrega e pagamento do seed também ficam retidas até revisão comercial. A vitrine oferece contato pelo WhatsApp enquanto o catálogo é revisado.

## 2. Auditoria inicial: evidência e grau de certeza

O PDF de sete páginas citado no enunciado não está disponível no repositório. Portanto, suas observações são **relatadas pelo enunciado**, não resultado de inspeção direta do PDF. A referência do [Primavera Gloss](https://themes.shopify.com/themes/primavera/presets/gloss) foi consultada; a página indicada do Behance respondeu com HTTP 403.

| Prioridade | Achado                                                   | PDF/enunciado          | Confirmação no navegador/código/banco                              | Tratamento                                                                             |
| ---------- | -------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| P0         | Categorias retangulares com descrições/setas             | Relatado               | Confirmado no workspace e baseline                                 | Círculos, somente imagem e nome                                                        |
| P0         | Foto antiga no editorial intermediário                   | Relatado               | Confirmado no componente e banco                                   | Import obrigatório do banner-2 fornecido                                               |
| P1         | Fotos repetidas e sem correspondência com SKU            | Relatado               | Oito cadastros e URLs coincidem com `scripts/seed.ts`              | Conteúdo de demonstração retido; mídia de referência excluída das superfícies públicas |
| P1         | Depoimentos e promessas comerciais sem confirmação       | Relatado parcialmente  | Três textos/nomes e duas condições comerciais coincidem com o seed | Retidos sem excluir registros                                                          |
| P1         | Falha de banco parecia catálogo vazio                    | Não verificável no PDF | Confirmado no `catch` e teste de dados                             | Exceção chega à recuperação de erro                                                    |
| P1         | Zoom de categorias sem alternativa de movimento reduzido | Não verificável no PDF | Confirmado no código inicial                                       | Reduced motion intencional e teste no browser                                          |
| P2         | Espaçamento duplicado junto a editoriais                 | Oportunidade relatada  | Padding de seções adjacentes somava 128 px no desktop              | Espaçamento editorial próprio; transição passa a 96 px                                 |
| P2         | Links repetidos no rodapé                                | Relatado               | Confirmado em `usefulLinks` e navegação                            | Deduplicação por destino, contato preservado                                           |
| P2         | Filtros compartilhavam apenas categoria                  | Não verificável no PDF | Confirmado no código                                               | Busca, disponibilidade e ordenação também persistem na URL                             |
| P2         | Cinza de fallback abaixo de AA para texto pequeno        | Não verificável no PDF | Contraste calculado: 4,40:1                                        | Token `muted`, com 5,67:1 sobre surface                                                |

Avaliação heurística orientada pelo audit do Impeccable, sem equivaler a certificação WCAG ou relatório Lighthouse:

| Dimensão            | Inicial (0–4) | Após refinamento (0–4) | Evidência principal                                                                                               |
| ------------------- | ------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Acessibilidade      | 2             | 3                      | Foco, teclado, contraste de tokens, reduced motion e SSR sem scripts conferidos; sem auditoria assistiva completa |
| Performance         | 3             | 3                      | Imagens responsivas, sem biblioteca de animação, medições locais reais; sem RUM/INP de campo                      |
| Responsividade      | 3             | 4                      | Cinco larguras, menus/formulários e reflow equivalente a 200% sem overflow                                        |
| Tokens/consistência | 2             | 3                      | Raios, superfícies, easing e elevação compartilhados; estilos legados fora do escopo preservados                  |
| Integridade         | 1             | 3                      | Conteúdo do seed identificado e retido; fotos e informações comerciais reais ainda dependem da loja               |
| Total               | 11/20         | 16/20                  | Melhorias verificadas com limitações explicitadas                                                                 |

Pontos preservados: composição do hero, tipografia Cormorant Garamond/DM Sans, paleta rosa/verde, otimização nativa de imagens, separação das rotas administrativas, autenticação e contatos configuráveis.

## 3. Alterações por seção

### Categorias

Assets específicos cadastrados no banco continuam sendo a fonte das imagens. O componente não presume mais que todo PNG possui um WebP com o mesmo nome. `next/image` faz a otimização, com `sizes` correspondente ao grid. Imagens em `aspect-square` e `rounded-full`, sem distorção, com nome serifado centralizado a 16 px do círculo. Navegação e foco permanecem no link completo.

### Banner intermediário e institucional

O asset informado tem 920×705 px e é usado exclusivamente na campanha. Em 768 px ele permanece inteiro, empilhado sobre o texto; em 1024/1440 px usa o split editorial. Bordas de 24 px, painel blush, título com largura controlada e CTA para `/produtos`.

A copy original do seed que sugeria desenvolvimento próprio foi substituída por texto de seleção de maquiagens, e a coleção fictícia do seed passa a “Seleção Bem Me Quero”. Textos diferentes cadastrados pela loja não são sobrescritos. O institucional mantém sua fotografia existente e proporção distinta; uma fotografia real da loja depende de fornecimento.

### Cards e detalhes de produto

Mesmo componente em destaques e catálogo. Foto principal e segunda imagem válidas, fallback neutro com “Imagem em breve”, tratamento de imagem quebrada, dimensões reservadas e `object-contain` para preservar embalagens. A segunda foto fica fora do layout nos dispositivos sem hover e no modo reduzido. “Ver detalhes” permanece disponível para touch e teclado.

Nome completo, preço com numerais tabulares, aviso de indisponibilidade e oferta somente quando o preço promocional é finito, não negativo e menor que o preço base. O mesmo cálculo é aplicado à ordenação, cards e detalhe. Informações complementares do detalhe usam `details/summary` nativos.

Os registros do seed não foram apagados. A regra reconhece os slugs de demonstração associados exclusivamente às fotografias conhecidas do seed. Ao revisar o cadastro e substituir a foto principal por fotografia real, o produto pode voltar à vitrine; fotos antigas de referência não voltam como secundárias públicas. Confirmar nome, preço, disponibilidade e copy antes de salvar a revisão.

### Catálogo e estados

Busca, categoria, disponibilidade e ordenação atualizam imediatamente o grid e a contagem. Estado compartilhável pela URL, preservando parâmetros alheios como UTM, com back/forward e limpeza funcional. Indicador de filtros ativos no mobile e controles secundários sob expansão; dois controles não exigiram introduzir um drawer adicional.

Catálogo sem dados verificados apresenta “Catálogo em atualização” e contato real. Busca sem resultados apresenta estado específico e limpeza de filtros. Destaques sem produtos verificados não deixam uma seção vazia: os links para essa âncora também são retirados.

Skeleton do catálogo usa a geometria dos cards; skeleton de produto existente foi preservado. O skeleton só aparece nas rotas com carregamento real. Falhas de dados chegam ao `error.tsx`, com recuperação pelo `retry()` da versão instalada do Next.js, que refaz a busca. API conferida nos tipos locais e na [documentação oficial](https://nextjs.org/docs/app/api-reference/file-conventions/error).

### Depoimentos, benefícios e rodapé

Depoimentos verdadeiros que venham a ser cadastrados preservam o grid responsivo e usam superfície branca e raio de card, sem avaliações inventadas. As três demonstrações foram retidas por correspondência exata de nome e texto.

Benefício de atendimento via WhatsApp permanece: o contato foi fornecido pela loja e o fluxo existe. Frases de frete e pagamento do seed não são exibidas como fato. A faixa usa blush suave e se adapta à quantidade de benefícios.

Rodapé em verde profundo, com “Explorar” e “Atendimento”, destinos deduplicados, redes acessíveis, links externos seguros e foco claro. Os destinos continuam seguindo as configurações administrativas.

### Administração

Campo de imagem aceita URL HTTPS e caminho local, incluindo os assets das categorias. Upload com formatos JPG/PNG/WebP/AVIF, limite real de 8 MB, ajuda e validação compartilhadas entre cliente e servidor. Limite de corpo das Server Actions ajustado para 10 MB, comportando o arquivo e o envelope da requisição.

Preview antes de salvar, alerta em fotografias do seed, feedback de falha e seleção repetida do mesmo arquivo após uma tentativa. Galerias existentes e IDs de imagens continuam preservados. Não houve mudança de schema, exclusão de produto ou alteração de preços no banco nesta tarefa.

## 4. Motion system

Tese: **delicadeza em repouso, feedback imediato na interação**. Não há animação do hero, parallax, carrossel automático, cursor especial ou biblioteca adicional.

| Uso                          | Movimento                                                                  | Tempo                                                 | Alternativa reduzida                             |
| ---------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| Categorias                   | Reveal único dos quatro irmãos, 12 px; zoom contido de 1,03 no hover       | 480 ms; stagger de 60 ms, máximo 180 ms; hover 280 ms | Sem reveal nem zoom; cor e foco permanecem       |
| Campanha                     | Entrada única do bloco editorial, 12 px                                    | 480 ms                                                | Conteúdo estático e visível                      |
| Produto                      | Zoom 1,03, crossfade de segunda foto real, sombra no hover e seta discreta | 280 ms                                                | Sem zoom, sem troca de imagem e sem deslocamento |
| Menu, busca, modal e filtros | Opacidade + deslocamento de 6 px ao abrir                                  | 280 ms                                                | Abertura imediata                                |
| Botões e links               | Cor, borda, underline e pressed de 0,99                                    | 160 ms                                                | Feedback de cor/foco, sem escala                 |
| Skeleton                     | Pulso suave, limitado a três ciclos                                        | 1400 ms por ciclo                                     | Estático                                         |

Easing compartilhado: `cubic-bezier(0.16, 1, 0.3, 1)`. Reveal por IntersectionObserver/Web Animations, uma vez, com cleanup e cancelamento por foco ou alteração da preferência. Conteúdo é visível por padrão antes da hidratação e sem JavaScript, conforme teste real com execução de scripts desativada. Base técnica: [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## 5. Performance e acessibilidade: resultados reais

Chrome for Testing 155, Linux, localhost, Next.js em modo de produção. Medições pontuais/sequenciais no mesmo browser; **não representam p75 de usuários reais**. Desktop foi medido primeiro e mobile a seguir, com condições de cache diferentes. A preferência de movimento reduzido estava ativa e não houve throttling de CPU. O hero não possui animação em nenhum dos modos.

| Cenário                                                                                       | Viewport | TTFB     | LCP     | CLS |
| --------------------------------------------------------------------------------------------- | -------- | -------- | ------- | --- |
| Produção local, sem throttling                                                                | 1440×900 | 166,8 ms | 508 ms  | 0   |
| Produção local, sem throttling, navegação subsequente                                         | 390×844  | 11,5 ms  | 172 ms  | 0   |
| Produção local, rede emulada com 150 ms e download de 1,6 Mbit/s, cache do browser desativado | 390×844  | 17 ms    | 2656 ms | 0   |

O LCP da simulação lenta ficou ligeiramente acima da referência de 2,5 s. Não foi reduzida a nitidez aprovada do hero para melhorar artificialmente esse número. A baseline **visual** anterior foi preservada; não há baseline quantitativa anterior às alterações que permita afirmar ganho percentual. Uma medição intermediária de desenvolvimento registrou LCP de 1764 ms e CLS 0, mas não é comparável à produção. INP de campo, Lighthouse e RUM não foram medidos.

Dados brutos: [performance.json](evidence/premium/performance.json). Imagens continuam usando a [otimização nativa do Next.js](https://nextjs.org/docs/app/api-reference/components/image); não foram geradas novas fotografias nem ampliado artificialmente o asset recebido.

Contrastes calculados: brand/surface **5,66:1**, muted/surface **5,67:1**, ink/blush **9,99:1**, surface/ink **12,04:1**. Foco do footer e anúncio usa cor clara própria. A legibilidade sobre a fotografia também foi inspecionada visualmente; esses cálculos de tokens não certificam todos os pixels da fotografia.

Validação real:

- Home e catálogo em **320, 390, 768, 1024 e 1440 px**: sem overflow horizontal; hero, categorias, banner, menu, busca, contatos, URL e histórico de filtros.
- Formulários de produto e categoria nas mesmas cinco larguras: modal dentro da viewport, campo local/HTTPS, ajuda, upload acima do limite e fechamento por Escape.
- Cards e catálogo preenchido em prévia temporária protegida: 12 cards iniciais, 16 após “Carregar mais”, ordenação, disponibilidade, busca vazia e oferta válida. Dados explicitamente ilustrativos e sem escrita no banco. Rota removida antes do build final.
- Hover com mouse/fine pointer: zoom medido em aproximadamente 1,03 e crossfade funcionando. Reduced motion: transform `none`, segunda foto desativada, nenhum reveal ativo; foco visível de 2 px.
- Scripts desativados: quatro círculos e banner presentes e visíveis. Reflow equivalente a 200% em desktop de 1440 px: viewport CSS de 720 px, DPR 2, sem overflow. Isso é emulação equivalente, não ajuste manual do zoom da interface do Chrome.
- Upload real ao storage testado; arquivo temporário removido e ausência conferida. Falha offline exibiu alerta, liberou o botão e zerou o seletor de arquivos para permitir nova tentativa.
- Falha de banco validada por teste controlado; recuperação visual/callback conferida na prévia. Não foi interrompido o banco real para provocar indisponibilidade.

## 6. Skills efetivamente aplicadas

| Skill                                                    | Aplicação                                                              | Benefício                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| using-agent-skills                                       | Descoberta e seleção dos workflows                                     | Escopo e processo coerentes                                   |
| planning-and-task-breakdown / incremental-implementation | Plano, checklist e fatias verificadas                                  | Correções P0 antes das demais                                 |
| impeccable                                               | Contexto, audit técnico, animate, craft floor e polish; detector final | Refinamento preservando a identidade                          |
| frontend-ui-engineering                                  | Componentes, estados, foco e responsividade                            | Interface funcional em mobile e desktop                       |
| performance-optimization / vercel-react-best-practices   | Medições, Server Components e imagens                                  | Sem biblioteca de efeitos ou clientificação da página inteira |
| test-driven-development                                  | Regressões de preço, URL, conteúdo e upload                            | 26 testes automatizados passando                              |
| security-and-hardening                                   | Fontes de imagem, tamanho/tipo de upload e ações autenticadas          | Limites consistentes no cliente e servidor                    |
| source-driven-development                                | APIs atuais conferidas nos tipos locais e documentos oficiais          | Uso de `retry` compatível com Next 16.4.2                     |
| agent-browser                                            | Navegação, screenshots, interações e vitals em Chromium real           | Evidências reais, incluindo falhas e reduced motion           |
| code-review-and-quality / documentation-and-adrs         | Revisão do diff, decisões e relatório                                  | Pendências e limites explícitos                               |

Chrome DevTools MCP não foi utilizado. CDP pontual complementou o agent-browser para desativar scripts, emular reflow e limitar rede. A ausência do PDF e o 403 do Behance não foram tratados como evidências inspecionadas.

## 7. Arquivos desta tarefa

| Arquivo/grupo                                                                     | Mudança                                                                 |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/components/CategoryCard.tsx`                                                 | Círculos, nomes, foco, sizes e fonte de imagem real cadastrada          |
| `src/components/BannerSection.tsx`                                                | Asset banner-2, proporção, empilhamento, espaçamento e reveal focal     |
| `src/components/Reveal.tsx`                                                       | Enhancement progressivo com cleanup, foco e reduced motion              |
| `src/components/ProductMedia.tsx`                                                 | Mídia válida, fallback, falha e segunda imagem                          |
| `src/components/ProductCard.tsx`                                                  | Hierarquia, oferta válida, disponibilidade e CTA acessível              |
| `src/components/ProductExplorer.tsx`                                              | URL completa, contagem, filtros ativos e estados vazios                 |
| `src/components/StoreHeader.tsx` / `StoreFooter.tsx`                              | Âncoras existentes, deduplicação e fechamento visual                    |
| `src/components/AdminImageField.tsx` / `src/app/admin/actions.ts`                 | Preview, validação, upload e repetição de arquivo                       |
| `src/app/styles.css`                                                              | Tokens, superfícies, espaçamento, motion, foco e alternativas reduzidas |
| `src/app/(store)/layout.tsx` / `page.tsx` / `produtos/page.tsx`                   | Integração dos componentes e estados condicionais                       |
| `src/app/(store)/produto/[slug]/page.tsx`                                         | Fotos reais/placeholder, preço compartilhado e disclosure nativo        |
| `src/components/ProductGridSkeleton.tsx` / `src/app/(store)/produtos/loading.tsx` | Loading com geometria estável                                           |
| `src/app/error.tsx`                                                               | Recuperação de erro com `retry`                                         |
| `src/lib/content-review.ts` / `store-data.ts`                                     | Conteúdo demonstrativo retido, benefícios revisados e erros honestos    |
| `src/lib/catalog.ts`                                                              | Validação do preço promocional e contrato de URL                        |
| `src/lib/image-upload.ts`                                                         | Política compartilhada de mídia e upload                                |
| `src/lib/*test.ts` afetados/adicionados                                           | Regressões de catálogo, conteúdo, upload e dados                        |
| `next.config.ts`                                                                  | Corpo de Server Actions compatível com upload de 8 MB                   |
| `tasks/plan.md`, `tasks/todo.md`, este relatório e `tasks/evidence/premium/`      | Plano, diagnóstico e evidências                                         |

O enunciado foi normalizado pelo formatter sem mudança de requisitos. Alterações anteriores de configurações, contatos, hero e assets fornecidos foram preservadas; não são reivindicadas como criação desta etapa.

## 8. Evidências antes/depois

Capturas com as mesmas dimensões de viewport, preservando a página inteira. Diferenças de comprimento decorrem também da retenção de conteúdo demonstrativo, não apenas do espaçamento.

| Viewport | Antes                                                 | Depois                                                | Detalhes                                                                                               |
| -------- | ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 390×844  | [Mobile antes](evidence/premium/before-mobile.webp)   | [Mobile depois](evidence/premium/after-mobile.webp)   | [Categorias](evidence/premium/categories-mobile.webp), [banner](evidence/premium/banner-mobile.webp)   |
| 768×1024 | [Tablet antes](evidence/premium/before-tablet.webp)   | [Tablet depois](evidence/premium/after-tablet.webp)   | [Categorias](evidence/premium/categories-tablet.webp), [banner](evidence/premium/banner-tablet.webp)   |
| 1440×900 | [Desktop antes](evidence/premium/before-desktop.webp) | [Desktop depois](evidence/premium/after-desktop.webp) | [Categorias](evidence/premium/categories-desktop.webp), [banner](evidence/premium/banner-desktop.webp) |

Auditoria individual de IDs, slugs, nomes, categorias, preços, disponibilidade, destaque, badge e mídia: [catalog-review.json](evidence/premium/catalog-review.json). O modelo não possui quantidade de estoque; não foi inventada.

## 9. Verificações e limitações

- `pnpm test`: **26 testes passaram**.
- `pnpm exec tsc --noEmit`: passou; tipos de rotas temporárias foram regenerados com `pnpm exec next typegen` após a remoção da prévia.
- `pnpm format --check` e `git diff --check`: conferidos.
- `pnpm build`: compilação/geração validadas. A versão instalada do Next.js emitiu alerta de segurança e exigiu repetição do comando para prosseguir; atualização da dependência permanece pendente.
- Detector Impeccable em 15 alvos alterados: **zero achados determinísticos**. Hooks também rodaram durante as edições. Isso não substitui inspeção visual ou certificação de acessibilidade.
- Não há script de lint no projeto. Não foi instalado um runner novo.
- Não há SKU real confirmado disponível para validar uma jornada comercial completa de detalhe/compra; os componentes compartilhados foram testados com dados ilustrativos exclusivamente na prévia protegida.

## 10. Próximas prioridades que dependem da loja

1. Fornecer fotografias reais dos oito SKUs e confirmar nomes, preços, disponibilidade e descrição no admin. Nenhuma embalagem foi inventada para preencher essa lacuna.
2. Confirmar origem/consentimento dos depoimentos e regras verdadeiras de entrega e pagamento antes de publicá-los.
3. Fornecer fotografia institucional da loja, se desejar substituir a imagem editorial existente.
4. Disponibilizar o PDF original para confronto direto, caso ainda seja necessário.
5. Tratar a atualização de segurança do Next.js e coletar métricas reais de produção/INP quando houver tráfego; os números locais não substituem esses dados.
