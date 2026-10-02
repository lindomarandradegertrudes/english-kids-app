# English Kids App — Guia de instalação

Faça tudo com a sua **conta institucional** (@edu.joinville.sc.gov.br).

---

# Speak! — jogo de pronúncia (atualização)

## A. Atualizar o código
Não há arquivos novos. No editor, apague tudo e cole as novas versões de:
- `Codigo` ← **Codigo.gs**
- `Jogos` ← **Jogos.gs**
- `JogosTela` ← **JogosTela.html**
- `Aluno` ← **Aluno.html**

Depois publique a nova versão: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. Não precisa executar `instalar`.

## B. Como funciona
1. Dentro do tema, a criança toca em **🎤 Speak!**. O jogo abre numa **aba nova**, porque a moldura do Google Apps Script não deixa usar o microfone.
2. Para cada palavra (até 8), ela ouve, toca no 🎤 e fala. O reconhecimento de voz do Chrome confere.
   - Valem pequenas diferenças de pronúncia.
   - Vale falar a palavra dentro de uma frase ("it's a cat").
   - Nos números, vale também o algarismo.
   - São **3 tentativas** por palavra. Também dá para **Pular**.
3. **No fim:** a aba do jogo avisa o app, as estrelas são salvas e a aba se fecha sozinha.
   - **Plano B:** se o aviso entre as abas não funcionar, ela volta para o link do app levando o resultado, e aparece "✅ Suas estrelas do Speak! foram salvas".
4. **Pontos no domínio:** +25 de primeira, +10 depois de errar, −5 por erro. As estrelas seguem a regra de sempre.

O tema do alfabeto não tem Speak!, porque o reconhecimento entende mal letras soltas.

## C. Se aparecer "🔇 O microfone está bloqueado"
- Clique no cadeado ao lado do endereço > **Microfone > Permitir** e recarregue a página.
- Se não houver essa opção no Chromebook da escola, a administração bloqueou o microfone. Peça à TI que libere só o endereço `https://lindomarandradegertrudes.github.io` (política "Permitir captura de áudio – URLs permitidos" / `AudioCaptureAllowedUrls`).
- Para descobrir a causa exata, use o diagnóstico em `https://lindomarandradegertrudes.github.io/english-kids-speak/` (botão **🩺 Diagnosticar**).

**Privacidade:** a página do jogo recebe só as palavras do tema. Nome, e-mail e notas nunca saem do app.

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
| HTML | `Teste` | `Teste.html` |
| HTML | `TesteConteudo` | `TesteConteudo.html` |

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

## 3. Primeiro teste no Chromebook (importante)

Antes dos jogos, precisamos saber se a **voz** e o **microfone** funcionam nos Chromebooks da escola.

1. No painel, abra a aba **Teste do Chromebook** e copie o link de teste. É o link do sistema com `?teste=1` no final.
2. Num Chromebook da escola, entre **com a conta de um aluno** e abra esse link.
3. Clique em **🔊 Falar** e confira se ouviu a frase em inglês.
4. Clique em **🎤 Ouvir agora**, permita o microfone se o Chrome perguntar e diga **"apple"**.
5. Tire um print do quadro **📋 Resumo deste aparelho** e mande no chat.

Se o microfone for bloqueado (`not-allowed`), o jogo **Speak!** precisará de outra solução. O resto do sistema não é afetado.

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
