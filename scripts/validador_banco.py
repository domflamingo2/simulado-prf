# scripts/validador_banco.py
import json
import re
from collections import Counter
from datetime import datetime
import os
import sys

class ValidadorBancoQuestoes:
    def __init__(self, pasta_questoes: str):
        self.pasta = pasta_questoes
        self.questoes = []
        self.erros = []
        self.avisos = []
        self.arquivos_processados = []
    
    def extrair_questoes_dos_ts_files(self):
        """Extrai questões dos arquivos TypeScript"""
        print("📖 Lendo arquivos TypeScript...")
        
        for arquivo in os.listdir(self.pasta):
            if not arquivo.endswith('.ts'):
                continue
            
            caminho = os.path.join(self.pasta, arquivo)
            with open(caminho, 'r', encoding='utf-8') as f:
                conteudo = f.read()
            
            # Extrair disciplina do arquivo
            disciplina = self._extrair_disciplina(arquivo)
            
            # Extrair questões usando regex
            questoes_no_arquivo = self._extrair_questoes_do_conteudo(conteudo, disciplina, arquivo)
            
            self.questoes.extend(questoes_no_arquivo)
            self.arquivos_processados.append({
                'arquivo': arquivo,
                'disciplina': disciplina,
                'quantidade': len(questoes_no_arquivo)
            })
            
            print(f"   📄 {arquivo}: {len(questoes_no_arquivo)} questões")
        
        print(f"\n✅ Total: {len(self.questoes)} questões em {len(self.arquivos_processados)} arquivos")
        return self.questoes
    
    def _extrair_disciplina(self, nome_arquivo: str) -> str:
        """Mapeia nome do arquivo para disciplina"""
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
        nome_base = nome_arquivo.replace('.ts', '')
        return mapa.get(nome_base, 'DESCONHECIDA')
    
    def _extrair_questoes_do_conteudo(self, conteudo: str, disciplina: str, arquivo: str) -> list:
        """Extrai questões usando regex do padrão do TypeScript"""
        questoes = []
        
        # Padrão para encontrar objetos de questão completos
        # Usando finditer para ter objetos match com .start() e .end()
        padrao_questao = r'{\s*id:\s*"([^"]+)"[^{}]*?disciplina:\s*"([^"]+)"[^{}]*?enunciado:\s*"([^"]+)"[^{}]*?resposta:\s*"([^"]+)"[^{}]*?explicacao:\s*"([^"]+)"[^{}]*?dificuldade:\s*(\d+)[^{}]*?}'
        
        matches = re.finditer(padrao_questao, conteudo, re.DOTALL)
        
        for match in matches:
            id_q = match.group(1)
            disc = match.group(2)
            enunciado = match.group(3)
            resposta = match.group(4)
            explicacao = match.group(5)
            dificuldade = int(match.group(6))
            
            # Extrair tags do texto completo do match
            texto_match = match.group(0)
            tags = []
            ano = None
            
            # Procurar tags
            tags_match = re.search(r'tags:\s*\[(.*?)\]', texto_match, re.DOTALL)
            if tags_match:
                tags_str = tags_match.group(1)
                tags = [t.strip().strip('"\'') for t in tags_str.split(',') if t.strip()]
            
            # Procurar ano
            ano_match = re.search(r'ano:\s*(\d+)', texto_match)
            if ano_match:
                ano = int(ano_match.group(1))
            
            questoes.append({
                'id': id_q,
                'disciplina': disc,
                'enunciado': enunciado,
                'resposta': resposta,
                'explicacao': explicacao,
                'dificuldade': dificuldade,
                'tags': tags,
                'ano': ano,
                'arquivo_origem': arquivo
            })
        
        return questoes
    
    def validar_tudo(self):
        """Executa todas as validações"""
        self.extrair_questoes_dos_ts_files()
        
        self.validar_ids_unicos()
        self.validar_enunciados()
        self.validar_respostas()
        self.validar_explicacoes()
        self.validar_campos_obrigatorios()
        self.validar_disciplinas_consistentes()
        
        resultado = {
            'valido': len(self.erros) == 0,
            'erros': self.erros,
            'avisos': self.avisos,
            'estatisticas': self.gerar_estatisticas(),
            'arquivos_processados': self.arquivos_processados,
            'timestamp': datetime.now().isoformat()
        }
        
        # Salvar relatório
        os.makedirs("reports", exist_ok=True)
        with open("reports/validacao_banco.json", "w", encoding="utf-8") as f:
            json.dump(resultado, f, indent=2, ensure_ascii=False)
        
        return resultado
    
    def validar_ids_unicos(self):
        ids = [q['id'] for q in self.questoes]
        duplicados = [id for id, count in Counter(ids).items() if count > 1]
        if duplicados:
            self.erros.append(f"❌ IDs duplicados: {duplicados}")
        else:
            print("✅ IDs únicos: OK")
    
    def validar_enunciados(self):
        for q in self.questoes:
            if len(q['enunciado']) < 20:
                self.avisos.append(f"⚠️ Q{q['id']}: Enunciado muito curto ({len(q['enunciado'])} caracteres)")
        print(f"✅ Enunciados validados: {len(self.questoes)} questões")
    
    def validar_respostas(self):
        respostas_validas = {"CERTO", "ERRADO"}
        for q in self.questoes:
            if q['resposta'] not in respostas_validas:
                self.erros.append(f"❌ Q{q['id']}: Resposta inválida '{q['resposta']}'")
        print("✅ Respostas validadas: OK")
    
    def validar_explicacoes(self):
        for q in self.questoes:
            if not q.get('explicacao') or len(q['explicacao']) < 10:
                self.avisos.append(f"⚠️ Q{q['id']}: Explicação muito curta ou ausente")
        print("✅ Explicações validadas")
    
    def validar_campos_obrigatorios(self):
        obrigatorios = ['id', 'disciplina', 'enunciado', 'resposta', 'explicacao', 'dificuldade']
        for q in self.questoes:
            for campo in obrigatorios:
                if campo not in q or not q[campo]:
                    self.erros.append(f"❌ Q{q.get('id', 'unknown')}: Campo obrigatório '{campo}' ausente")
        print("✅ Campos obrigatórios validados")
    
    def validar_disciplinas_consistentes(self):
        """Verifica se a disciplina do arquivo corresponde ao campo disciplina"""
        for q in self.questoes:
            disciplina_arquivo = self._extrair_disciplina(q.get('arquivo_origem', ''))
            if disciplina_arquivo and q['disciplina'] != disciplina_arquivo:
                self.avisos.append(f"⚠️ Q{q['id']}: Disciplina no campo ({q['disciplina']}) difere do arquivo ({disciplina_arquivo})")
        print("✅ Disciplinas consistentes")
    
    def gerar_estatisticas(self):
        disciplinas = Counter(q['disciplina'] for q in self.questoes)
        dificuldades = Counter(q['dificuldade'] for q in self.questoes)
        
        return {
            'total_questoes': len(self.questoes),
            'por_disciplina': dict(disciplinas),
            'por_dificuldade': dict(dificuldades),
            'media_dificuldade': sum(q['dificuldade'] for q in self.questoes) / len(self.questoes) if self.questoes else 0,
            'por_arquivo': self.arquivos_processados
        }

def main():
    # Caminho para a pasta de questões
    pasta = "src/data/questoes"
    
    if not os.path.exists(pasta):
        print(f"❌ Pasta não encontrada: {pasta}")
        return
    
    print("🔍 Validando banco de questões...\n")
    validador = ValidadorBancoQuestoes(pasta)
    resultado = validador.validar_tudo()
    
    print("\n" + "="*50)
    print("📊 RESULTADO DA VALIDAÇÃO")
    print("="*50)
    
    if resultado['valido']:
        print("✅ BANCO VÁLIDO! Sem erros críticos.")
    else:
        print(f"❌ BANCO COM {len(resultado['erros'])} ERROS!")
        for erro in resultado['erros']:
            print(f"   {erro}")
    
    print(f"\n📈 Estatísticas:")
    print(f"   Total de questões: {resultado['estatisticas']['total_questoes']}")
    print(f"   Média de dificuldade: {resultado['estatisticas']['media_dificuldade']:.1f}")
    print(f"\n   Por disciplina:")
    for disc, qtd in sorted(resultado['estatisticas']['por_disciplina'].items()):
        print(f"     - {disc}: {qtd}")
    
    print(f"\n   Por arquivo:")
    for arq in resultado['estatisticas']['por_arquivo']:
        print(f"     - {arq['arquivo']}: {arq['quantidade']} questões")
    
    if resultado['avisos']:
        print(f"\n⚠️ Avisos ({len(resultado['avisos'])}):")
        for aviso in resultado['avisos'][:10]:
            print(f"   {aviso}")
    
    print(f"\n📁 Relatório salvo em: reports/validacao_banco.json")

if __name__ == "__main__":
    main()