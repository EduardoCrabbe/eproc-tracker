# CS Manager App (Reis Revisional)

Uma aplicação desktop leve desenvolvida para a equipe de Customer Success (CS) visando centralizar o controle de clientes, automatizar processos no Eproc (rodando em background) e oferecer um sistema de comissionamento inteligente com sumarização de atendimentos utilizando Inteligência Artificial (Gemini).

## Principais Funcionalidades
- **Gestão Anonimizada:** Operação garantida através de planilhas separadas (uma para automação e uma anônima para visualização do CS).
- **Gamificação/Comissionamento:** Controle automático de comissões por Quitações, Avaliações no Google, Reclame Aqui, e Depoimentos por Vídeo.
- **Inteligência Artificial:** Relatórios transcritos e resumidos na primeira pessoa a partir de áudios e vídeos via Gemini.
- **Automação Eproc:** Navegação automática em background (`headless`) para checagem e atualizações de processos, minimizando erros manuais.

## Tecnologias
- **Frontend:** React.js com Vite.
- **Backend:** Python com FastAPI.
- **Banco de Dados:** SQLite (Embutido).
- **Automação Web:** `undetected-chromedriver`.

## Pré-requisitos
- **Node.js** (v18+) e `npm`.
- **Python** (v3.10+) e `pip` ou `uv`.
- Chave da API do Google Gemini (Deve ser configurada na interface pelo Gerente ou inserida no arquivo `.env` do backend).

## Inicialização Rápida
*O script `start.bat` será criado em breve para inicializar ambos os servidores de desenvolvimento simultaneamente.*
