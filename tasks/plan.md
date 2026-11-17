# Refinamento premium — plano de implementação

Referência: `Bem_Me_Quero_Megaprompt_UIUX_Premium.md`.

Preservar identidade, hero, navegação, contatos configuráveis e alterações anteriores no workspace. Sem novas dependências de UI. Evidências em navegador; o PDF citado não está disponível no repositório.

1. Registrar baseline (390×844, 768×1024, 1440×900), auditar dados e fotografia.
2. Restaurar categorias circulares com imagem e nome; integrar `assets/sessions/banner-2.png` exclusivamente no banner de campanha.
3. Tratar conteúdo de demonstração e fotos incompatíveis sem excluir cadastros; padronizar superfícies, cards e rodapé.
4. Implementar movimento compartilhado, seletivo e progressivo, com alternativa reduced motion e sem ocultar conteúdo sem JavaScript.
5. Refinar filtros, loading, erro, imagens e previews administrativos onde necessário.
6. Validar rotas e interações em 320, 390, 768, 1024 e 1440 px; comparar screenshots, medir performance local e documentar pendências.

## Decisões e riscos

- Fotos de produto, depoimentos e políticas do seed precisam de confirmação comercial; pergunta enviada ao usuário. Não publicar conteúdo de demonstração como fato.
- Dados e imagens reais cadastrados pelo admin prevalecem. Não limpar banco nem executar seed destrutivo.
- Motion: um reveal focal no banner; stagger curto somente nos quatro círculos; feedback imediato em filtros e controles. Orçamento: transform/opacity, observer com cleanup, sem biblioteca adicional.
- Conferência visual em uma rodada agrupada e uma confirmação após correções; evitar ciclos de polimento.

Tarefas e checkpoints: `todo.md`. Resultado detalhado: `Bem_Me_Quero_Megaprompt_UIUX_Premium_resultado.md`.
