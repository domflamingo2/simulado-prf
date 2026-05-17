# scripts/scraper_questoes.py
import requests
from bs4 import BeautifulSoup
import json
import time
from typing import List, Dict

class QConcursosScraper:
    """Extrai questões da CEBRASPE do QConcursos"""
    
    def __init__(self):
        self.headers = {'User-Agent': 'Mozilla/5.0'}
        self.questoes = []
    
    def extrair_questoes_prf(self, paginas: int = 5):
        """Extrai questões da PRF (últimos concursos)"""
        for pagina in range(1, paginas + 1):
            url = f"https://www.qconcursos.com/questoes/bancas/cebraspe/cargos/policial-rodoviario-federal/pagina-{pagina}"
            
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            for item in soup.select('.question-item'):
                questao = {
                    'id': self._gerar_id(),
                    'disciplina': self._identificar_disciplina(item),
                    'enunciado': self._limpar_enunciado(item),
                    'resposta': self._extrair_gabarito(item),
                    'explicacao': self._extrair_comentario(item),
                    'dificuldade': self._calcular_dificuldade(item),
                    'ano': self._extrair_ano(item),
                    'banca': 'CEBRASPE',
                    'assunto': self._extrair_assunto(item)
                }
                self.questoes.append(questao)
            
            time.sleep(1)  # Delay para não sobrecarregar
            print(f"Página {pagina}: {len(self.questoes)} questões coletadas")
        
        return self.questoes
    
    def _identificar_disciplina(self, item) -> str:
        """Mapeia matéria para sua enumeração"""
        texto = item.select_one('.subject').text.lower()
        mapa = {
            'português': 'PORTUGUES',
            'ética': 'ETICA',
            'raciocínio lógico': 'RACIOCINIO_LOGICO',
            'direito constitucional': 'DIREITO_CONSTITUCIONAL',
            'direito administrativo': 'DIREITO_ADMINISTRATIVO',
            'informática': 'INFORMATICA',
            'legislação': 'LEGISLACAO_PRF'
        }
        for key, value in mapa.items():
            if key in texto:
                return value
        return 'ADMINISTRACAO'
    
    def _calcular_dificuldade(self, item) -> int:
        """Calcula dificuldade baseada em porcentagem de acertos"""
        acertos_text = item.select_one('.hit-rate')
        if acertos_text:
            percentual = float(acertos_text.text.replace('%', ''))
            if percentual < 30:
                return 3  # Difícil
            elif percentual < 60:
                return 2  # Médio
        return 1  # Fácil