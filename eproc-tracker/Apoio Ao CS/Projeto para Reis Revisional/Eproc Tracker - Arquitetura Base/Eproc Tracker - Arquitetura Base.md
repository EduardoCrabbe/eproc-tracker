---
titulo: Eproc Tracker - Arquitetura e Fundação
data_criacao: 2026-05-23
status: Em Desenvolvimento
tags:
  - 
  - 
  - 
  - 
  -
---

# 🤖 Eproc Tracker

## 📌 Visão Geral
Aplicação local de baixo consumo computacional desenvolvida para a Reis Revisional. O objetivo é ler planilhas de clientes e rastrear movimentações processuais no Eproc SP, aplicando triagem inteligente de Customer Success.

## 🛠️ Stack Tecnológica
* **Linguagem:** Python 3
* **Manipulação de Dados:** `openpyxl` (Modo Read-Only para Memory Efficiency)
* **Motor Web:** `undetected-chromedriver` (Camuflagem Anti-Bot)
* **Versionamento:** Git / GitHub

---

## 🏛️ Decisões de Engenharia (Design Patterns)

### 1. Padrão Fail-Fast (QA Tester)
Implementado via `qa_tester.py`. Antes de iniciar o motor web, o sistema valida fisicamente o contrato de dados da planilha de entrada (exigindo as colunas `CPF` e `NÚMERO DO PROCESSO`). Falhas aqui abortam a execução em milissegundos, economizando RAM.

### 2. Prevenção de Memory Leak (Context Manager)
O motor do robô (`EprocScraper`) foi construído utilizando os métodos mágicos `__enter__` e `__exit__`. Independentemente de crashs, timeouts ou falhas de rede, o processo do navegador é obrigatoriamente destruído e a memória devolvida ao Windows.

### 3. Bypass de Segurança (Modo Cyborg)
Devido ao bloqueio inicial do **Cloudflare Turnstile**, o *ChromeDriver* nativo foi substituído pelo `undetected-chromedriver`. 
* **Tática atual:** O robô pausa dinamicamente esperando a resolução manual (humana) do CAPTCHA antes de prosseguir para a extração (Abordagem Humano+Máquina).

---

## 🔄 Regra de Negócio Central (Triagem)
Prioridade de Busca: `[[Seletor NU]]` (fallback para `[[Seletor CP]]`).
* **Execução Normal:** Extrai Data e Movimentação.
* **Alerta Crítico:** Se Ação = "Busca e Apreensão" **E** Movimentação contiver ("Petição" OR "Mandado") ➡️ **🚨 ALERTA VERMELHO**.

---

## 🚀 Próximos Passos (Fase de Extração)
- [ ] Clonar repositório no ambiente de produção (Escritório).
- [ ] Injetar dados reais (Mock CPFs).
- [ ] Mapear DOM da tela de resultados (Classe/Ação e Tabela de Movimentações).
- [ ] Construir loop iterativo de leitura e escrita do Excel.
- [ ] 