# Arquitetura do Sistema

## Visão Geral
A aplicação segue uma arquitetura Cliente-Servidor local, ideal para uma aplicação desktop leve (com resposta super rápida) sem a necessidade de deploy complexo na nuvem, garantindo a retenção dos dados na própria máquina e privacidade total.

## Componentes Principais

### 1. Frontend (React + Vite)
- Interface de usuário rápida e responsiva construída com React.
- Consome a API do backend via HTTP (localhost).
- **Responsabilidades:** Dashboards de volumetria do CS, listagem de clientes (via planilhas anonimizadas), painel de comissionamento, e interface para gravação/upload de áudios e vídeos.

### 2. Backend (Python + FastAPI)
- API leve e robusta executando em `http://localhost:8000`.
- **Responsabilidades:**
  - Gerenciamento de persistência local com SQLite.
  - Orquestração da automação headless do Eproc (via `undetected-chromedriver`).
  - Comunicação com a API multimodal do Google Gemini.
  - Processamento de arquivos de áudio/vídeo para sumarização.

### 3. Banco de Dados (SQLite)
- Arquivo local (`database.db`) contendo as tabelas base e logs. Não requer instalação de serviços (como MySQL ou Postgres).

### 4. Integrações e Serviços
- **Eproc:** Automação em Background via Web Scraping para consultas em massa utilizando as planilhas seguras de CPF.
- **Gemini API:** Serviços de sumarização que recebe áudios, vídeos e textos brutos, formatando relatórios automaticamente em primeira pessoa.


---
> **🔗 Links Rápidos:** [[banco_de_dados|Banco de Dados]] | [[regras_negocio|Regras de Negócio]] | [[00 - Índice CS Manager|🏠 Voltar ao Índice Geral]]
