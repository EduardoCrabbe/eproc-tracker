import undetected_chromedriver as uc
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

class EprocScraper:
    """
    Motor de automação para o Eproc SP.
    Implementa Context Manager para gestão segura de recursos.
    """
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.driver = None

    def __enter__(self):
        print("⚙️ [SISTEMA] Inicializando motor web otimizado...")
        opcoes = uc.ChromeOptions()
        
        # Otimizações de performance: desativa GPU e bloqueia carregamento de imagens
        opcoes.add_argument("--disable-gpu")
        opcoes.add_argument("--no-sandbox")
        prefs = {"profile.managed_default_content_settings.images": 2}
        opcoes.add_experimental_option("prefs", prefs)

        # Inicializa o driver com o undetected_chromedriver e suporte nativo a headless
        # Especificamos version_main=147 para parear com a versão instalada no PC
        self.driver = uc.Chrome(options=opcoes, headless=self.headless, version_main=147)
        
        # Timeout global implícito de 10 segundos
        self.driver.implicitly_wait(10)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Garante o encerramento do processo do navegador, mesmo com falhas críticas
        if self.driver:
            self.driver.quit()
            print("🧹 [SISTEMA] Navegador fechado. Memória liberada.")
            
        # Se um erro ocorreu dentro do bloco 'with', ele será passado aqui para log
        if exc_type:
            print(f"💥 [FALHA CRÍTICA] Execução interrompida: {exc_val}")

    def consultar_processo(self, numero_processo: str = None, cpf: str = None):
        """
        Lógica principal de roteamento (Seletor NU vs CP).
        """
        if not numero_processo and not cpf:
            raise ValueError("É obrigatório fornecer o Número do Processo ou o CPF.")

        wait = WebDriverWait(self.driver, 10)
        
        print("🌐 Acessando portal Eproc SP...")
        self.driver.get("https://eproc-consulta.tjsp.jus.br/consulta_1g/externo_controlador.php?acao=tjsp@consulta_publica_eproc/consultar&tipoConsulta=CP&hash=f3c28e42b825498235ed8a74b028a6bc")
        
        try:
            # Passo 1: Aguardar a presença do dropdown selTipoPesquisa
            print("⏳ Aguardando carregamento do seletor de pesquisa...")
            select_element = wait.until(EC.presence_of_element_located((By.ID, "selTipoPesquisa")))
            dropdown = Select(select_element)
            
            if numero_processo:
                print(f"🔍 Prioridade 1: Buscando pelo Seletor NU (Processo: {numero_processo})")
                dropdown.select_by_value("NU")
                
                # Passo 2: Aguardar o campo numNrProcesso, limpar e injetar
                input_nu = wait.until(EC.element_to_be_clickable((By.ID, "numNrProcesso")))
                input_nu.clear()
                input_nu.send_keys(numero_processo)
                
            elif cpf:
                print(f"🔍 Fallback: Buscando pelo Seletor CP (CPF: {cpf})")
                dropdown.select_by_value("CP")
                
                # Passo 3: Aguardar o campo strDocParte, limpar e injetar
                input_cp = wait.until(EC.element_to_be_clickable((By.NAME, "strDocParte")))
                input_cp.clear()
                input_cp.send_keys(cpf)
                
            # Passo 4: Aguardar botão de consulta sbmConsultar e clicar
            print("⏳ Aguardando botão de consulta...")
            botao_consultar = wait.until(EC.element_to_be_clickable((By.ID, "sbmConsultar")))
            botao_consultar.click()
            print("🚀 Consulta enviada com sucesso!")
            
            # A pausa dinâmica para resolver o captcha antes de continuar
            input("⚠️ [SISTEMA] Resolva o Captcha no navegador. Após a página do processo carregar, pressione ENTER aqui no terminal para continuar...")
            
            print("⏳ Capturando código-fonte da página para análise estática...")
            with open("page_source.html", "w", encoding="utf-8") as f:
                f.write(self.driver.page_source)
            print("✅ HTML salvo em page_source.html!")
            
        except TimeoutException:
            print("❌ [TIMEOUT] O tempo limite foi atingido aguardando elementos na página. A página pode estar fora do ar ou lenta.")
        except Exception as e:
            print(f"💥 [ERRO] Falha durante a consulta: {e}")

    def aplicar_triagem(self, acao: str, movimentacao: str) -> str:
        """
        Core Business Rule: Execução vs Busca e Apreensão.
        """
        acao = acao.upper()
        movimentacao = movimentacao.upper()
        
        if "BUSCA E APREENSÃO" in acao:
            if "PETIÇÃO" in movimentacao or "MANDADO" in movimentacao:
                return "🚨 ALERTA VERMELHO"
        
        # Para casos de 'Execução' ou 'Busca' sem as palavras-chave
        return "✅ REGISTRO NORMAL"

# ==========================================
# Bloco de Teste Local Isolado
# ==========================================
if __name__ == "__main__":
    # Testamos com headless=False primeiro para você ver o robô funcionando visualmente
    with EprocScraper(headless=False) as scraper:
        # Usando o CNPJ do Banco do Brasil como CPF/CNPJ mockado para tentar trazer resultados reais
        scraper.consultar_processo(cpf="00.000.000/0001-91")
        
        # Testando as regras de triagem do CS
        alerta = scraper.aplicar_triagem("Busca e Apreensão", "Juntada de Petição Intermediária")
        print(f"Status da Triagem Mockada: {alerta}")
