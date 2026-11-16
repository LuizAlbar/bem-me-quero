# Diretrizes de Desenvolvimento — Bem Me Quero

- **Gerenciador de Pacotes:** Usar sempre `pnpm` para manipular packages, instalar dependências e rodar scripts do projeto. Não utilizar `npm`, `npx`, `yarn` ou `bun`.
- **Interface e Conteúdo:** Não adicionar textos inúteis, óbvios ou prolixos que não agregam em nada. O aplicativo tem que ser direto, limpo e intuitivo por design, sem parágrafos autoexplicativos ou mensagens decorativas desnecessárias.
- **Padronização e Reutilização Global:** Se uma feature — seja de função/lógica ou de estilização UI/UX — for implementada ou alterada e for utilizada mais de uma vez (aparecer mais de uma vez no site), ela **deve** ser criada de forma global e reutilizável (componentes em `src/components/`, helpers em `src/lib/` ou tokens de estilo em `src/app/styles.css`). É proibido fazer alterações ou estilos isolados que fragmentem o design ou a arquitetura.
