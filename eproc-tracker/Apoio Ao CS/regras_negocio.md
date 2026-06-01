# Regras de Negócio e Fluxos

## 1. Segurança e Privacidade (Data Privacy)
A identidade e segurança dos dados são fundamentais na aplicação.
- A aplicação utiliza o conceito de **Planilhas Separadas**:
  - **Planilha 1 (Consultas Eproc):** Contém os dados sensíveis, como CPFs e números completos de processo. Esta planilha é submetida e processada **exclusivamente** pelo Backend/Automação em background. Os dados não trafegam ou persistem na interface.
  - **Planilha 2 (Base de Atendimento):** Contém nome do CS, Nível do CS e ID DataJuri (ou identificador anônimo do cliente). Esta é a visão gerencial/operacional do Frontend.

## 2. Controle de Acesso (RBAC)
- **Gerente:** Acesso irrestrito a todas as planilhas, comissionamentos e edição da *System Prompt* (instruções mestras) do Gemini.
- **Supervisor:** Acesso focado na gestão da equipe (CS) e extração de relatórios.
- **CS:** Acesso puramente operacional. Apenas lança os próprios comissionamentos e importa os áudios dos seus atendimentos.

## 3. Tabela de Comissionamento Automático
O backend calculará a comissão automaticamente com base no tipo de evento e no `level_cs` registrado no banco.

| Tipo de Ação                           | CS Níveis 1 e 2 | CS Níveis 3, 4 e 5 |
| :------------------------------------- | :-------------- | :----------------- |
| **Atendimento de Rotina**              | R$ 1,00         | R$ 1,50            |
| **Quitação**                           | R$ 5,00         | R$ 10,00           |
| **Comentário Google (Positivo)**       | R$ 5,00         | R$ 10,00           |
| **Foto com Boleto (Quitação)**         | R$ 5,00         | R$ 10,00           |
| **Reclame Aqui (Comentário Positivo)** | R$ 10,00        | R$ 15,00           |
| **Depoimento por Vídeo**               | R$ 15,00        | R$ 20,00           |

## 4. IA e Resumos (Gemini)
- Quando o atendimento ocorrer via chamada de vídeo, ligação telefônica ou de forma presencial, o CS irá submeter um **áudio ou vídeo gravado** do atendimento na plataforma.
- A IA (Gemini 1.5 Flash/Pro Multimodal) processará o anexo e emitirá um relatório textual do evento.
- **Regra do Relatório:** Todos os resumos devem ser gerados obrigatoriamente na **primeira pessoa** (ex: "Falei com o cliente e orientei sobre..."), simulando que o próprio atendente digitou o registro de forma fluida e direta.


---
> **🔗 Links Rápidos:** [[banco_de_dados|Banco de Dados]] | [[arquitetura|Arquitetura]] | [[00 - Índice CS Manager|🏠 Voltar ao Índice Geral]]
