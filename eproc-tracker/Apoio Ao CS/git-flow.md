# Fluxo de Versionamento (Git Flow)

Este projeto utiliza uma abordagem baseada em Git Flow adaptada para manter a organização entre as camadas Frontend e Backend local.

## Branches Principais
- `main`: Reflete o estado atual de produção/estável do sistema. Commits diretamente nesta branch são restritos.
- `develop`: A branch principal de desenvolvimento. Novas features são mescladas aqui antes de ir para a `main`.

## Branches de Suporte
- `feature/*`: Criadas a partir de `develop`. Usadas para desenvolver novas funcionalidades (ex: `feature/gamificacao`, `feature/eproc-automation`).
- `bugfix/*` ou `hotfix/*`: Usadas para corrigir bugs encontrados durante os testes ou em produção.

## Regras Obrigatórias de Segurança
1. NUNCA comite o arquivo `.env` (Chaves de API do Gemini e configurações de Banco).
2. Garanta que planilhas com dados sensíveis (`.xlsx`, `.csv` contendo CPF) sejam ignoradas pelo Git. Isso está assegurado pelo nosso modelo de privacidade.


---
> **🔗 Links Rápidos:** [[README|Voltar ao README]] | [[00 - Índice CS Manager|🏠 Voltar ao Índice Geral]]
