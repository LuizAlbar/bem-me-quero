# Administração — configurações e financeiro

## Entrega

- `/admin/configuracoes`: campos inicialmente somente para leitura; Editar habilita; Salvar persiste e volta ao bloqueio; Cancelar restaura o último valor salvo. Foco acompanha a troca de estado. Chaves distintas nos botões evitam que Enter em Editar dispare também o submit após a reconciliação do React.
- `/admin/financeiro`: criar, editar e excluir entradas recebidas e saídas pagas, com título, valor em reais, data, produto e categoria opcionais. Com produto selecionado, o título pode ser preenchido automaticamente. A categoria é sugerida pelo produto e pode ser alterada. Exclusão tem confirmação.
- `/admin`: resumo de entradas, saídas e resultado, comparação mensal e resultado por categoria, preservando indicadores e acesso ao catálogo existente.
- Filtros compartilhados: datas inclusivas, categoria do catálogo, produto e tipo; mês atual em São Paulo por padrão; opção de todo o período. Filtros na URL e paginação de 20 lançamentos. Indicadores consideram todos os resultados, independentemente da página.

## Regra financeira

Foi enviada pergunta opcional sobre fluxo de caixa versus custo por produto. Sem resposta durante a implementação, foi adotado fluxo de caixa: **resultado = entradas recebidas − saídas pagas**, conforme informado no painel. O valor de cada lançamento é cadastrado pela administradora. Não há inferência de vendas por acessos, cliques, produtos, preço do catálogo ou WhatsApp. Não existe apuração automática de margem ou custo de estoque.

Valores individuais são centavos inteiros positivos até R$ 9.999.999,99. Agregações do PostgreSQL retornam strings; cálculo e apresentação de totais usam BigInt para preservar centavos. Datas são civis (`date`), sem conversão de fuso nos lançamentos.

## Banco e segurança

Migração aditiva `drizzle/0001_financial_entries.sql` aplicada ao banco conectado por `pnpm exec tsx scripts/migrate-finance.ts`. Reaplicação idempotente também conferida. Não foi executado seed, limpeza ou sincronização geral de schema.

Tabela `financial_entries` com checks para tipo, título e valor; índices por data, categoria e produto; RLS habilitada e privilégios de `anon`/`authenticated` revogados. Acesso pelo servidor autenticado como admin. As ações revalidam sessão e papel administrativo, validam entradas e usam consultas parametrizadas. Erros de infraestrutura não são expostos.

Produto/categoria usam FK `ON DELETE SET NULL`: excluir um cadastro não apaga seu lançamento, valor, data ou título. Edição/exclusão verificam a versão original; timestamps com precisão de milissegundos evitam truncamento na ida/volta por JavaScript. Um formulário desatualizado precisa ser atualizado antes de substituir outro registro.

Rollback da aplicação pode manter a tabela aditiva sem perda de dados. Não remover a tabela após uso sem backup e autorização explícita.

## Arquivos

- Configurações: `src/app/admin/(panel)/configuracoes/{SettingsForm.tsx,actions.ts}`.
- Navegação/dashboard: `src/app/admin/(panel)/{layout.tsx,page.tsx}`.
- Rota e ações: `src/app/admin/(panel)/financeiro/{page.tsx,actions.ts}`.
- UI compartilhada: `src/components/finance/` (filtros, resumo, relatórios, lista, formulário e composição).
- Domínio e acesso: `src/lib/finance-{input,data}.ts`; testes `src/lib/finance-input.test.ts`.
- Persistência: `src/db/schema.ts`, migração SQL e `scripts/{migrate-finance,check-finance}.ts`.
- Planejamento/evidências: `tasks/plan.md`, `tasks/todo.md`, `tasks/evidence/admin-finance/`.

Sem dependências novas ou mudanças na vitrine/autenticação.

## Verificação

- TDD: 10 testes novos escritos antes da implementação; primeira execução falhou por ausência do módulo, depois passou. Cobrem centavos, limites, ambiguidade de formatos, data inválida/bissexta, fuso de São Paulo, títulos/relações e filtros. A suíte completa passou com **36 testes**.
- Mutação em cópia temporária isolada: permitir valor zero fez o teste falhar, sem alterar a fonte servida pela aplicação.
- `pnpm exec tsx scripts/check-finance.ts`: constraints, soma exata de 29 − 10 centavos, preservação após excluir produto/categoria e proteção pública conferidos em transação revertida.
- Navegador real com `agent-browser`: configurações bloqueadas, erro de validação, cancelar/restaurar, salvar/recarregar; fluxo financeiro completo com três registros temporários, edição/cancelamento, confirmação de exclusão e filtros. Totais conferidos: R$ 149,29 − R$ 20,10 = R$ 129,19. Os três registros foram excluídos no fluxo.
- Responsividade em **320, 390, 768, 1024 e 1440 px**, nas rotas `/admin`, `/admin/configuracoes` e `/admin/financeiro`; formulário aberto e cancelamento por Escape; foco/Tab; controles com pelo menos 44 px; nenhuma rolagem horizontal. Lista populada também conferida nas cinco larguras.
- `pnpm exec tsc --noEmit`, `pnpm format --check` e `git diff --check` aprovados.
- `pnpm build` compilou, checou tipos e gerou rotas. A primeira execução encerrou com alerta de segurança da versão instalada do Next.js; a repetição do mesmo comando concluiu com código 0 e manteve o alerta. **Pendência preexistente: atualizar o Next.js para corrigir a vulnerabilidade sinalizada pelo build.**

- Paginação conferida com 24 lançamentos: 20 na primeira página e quatro na segunda, mantendo os mesmos totais; gasto de outro mês só entrou no período aberto. Valores máximos e título de 200 caracteres sem espaços conferidos nas cinco larguras.
- Edição simultânea: um registro foi alterado por outra operação enquanto o formulário estava aberto; a tentativa de salvar a versão antiga foi rejeitada e o valor mais recente permaneceu no banco. Valor zero também foi rejeitado sem criar registros.
- Troca de mês pelo formulário GET confirmada: seleção de dezembro refletida na URL, sem limites presos ao mês anterior. Rotas financeiras sem sessão redirecionam ao login.
- Limpeza final: nenhum lançamento financeiro de teste permaneceu no banco; 14 produtos, quatro categorias e contatos originais preservados. Capturas preenchidas representam somente fixtures temporárias, não operações reais da loja. Sem erros de JavaScript capturados pelo navegador.

Evidências: `responsive.json`, `flows.json`, `pagination-and-integrity.json`, `mutation.json` e seis capturas em `tasks/evidence/admin-finance/`.

## Skills e referências

Aplicadas: using-agent-skills, spec-driven-development (contrato de escopo), planning-and-task-breakdown, incremental-implementation, frontend-ui-engineering, vercel-react-best-practices, api-and-interface-design, test-driven-development, security-and-hardening, agent-browser e code-review-and-quality. Identidade visual e mecânica de foco/contraste preservadas conforme os componentes existentes e o craft floor do Impeccable. Revisão própria do diff nas dimensões de correção, clareza, arquitetura, segurança e desempenho; sem alegação de revisão independente.

Referências oficiais consultadas: [Drizzle PostgreSQL](https://orm.drizzle.team/docs/column-types/pg) e [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security).
