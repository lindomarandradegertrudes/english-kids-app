# English Kids App

**Jogos e acompanhamento de Língua Inglesa – 3º ao 5º ano**

Sistema web para o professor de Língua Inglesa dos Anos Iniciais: as crianças aprendem o vocabulário com jogos no Chromebook, e o professor acompanha a evolução de cada aluno e de cada turma.

Roda **gratuitamente** no Google Workspace da escola, com Google Apps Script e Google Planilhas.

## Etapas

| Etapa | Conteúdo | Situação |
|---|---|---|
| 1 | Planilha, turmas, cadastro com bichinho, painel, temas dos Mapas 2026, teste de voz e microfone | ✅ entregue |
| 2 | Jogos: Listen & Click, Memory, Match it! e Spell it!; domínio por palavra, estrelinhas e aba Progresso | ✅ entregue |
| 3 | Diagnóstico e quizzes mensais montados a partir dos temas, prova impressa e níveis (só avaliações) | ✅ entregue |
| 4 | Equipes de até 5 alunos (níveis misturados) e placar mensal por equipes | ✅ entregue |
| 5 | Mais jogos: Find it! (caça-palavras), Color it!, Build it! (frases), Spelling Bee e Repeat after me | ✅ entregue |
| + | Speak! (pronúncia com microfone): retirado, porque o reconhecimento de voz falhava muito com as crianças | ❌ removido |
| 6 | Relatórios: comparativo das turmas, palavras difíceis, ficha do aluno (impressão) e exportação para planilha | ✅ entregue |

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `Codigo.gs` | Instalação, acesso à planilha, permissões, turmas, cadastro e painel |
| `Temas.gs` | Temas: leitura, validação, edição, importação e geração com IA |
| `TemasPadrao.gs` | Os 24 temas padrão (3º, 4º e 5º ano), baseados no Mapa de Progressão 2026 de Joinville |
| `Jogos.gs` | Partidas, domínio por palavra, estrelas e progresso da turma |
| `JogosTela.html` | Os 9 jogos (Listen & Click, Memory, Match it!, Spell it!, Find it!, Color it!, Build it!, Spelling Bee, Repeat after me) |
| `Avaliacoes.gs` | Diagnóstico e quizzes: montagem das questões, correção, lançamento de impressos e níveis |
| `Equipes.gs` | Equipes mensais e placar |
| `Relatorios.gs` / `ProfRelatorios.html` | Relatórios, ficha do aluno e exportação |
| `Professor.html` / `ProfTemas.html` / `ProfProgresso.html` / `ProfAvaliacoes.html` / `ProfEquipes.html` | Painel do professor e abas de Temas, Progresso, Avaliações e Equipes |
| `Aluno.html` / `AlunoCorpo.html` | Tela da criança (o modelo `Aluno` só inclui arquivos; todo o código fica em `AlunoCorpo`) |
| `Fala.html` | Voz em inglês do Chrome |
| `Teste.html` / `TesteConteudo.html` | Teste de voz (`?teste=1`) |
| `Estilo.html` / `Marca.html` | Estilos compartilhados e marca do cabeçalho (bandeira + nome) |

## Privacidade

Os dados dos alunos ficam somente na planilha do professor, dentro da conta Google da escola. A voz é a do próprio Chrome, e nada é gravado. A geração de temas com IA, que é opcional, envia apenas o conteúdo pedagógico.

## Autor

Lindomar Andrade Gertrudes, professor de Língua Inglesa.
