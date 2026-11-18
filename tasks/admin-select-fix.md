# Seletor de produto — correção e commit

## Diagnóstico

O campo financeiro usava um `<select>` clássico, com popup controlado pela plataforma. Não havia handlers de arrastar ou de pressionar/soltar o mouse no formulário. O valor e a categoria eram atualizados pelo `onChange` existente.

No navegador de teste, a sequência abrir por clique e depois clicar na opção não confirmou a escolha com o popup clássico. A intervenção isolada em CSS, ativando `appearance: base-select`, permitiu a mesma interação sem alterar dados, estado React ou ação de salvamento. Não foi atribuída a falha a uma versão específica do navegador/SO; menus nativos também têm limitações de automação, então esse resultado não identifica sozinho uma regressão do Chromium.

## Alteração

- Classe reutilizável `form-select` em `src/app/styles.css`, aplicada ao campo de produto em `FinanceEntryForm.tsx`.
- Picker ancorado ao controle, na top layer do navegador, sem recorte pelo modal. Lista com altura limitada, rolagem interna, nomes que podem quebrar linha e opções de pelo menos 44 px.
- Mantidos `<select>`, `<option>`, `name`, valores, teclado, semântica acessível, sugestão da categoria e envio via FormData. Sem interceptação de pointer/mouse e sem dependências.
- Melhoria progressiva em `@supports (appearance: base-select)`: navegadores sem suporte mantêm o seletor clássico. WebKit e Firefox não foram executados; não há alegação de correção de um bug de plataforma nesses navegadores.

Referência consultada: [MDN — Customizable select elements](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select). A estrutura HTML clássica foi preservada; somente CSS ativa a renderização aprimorada.

## Reprodução e verificação

Script persistente: `scripts/check-admin-product-select.ts`. Requer `agent-browser`, aplicação em execução e sessão administrativa autenticada; não envia o formulário nem altera o banco.

```bash
# Autentique previamente esta sessão na aplicação.
BMQ_BROWSER_SESSION=bmq-select pnpm exec tsx scripts/check-admin-product-select.ts
# Controle negativo: força o menu clássico apenas na página de teste.
BMQ_BROWSER_SESSION=bmq-select pnpm exec tsx scripts/check-admin-product-select.ts --native-control
```

O controle negativo falhou ao confirmar o produto. Na versão aprimorada, são conferidos dois cliques separados (sem arraste e sem usar a API de selecionar valor para o produto), tanto em entrada quanto em saída, sugestão da categoria, FormData, End/Enter, Escape sem fechar o modal, limpeza da seleção e ausência de overflow em 320, 390, 768, 1024 e 1440 px. Opções fora da área visível são trazidas para a área de rolagem antes do clique, como ocorreria após rolar a lista.

Evidências em `tasks/evidence/admin-select/`: JSON de resultados e capturas do picker em mobile e desktop. Toque real via CDP também aprovado em 390 px: `pointerType=touch`, tocar/soltar para abrir, tocar/soltar para selecionar, sem arraste, preservando modal e dados. Resultado em `touch.json`.

Checks: `pnpm test` (36 testes), `pnpm exec tsc --noEmit`, `pnpm format --check`, `git diff --check` e `pnpm build`. O build concluiu na repetição, mantendo o alerta preexistente de segurança do Next.js 16.4.2.

Skills aplicadas: diagnosing-bugs, debugging-and-error-recovery, frontend-ui-engineering, agent-browser, code-review-and-quality e git-workflow-and-versioning; regras de testes e acessibilidade já utilizadas no financeiro mantidas.

O commit solicitado inclui também as alterações anteriores de configurações, financeiro, schema/migração, testes, relatório e evidências. Sem alterações em credenciais ou dependências e sem dados financeiros de teste persistidos.
