# CS Manager App (Reis Revisional)

Esta aplicação desktop leve integrará controle de clientes, automação do Eproc, gamificação de atendimentos e sumarização via IA (Gemini). A arquitetura é composta por um Frontend em React/Vite e um Backend Local em Python.

## Decisões Arquiteturais Definidas

- **Tecnologia do Backend Local:** FastAPI + SQLite.
- **Distribuição da Aplicação:** Execução via scripts de inicialização locais (ex: `start.bat`).
- **Integração Eproc:** `undetected-chromedriver` executado estritamente em **background (headless)** para evitar interrupções.
- **Anonimização (Privacidade):** Separação em planilhas diferentes. A planilha com CPFs servirá apenas para processamento da automação, enquanto o frontend que o CS visualiza mostrará apenas o DataJuri ID e/ou Número do Processo, garantindo a anonimidade.

## Proposed Changes

Abaixo está o plano que cobre as responsabilidades do **Agente 1 (Documentação)**, **Agente 2 (Desenvolvimento)** e **Agente 3 (Testes)**.

### Agente 1: Documentação & Arquitetura (Mapeamento Inicial)

As seguintes documentações e estruturas base serão criadas no repositório:
- `README.md`: Visão geral, pré-requisitos, instruções de instalação e execução.
- `.gitignore`: Proteção de arquivos sensíveis como `.env` (Chave Gemini) e arquivos de build/cache.
- `docs/git-flow.md`: Estratégia de versionamento com `main`, `develop`, e `feature/*`.
- `docs/arquitetura.md` e Diagramas: Comunicação Frontend (React) ↔ Backend (FastAPI).
- `docs/banco_de_dados.md`: Modelagem focada em anonimização (`Primeiro Nome` e `ID do DataJuri`).
- `docs/regras_negocio.md`: Manual de cálculo de comissionamento (Quitações, Comentários no Google/Reclame Aqui, Fotos, Depoimentos por Vídeo) e regras de RBAC (Gerente, Supervisor, CS).

### Agente 2: Desenvolvimento (A Execução)

#### Backend (Python/FastAPI)
- **Autenticação & RBAC:** Implementação de JWT para controle de sessão (Gerente, Supervisor, CS).
- **Banco de Dados (SQLite):**
  - Tabela `users` (id, username, role, level_cs)
  - Tabela `customers` (id_datajuri, first_name)
  - Tabela `attendances` (id, user_id, customer_id, timestamp, ai_summary, commission_value, type, evidence_file)
- **Integração Eproc:**
  - Script usando `undetected-chromedriver`.
  - Rotinas rigorosas com blocos `try/finally` para fechar o driver em caso de erro, prevenindo *memory leaks*.
- **Integração Gemini:**
  - Endpoint `/api/ai/summarize` que consome a chave do `.env`. Deve suportar recebimento de **áudio/gravação** para transcrever atendimentos em vídeo/ligação/presencial e instruir a IA a formatar o relatório na **primeira pessoa**.
  - Endpoint protegido `/api/ai/prompt` (Acesso apenas para 'Gerente') para alterar as instruções da IA (salvas no DB).

#### Frontend (React/Vite)
- **Dashboard:** Telas no estilo Power BI usando bibliotecas de gráficos (Recharts ou Chart.js) para exibir volumetria de clientes.
- **Planilha:** Interface tipo tabela de dados para visualização de clientes e atendimentos.
- **Comissionamento e Lançamentos:**
  - Interface para o CS registrar Quitações, Comentários (Google/Reclame Aqui), Fotos e Depoimentos por vídeo.
  - Componente para upload de arquivos de áudio/gravação, enviando para a API do Gemini gerar o resumo do atendimento.
- **Telas Restritas:** Telas de configuração do Prompt de IA ocultas/bloqueadas para CS e Supervisor.

### Agente 3: Validação e Testes (QA)

- **Testes de Segurança:** Tentativas automatizadas/manuais de inserir CPFs válidos e inválidos, validando a rejeição pelo Backend.
- **Testes de Permissões (RBAC):** Scripts de teste em Python (pytest) acessando endpoints de Gerente com token de CS.
- **Testes de Desempenho e Vazamento de Memória:** Execução massiva da rotina do Eproc (abrir/fechar navegador) simulando múltiplas requisições, acompanhada do monitoramento de RAM e CPU.
- **Testes de Comissionamento:** Testes funcionais no cálculo de recompensas cruzando o tipo de evento e o Nível do CS (ex: Depoimento por vídeo Nível 3 = R$ 20,00).

## Verification Plan

### Automated Tests
- Executar suíte `pytest` no backend cobrindo RBAC, rejeição de CPF (Regex de Data Privacy) e cálculos de Comissionamento.
- Testes unitários no frontend usando Vitest para regras de renderização de componentes baseadas no nível de permissão.

### Manual Verification
- Iniciar a aplicação localmente.
- Logar como `Gerente`, alterar o Prompt da IA, e verificar persistência.
- Logar como `CS`, tentar acessar a aba de configurações e garantir que o acesso é negado.
- Validar os cenários de comissionamento via tela e garantir que o relatório via áudio chegue processado em primeira pessoa.
- Checar uso de memória no Gerenciador de Tarefas do Windows durante execuções contínuas da automação Eproc.
