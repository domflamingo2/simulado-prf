# scripts/manutencao.py
import json
import os
import re
import hashlib
from datetime import datetime
from collections import Counter

class ManutencaoBanco:
    def __init__(self, pasta_questoes: str):
        self.pasta = pasta_questoes
        self.questoes = []
        self.arquivos_modificados = []
        self._carregar_questoes()
    
    def _carregar_questoes(self):
        """Carrega questões de todos os arquivos TS"""
        for arquivo in os.listdir(self.pasta):
            if not arquivo.endswith('.ts'):
                continue
            
            caminho = os.path.join(self.pasta, arquivo)
            with open(caminho, 'r', encoding='utf-8') as f:
                self.questoes.append({
                    'caminho': caminho,
                    'nome': arquivo,
                    'conteudo': f.read()
                })
    
    def _extrair_disciplina(self, nome_arquivo: str) -> str:
        """Extrai disciplina do nome do arquivo"""
        mapa = {
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
        # CORRIGIDO: usar o parâmetro correto nome_arquivo, não 'arquivo'
        nome_base = nome_arquivo.replace('.ts', '')
        return mapa.get(nome_base, 'DESCONHECIDA')
    
    def normalizar_arquivos(self):
        """Normaliza os arquivos TypeScript"""
        print("🔧 Normalizando arquivos...")
        
        for item in self.questoes:
            conteudo = item['conteudo']
            disciplina = self._extrair_disciplina(item['nome'])
            modificado = False
            
            # Garantir que todas as questões têm tags
            if 'tags?:' in conteudo or 'tags =' in conteudo:
                # Substituir tags opcionais por tags obrigatórias
                conteudo = re.sub(r'tags\?:\s*string\[\]', 'tags: string[] = []', conteudo)
                modificado = True
            
            # Garantir disciplina correta no campo
            padrao_disciplina = r'disciplina:\s*"([^"]+)"'
            
            # Função para corrigir disciplina (usando nonlocal)
            def corrigir_disciplina(match):
                nonlocal modificado
                if match.group(1) != disciplina:
                    modificado = True
                    return f'disciplina: "{disciplina}"'
                return match.group(0)
            
            conteudo = re.sub(padrao_disciplina, corrigir_disciplina, conteudo)
            
            if modificado:
                with open(item['caminho'], 'w', encoding='utf-8') as f:
                    f.write(conteudo)
                self.arquivos_modificados.append(item['nome'])
                print(f"   ✅ Normalizado: {item['nome']}")
        
        print(f"✅ {len(self.arquivos_modificados)} arquivos normalizados")
    
    def criar_backup(self):
        """Cria backup de todos os arquivos TS"""
        backup_dir = f"exports/backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(backup_dir, exist_ok=True)
        
        for item in self.questoes:
            backup_path = os.path.join(backup_dir, item['nome'])
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(item['conteudo'])
        
        print(f"💾 Backup criado em: {backup_dir}")
        return backup_dir
    
    def validar_consistencia(self):
        """Valida consistência dos dados"""
        print("🔍 Validando consistência...")
        
        problemas = []
        
        for item in self.questoes:
            conteudo = item['conteudo']
            
            # Verificar IDs duplicados no arquivo
            ids = re.findall(r'id:\s*"([^"]+)"', conteudo)
            duplicados = [id for id, count in Counter(ids).items() if count > 1]
            if duplicados:
                problemas.append(f"📄 {item['nome']}: IDs duplicados {duplicados}")
            
            # Verificar respostas válidas
            respostas = re.findall(r'resposta:\s*"([^"]+)"', conteudo)
            for resp in respostas:
                if resp not in ["CERTO", "ERRADO"]:
                    problemas.append(f"📄 {item['nome']}: Resposta inválida '{resp}'")
            
            # Verificar dificuldade
            dificuldades = re.findall(r'dificuldade:\s*(\d+)', conteudo)
            for diff in dificuldades:
                if diff not in ["1", "2", "3"]:
                    problemas.append(f"📄 {item['nome']}: Dificuldade inválida '{diff}'")
        
        if problemas:
            print("⚠️ Problemas encontrados:")
            for p in problemas[:10]:
                print(f"   - {p}")
        else:
            print("✅ Dados consistentes!")
        
        return problemas
    
    def executar_tudo(self):
        """Executa todas as tarefas de manutenção"""
        print("="*50)
        print("🛠️ MANUTENÇÃO DO BANCO DE QUESTÕES")
        print("="*50)
        
        backup = self.criar_backup()
        self.normalizar_arquivos()
        problemas = self.validar_consistencia()
        
        print("\n" + "="*50)
        print("✅ MANUTENÇÃO CONCLUÍDA!")
        print(f"💾 Backup: {backup}")
        print(f"📝 Arquivos modificados: {len(self.arquivos_modificados)}")
        
        return {'backup': backup, 'problemas': problemas}

def main():
    pasta = "src/data/questoes"
    
    if not os.path.exists(pasta):
        print(f"❌ Pasta não encontrada: {pasta}")
        return
    
    print(f"📁 Pasta de questões: {pasta}")
    print(f"📄 Arquivos encontrados: {[f for f in os.listdir(pasta) if f.endswith('.ts')]}\n")
    
    manutencao = ManutencaoBanco(pasta)
    manutencao.executar_tudo()

if __name__ == "__main__":
    main()