# api/index.py
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import random
import os
import re
from datetime import datetime

app = FastAPI(title="PRF Simulado API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasta das questões
QUESTOES_PASTA = "src/data/questoes"

def carregar_todas_questoes() -> List[Dict]:
    """Carrega questões de todos os arquivos TypeScript"""
    questoes = []
    
    if not os.path.exists(QUESTOES_PASTA):
        print(f"⚠️ Pasta não encontrada: {QUESTOES_PASTA}")
        return []
    
    for arquivo in os.listdir(QUESTOES_PASTA):
        if not arquivo.endswith('.ts'):
            continue
        
        caminho = os.path.join(QUESTOES_PASTA, arquivo)
        try:
            with open(caminho, 'r', encoding='utf-8') as f:
                conteudo = f.read()
        except Exception as e:
            print(f"❌ Erro ao ler {arquivo}: {e}")
            continue
        
        # Extrair questões - padrão melhorado
        padrao_questao = r'{\s*id:\s*"([^"]+)"[^{}]*?enunciado:\s*"([^"]+)"[^{}]*?resposta:\s*"([^"]+)"[^{}]*?explicacao:\s*"([^"]+)"[^{}]*?dificuldade:\s*(\d+)[^{}]*?}'
        
        matches = re.finditer(padrao_questao, conteudo, re.DOTALL)
        
        for match in matches:
            try:
                id_q = match.group(1)
                enunciado = match.group(2)
                resposta = match.group(3)
                explicacao = match.group(4)
                dificuldade = int(match.group(5))
                
                # Extrair disciplina do nome do arquivo
                nome_base = arquivo.replace('.ts', '')
                disciplina_map = {
                    'administracao': 'ADMINISTRACAO',
                    'arquivologia': 'ARQUIVOLOGIA',
                    'direito-administrativo': 'DIREITO_ADMINISTRATIVO',
                    'direito-constitucional': 'DIREITO_CONSTITUCIONAL',
                    'etica': 'ETICA',
                    'informatica': 'INFORMATICA',
                    'legislacao-prf': 'LEGISLACAO_PRF',
                    'portugues': 'PORTUGUES',
                    'raciocinio-logico': 'RACIOCINIO_LOGICO'
                }
                disciplina = disciplina_map.get(nome_base, 'DESCONHECIDA')
                
                # Extrair tags do texto completo do match
                texto_match = match.group(0)
                tags = []
                tags_match = re.search(r'tags:\s*\[(.*?)\]', texto_match, re.DOTALL)
                if tags_match:
                    tags_str = tags_match.group(1)
                    tags = [t.strip().strip('"\'') for t in tags_str.split(',') if t.strip()]
                
                # Extrair ano
                ano = None
                ano_match = re.search(r'ano:\s*(\d+)', texto_match)
                if ano_match:
                    ano = int(ano_match.group(1))
                
                questoes.append({
                    'id': id_q,
                    'disciplina': disciplina,
                    'enunciado': enunciado.strip(),
                    'resposta': resposta,
                    'explicacao': explicacao.strip(),
                    'dificuldade': dificuldade,
                    'tags': tags,
                    'ano': ano
                })
            except Exception as e:
                print(f"⚠️ Erro ao processar questão em {arquivo}: {e}")
                continue
    
    print(f"✅ Carregadas {len(questoes)} questões de {len([f for f in os.listdir(QUESTOES_PASTA) if f.endswith('.ts')])} arquivos")
    return questoes

# Cache das questões
_QUESTIONS_CACHE = None

def get_questoes():
    global _QUESTIONS_CACHE
    if _QUESTIONS_CACHE is None:
        _QUESTIONS_CACHE = carregar_todas_questoes()
    return _QUESTIONS_CACHE

class QuestaoResponse(BaseModel):
    id: str
    disciplina: str
    enunciado: str
    resposta: str
    explicacao: str
    dificuldade: int
    tags: Optional[List[str]] = []
    ano: Optional[int] = None

@app.get("/")
async def root():
    return {
        "message": "API PRF Simulado",
        "version": "1.0.0",
        "total_questoes": len(get_questoes()),
        "endpoints": [
            "/health",
            "/questoes/random/{quantidade}",
            "/questoes/por-disciplina/{disciplina}",
            "/questoes/buscar?q={termo}",
            "/estatisticas"
        ]
    }

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

# CORRIGIDO: Para parâmetro de path, NÃO use Query
@app.get("/questoes/random/{quantidade}", response_model=List[QuestaoResponse])
async def get_random_questoes(quantidade: int = Path(..., ge=1, le=50, description="Número de questões aleatórias")):
    """Retorna questões aleatórias"""
    questoes = get_questoes()
    
    if not questoes:
        raise HTTPException(status_code=404, detail="Nenhuma questão encontrada")
    
    quantidade = min(quantidade, len(questoes))
    selecionadas = random.sample(questoes, quantidade)
    
    return selecionadas

# CORRIGIDO: Usar Path para parâmetro de caminho
@app.get("/questoes/por-disciplina/{disciplina}", response_model=List[QuestaoResponse])
async def get_questoes_por_disciplina(
    disciplina: str = Path(..., description="Nome da disciplina"),
    limit: int = Query(20, ge=1, le=100, description="Limite de questões")
):
    """Busca questões por disciplina"""
    questoes = get_questoes()
    
    filtradas = [q for q in questoes if q['disciplina'].upper() == disciplina.upper()]
    
    if not filtradas:
        raise HTTPException(status_code=404, detail=f"Disciplina {disciplina} não encontrada")
    
    return filtradas[:limit]

# Endpoint de busca com Query
@app.get("/questoes/buscar", response_model=List[QuestaoResponse])
async def buscar_questoes(
    q: str = Query(..., min_length=1, description="Termo de busca"),
    limit: int = Query(20, ge=1, le=100, description="Limite de resultados")
):
    """Busca questões por termo no enunciado ou explicação"""
    questoes = get_questoes()
    
    termo = q.lower()
    resultados = [
        q for q in questoes 
        if termo in q['enunciado'].lower() or 
           termo in q.get('explicacao', '').lower() or
           any(termo in tag.lower() for tag in q.get('tags', []))
    ]
    
    return resultados[:limit]

# Estatísticas
@app.get("/estatisticas")
async def get_estatisticas():
    """Retorna estatísticas do banco de questões"""
    questoes = get_questoes()
    
    if not questoes:
        return {
            "total": 0, 
            "por_disciplina": {}, 
            "por_dificuldade": {},
            "ultima_atualizacao": datetime.now().isoformat()
        }
    
    por_disciplina = {}
    por_dificuldade = {1: 0, 2: 0, 3: 0}
    
    for q in questoes:
        disc = q['disciplina']
        por_disciplina[disc] = por_disciplina.get(disc, 0) + 1
        por_dificuldade[q['dificuldade']] += 1
    
    return {
        "total": len(questoes),
        "por_disciplina": por_disciplina,
        "por_dificuldade": por_dificuldade,
        "disciplinas_disponiveis": list(por_disciplina.keys()),
        "ultima_atualizacao": datetime.now().isoformat()
    }

# Novo endpoint: Listar todas as disciplinas
@app.get("/disciplinas")
async def get_disciplinas():
    """Retorna lista de disciplinas disponíveis"""
    questoes = get_questoes()
    disciplinas = list(set(q['disciplina'] for q in questoes))
    return {
        "disciplinas": sorted(disciplinas),
        "total": len(disciplinas)
    }

# Novo endpoint: Questão por ID
@app.get("/questoes/{id}", response_model=QuestaoResponse)
async def get_questao_por_id(id: str):
    """Busca uma questão específica por ID"""
    questoes = get_questoes()
    
    for q in questoes:
        if q['id'] == id:
            return q
    
    raise HTTPException(status_code=404, detail=f"Questão com ID {id} não encontrada")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando API PRF Simulado...")
    print("📍 API disponível em: http://localhost:8000")
    print("📚 Documentação: http://localhost:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")