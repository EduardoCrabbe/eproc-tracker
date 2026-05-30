# Modelagem de Banco de Dados

O banco de dados utilizado é o **SQLite**, devido a sua natureza local e leveza.

## Tabelas Principais

### `users` (Funcionários / Equipe)
Armazena a equipe de operações.
- `id` (INT, PK)
- `username` (VARCHAR) - Nome de usuário para login.
- `password_hash` (VARCHAR) - Hash seguro da senha.
- `role` (VARCHAR) - Enumeração: `Gerente`, `Supervisor`, `CS`.
- `level_cs` (INT) - Nível do atendente CS (ex: 1, 2, 3, 4, 5). Usado para calcular o valor da comissão.

### `customers` (Clientes - Estrutura Anonimizada)
Armazena os clientes com quem os atendimentos ocorrem.
- `id_datajuri` (VARCHAR, PK) - Identificador único proveniente do sistema DataJuri / Processo.
- `first_name` (VARCHAR) - Apenas o primeiro nome ou nome parcial para não expor a identidade, conforme regras de privacidade.

### `attendances` (Atendimentos & Comissionamento)
Registra o histórico de atividades geradoras de comissão e atendimentos diários.
- `id` (INT, PK)
- `user_id` (INT, FK) - Relacionado à tabela `users`.
- `customer_id` (VARCHAR, FK) - Relacionado à tabela `customers`.
- `timestamp` (DATETIME) - Data e hora do registro.
- `type` (VARCHAR) - Enum: `Quitacao`, `Comentario_Google`, `Reclame_Aqui`, `Foto_Boleto`, `Video_Depoimento`, `Atendimento_Rotina`.
- `evidence_file` (VARCHAR) - Caminho ou hash do áudio/vídeo/imagem gravado ou anexado.
- `ai_summary` (TEXT) - Resumo do atendimento gerado pela IA (Gemini) em primeira pessoa.
- `commission_value` (DECIMAL) - Valor R$ calculado automaticamente com base no `level_cs` e `type`.


---
> **🔗 Links Rápidos:** [[arquitetura|Arquitetura]] | [[regras_negocio|Regras de Negócio]] | [[00 - Índice CS Manager|🏠 Voltar ao Índice Geral]]
