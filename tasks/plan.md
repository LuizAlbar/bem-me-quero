# Administração — configurações e financeiro

## Escopo e contrato

Solicitação: bloquear contatos até Editar, permitir Salvar/Cancelar; cadastrar receitas e gastos e acompanhar indicadores com filtros.

Módulos: `settings-editing` (independente), `financial-ledger` (persistência e CRUD autenticado), `financial-reporting` (depende dos lançamentos). Ordem: configurações → lançamentos → dashboard.

- Sem resposta à pergunta opcional sobre custo por produto, adotar fluxo de caixa realizado: entradas recebidas, saídas pagas; resultado = entradas − saídas. Não inferir vendas do catálogo, estoque ou WhatsApp. Não calcular margem por produto sem custo cadastrado.
- Lançamento: entrada/saída, título (pode vir do produto selecionado), valor positivo em centavos inteiros, data civil, produto opcional, categoria opcional. Categoria do produto sugerida no formulário e persistida independentemente de futuras mudanças no produto.
- FK de produto/categoria com SET NULL; título e valor preservados. Valores limitados a R$ 9.999.999,99 por lançamento. Banco usa integer e checks; totais agregados em bigint e transportados como string para preservar exatidão.
- Filtros compartilhados por data inicial/final inclusivas, categoria (inclusive sem categoria), tipo e produto. Padrão: mês atual em America/Sao_Paulo. Filtros inválidos mostram erro, nunca silenciosamente métricas de outro período.
- Lista paginada de 20 registros; indicadores e agrupamentos consideram todos os resultados, não só a página.
- Segurança: sessão/papel admin em leituras e ações; validar valores, datas e UUIDs no servidor; consultas parametrizadas; mensagens sem detalhes de infraestrutura. Nova tabela sem API pública; RLS habilitada sem políticas públicas no Supabase.
- UI: reutilizar tokens, AdminDialog, AdminFeedback e useAdminFeedback. Cards de resumo, comparativo mensal e categorias no dashboard; formulário financeiro em modal e listagem legível desde 320 px. Estado vazio verdadeiro, sem dados financeiros fictícios.
- Sem dependências novas, alteração de autenticação, seed destrutivo ou modificação da vitrine.

## Fatias e verificação

1. Configurações: campos bloqueados, foco ao editar, cancelar restaura valores, salvar persiste e bloqueia. TypeScript + navegador.
2. Domínio: testes antes da implementação para centavos, datas, filtros e validação. `src/lib/finance-input.ts`, `finance-input.test.ts`. Testes focados.
3. Persistência: schema + migração aditiva idempotente, leitura autenticada com agregações e paginação. Aplicar apenas a migração nova ao banco conectado; conferir constraints e preservação dos dados.
4. Lançamentos: ações autenticadas + formulário e lista; criar, editar e excluir com confirmação. Reprodução em navegador e consulta controlada ao banco; remover exclusivamente os registros temporários de teste.
5. Relatórios: filtros, resumos e gráfico compartilhados; integrar à Visão Geral preservando os indicadores de catálogo.
6. Validação: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm format --check`, `pnpm build`, `git diff --check`; navegador real em 320, 390, 768, 1024 e 1440 px, teclado, cancelamento, persistência e filtros. Evidências e relatório em `tasks/evidence/admin-finance` e `tasks/admin-finance-result.md`.

Plano anterior concluído: relatório `Bem_Me_Quero_Megaprompt_UIUX_Premium_resultado.md`.

Referências técnicas: [Drizzle PostgreSQL](https://orm.drizzle.team/docs/column-types/pg), [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security). Estilo: TypeScript estrito, nomes em inglês, UI pt-BR, tokens existentes; `amountCents: number` na entrada, `BigInt` apenas para totais monetários no servidor/formatador, strings serializáveis nos contratos.
