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
| M6 | Nota (0 a 10) e parecer do trimestre por turma: média do trimestre sem o diagnóstico, nota manual, rascunho automático do parecer, copiar, planilha no Drive e impressão | ✅ entregue |
| M5 | Banco de missões do ano (24 temas × 3 degraus), gerador de missões sem custo (pedido para o Claude.ai gratuito + conferência + prévia), relatório mensal das missões e guia para crianças e famílias (`?guia=1`) | ✅ entregue |
| M4 | Rotina: tarefas do dia com dias completos e medalhas, miniprojetos com foto no Drive e rubrica de 3 carinhas (com nota opcional), "Ver o app como aluno" (aluno teste) | ✅ entregue |
| M3 | Habilidades do Mapa (ouvir, ler, escrever com códigos EF0xLI04/07/09-JO) por tema e turma, quadro na ficha do aluno e "Meu reforço" sem nota para a criança | ✅ entregue |
| M2 | Narrativa: tour do Max (Missão 0), mapa de aventura por série como tela inicial, 10 medalhas automáticas, acessórios do bichinho e casinha no "Meu cantinho" | ✅ entregue |
| M1 | Missões do mês com o Max: história + 4 desafios em 3 degraus, aula aberta/fechada pelo professor, reabertura para quem faltou, reforço individual e nota mensal no nível | ✅ entregue |
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
| `MissoesPadrao.gs` / `Missoes.gs` | Banco de missões e regras (aulas, reforço, nota do mês) |
| `MissaoTela.html` / `ProfMissoes.html` | Tela da missão (criança e prévia) e aba Missões do professor |
| `Boletim.gs` / `ProfBoletim.html` | Nota e parecer do trimestre (aba Boletim) |
| `MissoesAno.gs` / `MissoesBanco.gs` | Missões de março a setembro; banco completo, gerador sem custo e relatório das missões |
| `GuiaFamilias.html` | Guia para crianças e famílias (abre com `?guia=1`, para imprimir ou salvar em PDF) |
| `Rotina.gs` / `RotinaTela.html` | Tarefas do dia e aluno teste (servidor) e cartões de tarefas, miniprojetos e aviso do aluno teste (tela da criança) |
| `Projetos.gs` / `ProfProjetos.html` | Miniprojetos: fotos no Drive, rubrica de carinhas e nota; aba Projetos do professor |
| `Habilidades.gs` / `ProfHabilidades.html` | Habilidades do Mapa calculadas com jogos, quizzes e missões, e aba Habilidades do professor |
| `Narrativa.gs` / `NarrativaTela.html` | Medalhas, acessórios e tour (servidor) e mapa, cantinho e tour (tela da criança) |
| `Relatorios.gs` / `ProfRelatorios.html` | Relatórios, ficha do aluno e exportação |
| `Professor.html` / `ProfTemas.html` / `ProfProgresso.html` / `ProfAvaliacoes.html` / `ProfEquipes.html` | Painel do professor e abas de Temas, Progresso, Avaliações e Equipes |
| `Aluno.html` / `AlunoCorpo.html` | Tela da criança (o modelo `Aluno` só inclui arquivos; todo o código fica em `AlunoCorpo`) |
| `Fala.html` | Voz em inglês do Chrome |
| `Estilo.html` / `Marca.html` | Estilos compartilhados e marca do cabeçalho (bandeira + nome) |

## Privacidade

Os dados dos alunos ficam somente na planilha do professor, dentro da conta Google da escola. A voz é a do próprio Chrome, e nada é gravado. A geração de temas com IA, que é opcional, envia apenas o conteúdo pedagógico.

## Autor

Lindomar Andrade Gertrudes, professor de Língua Inglesa.
