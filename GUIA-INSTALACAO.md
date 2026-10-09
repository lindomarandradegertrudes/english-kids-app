# English Kids App — Guia de instalação

Faça tudo com a sua **conta institucional** (@edu.joinville.sc.gov.br).

---

# Etapa 5: banco do ano, gerador de missões, relatório das missões e guia para famílias (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `MissoesAno` | **novo:** **+ > Script**, nome `MissoesAno`, cole **MissoesAno.gs** |
| `MissoesBanco` | **novo:** **+ > Script**, nome `MissoesBanco`, cole **MissoesBanco.gs** |
| `GuiaFamilias` | **novo:** **+ > HTML**, nome `GuiaFamilias`, cole **GuiaFamilias.html** |
| `Codigo`, `Missoes` | apague tudo e cole as novas versões (.gs) |
| `Professor`, `ProfMissoes`, `NarrativaTela` | apague tudo e cole as novas versões (.html) |

Depois publique a nova versão (**Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**). Executar **instalar** é opcional: a aba **MissoesCriadas** é criada sozinha na primeira missão que você salvar.

## B. Banco de missões do ano inteiro
- Agora há **uma missão para cada um dos 24 temas** (8 por série), de março a novembro, todas em 3 degraus (★ ★★ ★★★).
- Na aba **Missões**, a lista "Abrir missão nesta aula" já vem com a missão do mês atual selecionada. Você pode escolher qualquer outra.
- A nota vai para o **mês em que você abriu a aula**, não importa o mês da missão. Por isso, dá para usar o banco em qualquer ano.
- Use os botões **▶ Prévia** para jogar como a criança antes da aula.

## C. Criar missão nova, sem custo (com o Claude.ai gratuito)
1. Na aba **Missões**, escolha a turma e clique em **✨ Criar missão nova** (no Banco de missões).
2. Escolha o tema e clique em **Preparar pedido**. O app monta um texto com as palavras do tema, as regras e um exemplo completo.
3. Clique em **📋 Copiar pedido** e em **Abrir o Claude.ai ↗**. Numa conversa nova, cole o pedido e envie.
4. Copie a resposta inteira do Claude, volte ao app, cole no campo 3 e clique em **Conferir**.
   - Se aparecer algum problema (por exemplo, uma palavra que não está no tema), cole a lista de problemas no Claude e peça: *"corrija estes problemas e responda só com o JSON"*. Ou corrija direto no texto.
5. Quando aparecer **✅ tudo certo**, veja a **▶ Prévia** nos 3 degraus e clique em **Salvar no banco**.
- A missão criada fica no banco da série com o botão **Excluir**. Depois de usada numa aula, ela não pode mais ser excluída, para não perder o histórico.

## D. Relatório das missões
Na aba **Missões**, abaixo das aulas, aparece o quadro **📊 Relatório de missões** da turma, com a escolha do mês:
- quantos alunos fizeram missão e a média da turma;
- a média em cada desafio (**Listen & Click, Read & Choose, Spell it!, Build it!**), para ver se a dificuldade maior é ouvir, ler, soletrar ou montar frases;
- as **palavras mais erradas** no mês (missão e reforço), boas para retomar em aula;
- cada aluno com as missões que fez (pontos e degrau), a média da missão, do reforço e a nota do mês.

## E. Guia para crianças e famílias
- Na aba **Turmas**, o cartão **📄 Guia para crianças e famílias** tem o botão **Abrir o guia ↗**.
- O guia explica como entrar, o que tem na tela, os jogos, o que vale nota, dicas para a família e o que fazer quando algo não funciona.
- Clique em **🖨️ Imprimir ou salvar PDF** e envie no Google Sala de Aula ou no grupo da turma.
- As crianças também abrem o guia pelo botão **❓ Help** no mapa.

---

# Etapa 4: rotina — tarefas do dia, miniprojetos e aluno teste (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Rotina` | **novo:** **+ > Script**, nome `Rotina`, cole **Rotina.gs** |
| `Projetos` | **novo:** **+ > Script**, nome `Projetos`, cole **Projetos.gs** |
| `RotinaTela` | **novo:** **+ > HTML**, nome `RotinaTela`, cole **RotinaTela.html** |
| `ProfProjetos` | **novo:** **+ > HTML**, nome `ProfProjetos`, cole **ProfProjetos.html** |
| `Codigo`, `Jogos`, `Narrativa`, `Missoes`, `Avaliacoes` | apague tudo e cole as novas versões (.gs) |
| `Aluno`, `AlunoCorpo`, `NarrativaTela`, `Professor`, `ProfRelatorios` | apague tudo e cole as novas versões (.html) |

Depois faça o seguinte:
1. Salve (💾) e execute **instalar**. Desta vez o Google vai pedir uma **permissão nova, do Google Drive**: é para guardar as fotos dos miniprojetos. Autorize.
   - A função cria as abas **Projetos** e **Entregas**, a coluna **teste** na aba Alunos e a pasta **English Kids App – Projetos** no seu Drive.
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**.

## B. Tarefas do dia (criança)
- Na tela inicial aparece o cartão **📋 Today's tasks**, com 3 tarefas curtas:
  1. 🏝️ Jogar um jogo na **ilha mais nova** (o tema liberado mais recente).
  2. 💪 Fazer o **Meu reforço**. Se a criança ainda não tem palavras fracas, vira ✏️ "jogar um jogo de escrever" (Spell it!, Spelling Bee ou Build it!).
  3. ⭐ Ganhar as **3 estrelas** em um jogo.
- O app confere sozinho com as partidas do dia. Quem faz as 3 ganha um **dia completo** (🌞).
- Dias completos dão medalhas novas: 🌞 1 dia → 🧸 ursinho na casinha; 📅 5 dias → 🌸 flor; 🗓️ 15 dias → 🎓 capelo.

## C. Miniprojetos (aba Projetos)
1. Clique em **+ Novo miniprojeto**: título, série, mês, instruções para a criança e até 4 critérios. Marque **Vale nota** se quiser que entre no nível.
2. As crianças da série veem o cartão **🎨 Mini project** e fazem o trabalho no papel. Depois tocam em **📷 Enviar foto**, tiram a foto com o Chromebook (ou escolhem uma já tirada), dizem como acham que ficou (😀 🙂 😐) e enviam.
   - A foto é reduzida antes de enviar, para não pesar na internet.
   - Ela vai para a pasta **English Kids App – Projetos** do seu Drive, com o nome "turma – aluno – projeto".
3. Para avaliar, clique em **Avaliar**, escolha a turma e marque uma carinha por critério: 😀 = 100, 🙂 = 70, 😐 = 40. A nota é a média.
   - Você pode escrever um recado curto, que a criança vê junto com as carinhas.
   - Quem fez no papel e não enviou foto também pode ser avaliado.
4. Se o projeto vale nota, ela entra no nível como um quiz e aparece na ficha do aluno como **"Miniprojeto: …"**.
5. O botão **Encerrar** fecha o envio de fotos. **Excluir** só funciona enquanto ninguém enviou foto nem foi avaliado.
6. O primeiro miniprojeto entregue dá a medalha 🎨, com tintas para a casinha.

## D. Ver o app como aluno (aba Turmas)
1. No cartão **👀 Ver o app como aluno**, escolha a turma e clique em **Preparar aluno teste**.
2. Clique em **Abrir a tela do aluno ↗**. Abre a tela da criança com a sua conta, como "Aluno Teste" daquela turma, com uma faixa amarela avisando que é o modo teste.
3. Dá para jogar, fazer as missões abertas da turma, responder quizzes e enviar fotos. Nada disso aparece em listas, relatórios, equipes, habilidades nem na contagem das missões.
4. Para mudar de turma, escolha outra e clique em **Preparar** de novo. **Zerar aluno teste** apaga tudo o que ele fez, inclusive as fotos.

---

# Tamanho das equipes escolhido na hora (atualização)

## A. Atualizar o código
No editor do Apps Script, apague tudo e cole as novas versões de `Equipes` (.gs) e `ProfEquipes` (.html). Depois publique a nova versão (**Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**).

## B. Como usar
- Na aba **Equipes**, abra a turma. Ao lado de **✨ Gerar sugestão** há o campo **Alunos por equipe** (de 2 a 10).
- O campo já vem com o tamanho das equipes atuais da turma (ou com o valor de `tamanho_max_grupo` da aba Config, se a turma ainda não tem equipes).
- Ao mudar o número, aparece a prévia, por exemplo **→ 6 equipes (5 com 4 e 1 com 3 alunos)**. Clique em **Gerar sugestão** para montar as equipes com esse tamanho.
- O número também é o limite ao **Aplicar**: se você mover alguém e uma equipe passar do tamanho escolhido, ela fica com borda vermelha e o sistema avisa.
- Cada turma e cada mês pode ter um tamanho diferente.

---

# Etapa 3: habilidades do Mapa e Meu reforço (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Habilidades` | **novo:** clique em **+ > Script**, dê o nome `Habilidades` e cole **Habilidades.gs** |
| `ProfHabilidades` | **novo:** clique em **+ > HTML**, dê o nome `ProfHabilidades` e cole **ProfHabilidades.html** |
| `Codigo`, `Jogos`, `Relatorios` | apague tudo e cole as novas versões (.gs) |
| `Aluno`, `AlunoCorpo`, `Professor`, `ProfRelatorios` | apague tudo e cole as novas versões (.html) |
| `Teste`, `TesteConteudo` | **apague os dois arquivos** (⋮ ao lado do nome > Excluir) |

Depois publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. Não é preciso executar **instalar**.

## B. Aba Habilidades (professor)
- Escolha a turma. **Turma por tema** mostra, para cada tema, a média da turma em três habilidades do Mapa de Progressão:

| Habilidade | Código (ex.: 4º ano) | De onde vem |
|---|---|---|
| 👂 Ouvir | `EF04LI04-JO` | Listen & Click, Color it!, questões "ouvir" dos quizzes, desafio Listen & Click das missões |
| 📖 Ler | `EF04LI07-JO` | Match it!, Memory, Find it!, questões "ler" e "figura" dos quizzes, desafio Read & Choose das missões |
| ✏️ Escrever | `EF04LI09-JO` | Spell it!, Spelling Bee, Build it!, desafios Spell it e Build it das missões |

- O código muda com a série: `EF03…` no 3º ano e `EF05…` no 5º.
- Clique numa célula para ver os alunos daquele tema e habilidade, do menor para o maior resultado, com o aviso de quem está abaixo de 60%.
- **Alunos (todos os temas)** mostra cada criança nas três habilidades. Clique numa célula para ver o resultado por tema.
- **Como é calculado:** nos jogos valem as **5 partidas mais recentes** de cada tema e tipo, para mostrar como a criança está agora. Nos quizzes valem as questões respondidas **no app** (a prova impressa só guarda o total, não o acerto de cada questão). Nas missões vale a missão comum. Com menos de 3 respostas, a célula fica em branco (—).
- A **ficha do aluno** (aba Relatórios) ganhou o quadro **Habilidades do Mapa de Progressão**, com os códigos, o geral e cada tema.

## C. Meu reforço (criança)
- Na tela inicial aparece o cartão verde **💪 My practice · Meu reforço** quando a criança tem pelo menos 4 palavras fracas (domínio abaixo de 70%) nos temas que já jogou. Entram até 8 palavras, misturando os temas.
- Ela escolhe **Listen & Click**, **Match it!** ou **Spell it!**. O reforço **não vale nota e não dá estrelas**: só melhora o domínio das palavras, cada uma no tema de onde veio.

## D. Fim da aba "Teste do Chromebook"
A aba e a página de teste (`?teste=1`) foram removidas. Desde a saída do Speak!, ela só testava a voz, e qualquer botão 🔊 do app já faz esse teste. No lugar dela, a tela da criança mostra sozinha o aviso **🔇 A voz em inglês não está funcionando neste computador** quando o Chromebook não tem voz disponível.

---

# Etapa 2 da narrativa: mapa, medalhas, cantinho e tour do Max (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Narrativa` | **novo:** clique em **+ > Script**, dê o nome `Narrativa` e cole **Narrativa.gs** |
| `NarrativaTela` | **novo:** clique em **+ > HTML**, dê o nome `NarrativaTela` e cole **NarrativaTela.html** |
| `Codigo` | apague tudo e cole a nova versão (.gs) |
| `Aluno`, `AlunoCorpo` | apague tudo e cole as novas versões (.html) |

Depois faça o seguinte:
1. Salve (💾). Execute **instalar**: ela acrescenta a coluna **visual_json** na aba **Alunos**. Se você esquecer, o app cria a coluna sozinho na primeira vez que uma criança terminar o tour.
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**.

## B. O que muda para a criança
- **Tour com o Max (Missão 0):** no primeiro acesso depois da atualização, o Max apresenta o app em 7 passos curtos, falando em inglês e com o texto em português. Ele aparece uma vez só. O botão **🐶 Max's tour** repete o tour quando a criança quiser.
- **Mapa de aventura:** a tela inicial agora é um mapa com uma **ilha para cada tema** da série, em ordem de mês. As ilhas liberadas mostram quanto a criança já aprendeu e as estrelas. As ilhas futuras aparecem com 🔒 e o mês em que abrem. A ilha mais nova tem o selo **New!**. Liberar e ocultar temas continua igual (aba **Temas**).
- **Medalhas:** 10 medalhas ganhas sozinhas, sem você precisar fazer nada. Cada medalha libera um prêmio:

| Medalha | Como ganhar | Prêmio |
|---|---|---|
| 🎮 First game! | 1ª partida | 🎈 balão (casinha) |
| ⭐ 10 stars! | 10 estrelas | 🧢 boné |
| 🗺️ 3 islands! | jogar em 3 ilhas | 📚 livros (casinha) |
| 🌟 25 stars! | 25 estrelas | 🕶️ óculos |
| 🐶 Mission complete! | 1ª missão do Max | 🦴 ossinho (casinha) |
| 🎯 Super mission! | missão com 90 pontos ou mais | 🎀 laço |
| 💪 Strong learner! | 3 reforços | 🪴 plantinha (casinha) |
| 🏅 Island master! | uma ilha com 90% ou mais | 🖼️ quadro (casinha) |
| 💫 50 stars! | 50 estrelas | 🎩 cartola |
| 🏆 100 stars! | 100 estrelas | 👑 coroa |

- **Meu cantinho:** tocar no bichinho (no alto da tela) ou em **🏠 My corner** abre a casinha, a escolha de acessórios (cabeça e rosto), a lista de medalhas com o quanto falta e a troca de bichinho.
- Nada é gasto nem perdido: as medalhas são calculadas a partir das estrelas, partidas e missões que já estão na planilha. Por isso, quem já jogava antes ganha as medalhas na hora.

---

# Missões do mês com o Max (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `MissoesPadrao` | **novo:** clique em **+ > Script**, dê o nome `MissoesPadrao` e cole **MissoesPadrao.gs** |
| `Missoes` | **novo:** clique em **+ > Script**, dê o nome `Missoes` e cole **Missoes.gs** |
| `MissaoTela` | **novo:** clique em **+ > HTML**, dê o nome `MissaoTela` e cole **MissaoTela.html** |
| `ProfMissoes` | **novo:** clique em **+ > HTML**, dê o nome `ProfMissoes` e cole **ProfMissoes.html** |
| `Codigo`, `Relatorios` | apague tudo e cole as novas versões (.gs) |
| `Aluno`, `AlunoCorpo`, `Professor`, `ProfRelatorios` | apague tudo e cole as novas versões (.html) |

Depois faça o seguinte:
1. Salve (💾). Execute **instalar**: ela cria as abas **Sessoes** e **MissoesFeitas** (se você esquecer, o app cria sozinho na primeira missão).
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**.

## B. Na aula com Chromebook
1. Abra a aba **Missões**, escolha a turma e a missão do mês e clique em **▶ Abrir missão nesta aula**.
2. As crianças recarregam o app e veem o card azul **🐶 Max needs your help!** na tela inicial.
3. Cada criança faz a **missão** (cerca de 15 minutos, 4 desafios, de 0 a 100) e, logo depois, o **reforço** (cerca de 5 minutos, 2 desafios com as palavras que ela mais erra, de 0 a 100).
4. No fim da aula, clique em **Fechar aula**. Quem terminou nos últimos instantes e estava sem internet ainda tem 10 minutos para o resultado chegar.

## C. Quem faltou ou não terminou
1. Na lista **Aulas de missão**, clique em **Ver alunos**.
2. Marque as crianças (o botão **Marcar todos que não terminaram** ajuda) e clique em **Reabrir para os marcados**. Só elas voltam a ver a missão.
3. Depois que fizerem, clique em **Fechar para todos**.

## D. Nota e degraus
- **Nota do mês** = média de todas as missões e reforços feitos no mês. Ela entra no **nível** com o mesmo peso de um quiz. Quem não fez nenhuma missão no mês fica **sem nota** (não zero). Vale só a 1ª vez de cada missão.
- **Pontos de cada desafio:** acertou de primeira vale o desafio inteiro; na 2ª tentativa, metade; depois disso a resposta aparece e vale 0.
- **Degrau pelo nível da criança:**
  - ★ (Iniciante ou sem avaliação): 2 opções, nome da figura em inglês e português, falas do Max curtas e com tradução.
  - ★★ (Básico/Intermediário): 3 opções, nome em inglês, português só no botão 🇧🇷.
  - ★★★ (Avançado): 4 opções, nome em inglês, falas maiores com **palavras-chave sublinhadas** (passar o mouse ou tocar mostra a tradução) e letras extras no Spell it!.
- **Prévia:** no **Banco de missões**, os botões **▶ Prévia ★/★★/★★★** deixam você jogar como a criança, sem gravar nada.
- **Missões prontas:** outubro e novembro para o 3º (My pets, Toys), 4º (My body, Food and drinks) e 5º ano (The weather, Seasons and days).
- **Relatórios:** a nota aparece como **"Missões de outubro"** na ficha do aluno, no comparativo das turmas e na exportação.

---

# Remoção do Speak! (atualização)

O jogo **Speak!** foi retirado: o reconhecimento de voz falhava muito em entender a fala das crianças. A pronúncia continua sendo praticada no **🗣️ Repeat after me**.

## Atualizar o código
No editor, apague tudo e cole as novas versões de:
- `Codigo` ← **Codigo.gs**
- `Jogos` ← **Jogos.gs**
- `JogosTela` ← **JogosTela.html**
- `AlunoCorpo` ← **AlunoCorpo.html**
- `Fala` ← **Fala.html**
- `Teste` ← **Teste.html**
- `TesteConteudo` ← **TesteConteudo.html**

Depois publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. Não precisa executar `instalar`.

**O que muda:**
- O botão 🎤 Speak! sai dos temas.
- A página de teste (`?teste=1`) agora testa só a voz.
- As estrelas que as crianças já ganharam no Speak! continuam valendo no total e no placar do mês.

---

# Etapa 6 — Relatórios (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Relatorios` | **novo:** clique em **+ > Script**, dê o nome `Relatorios` e cole **Relatorios.gs** |
| `ProfRelatorios` | **novo:** clique em **+ > HTML**, dê o nome `ProfRelatorios` e cole **ProfRelatorios.html** |
| `Professor` | apague tudo e cole a nova versão (.html) |

Depois faça o seguinte:
1. Salve (💾).
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**.

Não precisa executar `instalar`. Se o Google pedir autorização na primeira exportação, autorize: é para criar a planilha no seu Drive.

## B. A aba Relatórios
- **Comparativo das turmas:** para cada série, mostra por turma:
  - alunos e avaliados;
  - média das avaliações e distribuição dos níveis;
  - quantos já jogaram e quantos jogaram neste mês;
  - domínio médio nos jogos, partidas e tempo.

  Embaixo, a **média das avaliações por mês** de cada turma.
- **Palavras com mais dificuldade:** escolha a série e veja duas listas, **nas avaliações** (% de acerto) e **nos jogos** (domínio médio). São boas candidatas para retomar em aula.
- **Ficha do aluno:** escolha a turma e o aluno. A ficha traz:
  - nível e média, avaliações feitas, estrelas, partidas, tempo, palavras dominadas e equipe;
  - **gráfico da evolução** nas avaliações, com as linhas das faixas de nível;
  - domínio em cada tema;
  - **palavras para reforçar**.

  Use **Imprimir / PDF** para levar a ficha à reunião de pais ou ao conselho de classe.
- **Imprimir / PDF:** imprime a vista que estiver aberta.
- **Exportar para planilha:** cria no seu Drive uma planilha com 5 abas: **Turmas**, **Alunos** (com a nota de cada avaliação), **Domínio por tema**, **Palavras** e **Equipes**.

---

# Etapa 5 — Mais jogos (atualização)

## A. Atualizar o código
Não há arquivos novos. No editor, apague tudo e cole as novas versões de:
- `Jogos` ← **Jogos.gs**
- `JogosTela` ← **JogosTela.html**

Depois publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. Não precisa executar `instalar`.

## B. Os 5 jogos novos (dentro de cada tema)

| Jogo | Como funciona | Conta no domínio da palavra |
|---|---|---|
| 🔍 **Find it!** | Caça-palavras com as figuras das palavras. A criança toca na 1ª e na última letra. | +10 por palavra achada |
| 🎨 **Color it!** | A voz diz "Color the cat blue". A criança escolhe a tinta e toca na figura. O 👀 mostra o comando escrito. | +25 de primeira / −15 por erro |
| 🧱 **Build it!** | Ouve a frase do tema e toca nos blocos na ordem. Aparece a tradução em português. | +10 nas palavras do tema que estão na frase |
| 🐝 **Spelling Bee** | Ouve a palavra (sem ver) e escreve no teclado da tela ou do Chromebook. O 💡 mostra a figura como dica. | +35 de primeira / −10 por erro |
| 🗣️ **Repeat after me** | Ouve e repete em voz alta, depois toca em 👍. | não conta (o microfone está bloqueado) |

**Estrelas:**
- Os jogos novos seguem a regra de sempre: 3 ⭐ para 90% ou mais, 2 ⭐ a partir de 70% e 1 ⭐ por terminar.
- No **Find it!**, as estrelas dependem de quantas vezes a criança marcou errado.
- O **Repeat after me** vale sempre 1 ⭐ de participação, porque não dá para conferir a pronúncia.

**Quando um jogo não aparece:** cada jogo só aparece se o tema tiver o que ele precisa.
- O **Color it!** não aparece em temas de cores (ficaria "Color the red blue").
- O **Build it!** precisa de pelo menos 3 frases no tema.
- **Spell it!**, **Spelling Bee** e **Find it!** não aparecem no tema do alfabeto, que tem só letras soltas.

---

# Etapa 4 — Equipes e placar (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Equipes` | **novo:** clique em **+ > Script**, dê o nome `Equipes` e cole **Equipes.gs** |
| `ProfEquipes` | **novo:** clique em **+ > HTML**, dê o nome `ProfEquipes` e cole **ProfEquipes.html** |
| `Codigo` | apague tudo e cole a nova versão (.gs) |
| `Aluno`, `Professor` | apague tudo e cole as novas versões (.html) |

Depois faça o seguinte:
1. Salve (💾). Execute **instalar**. Ela cria a aba **Equipes** sem apagar nada.
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**.

## B. Formar as equipes (todo mês)
1. Abra a aba **Equipes** e confira o mês no topo.
2. Clique em **Abrir** na turma e depois em **✨ Gerar sugestão**.
   - **Regra da sugestão:** equipes de até 5, com a mistura de níveis equilibrada pela média das avaliações.
   - **Quem ainda não fez avaliação:** entra nas equipes menores.
3. Ajuste com **Mover para…** se quiser e clique em **Aplicar equipes**.
4. **No mês seguinte:** **Manter equipes atuais neste mês** ou gere novas.
5. **Imprimir equipes:** lista com nome e bichinho, sem níveis.

As equipes têm nomes de time: 🦁 Lions, 🐬 Dolphins, 🚀 Rockets, 🐼 Pandas, 🦅 Eagles, 🐉 Dragons…

## C. Placar
- **Como a pontuação é feita:**
  - Cada criança soma a **melhor nota (1 a 3 ⭐) de cada jogo em cada tema** jogado no mês.
  - Os pontos da equipe são a **média de estrelas por membro** (ex.: 4 crianças somaram 34 ⭐ → equipe com ⭐ 8,5). Equipes menores não saem em desvantagem.
  - O placar zera a cada mês.
- **Na tela da criança:** a equipe dela, com os colegas e as estrelas com que ela ajudou, e o placar da turma com 🥇🥈🥉.
- **Na sala de aula:** clique em **🏆 Placar** para mostrar o placar grande (bom para projetar). Há o botão **⛶ Tela cheia**; se não funcionar, use **F11**.
- **Atualização:** o placar se atualiza a cada 2 minutos.
- **Privacidade:** níveis e notas nunca aparecem para as crianças.

---

# Etapa 3 — Diagnóstico, quizzes mensais e níveis (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Avaliacoes` | **novo:** clique em **+ > Script**, dê o nome `Avaliacoes` e cole **Avaliacoes.gs** |
| `ProfAvaliacoes` | **novo:** clique em **+ > HTML**, dê o nome `ProfAvaliacoes` e cole **ProfAvaliacoes.html** |
| `Codigo`, `Jogos` | apague tudo e cole as novas versões (.gs) |
| `Aluno`, `Professor`, `ProfProgresso` | apague tudo e cole as novas versões (.html) |

Depois faça o seguinte:
1. Salve (💾). Escolha a função **instalar** e clique em **▶ Executar**. Ela cria as abas **Questionarios** e **Respostas** sem apagar nada.
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**.

## B. Criar o diagnóstico (uma vez por série)
1. Abra a aba **Avaliações** e escolha a série no filtro (ex.: 3º ano).
2. Clique em **+ Diagnóstico**. Os temas do 1º e do 2º trimestre já vêm marcados.
3. Clique em **🎲 Montar questões**. São 10 questões, que alternam três tipos:
   - **👂 Ouvir:** a criança ouve a palavra e escolhe a figura.
   - **📖 Ler:** lê a palavra em inglês e escolhe a figura.
   - **🖼️ Figura:** vê a figura e escolhe a palavra em inglês.
4. **Revise as questões:**
   - **🔄 Trocar** sorteia outra palavra para aquela questão.
   - O seletor muda o tipo da questão.
   - **✕** remove a questão.
5. Clique em **Salvar**. Depois, na lista, clique em **Liberar para alunos**.
6. Repita para o 4º e o 5º ano.

## C. Quiz mensal
Clique em **+ Quiz mensal**. Os temas liberados do mês atual e do anterior já vêm marcados (você pode marcar outros). Monte, revise, salve e libere, como no diagnóstico.

## D. O que a criança vê
- **Na tela inicial:** um aviso amarelo **📝 Quiz time!**, ou **Let's start!** no diagnóstico, com o botão **Começar**.
- **Uma pergunta por tela:** figuras grandes, e 🔊 e 🐢 nas questões de ouvir. Ela pode voltar para a pergunta anterior.
- **No fim:** **Enviar ✅**. Ela **não vê a nota**, só "Great job!".
- **Sem internet:** as respostas ficam guardadas no Chromebook e são enviadas sozinhas depois.

## E. Prova impressa
1. Clique em **Imprimir prova** (no editor ou em Resultados). A prova sai com figuras grandes e alternativas A–D para marcar com X.
2. Nas questões **👂 de ouvir**, é você quem fala a palavra. Use **Imprimir gabarito**: ele traz as respostas, a sequência para lançar e **a lista das palavras para falar em voz alta** (fale 2 vezes cada).
3. **Para lançar as notas:** em **Resultados**, escolha a turma e digite as letras marcadas pela criança em ordem (ex.: `ABDCA…`; use `-` para questão em branco) ou só o número de acertos. Depois clique em **Salvar lançamentos**.

## F. Níveis
- **Como é calculado:** média simples das avaliações (diagnóstico + quizzes). **Os jogos não entram.**
- **Faixas:** Iniciante abaixo de 40%, Básico a partir de 40%, Intermediário a partir de 60% e Avançado a partir de 80%. Você pode mudar em **Configurações**.
- **Onde aparece:** só para você, nas abas **Alunos** e **Progresso**. As crianças veem apenas as estrelas.
- **Resultados:** mostram o acerto de cada questão, com a palavra, para você ver o que retomar.

---

# Etapa 2 — Jogos e estrelinhas (atualização)

## A. Atualizar o código
No editor do Apps Script (**Extensões > Apps Script**, na planilha):

| Arquivo no editor | O que fazer |
|---|---|
| `Jogos` | **novo:** clique em **+ > Script**, dê o nome `Jogos` e cole **Jogos.gs** |
| `JogosTela` | **novo:** clique em **+ > HTML**, dê o nome `JogosTela` e cole **JogosTela.html** |
| `ProfProgresso` (HTML) | **novo:** clique em **+ > HTML**, dê o nome `ProfProgresso` e cole **ProfProgresso.html** |
| `Codigo`, `Aluno`, `Professor` | apague tudo e cole as novas versões |

Depois faça o seguinte:
1. Salve (💾). Escolha a função **instalar** e clique em **▶ Executar**. Ela cria as abas **Progresso** e **Jogadas** sem apagar nada.
2. Publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. O link continua o mesmo.

## B. O que a criança vê
- **No topo:** o total de ⭐ estrelas.
- **Em cada tema:** a barrinha verde mostra quanto ela já aprendeu e quantas estrelas tem.
- **Dentro do tema, 4 jogos:**
  - **👂 Listen & Click:** ouve a palavra e toca na figura certa (8 rodadas).
  - **🃏 Memory:** jogo da memória com figura e palavra em inglês (6 pares).
  - **🧩 Match it!:** arrasta a palavra até a figura, ou toca na palavra e depois na figura (8 palavras).
  - **🔤 Spell it!:** monta a palavra com as letras (6 palavras). Depois de 3 erros, a letra certa pisca. Esse jogo não aparece em temas de palavras de uma letra só, como o alfabeto.
- **Estrelas por partida:** 3 ⭐ para 90% ou mais de acertos de primeira, 2 ⭐ a partir de 70% e 1 ⭐ por terminar. Vale a melhor nota de cada jogo em cada tema.
- **Nas palavras:** cada uma ganha uma barrinha, e 🏅 quando está dominada.
- **Quais palavras entram:** os jogos sorteiam mais vezes as palavras que a criança ainda não domina.
- **Sem internet ou com o sistema ocupado:** a partida fica guardada no Chromebook e é salva sozinha depois ("⏳ vou salvar sozinho mais tarde").

## C. Como o domínio é calculado
Cada palavra vale de **0 a 100%** para cada aluno.

| Jogo | Acertou de primeira | Acertou depois de errar | Cada erro |
|---|---|---|---|
| Listen & Click / Match it! | +25 | +5 | −15 |
| Spell it! | +30 | +10 | −10 |
| Memory | +10 | — | — |

O **domínio do tema** é a média de todas as palavras do tema. As palavras ainda não jogadas contam como 0.

## D. Acompanhar (aba **Progresso**)
1. Escolha a turma.
2. Veja o resumo: quantos alunos já jogaram, número de partidas, tempo total e domínio médio.
3. **Mapa de domínio:** uma linha por aluno e uma coluna por tema, com as cores 🟥 0–39%, 🟨 40–69%, 🟩 70–89% e 🟩 escuro 90–100%. Clique numa célula para ver as palavras e as estrelas do aluno naquele tema.
4. **Palavras com mais dificuldade:** escolha o tema e veja o domínio médio da turma em cada palavra. As primeiras da lista são boas para retomar em aula.

---

# Etapa 1 — Instalação inicial

## 1. Criar a planilha e o script

1. No Google Drive, crie uma planilha nova chamada **English Kids App**.
2. Abra **Extensões > Apps Script**.
3. Crie os arquivos abaixo e cole o conteúdo de cada um, com o mesmo nome e sem a extensão.
   - **Arquivos de script:** use **+ > Script**. O arquivo `Código.gs` que já vem pronto pode ser renomeado para `Codigo`.
   - **Arquivos HTML:** use **+ > HTML**.

| Tipo | Nome no editor | Arquivo desta pasta |
|---|---|---|
| Script | `Codigo` | `Codigo.gs` |
| Script | `Temas` | `Temas.gs` |
| Script | `TemasPadrao` | `TemasPadrao.gs` |
| HTML | `Estilo` | `Estilo.html` |
| HTML | `Fala` | `Fala.html` |
| HTML | `Professor` | `Professor.html` |
| HTML | `ProfTemas` | `ProfTemas.html` |
| HTML | `Aluno` | `Aluno.html` |

4. Salve (💾). No topo do editor, escolha a função **instalar** e clique em **Executar**. Autorize quando o Google pedir.
   - A função cria as abas **Config**, **Turmas**, **Alunos** e **Temas**.
   - Ela cadastra as turmas 3ºA a 5ºC e os **24 temas** dos Mapas de Progressão 2026.
   - Os temas cujo mês já chegou ficam **liberados**; os demais ficam ocultos.

## 2. Publicar

1. **Implantar > Nova implantação > ⚙️ > App da Web**.
2. Escolha **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa em [domínio da escola]**.
3. Clique em **Implantar** e copie o link.
4. Abra o link com a sua conta: aparece o **painel do professor**. Com a conta de um aluno, aparece a tela da criança.

Para atualizar o código depois: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. O link continua o mesmo.

## 3. Primeiro teste no Chromebook

Antes dos jogos, confira se a **voz em inglês** funciona nos Chromebooks da escola: num Chromebook, entre **com a conta de um aluno**, abra o link do sistema e toque numa figura de qualquer tema. Se não ouvir nada, confira o volume. Se o aparelho não tiver voz, a própria tela avisa (🔇).

## 4. Usar

- **Turmas:** o botão **Editar turmas** muda as turmas de cada série (ex.: `A, B, C`). Turmas que já têm alunos não podem ser removidas.
- **Alunos:** a criança se cadastra no primeiro acesso com nome, turma e um bichinho. Você pode editar, excluir ou adicionar alunos à mão.
- **Temas:** cada tema é uma lista de palavras (figura, inglês e português) e frases.
  - **Liberar / Ocultar:** só os temas liberados aparecem para a série. A criança acessa quando quiser.
  - **Editar:** mude palavras, emojis, traduções e frases. O botão 🔊 mostra como a voz vai falar.
  - **+ Novo tema:** preencha à mão, use **✨ Gerar com IA** (precisa da chave da API em Configurações) ou **Colar JSON** com um tema pedido no chat.
  - **Restaurar temas padrão:** recria os temas padrão que você apagou. Eles voltam ocultos.
- **Configurações:** domínio, professores, cadastro aberto ou fechado, **velocidade da voz** e chave da API.

**O que a criança vê nesta etapa:** os temas liberados para a série dela. Ao tocar numa figura, ouve a palavra em inglês (🐢 repete mais devagar) e pode ligar a tradução em português. Os jogos chegam na etapa 2 (veja acima).
