# Eproc Tracker

**Projeto:** #ReisRevisional
**Tags:** #Automação #RPA #Python #Selenium #Jurídico #Cloudflare

O **Eproc Tracker** é uma ferramenta de automação (RPA) desenvolvida para o Projeto Reis Revisional. Seu objetivo é acessar o portal de consultas públicas do Eproc SP e rastrear movimentações processuais, atuando como um apoio automatizado ao time de Customer Success (CS).

---

## 🏗 Arquitetura do Robô

A arquitetura de software é dividida em duas grandes fases operacionais para lidar de forma inteligente com os dados limitados (ou abundantes) que a operação possui sobre cada cliente na `base_clientes.xlsx`:

### 1. Fase de Descoberta (Discovery)
Acionada quando temos **apenas o CPF** do cliente.
- **Fluxo:** O robô busca pelo CPF no Eproc.
- **Objetivo:** Como não há um processo específico, o sistema faz o download do código-fonte da página de resultados (`page_source.html`) e procura, via strings estáticas, por indicativos de risco (como _"BUSCA E APREENSÃO"_, _"EXECUÇÃO"_, _"MONITÓRIA"_).
- **Ação:** Identificada a ameaça, emite um status de alerta na planilha indicando que o CS precisa investigar manualmente.

### 2. Fase de Monitoramento (Monitoring)
Acionada quando temos **o CPF e o Número do Processo** exato do cliente.
- **Fluxo:** Busca pelo CPF e, ao listar os processos, clica e acessa os detalhes do processo esperado.
- **Objetivo:** O robô extrai os dados mais recentes do processo usando **Regex**, capturando a *Classe da Ação*, *Data da Movimentação* e *Descrição da Movimentação*.
- **Ação:** Baseado em Regras de Negócio, avalia a criticidade. Por exemplo, uma classe de "Busca e Apreensão" que tenha movimentação de "Mandado" dispara um alerta vermelho `🚨 ALERTA VERMELHO`.

Para mais detalhes sobre as decisões técnicas, veja a documentação de arquitetura na pasta interna ou o código fonte em `eproc_consultant/scraper.py`.

---

## ⚙️ Tecnologias Utilizadas

- **[Python](https://www.python.org/)**: Linguagem principal do projeto.
- **[undetected-chromedriver](https://github.com/ultrafunkamigo/undetected-chromedriver)**: Biblioteca crítica para burlar a detecção antibot do **Cloudflare**. Opera manipulando as opções do Chrome para evitar bloqueios no Eproc.
- **[Openpyxl](https://openpyxl.readthedocs.io/en/stable/)**: Usado para leitura e escrita na planilha de controle sem corromper as planilhas existentes.
- **Regex**: Módulo nativo `re` para parsear o DOM do HTML sem depender de sobrecarga de processos de browser ao ler as páginas finais.

---

## 🛠 Configuração e Instalação

### Pré-requisitos
- Ter o **Google Chrome** instalado na máquina local (a versão deve ser pareada com a variável `version_main=147` no código, caso seja diferente, atualize em `scraper.py`).
- Ter o Python 3 instalado.

### Instalação
Crie seu ambiente virtual e instale as dependências.
```bash
python -m venv venv
source venv/Scripts/activate  # No Windows, use: .\venv\Scripts\activate
pip install undetected-chromedriver selenium openpyxl pandas
```

---

## 📂 Configurando a Planilha Base

A operação do robô depende do arquivo:
`platform_manager/base_clientes.xlsx`

Esta planilha atua como banco de dados temporário. **As duas primeiras colunas são obrigatórias**:
1. **CPF** (Coluna A)
2. **NÚMERO DO PROCESSO** (Coluna B) - _Se deixar em branco, ativa a Fase 1 (Discovery)_.

O robô gera automaticamente o relatório injetando colunas de `C` até `G` com os seguintes dados:
- Status da Consulta
- Classe da Ação
- Data da Movimentação
- Descrição da Movimentação
- Triagem (Alertas gerados pelas regras de negócios)

---

## 🚀 Como Executar o Bot

> [!WARNING] Importante!
> Não mantenha o arquivo `base_clientes.xlsx` aberto no Microsoft Excel durante a execução. O arquivo é bloqueado e o robô falhará ao tentar salvar o relatório final.

Para iniciar o processo de raspagem de dados, rode o script na raiz do repositório:

```bash
cd eproc_consultant
python test_scraper.py
```

O bot será inicializado **não-headless** (a janela abrirá). Isto é um requisito técnico no Eproc atual para ajudar no processamento seguro do Cloudflare e dos tempos de sessão estipulados via `WebDriverWait` (10s para estabilidade máxima). Acompanhe o log diretamente pelo terminal para ver a progressão do lote.
