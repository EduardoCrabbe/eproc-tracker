import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Instanciar o client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# O prompt pode vir do banco (configurado pelo Gerente), mas aqui temos o fallback
DEFAULT_PROMPT = """
Você é um assistente da equipe de Customer Success (Reis Revisional). 
Seu papel é analisar o áudio ou vídeo do atendimento e gerar um relatório do que ocorreu.

REGRAS OBRIGATÓRIAS:
1. Escreva o relatório estritamente em PRIMEIRA PESSOA. (Exemplo: "Liguei para o cliente e informei que...")
2. Remova qualquer menção a CPF, caso o cliente ou atendente tenha dito no áudio.
3. Seja conciso, claro e focado nas ações realizadas e no status do cliente.
"""

def summarize_attendance(file_path: str, custom_prompt: str = None) -> str:
    """
    Usa a API do Gemini para transcrever/analisar o arquivo (áudio/vídeo) 
    e retornar o resumo na primeira pessoa.
    """
    prompt_to_use = custom_prompt if custom_prompt else DEFAULT_PROMPT
    
    # Fazer o upload do arquivo para a API do Gemini
    uploaded_file = client.files.upload(file=file_path)
    
    # Gerar o conteúdo usando a IA Multimodal
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            uploaded_file,
            prompt_to_use
        ]
    )
    
    # Limpar o cache do arquivo nos servidores do Gemini após a inferência
    try:
        client.files.delete(name=uploaded_file.name)
    except Exception as e:
        print(f"Erro ao deletar arquivo do Gemini: {e}")
        
    return response.text
