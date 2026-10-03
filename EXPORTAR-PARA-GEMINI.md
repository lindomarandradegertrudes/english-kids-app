# English Kids App — pacote completo para o Gemini

Gerado em 02/10/2026. Este arquivo reúne a documentação e **todo o código-fonte** do English Kids App, para que outro assistente de IA (Gemini) entenda o sistema e continue o trabalho.

**Como usar no Gemini:** envie este arquivo e escreva, por exemplo:
> "Este é o código completo do meu sistema English Kids App (Google Apps Script). Leia a seção 'Regras obrigatórias' antes de propor qualquer mudança. Quero ..."

Peça sempre o **arquivo inteiro** de volta quando algo mudar, porque a instalação é feita colando cada arquivo no editor do Apps Script.

---

## 1. O que é o sistema

Sistema web para o professor de Língua Inglesa dos Anos Iniciais (3º ao 5º ano) da Rede Municipal de Joinville (SC). As crianças aprendem vocabulário com jogos no Chromebook, e o professor acompanha a evolução de cada aluno e turma.

- **Plataforma:** Google Apps Script (web app) ligado a uma Planilha Google, no Workspace da escola (domínio `edu.joinville.sc.gov.br`).
- **Publicação:** Implantar > App da Web, "Executar como: Eu" e "Qualquer pessoa no domínio".
- **Login:** conta Google da escola. No primeiro acesso, a criança escreve o nome, escolhe a turma e um bichinho (avatar).
- **Quem vê o quê:** `doGet` mostra `Professor.html` para os e-mails da lista de professores e `Aluno.html` para os alunos. Com `?teste=1` mostra o teste de voz e microfone. Com `?speak=<resultado>` salva o resultado do Speak! (plano B).
- **9 turmas** (3ºA–5ºC, editáveis), até 38 alunos cada.
- **Repositório:** https://github.com/lindomarandradegertrudes/english-kids-app (público).

## 2. Funcionalidades

1. **Temas:** cada tema é uma lista de palavras `{en, pt, figura}` (figura = emoji ou número; vazia = o jogo mostra o português) e frases `{en, pt}`. Há 24 temas padrão dos Mapas 2026. Os temas cujo mês já chegou ficam liberados. O professor edita, importa JSON ou gera com IA. Todos os jogos e avaliações são montados a partir dos temas.
2. **Jogos (10):** Listen & Click (`ouvir`), Memory (`memoria`), Match it! (`arrastar`), Spell it! (`montar`), Find it! (`cacar`), Color it! (`colorir`), Build it! (`frases`), Spelling Bee (`abelha`), Repeat after me (`repetir`) e Speak! (`falar`).
3. **Domínio por palavra:** cada palavra vale de 0 a 100 por aluno, com ganho e perda por jogo (veja `JOGOS` em `Jogos.gs`). O domínio do tema é a média das palavras do tema (as não jogadas valem 0). Os jogos sorteiam mais vezes as palavras menos dominadas.
4. **Estrelas:** 1 a 3 por partida (3 ⭐ para 90% ou mais de acertos de primeira, 2 ⭐ a partir de 70% e 1 ⭐ por terminar). Vale a melhor nota de cada jogo em cada tema. O Repeat after me vale sempre 1.
5. **Avaliações:** diagnóstico e quiz mensal montados sozinhos (questões `ouvir`, `ler` e `figura`). Online, a criança vê uma pergunta por tela e não vê a nota. Há prova impressa, gabarito e lançamento das letras marcadas.
6. **Níveis:** Iniciante abaixo de 40%, Básico a partir de 40%, Intermediário a partir de 60% e Avançado a partir de 80%. São a média simples das avaliações; **os jogos não entram**. Só o professor vê.
7. **Equipes:** até 5 alunos, com níveis misturados (serpentina pela média + equilíbrio). Quem ainda não fez avaliação entra nas equipes menores. **Placar do mês** = média de estrelas por membro (melhor nota de cada jogo e tema no mês). Fica em cache de 2 minutos.
8. **Relatórios:** comparativo das turmas, palavras com mais dificuldade (avaliações e jogos), ficha do aluno para imprimir e exportação para uma Planilha nova.
9. **Speak!:** o microfone **não funciona dentro do Apps Script**, porque a moldura (iframe) do Google não tem permissão de microfone. Por isso o Speak! roda numa página separada no GitHub Pages: https://lindomarandradegertrudes.github.io/english-kids-speak/jogo.html.
   - O app abre essa página numa aba nova com `#<base64url do JSON>`, que leva só as palavras do tema, o id da partida e o link do app (nenhum dado de aluno).
   - No fim, a página manda o resultado à aba do app por `postMessage`. O app confere a origem, salva e responde `speak-ok`, e a página se fecha.
   - **Plano B:** se a resposta não chegar, a página navega para `<app>/exec?speak=<base64url>` e o `doGet` salva o resultado (`paginaResultadoSpeak_`).
   - A página de diagnóstico do microfone fica em `.../english-kids-speak/` (`index.html`).

## 3. Planilha (abas e colunas)

As colunas ficam em `CABECALHOS`, no `Codigo.gs`. A função `instalar()` cria as abas que faltam, sem apagar dados. **Não mude a ordem das colunas existentes**: acrescente colunas novas no fim.

- **Config:** chave, valor, descricao (dominio, professores, cadastro_aberto, velocidade_voz, tamanho_max_grupo, faixas de nível).
- **Turmas:** turma, serie.
- **Alunos:** email, nome, turma, avatar, cadastrado_em, atualizado_em.
- **Temas:** id, serie, trimestre, mes, titulo, titulo_pt, conteudo, palavras_json, frases_json, status (`oculto` ou `liberado`).
- **Progresso:** 1 linha por aluno e tema: email, turma, tema_id, dominio_json `{palavra: pontos}`, estrelas_json `{jogo: melhor}`, jogadas, segundos.
- **Jogadas:** registro de cada partida (o id que vem do navegador evita gravar duas vezes).
- **Questionarios:** id, tipo, serie, mes, titulo, temas_json, questoes_json (com cópia das palavras), status.
- **Respostas:** questionario_id, email, turma, pontuacao, total, percentual, detalhe_json, origem (`online` ou `impresso`).
- **Equipes:** mes, turma, equipe, email, nome, nivel, media, aplicado_em.

## 4. Regras obrigatórias (problemas reais já encontrados)

Estas regras vieram de erros que travaram o app em produção. **Respeite todas.**

1. **Nunca escreva duas barras seguidas (`//`) no meio de uma linha de script, nem dentro de textos.** O carregador do Google corta a linha ali, como se fosse comentário. O resultado é "SyntaxError: Invalid or unexpected token" e a tela fica parada no "Loading…". Monte endereços assim: `'https:' + '/' + '/host'`. Comentários `//` só no começo da linha.
2. **Nunca use `$&`, `$'`, `` $` `` nem `$$` no código das telas.**
3. **Arquivos-modelo não podem ter código.** São os abertos com `createTemplateFromFile`: `Aluno`, `Professor` e `Teste`. Eles só podem ter a estrutura HTML e os `<?!= incluir('Arquivo'); ?>`. O código fica nos arquivos incluídos, que o Google entrega sem processar (`incluir()` usa `createHtmlOutputFromFile().getContent()`).
4. **No Apps Script não pode haver um `.gs` e um `.html` com o mesmo nome.** Por isso o HTML dos jogos se chama `JogosTela`.
5. **`google.script.run` transforma campos `null` de objetos em `undefined`.** No navegador, compare com `== null` ou `!= null`.
6. **O Sheets transforma texto em número ou data** (ex.: `"03"`, `"2026-10"`). Grave meses com apóstrofo na frente (`"'" + mes`) e leia com `String()`.
7. **Concorrência:** a turma inteira salva junto. Os jogos salvam **sem trava global**: cada aluno só mexe nas próprias linhas, achadas com `TextFinder` pelo e-mail, e linhas novas entram com `appendRow`. No navegador, a fila em `localStorage` (`ek-fila:<email>`) reenvia sozinha o que não foi salvo.
8. **Privacidade:** nenhum dado de aluno vai em endereço (URL) nem para a página externa do Speak!. A chave da API da Anthropic fica nas Propriedades do script, nunca no código.
9. **Linguagem:** a interface é em português do Brasil e o conteúdo de inglês é para crianças de 8 a 10 anos (textos curtos, emojis grandes, voz e 🐢 para ouvir devagar). O autor do repositório é só o professor, sem coautores.

## 5. Como atualizar o sistema instalado

1. Na planilha, abra **Extensões > Apps Script**.
2. Em cada arquivo alterado, apague tudo e cole a versão nova. Arquivo novo: **+ > Script** ou **+ > HTML**, com o mesmo nome e sem extensão.
3. Salve (💾). Se houver aba nova na planilha, execute **instalar**.
4. Publique: **Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar**. O link continua o mesmo.

---

## 6. Código-fonte completo

Abaixo está cada arquivo exatamente como deve ser colado no editor do Apps Script. O nome no editor é o nome sem a extensão.

### Arquivo: `Codigo.gs`

Instalação, acesso à planilha, permissões, turmas, cadastro, doGet e painel. (478 linhas)

````javascript
/**
 * English Kids App – Língua Inglesa (3º ao 5º ano)
 * Instalação da planilha, acesso aos dados, permissões, turmas, cadastro de alunos e painel do professor.
 */

const FUSO = 'America/Sao_Paulo';
const SERIES = ['3º', '4º', '5º'];
const TURMAS_PADRAO = ['A', 'B', 'C'];
const MAX_ALUNOS_TURMA = 38;
const AVATARES = ['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐵', '🐰', '🐯', '🐨', '🐷', '🐙', '🦄', '🐢', '🐧', '🦉', '🐬', '🦖', '🐞', '🦋'];

const CABECALHOS = {
  Config: ['chave', 'valor', 'descricao'],
  Turmas: ['turma', 'serie'],
  Alunos: ['email', 'nome', 'turma', 'avatar', 'cadastrado_em', 'atualizado_em'],
  Temas: ['id', 'serie', 'trimestre', 'mes', 'titulo', 'titulo_pt', 'conteudo', 'palavras_json', 'frases_json', 'status', 'criado_em', 'atualizado_em'],
  Progresso: ['email', 'turma', 'tema_id', 'dominio_json', 'estrelas_json', 'jogadas', 'segundos', 'atualizado_em'],
  Jogadas: ['id', 'email', 'turma', 'tema_id', 'jogo', 'acertos', 'total', 'estrelas', 'segundos', 'palavras_json', 'jogado_em'],
  Questionarios: ['id', 'tipo', 'serie', 'mes', 'titulo', 'temas_json', 'questoes_json', 'status', 'criado_em'],
  Respostas: ['questionario_id', 'email', 'turma', 'pontuacao', 'total', 'percentual', 'detalhe_json', 'origem', 'respondido_em'],
  Equipes: ['mes', 'turma', 'equipe', 'email', 'nome', 'nivel', 'media', 'aplicado_em'],
};

const CONFIG_PADRAO = [
  ['dominio', 'edu.joinville.sc.gov.br', 'Domínio dos e-mails da escola, sem @. Vazio = aceita qualquer conta.'],
  ['professores', '', 'E-mails com acesso ao painel do professor, separados por vírgula.'],
  ['cadastro_aberto', 'SIM', 'SIM = alunos podem se cadastrar; NÃO = novos cadastros bloqueados.'],
  ['velocidade_voz', 0.85, 'Velocidade da voz em inglês nos jogos (0,5 = bem devagar; 1 = normal).'],
  ['tamanho_max_grupo', 5, 'Máximo de alunos por equipe.'],
  ['faixa_basico', 40, 'Média mínima (%) para o nível Básico. Abaixo disso: Iniciante.'],
  ['faixa_intermediario', 60, 'Média mínima (%) para o nível Intermediário.'],
  ['faixa_avancado', 80, 'Média mínima (%) para o nível Avançado.'],
];

// ============================================================
// Instalação
// ============================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('English Kids App')
    .addItem('Instalar / atualizar planilha', 'instalar')
    .addItem('Mostrar link do sistema', 'mostrarLink')
    .addToUi();
}

/** Cria as abas, as 9 turmas, as configurações e os temas padrão. Pode ser executada várias vezes sem apagar dados. */
function instalar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Abra o Apps Script pela planilha (Extensões > Apps Script) e execute novamente.');
  PropertiesService.getScriptProperties().setProperty('PLANILHA_ID', ss.getId());
  ss.setSpreadsheetTimeZone(FUSO);

  Object.keys(CABECALHOS).forEach(function (nome) {
    const aba = ss.getSheetByName(nome) || ss.insertSheet(nome);
    const cab = CABECALHOS[nome];
    aba.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#ffe8cc');
    aba.setFrozenRows(1);
  });

  const turmas = ss.getSheetByName('Turmas');
  if (turmas.getLastRow() < 2) {
    const linhas = [];
    SERIES.forEach(function (s) { TURMAS_PADRAO.forEach(function (l) { linhas.push([s + l, s]); }); });
    turmas.getRange(2, 1, linhas.length, 2).setValues(linhas);
  }

  const cfg = ss.getSheetByName('Config');
  const chaves = cfg.getLastRow() > 1
    ? cfg.getRange(2, 1, cfg.getLastRow() - 1, 1).getValues().map(function (l) { return l[0]; })
    : [];
  CONFIG_PADRAO.forEach(function (item) {
    if (chaves.indexOf(item[0]) !== -1) return;
    const linha = item.slice();
    if (linha[0] === 'professores') linha[1] = Session.getEffectiveUser().getEmail();
    cfg.appendRow(linha);
  });
  cfg.autoResizeColumns(1, 3);

  if (ss.getSheetByName('Temas').getLastRow() < 2) semearTemas_(true);

  ['Página1', 'Planilha1', 'Sheet1'].forEach(function (n) {
    const a = ss.getSheetByName(n);
    if (a && a.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(a);
  });

  const msg = 'Instalação concluída. Agora publique o sistema em Implantar > Nova implantação > App da Web.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { /* executado pelo editor: sem interface */ }
}

function mostrarLink() {
  const url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert(url ? 'Link do sistema:\n\n' + url : 'O sistema ainda não foi publicado (Implantar > Nova implantação).');
}

// ============================================================
// Acesso à planilha
// ============================================================

function planilha_() {
  const id = PropertiesService.getScriptProperties().getProperty('PLANILHA_ID');
  if (!id) throw new Error('Sistema não instalado. Execute a função "instalar" no editor do Apps Script.');
  return SpreadsheetApp.openById(id);
}

function aba_(nome) {
  return planilha_().getSheetByName(nome);
}

/** Lê uma aba como lista de objetos. Datas viram texto (google.script.run não transporta Date). */
function lerTabela_(nome) {
  const valores = aba_(nome).getDataRange().getValues();
  const cab = valores.shift();
  return valores
    .map(function (linha, i) {
      const obj = { _linha: i + 2 };
      cab.forEach(function (c, j) {
        const v = linha[j];
        obj[c] = v instanceof Date ? Utilities.formatDate(v, FUSO, 'dd/MM/yyyy HH:mm') : v;
      });
      return obj;
    })
    .filter(function (o) { return cab.some(function (c) { return o[c] !== ''; }); });
}

function linhaDe_(nome, obj) {
  return CABECALHOS[nome].map(function (c) {
    const v = obj[c] === undefined ? '' : obj[c];
    // Texto digitado não pode virar fórmula na planilha.
    return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
  });
}

function lerConfig_() {
  const cfg = {};
  lerTabela_('Config').forEach(function (l) { cfg[l.chave] = l.valor; });
  return cfg;
}

function listarTurmas_() {
  return lerTabela_('Turmas').map(function (t) { return { turma: String(t.turma), serie: String(t.serie) }; });
}

function serieDaTurma_(turma) {
  const t = listarTurmas_().filter(function (x) { return x.turma === turma; })[0];
  return t ? t.serie : '';
}

function comTrava_(fn) {
  const trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try { return fn(); } finally { trava.releaseLock(); }
}

// ============================================================
// Identificação e permissões
// ============================================================

function usuarioAtual_() {
  return String(Session.getActiveUser().getEmail() || '').toLowerCase().trim();
}

function ehProfessor_(email, cfg) {
  if (!email) return false;
  const lista = String((cfg || lerConfig_()).professores || '')
    .toLowerCase().split(/[\s,;]+/).filter(String);
  return email === Session.getEffectiveUser().getEmail().toLowerCase() || lista.indexOf(email) !== -1;
}

function exigirProfessor_() {
  const email = usuarioAtual_();
  if (!ehProfessor_(email)) throw new Error('Acesso restrito ao professor.');
  return email;
}

function validarAluno_(email, cfg) {
  if (!email) throw new Error('Não foi possível identificar sua conta. Entre com a sua conta Google da escola.');
  const dominio = String(cfg.dominio || '').replace(/^@/, '').toLowerCase().trim();
  if (dominio && !email.endsWith('@' + dominio)) {
    throw new Error('Use a sua conta Google da escola (@' + dominio + '). Você entrou como ' + email + '.');
  }
}

// ============================================================
// Páginas
// ============================================================

/** ?teste=1 abre o teste de voz e microfone para qualquer conta (útil para testar no Chromebook de um aluno). */
function doGet(e) {
  try {
    const email = usuarioAtual_();
    if (e && e.parameter && e.parameter.speak) return paginaResultadoSpeak_(e.parameter.speak);
    const teste = e && e.parameter && e.parameter.teste;
    const pagina = teste ? 'Teste' : ehProfessor_(email) ? 'Professor' : 'Aluno';
    const t = HtmlService.createTemplateFromFile(pagina);
    t.email = email;
    return t.evaluate()
      .setTitle(pagina === 'Professor' ? 'English Kids App – Professor' : 'English Kids App')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return HtmlService.createHtmlOutput('<p style="font-family:sans-serif;padding:24px">' + err.message + '</p>');
  }
}

function incluir(arquivo) {
  return HtmlService.createHtmlOutputFromFile(arquivo).getContent();
}

/** Usado pelas telas para ajustar a voz. Não exige login de professor. */
function velocidadeVoz_(cfg) {
  const v = Number(String(cfg.velocidade_voz).replace(',', '.'));
  return v >= 0.5 && v <= 1.2 ? v : 0.85;
}

// ============================================================
// Utilitários de texto
// ============================================================

const MINUSCULAS = ['da', 'de', 'do', 'das', 'dos', 'e'];

function formatarNome_(nome) {
  return String(nome || '').trim().replace(/\s+/g, ' ').toLowerCase().split(' ')
    .map(function (p, i) { return i > 0 && MINUSCULAS.indexOf(p) !== -1 ? p : p.charAt(0).toUpperCase() + p.slice(1); })
    .join(' ');
}

function validarNome_(nome) {
  if (nome.split(' ').length < 2 || nome.length < 5) throw new Error('Informe nome e sobrenome.');
}

function validarTurma_(turma) {
  const ok = listarTurmas_().some(function (t) { return t.turma === turma; });
  if (!ok) throw new Error('Turma inválida.');
}

function avatarValido_(avatar) {
  return AVATARES.indexOf(avatar) !== -1 ? avatar : AVATARES[0];
}

// ============================================================
// Área do aluno
// ============================================================

function alunoObterEstado() {
  const email = usuarioAtual_();
  const cfg = lerConfig_();
  validarAluno_(email, cfg);
  const aluno = lerTabela_('Alunos').filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
  const serie = aluno ? serieDaTurma_(String(aluno.turma)) : '';
  const temas = aluno ? temasDoAluno_(serie) : [];
  return {
    email: email,
    cadastroAberto: String(cfg.cadastro_aberto).toUpperCase() !== 'NÃO' && String(cfg.cadastro_aberto).toUpperCase() !== 'NAO',
    turmas: listarTurmas_(),
    avatares: AVATARES,
    velocidadeVoz: velocidadeVoz_(cfg),
    aluno: aluno ? { nome: String(aluno.nome), turma: String(aluno.turma), serie: serie, avatar: avatarValido_(String(aluno.avatar)) } : null,
    temas: temas,
    jogos: Object.keys(JOGOS).map(function (k) { return { id: k, nome: JOGOS[k].nome }; }),
    progresso: aluno ? resumoProgressoAluno_(email, temas) : null,
    urlApp: ScriptApp.getService().getUrl(),
    urlSpeak: URL_SPEAK,
    avaliacoes: aluno ? avaliacoesPendentes_(email, serie) : [],
    equipe: aluno ? equipeSegura_(email, String(aluno.turma)) : null,
  };
}

/** A equipe é um extra da tela inicial: se der erro, a criança continua jogando normalmente. */
function equipeSegura_(email, turma) {
  try { return equipeDoAluno_(email, turma); } catch (e) { return null; }
}

function alunoCadastrar(nome, turma, avatar) {
  const email = usuarioAtual_();
  const cfg = lerConfig_();
  validarAluno_(email, cfg);
  const estado = alunoObterEstado();
  if (!estado.cadastroAberto) throw new Error('O cadastro está fechado. Fale com o professor.');
  nome = formatarNome_(nome);
  validarNome_(nome);
  validarTurma_(turma);

  comTrava_(function () {
    const existe = lerTabela_('Alunos').some(function (a) { return String(a.email).toLowerCase() === email; });
    if (existe) throw new Error('Você já está cadastrado. Recarregue a página.');
    const agora = new Date();
    aba_('Alunos').appendRow(linhaDe_('Alunos', {
      email: email, nome: nome, turma: turma, avatar: avatarValido_(avatar), cadastrado_em: agora, atualizado_em: agora,
    }));
  });
  return alunoObterEstado();
}

/** Aluno cadastrado que está acessando agora. */
function alunoAtual_() {
  const email = usuarioAtual_();
  validarAluno_(email, lerConfig_());
  const aluno = lerTabela_('Alunos').filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
  if (!aluno) throw new Error('Cadastro não encontrado. Recarregue a página.');
  return { email: email, turma: String(aluno.turma) };
}

function alunoTrocarAvatar(avatar) {
  const email = usuarioAtual_();
  validarAluno_(email, lerConfig_());
  comTrava_(function () {
    const aluno = lerTabela_('Alunos').filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
    if (!aluno) throw new Error('Cadastro não encontrado. Recarregue a página.');
    aba_('Alunos').getRange(aluno._linha, CABECALHOS.Alunos.indexOf('avatar') + 1).setValue(avatarValido_(avatar));
  });
  return avatarValido_(avatar);
}

// ============================================================
// Painel do professor
// ============================================================

function profResumo() {
  exigirProfessor_();
  const cfg = lerConfig_();
  const alunos = lerTabela_('Alunos');
  const turmas = listarTurmas_().map(function (t) {
    t.total = alunos.filter(function (a) { return String(a.turma) === t.turma; }).length;
    return t;
  });
  return {
    turmas: turmas,
    series: SERIES,
    avatares: AVATARES,
    totalAlunos: alunos.length,
    maxPorTurma: MAX_ALUNOS_TURMA,
    link: ScriptApp.getService().getUrl(),
    temChaveApi: !!PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY'),
    config: {
      dominio: String(cfg.dominio || ''),
      professores: String(cfg.professores || ''),
      cadastro_aberto: String(cfg.cadastro_aberto || 'SIM'),
      velocidade_voz: velocidadeVoz_(cfg),
      faixa_basico: Number(cfg.faixa_basico) || 40,
      faixa_intermediario: Number(cfg.faixa_intermediario) || 60,
      faixa_avancado: Number(cfg.faixa_avancado) || 80,
    },
  };
}

/** Substitui a lista de turmas. Turmas com alunos cadastrados não podem sair. */
function profSalvarTurmas(lista) {
  exigirProfessor_();
  const vistas = {};
  const limpas = (lista || []).map(function (t) {
    // "3a", "3oA", "3° A" → "3ºA"
    const turma = String(t.turma || '').trim().toUpperCase().replace(/\s+/g, '').replace(/^(\d)[ºO°]?/, '$1º');
    const serie = String(t.serie || '');
    if (SERIES.indexOf(serie) === -1) throw new Error('Série inválida na turma ' + turma + '.');
    if (!turma) throw new Error('Há uma turma sem nome.');
    if (vistas[turma]) throw new Error('A turma ' + turma + ' aparece duas vezes.');
    vistas[turma] = true;
    return [turma, serie];
  });
  if (!limpas.length) throw new Error('Cadastre pelo menos uma turma.');

  comTrava_(function () {
    const alunos = lerTabela_('Alunos');
    listarTurmas_().forEach(function (t) {
      const saiu = !limpas.some(function (l) { return l[0] === t.turma && l[1] === t.serie; });
      const n = alunos.filter(function (a) { return String(a.turma) === t.turma; }).length;
      if (saiu && n) throw new Error('A turma ' + t.turma + ' tem ' + n + ' alunos: mova-os antes de excluir ou mudar a série dela.');
    });
    const aba = aba_('Turmas');
    const total = aba.getLastRow() - 1;
    if (total > 0) aba.getRange(2, 1, total, 2).clearContent();
    limpas.sort(function (a, b) { return a[0].localeCompare(b[0]); });
    aba.getRange(2, 1, limpas.length, 2).setValues(limpas);
  });
  return profResumo();
}

function profListarAlunos() {
  exigirProfessor_();
  const niveis = calcularNiveis_(lerConfig_());
  return lerTabela_('Alunos').map(function (a) {
    const email = String(a.email).toLowerCase();
    const n = niveis[email];
    return {
      email: email, nome: String(a.nome), turma: String(a.turma),
      avatar: avatarValido_(String(a.avatar)), cadastrado_em: String(a.cadastrado_em),
      media: n ? n.media : null, nivel: n ? n.nivel : '', avaliacoes: n ? n.avaliacoes : 0,
    };
  });
}

/** Cria (emailOriginal vazio) ou edita um aluno. */
function profSalvarAluno(dados) {
  exigirProfessor_();
  const email = String(dados.email || '').toLowerCase().trim();
  const original = String(dados.emailOriginal || '').toLowerCase().trim();
  const nome = formatarNome_(dados.nome);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('E-mail inválido.');
  validarNome_(nome);
  validarTurma_(dados.turma);

  comTrava_(function () {
    const alunos = lerTabela_('Alunos');
    const duplicado = alunos.some(function (a) { return String(a.email).toLowerCase() === email && email !== original; });
    if (duplicado) throw new Error('Já existe um aluno com esse e-mail.');
    const aba = aba_('Alunos');

    if (!original) {
      const agora = new Date();
      aba.appendRow(linhaDe_('Alunos', {
        email: email, nome: nome, turma: dados.turma, avatar: avatarValido_(dados.avatar), cadastrado_em: agora, atualizado_em: agora,
      }));
      return;
    }
    const atual = alunos.filter(function (a) { return String(a.email).toLowerCase() === original; })[0];
    if (!atual) throw new Error('Aluno não encontrado. Recarregue a página.');
    const cadastro = aba.getRange(atual._linha, CABECALHOS.Alunos.indexOf('cadastrado_em') + 1).getValue();
    aba.getRange(atual._linha, 1, 1, CABECALHOS.Alunos.length).setValues([linhaDe_('Alunos', {
      email: email, nome: nome, turma: dados.turma, avatar: avatarValido_(dados.avatar || String(atual.avatar)),
      cadastrado_em: cadastro, atualizado_em: new Date(),
    })]);
    if (email !== original) trocarEmailNoHistorico_(original, email);
  });
  return profListarAlunos();
}

/** Leva o progresso e as partidas para o e-mail novo quando o professor corrige o e-mail de um aluno. */
function trocarEmailNoHistorico_(antigo, novo) {
  ['Progresso', 'Jogadas', 'Respostas', 'Equipes'].forEach(function (nome) {
    const aba = aba_(nome);
    const col = CABECALHOS[nome].indexOf('email') + 1;
    const n = aba.getLastRow() - 1;
    if (n < 1) return;
    const faixa = aba.getRange(2, col, n, 1);
    faixa.setValues(faixa.getValues().map(function (l) { return [String(l[0]).toLowerCase() === antigo ? novo : l[0]]; }));
  });
}

/** Remove o cadastro. O progresso fica guardado e volta a valer se o aluno se cadastrar de novo. */
function profExcluirAluno(email) {
  exigirProfessor_();
  email = String(email || '').toLowerCase();
  comTrava_(function () {
    const alvo = lerTabela_('Alunos').filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
    if (!alvo) throw new Error('Aluno não encontrado. Recarregue a página.');
    aba_('Alunos').deleteRow(alvo._linha);
  });
  return profListarAlunos();
}

function profSalvarConfig(novos) {
  const email = exigirProfessor_();
  const professores = String(novos.professores || '').toLowerCase();
  if (professores.split(/[\s,;]+/).indexOf(email) === -1 && email !== Session.getEffectiveUser().getEmail().toLowerCase()) {
    throw new Error('Seu próprio e-mail precisa continuar na lista de professores.');
  }
  const voz = Number(String(novos.velocidade_voz).replace(',', '.'));
  if (!(voz >= 0.5 && voz <= 1.2)) throw new Error('A velocidade da voz deve ficar entre 0,5 e 1,2.');
  const b = Number(novos.faixa_basico), i = Number(novos.faixa_intermediario), a = Number(novos.faixa_avancado);
  if (!(b > 0 && b < i && i < a && a <= 100)) throw new Error('As faixas de nível devem ser crescentes: Básico < Intermediário < Avançado ≤ 100.');
  const valores = {
    faixa_basico: b,
    faixa_intermediario: i,
    faixa_avancado: a,
    dominio: String(novos.dominio || '').replace(/^@/, '').toLowerCase().trim(),
    professores: professores,
    cadastro_aberto: novos.cadastro_aberto === 'NÃO' ? 'NÃO' : 'SIM',
    velocidade_voz: voz,
  };
  comTrava_(function () {
    const aba = aba_('Config');
    lerTabela_('Config').forEach(function (l) {
      if (valores.hasOwnProperty(l.chave)) aba.getRange(l._linha, 2).setValue(valores[l.chave]);
    });
  });
  return profResumo();
}
````

### Arquivo: `Temas.gs`

Temas: leitura, validação, edição, importação e geração com IA (API da Anthropic). (325 linhas)

````javascript
/**
 * Temas: a lista de palavras e frases de cada assunto. Todos os jogos e avaliações são montados a partir dela.
 */

const STATUS_TEMA = ['oculto', 'liberado'];
const LIMITES_TEMA = { minPalavras: 4, maxPalavras: 40, maxFrases: 20 };

// ============================================================
// Leitura e validação
// ============================================================

function lerTemas_() {
  return lerTabela_('Temas').map(function (t) {
    const json = function (txt) { try { const v = JSON.parse(txt || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
    return {
      _linha: t._linha,
      id: String(t.id), serie: String(t.serie), trimestre: Number(t.trimestre) || 1, mes: Number(t.mes) || 2,
      titulo: String(t.titulo), titulo_pt: String(t.titulo_pt || ''), conteudo: String(t.conteudo || ''),
      palavras: json(t.palavras_json), frases: json(t.frases_json),
      status: STATUS_TEMA.indexOf(String(t.status)) !== -1 ? String(t.status) : 'oculto',
      criado_em: String(t.criado_em), atualizado_em: String(t.atualizado_em),
    };
  });
}

function ordenarTemas_(lista) {
  return lista.sort(function (a, b) {
    return a.serie.localeCompare(b.serie) || a.mes - b.mes || a.trimestre - b.trimestre || a.titulo.localeCompare(b.titulo);
  });
}

function buscarTema_(id) {
  const t = lerTemas_().filter(function (x) { return x.id === id; })[0];
  if (!t) throw new Error('Tema não encontrado. Recarregue a página.');
  return t;
}

function textoLimpo_(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Valida e normaliza um tema vindo do editor, da importação ou da IA. */
function validarTema_(d) {
  if (SERIES.indexOf(d.serie) === -1) throw new Error('Série inválida (use 3º, 4º ou 5º).');
  const titulo = textoLimpo_(d.titulo, 60);
  if (!titulo) throw new Error('Informe o título do tema (em inglês).');
  const trimestre = Number(d.trimestre);
  const mes = Number(d.mes);

  const vistas = {}, figuras = {};
  const palavras = (Array.isArray(d.palavras) ? d.palavras : []).map(function (p) {
    // Aceita {en, pt, figura} ou ["en", "pt", "figura"].
    if (Array.isArray(p)) p = { en: p[0], pt: p[1], figura: p[2] };
    return { en: textoLimpo_(p && p.en, 40), pt: textoLimpo_(p && p.pt, 40), figura: textoLimpo_(p && p.figura, 16) };
  }).filter(function (p) { return p.en || p.pt || p.figura; });
  palavras.forEach(function (p, i) {
    const n = titulo + ', palavra ' + (i + 1) + ': ';
    if (!p.en) throw new Error(n + 'falta a palavra em inglês.');
    if (!p.pt) throw new Error(n + '"' + p.en + '" está sem a tradução.');
    const chave = p.en.toLowerCase();
    if (vistas[chave]) throw new Error(titulo + ': a palavra "' + p.en + '" aparece duas vezes.');
    vistas[chave] = true;
    if (p.figura) {
      if (figuras[p.figura]) throw new Error(titulo + ': "' + figuras[p.figura] + '" e "' + p.en + '" usam a mesma figura ' + p.figura + '. Nos jogos, a criança não saberia qual escolher.');
      figuras[p.figura] = p.en;
    }
  });
  if (palavras.length < LIMITES_TEMA.minPalavras) throw new Error(titulo + ': cadastre pelo menos ' + LIMITES_TEMA.minPalavras + ' palavras (os jogos precisam de opções).');
  if (palavras.length > LIMITES_TEMA.maxPalavras) throw new Error(titulo + ': máximo de ' + LIMITES_TEMA.maxPalavras + ' palavras. Divida em dois temas.');

  const frases = (Array.isArray(d.frases) ? d.frases : []).map(function (f) {
    if (Array.isArray(f)) f = { en: f[0], pt: f[1] };
    return { en: textoLimpo_(f && f.en, 120), pt: textoLimpo_(f && f.pt, 160) };
  }).filter(function (f) { return f.en || f.pt; });
  frases.forEach(function (f, i) {
    if (!f.en || !f.pt) throw new Error(titulo + ', frase ' + (i + 1) + ': preencha o inglês e o português.');
  });
  if (frases.length > LIMITES_TEMA.maxFrases) throw new Error(titulo + ': máximo de ' + LIMITES_TEMA.maxFrases + ' frases.');

  return {
    serie: d.serie,
    trimestre: trimestre >= 1 && trimestre <= 3 ? trimestre : 1,
    mes: mes >= 2 && mes <= 12 ? mes : 2,
    titulo: titulo,
    titulo_pt: textoLimpo_(d.titulo_pt, 80),
    conteudo: String(d.conteudo || '').trim().slice(0, 1000),
    palavras: palavras,
    frases: frases,
  };
}

function mesNumero_() {
  return Number(Utilities.formatDate(new Date(), FUSO, 'M'));
}

/** Grava um tema validado. Sem id = novo. Chamar dentro de comTrava_. */
function gravarTema_(id, t, status) {
  const aba = aba_('Temas');
  const agora = new Date();
  const dados = {
    serie: t.serie, trimestre: t.trimestre, mes: t.mes, titulo: t.titulo, titulo_pt: t.titulo_pt, conteudo: t.conteudo,
    palavras_json: JSON.stringify(t.palavras), frases_json: JSON.stringify(t.frases), atualizado_em: agora,
  };
  if (!id) {
    id = 'T' + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
    aba.appendRow(linhaDe_('Temas', Object.assign(dados, { id: id, status: status || 'oculto', criado_em: agora })));
    return id;
  }
  const atual = buscarTema_(id);
  const criado = aba.getRange(atual._linha, CABECALHOS.Temas.indexOf('criado_em') + 1).getValue();
  aba.getRange(atual._linha, 1, 1, CABECALHOS.Temas.length)
    .setValues([linhaDe_('Temas', Object.assign(dados, { id: id, status: status || atual.status, criado_em: criado }))]);
  return id;
}

/**
 * Cria os temas padrão que ainda não existem (mesma série e título).
 * liberarAteHoje: libera os temas cujo mês já chegou; os demais ficam ocultos.
 */
function semearTemas_(liberarAteHoje) {
  const existentes = {};
  lerTemas_().forEach(function (t) { existentes[t.serie + '|' + t.titulo.toLowerCase()] = true; });
  const mes = mesNumero_();
  let criados = 0;
  TEMAS_PADRAO.forEach(function (p) {
    if (existentes[p.serie + '|' + p.titulo.toLowerCase()]) return;
    const t = validarTema_(p);
    gravarTema_('', t, liberarAteHoje && t.mes <= mes ? 'liberado' : 'oculto');
    criados += 1;
  });
  return criados;
}

// ============================================================
// Área do aluno
// ============================================================

function temasDoAluno_(serie) {
  return ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie && t.status === 'liberado'; }))
    .map(function (t) {
      return { id: t.id, titulo: t.titulo, titulo_pt: t.titulo_pt, trimestre: t.trimestre, mes: t.mes, palavras: t.palavras, frases: t.frases };
    });
}

// ============================================================
// Painel do professor
// ============================================================

function profListarTemas() {
  exigirProfessor_();
  return ordenarTemas_(lerTemas_()).map(function (t) { delete t._linha; return t; });
}

function profSalvarTema(dados) {
  exigirProfessor_();
  const t = validarTema_(dados);
  let id = String(dados.id || '');
  comTrava_(function () {
    const repetido = lerTemas_().some(function (x) {
      return x.id !== id && x.serie === t.serie && x.titulo.toLowerCase() === t.titulo.toLowerCase();
    });
    if (repetido) throw new Error('Já existe um tema "' + t.titulo + '" no ' + t.serie + ' ano.');
    id = gravarTema_(id, t);
  });
  return profListarTemas();
}

/** Aceita um tema, uma lista de temas ou { temas: [...] }. Cada um entra oculto. */
function profImportarTemas(texto) {
  exigirProfessor_();
  let dados;
  try { dados = JSON.parse(texto); } catch (e) { throw new Error('O texto colado não é um JSON válido.'); }
  const lista = Array.isArray(dados) ? dados : Array.isArray(dados.temas) ? dados.temas : [dados];
  const validados = lista.map(function (d) {
    return validarTema_(Object.assign({ serie: dados.serie, trimestre: dados.trimestre, mes: dados.mes }, d));
  });
  comTrava_(function () {
    const existentes = lerTemas_();
    validados.forEach(function (t) {
      const igual = existentes.filter(function (x) { return x.serie === t.serie && x.titulo.toLowerCase() === t.titulo.toLowerCase(); })[0];
      if (igual) throw new Error('Já existe o tema "' + t.titulo + '" no ' + t.serie + ' ano. Mude o título ou edite o tema existente.');
    });
    validados.forEach(function (t) { gravarTema_('', t, 'oculto'); });
  });
  return { importados: validados.length, temas: profListarTemas() };
}

function profAlterarStatusTema(id, status) {
  exigirProfessor_();
  if (STATUS_TEMA.indexOf(status) === -1) throw new Error('Status inválido.');
  comTrava_(function () {
    const t = buscarTema_(id);
    aba_('Temas').getRange(t._linha, CABECALHOS.Temas.indexOf('status') + 1).setValue(status);
  });
  return profListarTemas();
}

function profExcluirTema(id) {
  exigirProfessor_();
  comTrava_(function () {
    const t = buscarTema_(id);
    aba_('Temas').deleteRow(t._linha);
  });
  return profListarTemas();
}

function profRestaurarTemasPadrao() {
  exigirProfessor_();
  let criados = 0;
  comTrava_(function () { criados = semearTemas_(false); });
  return { criados: criados, temas: profListarTemas() };
}

// ============================================================
// Geração de temas com a API do Claude
// ============================================================

function profSalvarChaveApi(chave) {
  exigirProfessor_();
  const props = PropertiesService.getScriptProperties();
  chave = String(chave || '').trim();
  if (chave) props.setProperty('ANTHROPIC_API_KEY', chave);
  else props.deleteProperty('ANTHROPIC_API_KEY');
  return !!chave;
}

const ESQUEMA_TEMA = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    titulo_pt: { type: 'string' },
    palavras: {
      type: 'array',
      items: {
        type: 'object',
        properties: { en: { type: 'string' }, pt: { type: 'string' }, figura: { type: 'string' } },
        required: ['en', 'pt', 'figura'],
        additionalProperties: false,
      },
    },
    frases: {
      type: 'array',
      items: {
        type: 'object',
        properties: { en: { type: 'string' }, pt: { type: 'string' } },
        required: ['en', 'pt'],
        additionalProperties: false,
      },
    },
  },
  required: ['titulo', 'titulo_pt', 'palavras', 'frases'],
  additionalProperties: false,
};

function promptTema_(dados) {
  return [
    'Você é professor de Língua Inglesa dos Anos Iniciais da Rede Municipal de Joinville (SC).',
    'Monte a lista de vocabulário de um tema para jogos educativos no Chromebook, para crianças do ' + dados.serie +
      ' ano do Ensino Fundamental (8 a 10 anos), muitas ainda em alfabetização.',
    '',
    'Tema: ' + (dados.titulo || '(sugira um título curto em inglês)'),
    'Conteúdo trabalhado em sala:',
    dados.conteudo,
    '',
    'Regras:',
    '- ' + dados.quantidade + ' palavras ou expressões curtas (até 3 palavras), concretas e do dia a dia da criança.',
    '- "figura": UM emoji que represente a palavra sem ambiguidade. Não repita o mesmo emoji em duas palavras.',
    '  Se nenhum emoji representar bem a palavra, deixe "figura" vazio (o jogo mostrará a tradução).',
    '  Para números acima de 10 use os algarismos (ex.: "15").',
    '- "pt": tradução curta em português do Brasil.',
    '- 4 a 6 frases curtas e simples (até 8 palavras) usando o vocabulário, no padrão trabalhado nessa idade.',
    '- "titulo" em inglês (até 4 palavras) e "titulo_pt" em português.',
  ].join('\n');
}

function chamarClaude_(corpo, chave) {
  const resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: corpo.fallbacks
      ? { 'x-api-key': chave, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'server-side-fallback-2026-07-01' }
      : { 'x-api-key': chave, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify(corpo),
    muteHttpExceptions: true,
  });
  let json = {};
  try { json = JSON.parse(resp.getContentText()); } catch (e) { /* resposta não-JSON */ }
  return { codigo: resp.getResponseCode(), json: json };
}

/** Pede à IA as palavras e frases de um tema. Não grava: o professor revisa no editor antes de salvar. */
function profGerarTemaIA(dados) {
  exigirProfessor_();
  const chave = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!chave) throw new Error('Cadastre a chave da API do Claude em Configurações.');
  if (!String(dados.conteudo || '').trim() && !String(dados.titulo || '').trim()) throw new Error('Informe o título ou o conteúdo do tema.');
  const quantidade = Math.min(Math.max(Number(dados.quantidade) || 12, LIMITES_TEMA.minPalavras), 30);

  const corpo = {
    model: 'claude-opus-5-5',
    max_tokens: 8000,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: ESQUEMA_TEMA } },
    fallbacks: 'default',
    messages: [{ role: 'user', content: promptTema_({ serie: dados.serie, titulo: dados.titulo, conteudo: dados.conteudo, quantidade: quantidade }) }],
  };
  let r = chamarClaude_(corpo, chave);
  if (r.codigo === 400 && JSON.stringify(r.json).indexOf('fallback') !== -1) {
    delete corpo.fallbacks;
    r = chamarClaude_(corpo, chave);
  }
  if (r.codigo === 401) throw new Error('Chave da API inválida. Confira em Configurações.');
  if (r.codigo !== 200) {
    const msg = r.json && r.json.error ? r.json.error.message : 'código ' + r.codigo;
    throw new Error('A API do Claude recusou o pedido: ' + msg);
  }
  if (r.json.stop_reason === 'refusal') throw new Error('A IA não gerou o tema para este conteúdo. Tente reformular.');
  if (r.json.stop_reason === 'max_tokens') throw new Error('A resposta ficou longa demais. Peça menos palavras.');
  const texto = (r.json.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
  let tema;
  try { tema = JSON.parse(texto); } catch (e) { throw new Error('A resposta da IA veio em formato inesperado. Tente de novo.'); }
  return {
    titulo: textoLimpo_(tema.titulo, 60), titulo_pt: textoLimpo_(tema.titulo_pt, 80),
    palavras: tema.palavras || [], frases: tema.frases || [],
  };
}
````

### Arquivo: `TemasPadrao.gs`

Os 24 temas padrão (3º, 4º e 5º ano), baseados no Mapa de Progressão 2026 de Joinville. (345 linhas)

````javascript
/**
 * Temas padrão de 3º a 5º ano, baseados no Mapa de Progressão 2026 da Rede Municipal de Joinville.
 * Palavras: [inglês, português, figura]. A figura é um emoji (ou um número curto); vazia = o jogo mostra o português.
 * Frases: [inglês, português]. "mes" é o mês em que o tema começa a ser trabalhado.
 */

const TEMAS_PADRAO = [
  // ---------------- 3º ano ----------------
  {
    serie: '3º', trimestre: 1, mes: 3, titulo: 'Meeting people', titulo_pt: 'Conhecendo pessoas',
    conteudo: 'Cumprimentos, despedidas e apresentação pessoal (nome).',
    palavras: [
      ['hello', 'olá', '👋'], ['goodbye', 'tchau', '🚶'], ['teacher', 'professor(a)', '🧑‍🏫'], ['student', 'aluno(a)', '🧒'],
      ['friend', 'amigo(a)', '🤝'], ['name', 'nome', '📛'], ['boy', 'menino', '👦'], ['girl', 'menina', '👧'],
      ['school', 'escola', '🏫'], ['yes', 'sim', '👍'], ['no', 'não', '👎'],
    ],
    frases: [
      ['Hello!', 'Olá!'], ['Hi! My name is Ana.', 'Oi! Meu nome é Ana.'], ["What's your name?", 'Qual é o seu nome?'],
      ['My name is Leo.', 'Meu nome é Leo.'], ['Nice to meet you!', 'Prazer em conhecer você!'],
      ['Goodbye, teacher!', 'Tchau, professor(a)!'], ['See you later!', 'Até mais tarde!'],
    ],
  },
  {
    serie: '3º', trimestre: 1, mes: 4, titulo: 'Magic words', titulo_pt: 'Palavras mágicas e cumprimentos',
    conteudo: 'Linguagem de boas maneiras e cumprimentos ao longo do dia.',
    palavras: [
      ['please', 'por favor', '🥺'], ['thank you', 'obrigado(a)', '🙏'], ["you're welcome", 'de nada', '😊'],
      ['sorry', 'desculpe', '😔'], ['excuse me', 'com licença', '🙋'], ['good morning', 'bom dia', '🌅'],
      ['good afternoon', 'boa tarde', '☀️'], ['good evening', 'boa noite (ao chegar)', '🌆'], ['good night', 'boa noite (ao dormir)', '🌙'],
    ],
    frases: [
      ['Good morning, teacher!', 'Bom dia, professor(a)!'], ['Thank you, Ana!', 'Obrigado, Ana!'], ["You're welcome!", 'De nada!'],
      ['Sorry!', 'Desculpe!'], ['Excuse me, teacher.', 'Com licença, professor(a).'],
      ['Can I have a pencil, please?', 'Posso pegar um lápis, por favor?'], ['Good night, mom!', 'Boa noite, mamãe!'],
    ],
  },
  {
    serie: '3º', trimestre: 2, mes: 5, titulo: 'School objects', titulo_pt: 'Objetos escolares',
    conteudo: 'Objetos escolares e comandos de sala de aula.',
    palavras: [
      ['book', 'livro', '📕'], ['notebook', 'caderno', '📓'], ['pencil', 'lápis', '✏️'], ['pen', 'caneta', '🖊️'],
      ['eraser', 'borracha', ''], ['ruler', 'régua', '📏'], ['scissors', 'tesoura', '✂️'], ['glue', 'cola', '🧴'],
      ['backpack', 'mochila', '🎒'], ['pencil case', 'estojo', '👝'], ['crayon', 'giz de cera', '🖍️'],
      ['paintbrush', 'pincel', '🖌️'], ['computer', 'computador', '💻'],
    ],
    frases: [
      ["It's a pencil.", 'É um lápis.'], ["What's this? It's a book.", 'O que é isto? É um livro.'],
      ['Open your book, please.', 'Abra o seu livro, por favor.'], ['Close your notebook.', 'Feche o seu caderno.'],
      ['I have a backpack.', 'Eu tenho uma mochila.'],
    ],
  },
  {
    serie: '3º', trimestre: 2, mes: 6, titulo: 'Colors', titulo_pt: 'Cores',
    conteudo: 'Cores.',
    palavras: [
      ['red', 'vermelho', '🔴'], ['blue', 'azul', '🔵'], ['yellow', 'amarelo', '🟡'], ['green', 'verde', '🟢'],
      ['black', 'preto', '⚫'], ['white', 'branco', '⚪'], ['orange', 'laranja', '🟠'], ['purple', 'roxo', '🟣'],
      ['brown', 'marrom', '🟤'], ['pink', 'rosa', '🩷'], ['gray', 'cinza', '🩶'],
    ],
    frases: [
      ["It's red.", 'É vermelho.'], ['My backpack is blue.', 'Minha mochila é azul.'],
      ['What color is it?', 'Que cor é?'], ["It's green.", 'É verde.'], ['I like yellow.', 'Eu gosto de amarelo.'],
      ['I have a pink pencil.', 'Eu tenho um lápis rosa.'],
    ],
  },
  {
    serie: '3º', trimestre: 2, mes: 8, titulo: 'Numbers 1 to 10', titulo_pt: 'Números de 1 a 10',
    conteudo: 'Números de 1 a 10 com objetos escolares e cores.',
    palavras: [
      ['one', 'um', '1️⃣'], ['two', 'dois', '2️⃣'], ['three', 'três', '3️⃣'], ['four', 'quatro', '4️⃣'], ['five', 'cinco', '5️⃣'],
      ['six', 'seis', '6️⃣'], ['seven', 'sete', '7️⃣'], ['eight', 'oito', '8️⃣'], ['nine', 'nove', '9️⃣'], ['ten', 'dez', '🔟'],
    ],
    frases: [
      ['I have two pencils.', 'Eu tenho dois lápis.'], ['How many books?', 'Quantos livros?'], ['Three books.', 'Três livros.'],
      ["I'm eight years old.", 'Eu tenho oito anos.'], ['I have five red crayons.', 'Eu tenho cinco gizes vermelhos.'],
    ],
  },
  {
    serie: '3º', trimestre: 3, mes: 9, titulo: 'My family', titulo_pt: 'Minha família',
    conteudo: 'Membros da família.',
    palavras: [
      ['mother', 'mãe', '👩'], ['father', 'pai', '👨'], ['sister', 'irmã', '👧'], ['brother', 'irmão', '👦'],
      ['grandmother', 'avó', '👵'], ['grandfather', 'avô', '👴'], ['baby', 'bebê', '👶'], ['family', 'família', '👨‍👩‍👧‍👦'],
    ],
    frases: [
      ['This is my mother.', 'Esta é a minha mãe.'], ['This is my father.', 'Este é o meu pai.'],
      ['I have one brother.', 'Eu tenho um irmão.'], ['I have two sisters.', 'Eu tenho duas irmãs.'],
      ['I love my family.', 'Eu amo a minha família.'],
    ],
  },
  {
    serie: '3º', trimestre: 3, mes: 10, titulo: 'My pets', titulo_pt: 'Meus animais de estimação',
    conteudo: 'Animais de estimação, com cores e números para descrevê-los.',
    palavras: [
      ['dog', 'cachorro', '🐶'], ['cat', 'gato', '🐱'], ['fish', 'peixe', '🐠'], ['bird', 'pássaro', '🐦'],
      ['rabbit', 'coelho', '🐰'], ['hamster', 'hamster', '🐹'], ['turtle', 'tartaruga', '🐢'], ['parrot', 'papagaio', '🦜'],
      ['mouse', 'ratinho', '🐭'],
    ],
    frases: [
      ['I have a dog.', 'Eu tenho um cachorro.'], ['My cat is black.', 'Meu gato é preto.'], ['I have two fish.', 'Eu tenho dois peixes.'],
      ['Do you have a pet?', 'Você tem um animal de estimação?'], ["I don't have a pet.", 'Eu não tenho animal de estimação.'],
    ],
  },
  {
    serie: '3º', trimestre: 3, mes: 11, titulo: 'Toys', titulo_pt: 'Brinquedos',
    conteudo: 'Brinquedos, com cores e números para descrevê-los.',
    palavras: [
      ['ball', 'bola', '⚽'], ['doll', 'boneca', '🪆'], ['teddy bear', 'ursinho de pelúcia', '🧸'], ['kite', 'pipa', '🪁'],
      ['yo-yo', 'ioiô', '🪀'], ['car', 'carrinho', '🚗'], ['train', 'trem', '🚂'], ['robot', 'robô', '🤖'],
      ['puzzle', 'quebra-cabeça', '🧩'], ['video game', 'videogame', '🎮'], ['balloon', 'balão', '🎈'], ['bike', 'bicicleta', '🚲'],
      ['skateboard', 'skate', '🛹'],
    ],
    frases: [
      ['I have a red ball.', 'Eu tenho uma bola vermelha.'], ['My favorite toy is my bike.', 'Meu brinquedo favorito é a minha bicicleta.'],
      ['I have three cars.', 'Eu tenho três carrinhos.'], ["Let's play!", 'Vamos brincar!'],
    ],
  },

  // ---------------- 4º ano ----------------
  {
    serie: '4º', trimestre: 1, mes: 3, titulo: 'School objects', titulo_pt: 'Objetos escolares',
    conteudo: 'Objetos escolares; perguntar e responder sobre eles com cores e números até 10.',
    palavras: [
      ['book', 'livro', '📕'], ['notebook', 'caderno', '📓'], ['pencil', 'lápis', '✏️'], ['eraser', 'borracha', ''],
      ['sharpener', 'apontador', ''], ['pencil case', 'estojo', '👝'], ['glue', 'cola', '🧴'], ['scissors', 'tesoura', '✂️'],
      ['ruler', 'régua', '📏'], ['pen', 'caneta', '🖊️'], ['backpack', 'mochila', '🎒'], ['crayon', 'giz de cera', '🖍️'],
    ],
    frases: [
      ["What's this? It's an eraser.", 'O que é isto? É uma borracha.'], ['I have a red pencil case.', 'Eu tenho um estojo vermelho.'],
      ['How many pencils?', 'Quantos lápis?'], ['Five pencils.', 'Cinco lápis.'],
      ['Can I borrow your glue, please?', 'Posso pegar sua cola emprestada, por favor?'],
    ],
  },
  {
    serie: '4º', trimestre: 1, mes: 3, titulo: 'Colors and numbers', titulo_pt: 'Revisão: cores e números até 10',
    conteudo: 'Revisão de cores e números até 10.',
    palavras: [
      ['red', 'vermelho', '🔴'], ['blue', 'azul', '🔵'], ['yellow', 'amarelo', '🟡'], ['green', 'verde', '🟢'],
      ['black', 'preto', '⚫'], ['white', 'branco', '⚪'], ['orange', 'laranja', '🟠'], ['purple', 'roxo', '🟣'],
      ['brown', 'marrom', '🟤'], ['pink', 'rosa', '🩷'], ['gray', 'cinza', '🩶'],
      ['one', 'um', '1️⃣'], ['two', 'dois', '2️⃣'], ['three', 'três', '3️⃣'], ['four', 'quatro', '4️⃣'], ['five', 'cinco', '5️⃣'],
      ['six', 'seis', '6️⃣'], ['seven', 'sete', '7️⃣'], ['eight', 'oito', '8️⃣'], ['nine', 'nove', '9️⃣'], ['ten', 'dez', '🔟'],
    ],
    frases: [
      ['I have three blue pens.', 'Eu tenho três canetas azuis.'], ['My notebook is green.', 'Meu caderno é verde.'],
      ['What color is your backpack?', 'De que cor é a sua mochila?'],
    ],
  },
  {
    serie: '4º', trimestre: 1, mes: 4, titulo: 'Months of the year', titulo_pt: 'Meses do ano',
    conteudo: 'Meses do ano para falar de aniversário.',
    palavras: [
      ['January', 'janeiro', ''], ['February', 'fevereiro', ''], ['March', 'março', ''], ['April', 'abril', ''],
      ['May', 'maio', ''], ['June', 'junho', ''], ['July', 'julho', ''], ['August', 'agosto', ''],
      ['September', 'setembro', ''], ['October', 'outubro', ''], ['November', 'novembro', ''], ['December', 'dezembro', ''],
    ],
    frases: [
      ['When is your birthday?', 'Quando é o seu aniversário?'], ['My birthday is in May.', 'Meu aniversário é em maio.'],
      ['Christmas is in December.', 'O Natal é em dezembro.'], ['School starts in February.', 'As aulas começam em fevereiro.'],
    ],
  },
  {
    serie: '4º', trimestre: 1, mes: 5, titulo: 'Birthday party', titulo_pt: 'Festa de aniversário',
    conteudo: 'Vocabulário de aniversário, idade e convite.',
    palavras: [
      ['birthday cake', 'bolo de aniversário', '🎂'], ['party', 'festa', '🎉'], ['present', 'presente', '🎁'],
      ['balloon', 'balão', '🎈'], ['candle', 'vela', '🕯️'], ['card', 'cartão', '💌'], ['invitation', 'convite', '✉️'],
      ['ice cream', 'sorvete', '🍦'], ['candy', 'doce', '🍬'], ['juice', 'suco', '🧃'], ['party hat', 'chapéu de festa', '🥳'],
    ],
    frases: [
      ['Happy birthday!', 'Feliz aniversário!'], ['How old are you?', 'Quantos anos você tem?'],
      ["I'm nine years old.", 'Eu tenho nove anos.'], ["You're invited to my party!", 'Você está convidado para a minha festa!'],
      ['This present is for you.', 'Este presente é para você.'],
    ],
  },
  {
    serie: '4º', trimestre: 2, mes: 6, titulo: 'Animals', titulo_pt: 'Animais',
    conteudo: 'Animais da fazenda e selvagens, com cores para descrevê-los.',
    palavras: [
      ['cow', 'vaca', '🐄'], ['horse', 'cavalo', '🐴'], ['pig', 'porco', '🐷'], ['sheep', 'ovelha', '🐑'],
      ['chicken', 'galinha', '🐔'], ['duck', 'pato', '🦆'], ['goat', 'cabra', '🐐'], ['lion', 'leão', '🦁'],
      ['tiger', 'tigre', '🐯'], ['elephant', 'elefante', '🐘'], ['monkey', 'macaco', '🐒'], ['giraffe', 'girafa', '🦒'],
      ['zebra', 'zebra', '🦓'], ['bear', 'urso', '🐻'], ['snake', 'cobra', '🐍'], ['frog', 'sapo', '🐸'],
    ],
    frases: [
      ["It's a lion.", 'É um leão.'], ['The elephant is gray.', 'O elefante é cinza.'], ['I like monkeys.', 'Eu gosto de macacos.'],
      ['The frog is green.', 'O sapo é verde.'], ['A cow lives on a farm.', 'A vaca vive na fazenda.'],
    ],
  },
  {
    serie: '4º', trimestre: 2, mes: 8, titulo: 'Numbers 11 to 20', titulo_pt: 'Números de 11 a 20',
    conteudo: 'Números de 11 a 20 para contar animais.',
    palavras: [
      ['eleven', 'onze', '11'], ['twelve', 'doze', '12'], ['thirteen', 'treze', '13'], ['fourteen', 'catorze', '14'],
      ['fifteen', 'quinze', '15'], ['sixteen', 'dezesseis', '16'], ['seventeen', 'dezessete', '17'], ['eighteen', 'dezoito', '18'],
      ['nineteen', 'dezenove', '19'], ['twenty', 'vinte', '20'],
    ],
    frases: [
      ['How many cows?', 'Quantas vacas?'], ['Twelve cows.', 'Doze vacas.'], ['There are fifteen ducks.', 'Há quinze patos.'],
      ['I can see twenty birds.', 'Eu consigo ver vinte pássaros.'],
    ],
  },
  {
    serie: '4º', trimestre: 3, mes: 10, titulo: 'My body', titulo_pt: 'Partes do corpo',
    conteudo: 'Partes do corpo, adjetivos descritivos (big, small), cores e números até 20.',
    palavras: [
      ['head', 'cabeça', ''], ['eye', 'olho', '👁️'], ['ear', 'orelha', '👂'], ['nose', 'nariz', '👃'], ['mouth', 'boca', '👄'],
      ['teeth', 'dentes', '🦷'], ['hair', 'cabelo', '💇'], ['hand', 'mão', '✋'], ['arm', 'braço', '💪'], ['leg', 'perna', '🦵'],
      ['foot', 'pé', '🦶'], ['finger', 'dedo', '☝️'], ['tongue', 'língua', '👅'], ['big', 'grande', '🐘'], ['small', 'pequeno', '🐭'],
    ],
    frases: [
      ['I have two eyes.', 'Eu tenho dois olhos.'], ['The monster has three big eyes.', 'O monstro tem três olhos grandes.'],
      ['It has one small nose.', 'Ele tem um nariz pequeno.'], ['Touch your head!', 'Toque na sua cabeça!'],
      ['Clap your hands!', 'Bata palmas!'], ['My hair is brown.', 'Meu cabelo é castanho.'],
    ],
  },
  {
    serie: '4º', trimestre: 3, mes: 11, titulo: 'Food and drinks', titulo_pt: 'Alimentos e bebidas',
    conteudo: 'Alimentos e bebidas; I like / I don\'t like; Do you like…? Yes, I do / No, I don\'t.',
    palavras: [
      ['apple', 'maçã', '🍎'], ['banana', 'banana', '🍌'], ['bread', 'pão', '🍞'], ['cake', 'bolo', '🍰'], ['cheese', 'queijo', '🧀'],
      ['chicken', 'frango', '🍗'], ['egg', 'ovo', '🥚'], ['fish', 'peixe', '🐟'], ['ice cream', 'sorvete', '🍦'], ['juice', 'suco', '🧃'],
      ['milk', 'leite', '🥛'], ['orange', 'laranja', '🍊'], ['pizza', 'pizza', '🍕'], ['rice', 'arroz', '🍚'], ['salad', 'salada', '🥗'],
      ['sandwich', 'sanduíche', '🥪'], ['water', 'água', '💧'], ['carrot', 'cenoura', '🥕'], ['grapes', 'uvas', '🍇'], ['chocolate', 'chocolate', '🍫'],
    ],
    frases: [
      ['I like pizza.', 'Eu gosto de pizza.'], ["I don't like fish.", 'Eu não gosto de peixe.'], ['Do you like apples?', 'Você gosta de maçãs?'],
      ['Yes, I do.', 'Sim, eu gosto.'], ["No, I don't.", 'Não, eu não gosto.'], ["I'm hungry!", 'Estou com fome!'],
    ],
  },

  // ---------------- 5º ano ----------------
  {
    serie: '5º', trimestre: 1, mes: 3, titulo: 'Personal information', titulo_pt: 'Informações pessoais',
    conteudo: 'Informações pessoais (nome, idade, onde mora, favoritos) para se apresentar.',
    palavras: [
      ['name', 'nome', '📛'], ['age', 'idade', '🎂'], ['address', 'endereço', '🏠'], ['phone number', 'número de telefone', '📱'],
      ['email', 'e-mail', '📧'], ['city', 'cidade', '🏙️'], ['country', 'país', '🌎'], ['favorite', 'favorito', '⭐'],
      ['birthday', 'aniversário', '🎉'], ['school', 'escola', '🏫'],
    ],
    frases: [
      ['My name is Julia.', 'Meu nome é Julia.'], ["I'm ten years old.", 'Eu tenho dez anos.'], ['I live in Joinville.', 'Eu moro em Joinville.'],
      ['Where do you live?', 'Onde você mora?'], ['How old are you?', 'Quantos anos você tem?'],
      ['My favorite color is blue.', 'Minha cor favorita é azul.'], ['My favorite food is pizza.', 'Minha comida favorita é pizza.'],
    ],
  },
  {
    serie: '5º', trimestre: 1, mes: 4, titulo: 'Numbers to 100', titulo_pt: 'Números até 100',
    conteudo: 'Números até 100, com atenção à diferença entre -teen e -ty (13 x 30).',
    palavras: [
      ['thirteen', 'treze', '13'], ['thirty', 'trinta', '30'], ['fourteen', 'catorze', '14'], ['forty', 'quarenta', '40'],
      ['fifteen', 'quinze', '15'], ['fifty', 'cinquenta', '50'], ['sixteen', 'dezesseis', '16'], ['sixty', 'sessenta', '60'],
      ['seventeen', 'dezessete', '17'], ['seventy', 'setenta', '70'], ['eighteen', 'dezoito', '18'], ['eighty', 'oitenta', '80'],
      ['nineteen', 'dezenove', '19'], ['ninety', 'noventa', '90'], ['twenty-one', 'vinte e um', '21'], ['one hundred', 'cem', '100'],
    ],
    frases: [
      ["I'm eleven years old.", 'Eu tenho onze anos.'], ['My house number is forty-five.', 'O número da minha casa é quarenta e cinco.'],
      ['There are thirty students in my class.', 'Há trinta alunos na minha turma.'],
    ],
  },
  {
    serie: '5º', trimestre: 1, mes: 5, titulo: 'The alphabet', titulo_pt: 'O alfabeto',
    conteudo: 'Nomes das letras do alfabeto em inglês (preparação para o spelling bee).',
    palavras: [
      ['A', 'diga: ei', 'A'], ['B', 'diga: bi', 'B'], ['C', 'diga: si', 'C'], ['D', 'diga: di', 'D'], ['E', 'diga: i', 'E'],
      ['F', 'diga: éf', 'F'], ['G', 'diga: dji', 'G'], ['H', 'diga: eitch', 'H'], ['I', 'diga: ai', 'I'], ['J', 'diga: djei', 'J'],
      ['K', 'diga: kei', 'K'], ['L', 'diga: él', 'L'], ['M', 'diga: ém', 'M'], ['N', 'diga: én', 'N'], ['O', 'diga: ou', 'O'],
      ['P', 'diga: pi', 'P'], ['Q', 'diga: kiu', 'Q'], ['R', 'diga: ar', 'R'], ['S', 'diga: és', 'S'], ['T', 'diga: ti', 'T'],
      ['U', 'diga: iu', 'U'], ['V', 'diga: vi', 'V'], ['W', 'diga: dâbliu', 'W'], ['X', 'diga: éks', 'X'], ['Y', 'diga: uai', 'Y'],
      ['Z', 'diga: zi', 'Z'],
    ],
    frases: [
      ['How do you spell your name?', 'Como se soletra o seu nome?'], ['A, B, C, D, E, F, G.', 'A, B, C, D, E, F, G.'],
      ['Can you spell it, please?', 'Você pode soletrar, por favor?'],
    ],
  },
  {
    serie: '5º', trimestre: 2, mes: 6, titulo: 'Spelling', titulo_pt: 'Soletrando',
    conteudo: 'Soletrar palavras curtas e o próprio nome.',
    palavras: [
      ['cat', 'gato', '🐱'], ['dog', 'cachorro', '🐶'], ['sun', 'sol', '☀️'], ['book', 'livro', '📕'], ['red', 'vermelho', '🔴'],
      ['bus', 'ônibus', '🚌'], ['pen', 'caneta', '🖊️'], ['egg', 'ovo', '🥚'], ['box', 'caixa', '📦'], ['hat', 'chapéu', '🎩'],
      ['fish', 'peixe', '🐠'], ['star', 'estrela', '⭐'], ['milk', 'leite', '🥛'], ['tree', 'árvore', '🌳'], ['frog', 'sapo', '🐸'],
      ['cake', 'bolo', '🍰'],
    ],
    frases: [
      ['How do you spell cat?', 'Como se soletra "cat"?'], ['C, A, T. Cat!', 'C, A, T. Gato!'],
      ['How do you spell your name?', 'Como se soletra o seu nome?'], ['J, U, L, I, A.', 'J, U, L, I, A.'],
    ],
  },
  {
    serie: '5º', trimestre: 2, mes: 8, titulo: 'Rooms of the house', titulo_pt: 'Cômodos da casa',
    conteudo: 'Partes (cômodos) de uma casa.',
    palavras: [
      ['house', 'casa', '🏠'], ['living room', 'sala de estar', '🛋️'], ['kitchen', 'cozinha', '🍳'], ['bedroom', 'quarto', '🛏️'],
      ['bathroom', 'banheiro', '🛁'], ['dining room', 'sala de jantar', '🍽️'], ['garden', 'jardim', '🌻'], ['garage', 'garagem', '🚗'],
    ],
    frases: [
      ["I'm in the kitchen.", 'Estou na cozinha.'], ['My house has two bedrooms.', 'Minha casa tem dois quartos.'],
      ['Where is dad? He is in the garden.', 'Onde está o papai? Ele está no jardim.'],
      ['There is a sofa in the living room.', 'Há um sofá na sala de estar.'],
    ],
  },
  {
    serie: '5º', trimestre: 2, mes: 9, titulo: 'Things in the house', titulo_pt: 'Objetos da casa',
    conteudo: 'Objetos e móveis de uma casa e onde eles ficam.',
    palavras: [
      ['sofa', 'sofá', '🛋️'], ['bed', 'cama', '🛏️'], ['chair', 'cadeira', '🪑'], ['table', 'mesa', ''], ['lamp', 'abajur', '💡'],
      ['TV', 'televisão', '📺'], ['door', 'porta', '🚪'], ['window', 'janela', '🪟'], ['mirror', 'espelho', '🪞'],
      ['shower', 'chuveiro', '🚿'], ['toilet', 'vaso sanitário', '🚽'], ['clock', 'relógio', '🕰️'], ['fridge', 'geladeira', ''],
      ['stove', 'fogão', ''], ['bathtub', 'banheira', '🛁'],
    ],
    frases: [
      ['The bed is in the bedroom.', 'A cama fica no quarto.'], ['There is a TV in the living room.', 'Há uma TV na sala de estar.'],
      ['The fridge is in the kitchen.', 'A geladeira fica na cozinha.'], ['There are two windows.', 'Há duas janelas.'],
    ],
  },
  {
    serie: '5º', trimestre: 3, mes: 10, titulo: 'The weather', titulo_pt: 'O tempo',
    conteudo: 'Condições do tempo; What\'s the weather like? It\'s sunny…',
    palavras: [
      ['sunny', 'ensolarado', '☀️'], ['cloudy', 'nublado', '☁️'], ['rainy', 'chuvoso', '🌧️'], ['windy', 'com vento', '🌬️'],
      ['snowy', 'com neve', '❄️'], ['stormy', 'com tempestade', '⛈️'], ['foggy', 'com neblina', '🌫️'], ['hot', 'quente', '🥵'],
      ['cold', 'frio', '🥶'], ['rainbow', 'arco-íris', '🌈'], ['umbrella', 'guarda-chuva', '☂️'],
    ],
    frases: [
      ["What's the weather like?", 'Como está o tempo?'], ["It's sunny today.", 'Está ensolarado hoje.'],
      ["It's cold and rainy.", 'Está frio e chuvoso.'], ['Take your umbrella!', 'Leve o seu guarda-chuva!'],
      ["It's hot in Joinville.", 'Está quente em Joinville.'],
    ],
  },
  {
    serie: '5º', trimestre: 3, mes: 11, titulo: 'Seasons and days', titulo_pt: 'Estações e dias da semana',
    conteudo: 'Estações do ano e dias da semana, relacionados ao tempo.',
    palavras: [
      ['spring', 'primavera', '🌸'], ['summer', 'verão', '🏖️'], ['autumn', 'outono', '🍂'], ['winter', 'inverno', '⛄'],
      ['Monday', 'segunda-feira', ''], ['Tuesday', 'terça-feira', ''], ['Wednesday', 'quarta-feira', ''], ['Thursday', 'quinta-feira', ''],
      ['Friday', 'sexta-feira', ''], ['Saturday', 'sábado', ''], ['Sunday', 'domingo', ''],
    ],
    frases: [
      ['Today is Monday.', 'Hoje é segunda-feira.'], ['What day is today?', 'Que dia é hoje?'], ["It's hot in summer.", 'Faz calor no verão.'],
      ["It's cold in winter.", 'Faz frio no inverno.'], ['My birthday is in spring.', 'Meu aniversário é na primavera.'],
    ],
  },
];
````

### Arquivo: `Jogos.gs`

Partidas, domínio por palavra, estrelas, progresso da turma e retorno do Speak!. (284 linhas)

````javascript
/**
 * Etapa 2: jogos, domínio por palavra e estrelinhas.
 *
 * Cada palavra tem pontos de 0 a 100 por aluno ("domínio"). Acertar de primeira soma, errar desconta.
 * O domínio do tema é a média dos pontos de todas as palavras do tema (as não jogadas valem 0).
 * Estrelas: a melhor nota (1 a 3) de cada jogo em cada tema.
 *
 * Gravação sem trava global: cada aluno só altera as próprias linhas do Progresso, e linhas novas
 * entram com appendRow (atômico). Assim 38 crianças terminando um jogo ao mesmo tempo não fazem fila.
 */

const JOGOS = {
  ouvir: { nome: 'Listen & Click', ganho: 25, parcial: 5, perda: 15 },
  memoria: { nome: 'Memory', ganho: 10, parcial: 0, perda: 0 },
  arrastar: { nome: 'Match it!', ganho: 25, parcial: 5, perda: 15 },
  montar: { nome: 'Spell it!', ganho: 30, parcial: 10, perda: 10 },
  cacar: { nome: 'Find it!', ganho: 10, parcial: 0, perda: 0 },
  colorir: { nome: 'Color it!', ganho: 25, parcial: 5, perda: 15 },
  frases: { nome: 'Build it!', ganho: 10, parcial: 5, perda: 0 },
  abelha: { nome: 'Spelling Bee', ganho: 35, parcial: 10, perda: 10 },
  repetir: { nome: 'Repeat after me', ganho: 0, parcial: 0, perda: 0 },
  falar: { nome: 'Speak!', ganho: 25, parcial: 10, perda: 5 },
};

/**
 * Speak! roda numa página fora do Apps Script (a moldura do Google não deixa usar o microfone).
 * A página recebe só as palavras do tema e devolve o resultado para a aba do app (postMessage).
 * Se isso não for possível, ela volta para o app com ?speak=<resultado> e o resultado é salvo aqui.
 */
const URL_SPEAK = 'https://lindomarandradegertrudes.github.io/english-kids-speak/jogo.html';

function paginaResultadoSpeak_(codigo) {
  let msg, ok = false;
  try {
    const b64 = String(codigo).replace(/-/g, '+').replace(/_/g, '/');
    const json = Utilities.newBlob(Utilities.base64Decode(b64 + '==='.slice((b64.length + 3) % 4))).getDataAsString('UTF-8');
    const r = JSON.parse(json);
    alunoSalvarJogada({
      id: r.id, tema_id: r.t, jogo: 'falar', palavras: r.palavras,
      acertos: r.acertos, total: r.total, estrelas: r.estrelas, segundos: r.segundos,
    });
    ok = true;
    msg = 'Suas estrelas do Speak! foram salvas. ⭐';
  } catch (err) {
    msg = 'Não consegui salvar o resultado do Speak!: ' + err.message;
  }
  const url = ScriptApp.getService().getUrl();
  const html = '<div style="font-family:Nunito,Segoe UI,sans-serif;text-align:center;padding:40px 20px;font-size:20px">' +
    '<div style="font-size:64px">' + (ok ? '✅' : '😕') + '</div><p style="font-weight:800">' + msg.replace(/</g, '&lt;') + '</p>' +
    '<p><a href="' + url + '" target="_top" style="display:inline-block;background:#e8590c;color:#fff;padding:14px 22px;border-radius:16px;font-weight:800;text-decoration:none">Voltar ao English Kids</a></p></div>';
  return HtmlService.createHtmlOutput(html).setTitle('English Kids App').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
const PONTOS_DOMINIO = 100;

// ============================================================
// Leitura
// ============================================================

function jsonObj_(txt) {
  try { const v = JSON.parse(txt || '{}'); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch (e) { return {}; }
}

function lerProgresso_() {
  return lerTabela_('Progresso').map(function (p) {
    return {
      _linha: p._linha, email: String(p.email).toLowerCase(), turma: String(p.turma), tema_id: String(p.tema_id),
      dominio: jsonObj_(p.dominio_json), estrelas: jsonObj_(p.estrelas_json),
      jogadas: Number(p.jogadas) || 0, segundos: Number(p.segundos) || 0, atualizado_em: String(p.atualizado_em),
    };
  });
}

/** Linhas do Progresso de um aluno, achadas pela busca da planilha (sem ler a aba inteira). */
function progressoDoAluno_(email) {
  const aba = aba_('Progresso');
  const n = aba.getLastRow() - 1;
  if (n < 1) return [];
  const largura = CABECALHOS.Progresso.length;
  return aba.getRange(2, 1, n, 1).createTextFinder(email).matchEntireCell(true).matchCase(false).findAll()
    .map(function (celula) {
      const linha = celula.getRow();
      const v = aba.getRange(linha, 1, 1, largura).getValues()[0];
      const o = {};
      CABECALHOS.Progresso.forEach(function (c, i) { o[c] = v[i]; });
      return {
        _linha: linha, email: String(o.email).toLowerCase(), turma: String(o.turma), tema_id: String(o.tema_id),
        dominio: jsonObj_(o.dominio_json), estrelas: jsonObj_(o.estrelas_json),
        jogadas: Number(o.jogadas) || 0, segundos: Number(o.segundos) || 0,
      };
    })
    .filter(function (p) { return p.email === email; });
}

/** Domínio do tema (0–100) considerando as palavras atuais do tema. */
function dominioTema_(tema, dominio) {
  if (!tema.palavras.length) return 0;
  const soma = tema.palavras.reduce(function (s, p) { return s + Math.min(PONTOS_DOMINIO, Number(dominio[p.en]) || 0); }, 0);
  return Math.round(soma / tema.palavras.length);
}

function somaEstrelas_(estrelas) {
  return Object.keys(estrelas).reduce(function (s, j) { return s + (Number(estrelas[j]) || 0); }, 0);
}

/** Resumo para a tela do aluno: { porTema: {id: {dominio, palavras, estrelas, jogadas}}, totalEstrelas }. */
function resumoProgressoAluno_(email, temas) {
  const linhas = progressoDoAluno_(email);
  const porTema = {};
  let total = 0;
  temas.forEach(function (t) {
    const p = linhas.filter(function (l) { return l.tema_id === t.id; })[0];
    const dominio = p ? p.dominio : {};
    const estrelas = p ? p.estrelas : {};
    const palavras = {};
    t.palavras.forEach(function (w) { if (dominio[w.en]) palavras[w.en] = Math.min(PONTOS_DOMINIO, Number(dominio[w.en])); });
    porTema[t.id] = { dominio: dominioTema_(t, dominio), palavras: palavras, estrelas: estrelas, jogadas: p ? p.jogadas : 0 };
  });
  // Estrelas de temas que foram ocultados depois continuam valendo.
  linhas.forEach(function (l) { total += somaEstrelas_(l.estrelas); });
  return { porTema: porTema, totalEstrelas: total };
}

// ============================================================
// Área do aluno
// ============================================================

function inteiro_(v, min, max) {
  v = Math.floor(Number(v) || 0);
  return Math.min(Math.max(v, min), max);
}

/**
 * Registra uma partida. j = { id, tema_id, jogo, palavras: {en: {a, e, c}}, acertos, total, estrelas, segundos }
 *   a = acertou de primeira (0/1), e = erros, c = concluiu a palavra (0/1).
 * O id vem do navegador: se a mesma partida chegar duas vezes (reenvio), conta uma só.
 */
function alunoSalvarJogada(j) {
  const aluno = alunoAtual_();
  const serie = serieDaTurma_(aluno.turma);
  const jogo = JOGOS[j && j.jogo];
  if (!jogo) throw new Error('Jogo desconhecido.');
  const id = String(j.id || '').replace(/[^\w-]/g, '').slice(0, 40);
  if (!id) throw new Error('Partida sem identificação.');
  const tema = lerTemas_().filter(function (t) { return t.id === String(j.tema_id); })[0];
  if (!tema || tema.serie !== serie) throw new Error('Este tema não está disponível para você.');

  const temaPorPalavra = {};
  tema.palavras.forEach(function (p) { temaPorPalavra[p.en] = true; });
  const palavras = {};
  Object.keys(j.palavras || {}).slice(0, 40).forEach(function (en) {
    if (!temaPorPalavra[en]) return; // palavra removida do tema enquanto a criança jogava
    const r = j.palavras[en] || {};
    palavras[en] = { a: inteiro_(r.a, 0, 1), e: inteiro_(r.e, 0, 5), c: inteiro_(r.c, 0, 1) };
  });
  const estrelas = inteiro_(j.estrelas, 1, 3);
  const segundos = inteiro_(j.segundos, 0, 3600);

  const abaJ = aba_('Jogadas');
  if (abaJ.getLastRow() > 1) {
    const repetida = abaJ.getRange(2, 1, abaJ.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
    if (repetida) return { tema_id: tema.id, progresso: resumoProgressoAluno_(aluno.email, temasDoAluno_(serie)) };
  }

  const linhas = progressoDoAluno_(aluno.email).filter(function (p) { return p.tema_id === tema.id; });
  const atual = linhas[0] || { dominio: {}, estrelas: {}, jogadas: 0, segundos: 0 };
  Object.keys(palavras).forEach(function (en) {
    const r = palavras[en];
    const antes = Number(atual.dominio[en]) || 0;
    const ganho = r.a ? jogo.ganho : r.c ? jogo.parcial : 0;
    atual.dominio[en] = Math.max(0, Math.min(PONTOS_DOMINIO, antes + ganho - r.e * jogo.perda));
  });
  atual.estrelas[j.jogo] = Math.max(Number(atual.estrelas[j.jogo]) || 0, estrelas);

  const agora = new Date();
  const dados = linhaDe_('Progresso', {
    email: aluno.email, turma: aluno.turma, tema_id: tema.id,
    dominio_json: JSON.stringify(atual.dominio), estrelas_json: JSON.stringify(atual.estrelas),
    jogadas: atual.jogadas + 1, segundos: atual.segundos + segundos, atualizado_em: agora,
  });
  const abaP = aba_('Progresso');
  if (linhas[0]) abaP.getRange(linhas[0]._linha, 1, 1, dados.length).setValues([dados]);
  else abaP.appendRow(dados);

  abaJ.appendRow(linhaDe_('Jogadas', {
    id: id, email: aluno.email, turma: aluno.turma, tema_id: tema.id, jogo: j.jogo,
    acertos: inteiro_(j.acertos, 0, 99), total: inteiro_(j.total, 0, 99), estrelas: estrelas, segundos: segundos,
    palavras_json: JSON.stringify(palavras), jogado_em: agora,
  }));

  return { tema_id: tema.id, progresso: resumoProgressoAluno_(aluno.email, temasDoAluno_(serie)) };
}

// ============================================================
// Painel do professor
// ============================================================

/**
 * Progresso de uma turma nos temas da série: domínio e estrelas por aluno e tema,
 * e as palavras com menor domínio médio de cada tema (entre quem já jogou).
 */
function profProgressoTurma(turma) {
  exigirProfessor_();
  validarTurma_(turma);
  const serie = serieDaTurma_(turma);
  const temas = ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie; }));
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === turma; });
  const emails = {};
  alunos.forEach(function (a) { emails[String(a.email).toLowerCase()] = true; });
  const progresso = lerProgresso_().filter(function (p) { return emails[p.email]; });
  const niveis = calcularNiveis_(lerConfig_());

  const lista = alunos.map(function (a) {
    const email = String(a.email).toLowerCase();
    const meus = progresso.filter(function (p) { return p.email === email; });
    const porTema = {};
    let segundos = 0, jogadas = 0, ultimo = '';
    meus.forEach(function (p) {
      segundos += p.segundos;
      jogadas += p.jogadas;
      if (chaveDataHora_(p.atualizado_em) > chaveDataHora_(ultimo)) ultimo = p.atualizado_em;
    });
    temas.forEach(function (t) {
      const p = meus.filter(function (x) { return x.tema_id === t.id; })[0];
      if (!p) return;
      porTema[t.id] = { dominio: dominioTema_(t, p.dominio), estrelas: somaEstrelas_(p.estrelas), jogadas: p.jogadas };
    });
    return {
      email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)),
      nivel: niveis[email] ? niveis[email].nivel : '', media: niveis[email] ? niveis[email].media : null,
      porTema: porTema, segundos: segundos, jogadas: jogadas, ultimo: ultimo,
      totalEstrelas: meus.reduce(function (s, p) { return s + somaEstrelas_(p.estrelas); }, 0),
    };
  });

  const dificeis = {};
  temas.forEach(function (t) {
    const daTurma = progresso.filter(function (p) { return p.tema_id === t.id; });
    if (!daTurma.length) return;
    // Média só entre quem já jogou a palavra; as ainda não sorteadas vão para o fim da lista.
    dificeis[t.id] = t.palavras.map(function (w) {
      const comPalavra = daTurma.filter(function (p) { return p.dominio.hasOwnProperty(w.en); });
      const soma = comPalavra.reduce(function (s, p) { return s + Math.min(PONTOS_DOMINIO, Number(p.dominio[w.en]) || 0); }, 0);
      return { en: w.en, pt: w.pt, figura: w.figura, alunos: comPalavra.length, media: comPalavra.length ? Math.round(soma / comPalavra.length) : null };
    }).sort(function (a, b) {
      if (a.media === null || b.media === null) return a.media === null ? (b.media === null ? 0 : 1) : -1;
      return a.media - b.media;
    });
  });

  return {
    turma: turma, serie: serie,
    temas: temas.map(function (t) { return { id: t.id, titulo: t.titulo, titulo_pt: t.titulo_pt, status: t.status, palavras: t.palavras.length }; }),
    alunos: lista, dificeis: dificeis, jogadoresPorTema: contarJogadores_(progresso),
  };
}

function contarJogadores_(progresso) {
  const c = {};
  progresso.forEach(function (p) { c[p.tema_id] = (c[p.tema_id] || 0) + 1; });
  return c;
}

/** "dd/MM/yyyy HH:mm" → "yyyyMMddHHmm" para comparar datas. */
function chaveDataHora_(texto) {
  const m = String(texto || '').match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  return m ? m[3] + m[2] + m[1] + m[4] + m[5] : '';
}

/** Domínio de cada palavra de um tema para um aluno (detalhe no painel). */
function profProgressoAlunoTema(email, temaId) {
  exigirProfessor_();
  email = String(email || '').toLowerCase();
  const tema = buscarTema_(String(temaId));
  const p = progressoDoAluno_(email).filter(function (x) { return x.tema_id === tema.id; })[0];
  const dominio = p ? p.dominio : {};
  return {
    tema: { id: tema.id, titulo: tema.titulo },
    estrelas: p ? p.estrelas : {},
    jogos: Object.keys(JOGOS).map(function (k) { return { id: k, nome: JOGOS[k].nome }; }),
    palavras: tema.palavras.map(function (w) {
      return { en: w.en, pt: w.pt, figura: w.figura, pontos: Math.min(PONTOS_DOMINIO, Number(dominio[w.en]) || 0) };
    }),
  };
}
````

### Arquivo: `Avaliacoes.gs`

Diagnóstico e quizzes: montagem das questões, correção, lançamento de impressos e níveis. (445 linhas)

````javascript
/**
 * Etapa 3: diagnóstico e quizzes mensais montados a partir dos temas, correção online,
 * lançamento de provas impressas e níveis.
 *
 * Tipos de questão (sempre 1 palavra do tema):
 *   ouvir  – a criança ouve a palavra em inglês e escolhe a figura;
 *   ler    – lê a palavra em inglês e escolhe a figura;
 *   figura – vê a figura e escolhe a palavra em inglês.
 * Cada questão guarda uma cópia das palavras: editar o tema depois não muda avaliações já feitas.
 *
 * O nível usa só as avaliações (média simples). Os jogos não entram no nível.
 */

const NIVEIS = ['Iniciante', 'Básico', 'Intermediário', 'Avançado'];
const LETRAS_ALT = ['A', 'B', 'C', 'D'];
const TIPOS_QUESTAO = ['ouvir', 'ler', 'figura'];
const STATUS_Q = ['rascunho', 'aberto', 'encerrado'];
const TIPOS_AVALIACAO = ['diagnostico', 'mensal'];

// ============================================================
// Leitura
// ============================================================

function jsonLista_(txt) {
  try { const v = JSON.parse(txt || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}

function lerQuestionarios_() {
  return lerTabela_('Questionarios').map(function (q) {
    return {
      _linha: q._linha, id: String(q.id), tipo: String(q.tipo), serie: String(q.serie), mes: String(q.mes),
      titulo: String(q.titulo), temas: jsonLista_(q.temas_json).map(String), questoes: jsonLista_(q.questoes_json),
      status: STATUS_Q.indexOf(String(q.status)) !== -1 ? String(q.status) : 'rascunho', criado_em: String(q.criado_em),
    };
  });
}

function buscarQuestionario_(id) {
  const q = lerQuestionarios_().filter(function (x) { return x.id === id; })[0];
  if (!q) throw new Error('Avaliação não encontrada. Recarregue a página.');
  return q;
}

function lerRespostas_() {
  return lerTabela_('Respostas').map(function (r) {
    return {
      _linha: r._linha, questionario_id: String(r.questionario_id), email: String(r.email).toLowerCase(),
      turma: String(r.turma), pontuacao: Number(r.pontuacao), total: Number(r.total), percentual: Number(r.percentual),
      detalhe: jsonObj_(r.detalhe_json), origem: String(r.origem), respondido_em: String(r.respondido_em),
    };
  });
}

function mesAtual_() {
  return Utilities.formatDate(new Date(), FUSO, 'yyyy-MM');
}

// ============================================================
// Montagem das questões
// ============================================================

function embaralhar_(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function copiaPalavra_(p) { return { en: String(p.en), pt: String(p.pt), figura: String(p.figura || '') }; }

/** O que aparece na alternativa: figura (ou português) nas questões ouvir/ler; a palavra em inglês na questão figura. */
function rotuloAlternativa_(tipo, p) {
  return tipo === 'figura' ? p.en.toLowerCase() : (p.figura || p.pt).toLowerCase();
}

/** Uma questão sobre a palavra p, com distratores do mesmo tema (ou dos outros temas escolhidos, se faltar). */
function montarQuestao_(tipo, p, tema, reserva) {
  const usados = {};
  usados[rotuloAlternativa_(tipo, p)] = true;
  const candidatos = embaralhar_(tema.palavras.filter(function (x) { return x.en !== p.en; }))
    .concat(embaralhar_(reserva.filter(function (x) { return x.en !== p.en; })));
  const distratores = [];
  candidatos.forEach(function (x) {
    const r = rotuloAlternativa_(tipo, x);
    if (distratores.length >= 3 || usados[r]) return;
    usados[r] = true;
    distratores.push(copiaPalavra_(x));
  });
  const alternativas = embaralhar_([copiaPalavra_(p)].concat(distratores));
  return {
    tipo: tipo, tema: tema.titulo, palavra: copiaPalavra_(p), alternativas: alternativas,
    correta: alternativas.map(function (a) { return a.en; }).indexOf(p.en),
  };
}

/**
 * Sorteia n questões distribuídas entre os temas (em rodízio), alternando os tipos.
 * evitar: palavras (en) que não devem entrar (já usadas nas outras questões).
 */
function gerarQuestoes_(temas, n, evitar, tipoFixo) {
  if (!temas.length) throw new Error('Escolha pelo menos um tema.');
  const bloqueadas = {};
  (evitar || []).forEach(function (en) { bloqueadas[String(en).toLowerCase()] = true; });
  const filas = temas.map(function (t) {
    return { tema: t, palavras: embaralhar_(t.palavras.filter(function (p) { return !bloqueadas[p.en.toLowerCase()]; })) };
  });
  const reserva = [];
  temas.forEach(function (t) { t.palavras.forEach(function (p) { reserva.push(p); }); });
  const tipos = TIPOS_QUESTAO.indexOf(tipoFixo) !== -1 ? [tipoFixo, tipoFixo, tipoFixo] : embaralhar_(['ouvir', 'ler', 'figura']);
  const questoes = [];
  const vistas = {};
  let k = 0, voltasVazias = 0;
  while (questoes.length < n && voltasVazias < filas.length) {
    const f = filas[k % filas.length];
    k++;
    const p = f.palavras.shift();
    if (!p) { voltasVazias++; continue; }
    voltasVazias = 0;
    if (vistas[p.en.toLowerCase()]) continue; // a mesma palavra em dois temas escolhidos
    vistas[p.en.toLowerCase()] = true;
    questoes.push(montarQuestao_(tipos[questoes.length % 3], p, f.tema, reserva));
  }
  if (questoes.length < n) throw new Error('Os temas escolhidos têm só ' + questoes.length + ' palavras disponíveis. Escolha mais temas ou peça menos questões.');
  return questoes;
}

function validarQuestoes_(questoes) {
  if (!Array.isArray(questoes) || !questoes.length) throw new Error('A avaliação precisa ter pelo menos uma questão.');
  if (questoes.length > 20) throw new Error('Máximo de 20 questões.');
  return questoes.map(function (q, i) {
    const n = 'Questão ' + (i + 1) + ': ';
    if (TIPOS_QUESTAO.indexOf(q.tipo) === -1) throw new Error(n + 'tipo inválido.');
    const palavra = q.palavra && q.palavra.en ? copiaPalavra_(q.palavra) : null;
    if (!palavra) throw new Error(n + 'sem palavra.');
    const alternativas = (q.alternativas || []).filter(function (a) { return a && a.en; }).map(copiaPalavra_);
    if (alternativas.length < 2 || alternativas.length > 4) throw new Error(n + 'use de 2 a 4 alternativas.');
    const correta = alternativas.map(function (a) { return a.en; }).indexOf(palavra.en);
    if (correta === -1) throw new Error(n + 'a resposta certa não está entre as alternativas.');
    return { tipo: q.tipo, tema: String(q.tema || ''), palavra: palavra, alternativas: alternativas, correta: correta };
  });
}

// ============================================================
// Níveis (só avaliações)
// ============================================================

function nivelDe_(media, cfg) {
  if (media === null || media === undefined) return '';
  if (media >= Number(cfg.faixa_avancado)) return NIVEIS[3];
  if (media >= Number(cfg.faixa_intermediario)) return NIVEIS[2];
  if (media >= Number(cfg.faixa_basico)) return NIVEIS[1];
  return NIVEIS[0];
}

/** Média simples de todas as avaliações respondidas (diagnóstico + mensais), por e-mail. */
function calcularNiveis_(cfg) {
  const soma = {};
  lerRespostas_().forEach(function (r) {
    if (isNaN(r.percentual)) return;
    soma[r.email] = soma[r.email] || { total: 0, n: 0 };
    soma[r.email].total += r.percentual;
    soma[r.email].n += 1;
  });
  const res = {};
  Object.keys(soma).forEach(function (email) {
    const media = Math.round((soma[email].total / soma[email].n) * 10) / 10;
    res[email] = { media: media, nivel: nivelDe_(media, cfg), avaliacoes: soma[email].n };
  });
  return res;
}

// ============================================================
// Correção e gravação
// ============================================================

function corrigir_(questoes, marcadas) {
  const acertos = questoes.map(function (q, i) { return marcadas[i] === q.correta; });
  const pontuacao = acertos.filter(Boolean).length;
  return {
    pontuacao: pontuacao, total: questoes.length,
    percentual: Math.round((pontuacao / questoes.length) * 1000) / 10,
    detalhe: { marcadas: marcadas, acertos: acertos },
  };
}

/** Linha de resposta de um aluno a uma avaliação (busca pela planilha, sem ler a aba inteira). */
function respostaDoAluno_(id, email) {
  const aba = aba_('Respostas');
  const n = aba.getLastRow() - 1;
  if (n < 1) return null;
  const col = CABECALHOS.Respostas.indexOf('email') + 1;
  const achadas = aba.getRange(2, col, n, 1).createTextFinder(email).matchEntireCell(true).matchCase(false).findAll();
  for (let i = 0; i < achadas.length; i++) {
    const linha = achadas[i].getRow();
    if (String(aba.getRange(linha, 1).getValue()) === id) return linha;
  }
  return null;
}

/** Grava (ou substitui) a resposta de um aluno. */
function gravarResposta_(q, email, turma, resultado, origem) {
  const linha = linhaDe_('Respostas', {
    questionario_id: q.id, email: email, turma: turma,
    pontuacao: resultado.pontuacao, total: resultado.total, percentual: resultado.percentual,
    detalhe_json: resultado.detalhe ? JSON.stringify(resultado.detalhe) : '', origem: origem, respondido_em: new Date(),
  });
  const existente = respostaDoAluno_(q.id, email);
  if (existente) aba_('Respostas').getRange(existente, 1, 1, linha.length).setValues([linha]);
  else aba_('Respostas').appendRow(linha);
}

// ============================================================
// Área do aluno
// ============================================================

/** Avaliações abertas da série que o aluno ainda não respondeu. */
function avaliacoesPendentes_(email, serie) {
  const abertas = lerQuestionarios_().filter(function (q) { return q.status === 'aberto' && q.serie === serie; });
  if (!abertas.length) return [];
  const feitas = {};
  lerRespostas_().forEach(function (r) { if (r.email === email) feitas[r.questionario_id] = true; });
  return abertas.filter(function (q) { return !feitas[q.id]; })
    .map(function (q) { return { id: q.id, titulo: q.titulo, tipo: q.tipo, total: q.questoes.length }; });
}

/** Entrega as questões SEM a resposta certa. */
function alunoAbrirAvaliacao(id) {
  const aluno = alunoAtual_();
  const serie = serieDaTurma_(aluno.turma);
  const q = buscarQuestionario_(id);
  if (q.status !== 'aberto' || q.serie !== serie) throw new Error('Esta avaliação não está disponível para você.');
  if (respostaDoAluno_(id, aluno.email)) throw new Error('Você já respondeu esta avaliação. 🎉');
  return {
    id: q.id, titulo: q.titulo, tipo: q.tipo,
    questoes: q.questoes.map(function (x) {
      return {
        tipo: x.tipo,
        audio: x.tipo === 'ouvir' ? x.palavra.en : '',
        texto: x.tipo === 'ler' ? x.palavra.en : '',
        figura: x.tipo === 'figura' ? (x.palavra.figura || x.palavra.pt) : '',
        figuraTexto: x.tipo === 'figura' && !x.palavra.figura,
        alternativas: x.alternativas.map(function (a) {
          return x.tipo === 'figura' ? { rotulo: a.en, texto: true } : { rotulo: a.figura || a.pt, texto: !a.figura };
        }),
      };
    }),
  };
}

/** Recebe as respostas. Se a mesma avaliação chegar de novo (reenvio da fila), não grava duas vezes. */
function alunoResponderAvaliacao(id, marcadas) {
  const aluno = alunoAtual_();
  const serie = serieDaTurma_(aluno.turma);
  const q = buscarQuestionario_(String(id));
  if (q.serie !== serie) throw new Error('Esta avaliação não está disponível para você.');
  if (respostaDoAluno_(q.id, aluno.email)) return { ok: true, repetida: true };
  if (q.status !== 'aberto') throw new Error('Esta avaliação foi encerrada pelo professor.');
  if (!Array.isArray(marcadas) || marcadas.length !== q.questoes.length) throw new Error('Responda todas as questões.');
  const normalizadas = marcadas.map(function (m, i) {
    const n = Number(m);
    return m !== null && m !== '' && n >= 0 && n < q.questoes[i].alternativas.length && n % 1 === 0 ? n : null;
  });
  if (normalizadas.some(function (m) { return m === null; })) throw new Error('Responda todas as questões.');
  gravarResposta_(q, aluno.email, aluno.turma, corrigir_(q.questoes, normalizadas), 'online');
  return { ok: true };
}

// ============================================================
// Painel do professor
// ============================================================

function profListarAvaliacoes() {
  exigirProfessor_();
  const contagem = {};
  lerRespostas_().forEach(function (r) { contagem[r.questionario_id] = (contagem[r.questionario_id] || 0) + 1; });
  return lerQuestionarios_().map(function (q) {
    delete q._linha;
    q.respostas = contagem[q.id] || 0;
    return q;
  }).sort(function (a, b) { return b.mes.localeCompare(a.mes) || a.serie.localeCompare(b.serie) || a.titulo.localeCompare(b.titulo); });
}

/** Monta questões para o editor (não grava). dados = { serie, temas: [id], quantidade, evitar: [en], tipo } */
function profGerarQuestoes(dados) {
  exigirProfessor_();
  const ids = (dados.temas || []).map(String);
  const temas = lerTemas_().filter(function (t) { return t.serie === dados.serie && ids.indexOf(t.id) !== -1; });
  const n = Math.min(Math.max(Number(dados.quantidade) || 10, 1), 20);
  return gerarQuestoes_(temas, n, dados.evitar, dados.tipo);
}

/** Temas sugeridos para o diagnóstico: 1º e 2º trimestres da série. */
function temasDoDiagnostico_(serie) {
  return ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie && t.trimestre <= 2; }));
}

function profSugestaoAvaliacao(tipo, serie) {
  exigirProfessor_();
  if (SERIES.indexOf(serie) === -1) throw new Error('Série inválida.');
  const mes = mesAtual_();
  const ano = mes.slice(0, 4);
  const nomesMes = ['', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  if (tipo === 'diagnostico') {
    return { tipo: tipo, serie: serie, mes: mes, titulo: 'Diagnóstico ' + serie + ' ano – ' + ano, temas: temasDoDiagnostico_(serie).map(function (t) { return t.id; }) };
  }
  const m = Number(mes.slice(5));
  const doMes = lerTemas_().filter(function (t) { return t.serie === serie && t.status === 'liberado' && (t.mes === m || t.mes === m - 1); });
  return { tipo: 'mensal', serie: serie, mes: mes, titulo: 'Quiz de ' + nomesMes[m] + ' – ' + serie + ' ano', temas: doMes.map(function (t) { return t.id; }) };
}

function profSalvarAvaliacao(dados) {
  exigirProfessor_();
  if (TIPOS_AVALIACAO.indexOf(dados.tipo) === -1) throw new Error('Tipo inválido.');
  if (SERIES.indexOf(dados.serie) === -1) throw new Error('Série inválida.');
  const titulo = String(dados.titulo || '').trim();
  if (!titulo) throw new Error('Informe um título.');
  const mes = /^\d{4}-\d{2}$/.test(dados.mes) ? dados.mes : mesAtual_();
  const questoes = validarQuestoes_(dados.questoes);
  const json = JSON.stringify(questoes);
  if (json.length > 49000) throw new Error('Avaliação grande demais. Use menos questões.');
  const temas = JSON.stringify((dados.temas || []).map(String));

  let id = String(dados.id || '');
  comTrava_(function () {
    const aba = aba_('Questionarios');
    if (!id) {
      id = 'Q' + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
      aba.appendRow(linhaDe_('Questionarios', {
        id: id, tipo: dados.tipo, serie: dados.serie, mes: "'" + mes, titulo: titulo, temas_json: temas,
        questoes_json: json, status: 'rascunho', criado_em: new Date(),
      }));
      return;
    }
    const atual = buscarQuestionario_(id);
    const temRespostas = lerRespostas_().some(function (r) { return r.questionario_id === id; });
    if (temRespostas && JSON.stringify(atual.questoes) !== json) throw new Error('Esta avaliação já tem respostas: as questões não podem mais mudar.');
    if (temRespostas && (atual.serie !== dados.serie || atual.tipo !== dados.tipo)) throw new Error('Esta avaliação já tem respostas: série e tipo não podem mudar.');
    const criado = aba.getRange(atual._linha, CABECALHOS.Questionarios.indexOf('criado_em') + 1).getValue();
    aba.getRange(atual._linha, 1, 1, CABECALHOS.Questionarios.length).setValues([linhaDe_('Questionarios', {
      id: id, tipo: dados.tipo, serie: dados.serie, mes: "'" + mes, titulo: titulo, temas_json: temas,
      questoes_json: json, status: atual.status, criado_em: criado,
    })]);
  });
  return { id: id, avaliacoes: profListarAvaliacoes() };
}

function profAlterarStatusAvaliacao(id, status) {
  exigirProfessor_();
  if (STATUS_Q.indexOf(status) === -1) throw new Error('Status inválido.');
  comTrava_(function () {
    const q = buscarQuestionario_(id);
    aba_('Questionarios').getRange(q._linha, CABECALHOS.Questionarios.indexOf('status') + 1).setValue(status);
  });
  return profListarAvaliacoes();
}

function profExcluirAvaliacao(id) {
  exigirProfessor_();
  comTrava_(function () {
    const q = buscarQuestionario_(id);
    const aba = aba_('Respostas');
    lerRespostas_().filter(function (r) { return r.questionario_id === id; })
      .map(function (r) { return r._linha; }).sort(function (a, b) { return b - a; })
      .forEach(function (l) { aba.deleteRow(l); });
    aba_('Questionarios').deleteRow(q._linha);
  });
  return profListarAvaliacoes();
}

/** Alunos das turmas da série com a resposta de cada um, e acerto por questão. */
function profResultadosAvaliacao(id) {
  exigirProfessor_();
  const q = buscarQuestionario_(id);
  delete q._linha;
  const turmas = listarTurmas_().filter(function (t) { return t.serie === q.serie; }).map(function (t) { return t.turma; });
  const respostas = lerRespostas_().filter(function (r) { return r.questionario_id === id; });
  const alunos = lerTabela_('Alunos')
    .filter(function (a) { return turmas.indexOf(String(a.turma)) !== -1; })
    .map(function (a) {
      const email = String(a.email).toLowerCase();
      const r = respostas.filter(function (x) { return x.email === email; })[0];
      return {
        email: email, nome: String(a.nome), turma: String(a.turma), avatar: avatarValido_(String(a.avatar)),
        resposta: r ? {
          pontuacao: r.pontuacao, total: r.total, percentual: r.percentual, origem: r.origem, respondido_em: r.respondido_em,
          marcadas: Array.isArray(r.detalhe.marcadas) ? r.detalhe.marcadas.map(function (m) { return m === null ? '-' : LETRAS_ALT[m]; }).join('') : '',
        } : null,
      };
    });
  const comDetalhe = respostas.filter(function (r) { return Array.isArray(r.detalhe.acertos); });
  const porQuestao = q.questoes.map(function (questao, i) {
    return {
      numero: i + 1, tipo: questao.tipo, palavra: questao.palavra, tema: questao.tema,
      respostas: comDetalhe.length, acertos: comDetalhe.filter(function (r) { return r.detalhe.acertos[i]; }).length,
    };
  });
  return { avaliacao: q, turmas: turmas, alunos: alunos, porQuestao: porQuestao };
}

/**
 * Lançamento de provas impressas. valor = letras marcadas em ordem (ex.: "ABDC…", "-" = em branco)
 * ou só o número de acertos. Valor vazio não altera nada.
 */
function profLancarRespostas(id, lancamentos) {
  exigirProfessor_();
  const q = buscarQuestionario_(id);
  const total = q.questoes.length;
  const turmaDe = {};
  lerTabela_('Alunos').forEach(function (a) { turmaDe[String(a.email).toLowerCase()] = String(a.turma); });

  const resultados = (lancamentos || []).filter(function (l) { return String(l.valor || '').trim(); }).map(function (l) {
    const email = String(l.email).toLowerCase();
    const bruto = String(l.valor).trim().toUpperCase().replace(/[\s,;.]/g, '');
    const nome = l.nome || email;
    if (/^\d+$/.test(bruto)) {
      const pontos = Number(bruto);
      if (pontos > total) throw new Error(nome + ': acertos maiores que o total de questões (' + total + ').');
      return { email: email, resultado: { pontuacao: pontos, total: total, percentual: Math.round((pontos / total) * 1000) / 10, detalhe: null } };
    }
    if (bruto.length !== total) throw new Error(nome + ': informe ' + total + ' letras (use "-" para questão em branco). Recebi ' + bruto.length + '.');
    const marcadas = bruto.split('').map(function (c, i) {
      if (c === '-' || c === 'X') return null;
      const idx = LETRAS_ALT.indexOf(c);
      if (idx === -1 || idx >= q.questoes[i].alternativas.length) throw new Error(nome + ': letra inválida "' + c + '" na questão ' + (i + 1) + '.');
      return idx;
    });
    return { email: email, resultado: corrigir_(q.questoes, marcadas) };
  });

  comTrava_(function () {
    resultados.forEach(function (r) { gravarResposta_(q, r.email, turmaDe[r.email] || '', r.resultado, 'impresso'); });
  });
  return profResultadosAvaliacao(id);
}

function profExcluirResposta(id, email) {
  exigirProfessor_();
  comTrava_(function () {
    const linha = respostaDoAluno_(id, String(email).toLowerCase());
    if (linha) aba_('Respostas').deleteRow(linha);
  });
  return profResultadosAvaliacao(id);
}
````

### Arquivo: `Equipes.gs`

Equipes mensais e placar. (232 linhas)

````javascript
/**
 * Etapa 4: equipes mensais (até 5 alunos, níveis misturados) e placar por equipes.
 *
 * A sugestão (serpentina + equilíbrio de médias) é calculada no painel; aqui ficam leitura e gravação.
 * Placar do mês: cada aluno soma a melhor nota (1–3 ⭐) de cada jogo em cada tema jogado NO MÊS.
 * Pontos da equipe = média de estrelas por membro (1 casa decimal),
 * para equipes menores não ficarem em desvantagem.
 */

const NOMES_EQUIPES = [
  ['Lions', '🦁'], ['Dolphins', '🐬'], ['Rockets', '🚀'], ['Pandas', '🐼'], ['Eagles', '🦅'],
  ['Dragons', '🐉'], ['Stars', '⭐'], ['Unicorns', '🦄'], ['Sharks', '🦈'], ['Bees', '🐝'],
  ['Foxes', '🦊'], ['Penguins', '🐧'],
];
const SEGUNDOS_CACHE_PLACAR = 120;

function nomeEquipe_(numero) {
  const n = NOMES_EQUIPES[(Number(numero) - 1) % NOMES_EQUIPES.length];
  return { numero: Number(numero), nome: n[0], emoji: n[1] };
}

function mesDe_(v) {
  return v instanceof Date ? Utilities.formatDate(v, FUSO, 'yyyy-MM') : String(v);
}

function lerEquipes_() {
  return lerTabela_('Equipes').map(function (g) {
    return {
      mes: String(g.mes), turma: String(g.turma), equipe: Number(g.equipe), email: String(g.email).toLowerCase(),
      nome: String(g.nome), nivel: String(g.nivel), media: g.media === '' ? null : Number(g.media), aplicado_em: String(g.aplicado_em),
    };
  });
}

/** Equipes em vigor numa turma num mês: as do próprio mês ou, se não houver, as do último mês anterior. */
function equipesVigentes_(turma, mes, todas) {
  const linhas = (todas || lerEquipes_()).filter(function (g) { return g.turma === turma && g.mes <= mes; });
  const mesVigente = linhas.map(function (g) { return g.mes; }).sort().pop() || '';
  return { mes: mesVigente, linhas: linhas.filter(function (g) { return g.mes === mesVigente; }) };
}

function montarEquipes_(linhas) {
  const por = {};
  linhas.forEach(function (l) { (por[l.equipe] = por[l.equipe] || []).push(l.email); });
  return Object.keys(por).map(Number).sort(function (a, b) { return a - b; })
    .map(function (n) { return { numero: n, membros: por[n] }; });
}

// ============================================================
// Estrelas do mês
// ============================================================

/** Estrelas que cada aluno da turma ganhou no mês (melhor nota de cada jogo em cada tema). */
function estrelasDoMes_(turma, mes) {
  const aba = aba_('Jogadas');
  const n = aba.getLastRow() - 1;
  const melhor = {};
  if (n < 1) return {};
  const cab = CABECALHOS.Jogadas;
  const iEmail = cab.indexOf('email'), iTurma = cab.indexOf('turma'), iTema = cab.indexOf('tema_id');
  const iJogo = cab.indexOf('jogo'), iEstrelas = cab.indexOf('estrelas'), iData = cab.indexOf('jogado_em');
  aba.getRange(2, 1, n, cab.length).getValues().forEach(function (l) {
    if (String(l[iTurma]) !== turma) return;
    const d = l[iData];
    if (!(d instanceof Date) || Utilities.formatDate(d, FUSO, 'yyyy-MM') !== mes) return;
    const chave = String(l[iEmail]).toLowerCase() + '|' + l[iTema] + '|' + l[iJogo];
    melhor[chave] = Math.max(melhor[chave] || 0, Number(l[iEstrelas]) || 0);
  });
  const porAluno = {};
  Object.keys(melhor).forEach(function (k) {
    const email = k.split('|')[0];
    porAluno[email] = (porAluno[email] || 0) + melhor[k];
  });
  return porAluno;
}

/** Placar das equipes em vigor no mês atual. Fica 2 minutos em cache para não pesar quando a turma toda abre o app. */
function placarTurma_(turma) {
  const mes = mesAtual_();
  const cache = CacheService.getScriptCache();
  const chave = 'placar:' + turma + ':' + mes;
  const guardado = cache.get(chave);
  if (guardado) return JSON.parse(guardado);

  const vig = equipesVigentes_(turma, mes);
  const alunos = {};
  lerTabela_('Alunos').forEach(function (a) {
    if (String(a.turma) === turma) alunos[String(a.email).toLowerCase()] = { nome: String(a.nome), avatar: avatarValido_(String(a.avatar)) };
  });
  const estrelas = estrelasDoMes_(turma, mes);
  const equipes = montarEquipes_(vig.linhas).map(function (e) {
    const membros = e.membros.filter(function (m) { return alunos[m]; });
    const soma = membros.reduce(function (s, m) { return s + (estrelas[m] || 0); }, 0);
    return Object.assign(nomeEquipe_(e.numero), {
      membros: membros.map(function (m) { return { email: m, nome: alunos[m].nome, avatar: alunos[m].avatar, estrelas: estrelas[m] || 0 }; }),
      estrelas: soma,
      pontos: membros.length ? Math.round((soma / membros.length) * 10) / 10 : 0,
    });
  }).filter(function (e) { return e.membros.length; })
    .sort(function (a, b) { return b.pontos - a.pontos || a.numero - b.numero; });

  const placar = { turma: turma, mes: mes, mesEquipes: vig.mes, equipes: equipes };
  try { cache.put(chave, JSON.stringify(placar), SEGUNDOS_CACHE_PLACAR); } catch (e) { /* placar grande demais para o cache: segue sem */ }
  return placar;
}

function limparCachePlacar_(turma) {
  try { CacheService.getScriptCache().remove('placar:' + turma + ':' + mesAtual_()); } catch (e) { /* ignora */ }
}

// ============================================================
// Área do aluno
// ============================================================

/** Equipe do aluno e o placar da turma (sem níveis nem notas: só nomes, bichinhos e estrelas). */
function equipeDoAluno_(email, turma) {
  const placar = placarTurma_(turma);
  if (!placar.equipes.length) return null;
  const minha = placar.equipes.filter(function (e) { return e.membros.some(function (m) { return m.email === email; }); })[0];
  const limpar = function (e) {
    return {
      numero: e.numero, nome: e.nome, emoji: e.emoji, pontos: e.pontos,
      membros: e.membros.map(function (m) { return { nome: m.nome.split(' ')[0], avatar: m.avatar, eu: m.email === email }; }),
    };
  };
  return {
    mes: placar.mes,
    minha: minha ? limpar(minha) : null,
    minhasEstrelas: minha ? minha.membros.filter(function (m) { return m.email === email; })[0].estrelas : 0,
    placar: placar.equipes.map(function (e, i) { return { posicao: i + 1, numero: e.numero, nome: e.nome, emoji: e.emoji, pontos: e.pontos, minha: e === minha }; }),
  };
}

// ============================================================
// Painel do professor
// ============================================================

function profEquipesResumo(mes) {
  exigirProfessor_();
  const niveis = calcularNiveis_(lerConfig_());
  const alunos = lerTabela_('Alunos');
  const todas = lerEquipes_();
  return listarTurmas_().map(function (t) {
    const daTurma = alunos.filter(function (a) { return String(a.turma) === t.turma; });
    const doMes = todas.filter(function (g) { return g.turma === t.turma && g.mes === mes; });
    const vig = equipesVigentes_(t.turma, mes, todas);
    return {
      turma: t.turma, serie: t.serie, alunos: daTurma.length,
      avaliados: daTurma.filter(function (a) { return niveis[String(a.email).toLowerCase()]; }).length,
      definido: doMes.length > 0, aplicado_em: doMes.length ? doMes[0].aplicado_em : '', ultimoMes: vig.mes,
    };
  });
}

function profEquipesTurma(turma, mes) {
  exigirProfessor_();
  validarTurma_(turma);
  const cfg = lerConfig_();
  const niveis = calcularNiveis_(cfg);
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === turma; }).map(function (a) {
    const email = String(a.email).toLowerCase();
    const n = niveis[email];
    return { email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)), media: n ? n.media : null, nivel: n ? n.nivel : '' };
  });
  const emails = alunos.map(function (a) { return a.email; });
  const vig = equipesVigentes_(turma, mes);
  return {
    turma: turma, mes: mes, maxEquipe: Number(cfg.tamanho_max_grupo) || 5, alunos: alunos,
    mesVigente: vig.mes, definidoNoMes: vig.mes === mes,
    equipes: montarEquipes_(vig.linhas.filter(function (g) { return emails.indexOf(g.email) !== -1; })),
    nomes: NOMES_EQUIPES.map(function (n, i) { return nomeEquipe_(i + 1); }),
  };
}

/** Grava as equipes de uma turma para o mês (substitui as desse mês). equipes: lista de listas de e-mails. */
function profSalvarEquipes(turma, mes, equipes) {
  exigirProfessor_();
  validarTurma_(turma);
  if (!/^\d{4}-\d{2}$/.test(mes)) throw new Error('Mês inválido.');
  const cfg = lerConfig_();
  const max = Number(cfg.tamanho_max_grupo) || 5;
  const niveis = calcularNiveis_(cfg);
  const alunos = {};
  lerTabela_('Alunos').forEach(function (a) { if (String(a.turma) === turma) alunos[String(a.email).toLowerCase()] = String(a.nome); });

  const vistos = {};
  const limpas = (equipes || []).map(function (g) { return g.map(function (e) { return String(e).toLowerCase(); }); })
    .filter(function (g) { return g.length; });
  if (!limpas.length) throw new Error('Nenhuma equipe para salvar.');
  limpas.forEach(function (g, i) {
    if (g.length > max) throw new Error('A equipe ' + (i + 1) + ' tem ' + g.length + ' alunos (máximo ' + max + ').');
    g.forEach(function (e) {
      if (!alunos[e]) throw new Error('Há um aluno que não pertence à turma ' + turma + '. Recarregue a página.');
      if (vistos[e]) throw new Error(alunos[e] + ' está em mais de uma equipe.');
      vistos[e] = true;
    });
  });

  const agora = new Date();
  const novas = [];
  limpas.forEach(function (g, i) {
    g.forEach(function (e) {
      const n = niveis[e];
      novas.push(linhaDe_('Equipes', {
        mes: "'" + mes, turma: turma, equipe: i + 1, email: e, nome: alunos[e],
        nivel: n ? n.nivel : '', media: n ? n.media : '', aplicado_em: agora,
      }));
    });
  });

  comTrava_(function () {
    const aba = aba_('Equipes');
    const largura = CABECALHOS.Equipes.length;
    const total = aba.getLastRow() - 1;
    const antigas = total > 0 ? aba.getRange(2, 1, total, largura).getValues() : [];
    const mantidas = antigas.filter(function (l) { return !(mesDe_(l[0]) === mes && String(l[1]) === turma); })
      .map(function (l) { l[0] = "'" + mesDe_(l[0]); return l; });
    if (total > 0) aba.getRange(2, 1, total, largura).clearContent();
    const linhas = mantidas.concat(novas);
    aba.getRange(2, 1, linhas.length, largura).setValues(linhas);
  });
  limparCachePlacar_(turma);
  return profEquipesTurma(turma, mes);
}

/** Placar atual da turma para o professor (inclui as estrelas de cada membro). */
function profPlacar(turma) {
  exigirProfessor_();
  validarTurma_(turma);
  limparCachePlacar_(turma);
  return placarTurma_(turma);
}
````

### Arquivo: `Relatorios.gs`

Relatórios, ficha do aluno e exportação para planilha. (249 linhas)

````javascript
/**
 * Etapa 6: relatórios — comparativo das turmas, palavras com mais dificuldade, ficha do aluno e exportação.
 */

/** Domínio médio do aluno nos temas que ele já jogou (0–100) e totais de jogo. */
function resumoJogosPorAluno_(temasPorId) {
  const res = {};
  lerProgresso_().forEach(function (p) {
    const t = temasPorId[p.tema_id];
    if (!t) return;
    const r = res[p.email] = res[p.email] || { soma: 0, temas: 0, estrelas: 0, jogadas: 0, segundos: 0, ultimo: '' };
    r.soma += dominioTema_(t, p.dominio);
    r.temas += 1;
    r.estrelas += somaEstrelas_(p.estrelas);
    r.jogadas += p.jogadas;
    r.segundos += p.segundos;
    if (chaveDataHora_(p.atualizado_em) > chaveDataHora_(r.ultimo)) r.ultimo = p.atualizado_em;
  });
  Object.keys(res).forEach(function (e) { res[e].dominio = Math.round(res[e].soma / res[e].temas); });
  return res;
}

function media_(lista) {
  return lista.length ? Math.round((lista.reduce(function (s, x) { return s + x; }, 0) / lista.length) * 10) / 10 : null;
}

function profRelatorioGeral() {
  exigirProfessor_();
  const cfg = lerConfig_();
  const niveis = calcularNiveis_(cfg);
  const temas = lerTemas_();
  const temasPorId = {};
  temas.forEach(function (t) { temasPorId[t.id] = t; });
  const jogos = resumoJogosPorAluno_(temasPorId);
  const alunos = lerTabela_('Alunos');
  const questionarios = lerQuestionarios_();
  const mesDe = {};
  questionarios.forEach(function (q) { mesDe[q.id] = q.mes; });
  const respostas = lerRespostas_();
  const mesAgora = mesAtual_();

  const turmas = listarTurmas_().map(function (t) {
    const emails = alunos.filter(function (a) { return String(a.turma) === t.turma; }).map(function (a) { return String(a.email).toLowerCase(); });
    const dist = {};
    NIVEIS.forEach(function (n) { dist[n] = 0; });
    const avaliados = emails.filter(function (e) { return niveis[e]; });
    avaliados.forEach(function (e) { dist[niveis[e].nivel] += 1; });
    const jogaram = emails.filter(function (e) { return jogos[e]; });
    const ativosMes = jogaram.filter(function (e) { return chaveDataHora_(jogos[e].ultimo).slice(0, 6) === mesAgora.replace('-', ''); });
    const porMes = {};
    respostas.filter(function (r) { return emails.indexOf(r.email) !== -1 && mesDe[r.questionario_id]; }).forEach(function (r) {
      (porMes[mesDe[r.questionario_id]] = porMes[mesDe[r.questionario_id]] || []).push(r.percentual);
    });
    return {
      turma: t.turma, serie: t.serie, alunos: emails.length, avaliados: avaliados.length,
      media: media_(avaliados.map(function (e) { return niveis[e].media; })), niveis: dist,
      jogaram: jogaram.length, ativosMes: ativosMes.length,
      dominio: media_(jogaram.map(function (e) { return jogos[e].dominio; })),
      partidas: jogaram.reduce(function (s, e) { return s + jogos[e].jogadas; }, 0),
      segundos: jogaram.reduce(function (s, e) { return s + jogos[e].segundos; }, 0),
      estrelas: jogaram.reduce(function (s, e) { return s + jogos[e].estrelas; }, 0),
      porMes: Object.keys(porMes).sort().map(function (m) { return { mes: m, media: media_(porMes[m]), respostas: porMes[m].length }; }),
    };
  });

  return { turmas: turmas, series: SERIES, niveis: NIVEIS, dificeis: palavrasDificeis_(temas, questionarios, respostas) };
}

/**
 * Palavras com mais dificuldade por série:
 *  - nas avaliações: % de acerto nas questões sobre a palavra (respostas com letras);
 *  - nos jogos: domínio médio entre os alunos que já jogaram a palavra.
 */
function palavrasDificeis_(temas, questionarios, respostas) {
  const porSerie = {};
  SERIES.forEach(function (s) { porSerie[s] = {}; });
  const chave = function (serie, p) { return (porSerie[serie][p.en.toLowerCase()] = porSerie[serie][p.en.toLowerCase()] || { en: p.en, pt: p.pt, figura: p.figura, av: [0, 0], jogo: [] }); };

  const qPorId = {};
  questionarios.forEach(function (q) { qPorId[q.id] = q; });
  respostas.forEach(function (r) {
    const q = qPorId[r.questionario_id];
    if (!q || !porSerie[q.serie] || !Array.isArray(r.detalhe.acertos)) return;
    q.questoes.forEach(function (questao, i) {
      const k = chave(q.serie, questao.palavra);
      k.av[1] += 1;
      if (r.detalhe.acertos[i]) k.av[0] += 1;
    });
  });

  const temaPorId = {};
  temas.forEach(function (t) { temaPorId[t.id] = t; });
  lerProgresso_().forEach(function (p) {
    const t = temaPorId[p.tema_id];
    if (!t || !porSerie[t.serie]) return;
    t.palavras.forEach(function (w) {
      if (!p.dominio.hasOwnProperty(w.en)) return;
      chave(t.serie, w).jogo.push(Math.min(PONTOS_DOMINIO, Number(p.dominio[w.en]) || 0));
    });
  });

  const res = {};
  SERIES.forEach(function (s) {
    res[s] = Object.keys(porSerie[s]).map(function (k) {
      const x = porSerie[s][k];
      return {
        en: x.en, pt: x.pt, figura: x.figura,
        avaliacao: x.av[1] ? Math.round((x.av[0] / x.av[1]) * 100) : null, respostas: x.av[1],
        jogos: x.jogo.length ? Math.round(x.jogo.reduce(function (a, b) { return a + b; }, 0) / x.jogo.length) : null, alunos: x.jogo.length,
      };
    });
  });
  return res;
}

/** Ficha do aluno: avaliações, nível, domínio por tema, palavras a reforçar e uso dos jogos. */
function profRelatorioAluno(email) {
  exigirProfessor_();
  email = String(email || '').toLowerCase();
  const aluno = lerTabela_('Alunos').filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
  if (!aluno) throw new Error('Aluno não encontrado.');
  const turma = String(aluno.turma), serie = serieDaTurma_(turma);
  const cfg = lerConfig_();
  const n = calcularNiveis_(cfg)[email];

  const qPorId = {};
  lerQuestionarios_().forEach(function (q) { qPorId[q.id] = q; });
  const avaliacoes = lerRespostas_().filter(function (r) { return r.email === email && qPorId[r.questionario_id]; })
    .map(function (r) {
      const q = qPorId[r.questionario_id];
      return { titulo: q.titulo, tipo: q.tipo, mes: q.mes, percentual: r.percentual, pontuacao: r.pontuacao, total: r.total, origem: r.origem, data: r.respondido_em };
    })
    .sort(function (a, b) { return a.mes.localeCompare(b.mes) || chaveDataHora_(a.data).localeCompare(chaveDataHora_(b.data)); });

  const progresso = progressoDoAluno_(email);
  const temas = ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie; }));
  const reforcar = [];
  let dominadas = 0, estrelas = 0, jogadas = 0, segundos = 0;
  const porTema = temas.map(function (t) {
    const p = progresso.filter(function (x) { return x.tema_id === t.id; })[0];
    if (p) {
      estrelas += somaEstrelas_(p.estrelas);
      jogadas += p.jogadas;
      segundos += p.segundos;
      t.palavras.forEach(function (w) {
        const v = Math.min(PONTOS_DOMINIO, Number(p.dominio[w.en]) || 0);
        if (v >= PONTOS_DOMINIO) dominadas += 1;
        if (p.dominio.hasOwnProperty(w.en) && v < 50) reforcar.push({ en: w.en, pt: w.pt, figura: w.figura, pontos: v, tema: t.titulo });
      });
    }
    return {
      titulo: t.titulo, titulo_pt: t.titulo_pt, status: t.status, palavras: t.palavras.length,
      dominio: p ? dominioTema_(t, p.dominio) : null, estrelas: p ? somaEstrelas_(p.estrelas) : 0, jogadas: p ? p.jogadas : 0,
    };
  }).filter(function (t) { return t.status === 'liberado' || t.jogadas; });

  const vig = equipesVigentes_(turma, mesAtual_());
  const minha = vig.linhas.filter(function (g) { return g.email === email; })[0];

  return {
    aluno: { nome: String(aluno.nome), turma: turma, serie: serie, avatar: avatarValido_(String(aluno.avatar)), email: email },
    nivel: n ? n.nivel : '', media: n ? n.media : null,
    avaliacoes: avaliacoes, temas: porTema,
    reforcar: reforcar.sort(function (a, b) { return a.pontos - b.pontos; }).slice(0, 12),
    jogos: { estrelas: estrelas, jogadas: jogadas, segundos: segundos, dominadas: dominadas },
    equipe: minha ? nomeEquipe_(minha.equipe) : null,
    faixas: { basico: Number(cfg.faixa_basico), intermediario: Number(cfg.faixa_intermediario), avancado: Number(cfg.faixa_avancado) },
  };
}

/** Cria uma planilha nova no Drive do professor com o retrato atual. Devolve o link. */
function profExportarPlanilha() {
  exigirProfessor_();
  const geral = profRelatorioGeral();
  const niveis = calcularNiveis_(lerConfig_());
  const temas = ordenarTemas_(lerTemas_());
  const temasPorId = {};
  temas.forEach(function (t) { temasPorId[t.id] = t; });
  const jogos = resumoJogosPorAluno_(temasPorId);
  const questionarios = lerQuestionarios_().sort(function (a, b) { return a.serie.localeCompare(b.serie) || a.mes.localeCompare(b.mes); });
  const respostas = lerRespostas_();
  const progresso = lerProgresso_();
  const agora = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm');
  const ss = SpreadsheetApp.create('Relatório – English Kids App – ' + agora);

  function preencher(aba, cabecalho, linhas) {
    const dados = [cabecalho].concat(linhas.length ? linhas : [cabecalho.map(function (_, i) { return i === 0 ? '(sem dados)' : ''; })]);
    aba.getRange(1, 1, dados.length, cabecalho.length).setValues(dados);
    aba.getRange(1, 1, 1, cabecalho.length).setFontWeight('bold').setBackground('#ffe8cc');
    aba.setFrozenRows(1);
    aba.autoResizeColumns(1, cabecalho.length);
  }

  preencher(ss.getSheets()[0].setName('Turmas'),
    ['Turma', 'Série', 'Alunos', 'Avaliados', 'Média avaliações (%)'].concat(NIVEIS).concat(['Jogaram', 'Domínio médio jogos (%)', 'Partidas', 'Minutos jogando', 'Estrelas']),
    geral.turmas.map(function (t) {
      return [t.turma, t.serie, t.alunos, t.avaliados, t.media === null ? '' : t.media]
        .concat(NIVEIS.map(function (n) { return t.niveis[n]; }))
        .concat([t.jogaram, t.dominio === null ? '' : t.dominio, t.partidas, Math.round(t.segundos / 60), t.estrelas]);
    }));

  const alunos = lerTabela_('Alunos').sort(function (a, b) {
    return String(a.turma).localeCompare(String(b.turma)) || String(a.nome).localeCompare(String(b.nome), 'pt-BR');
  });
  preencher(ss.insertSheet('Alunos'),
    ['Turma', 'Nome', 'E-mail', 'Nível', 'Média (%)', 'Avaliações', 'Domínio jogos (%)', 'Estrelas', 'Partidas', 'Minutos'].concat(questionarios.map(function (q) { return q.serie + ' ' + q.titulo; })),
    alunos.map(function (a) {
      const email = String(a.email).toLowerCase(), n = niveis[email], j = jogos[email], serie = serieDaTurma_(String(a.turma));
      return [String(a.turma), String(a.nome), email, n ? n.nivel : '', n ? n.media : '', n ? n.avaliacoes : 0,
        j ? j.dominio : '', j ? j.estrelas : 0, j ? j.jogadas : 0, j ? Math.round(j.segundos / 60) : 0]
        .concat(questionarios.map(function (q) {
          if (q.serie !== serie) return '';
          const r = respostas.filter(function (x) { return x.questionario_id === q.id && x.email === email; })[0];
          return r ? r.percentual : '';
        }));
    }));

  const linhasDom = [];
  alunos.forEach(function (a) {
    const email = String(a.email).toLowerCase();
    progresso.filter(function (p) { return p.email === email && temasPorId[p.tema_id]; }).forEach(function (p) {
      const t = temasPorId[p.tema_id];
      linhasDom.push([String(a.turma), String(a.nome), t.titulo, dominioTema_(t, p.dominio), somaEstrelas_(p.estrelas), p.jogadas, Math.round(p.segundos / 60)]);
    });
  });
  preencher(ss.insertSheet('Domínio por tema'), ['Turma', 'Nome', 'Tema', 'Domínio (%)', 'Estrelas', 'Partidas', 'Minutos'], linhasDom);

  const linhasPal = [];
  SERIES.forEach(function (s) {
    (geral.dificeis[s] || []).forEach(function (w) {
      linhasPal.push([s, w.en, w.pt, w.avaliacao === null ? '' : w.avaliacao, w.respostas, w.jogos === null ? '' : w.jogos, w.alunos]);
    });
  });
  linhasPal.sort(function (a, b) { return a[0].localeCompare(b[0]) || (a[3] === '' ? 999 : a[3]) - (b[3] === '' ? 999 : b[3]); });
  preencher(ss.insertSheet('Palavras'), ['Série', 'Palavra', 'Tradução', 'Acerto nas avaliações (%)', 'Respostas', 'Domínio nos jogos (%)', 'Alunos que jogaram'], linhasPal);

  const todas = lerEquipes_();
  const linhasEq = [];
  listarTurmas_().forEach(function (t) {
    const vig = equipesVigentes_(t.turma, mesAtual_(), todas);
    vig.linhas.sort(function (a, b) { return a.equipe - b.equipe || a.nome.localeCompare(b.nome, 'pt-BR'); }).forEach(function (g) {
      const n = nomeEquipe_(g.equipe);
      linhasEq.push([t.turma, "'" + vig.mes, n.emoji + ' ' + n.nome, g.nome, g.nivel, g.media === null ? '' : g.media]);
    });
  });
  preencher(ss.insertSheet('Equipes'), ['Turma', 'Mês', 'Equipe', 'Nome', 'Nível na formação', 'Média na formação (%)'], linhasEq);

  return ss.getUrl();
}
````

### Arquivo: `Estilo.html`

Estilos compartilhados e fonte do cabeçalho (incluído sem processamento). (112 linhas)

````html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --fundo: #fff9f2;
    --cartao: #ffffff;
    --texto: #1f2430;
    --suave: #667085;
    --borda: #e3e6ee;
    --primaria: #c2410c;
    --primaria-clara: #fff0e6;
    --perigo: #d6336c;
    --ok: #2b8a3e;
    --raio: 12px;
    --sombra: 0 1px 3px rgba(16, 24, 40, .08);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--fundo); color: var(--texto);
    font: 15px/1.5 "Segoe UI", Roboto, Arial, sans-serif;
  }
  h1, h2, h3 { margin: 0 0 .5em; line-height: 1.25; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1rem; }
  .suave { color: var(--suave); }
  .pequeno { font-size: .85rem; }

  .topo {
    display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
    padding: 14px 24px; background: var(--cartao); border-bottom: 1px solid var(--borda);
  }
  .marca { font-weight: 700; font-size: 1.1rem; }
  .marca span { font-weight: 400; color: var(--suave); margin-left: 6px; }

  .abas { display: flex; gap: 4px; padding: 0 24px; background: var(--cartao); border-bottom: 1px solid var(--borda); overflow-x: auto; }
  .abas button {
    border: 0; background: none; padding: 12px 14px; font: inherit; color: var(--suave); cursor: pointer;
    border-bottom: 2px solid transparent; white-space: nowrap;
  }
  .abas button.ativa { color: var(--primaria); border-bottom-color: var(--primaria); font-weight: 600; }
  .abas button:disabled { cursor: default; opacity: .55; }
  .etiqueta { font-size: .7rem; background: var(--borda); border-radius: 99px; padding: 1px 7px; margin-left: 4px; }

  main { max-width: 1100px; margin: 0 auto; padding: 24px 16px 64px; }
  .cartao { background: var(--cartao); border: 1px solid var(--borda); border-radius: var(--raio); box-shadow: var(--sombra); padding: 20px; }
  .pilha > * + * { margin-top: 16px; }

  .grade { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  .turma { cursor: pointer; transition: border-color .15s; }
  .turma:hover { border-color: var(--primaria); }
  .turma .num { font-size: 1.6rem; font-weight: 700; }
  .barra { height: 6px; background: var(--borda); border-radius: 99px; overflow: hidden; margin-top: 8px; }
  .barra i { display: block; height: 100%; background: var(--primaria); }

  .linha { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .espaco { flex: 1; }

  label { display: block; font-weight: 600; font-size: .9rem; margin-bottom: 4px; }
  input, select, textarea {
    width: 100%; font: inherit; padding: 9px 11px; border: 1px solid var(--borda); border-radius: 8px; background: #fff; color: inherit;
  }
  input:focus, select:focus, textarea:focus { outline: 2px solid var(--primaria-clara); border-color: var(--primaria); }
  .campo + .campo { margin-top: 14px; }
  .linha input, .linha select { width: auto; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--borda); background: #fff; color: var(--texto);
    padding: 8px 14px; border-radius: 8px; font: inherit; font-weight: 600; cursor: pointer;
  }
  .btn:hover { background: var(--fundo); }
  .btn.primario { background: var(--primaria); border-color: var(--primaria); color: #fff; }
  .btn.primario:hover { filter: brightness(1.08); }
  .btn.perigo { color: var(--perigo); }
  .btn.mini { padding: 4px 10px; font-size: .85rem; }
  .btn:disabled { opacity: .6; cursor: default; }

  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid var(--borda); vertical-align: middle; }
  th { font-size: .8rem; text-transform: uppercase; letter-spacing: .03em; color: var(--suave); }
  td.acoes { text-align: right; white-space: nowrap; }
  .tabela-rolagem { overflow-x: auto; }

  dialog { border: 0; border-radius: var(--raio); padding: 24px; width: min(440px, calc(100vw - 32px)); box-shadow: 0 20px 50px rgba(0,0,0,.25); }
  dialog::backdrop { background: rgba(15, 20, 35, .45); }
  .rodape-modal { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }

  .aviso {
    position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background: var(--texto); color: #fff;
    padding: 10px 18px; border-radius: 8px; box-shadow: var(--sombra); z-index: 10; max-width: calc(100vw - 32px);
  }
  .aviso.erro { background: var(--perigo); }
  .carregando { color: var(--suave); padding: 24px 0; text-align: center; }
  .vazio { color: var(--suave); text-align: center; padding: 24px; }
  .link-box { display: flex; gap: 8px; align-items: center; background: var(--primaria-clara); border-radius: 8px; padding: 10px 12px; }
  .link-box code { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .85rem; }

  /* Cabeçalho: marca do app (bandeira redonda + nome) */
  .marca-app { display: flex; align-items: center; gap: 12px; min-width: 0; flex-wrap: wrap; }
  .marca-app .bandeira {
    position: relative; flex: none; width: 46px; height: 46px; border-radius: 50%; overflow: hidden; background: #012169;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px #d5d9e2, 0 3px 8px rgba(16, 24, 40, .25);
  }
  .marca-app .bandeira svg { display: block; }
  .marca-app .bandeira::after {
    content: ""; position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(circle at 32% 25%, rgba(255,255,255,.55), rgba(255,255,255,0) 45%), radial-gradient(circle at 50% 120%, rgba(0,0,0,.25), rgba(0,0,0,0) 60%);
  }
  .marca-app .nome-app { font-family: "Roboto Condensed", "Arial Narrow", Arial, sans-serif; font-weight: 700; font-size: 1.65rem; color: #0b1736; letter-spacing: -.01em; line-height: 1.1; }
  .marca-app .sub-app { font-family: "Roboto Condensed", "Arial Narrow", Arial, sans-serif; font-weight: 400; font-size: 1.65rem; color: #7a8090; line-height: 1.1; }
  @media (max-width: 560px) { .marca-app .nome-app, .marca-app .sub-app { font-size: 1.3rem; } .marca-app .bandeira { width: 38px; height: 38px; } }
  [hidden] { display: none !important; }
</style>
````

### Arquivo: `Marca.html`

Marca do cabeçalho: bandeira redonda do Reino Unido (SVG) + nome do app. (11 linhas)

````html
<span class="bandeira" aria-hidden="true">
  <svg viewBox="15 0 30 30" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <clipPath id="bandeira-cruz"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <rect x="0" y="0" width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#bandeira-cruz)" stroke="#C8102E" stroke-width="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
  </svg>
</span>
<span class="nome-app">English Kids App</span>
````

### Arquivo: `Fala.html`

Voz em inglês (speechSynthesis) e reconhecimento de voz do Chrome. (122 linhas)

````html
<script>
  /**
   * Voz (fala em inglês) e escuta (reconhecimento de voz) do próprio Chrome.
   * Nada é gravado: o áudio do microfone é tratado pelo Chrome e só o texto reconhecido chega à página.
   */
  const Fala = {
    voz: null,
    velocidade: 0.85,
    pronta: null,

    disponivel() { return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window; },

    /** Escolhe a melhor voz em inglês. As vozes do Chrome carregam depois da página, por isso a espera. */
    iniciar() {
      if (this.pronta) return this.pronta;
      this.pronta = new Promise((ok) => {
        if (!this.disponivel()) { ok(null); return; }
        const escolher = () => {
          const vozes = speechSynthesis.getVoices();
          const ingles = vozes.filter((v) => /^en[-_]/i.test(v.lang));
          this.voz = ingles.find((v) => /Google US English/i.test(v.name))
            || ingles.find((v) => /^en[-_]US/i.test(v.lang) && v.localService)
            || ingles.find((v) => /^en[-_]US/i.test(v.lang))
            || ingles.find((v) => /^en[-_]GB/i.test(v.lang))
            || ingles[0] || null;
          return vozes.length > 0;
        };
        if (escolher()) { ok(this.voz); return; }
        speechSynthesis.addEventListener('voiceschanged', () => { escolher(); ok(this.voz); }, { once: true });
        setTimeout(() => { escolher(); ok(this.voz); }, 2500);
      });
      return this.pronta;
    },

    vozesIngles() {
      return this.disponivel() ? speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang)) : [];
    },

    /** Fala o texto em inglês. lento = para repetir devagar. Resolve quando termina (ou falha). */
    falar(texto, lento) {
      return new Promise((ok) => {
        if (!this.disponivel() || !texto) { ok(false); return; }
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(texto));
        u.lang = this.voz ? this.voz.lang : 'en-US';
        if (this.voz) u.voice = this.voz;
        u.rate = lento ? Math.max(0.5, this.velocidade - 0.25) : this.velocidade;
        // Alguns navegadores nunca disparam onend; o limite evita que o jogo fique esperando para sempre.
        let comecou = false, fim = false;
        const terminar = (v) => { if (!fim) { fim = true; clearTimeout(limite); ok(v); } };
        const limite = setTimeout(() => terminar(comecou), 2500 + String(texto).length * 150 / u.rate);
        u.onstart = () => (comecou = true);
        u.onend = () => terminar(true);
        u.onerror = () => terminar(false);
        speechSynthesis.speak(u);
      });
    },
  };

  const Escuta = {
    Reconhecedor: window.SpeechRecognition || window.webkitSpeechRecognition || null,

    suportada() { return !!this.Reconhecedor; },

    /**
     * Ouve uma fala curta em inglês e devolve as transcrições possíveis (em minúsculas).
     * Em caso de erro, rejeita com { codigo, mensagem } em português.
     */
    ouvir(opcoes) {
      opcoes = opcoes || {};
      return new Promise((ok, falha) => {
        if (!this.suportada()) { falha({ codigo: 'sem-suporte', mensagem: Escuta.mensagem('sem-suporte') }); return; }
        const r = new this.Reconhecedor();
        r.lang = opcoes.lang || 'en-US';
        r.interimResults = false;
        r.maxAlternatives = 5;
        r.continuous = false;
        let terminou = false;
        const limite = setTimeout(() => { try { r.stop(); } catch (e) { /* já parou */ } }, opcoes.segundos ? opcoes.segundos * 1000 : 6000);
        r.onresult = (ev) => {
          terminou = true;
          clearTimeout(limite);
          const res = ev.results[0];
          const lista = [];
          for (let i = 0; i < res.length; i++) lista.push(String(res[i].transcript).toLowerCase().trim());
          ok(lista);
        };
        r.onerror = (ev) => {
          if (terminou) return;
          terminou = true;
          clearTimeout(limite);
          falha({ codigo: ev.error, mensagem: Escuta.mensagem(ev.error) });
        };
        r.onend = () => {
          clearTimeout(limite);
          if (!terminou) { terminou = true; falha({ codigo: 'no-speech', mensagem: Escuta.mensagem('no-speech') }); }
        };
        if (opcoes.aoComecar) r.onstart = opcoes.aoComecar;
        try { r.start(); } catch (e) { falha({ codigo: 'start', mensagem: e.message }); }
      });
    },

    mensagem(codigo) {
      return {
        'sem-suporte': 'Este navegador não tem reconhecimento de voz.',
        'not-allowed': 'O microfone foi bloqueado (pelo navegador, pela página ou pela administração dos Chromebooks).',
        'service-not-allowed': 'O reconhecimento de voz está bloqueado neste navegador ou nesta página.',
        'no-speech': 'Não ouvi nada. Fale mais perto do microfone.',
        'audio-capture': 'Nenhum microfone encontrado.',
        'network': 'O reconhecimento de voz precisa de internet e não conseguiu se conectar.',
        'aborted': 'A escuta foi interrompida.',
        'language-not-supported': 'O idioma inglês não está disponível para reconhecimento.',
      }[codigo] || 'Erro no reconhecimento de voz (' + codigo + ').';
    },
  };

  /** Normaliza para comparar o que a criança falou com a palavra esperada. */
  function normalizarFala(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
</script>
````

### Arquivo: `Aluno.html`

MODELO da tela da criança: só inclui arquivos, sem código. (157 linhas)

````html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
  <?!= incluir('Estilo'); ?>
  <?!= incluir('Fala'); ?>
  <?!= incluir('JogosTela'); ?>
  <style>
    :root {
      --c1: #ff6b6b; --c2: #4dabf7; --c3: #51cf66; --c4: #fcc419; --c5: #b197fc; --c6: #ff922b;
      --tinta: #2b2f42;
    }
    body { font-family: Nunito, "Segoe UI", Roboto, Arial, sans-serif; font-size: 18px; color: var(--tinta); background: #fff9f2; }
    main { max-width: 980px; padding: 20px 16px 64px; }
    button { font-family: inherit; }
    h1 { font-size: 2rem; font-weight: 900; }
    h2 { font-size: 1.4rem; font-weight: 800; }

    .topo-kids { display: flex; align-items: center; gap: 14px 20px; padding: 12px 20px; background: #fff; border-bottom: 3px solid #ffe8cc; flex-wrap: wrap; }
    .eu-kids { display: flex; align-items: center; gap: 14px; margin-left: auto; }
    .avatar-btn { font-size: 2.6rem; line-height: 1; background: #fff3e6; border: 3px solid #ffc078; border-radius: 50%; width: 68px; height: 68px; cursor: pointer; flex: none; }
    .avatar-btn:hover { transform: scale(1.06); }
    .ola-kids { font-size: 1.5rem; font-weight: 900; margin: 0; }
    .sub-kids { color: #6c7086; font-weight: 700; font-size: .95rem; }

    .botao-grande {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 16px;
      padding: 14px 22px; font-size: 1.15rem; font-weight: 800; cursor: pointer; background: #e8590c; color: #fff;
      box-shadow: 0 4px 0 #a33a05; transition: transform .08s;
    }
    .botao-grande:active { transform: translateY(3px); box-shadow: 0 1px 0 #a33a05; }
    .botao-grande.claro { background: #fff; color: var(--tinta); box-shadow: 0 4px 0 #dee2e6; border: 2px solid #dee2e6; }
    .botao-grande:disabled { opacity: .6; cursor: default; }

    /* Cadastro */
    .passo { background: #fff; border-radius: 22px; padding: 22px; box-shadow: 0 4px 0 #ffe8cc; }
    .passo + .passo { margin-top: 16px; }
    .passo h2 { margin-bottom: 12px; }
    .passo input { font-size: 1.2rem; padding: 12px 14px; border-radius: 12px; border: 2px solid #dee2e6; }
    .opcoes-turma { display: flex; flex-wrap: wrap; gap: 10px; }
    .opcoes-turma button, .grade-avatares button {
      border: 3px solid #dee2e6; background: #fff; border-radius: 14px; cursor: pointer; font-weight: 800;
    }
    .opcoes-turma button { font-size: 1.2rem; padding: 10px 18px; }
    .opcoes-turma button.ativa, .grade-avatares button.ativa { border-color: #e8590c; background: #fff0e6; }
    .grade-avatares { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 8px; }
    .grade-avatares button { font-size: 2.2rem; padding: 6px 0; }
    .grade-avatares button:hover { transform: scale(1.08); }

    /* Temas */
    .grade-temas { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); }
    .cartao-tema {
      border: 0; border-radius: 22px; padding: 18px 16px; text-align: left; cursor: pointer; color: var(--tinta);
      box-shadow: 0 5px 0 rgba(0,0,0,.12); transition: transform .1s; min-height: 150px; display: flex; flex-direction: column; gap: 6px;
    }
    .cartao-tema:hover { transform: translateY(-3px) rotate(-.5deg); }
    .cartao-tema .figs { font-size: 2.3rem; display: flex; gap: 10px; font-weight: 900; }
    .cartao-tema .tit { font-size: 1.25rem; font-weight: 900; }
    .cartao-tema .tit-pt { font-weight: 700; opacity: .75; font-size: .95rem; }
    .cor-0 { background: #ffe3e3; } .cor-1 { background: #d0ebff; } .cor-2 { background: #d3f9d8; }
    .cor-3 { background: #fff3bf; } .cor-4 { background: #e5dbff; } .cor-5 { background: #ffe8cc; }

    /* Palavras */
    .barra-tema { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    .barra-tema h1 { margin: 0; flex: 1; }
    .alternar { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; cursor: pointer; background: #fff; border-radius: 99px; padding: 8px 14px; border: 2px solid #dee2e6; }
    .alternar input { width: 22px; height: 22px; }
    .grade-palavras { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    .palavra {
      position: relative; background: #fff; border: 3px solid #ffe8cc; border-radius: 20px; padding: 14px 8px 12px; text-align: center;
      cursor: pointer; box-shadow: 0 4px 0 #ffe8cc; transition: transform .1s;
    }
    .palavra:hover { border-color: #ffc078; }
    .palavra.falando { animation: pulo .45s; border-color: #e8590c; }
    @keyframes pulo { 30% { transform: scale(1.1) rotate(-3deg); } 60% { transform: scale(.97); } }
    .palavra .fig { font-size: 3.4rem; line-height: 1.1; min-height: 3.9rem; display: flex; align-items: center; justify-content: center; }
    .palavra .fig.texto { font-size: 1.25rem; font-weight: 900; color: #5f3dc4; background: #f3f0ff; border-radius: 12px; margin: 0 6px; padding: 4px; }
    .palavra .en { font-size: 1.3rem; font-weight: 900; margin-top: 6px; word-break: break-word; }
    .palavra .pt { font-weight: 700; color: #6c7086; font-size: .95rem; }
    .palavra .devagar { position: absolute; top: 6px; right: 6px; border: 0; background: #f1f3f5; border-radius: 50%; width: 34px; height: 34px; font-size: 1.1rem; cursor: pointer; }
    .frase { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 16px; padding: 12px 14px; border: 2px solid #ffe8cc; }
    .frase + .frase { margin-top: 10px; }
    .frase .txt { flex: 1; }
    .frase .en { font-size: 1.2rem; font-weight: 800; }
    .frase .pt { color: #6c7086; font-weight: 700; font-size: .95rem; }
    .frase button { border: 0; background: #fff0e6; border-radius: 50%; width: 48px; height: 48px; font-size: 1.4rem; cursor: pointer; flex: none; }
    .sem-pt .pt { display: none; }

    .minhas-estrelas { background: #fff9db; border: 3px solid #ffe066; border-radius: 99px; padding: 6px 16px; font-size: 1.4rem; font-weight: 900; white-space: nowrap; }
    .progresso-tema { margin-top: auto; display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: .9rem; }
    .barrinha { flex: 1; height: 12px; background: rgba(255,255,255,.75); border-radius: 99px; overflow: hidden; }
    .barrinha i { display: block; height: 100%; background: #2f9e44; border-radius: 99px; }
    .grade-jogos { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); margin-bottom: 26px; }
    .cartao-jogo {
      border-radius: 20px; padding: 16px; text-align: left; cursor: pointer; background: #fff; color: var(--tinta);
      box-shadow: 0 5px 0 #ffd8a8; border: 3px solid #ffd8a8; display: flex; gap: 12px; align-items: center;
    }
    .cartao-jogo:hover { transform: translateY(-2px); border-color: #ff922b; }
    .cartao-jogo .ic { font-size: 2.6rem; }
    .cartao-jogo .nm { font-weight: 900; font-size: 1.15rem; }
    .cartao-jogo .ds { font-weight: 700; font-size: .85rem; color: #6c7086; }
    .cartao-jogo .st { font-size: 1.05rem; letter-spacing: 1px; }
    .st .apagada { opacity: .25; filter: grayscale(1); }
    .palavra .dom { height: 8px; background: #f1f3f5; border-radius: 99px; overflow: hidden; margin: 8px 10px 0; }
    .palavra .dom i { display: block; height: 100%; background: #51cf66; }
    .palavra .selo-dominada { position: absolute; top: 6px; left: 8px; font-size: 1.2rem; }
    .quiz-aviso { display: flex; align-items: center; gap: 16px; background: linear-gradient(135deg, #fff3bf, #ffe8cc); border: 3px solid #ffd43b;
      border-radius: 22px; padding: 16px 18px; margin-bottom: 18px; box-shadow: 0 5px 0 #ffe066; flex-wrap: wrap; }
    .quiz-aviso .ic { font-size: 2.8rem; }
    .quiz-aviso .tx { flex: 1; min-width: 180px; }
    .quiz-aviso .tx strong { font-size: 1.25rem; font-weight: 900; display: block; }
    .q-centro { text-align: center; margin: 8px 0 20px; }
    .q-palavra { font-size: 2.6rem; font-weight: 900; background: #fff; border-radius: 18px; padding: 10px 26px; display: inline-block; border: 3px solid #ffe8cc; }
    .q-figura { font-size: 5.5rem; line-height: 1.1; }
    .q-figura.texto { font-size: 2rem; font-weight: 900; color: #5f3dc4; }
    .q-opcoes { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 560px; margin: 0 auto; }
    .q-opcao { background: #fff; border: 4px solid #e9ecef; border-radius: 22px; min-height: 120px; cursor: pointer; font-size: 3.8rem; box-shadow: 0 5px 0 #e9ecef; padding: 8px; color: var(--tinta); }
    .q-opcao.texto { font-size: 1.5rem; font-weight: 900; }
    .q-opcao.marcada { border-color: #1c7ed6; background: #e7f5ff; box-shadow: 0 5px 0 #a5d8ff; }
    .q-opcao .letra-op { display: block; font-size: .9rem; font-weight: 900; color: #868e96; text-align: left; }
    .q-rodape { display: flex; justify-content: space-between; gap: 12px; max-width: 560px; margin: 22px auto 0; }
    .minha-equipe { background: #fff; border-radius: 22px; padding: 16px 18px; margin-bottom: 20px; box-shadow: 0 5px 0 #d0ebff; border: 3px solid #a5d8ff; }
    .minha-equipe .cab-eq { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .minha-equipe .emoji-eq { font-size: 3rem; }
    .minha-equipe .nome-eq { font-size: 1.4rem; font-weight: 900; flex: 1; }
    .colegas-eq { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
    .colegas-eq span { background: #f1f3f5; border-radius: 99px; padding: 4px 12px 4px 6px; font-weight: 800; }
    .colegas-eq span.eu { background: #d0ebff; }
    .colegas-eq b { font-size: 1.4rem; vertical-align: middle; }
    .placar-mini { display: grid; gap: 6px; }
    .placar-mini div { display: grid; grid-template-columns: 34px 40px 1fr auto; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 12px; background: #f8f9fa; font-weight: 800; }
    .placar-mini div.minha { background: #fff3bf; outline: 3px solid #ffd43b; }
    .placar-mini .em { font-size: 1.6rem; }
    .mensagem { background: #fff; border-radius: 22px; padding: 28px; text-align: center; box-shadow: 0 4px 0 #ffe8cc; }
    .mensagem .grande { font-size: 4rem; }
    dialog { border-radius: 22px; }
    dialog h2 { font-weight: 900; }
  </style>
</head>
<body>
  <header class="topo-kids">
    <div class="marca-app"><?!= incluir('Marca'); ?></div>
    <div class="eu-kids" id="topo" hidden>
      <button class="avatar-btn" id="meu-avatar" title="Trocar meu bichinho" aria-label="Trocar meu bichinho"></button>
      <div>
        <p class="ola-kids">Hi, <span id="primeiro-nome"></span>! 👋</p>
        <div class="sub-kids">Turma <span id="minha-turma"></span></div>
      </div>
      <div class="minhas-estrelas" id="minhas-estrelas" title="Minhas estrelas">⭐ 0</div>
    </div>
  </header>
  <?!= incluir('AlunoCorpo'); ?>
</body>
</html>
````

### Arquivo: `AlunoCorpo.html`

Corpo e script da tela da criança. (506 linhas)

````html
<!-- Corpo da tela da criança (marcação e script).
     Fica num arquivo incluído sem processamento: o modelo Aluno.html não deve ter código,
     porque o Google processa o texto do modelo e pode alterar trechos do script. -->

  <main>
    <div id="carregando" class="carregando">Loading… ⏳</div>
    <div id="erro" class="mensagem" hidden></div>

    <!-- Cadastro -->
    <form id="cadastro" hidden>
      <h1>Welcome! 👋</h1>
      <p class="sub-kids" style="margin-top:-6px">Este é o seu primeiro acesso. Vamos começar!</p>
      <div class="passo">
        <h2>1. Qual é o seu nome completo?</h2>
        <input id="nome" autocomplete="name" required placeholder="Nome e sobrenome" spellcheck="false">
      </div>
      <div class="passo">
        <h2>2. Qual é a sua turma?</h2>
        <div class="opcoes-turma" id="opcoes-turma"></div>
      </div>
      <div class="passo">
        <h2>3. Escolha o seu bichinho</h2>
        <div class="grade-avatares" id="cad-avatares"></div>
      </div>
      <p style="text-align:center;margin-top:20px"><button class="botao-grande" type="submit">Pronto! ✅</button></p>
    </form>

    <div id="fechado" class="mensagem" hidden>
      <div class="grande">🔒</div>
      <h2>Hello!</h2>
      <p>O cadastro de novos alunos está fechado no momento. Fale com o seu professor.</p>
    </div>

    <!-- Início: temas -->
    <div id="inicio" hidden>
      <div id="quizzes"></div>
      <div id="equipe"></div>
      <h1>Choose a theme! 🎨</h1>
      <p class="sub-kids" style="margin-top:-6px">Escolha um tema para ouvir e aprender as palavras.</p>
      <div class="grade-temas" id="temas"></div>
    </div>

    <!-- Tema -->
    <div id="tema" hidden>
      <div class="barra-tema">
        <button class="botao-grande claro" id="voltar-temas" aria-label="Voltar">⬅</button>
        <h1 id="tema-titulo"></h1>
        <label class="alternar"><input type="checkbox" id="mostrar-pt"> 👀 Português</label>
      </div>
      <h2>🎮 Games</h2>
      <div class="grade-jogos" id="jogos-tema"></div>
      <h2>📚 Words</h2>
      <p class="sub-kids" style="margin-top:-6px">Toque na figura para ouvir. 🐢 = mais devagar. A barrinha verde enche quando você acerta nos jogos.</p>
      <div class="grade-palavras sem-pt" id="palavras"></div>
      <div id="bloco-frases" hidden>
        <h2 style="margin-top:28px">Sentences 💬</h2>
        <div id="frases" class="sem-pt"></div>
      </div>
    </div>

    <!-- Jogo -->
    <div id="jogo" hidden></div>

    <!-- Avaliação -->
    <div id="quiz" hidden></div>
  </main>

  <dialog id="confirmar">
    <h2>Está tudo certo?</h2>
    <p style="font-size:1.1rem"><span id="conf-avatar" style="font-size:2.4rem"></span><br>
      Nome: <strong id="conf-nome"></strong><br>Turma: <strong id="conf-turma"></strong></p>
    <p class="suave pequeno">Depois de confirmar, só o professor poderá mudar o nome e a turma.</p>
    <div class="rodape-modal">
      <button class="botao-grande claro" id="corrigir">Corrigir</button>
      <button class="botao-grande" id="confirmar-btn">Confirmar</button>
    </div>
  </dialog>

  <dialog id="trocar-avatar" style="width:min(520px, calc(100vw - 32px))">
    <h2>Escolha o seu bichinho</h2>
    <div class="grade-avatares" id="troca-avatares"></div>
    <div class="rodape-modal"><button class="botao-grande claro" id="fechar-avatar">Fechar</button></div>
  </dialog>

  <script>
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let estado = null;
    let temaAtual = null;
    const cadastro = { turma: '', avatar: '' };
    const NOMES_AVATAR = {
      '🐶': 'dog', '🐱': 'cat', '🦊': 'fox', '🐼': 'panda', '🐸': 'frog', '🦁': 'lion', '🐵': 'monkey', '🐰': 'rabbit', '🐯': 'tiger', '🐨': 'koala',
      '🐷': 'pig', '🐙': 'octopus', '🦄': 'unicorn', '🐢': 'turtle', '🐧': 'penguin', '🦉': 'owl', '🐬': 'dolphin', '🦖': 'dinosaur', '🐞': 'ladybug', '🦋': 'butterfly',
    };

    function chamar(fn, ...args) {
      return new Promise((ok, falha) => google.script.run.withSuccessHandler(ok).withFailureHandler(falha)[fn](...args));
    }

    function mostrar(id) {
      ['carregando', 'erro', 'cadastro', 'fechado', 'inicio', 'tema', 'jogo', 'quiz'].forEach((x) => ($(x).hidden = x !== id));
      $('topo').hidden = !estado || !estado.aluno;
      window.scrollTo(0, 0);
    }

    function mostrarErro(msg) {
      $('erro').innerHTML = `<div class="grande">😕</div><h2>Ops!</h2><p>${esc(msg)}</p>`;
      mostrar('erro');
    }

    function render(e) {
      estado = e;
      Fala.velocidade = e.velocidadeVoz;
      if (!e.aluno) { renderCadastro(); return; }
      $('meu-avatar').textContent = e.aluno.avatar;
      $('primeiro-nome').textContent = e.aluno.nome.split(' ')[0];
      $('minha-turma').textContent = e.aluno.turma;
      renderEstrelas();
      renderQuizzes();
      renderEquipe();
      renderTemas();
      mostrar('inicio');
      enviarFila();
    }

    function progressoDe(temaId) {
      return (estado.progresso && estado.progresso.porTema[temaId]) || { dominio: 0, palavras: {}, estrelas: {}, jogadas: 0 };
    }
    function somaEstrelas(estrelas) { return Object.values(estrelas || {}).reduce((s, n) => s + Number(n || 0), 0); }
    function renderEstrelas() {
      $('minhas-estrelas').textContent = '⭐ ' + (estado.progresso ? estado.progresso.totalEstrelas : 0);
    }

    // ---------- Cadastro ----------
    function renderCadastro() {
      if (!estado.cadastroAberto) { mostrar('fechado'); return; }
      const series = [...new Set(estado.turmas.map((t) => t.serie))];
      $('opcoes-turma').innerHTML = series.map((s) => estado.turmas.filter((t) => t.serie === s)
        .map((t) => `<button type="button" data-turma="${esc(t.turma)}" class="${t.turma === cadastro.turma ? 'ativa' : ''}">${esc(t.turma)}</button>`).join('')).join('');
      $('cad-avatares').innerHTML = estado.avatares.map((a) =>
        `<button type="button" data-avatar="${esc(a)}" class="${a === cadastro.avatar ? 'ativa' : ''}">${esc(a)}</button>`).join('');
      mostrar('cadastro');
    }
    $('opcoes-turma').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-turma]');
      if (!b) return;
      cadastro.turma = b.dataset.turma;
      $('opcoes-turma').querySelectorAll('button').forEach((x) => x.classList.toggle('ativa', x === b));
    });
    $('cad-avatares').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-avatar]');
      if (!b) return;
      cadastro.avatar = b.dataset.avatar;
      $('cad-avatares').querySelectorAll('button').forEach((x) => x.classList.toggle('ativa', x === b));
      Fala.iniciar().then(() => Fala.falar(NOMES_AVATAR[b.dataset.avatar] || ''));
    });
    $('cadastro').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const nome = $('nome').value.trim().replace(/\s+/g, ' ');
      if (nome.split(' ').length < 2) { alert('Escreva o seu nome e o seu sobrenome.'); $('nome').focus(); return; }
      if (!cadastro.turma) { alert('Escolha a sua turma.'); return; }
      if (!cadastro.avatar) { alert('Escolha um bichinho.'); return; }
      const minusculas = ['da', 'de', 'do', 'das', 'dos', 'e'];
      $('conf-nome').textContent = nome.toLowerCase().split(' ')
        .map((p, i) => (i > 0 && minusculas.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1))).join(' ');
      $('conf-turma').textContent = cadastro.turma;
      $('conf-avatar').textContent = cadastro.avatar;
      $('confirmar').showModal();
    });
    $('corrigir').addEventListener('click', () => $('confirmar').close());
    $('confirmar-btn').addEventListener('click', async () => {
      const botao = $('confirmar-btn');
      botao.disabled = true;
      try {
        const e = await chamar('alunoCadastrar', $('nome').value, cadastro.turma, cadastro.avatar);
        $('confirmar').close();
        render(e);
        Fala.iniciar().then(() => Fala.falar('Welcome! Let\'s learn English!'));
      } catch (e) {
        $('confirmar').close();
        alert(e.message);
      } finally { botao.disabled = false; }
    });

    // ---------- Bichinho ----------
    $('meu-avatar').addEventListener('click', () => {
      $('troca-avatares').innerHTML = estado.avatares.map((a) =>
        `<button type="button" data-avatar="${esc(a)}" class="${a === estado.aluno.avatar ? 'ativa' : ''}">${esc(a)}</button>`).join('');
      $('trocar-avatar').showModal();
    });
    $('fechar-avatar').addEventListener('click', () => $('trocar-avatar').close());
    $('troca-avatares').addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-avatar]');
      if (!b) return;
      const anterior = estado.aluno.avatar;
      estado.aluno.avatar = b.dataset.avatar;
      $('meu-avatar').textContent = b.dataset.avatar;
      $('trocar-avatar').close();
      try { await chamar('alunoTrocarAvatar', b.dataset.avatar); }
      catch (e) { estado.aluno.avatar = anterior; $('meu-avatar').textContent = anterior; alert(e.message); }
    });

    // ---------- Temas ----------
    function figuraHtml(p, classe) {
      return p.figura
        ? `<div class="${classe}">${esc(p.figura)}</div>`
        : `<div class="${classe} texto">${esc(p.pt)}</div>`;
    }

    function renderTemas() {
      const temas = estado.temas;
      $('temas').innerHTML = temas.length ? temas.map((t, i) => `
        <button class="cartao-tema cor-${i % 6}" data-tema="${esc(t.id)}">
          <span class="figs">${(t.palavras.map((p) => p.figura).filter(Boolean).slice(0, 3).map((f) => `<span>${esc(f)}</span>`).join('')) || '<span>🔤</span>'}</span>
          <span class="tit">${esc(t.titulo)}</span>
          <span class="tit-pt">${esc(t.titulo_pt)}</span>
          <span class="progresso-tema" title="Quanto você já aprendeu deste tema">
            <span class="barrinha"><i style="width:${progressoDe(t.id).dominio}%"></i></span>${progressoDe(t.id).dominio}%
            ${somaEstrelas(progressoDe(t.id).estrelas) ? ' · ⭐ ' + somaEstrelas(progressoDe(t.id).estrelas) : ''}
          </span>
        </button>`).join('')
        : '<div class="mensagem" style="grid-column:1/-1"><div class="grande">🙂</div><p>O seu professor ainda não liberou nenhum tema. Volte mais tarde!</p></div>';
    }
    $('temas').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-tema]');
      if (!b) return;
      abrirTema(estado.temas.find((t) => t.id === b.dataset.tema));
    });

    function abrirTema(t) {
      temaAtual = t;
      Fala.iniciar();
      $('tema-titulo').textContent = t.titulo;
      renderJogosTema();
      const dom = progressoDe(t.id).palavras;
      $('palavras').innerHTML = t.palavras.map((p, i) => `
        <div class="palavra" data-i="${i}" role="button" tabindex="0" aria-label="Ouvir ${esc(p.en)}">
          ${(dom[p.en] || 0) >= 100 ? '<span class="selo-dominada" title="Palavra dominada!">🏅</span>' : ''}
          <button class="devagar" data-devagar="${i}" aria-label="Ouvir devagar">🐢</button>
          ${figuraHtml(p, 'fig')}
          <div class="en">${esc(p.en)}</div>
          <div class="pt">${esc(p.pt)}</div>
          <div class="dom" title="${dom[p.en] || 0}%"><i style="width:${dom[p.en] || 0}%"></i></div>
        </div>`).join('');
      $('bloco-frases').hidden = !t.frases.length;
      $('frases').innerHTML = t.frases.map((f, i) => `
        <div class="frase">
          <button data-frase="${i}" aria-label="Ouvir a frase">🔊</button>
          <div class="txt"><div class="en">${esc(f.en)}</div><div class="pt">${esc(f.pt)}</div></div>
          <button data-frase-devagar="${i}" aria-label="Ouvir devagar">🐢</button>
        </div>`).join('');
      mostrar('tema');
    }

    async function falarPalavra(i, lento) {
      const card = $('palavras').querySelector(`[data-i="${i}"]`);
      card.classList.remove('falando');
      void card.offsetWidth;
      card.classList.add('falando');
      await Fala.iniciar();
      Fala.falar(temaAtual.palavras[i].en, lento);
    }
    $('palavras').addEventListener('click', (ev) => {
      const devagar = ev.target.closest('[data-devagar]');
      if (devagar) { falarPalavra(Number(devagar.dataset.devagar), true); return; }
      const card = ev.target.closest('[data-i]');
      if (card) falarPalavra(Number(card.dataset.i), false);
    });
    $('palavras').addEventListener('keydown', (ev) => {
      const card = ev.target.closest('[data-i]');
      if (card && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); falarPalavra(Number(card.dataset.i), false); }
    });
    $('frases').addEventListener('click', async (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      await Fala.iniciar();
      if (b.dataset.frase !== undefined) Fala.falar(temaAtual.frases[Number(b.dataset.frase)].en);
      if (b.dataset.fraseDevagar !== undefined) Fala.falar(temaAtual.frases[Number(b.dataset.fraseDevagar)].en, true);
    });
    $('mostrar-pt').addEventListener('change', () => {
      $('palavras').classList.toggle('sem-pt', !$('mostrar-pt').checked);
      $('frases').classList.toggle('sem-pt', !$('mostrar-pt').checked);
    });
    $('voltar-temas').addEventListener('click', () => { if (Fala.disponivel()) speechSynthesis.cancel(); renderTemas(); mostrar('inicio'); });

    // ---------- Jogos ----------
    function renderJogosTema() {
      const t = temaAtual, pode = Jogos.disponiveis(t), est = progressoDe(t.id).estrelas;
      $('jogos-tema').innerHTML = Object.keys(Jogos.DADOS).filter((j) => pode[j]).map((j) => {
        const d = Jogos.DADOS[j], n = Number(est[j] || 0);
        return `<button class="cartao-jogo" data-jogo="${j}">
          <span class="ic">${d.icone}</span>
          <span><div class="nm">${esc(d.nome)}</div><div class="ds">${esc(d.pt)}</div>
            <div class="st">${[1, 2, 3].map((k) => `<span class="${k <= n ? '' : 'apagada'}">⭐</span>`).join('')}</div></span>
        </button>`;
      }).join('');
    }
    $('jogos-tema').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-jogo]');
      if (b) abrirJogo(b.dataset.jogo);
    });

    // ---------- Speak! (em outra aba, fora do Apps Script, por causa do microfone) ----------
    // Nunca escreva duas barras seguidas no meio de uma linha de código: o Google corta a linha ali, como se fosse comentário.
    const ORIGEM_SPEAK = 'https:' + '/' + '/lindomarandradegertrudes.github.io';
    let speakPendente = null;

    function base64url(texto) {
      const bytes = new TextEncoder().encode(texto);
      let bin = '';
      bytes.forEach((b) => (bin += String.fromCharCode(b)));
      return btoa(bin).split('+').join('-').split('/').join('_').replace(/=+$/, '');
    }

    function abrirSpeak() {
      const t = temaAtual;
      const candidatas = t.palavras.filter((p) => p.en.replace(/[^a-z]/gi, '').length >= 2);
      const palavras = Jogos.escolher(candidatas, progressoDe(t.id).palavras, Math.min(8, candidatas.length));
      const id = 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      // Só vão as palavras do tema: nenhum dado da criança sai do app.
      const dados = { v: 1, r: estado.urlApp, t: t.id, tt: t.titulo, id, vel: estado.velocidadeVoz, p: palavras.map((p) => [p.en, p.pt, p.figura]) };
      const aba = window.open(estado.urlSpeak + '#' + base64url(JSON.stringify(dados)), '_blank');
      if (!aba) { alert('O navegador bloqueou a nova aba. Peça ajuda ao professor para permitir pop-ups.'); return; }
      speakPendente = { id, tema_id: t.id };
    }

    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (ev.origin !== ORIGEM_SPEAK || !d || d.tipo !== 'speak-resultado' || !speakPendente || d.id !== speakPendente.id) return;
      guardarNaFila({
        id: d.id, tema_id: speakPendente.tema_id, jogo: 'falar', palavras: d.palavras || {},
        acertos: d.acertos, total: d.total, estrelas: d.estrelas, segundos: d.segundos,
      });
      try { ev.source.postMessage({ tipo: 'speak-ok', id: d.id }, ev.origin); } catch (e) { /* a aba do jogo já fechou */ }
      speakPendente = null;
      enviarFila(() => { if (temaAtual && !$('tema').hidden) abrirTema(temaAtual); });
    });

    function abrirJogo(jogo) {
      if (jogo === 'falar') { abrirSpeak(); return; }
      mostrar('jogo');
      Jogos.iniciar(jogo, temaAtual, progressoDe(temaAtual.id).palavras, $('jogo'), (resultado, avisar) => {
        if (!resultado) { abrirTema(temaAtual); return; }
        guardarNaFila(resultado);
        enviarFila(avisar);
      });
    }

    // ---------- Equipe e placar ----------
    const numeroBr = (n) => Number(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    function renderEquipe() {
      const e = estado.equipe;
      if (!e || !e.minha) { $('equipe').innerHTML = ''; return; }
      const medalha = ['🥇', '🥈', '🥉'];
      $('equipe').innerHTML = `
        <div class="minha-equipe">
          <div class="cab-eq"><span class="emoji-eq">${esc(e.minha.emoji)}</span>
            <span class="nome-eq">My team: ${esc(e.minha.nome)}</span>
            <span class="minhas-estrelas" style="margin:0" title="Média de estrelas por membro neste mês">⭐ ${numeroBr(e.minha.pontos)}</span></div>
          <div class="colegas-eq">${e.minha.membros.map((m) => `<span class="${m.eu ? 'eu' : ''}"><b>${esc(m.avatar)}</b> ${esc(m.nome)}</span>`).join('')}</div>
          <p class="sub-kids" style="margin:0 0 10px">Você fez <strong>⭐ ${e.minhasEstrelas}</strong> neste mês. A equipe tem a média das estrelas de todos: cada jogo vale até 3 estrelas por tema!</p>
          <details ${e.placar.length <= 8 ? 'open' : ''}><summary style="cursor:pointer;font-weight:900">🏆 Placar da turma</summary>
            <div class="placar-mini" style="margin-top:8px">${e.placar.map((p) => `
              <div class="${p.minha ? 'minha' : ''}"><span>${medalha[p.posicao - 1] || p.posicao + 'º'}</span><span class="em">${esc(p.emoji)}</span>
                <span>${esc(p.nome)}</span><span>⭐ ${numeroBr(p.pontos)}</span></div>`).join('')}</div></details>
        </div>`;
    }

    // ---------- Avaliações (quiz e diagnóstico) ----------
    let quizAtual = null;

    function renderQuizzes() {
      const naFila = lerFila().filter((x) => x.tipo === 'quiz').map((x) => x.qid);
      const lista = (estado.avaliacoes || []).filter((q) => !naFila.includes(q.id));
      $('quizzes').innerHTML = lista.map((q) => `
        <div class="quiz-aviso">
          <span class="ic">📝</span>
          <span class="tx"><strong>${q.tipo === 'diagnostico' ? "Let's start! " : 'Quiz time! '}${esc(q.titulo)}</strong>
            <span class="sub-kids">${q.total} perguntas · responda com calma, sozinho(a)</span></span>
          <button class="botao-grande" data-quiz="${esc(q.id)}">Começar ▶</button>
        </div>`).join('');
    }
    $('quizzes').addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-quiz]');
      if (!b) return;
      b.disabled = true;
      try {
        const q = await chamar('alunoAbrirAvaliacao', b.dataset.quiz);
        quizAtual = { ...q, marcadas: q.questoes.map(() => null), i: 0 };
        await Fala.iniciar();
        renderPergunta();
        mostrar('quiz');
      } catch (e) {
        alert(e.message);
        estado.avaliacoes = estado.avaliacoes.filter((x) => x.id !== b.dataset.quiz);
        renderQuizzes();
      } finally { b.disabled = false; }
    });

    const CMD = { ouvir: 'Ouça e toque na figura certa.', ler: 'Leia a palavra e toque na figura certa.', figura: 'Olhe a figura e toque na palavra em inglês.' };

    function renderPergunta() {
      const z = quizAtual, q = z.questoes[z.i], ultima = z.i === z.questoes.length - 1;
      const centro = q.tipo === 'ouvir'
        ? '<div class="centro"><button class="botao-som" data-q-ouvir aria-label="Ouvir">🔊</button><button class="botao-som pequeno" data-q-devagar aria-label="Ouvir devagar">🐢</button></div>'
        : q.tipo === 'ler' ? `<span class="q-palavra">${esc(q.texto)}</span>`
        : `<div class="q-figura ${q.figuraTexto ? 'texto' : ''}">${esc(q.figura)}</div>`;
      $('quiz').innerHTML = `
        <div class="jogo-topo">
          <button class="botao-grande claro" data-q-sair aria-label="Sair">⬅</button>
          <h1>📝 ${esc(z.titulo)}</h1>
          <div class="pontinhos">${z.questoes.map((_, k) => `<i class="${z.marcadas[k] != null ? 'feito' : ''} ${k === z.i ? 'agora' : ''}"></i>`).join('')}</div>
        </div>
        <p class="jogo-instrucao">${z.i + 1} de ${z.questoes.length} · ${q.figuraTexto ? 'Leia em português e toque na palavra em inglês.' : CMD[q.tipo]}</p>
        <div class="q-centro">${centro}</div>
        <div class="q-opcoes">${q.alternativas.map((a, j) => `
          <button class="q-opcao ${a.texto ? 'texto' : ''} ${z.marcadas[z.i] === j ? 'marcada' : ''}" data-op="${j}">
            <span class="letra-op">${'ABCD'[j]}</span>${esc(a.rotulo)}</button>`).join('')}</div>
        <div class="q-rodape">
          <button class="botao-grande claro" data-q-voltar ${z.i === 0 ? 'style="visibility:hidden"' : ''}>⬅ Anterior</button>
          <button class="botao-grande" data-q-proxima ${z.marcadas[z.i] == null ? 'disabled' : ''}>${ultima ? 'Enviar ✅' : 'Próxima ➡'}</button>
        </div>`;
      if (q.tipo === 'ouvir') setTimeout(() => quizAtual === z && Fala.falar(q.audio), 300);
    }

    $('quiz').addEventListener('click', async (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-q-fim')) { renderQuizzes(); renderTemas(); mostrar('inicio'); return; }
      const z = quizAtual;
      if (!z) return;
      const q = z.questoes[z.i];
      if (b.dataset.op !== undefined) { z.marcadas[z.i] = Number(b.dataset.op); renderPergunta(); return; }
      if (b.hasAttribute('data-q-ouvir')) Fala.falar(q.audio);
      if (b.hasAttribute('data-q-devagar')) Fala.falar(q.audio, true);
      if (b.hasAttribute('data-q-voltar')) { z.i--; renderPergunta(); }
      if (b.hasAttribute('data-q-sair')) {
        if (!confirm('Sair agora? Suas respostas não serão enviadas e você vai precisar começar de novo.')) return;
        quizAtual = null;
        mostrar('inicio');
      }
      if (b.hasAttribute('data-q-proxima')) {
        if (z.marcadas[z.i] == null) return;
        if (z.i < z.questoes.length - 1) { z.i++; renderPergunta(); window.scrollTo(0, 0); return; }
        if (!confirm('Enviar as respostas? Depois de enviar não dá para mudar.')) return;
        b.disabled = true;
        guardarNaFila({ tipo: 'quiz', id: 'q-' + z.id, qid: z.id, marcadas: z.marcadas });
        quizAtual = null;
        estado.avaliacoes = estado.avaliacoes.filter((x) => x.id !== z.id);
        $('quiz').innerHTML = `<div class="resultado"><div style="font-size:4rem">✅</div><div class="frase-final">Great job!</div>
          <p style="font-weight:700">Obrigado! Suas respostas foram enviadas para o professor.</p>
          <div class="salvando" id="salvando-quiz">💾 Enviando…</div>
          <div class="botoes"><button class="botao-grande" data-q-fim>Voltar ao início</button></div></div>`;
        Som.vitoria();
        Fala.falar('Great job!');
        enviarFila((situacao) => {
          const s = $('salvando-quiz');
          if (s) s.textContent = situacao === 'ok' ? '✅ Enviado!' : '⏳ Sem conexão agora: vou enviar sozinho mais tarde.';
        });
      }
    });

    // Fila de partidas: fica guardada no navegador até o servidor confirmar.
    // Assim nada se perde se a internet cair ou se muitos alunos salvarem ao mesmo tempo.
    let memoriaFila = [];
    const chaveFila = () => 'ek-fila:' + estado.email;
    function lerFila() { try { return JSON.parse(localStorage.getItem(chaveFila())) || []; } catch (e) { return memoriaFila; } }
    function gravarFila(f) { memoriaFila = f; try { localStorage.setItem(chaveFila(), JSON.stringify(f)); } catch (e) { /* só memória */ } }
    function guardarNaFila(r) { const f = lerFila(); f.push(r); gravarFila(f); }

    let enviando = false, tentativa = null;
    async function enviarFila(avisar) {
      if (enviando) { setTimeout(() => enviarFila(avisar), 1500); return; }
      const fila = lerFila();
      if (!fila.length) { if (avisar) avisar('ok'); return; }
      enviando = true;
      clearTimeout(tentativa);
      let falhou = false;
      for (const item of fila) {
        try {
          if (item.tipo === 'quiz') {
            await chamar('alunoResponderAvaliacao', item.qid, item.marcadas);
          } else {
            const r = await chamar('alunoSalvarJogada', item);
            estado.progresso = r.progresso;
          }
          gravarFila(lerFila().filter((x) => x.id !== item.id));
        } catch (e) {
          // Partida que nunca vai ser aceita (tema ocultado, por exemplo): descarta para não travar a fila.
          if (/não está disponível|desconhecido|sem identificação|encerrada|Responda todas/i.test(e.message || '')) {
            gravarFila(lerFila().filter((x) => x.id !== item.id));
            continue;
          }
          falhou = true;
          break;
        }
      }
      enviando = false;
      renderEstrelas();
      if (avisar) avisar(falhou ? 'pendente' : 'ok');
      // Tenta de novo em até ~1 minuto, com um sorteio para os alunos não tentarem todos juntos.
      if (falhou) tentativa = setTimeout(() => enviarFila(), 20000 + Math.random() * 40000);
    }

    chamar('alunoObterEstado').then(render).catch((e) => mostrarErro(e.message));
  </script>
````

### Arquivo: `JogosTela.html`

Os 9 jogos do app. (992 linhas)

````html
<style>
  /* ---------- Jogos ---------- */
  .jogo-topo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .jogo-topo h1 { margin: 0; flex: 1; font-size: 1.6rem; }
  .pontinhos { display: flex; gap: 6px; flex-wrap: wrap; }
  .pontinhos i { width: 14px; height: 14px; border-radius: 50%; background: #dee2e6; display: block; }
  .pontinhos i.feito { background: #51cf66; }
  .pontinhos i.meio { background: #fcc419; }
  .pontinhos i.agora { outline: 3px solid #e8590c; outline-offset: 2px; }
  .jogo-instrucao { font-weight: 800; color: #6c7086; margin: 0 0 14px; font-size: 1.05rem; }
  .botao-som { border: 0; background: #e8590c; color: #fff; border-radius: 50%; width: 76px; height: 76px; font-size: 2.1rem; cursor: pointer; box-shadow: 0 5px 0 #a33a05; }
  .botao-som:active { transform: translateY(3px); box-shadow: 0 2px 0 #a33a05; }
  .botao-som.pequeno { width: 54px; height: 54px; font-size: 1.4rem; background: #fff; color: var(--tinta); box-shadow: 0 4px 0 #dee2e6; border: 2px solid #dee2e6; }
  .centro { display: flex; justify-content: center; align-items: center; gap: 14px; margin: 6px 0 18px; }

  .opcoes { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 560px; margin: 0 auto; }
  .opcao-fig {
    background: #fff; border: 4px solid #ffe8cc; border-radius: 22px; min-height: 130px; cursor: pointer;
    font-size: 4rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 0 #ffe8cc; padding: 8px;
  }
  .opcao-fig.texto { font-size: 1.5rem; font-weight: 900; color: #5f3dc4; }
  .opcao-fig:hover { border-color: #ffc078; }
  .opcao-fig.certa { border-color: #2f9e44; background: #ebfbee; animation: pulo .5s; }
  .opcao-fig.errada { border-color: #e03131; background: #fff5f5; opacity: .45; animation: treme .4s; cursor: default; }
  @keyframes treme { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }

  .memoria { display: grid; gap: 10px; grid-template-columns: repeat(4, minmax(0, 1fr)); max-width: 640px; margin: 0 auto; }
  .carta { perspective: 600px; height: 116px; cursor: pointer; border: 0; background: none; padding: 0; }
  .carta .dentro { position: relative; width: 100%; height: 100%; transition: transform .35s; transform-style: preserve-3d; }
  .carta.virada .dentro, .carta.achada .dentro { transform: rotateY(180deg); }
  .carta .face { position: absolute; inset: 0; border-radius: 16px; display: flex; align-items: center; justify-content: center; backface-visibility: hidden; padding: 6px; text-align: center; }
  .carta .costas { background: linear-gradient(135deg, #ff922b, #e8590c); color: #fff; font-size: 2.2rem; box-shadow: 0 4px 0 #a33a05; }
  .carta .frente { background: #fff; border: 3px solid #ffe8cc; transform: rotateY(180deg); font-size: 2.8rem; }
  .carta .frente.palavra-txt { font-size: 1.2rem; font-weight: 900; word-break: break-word; }
  .carta .frente.pt-txt { font-size: 1rem; font-weight: 900; color: #5f3dc4; }
  .carta.achada .frente { border-color: #2f9e44; background: #ebfbee; }

  .alvos { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 22px; }
  .alvo {
    background: #fff; border: 4px dashed #ffc078; border-radius: 20px; min-height: 150px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 6px; padding: 8px; cursor: pointer;
  }
  .alvo .fig { font-size: 3.6rem; }
  .alvo .fig.texto { font-size: 1.2rem; font-weight: 900; color: #5f3dc4; text-align: center; }
  .alvo.sobre { background: #fff0e6; border-color: #e8590c; }
  .alvo.feito { border-style: solid; border-color: #2f9e44; background: #ebfbee; cursor: default; }
  .alvo.errado { animation: treme .4s; border-color: #e03131; }
  .alvo .colocada { font-weight: 900; font-size: 1.2rem; color: #2b8a3e; }
  .fichas { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; min-height: 64px; }
  .ficha {
    border: 3px solid #4dabf7; background: #e7f5ff; color: #1864ab; border-radius: 14px; padding: 12px 18px; font-size: 1.25rem;
    font-weight: 900; cursor: grab; touch-action: none; user-select: none; box-shadow: 0 4px 0 #a5d8ff;
  }
  .ficha.escolhida { background: #1c7ed6; color: #fff; border-color: #1864ab; }
  .ficha.voando { position: fixed; z-index: 50; pointer-events: none; transform: rotate(-4deg) scale(1.08); box-shadow: 0 10px 25px rgba(0,0,0,.25); }
  .ficha.fantasma { opacity: .3; }

  .montar-fig { font-size: 5rem; text-align: center; line-height: 1.1; }
  .montar-fig.texto { font-size: 1.6rem; font-weight: 900; color: #5f3dc4; }
  .casas { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 16px 0 22px; }
  .casa { width: 52px; height: 62px; border-bottom: 5px solid #adb5bd; font-size: 2.1rem; font-weight: 900; display: flex; align-items: center; justify-content: center; text-transform: uppercase; }
  .casa.cheia { border-color: #2f9e44; color: #2b8a3e; animation: pulo .35s; }
  .casa.fixa { border-color: transparent; color: #6c7086; width: 22px; }
  .casa.espaco { border-color: transparent; width: 26px; }
  .casa.proxima { border-color: #e8590c; }
  .letras { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 640px; margin: 0 auto; }
  .letra {
    width: 62px; height: 62px; border-radius: 16px; border: 3px solid #b197fc; background: #f3f0ff; color: #5f3dc4; font-size: 2rem;
    font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #d0bfff;
  }
  .letra.errada { animation: treme .4s; background: #fff5f5; border-color: #e03131; color: #c92a2a; }
  .letra.dica { animation: brilho 1s infinite; }
  @keyframes brilho { 50% { background: #fff3bf; border-color: #fab005; } }
  .letra:disabled { visibility: hidden; }

  .resultado { text-align: center; background: #fff; border-radius: 26px; padding: 30px 20px; box-shadow: 0 5px 0 #ffe8cc; max-width: 560px; margin: 10px auto; }
  .estrelas-grandes { font-size: 4.2rem; letter-spacing: 6px; }
  .estrelas-grandes span { display: inline-block; opacity: .2; filter: grayscale(1); }
  .estrelas-grandes span.ganha { opacity: 1; filter: none; animation: estrela .6s both; }
  .estrelas-grandes span.ganha:nth-child(2) { animation-delay: .25s; }
  .estrelas-grandes span.ganha:nth-child(3) { animation-delay: .5s; }
  @keyframes estrela { 0% { transform: scale(0) rotate(-90deg); } 70% { transform: scale(1.3) rotate(10deg); } 100% { transform: scale(1); } }
  .resultado .frase-final { font-size: 2rem; font-weight: 900; margin: 6px 0; }
  .resultado .botoes { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 18px; }
  .salvando { font-weight: 700; color: #6c7086; font-size: .95rem; margin-top: 10px; }

  .festa { position: fixed; inset: 0; pointer-events: none; z-index: 60; overflow: hidden; }
  .festa span { position: absolute; top: -40px; font-size: 2rem; animation: cair 1.6s ease-in forwards; }
  @keyframes cair { to { transform: translateY(110vh) rotate(540deg); } }


  /* ---------- Etapa 5 ---------- */
  .caca-lista { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 14px; }
  .caca-lista > span { background: #fff; border: 3px solid #ffe8cc; border-radius: 14px; padding: 4px 12px; font-weight: 900; font-size: 1.1rem; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
  .caca-lista > span .fg { font-size: 1.6rem; }
  .caca-lista > span.achada { border-color: #2f9e44; background: #ebfbee; text-decoration: line-through; color: #2b8a3e; }
  .caca { display: grid; gap: 4px; margin: 0 auto; max-width: 560px; touch-action: none; user-select: none; }
  .caca button { aspect-ratio: 1; border: 2px solid #e9ecef; background: #fff; border-radius: 10px; font-size: 1.4rem; font-weight: 900; color: var(--tinta); cursor: pointer; padding: 0; }
  .caca button.inicio { background: #fff3bf; border-color: #fab005; }
  .caca button.achada { background: #b2f2bb; border-color: #2f9e44; color: #1b5e20; }
  .caca button.errada { background: #ffe3e3; border-color: #e03131; }

  .paleta { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 4px 0 18px; }
  .tinta { width: 58px; height: 58px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 0 3px #dee2e6; cursor: pointer; }
  .tinta.escolhida { box-shadow: 0 0 0 5px #1c7ed6; transform: scale(1.12); }
  .quadros { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 560px; margin: 0 auto; }
  .quadro { min-height: 130px; border-radius: 22px; border: 4px dashed #ced4da; background: #fff; font-size: 3.6rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .3s; }
  .quadro.texto { font-size: 1.4rem; font-weight: 900; color: #5f3dc4; }
  .quadro.pintado { border-style: solid; border-color: #2f9e44; cursor: default; }
  .quadro.errado { animation: treme .4s; border-color: #e03131; }
  .comando { text-align: center; font-size: 1.5rem; font-weight: 900; margin: 0 0 10px; min-height: 2rem; }

  .frase-pt { text-align: center; font-weight: 800; color: #6c7086; font-size: 1.15rem; }
  .frase-montada { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; min-height: 64px; margin: 14px auto 20px; padding: 10px; border-bottom: 4px solid #adb5bd; max-width: 640px; }
  .frase-montada span { background: #d3f9d8; color: #2b8a3e; border-radius: 12px; padding: 8px 14px; font-size: 1.3rem; font-weight: 900; animation: pulo .35s; }
  .blocos { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 640px; margin: 0 auto; }
  .bloco { border: 3px solid #4dabf7; background: #e7f5ff; color: #1864ab; border-radius: 14px; padding: 10px 16px; font-size: 1.25rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #a5d8ff; }
  .bloco.errada { animation: treme .4s; background: #fff5f5; border-color: #e03131; color: #c92a2a; }
  .bloco.dica { animation: brilho 1s infinite; }
  .bloco:disabled { visibility: hidden; }

  .teclado { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 6px; max-width: 620px; margin: 0 auto; }
  .tecla { aspect-ratio: 1; border-radius: 12px; border: 3px solid #ffd43b; background: #fff9db; color: #a05a00; font-size: 1.5rem; font-weight: 900; cursor: pointer; box-shadow: 0 3px 0 #ffe066; padding: 0; }
  .tecla.errada { animation: treme .4s; background: #fff5f5; border-color: #e03131; color: #c92a2a; }
  .tecla.dica { animation: brilho 1s infinite; }
  .abelha-dica { text-align: center; min-height: 4.6rem; font-size: 4rem; }

  .repetir-cartao { text-align: center; background: #fff; border-radius: 26px; padding: 22px; max-width: 560px; margin: 0 auto; box-shadow: 0 5px 0 #ffe8cc; }
  .repetir-cartao .fg { font-size: 5rem; line-height: 1.1; }
  .repetir-cartao .fg.texto { font-size: 1.8rem; font-weight: 900; color: #5f3dc4; }
  .repetir-cartao .en { font-size: 2.1rem; font-weight: 900; margin: 8px 0; }
  .repetir-cartao .vez { font-weight: 900; color: #e8590c; font-size: 1.2rem; margin: 10px 0 14px; }
  @media (max-width: 520px) { .teclado { grid-template-columns: repeat(7, minmax(0, 1fr)); } .caca button { font-size: 1.05rem; } }
  @media (max-width: 520px) {
    .memoria { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .casa { width: 40px; height: 52px; font-size: 1.7rem; }
    .letra { width: 52px; height: 52px; font-size: 1.6rem; }
  }
</style>

<script>
  /** Sons curtos gerados pelo navegador (sem arquivos de áudio). */
  const Som = {
    ctx: null,
    tocar(notas) {
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        let t = this.ctx.currentTime;
        notas.forEach(([freq, dur, tipo]) => {
          const o = this.ctx.createOscillator(), g = this.ctx.createGain();
          o.type = tipo || 'sine';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          o.connect(g).connect(this.ctx.destination);
          o.start(t);
          o.stop(t + dur);
          t += dur * 0.8;
        });
      } catch (e) { /* sem áudio: o jogo continua */ }
    },
    acerto() { this.tocar([[660, 0.12], [990, 0.2]]); },
    erro() { this.tocar([[200, 0.25, 'triangle']]); },
    vitoria() { this.tocar([[523, 0.14], [659, 0.14], [784, 0.14], [1047, 0.35]]); },
  };

  const Jogos = (function () {
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
    const embaralhar = (lista) => {
      const a = lista.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    };

    const DADOS = {
      ouvir: { icone: '👂', nome: 'Listen & Click', pt: 'Ouça e toque na figura' },
      memoria: { icone: '🃏', nome: 'Memory', pt: 'Jogo da memória' },
      arrastar: { icone: '🧩', nome: 'Match it!', pt: 'Ligue a palavra à figura' },
      montar: { icone: '🔤', nome: 'Spell it!', pt: 'Monte a palavra' },
      cacar: { icone: '🔍', nome: 'Find it!', pt: 'Caça-palavras' },
      colorir: { icone: '🎨', nome: 'Color it!', pt: 'Pinte do jeito que a voz pedir' },
      frases: { icone: '🧱', nome: 'Build it!', pt: 'Monte a frase' },
      abelha: { icone: '🐝', nome: 'Spelling Bee', pt: 'Ouça e soletre' },
      repetir: { icone: '🗣️', nome: 'Repeat after me', pt: 'Ouça e repita' },
      falar: { icone: '🎤', nome: 'Speak!', pt: 'Fale e o Chrome confere (abre outra aba)' },
    };

    /** Palavras que dá para soletrar: só letras (espaço, hífen e apóstrofo ficam fixos), até 12 letras. */
    function soletravel(p) {
      const letras = p.en.replace(/[\s'’-]/g, '');
      return /^[a-z]+$/i.test(letras) && letras.length >= 2 && letras.length <= 12;
    }

    /** Quais jogos o tema permite. */
    function disponiveis(tema) {
      const n = tema.palavras.length;
      return {
        ouvir: n >= 4,
        memoria: n >= 3,
        arrastar: n >= 3,
        montar: tema.palavras.filter(soletravel).length >= 3,
        cacar: tema.palavras.filter((p) => cacavel(p, 10)).length >= 4,
        colorir: tema.palavras.filter((p) => p.figura).length >= 4 && !ehTemaDeCores(tema),
        frases: frasesBoas(tema).length >= 3,
        abelha: tema.palavras.filter(soletravel).length >= 3,
        repetir: n >= 3,
        // Letras soltas (alfabeto) o reconhecimento de voz não entende bem.
        falar: tema.palavras.filter((p) => p.en.replace(/[^a-z]/gi, '').length >= 2).length >= 3,
      };
    }

    /** Sorteia n palavras dando mais chance às que a criança domina menos. */
    function escolher(palavras, dominio, n) {
      const pool = palavras.map((p) => ({ p, peso: 1 + (100 - Math.min(100, dominio[p.en] || 0)) / 25 }));
      const escolhidas = [];
      while (escolhidas.length < n && pool.length) {
        const total = pool.reduce((s, x) => s + x.peso, 0);
        let r = Math.random() * total, i = 0;
        while (r > pool[i].peso && i < pool.length - 1) { r -= pool[i].peso; i++; }
        escolhidas.push(pool.splice(i, 1)[0].p);
      }
      return escolhidas;
    }

    function figura(p, classe) {
      return p.figura
        ? `<div class="${classe}">${esc(p.figura)}</div>`
        : `<div class="${classe} texto">${esc(p.pt)}</div>`;
    }

    function festa(emojis) {
      const div = document.createElement('div');
      div.className = 'festa';
      for (let i = 0; i < 26; i++) {
        const s = document.createElement('span');
        s.textContent = emojis[i % emojis.length];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDelay = Math.random() * 0.6 + 's';
        div.appendChild(s);
      }
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 2600);
    }

    function estrelasPorPercentual(pct) { return pct >= 90 ? 3 : pct >= 70 ? 2 : 1; }

    // ------------------------------------------------------------
    // Partida: estado comum a todos os jogos
    // ------------------------------------------------------------
    let partida = null;

    function novaPartida(jogo, tema, dominio, el, aoTerminar) {
      partida = {
        id: 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        jogo, tema, dominio, el, aoTerminar, inicio: Date.now(), palavras: {}, ativa: true,
      };
      return partida;
    }

    function registro(en) {
      partida.palavras[en] = partida.palavras[en] || { a: 0, e: 0, c: 0 };
      return partida.palavras[en];
    }

    function cabecalho(titulo, instrucao, total) {
      return `<div class="jogo-topo">
          <button class="botao-grande claro" data-sair aria-label="Sair do jogo">⬅</button>
          <h1>${esc(DADOS[partida.jogo].icone)} ${esc(titulo)}</h1>
          <div class="pontinhos" id="pontinhos">${Array.from({ length: total }, () => '<i></i>').join('')}</div>
        </div>
        <p class="jogo-instrucao">${esc(instrucao)}</p>`;
    }

    /** Pinta o ponto i (verde = de primeira, amarelo = com erro) e destaca o próximo. */
    function marcarPonto(i, classe) {
      const p = partida.el.querySelectorAll('#pontinhos i');
      if (p[i]) p[i].className = classe;
      p.forEach((x, k) => x.classList.toggle('agora', k === i + 1));
    }

    function ligarSair() {
      partida.el.querySelector('[data-sair]').addEventListener('click', () => {
        if (!confirm('Sair do jogo? Esta partida não será salva.')) return;
        partida.ativa = false;
        if (Fala.disponivel()) speechSynthesis.cancel();
        partida.aoTerminar(null);
      });
    }

    /** Fim da partida: mostra as estrelas e entrega o resultado para ser salvo. */
    function terminar(acertos, total, estrelas) {
      if (!partida.ativa) return;
      partida.ativa = false;
      const resultado = {
        id: partida.id, tema_id: partida.tema.id, jogo: partida.jogo, palavras: partida.palavras,
        acertos, total, estrelas, segundos: Math.round((Date.now() - partida.inicio) / 1000),
      };
      const frase = partida.jogo === 'repetir' ? 'Great practice!' : estrelas === 3 ? 'Excellent!' : estrelas === 2 ? 'Great job!' : 'Good try!';
      partida.el.innerHTML = `
        <div class="resultado">
          <div class="estrelas-grandes">${[1, 2, 3].map((n) => `<span class="${n <= estrelas ? 'ganha' : ''}">⭐</span>`).join('')}</div>
          <div class="frase-final">${frase}</div>
          <p style="font-weight:700">${partida.jogo === 'repetir' ? 'Você repetiu ' + total + ' palavras e frases. 🗣️'
            : acertos + ' de ' + total + ' ' + ({ memoria: 'pares encontrados', cacar: 'palavras encontradas', frases: 'frases certas de primeira' }[partida.jogo] || 'certas de primeira')}</p>
          <div class="salvando" id="salvando">💾 Salvando…</div>
          <div class="botoes">
            <button class="botao-grande" data-de-novo>🔁 Jogar de novo</button>
            <button class="botao-grande claro" data-outro>🎮 Outro jogo</button>
          </div>
        </div>`;
      Som.vitoria();
      if (estrelas >= 2) festa(estrelas === 3 ? ['⭐', '🎉', '✨', '🌟'] : ['⭐', '✨']);
      Fala.falar(frase);
      const { jogo, tema, dominio, el, aoTerminar } = partida;
      el.querySelector('[data-de-novo]').addEventListener('click', () => iniciar(jogo, tema, dominio, el, aoTerminar));
      el.querySelector('[data-outro]').addEventListener('click', () => aoTerminar(null));
      aoTerminar(resultado, (situacao) => {
        const s = el.querySelector('#salvando');
        if (s) s.textContent = situacao === 'ok' ? '✅ Salvo!' : '⏳ Sem conexão agora: vou salvar sozinho mais tarde.';
      });
    }

    // ------------------------------------------------------------
    // 1. Listen & Click: ouve a palavra e toca na figura certa
    // ------------------------------------------------------------
    async function jogoOuvir() {
      const { tema, el } = partida;
      const rodadas = escolher(tema.palavras, partida.dominio, Math.min(8, tema.palavras.length));
      el.innerHTML = cabecalho('Listen & Click', 'Ouça a palavra e toque na figura certa.', rodadas.length) + `
        <div class="centro"><button class="botao-som" id="ouvir-de-novo" aria-label="Ouvir de novo">🔊</button>
          <button class="botao-som pequeno" id="ouvir-devagar" aria-label="Ouvir devagar">🐢</button></div>
        <div class="opcoes" id="opcoes"></div>`;
      ligarSair();
      let atual = null;
      el.querySelector('#ouvir-de-novo').addEventListener('click', () => atual && Fala.falar(atual.en));
      el.querySelector('#ouvir-devagar').addEventListener('click', () => atual && Fala.falar(atual.en, true));
      let acertos = 0;

      for (let i = 0; i < rodadas.length; i++) {
        if (!partida.ativa) return;
        atual = rodadas[i];
        el.querySelectorAll('#pontinhos i').forEach((x, k) => x.classList.toggle('agora', k === i));
        const outras = embaralhar(tema.palavras.filter((p) => p !== atual)).slice(0, 3);
        const opcoes = embaralhar([atual, ...outras]);
        const r = registro(atual.en);
        await new Promise((proxima) => {
          const caixa = el.querySelector('#opcoes');
          caixa.innerHTML = opcoes.map((p, k) =>
            `<button class="opcao-fig ${p.figura ? '' : 'texto'}" data-k="${k}">${esc(p.figura || p.pt)}</button>`).join('');
          let errosRodada = 0;
          caixa.onclick = async (ev) => {
            const b = ev.target.closest('[data-k]');
            if (!b || b.classList.contains('errada') || caixa.dataset.travado) return;
            if (opcoes[Number(b.dataset.k)] === atual) {
              caixa.dataset.travado = '1';
              b.classList.add('certa');
              Som.acerto();
              if (!errosRodada) { r.a = 1; acertos++; }
              r.c = 1;
              marcarPonto(i, errosRodada ? 'meio' : 'feito');
              await Fala.falar(atual.en);
              await espera(400);
              delete caixa.dataset.travado;
              proxima();
            } else {
              errosRodada++;
              r.e = Math.min(5, r.e + 1);
              b.classList.add('errada');
              Som.erro();
              await espera(350);
              Fala.falar(atual.en);
            }
          };
          espera(350).then(() => partida.ativa && Fala.falar(atual.en));
        });
      }
      terminar(acertos, rodadas.length, estrelasPorPercentual((acertos / rodadas.length) * 100));
    }

    // ------------------------------------------------------------
    // 2. Memory: pares de figura e palavra em inglês
    // ------------------------------------------------------------
    function jogoMemoria() {
      const { tema, el } = partida;
      const pares = escolher(tema.palavras, partida.dominio, Math.min(6, tema.palavras.length));
      const cartas = embaralhar(pares.flatMap((p, i) => [{ par: i, tipo: 'fig' }, { par: i, tipo: 'en' }]));
      el.innerHTML = cabecalho('Memory', 'Vire duas cartas e encontre a figura e a palavra que combinam.', pares.length) + `
        <div class="memoria" id="memoria">${cartas.map((c, k) => {
          const p = pares[c.par];
          const frente = c.tipo === 'en'
            ? `<div class="face frente palavra-txt">${esc(p.en)}</div>`
            : p.figura ? `<div class="face frente">${esc(p.figura)}</div>` : `<div class="face frente pt-txt">${esc(p.pt)}</div>`;
          return `<button class="carta" data-k="${k}" aria-label="Carta ${k + 1}"><div class="dentro"><div class="face costas">❓</div>${frente}</div></button>`;
        }).join('')}</div>`;
      ligarSair();

      let abertas = [], jogadas = 0, achados = 0, travado = false;
      el.querySelector('#memoria').addEventListener('click', async (ev) => {
        const b = ev.target.closest('[data-k]');
        if (!b || travado || b.classList.contains('virada') || b.classList.contains('achada')) return;
        const carta = cartas[Number(b.dataset.k)];
        b.classList.add('virada');
        if (carta.tipo === 'en') Fala.falar(pares[carta.par].en);
        abertas.push({ b, carta });
        if (abertas.length < 2) return;
        jogadas++;
        const [x, y] = abertas;
        abertas = [];
        if (x.carta.par === y.carta.par) {
          x.b.classList.add('achada');
          y.b.classList.add('achada');
          Som.acerto();
          const p = pares[x.carta.par];
          const r = registro(p.en);
          r.a = 1; r.c = 1;
          marcarPonto(achados, 'feito');
          achados++;
          await espera(300);
          await Fala.falar(p.en);
          if (achados === pares.length) {
            await espera(400);
            const n = pares.length;
            terminar(n, n, jogadas <= n + 3 ? 3 : jogadas <= n * 2 + 1 ? 2 : 1);
          }
        } else {
          travado = true;
          await espera(1100);
          x.b.classList.remove('virada');
          y.b.classList.remove('virada');
          travado = false;
        }
      });
    }

    // ------------------------------------------------------------
    // 3. Match it!: arrastar (ou tocar) a palavra até a figura
    // ------------------------------------------------------------
    async function jogoArrastar() {
      const { tema, el } = partida;
      const escolhidas = escolher(tema.palavras, partida.dominio, Math.min(8, tema.palavras.length));
      const grupos = escolhidas.length > 5 ? [escolhidas.slice(0, Math.ceil(escolhidas.length / 2)), escolhidas.slice(Math.ceil(escolhidas.length / 2))] : [escolhidas];
      el.innerHTML = cabecalho('Match it!', 'Toque numa palavra para ouvir. Depois arraste (ou toque) até a figura certa.', escolhidas.length) + `
        <div class="alvos" id="alvos"></div><div class="fichas" id="fichas"></div>`;
      ligarSair();
      let acertos = 0, feitos = 0;

      for (const grupo of grupos) {
        if (!partida.ativa) return;
        await new Promise((proximo) => {
          const alvos = el.querySelector('#alvos'), fichas = el.querySelector('#fichas');
          const ordemAlvos = embaralhar(grupo), ordemFichas = embaralhar(grupo);
          alvos.innerHTML = ordemAlvos.map((p) => `<div class="alvo" data-en="${esc(p.en)}">${figura(p, 'fig')}<div class="colocada"></div></div>`).join('');
          fichas.innerHTML = ordemFichas.map((p) => `<div class="ficha" data-en="${esc(p.en)}" role="button" tabindex="0">${esc(p.en)}</div>`).join('');
          let escolhida = null, restantes = grupo.length;

          function selecionar(f) {
            fichas.querySelectorAll('.ficha').forEach((x) => x.classList.toggle('escolhida', x === f));
            escolhida = f;
            if (f) Fala.falar(f.dataset.en);
          }

          async function soltar(f, alvo) {
            if (!alvo || alvo.classList.contains('feito')) return;
            const en = f.dataset.en, r = registro(en);
            if (alvo.dataset.en === en) {
              alvo.classList.add('feito');
              alvo.querySelector('.colocada').textContent = en;
              f.remove();
              escolhida = null;
              Som.acerto();
              if (!r.e) { r.a = 1; acertos++; }
              r.c = 1;
              marcarPonto(feitos, r.e ? 'meio' : 'feito');
              feitos++;
              restantes--;
              await Fala.falar(en);
              if (!restantes) { await espera(400); proximo(); }
            } else {
              r.e = Math.min(5, r.e + 1);
              alvo.classList.remove('errado');
              void alvo.offsetWidth;
              alvo.classList.add('errado');
              Som.erro();
            }
          }

          // Arrastar com o dedo ou o mouse; um toque sem arrastar só escolhe a ficha.
          fichas.onpointerdown = (ev) => {
            const f = ev.target.closest('.ficha');
            if (!f) return;
            ev.preventDefault();
            const x0 = ev.clientX, y0 = ev.clientY;
            let voando = null, sobre = null;
            const mover = (e) => {
              if (!voando && Math.hypot(e.clientX - x0, e.clientY - y0) < 8) return;
              if (!voando) {
                voando = f.cloneNode(true);
                voando.classList.add('voando');
                document.body.appendChild(voando);
                f.classList.add('fantasma');
              }
              voando.style.left = e.clientX - voando.offsetWidth / 2 + 'px';
              voando.style.top = e.clientY - voando.offsetHeight / 2 + 'px';
              const alvo = document.elementFromPoint(e.clientX, e.clientY)?.closest('.alvo:not(.feito)');
              if (sobre !== alvo) { sobre?.classList.remove('sobre'); alvo?.classList.add('sobre'); sobre = alvo; }
            };
            const largar = (e) => {
              document.removeEventListener('pointermove', mover);
              document.removeEventListener('pointerup', largar);
              document.removeEventListener('pointercancel', largar);
              sobre?.classList.remove('sobre');
              if (voando) {
                voando.remove();
                f.classList.remove('fantasma');
                if (e.type === 'pointerup' && sobre) soltar(f, sobre);
              } else {
                selecionar(f);
              }
            };
            document.addEventListener('pointermove', mover);
            document.addEventListener('pointerup', largar);
            document.addEventListener('pointercancel', largar);
          };
          fichas.onkeydown = (ev) => {
            const f = ev.target.closest('.ficha');
            if (f && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); selecionar(f); }
          };
          alvos.onclick = (ev) => {
            const alvo = ev.target.closest('.alvo');
            if (!alvo) return;
            if (escolhida) soltar(escolhida, alvo);
            else if (!alvo.classList.contains('feito')) Fala.falar('Choose a word first!');
          };
        });
      }
      terminar(acertos, escolhidas.length, estrelasPorPercentual((acertos / escolhidas.length) * 100));
    }

    // ------------------------------------------------------------
    // 4. Spell it!: montar a palavra com as letras
    // ------------------------------------------------------------
    async function jogoMontar() {
      const { tema, el } = partida;
      const rodadas = escolher(tema.palavras.filter(soletravel), partida.dominio, Math.min(6, tema.palavras.filter(soletravel).length));
      el.innerHTML = cabecalho('Spell it!', 'Ouça e toque nas letras na ordem certa para escrever a palavra.', rodadas.length) + `
        <div id="montar"></div>`;
      ligarSair();
      let acertos = 0;

      for (let i = 0; i < rodadas.length; i++) {
        if (!partida.ativa) return;
        const p = rodadas[i];
        el.querySelectorAll('#pontinhos i').forEach((x, k) => x.classList.toggle('agora', k === i));
        const r = registro(p.en);
        const chars = [...p.en];
        const letras = embaralhar(chars.map((c, k) => ({ c, k })).filter((x) => /[a-z]/i.test(x.c)));
        await new Promise((proxima) => {
          const caixa = el.querySelector('#montar');
          caixa.innerHTML = `
            ${figura(p, 'montar-fig')}
            <div class="centro" style="margin-top:10px"><button class="botao-som pequeno" data-ouvir aria-label="Ouvir">🔊</button>
              <button class="botao-som pequeno" data-devagar aria-label="Ouvir devagar">🐢</button></div>
            <div class="casas">${chars.map((c, k) => /[a-z]/i.test(c)
              ? `<div class="casa" data-k="${k}"></div>`
              : c === ' ' ? '<div class="casa espaco"></div>' : `<div class="casa fixa">${esc(c)}</div>`).join('')}</div>
            <div class="letras">${letras.map((x, j) => `<button class="letra" data-j="${j}">${esc(x.c.toUpperCase())}</button>`).join('')}</div>`;
          const casas = [...caixa.querySelectorAll('.casa[data-k]')];
          let pos = 0, erros = 0;
          const marcarProxima = () => casas.forEach((c, k) => c.classList.toggle('proxima', k === pos));
          marcarProxima();
          caixa.querySelector('[data-ouvir]').onclick = () => Fala.falar(p.en);
          caixa.querySelector('[data-devagar]').onclick = () => Fala.falar(p.en, true);
          caixa.querySelector('.letras').onclick = async (ev) => {
            const b = ev.target.closest('.letra');
            if (!b || b.disabled) return;
            const certa = chars[Number(casas[pos].dataset.k)];
            if (letras[Number(b.dataset.j)].c.toLowerCase() === certa.toLowerCase()) {
              casas[pos].textContent = certa;
              casas[pos].classList.add('cheia');
              b.disabled = true;
              caixa.querySelectorAll('.letra.dica').forEach((x) => x.classList.remove('dica'));
              pos++;
              marcarProxima();
              if (pos === casas.length) {
                Som.acerto();
                if (!erros) { r.a = 1; acertos++; }
                r.c = 1;
                marcarPonto(i, erros ? 'meio' : 'feito');
                await Fala.falar(p.en);
                await espera(500);
                proxima();
              }
            } else {
              erros++;
              r.e = Math.min(5, r.e + 1);
              b.classList.remove('errada');
              void b.offsetWidth;
              b.classList.add('errada');
              Som.erro();
              // Depois de 3 erros, a letra certa pisca para ajudar.
              if (erros >= 3) {
                const dica = [...caixa.querySelectorAll('.letra:not(:disabled)')]
                  .find((x) => letras[Number(x.dataset.j)].c.toLowerCase() === certa.toLowerCase());
                if (dica) dica.classList.add('dica');
              }
            }
          };
          espera(300).then(() => partida.ativa && Fala.falar(p.en));
        });
      }
      terminar(acertos, rodadas.length, estrelasPorPercentual((acertos / rodadas.length) * 100));
    }


    // ------------------------------------------------------------
    // 5. Find it!: caça-palavras (horizontal e vertical)
    // ------------------------------------------------------------
    const letrasDe = (en) => en.replace(/[\s'’-]/g, '').toUpperCase();
    function cacavel(p, max) { const l = letrasDe(p.en); return /^[A-Z]+$/.test(l) && l.length >= 3 && l.length <= max; }

    function montarGrade(palavras, n) {
      for (let tentativa = 0; tentativa < 60; tentativa++) {
        const g = Array.from({ length: n }, () => Array(n).fill(''));
        const colocadas = [];
        for (const p of palavras) {
          const w = letrasDe(p.en);
          let ok = false;
          for (let t = 0; t < 150 && !ok; t++) {
            const vertical = Math.random() < 0.5;
            const r = Math.floor(Math.random() * (vertical ? n - w.length + 1 : n));
            const c = Math.floor(Math.random() * (vertical ? n : n - w.length + 1));
            const cabe = [...w].every((ch, k) => { const x = g[vertical ? r + k : r][vertical ? c : c + k]; return x === '' || x === ch; });
            if (!cabe) continue;
            const celulas = [...w].map((ch, k) => { const rr = vertical ? r + k : r, cc = vertical ? c : c + k; g[rr][cc] = ch; return rr * n + cc; });
            colocadas.push({ p, w, celulas });
            ok = true;
          }
          if (!ok) break;
        }
        if (colocadas.length === palavras.length) {
          const abc = 'ABCDEFGHIJKLMNOPRSTUVWY';
          return { letras: g.flat().map((x) => x || abc[Math.floor(Math.random() * abc.length)]), colocadas };
        }
      }
      return null;
    }

    function jogoCacar() {
      const { tema, el } = partida;
      const n = tema.palavras.filter((p) => cacavel(p, 8)).length >= 4 ? 8 : 10;
      const candidatas = tema.palavras.filter((p) => cacavel(p, n));
      const escolhidas = escolher(candidatas, partida.dominio, Math.min(n === 8 ? 5 : 6, candidatas.length));
      const grade = montarGrade(escolhidas, n) || montarGrade(escolhidas.slice(0, 4), n);
      el.innerHTML = cabecalho('Find it!', 'Ache as palavras: toque na primeira letra e depois na última.', grade.colocadas.length) + `
        <div class="caca-lista" id="caca-lista">${grade.colocadas.map((x, i) => `<span data-i="${i}" title="Ouvir"><span class="fg">${esc(x.p.figura || '🔤')}</span>${esc(x.p.en)}</span>`).join('')}</div>
        <div class="caca" id="caca" style="grid-template-columns:repeat(${n}, minmax(0, 1fr))">${grade.letras.map((l, k) => `<button data-k="${k}">${l}</button>`).join('')}</div>`;
      ligarSair();
      let inicio = null, erros = 0, achadas = 0;
      const botoes = [...el.querySelectorAll('#caca button')];
      el.querySelector('#caca-lista').addEventListener('click', (ev) => {
        const s = ev.target.closest('[data-i]');
        if (s) Fala.falar(grade.colocadas[Number(s.dataset.i)].p.en);
      });
      el.querySelector('#caca').addEventListener('click', async (ev) => {
        const b = ev.target.closest('[data-k]');
        if (!b) return;
        const k = Number(b.dataset.k);
        if (inicio === null) { inicio = k; b.classList.add('inicio'); return; }
        botoes[inicio].classList.remove('inicio');
        const a = inicio;
        inicio = null;
        if (a === k) return;
        const [r1, c1, r2, c2] = [Math.floor(a / n), a % n, Math.floor(k / n), k % n];
        const linha = [];
        if (r1 === r2) for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) linha.push(r1 * n + c);
        else if (c1 === c2) for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) linha.push(r * n + c1);
        const achou = grade.colocadas.find((x) => !x.feita && linha.length === x.celulas.length && x.celulas.every((c, i) => c === linha[i]));
        if (achou) {
          achou.feita = true;
          achou.celulas.forEach((c) => botoes[c].classList.add('achada'));
          el.querySelector(`#caca-lista [data-i="${grade.colocadas.indexOf(achou)}"]`).classList.add('achada');
          const r = registro(achou.p.en);
          r.a = 1; r.c = 1;
          marcarPonto(achadas, 'feito');
          achadas++;
          Som.acerto();
          await Fala.falar(achou.p.en);
          if (achadas === grade.colocadas.length) {
            await espera(400);
            terminar(achadas, achadas, erros <= 1 ? 3 : erros <= 4 ? 2 : 1);
          }
        } else {
          erros++;
          const marcar = linha.length ? linha : [a, k];
          marcar.forEach((c) => botoes[c].classList.add('errada'));
          Som.erro();
          setTimeout(() => marcar.forEach((c) => botoes[c].classList.remove('errada')), 500);
        }
      });
    }

    // ------------------------------------------------------------
    // 6. Color it!: "Color the cat blue."
    // ------------------------------------------------------------
    const CORES = [
      { en: 'red', hex: '#e03131' }, { en: 'blue', hex: '#1c7ed6' }, { en: 'yellow', hex: '#fcc419' }, { en: 'green', hex: '#2f9e44' },
      { en: 'orange', hex: '#f76707' }, { en: 'purple', hex: '#7048e8' }, { en: 'pink', hex: '#f783ac' }, { en: 'brown', hex: '#8d5524' },
      { en: 'black', hex: '#343a40' }, { en: 'white', hex: '#ffffff' }, { en: 'gray', hex: '#adb5bd' },
    ];
    const ehTemaDeCores = (tema) => tema.palavras.filter((p) => CORES.some((c) => c.en === p.en.toLowerCase())).length >= tema.palavras.length / 2;

    async function jogoColorir() {
      const { tema, el } = partida;
      const comFigura = tema.palavras.filter((p) => p.figura);
      const rodadas = Math.min(6, Math.max(4, comFigura.length));
      el.innerHTML = cabecalho('Color it!', 'Ouça o comando, escolha a cor e toque na figura.', rodadas) + `
        <div class="centro"><button class="botao-som" data-ouvir aria-label="Ouvir de novo">🔊</button>
          <button class="botao-som pequeno" data-devagar aria-label="Ouvir devagar">🐢</button>
          <button class="botao-som pequeno" data-ver aria-label="Ver o comando escrito">👀</button></div>
        <div class="comando" id="comando"></div>
        <div class="paleta" id="paleta">${CORES.map((c) => `<button class="tinta" data-cor="${c.en}" style="background:${c.hex}" aria-label="cor"></button>`).join('')}</div>
        <div class="quadros" id="quadros"></div>`;
      ligarSair();
      let cor = null, frase = '', mostrarTexto = false, acertos = 0;
      const falar = (lento) => Fala.falar(frase, lento);
      el.querySelector('[data-ouvir]').onclick = () => falar(false);
      el.querySelector('[data-devagar]').onclick = () => falar(true);
      el.querySelector('[data-ver]').onclick = () => { mostrarTexto = !mostrarTexto; el.querySelector('#comando').textContent = mostrarTexto ? frase : ''; };
      el.querySelector('#paleta').onclick = (ev) => {
        const b = ev.target.closest('[data-cor]');
        if (!b) return;
        cor = b.dataset.cor;
        el.querySelectorAll('.tinta').forEach((x) => x.classList.toggle('escolhida', x === b));
      };

      for (let i = 0; i < rodadas; i++) {
        if (!partida.ativa) return;
        el.querySelectorAll('#pontinhos i').forEach((x, k) => x.classList.toggle('agora', k === i));
        const quatro = escolher(comFigura, partida.dominio, 4);
        const alvo = quatro[Math.floor(Math.random() * quatro.length)];
        const corAlvo = CORES[Math.floor(Math.random() * CORES.length)];
        frase = `Color the ${alvo.en} ${corAlvo.en}.`;
        el.querySelector('#comando').textContent = mostrarTexto ? frase : '';
        const r = registro(alvo.en);
        let erros = 0;
        await new Promise((proxima) => {
          const caixa = el.querySelector('#quadros');
          caixa.innerHTML = quatro.map((p, k) => `<button class="quadro" data-k="${k}">${esc(p.figura)}</button>`).join('');
          caixa.onclick = async (ev) => {
            const b = ev.target.closest('[data-k]');
            if (!b || caixa.dataset.travado) return;
            if (!cor) { Fala.falar('Choose a color first!'); return; }
            const p = quatro[Number(b.dataset.k)];
            b.style.background = CORES.find((c) => c.en === cor).hex;
            if (p === alvo && cor === corAlvo.en) {
              caixa.dataset.travado = '1';
              b.classList.add('pintado');
              Som.acerto();
              if (!erros) { r.a = 1; acertos++; }
              r.c = 1;
              marcarPonto(i, erros ? 'meio' : 'feito');
              await Fala.falar(`Yes! The ${alvo.en} is ${corAlvo.en}.`);
              await espera(300);
              delete caixa.dataset.travado;
              proxima();
            } else {
              erros++;
              r.e = Math.min(5, r.e + 1);
              b.classList.remove('errado');
              void b.offsetWidth;
              b.classList.add('errado');
              Som.erro();
              await espera(600);
              b.style.background = '';
              falar(false);
            }
          };
          espera(350).then(() => partida.ativa && falar(false));
        });
      }
      terminar(acertos, rodadas, estrelasPorPercentual((acertos / rodadas) * 100));
    }

    // ------------------------------------------------------------
    // 7. Build it!: montar a frase
    // ------------------------------------------------------------
    const pedacos = (en) => en.trim().split(/\s+/);
    const frasesBoas = (tema) => (tema.frases || []).filter((f) => { const n = pedacos(f.en).length; return n >= 2 && n <= 9; });

    async function jogoFrases() {
      const { tema, el } = partida;
      const rodadas = embaralhar(frasesBoas(tema)).slice(0, 5);
      el.innerHTML = cabecalho('Build it!', 'Ouça e toque nos blocos na ordem certa para montar a frase.', rodadas.length) + `<div id="frases-jogo"></div>`;
      ligarSair();
      let acertos = 0;
      for (let i = 0; i < rodadas.length; i++) {
        if (!partida.ativa) return;
        el.querySelectorAll('#pontinhos i').forEach((x, k) => x.classList.toggle('agora', k === i));
        const f = rodadas[i], partes = pedacos(f.en);
        const blocos = embaralhar(partes.map((t, k) => ({ t, k })));
        await new Promise((proxima) => {
          const caixa = el.querySelector('#frases-jogo');
          caixa.innerHTML = `
            <div class="centro"><button class="botao-som pequeno" data-ouvir aria-label="Ouvir">🔊</button>
              <button class="botao-som pequeno" data-devagar aria-label="Ouvir devagar">🐢</button></div>
            <div class="frase-pt">🇧🇷 ${esc(f.pt)}</div>
            <div class="frase-montada" id="montada"></div>
            <div class="blocos">${blocos.map((b, j) => `<button class="bloco" data-j="${j}">${esc(b.t)}</button>`).join('')}</div>`;
          let pos = 0, erros = 0;
          caixa.querySelector('[data-ouvir]').onclick = () => Fala.falar(f.en);
          caixa.querySelector('[data-devagar]').onclick = () => Fala.falar(f.en, true);
          caixa.querySelector('.blocos').onclick = async (ev) => {
            const b = ev.target.closest('.bloco');
            if (!b || b.disabled) return;
            if (blocos[Number(b.dataset.j)].t === partes[pos]) {
              b.disabled = true;
              caixa.querySelector('#montada').insertAdjacentHTML('beforeend', `<span>${esc(partes[pos])}</span>`);
              caixa.querySelectorAll('.bloco.dica').forEach((x) => x.classList.remove('dica'));
              pos++;
              if (pos === partes.length) {
                Som.acerto();
                if (!erros) acertos++;
                // Credita as palavras do tema que aparecem na frase.
                // Sem "cifrão + &" no código: o Google trata essa sequência de forma especial ao montar a página e quebra o script.
                const soPalavras = (s) => ' ' + s.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
                tema.palavras.forEach((p) => {
                  if (!soPalavras(f.en).includes(soPalavras(p.en))) return;
                  const r = registro(p.en);
                  if (!erros) r.a = 1;
                  r.c = 1;
                });
                marcarPonto(i, erros ? 'meio' : 'feito');
                await Fala.falar(f.en);
                await espera(500);
                proxima();
              }
            } else {
              erros++;
              b.classList.remove('errada');
              void b.offsetWidth;
              b.classList.add('errada');
              Som.erro();
              if (erros >= 3) {
                const dica = [...caixa.querySelectorAll('.bloco:not(:disabled)')].find((x) => blocos[Number(x.dataset.j)].t === partes[pos]);
                if (dica) dica.classList.add('dica');
              }
            }
          };
          espera(300).then(() => partida.ativa && Fala.falar(f.en));
        });
      }
      terminar(acertos, rodadas.length, estrelasPorPercentual((acertos / rodadas.length) * 100));
    }

    // ------------------------------------------------------------
    // 8. Spelling Bee: ouvir e soletrar com o teclado (sem ver a palavra)
    // ------------------------------------------------------------
    async function jogoAbelha() {
      const { tema, el } = partida;
      const lista = tema.palavras.filter(soletravel);
      const rodadas = escolher(lista, partida.dominio, Math.min(6, lista.length));
      el.innerHTML = cabecalho('Spelling Bee', 'Ouça a palavra e escreva com as letras (pode usar o teclado do Chromebook).', rodadas.length) + `<div id="abelha"></div>`;
      ligarSair();
      const eu = partida;
      let acertos = 0, teclaFisica = null;
      for (let i = 0; i < rodadas.length; i++) {
        if (!partida.ativa) break;
        el.querySelectorAll('#pontinhos i').forEach((x, k) => x.classList.toggle('agora', k === i));
        const p = rodadas[i], r = registro(p.en), chars = [...p.en];
        await new Promise((proxima) => {
          const caixa = el.querySelector('#abelha');
          caixa.innerHTML = `
            <div class="centro"><button class="botao-som" data-ouvir aria-label="Ouvir">🔊</button>
              <button class="botao-som pequeno" data-devagar aria-label="Ouvir devagar">🐢</button>
              <button class="botao-som pequeno" data-dica aria-label="Dica">💡</button></div>
            <div class="abelha-dica" id="dica-fig"></div>
            <div class="casas">${chars.map((c, k) => /[a-z]/i.test(c) ? `<div class="casa" data-k="${k}"></div>`
              : c === ' ' ? '<div class="casa espaco"></div>' : `<div class="casa fixa">${esc(c)}</div>`).join('')}</div>
            <div class="teclado">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => `<button class="tecla" data-l="${l}">${l}</button>`).join('')}</div>`;
          const casas = [...caixa.querySelectorAll('.casa[data-k]')];
          let pos = 0, erros = 0, terminou = false;
          const marcar = () => casas.forEach((c, k) => c.classList.toggle('proxima', k === pos));
          marcar();
          caixa.querySelector('[data-ouvir]').onclick = () => Fala.falar(p.en);
          caixa.querySelector('[data-devagar]').onclick = () => Fala.falar(p.en, true);
          caixa.querySelector('[data-dica]').onclick = () => { caixa.querySelector('#dica-fig').innerHTML = esc(p.figura || p.pt); };
          const apertar = async (letra) => {
            if (terminou) return;
            const certa = chars[Number(casas[pos].dataset.k)];
            const tecla = caixa.querySelector(`.tecla[data-l="${letra}"]`);
            if (letra === certa.toUpperCase()) {
              casas[pos].textContent = certa;
              casas[pos].classList.add('cheia');
              caixa.querySelectorAll('.tecla.dica').forEach((x) => x.classList.remove('dica'));
              Fala.falar(letra);
              pos++;
              marcar();
              if (pos === casas.length) {
                terminou = true;
                document.removeEventListener('keydown', teclaFisica);
                Som.acerto();
                if (!erros) { r.a = 1; acertos++; }
                r.c = 1;
                marcarPonto(i, erros ? 'meio' : 'feito');
                caixa.querySelector('#dica-fig').innerHTML = esc(p.figura || p.pt);
                await espera(500);
                await Fala.falar(p.en);
                await espera(500);
                proxima();
              }
            } else if (tecla) {
              erros++;
              r.e = Math.min(5, r.e + 1);
              tecla.classList.remove('errada');
              void tecla.offsetWidth;
              tecla.classList.add('errada');
              Som.erro();
              if (erros >= 3) caixa.querySelector(`.tecla[data-l="${certa.toUpperCase()}"]`).classList.add('dica');
            }
          };
          caixa.querySelector('.teclado').onclick = (ev) => { const b = ev.target.closest('[data-l]'); if (b) apertar(b.dataset.l); };
          teclaFisica = (ev) => {
            if (!eu.ativa || partida !== eu) { document.removeEventListener('keydown', teclaFisica); return; }
            if (/^[a-z]$/i.test(ev.key)) { ev.preventDefault(); apertar(ev.key.toUpperCase()); }
          };
          document.addEventListener('keydown', teclaFisica);
          espera(300).then(() => partida.ativa && Fala.falar(p.en));
        });
      }
      if (teclaFisica) document.removeEventListener('keydown', teclaFisica);
      if (partida.ativa) terminar(acertos, rodadas.length, estrelasPorPercentual((acertos / rodadas.length) * 100));
    }

    // ------------------------------------------------------------
    // 9. Repeat after me: ouvir e repetir em voz alta (prática, sem nota)
    // ------------------------------------------------------------
    async function jogoRepetir() {
      const { tema, el } = partida;
      const itens = escolher(tema.palavras, partida.dominio, Math.min(5, tema.palavras.length)).map((p) => ({ en: p.en, p }))
        .concat(embaralhar(frasesBoas(tema)).slice(0, 3).map((f) => ({ en: f.en, f })));
      el.innerHTML = cabecalho('Repeat after me', 'Ouça e repita em voz alta. Depois toque em 👍.', itens.length) + `<div id="repetir"></div>`;
      ligarSair();
      for (let i = 0; i < itens.length; i++) {
        if (!partida.ativa) return;
        el.querySelectorAll('#pontinhos i').forEach((x, k) => x.classList.toggle('agora', k === i));
        const it = itens[i];
        await new Promise((proxima) => {
          const caixa = el.querySelector('#repetir');
          caixa.innerHTML = `<div class="repetir-cartao">
              ${it.p ? figura(it.p, 'fg') : '<div class="fg">💬</div>'}
              <div class="en">${esc(it.en)}</div>
              ${it.f ? `<div class="frase-pt">${esc(it.f.pt)}</div>` : ''}
              <div class="vez" id="vez">🔊 Ouça…</div>
              <div class="centro"><button class="botao-som pequeno" data-ouvir aria-label="Ouvir">🔊</button>
                <button class="botao-som pequeno" data-devagar aria-label="Ouvir devagar">🐢</button>
                <button class="botao-grande" data-falei>👍 Falei!</button></div>
            </div>`;
          const tocar = async (lento) => {
            caixa.querySelector('#vez').textContent = '🔊 Ouça…';
            await Fala.falar(it.en, lento);
            const v = caixa.querySelector('#vez');
            if (v) v.textContent = '🗣️ Agora é a sua vez! Fale em voz alta.';
          };
          caixa.querySelector('[data-ouvir]').onclick = () => tocar(false);
          caixa.querySelector('[data-devagar]').onclick = () => tocar(true);
          caixa.querySelector('[data-falei]').onclick = () => { Som.acerto(); marcarPonto(i, 'feito'); proxima(); };
          espera(300).then(() => partida.ativa && tocar(false));
        });
      }
      // Sem como conferir a pronúncia: vale 1 estrela de participação e não mexe no domínio.
      terminar(itens.length, itens.length, 1);
    }

    const MOTORES = {
      ouvir: jogoOuvir, memoria: jogoMemoria, arrastar: jogoArrastar, montar: jogoMontar,
      cacar: jogoCacar, colorir: jogoColorir, frases: jogoFrases, abelha: jogoAbelha, repetir: jogoRepetir,
    };

    /**
     * Começa um jogo dentro do elemento el.
     * aoTerminar(resultado, avisarSalvamento): resultado = null quando a criança sai ou escolhe outro jogo.
     */
    function iniciar(jogo, tema, dominio, el, aoTerminar) {
      novaPartida(jogo, tema, dominio || {}, el, aoTerminar);
      window.scrollTo(0, 0);
      Fala.iniciar().then(() => MOTORES[jogo]());
    }

    return { DADOS, disponiveis, iniciar, escolher };
  })();
</script>
````

### Arquivo: `Professor.html`

Painel do professor (modelo) com abas Turmas, Alunos, Configurações. (472 linhas)

````html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <?!= incluir('Estilo'); ?>
  <?!= incluir('Fala'); ?>
  <style>
    .selo { display: inline-block; font-size: .78rem; font-weight: 600; padding: 2px 9px; border-radius: 99px; background: var(--borda); white-space: nowrap; }
    .selo.liberado { background: #d3f9d8; color: #2b8a3e; }
    .selo.oculto { background: #f1f3f5; color: #495057; }
    .grade-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 640px) { .grade-2 { grid-template-columns: 1fr; } }
    .avatar { font-size: 1.5rem; line-height: 1; }
    .avatares { display: flex; flex-wrap: wrap; gap: 6px; }
    .avatares button { font-size: 1.6rem; border: 2px solid var(--borda); background: #fff; border-radius: 10px; padding: 4px 6px; cursor: pointer; }
    .avatares button.ativa { border-color: var(--primaria); background: var(--primaria-clara); }
  </style>
</head>
<body>
  <header class="topo">
    <div class="marca-app"><?!= incluir('Marca'); ?><span class="sub-app">Painel do professor</span></div>
    <div class="suave pequeno"><?= email ?></div>
  </header>

  <nav class="abas">
    <button data-aba="turmas" class="ativa">Turmas</button>
    <button data-aba="alunos">Alunos</button>
    <button data-aba="temas">Temas</button>
    <button data-aba="progresso">Progresso</button>
    <button data-aba="avaliacoes">Avaliações</button>
    <button data-aba="equipes">Equipes</button>
    <button data-aba="relatorios">Relatórios</button>
    <button data-aba="teste">Teste do Chromebook</button>
    <button data-aba="config">Configurações</button>
  </nav>

  <main>
    <div id="carregando" class="carregando">Carregando…</div>

    <!-- Turmas -->
    <section id="aba-turmas" class="pilha" hidden>
      <div class="cartao">
        <h3>Link para os alunos</h3>
        <p class="suave pequeno">Envie este link às turmas (Google Sala de Aula, por exemplo). No primeiro acesso, a criança escreve o nome, escolhe a turma e um bichinho; o e-mail escolar é registrado sozinho.</p>
        <div class="link-box"><code id="link"></code><button class="btn mini" id="copiar-link">Copiar</button></div>
        <p id="aviso-cadastro" class="pequeno" style="color:var(--perigo)" hidden>O cadastro de novos alunos está fechado (veja Configurações).</p>
      </div>
      <div class="linha"><h2 style="margin:0">Turmas</h2><span class="espaco"></span><span class="suave" id="total-alunos"></span>
        <button class="btn" id="editar-turmas">Editar turmas</button></div>
      <div id="series" class="pilha"></div>
    </section>

    <!-- Alunos -->
    <section id="aba-alunos" class="pilha" hidden>
      <div class="linha">
        <select id="filtro-turma"></select>
        <input id="busca" type="search" placeholder="Buscar por nome ou e-mail" style="flex:1;min-width:200px">
        <button class="btn primario" id="novo-aluno">+ Adicionar aluno</button>
      </div>
      <div class="cartao">
        <p class="suave pequeno" id="contagem" style="margin-top:0"></p>
        <div class="tabela-rolagem">
          <table>
            <thead><tr><th></th><th>Nome</th><th>E-mail</th><th>Turma</th><th>Nível</th><th>Média</th><th></th></tr></thead>
            <tbody id="lista-alunos"></tbody>
          </table>
        </div>
      </div>
    </section>

    <?!= incluir('ProfTemas'); ?>
    <?!= incluir('ProfProgresso'); ?>
    <?!= incluir('ProfAvaliacoes'); ?>
    <?!= incluir('ProfEquipes'); ?>
    <?!= incluir('ProfRelatorios'); ?>

    <!-- Teste do Chromebook -->
    <section id="aba-teste" class="pilha" hidden>
      <div class="cartao">
        <h3>Teste num Chromebook dos alunos</h3>
        <p class="suave pequeno">Abra este link num Chromebook da escola, de preferência <strong>com a conta de um aluno</strong>. Assim o teste mostra o que as crianças vão encontrar, inclusive bloqueios da administração da rede.</p>
        <div class="link-box"><code id="link-teste"></code><button class="btn mini" id="copiar-teste">Copiar</button></div>
      </div>
      <?!= incluir('TesteConteudo'); ?>
    </section>

    <!-- Configurações -->
    <section id="aba-config" class="pilha" hidden>
      <form id="form-config" class="cartao">
        <h2>Configurações</h2>
        <div class="campo">
          <label for="cfg-dominio">Domínio dos e-mails da escola</label>
          <input id="cfg-dominio" placeholder="ex.: edu.joinville.sc.gov.br">
          <p class="suave pequeno">Somente contas terminadas em @domínio poderão se cadastrar. Deixe vazio para aceitar qualquer conta.</p>
        </div>
        <div class="campo">
          <label for="cfg-professores">Professores com acesso ao painel</label>
          <textarea id="cfg-professores" rows="2" placeholder="email1@escola, email2@escola"></textarea>
        </div>
        <div class="campo">
          <label for="cfg-cadastro">Cadastro de novos alunos</label>
          <select id="cfg-cadastro"><option value="SIM">Aberto</option><option value="NÃO">Fechado</option></select>
        </div>
        <div class="campo">
          <label for="cfg-voz">Velocidade da voz em inglês: <span id="cfg-voz-valor"></span></label>
          <div class="linha">
            <input id="cfg-voz" type="range" min="0.5" max="1.2" step="0.05" style="flex:1">
            <button class="btn mini" type="button" id="cfg-voz-ouvir">🔊 Ouvir</button>
          </div>
          <p class="suave pequeno">Mais devagar ajuda os alunos do 3º ano. Nos jogos, o botão 🐢 sempre repete ainda mais devagar.</p>
        </div>
        <div class="campo">
          <label>Faixas de nível (média % mínima nas avaliações)</label>
          <div class="linha">
            <span class="suave pequeno">Iniciante: abaixo de Básico</span>
            <span class="pequeno">Básico</span><input id="cfg-b" type="number" min="1" max="100" style="width:80px">
            <span class="pequeno">Intermediário</span><input id="cfg-i" type="number" min="1" max="100" style="width:80px">
            <span class="pequeno">Avançado</span><input id="cfg-a" type="number" min="1" max="100" style="width:80px">
          </div>
          <p class="suave pequeno">O nível aparece só para você. As crianças veem apenas as estrelas.</p>
        </div>
        <div class="rodape-modal"><button class="btn primario" type="submit">Salvar</button></div>
      </form>

      <form id="form-api" class="cartao">
        <h2>Geração de temas com IA</h2>
        <p class="suave pequeno">Opcional. Com uma chave da API da Anthropic (console.anthropic.com), o botão "Gerar com IA" monta as palavras, emojis e frases de um tema novo a partir do conteúdo. O custo é cobrado pela Anthropic, por uso. A chave fica guardada no script, não na planilha. Sem chave, você pode pedir o tema no chat e usar "Colar JSON".</p>
        <p>Situação: <strong id="api-status"></strong></p>
        <div class="campo"><label for="api-chave">Nova chave</label><input id="api-chave" type="password" autocomplete="off" placeholder="sk-ant-…"></div>
        <div class="rodape-modal">
          <button class="btn perigo" type="button" id="api-remover">Remover chave</button>
          <button class="btn primario" type="submit">Salvar chave</button>
        </div>
      </form>
    </section>
  </main>

  <div id="impressao"></div>

  <dialog id="modal-aluno">
    <form id="form-aluno" method="dialog">
      <h2 id="modal-titulo">Aluno</h2>
      <input type="hidden" id="al-original">
      <div class="campo"><label for="al-nome">Nome completo</label><input id="al-nome" required></div>
      <div class="campo"><label for="al-email">E-mail escolar</label><input id="al-email" type="email" required></div>
      <div class="campo"><label for="al-turma">Turma</label><select id="al-turma" required></select></div>
      <div class="campo"><label>Bichinho</label><div class="avatares" id="al-avatares"></div></div>
      <div class="rodape-modal">
        <button class="btn" type="button" data-fechar>Cancelar</button>
        <button class="btn primario" type="submit">Salvar</button>
      </div>
    </form>
  </dialog>

  <dialog id="modal-turmas">
    <form id="form-turmas" method="dialog">
      <h2>Editar turmas</h2>
      <p class="suave pequeno">Escreva o final do nome das turmas de cada série, separados por vírgula (ex.: <code>A, B, C</code> vira 3ºA, 3ºB e 3ºC). Turmas que já têm alunos não podem sair.</p>
      <div id="turmas-campos"></div>
      <div class="rodape-modal">
        <button class="btn" type="button" data-fechar>Cancelar</button>
        <button class="btn primario" type="submit">Salvar</button>
      </div>
    </form>
  </dialog>

  <dialog id="modal-json">
    <form id="form-json" method="dialog">
      <h2 id="json-titulo">Colar JSON</h2>
      <p class="suave pequeno" id="json-ajuda"></p>
      <textarea id="json-texto" rows="12" style="font-family:monospace;font-size:.8rem"></textarea>
      <div class="rodape-modal">
        <button class="btn" type="button" data-fechar>Cancelar</button>
        <button class="btn primario" type="submit">Importar</button>
      </div>
    </form>
  </dialog>

  <script>
    const estado = { resumo: null, alunos: [], temas: [] };
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function chamar(fn, ...args) {
      return new Promise((ok, falha) => {
        google.script.run
          .withSuccessHandler(ok)
          .withFailureHandler((e) => { avisar(e.message, true); falha(e); })[fn](...args);
      });
    }

    let temporizador;
    function avisar(texto, erro) {
      let el = document.querySelector('.aviso');
      if (!el) { el = document.createElement('div'); document.body.appendChild(el); }
      el.className = 'aviso' + (erro ? ' erro' : '');
      el.textContent = texto;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => el.remove(), erro ? 7000 : 3000);
    }

    async function comBotao(botao, fn) {
      botao.disabled = true;
      try { return await fn(); } catch (e) { /* aviso já exibido */ } finally { botao.disabled = false; }
    }

    document.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

    // ---------- Navegação ----------
    function abrirAba(nome) {
      document.querySelectorAll('.abas button[data-aba]').forEach((b) => b.classList.toggle('ativa', b.dataset.aba === nome));
      document.querySelectorAll('main > section').forEach((s) => (s.hidden = s.id !== 'aba-' + nome));
    }
    document.querySelectorAll('.abas button[data-aba]').forEach((b) => b.addEventListener('click', () => abrirAba(b.dataset.aba)));

    function opcoesSerie(incluirTodas) {
      return (incluirTodas ? '<option value="">Todas as séries</option>' : '') +
        estado.resumo.series.map((s) => `<option value="${esc(s)}">${esc(s)} ano</option>`).join('');
    }

    function opcoesTurma(incluirTodas) {
      const r = estado.resumo;
      return (incluirTodas ? '<option value="">Todas as turmas</option>' : '') +
        r.series.map((s) => `<optgroup label="${esc(s)} ano">${r.turmas.filter((t) => t.serie === s)
          .map((t) => `<option value="${esc(t.turma)}">${esc(t.turma)}</option>`).join('')}</optgroup>`).join('');
    }

    function copiar(texto) {
      navigator.clipboard.writeText(texto).then(() => avisar('Link copiado.'));
    }

    // ---------- Turmas ----------
    function renderTurmas() {
      const r = estado.resumo;
      $('link').textContent = r.link || 'Publique o sistema para gerar o link.';
      $('link-teste').textContent = r.link ? r.link + '?teste=1' : 'Publique o sistema para gerar o link.';
      $('aviso-cadastro').hidden = r.config.cadastro_aberto !== 'NÃO';
      $('total-alunos').textContent = r.totalAlunos + ' alunos cadastrados';
      $('series').innerHTML = r.series.map((serie) => {
        const turmas = r.turmas.filter((t) => t.serie === serie);
        return `<div><h3>${esc(serie)} ano</h3><div class="grade">${turmas.length ? turmas.map((t) => `
          <div class="cartao turma" data-turma="${esc(t.turma)}">
            <div class="suave pequeno">Turma</div>
            <div class="linha"><strong style="font-size:1.1rem">${esc(t.turma)}</strong><span class="espaco"></span>
              <span class="num">${t.total}</span><span class="suave">/ ${r.maxPorTurma}</span></div>
            <div class="barra"><i style="width:${Math.min(100, (t.total / r.maxPorTurma) * 100)}%"></i></div>
          </div>`).join('') : '<p class="suave pequeno">Nenhuma turma desta série.</p>'}</div></div>`;
      }).join('');
      document.querySelectorAll('.turma').forEach((c) => c.addEventListener('click', () => {
        $('filtro-turma').value = c.dataset.turma;
        renderAlunos();
        abrirAba('alunos');
      }));
    }
    $('copiar-link').addEventListener('click', () => copiar($('link').textContent));
    $('copiar-teste').addEventListener('click', () => copiar($('link-teste').textContent));

    $('editar-turmas').addEventListener('click', () => {
      const r = estado.resumo;
      $('turmas-campos').innerHTML = r.series.map((s) => `
        <div class="campo"><label for="tf-${esc(s)}">${esc(s)} ano</label>
          <input id="tf-${esc(s)}" data-serie="${esc(s)}" value="${esc(r.turmas.filter((t) => t.serie === s).map((t) => t.turma.slice(s.length)).join(', '))}"></div>`).join('');
      $('modal-turmas').showModal();
    });
    $('form-turmas').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const lista = [];
      document.querySelectorAll('#turmas-campos input').forEach((i) => {
        i.value.split(',').map((x) => x.trim()).filter(Boolean).forEach((fim) => lista.push({ serie: i.dataset.serie, turma: i.dataset.serie + fim }));
      });
      comBotao(ev.submitter, async () => {
        estado.resumo = await chamar('profSalvarTurmas', lista);
        $('modal-turmas').close();
        $('filtro-turma').innerHTML = opcoesTurma(true);
        $('al-turma').innerHTML = opcoesTurma(false);
        $('pg-turma').innerHTML = '<option value="">Escolha a turma…</option>' + opcoesTurma(false);
        renderTurmas();
        renderAlunos();
        avisar('Turmas salvas.');
      });
    });

    // ---------- Alunos ----------
    function renderAlunos() {
      const turma = $('filtro-turma').value;
      const termo = $('busca').value.trim().toLowerCase();
      const lista = estado.alunos
        .filter((a) => !turma || a.turma === turma)
        .filter((a) => !termo || a.nome.toLowerCase().includes(termo) || a.email.includes(termo))
        .sort((a, b) => a.turma.localeCompare(b.turma) || a.nome.localeCompare(b.nome, 'pt-BR'));
      $('contagem').textContent = lista.length + (lista.length === 1 ? ' aluno' : ' alunos');
      $('lista-alunos').innerHTML = lista.length ? lista.map((a) => `
        <tr>
          <td class="avatar">${esc(a.avatar)}</td>
          <td>${esc(a.nome)}</td>
          <td class="suave">${esc(a.email)}</td>
          <td>${esc(a.turma)}</td>
          <td>${a.nivel ? `<span class="selo ${esc(a.nivel)}">${esc(a.nivel)}</span>` : '<span class="suave pequeno">sem avaliação</span>'}</td>
          <td class="suave">${a.media != null ? a.media + '% <span class="pequeno">(' + a.avaliacoes + ')</span>' : ''}</td>
          <td class="acoes">
            <button class="btn mini" data-editar="${esc(a.email)}">Editar</button>
            <button class="btn mini perigo" data-excluir="${esc(a.email)}">Excluir</button>
          </td>
        </tr>`).join('') : '<tr><td colspan="7" class="vazio">Nenhum aluno encontrado.</td></tr>';
    }
    $('filtro-turma').addEventListener('change', renderAlunos);
    $('busca').addEventListener('input', renderAlunos);

    $('lista-alunos').addEventListener('click', async (ev) => {
      const editar = ev.target.dataset.editar;
      const excluir = ev.target.dataset.excluir;
      if (editar) abrirModalAluno(estado.alunos.find((a) => a.email === editar));
      if (excluir) {
        const aluno = estado.alunos.find((a) => a.email === excluir);
        if (!confirm(`Excluir o cadastro de ${aluno.nome} (${aluno.turma})?`)) return;
        await comBotao(ev.target, async () => {
          estado.alunos = await chamar('profExcluirAluno', excluir);
          await atualizarResumo();
          avisar('Cadastro excluído.');
        });
      }
    });

    let avatarEscolhido = '';
    function renderAvatares() {
      $('al-avatares').innerHTML = estado.resumo.avatares.map((a) =>
        `<button type="button" class="${a === avatarEscolhido ? 'ativa' : ''}" data-avatar="${esc(a)}">${esc(a)}</button>`).join('');
    }
    $('al-avatares').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-avatar]');
      if (!b) return;
      avatarEscolhido = b.dataset.avatar;
      renderAvatares();
    });

    function abrirModalAluno(aluno) {
      $('modal-titulo').textContent = aluno ? 'Editar aluno' : 'Adicionar aluno';
      $('al-original').value = aluno ? aluno.email : '';
      $('al-nome').value = aluno ? aluno.nome : '';
      $('al-email').value = aluno ? aluno.email : '';
      $('al-turma').value = aluno ? aluno.turma : ($('filtro-turma').value || (estado.resumo.turmas[0] || {}).turma || '');
      avatarEscolhido = aluno ? aluno.avatar : estado.resumo.avatares[0];
      renderAvatares();
      $('modal-aluno').showModal();
    }
    $('novo-aluno').addEventListener('click', () => abrirModalAluno(null));

    $('form-aluno').addEventListener('submit', (ev) => {
      ev.preventDefault();
      comBotao(ev.submitter, async () => {
        estado.alunos = await chamar('profSalvarAluno', {
          emailOriginal: $('al-original').value,
          nome: $('al-nome').value,
          email: $('al-email').value,
          turma: $('al-turma').value,
          avatar: avatarEscolhido,
        });
        $('modal-aluno').close();
        await atualizarResumo();
        avisar('Aluno salvo.');
      });
    });

    // ---------- JSON (usado pelos Temas) ----------
    let aoImportarJson = null;
    function abrirJson(titulo, ajuda, fn) {
      $('json-titulo').textContent = titulo;
      $('json-ajuda').textContent = ajuda;
      $('json-texto').value = '';
      aoImportarJson = fn;
      $('modal-json').showModal();
    }
    $('form-json').addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (aoImportarJson) comBotao(ev.submitter, () => aoImportarJson($('json-texto').value.trim()));
    });

    // ---------- Configurações ----------
    function renderConfig() {
      const c = estado.resumo.config;
      $('cfg-dominio').value = c.dominio;
      $('cfg-professores').value = c.professores;
      $('cfg-cadastro').value = c.cadastro_aberto === 'NÃO' ? 'NÃO' : 'SIM';
      $('cfg-voz').value = c.velocidade_voz;
      $('cfg-b').value = c.faixa_basico;
      $('cfg-i').value = c.faixa_intermediario;
      $('cfg-a').value = c.faixa_avancado;
      $('cfg-voz-valor').textContent = Number(c.velocidade_voz).toLocaleString('pt-BR');
      Fala.velocidade = Number(c.velocidade_voz);
      $('api-status').textContent = estado.resumo.temChaveApi ? 'chave configurada ✅' : 'sem chave (use a opção de colar JSON)';
    }
    $('cfg-voz').addEventListener('input', () => {
      $('cfg-voz-valor').textContent = Number($('cfg-voz').value).toLocaleString('pt-BR');
      Fala.velocidade = Number($('cfg-voz').value);
    });
    $('cfg-voz-ouvir').addEventListener('click', async () => { await Fala.iniciar(); Fala.falar('My favorite color is blue.'); });

    $('form-config').addEventListener('submit', (ev) => {
      ev.preventDefault();
      comBotao(ev.submitter, async () => {
        estado.resumo = await chamar('profSalvarConfig', {
          dominio: $('cfg-dominio').value,
          professores: $('cfg-professores').value,
          cadastro_aberto: $('cfg-cadastro').value,
          velocidade_voz: $('cfg-voz').value,
          faixa_basico: $('cfg-b').value,
          faixa_intermediario: $('cfg-i').value,
          faixa_avancado: $('cfg-a').value,
        });
        estado.alunos = await chamar('profListarAlunos');
        renderTudo();
        avisar('Configurações salvas.');
      });
    });

    async function salvarChave(botao, chave) {
      await comBotao(botao, async () => {
        estado.resumo.temChaveApi = await chamar('profSalvarChaveApi', chave);
        $('api-chave').value = '';
        renderConfig();
        avisar(estado.resumo.temChaveApi ? 'Chave salva.' : 'Chave removida.');
      });
    }
    $('form-api').addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!$('api-chave').value.trim()) { avisar('Cole a chave antes de salvar.', true); return; }
      salvarChave(ev.submitter, $('api-chave').value);
    });
    $('api-remover').addEventListener('click', (ev) => {
      if (confirm('Remover a chave da API?')) salvarChave(ev.target, '');
    });

    // ---------- Inicialização ----------
    async function atualizarResumo() {
      estado.resumo = await chamar('profResumo');
      renderTurmas();
      renderAlunos();
    }

    function renderTudo() {
      renderTurmas();
      renderAlunos();
      renderConfig();
      renderTemas();
      renderAvaliacoes();
    }

    (async function iniciar() {
      try {
        const [resumo, alunos, temas, avaliacoes] = await Promise.all([
          chamar('profResumo'), chamar('profListarAlunos'), chamar('profListarTemas'), chamar('profListarAvaliacoes'),
        ]);
        Object.assign(estado, { resumo, alunos, temas, avaliacoes });
        $('filtro-turma').innerHTML = opcoesTurma(true);
        $('al-turma').innerHTML = opcoesTurma(false);
        configurarTemas();
        configurarProgresso();
        configurarAvaliacoes();
        configurarEquipes();
        configurarRelatorios();
        renderTudo();
        Fala.iniciar();
        $('carregando').hidden = true;
        abrirAba('turmas');
      } catch (e) {
        $('carregando').textContent = 'Erro ao carregar: ' + e.message;
      }
    })();
  </script>
</body>
</html>
````

### Arquivo: `ProfTemas.html`

Aba Temas. (328 linhas)

````html
<!-- Temas -->
<section id="aba-temas" hidden>
  <style>
    .figuras-mini { font-size: 1.3rem; letter-spacing: 2px; white-space: nowrap; }
    .tabela-palavras td { padding: 6px 4px; }
    .tabela-palavras input { padding: 7px 9px; }
    .tabela-palavras input.figura { width: 64px; text-align: center; font-size: 1.4rem; padding: 3px; }
    .tabela-palavras .num-linha { color: var(--suave); font-size: .8rem; width: 26px; }
    .dica-emoji { background: var(--primaria-clara); border-radius: 8px; padding: 8px 12px; }
  </style>

  <!-- Lista -->
  <div id="t-lista" class="pilha">
    <div class="linha">
      <select id="t-filtro-serie"></select>
      <span class="espaco"></span>
      <button class="btn" id="t-restaurar" title="Cria de novo os temas padrão que você apagou">Restaurar temas padrão</button>
      <button class="btn" id="t-importar">Colar JSON</button>
      <button class="btn primario" id="t-novo">+ Novo tema</button>
    </div>
    <p class="suave pequeno" style="margin:0">Cada tema é uma lista de palavras (com figura e tradução) e frases. Os jogos e as avaliações do tema são montados a partir dela.
      Só os temas <span class="selo liberado">Liberado</span> aparecem para os alunos da série, que podem jogar quando quiserem.</p>
    <div class="cartao tabela-rolagem">
      <table>
        <thead><tr><th></th><th>Tema</th><th>Série</th><th>Mês</th><th>Conteúdo</th><th>Status</th><th></th></tr></thead>
        <tbody id="t-tabela"></tbody>
      </table>
    </div>
  </div>

  <!-- Editor -->
  <div id="t-editor" class="pilha" hidden>
    <div class="linha">
      <button class="btn" id="te-voltar">← Voltar</button>
      <h2 style="margin:0" id="te-titulo-tela">Tema</h2>
      <span class="espaco"></span>
      <button class="btn primario" id="te-salvar">Salvar</button>
    </div>
    <div class="cartao">
      <div class="grade-2">
        <div class="campo"><label for="te-titulo">Título em inglês</label><input id="te-titulo" placeholder="ex.: Food and drinks"></div>
        <div class="campo"><label for="te-titulo-pt">Título em português</label><input id="te-titulo-pt" placeholder="ex.: Alimentos e bebidas"></div>
      </div>
      <div class="grade-2" style="margin-top:14px">
        <div class="grade-2">
          <div class="campo"><label for="te-serie">Série</label><select id="te-serie"></select></div>
          <div class="campo"><label for="te-trimestre">Trimestre</label>
            <select id="te-trimestre"><option value="1">1º</option><option value="2">2º</option><option value="3">3º</option></select></div>
        </div>
        <div class="campo"><label for="te-mes">Mês em que começa</label><select id="te-mes"></select></div>
      </div>
      <div class="campo" style="margin-top:14px">
        <label for="te-conteudo">Conteúdo trabalhado <span class="suave pequeno">(usado pela IA)</span></label>
        <textarea id="te-conteudo" rows="2" placeholder="ex.: Alimentos e bebidas; I like / I don't like; Do you like…?"></textarea>
      </div>
      <div class="linha" style="margin-top:12px">
        <button class="btn" id="te-gerar">✨ Gerar com IA</button>
        <input id="te-qtd" type="number" min="4" max="30" value="12" style="width:70px" title="Quantidade de palavras">
        <span class="suave pequeno">palavras</span>
        <button class="btn" id="te-colar">Colar JSON</button>
        <span class="suave pequeno" id="te-ia-status"></span>
      </div>
    </div>

    <div class="cartao">
      <div class="linha"><h3 style="margin:0">Palavras <span class="suave" id="te-n-palavras"></span></h3><span class="espaco"></span>
        <button class="btn" id="te-ouvir-todas">🔊 Ouvir todas</button>
        <button class="btn" id="te-add-palavra">+ Palavra</button></div>
      <p class="dica-emoji pequeno">💡 <strong>Figura</strong> é um emoji que mostra a palavra. Para escolher um emoji: no Windows, tecla <kbd>Windows</kbd> + <kbd>.</kbd>; no Chromebook, <kbd>🔍</kbd> + <kbd>Shift</kbd> + <kbd>Espaço</kbd>.
        Use números para 11 em diante (ex.: <code>15</code>). Se nenhum emoji servir, deixe vazio: o jogo mostra a palavra em português. Duas palavras não podem usar a mesma figura.</p>
      <div class="tabela-rolagem">
        <table class="tabela-palavras">
          <thead><tr><th></th><th>Figura</th><th>Inglês</th><th>Português</th><th></th></tr></thead>
          <tbody id="te-palavras"></tbody>
        </table>
      </div>
    </div>

    <div class="cartao">
      <div class="linha"><h3 style="margin:0">Frases <span class="suave" id="te-n-frases"></span></h3><span class="espaco"></span>
        <button class="btn" id="te-add-frase">+ Frase</button></div>
      <p class="suave pequeno">Frases curtas usadas nos jogos de ouvir e montar frases (até 8 palavras funciona melhor).</p>
      <div class="tabela-rolagem">
        <table class="tabela-palavras">
          <thead><tr><th></th><th>Inglês</th><th>Português</th><th></th></tr></thead>
          <tbody id="te-frases"></tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<script>
  const MESES = ['', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  let temaEdicao = null;

  function telaTemas(qual) {
    $('t-lista').hidden = qual !== 'lista';
    $('t-editor').hidden = qual !== 'editor';
    window.scrollTo(0, 0);
  }

  function renderTemas() {
    const serie = $('t-filtro-serie').value;
    const lista = estado.temas.filter((t) => !serie || t.serie === serie);
    $('t-tabela').innerHTML = lista.length ? lista.map((t) => {
      const figuras = t.palavras.map((p) => p.figura).filter(Boolean).slice(0, 4).join('');
      return `<tr>
        <td class="figuras-mini">${esc(figuras)}</td>
        <td><strong>${esc(t.titulo)}</strong><div class="suave pequeno">${esc(t.titulo_pt)}</div></td>
        <td>${esc(t.serie)}</td>
        <td class="pequeno">${esc(MESES[t.mes] || '')}<div class="suave">${t.trimestre}º tri</div></td>
        <td class="pequeno">${t.palavras.length} palavras<div class="suave">${t.frases.length} frases</div></td>
        <td><span class="selo ${esc(t.status)}">${t.status === 'liberado' ? 'Liberado' : 'Oculto'}</span></td>
        <td class="acoes">
          <button class="btn mini" data-acao="status" data-id="${esc(t.id)}">${t.status === 'liberado' ? 'Ocultar' : 'Liberar'}</button>
          <button class="btn mini" data-acao="editar" data-id="${esc(t.id)}">Editar</button>
          <button class="btn mini perigo" data-acao="excluir" data-id="${esc(t.id)}">Excluir</button>
        </td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="vazio">Nenhum tema. Crie um novo, cole um JSON ou restaure os temas padrão.</td></tr>';
  }

  // ---------- Editor ----------
  function abrirEditorTema(t) {
    temaEdicao = t
      ? { id: t.id, palavras: t.palavras.map((p) => ({ ...p })), frases: t.frases.map((f) => ({ ...f })) }
      : { id: '', palavras: [], frases: [] };
    $('te-titulo-tela').textContent = t ? 'Editar tema' : 'Novo tema';
    $('te-titulo').value = t ? t.titulo : '';
    $('te-titulo-pt').value = t ? t.titulo_pt : '';
    $('te-serie').value = t ? t.serie : ($('t-filtro-serie').value || estado.resumo.series[0]);
    $('te-trimestre').value = t ? t.trimestre : 1;
    $('te-mes').value = t ? t.mes : new Date().getMonth() + 1 < 2 ? 2 : new Date().getMonth() + 1;
    $('te-conteudo').value = t ? t.conteudo : '';
    $('te-ia-status').textContent = '';
    if (!t) { for (let i = 0; i < 4; i++) temaEdicao.palavras.push({ en: '', pt: '', figura: '' }); }
    renderEditorTema();
    telaTemas('editor');
  }

  function renderEditorTema() {
    const ed = temaEdicao;
    $('te-n-palavras').textContent = `(${ed.palavras.length})`;
    $('te-n-frases').textContent = `(${ed.frases.length})`;
    $('te-palavras').innerHTML = ed.palavras.map((p, i) => `
      <tr data-p="${i}">
        <td class="num-linha">${i + 1}</td>
        <td><input class="figura" data-campo="figura" value="${esc(p.figura)}" placeholder="🙂" maxlength="16"></td>
        <td><input data-campo="en" value="${esc(p.en)}" placeholder="apple" spellcheck="true" lang="en"></td>
        <td><input data-campo="pt" value="${esc(p.pt)}" placeholder="maçã"></td>
        <td class="acoes"><button class="btn mini" data-ouvir="${i}" title="Ouvir">🔊</button>
          <button class="btn mini perigo" data-remover="${i}" title="Remover">✕</button></td>
      </tr>`).join('') || '<tr><td colspan="5" class="vazio">Nenhuma palavra.</td></tr>';
    $('te-frases').innerHTML = ed.frases.map((f, i) => `
      <tr data-f="${i}">
        <td class="num-linha">${i + 1}</td>
        <td><input data-campo="en" value="${esc(f.en)}" placeholder="I like apples." spellcheck="true" lang="en"></td>
        <td><input data-campo="pt" value="${esc(f.pt)}" placeholder="Eu gosto de maçãs."></td>
        <td class="acoes"><button class="btn mini" data-ouvir="${i}" title="Ouvir">🔊</button>
          <button class="btn mini perigo" data-remover="${i}" title="Remover">✕</button></td>
      </tr>`).join('') || '<tr><td colspan="4" class="vazio">Nenhuma frase.</td></tr>';
  }

  function ligarTabela(idCorpo, atributo, lista) {
    $(idCorpo).addEventListener('input', (ev) => {
      const linha = ev.target.closest(`[data-${atributo}]`);
      if (linha && ev.target.dataset.campo) temaEdicao[lista][Number(linha.dataset[atributo])][ev.target.dataset.campo] = ev.target.value;
    });
    $(idCorpo).addEventListener('click', async (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.dataset.ouvir !== undefined) {
        await Fala.iniciar();
        Fala.falar(temaEdicao[lista][Number(b.dataset.ouvir)].en);
      }
      if (b.dataset.remover !== undefined) {
        temaEdicao[lista].splice(Number(b.dataset.remover), 1);
        renderEditorTema();
      }
    });
  }

  function dadosEditorTema() {
    return {
      id: temaEdicao.id,
      titulo: $('te-titulo').value, titulo_pt: $('te-titulo-pt').value,
      serie: $('te-serie').value, trimestre: Number($('te-trimestre').value), mes: Number($('te-mes').value),
      conteudo: $('te-conteudo').value,
      palavras: temaEdicao.palavras, frases: temaEdicao.frases,
    };
  }

  /** Aplica um tema vindo da IA ou do JSON colado ao editor (nada é salvo até clicar em Salvar). */
  function aplicarNoEditor(t) {
    if (t.titulo && !$('te-titulo').value) $('te-titulo').value = t.titulo;
    if (t.titulo_pt && !$('te-titulo-pt').value) $('te-titulo-pt').value = t.titulo_pt;
    if (t.serie && estado.resumo.series.includes(t.serie)) $('te-serie').value = t.serie;
    if (t.trimestre) $('te-trimestre').value = t.trimestre;
    if (t.mes) $('te-mes').value = t.mes;
    const palavras = (t.palavras || []).map((p) => (Array.isArray(p) ? { en: p[0], pt: p[1], figura: p[2] } : p));
    const frases = (t.frases || []).map((f) => (Array.isArray(f) ? { en: f[0], pt: f[1] } : f));
    temaEdicao.palavras = palavras.map((p) => ({ en: String(p.en || ''), pt: String(p.pt || ''), figura: String(p.figura || '') }));
    temaEdicao.frases = frases.map((f) => ({ en: String(f.en || ''), pt: String(f.pt || '') }));
    renderEditorTema();
  }

  function configurarTemas() {
    $('t-filtro-serie').innerHTML = opcoesSerie(true);
    $('te-serie').innerHTML = opcoesSerie(false);
    $('te-mes').innerHTML = MESES.map((m, i) => (i >= 2 ? `<option value="${i}">${m}</option>` : '')).join('');
    $('t-filtro-serie').addEventListener('change', renderTemas);

    $('t-tabela').addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-acao]');
      if (!b) return;
      const t = estado.temas.find((x) => x.id === b.dataset.id);
      if (b.dataset.acao === 'editar') abrirEditorTema(t);
      if (b.dataset.acao === 'status') {
        const novo = t.status === 'liberado' ? 'oculto' : 'liberado';
        comBotao(b, async () => {
          estado.temas = await chamar('profAlterarStatusTema', t.id, novo);
          renderTemas();
          avisar(novo === 'liberado' ? `"${t.titulo}" liberado para o ${t.serie} ano.` : `"${t.titulo}" ocultado.`);
        });
      }
      if (b.dataset.acao === 'excluir') {
        if (!confirm(`Excluir o tema "${t.titulo}" (${t.serie} ano)?`)) return;
        comBotao(b, async () => {
          estado.temas = await chamar('profExcluirTema', t.id);
          renderTemas();
          avisar('Tema excluído.');
        });
      }
    });

    $('t-novo').addEventListener('click', () => abrirEditorTema(null));
    $('te-voltar').addEventListener('click', () => telaTemas('lista'));

    $('t-restaurar').addEventListener('click', (ev) => {
      if (!confirm('Criar de novo os temas padrão que não existem mais? Os temas atuais não mudam. Os restaurados entram ocultos.')) return;
      comBotao(ev.target, async () => {
        const r = await chamar('profRestaurarTemasPadrao');
        estado.temas = r.temas;
        renderTemas();
        avisar(r.criados ? r.criados + ' tema(s) restaurado(s), ocultos.' : 'Todos os temas padrão já existem.');
      });
    });

    $('t-importar').addEventListener('click', () => abrirJson('Colar temas (JSON)',
      'Cole o JSON de um tema, de uma lista de temas ou { "temas": [...] }. Cada tema entra oculto, para você revisar e liberar.',
      async (texto) => {
        const r = await chamar('profImportarTemas', texto);
        estado.temas = r.temas;
        $('modal-json').close();
        renderTemas();
        avisar(r.importados + (r.importados === 1 ? ' tema importado.' : ' temas importados.'));
      }));

    $('te-colar').addEventListener('click', () => abrirJson('Colar tema no editor',
      'Cole o JSON de um tema. As palavras e frases substituem as atuais do editor (nada é salvo até você clicar em Salvar).',
      async (texto) => {
        try {
          let d = JSON.parse(texto);
          if (Array.isArray(d.temas)) d = d.temas[0];
          if (Array.isArray(d)) d = d[0];
          if (!d || !Array.isArray(d.palavras)) throw new Error('não encontrei a lista "palavras"');
          aplicarNoEditor(d);
          $('modal-json').close();
          avisar('Tema colado. Revise e clique em Salvar.');
        } catch (e) { avisar('JSON inválido: ' + e.message, true); }
      }));

    ligarTabela('te-palavras', 'p', 'palavras');
    ligarTabela('te-frases', 'f', 'frases');
    $('te-add-palavra').addEventListener('click', () => {
      temaEdicao.palavras.push({ en: '', pt: '', figura: '' });
      renderEditorTema();
      $('te-palavras').lastElementChild.querySelector('input').focus();
    });
    $('te-add-frase').addEventListener('click', () => {
      temaEdicao.frases.push({ en: '', pt: '' });
      renderEditorTema();
      $('te-frases').lastElementChild.querySelector('input').focus();
    });
    $('te-ouvir-todas').addEventListener('click', async (ev) => {
      await Fala.iniciar();
      ev.target.disabled = true;
      for (const p of temaEdicao.palavras) {
        if (!p.en) continue;
        await Fala.falar(p.en);
        await new Promise((ok) => setTimeout(ok, 350));
      }
      ev.target.disabled = false;
    });

    $('te-salvar').addEventListener('click', (ev) => comBotao(ev.target, async () => {
      const dados = dadosEditorTema();
      estado.temas = await chamar('profSalvarTema', dados);
      const salvo = estado.temas.find((t) => t.serie === dados.serie && t.titulo.toLowerCase() === dados.titulo.trim().replace(/\s+/g, ' ').toLowerCase());
      if (salvo) temaEdicao.id = salvo.id;
      renderTemas();
      avisar('Tema salvo.' + (salvo && salvo.status === 'oculto' ? ' Ele está oculto: libere na lista quando quiser.' : ''));
    }));

    $('te-gerar').addEventListener('click', (ev) => {
      if (!estado.resumo.temChaveApi) {
        avisar('Cadastre a chave da API em Configurações, ou peça o tema no chat e use "Colar JSON".', true);
        return;
      }
      const temAlgo = temaEdicao.palavras.some((p) => p.en || p.pt);
      if (temAlgo && !confirm('Substituir as palavras e frases atuais pelas geradas pela IA?')) return;
      $('te-ia-status').textContent = 'Gerando… pode levar até 1 minuto.';
      comBotao(ev.target, async () => {
        try {
          const t = await chamar('profGerarTemaIA', {
            serie: $('te-serie').value, titulo: $('te-titulo').value, conteudo: $('te-conteudo').value, quantidade: $('te-qtd').value,
          });
          aplicarNoEditor(t);
          $('te-ia-status').textContent = 'Pronto. Confira os emojis e as traduções antes de salvar.';
        } catch (e) {
          $('te-ia-status').textContent = '';
          throw e;
        }
      });
    });
  }
</script>
````

### Arquivo: `ProfProgresso.html`

Aba Progresso. (151 linhas)

````html
<!-- Progresso -->
<section id="aba-progresso" class="pilha" hidden>
  <style>
    .mapa td.cel { text-align: center; font-weight: 700; font-size: .85rem; cursor: pointer; min-width: 74px; }
    .mapa td.cel:hover { outline: 2px solid var(--primaria); outline-offset: -2px; }
    .mapa th.tema-col { min-width: 74px; text-align: center; font-size: .72rem; line-height: 1.2; }
    .n0 { background: #f8f9fa; color: #adb5bd; }
    .n1 { background: #ffe3e3; color: #c92a2a; }
    .n2 { background: #fff3bf; color: #a05a00; }
    .n3 { background: #d3f9d8; color: #2b8a3e; }
    .n4 { background: #b2f2bb; color: #1b5e20; }
    .legenda { display: flex; gap: 8px; flex-wrap: wrap; font-size: .8rem; }
    .legenda span { padding: 2px 8px; border-radius: 6px; }
    .dificil { display: grid; grid-template-columns: 42px 1fr 120px 48px; gap: 10px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--borda); }
    .dificil .fg { font-size: 1.6rem; text-align: center; }
    .dificil .barra { margin: 0; height: 10px; }
    .resumo-turma { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
    .resumo-turma .num { font-size: 1.6rem; font-weight: 700; }
  </style>

  <div class="linha">
    <select id="pg-turma"></select>
    <button class="btn" id="pg-atualizar">↻ Atualizar</button>
    <span class="espaco"></span>
    <span class="suave pequeno">Domínio = quanto o aluno acerta as palavras do tema nos jogos (0 a 100%).</span>
  </div>

  <div class="resumo-turma" id="pg-resumo"></div>

  <div class="cartao">
    <div class="linha" style="margin-bottom:10px">
      <h3 style="margin:0">Domínio por tema</h3><span class="espaco"></span>
      <div class="legenda"><span class="n0">não jogou</span><span class="n1">0–39%</span><span class="n2">40–69%</span><span class="n3">70–89%</span><span class="n4">90–100%</span></div>
    </div>
    <p class="suave pequeno" style="margin-top:0">Clique numa célula para ver as palavras e as estrelas do aluno naquele tema.</p>
    <div class="tabela-rolagem"><table class="mapa" id="pg-tabela"></table></div>
  </div>

  <div class="cartao">
    <div class="linha"><h3 style="margin:0">Palavras com mais dificuldade</h3><span class="espaco"></span><select id="pg-tema-dificil"></select></div>
    <p class="suave pequeno">Domínio médio de cada palavra entre os alunos que já jogaram o tema. As primeiras da lista são boas para retomar em aula.</p>
    <div id="pg-dificeis"></div>
  </div>

  <dialog id="modal-detalhe" style="width:min(640px, calc(100vw - 32px))">
    <div class="linha" style="margin-bottom:10px"><h2 style="margin:0" id="det-titulo"></h2><span class="espaco"></span>
      <button class="btn" type="button" data-fechar>Fechar</button></div>
    <div id="det-conteudo" style="max-height:70vh;overflow-y:auto"></div>
  </dialog>
</section>

<script>
  let progressoTurma = null;

  function nivelCor(v) { return v == null ? 'n0' : v >= 90 ? 'n4' : v >= 70 ? 'n3' : v >= 40 ? 'n2' : 'n1'; }
  function tempoTexto(seg) {
    seg = Number(seg) || 0;
    if (seg < 60) return seg + ' s';
    const min = Math.round(seg / 60);
    return min < 60 ? min + ' min' : Math.floor(min / 60) + ' h ' + (min % 60) + ' min';
  }

  async function carregarProgresso() {
    const turma = $('pg-turma').value;
    if (!turma) return;
    $('pg-tabela').innerHTML = '<tr><td class="carregando">Carregando…</td></tr>';
    progressoTurma = await chamar('profProgressoTurma', turma);
    renderProgresso();
  }

  function renderProgresso() {
    const d = progressoTurma;
    const temas = d.temas.filter((t) => t.status === 'liberado' || d.jogadoresPorTema[t.id]);
    const alunos = d.alunos.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    const jogaram = alunos.filter((a) => a.jogadas > 0);
    const medias = jogaram.map((a) => {
      const v = temas.map((t) => (a.porTema[t.id] ? a.porTema[t.id].dominio : null)).filter((x) => x != null);
      return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;
    });
    $('pg-resumo').innerHTML = `
      <div class="cartao"><div class="suave pequeno">Alunos que já jogaram</div><div class="num">${jogaram.length}<span class="suave" style="font-size:1rem"> / ${alunos.length}</span></div></div>
      <div class="cartao"><div class="suave pequeno">Partidas</div><div class="num">${alunos.reduce((s, a) => s + a.jogadas, 0)}</div></div>
      <div class="cartao"><div class="suave pequeno">Tempo total jogando</div><div class="num" style="font-size:1.3rem">${tempoTexto(alunos.reduce((s, a) => s + a.segundos, 0))}</div></div>
      <div class="cartao"><div class="suave pequeno">Domínio médio (quem jogou)</div><div class="num">${medias.length ? Math.round(medias.reduce((s, x) => s + x, 0) / medias.length) + '%' : '—'}</div></div>`;

    $('pg-tabela').innerHTML = alunos.length ? `
      <thead><tr><th></th><th>Aluno</th><th>Nível</th><th>⭐</th><th>Partidas</th><th>Tempo</th><th>Última vez</th>
        ${temas.map((t) => `<th class="tema-col" title="${esc(t.titulo_pt)}">${esc(t.titulo)}${t.status === 'liberado' ? '' : '<br><span class="suave">(oculto)</span>'}</th>`).join('')}</tr></thead>
      <tbody>${alunos.map((a) => `<tr>
        <td class="avatar">${esc(a.avatar)}</td>
        <td>${esc(a.nome)}</td>
        <td>${a.nivel ? `<span class="selo ${esc(a.nivel)}" title="Média nas avaliações: ${a.media}%">${esc(a.nivel)}</span>` : '<span class="suave pequeno">—</span>'}</td>
        <td><strong>${a.totalEstrelas}</strong></td>
        <td>${a.jogadas}</td>
        <td class="suave pequeno">${a.segundos ? tempoTexto(a.segundos) : ''}</td>
        <td class="suave pequeno">${esc(a.ultimo)}</td>
        ${temas.map((t) => {
          const p = a.porTema[t.id];
          return `<td class="cel ${nivelCor(p ? p.dominio : null)}" data-email="${esc(a.email)}" data-tema="${esc(t.id)}"
            title="${p ? p.jogadas + ' partidas · ' + p.estrelas + ' estrelas' : 'ainda não jogou'}">${p ? p.dominio + '%' : '—'}</td>`;
        }).join('')}
      </tr>`).join('')}</tbody>`
      : '<tr><td class="vazio">Nenhum aluno cadastrado nesta turma.</td></tr>';

    const anterior = $('pg-tema-dificil').value;
    const comDados = temas.filter((t) => d.dificeis[t.id]);
    $('pg-tema-dificil').innerHTML = comDados.map((t) => `<option value="${esc(t.id)}">${esc(t.titulo)} (${d.jogadoresPorTema[t.id]} alunos)</option>`).join('');
    if (comDados.some((t) => t.id === anterior)) $('pg-tema-dificil').value = anterior;
    renderDificeis();
  }

  function renderDificeis() {
    const lista = progressoTurma && progressoTurma.dificeis[$('pg-tema-dificil').value];
    $('pg-dificeis').innerHTML = lista ? lista.map((w) => `
      <div class="dificil">
        <span class="fg">${esc(w.figura) || '🔤'}</span>
        <span><strong>${esc(w.en)}</strong> <span class="suave pequeno">${esc(w.pt)}${w.alunos ? ' · ' + w.alunos + ' alunos' : ''}</span></span>
        ${w.media == null ? '<span class="suave pequeno">ainda não sorteada</span><span></span>' : `
        <div class="barra"><i style="width:${w.media}%;background:${w.media < 40 ? 'var(--perigo)' : w.media < 70 ? '#f08c00' : 'var(--ok)'}"></i></div>
        <span class="suave">${w.media}%</span>`}
      </div>`).join('') : '<p class="vazio">Ainda ninguém desta turma jogou os temas.</p>';
  }

  async function abrirDetalhe(email, temaId) {
    const a = progressoTurma.alunos.find((x) => x.email === email);
    const d = await chamar('profProgressoAlunoTema', email, temaId);
    $('det-titulo').textContent = `${a.avatar} ${a.nome} · ${d.tema.titulo}`;
    $('det-conteudo').innerHTML = `
      <p>${d.jogos.map((j) => `${esc(j.nome)}: ${'⭐'.repeat(Number(d.estrelas[j.id] || 0)) || '<span class="suave">não jogou</span>'}`).join(' &nbsp;·&nbsp; ')}</p>
      ${d.palavras.slice().sort((x, y) => x.pontos - y.pontos).map((w) => `
        <div class="dificil">
          <span class="fg">${esc(w.figura) || '🔤'}</span>
          <span><strong>${esc(w.en)}</strong> <span class="suave pequeno">${esc(w.pt)}</span></span>
          <div class="barra"><i style="width:${w.pontos}%;background:${w.pontos < 40 ? 'var(--perigo)' : w.pontos < 70 ? '#f08c00' : 'var(--ok)'}"></i></div>
          <span class="suave">${w.pontos}%</span>
        </div>`).join('')}
      <p class="suave pequeno">Cada acerto de primeira soma pontos (Listen & Click e Match it! +25, Spell it! +30, Memory +10); cada erro desconta. 100% = palavra dominada.</p>`;
    $('modal-detalhe').showModal();
  }

  function configurarProgresso() {
    $('pg-turma').innerHTML = '<option value="">Escolha a turma…</option>' + opcoesTurma(false);
    $('pg-turma').addEventListener('change', carregarProgresso);
    $('pg-atualizar').addEventListener('click', (ev) => comBotao(ev.target, carregarProgresso));
    $('pg-tema-dificil').addEventListener('change', renderDificeis);
    $('pg-tabela').addEventListener('click', (ev) => {
      const c = ev.target.closest('td.cel');
      if (c) abrirDetalhe(c.dataset.email, c.dataset.tema);
    });
  }
</script>
````

### Arquivo: `ProfAvaliacoes.html`

Aba Avaliações (inclui os estilos de impressão). (432 linhas)

````html
<!-- Avaliações -->
<section id="aba-avaliacoes" hidden>
  <style>
    .selo.rascunho { background: #f1f3f5; color: #495057; }
    .selo.aberto { background: #d3f9d8; color: #2b8a3e; }
    .selo.encerrado { background: #e9ecef; color: #868e96; }
    .selo.Iniciante { background: #ffe3e3; color: #c92a2a; }
    .selo.Básico { background: #fff3bf; color: #a05a00; }
    .selo.Intermediário { background: #d0ebff; color: #1864ab; }
    .selo.Avançado { background: #d3f9d8; color: #2b8a3e; }
    .temas-check { display: grid; gap: 6px; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }
    .temas-check label { font-weight: 400; display: flex; gap: 8px; align-items: center; border: 1px solid var(--borda); border-radius: 8px; padding: 6px 10px; cursor: pointer; margin: 0; }
    .temas-check input { width: auto; }
    .questao-k { border: 1px solid var(--borda); border-radius: var(--raio); padding: 14px; background: #fff; }
    .questao-k .topo-q { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
    .questao-k .enunciado-k { font-size: 1.05rem; margin-bottom: 10px; }
    .questao-k .enunciado-k .grande { font-size: 2.4rem; vertical-align: middle; }
    .alts-k { display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    @media (max-width: 640px) { .alts-k { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .alt-k { border: 2px solid var(--borda); border-radius: 10px; padding: 8px; text-align: center; }
    .alt-k .l { font-size: .75rem; font-weight: 700; color: var(--suave); }
    .alt-k .v { font-size: 2rem; line-height: 1.2; }
    .alt-k .v.txt { font-size: 1rem; font-weight: 700; }
    .alt-k.certa { border-color: var(--ok); background: #ebfbee; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .chips .btn.ativa { background: var(--primaria); color: #fff; border-color: var(--primaria); }
    .barra-q { display: grid; grid-template-columns: 34px 90px 1fr 140px 50px; gap: 10px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--borda); font-size: .9rem; }
    .barra-q .barra { margin: 0; height: 10px; }
    td input.lanc { width: 150px; font-family: monospace; text-transform: uppercase; }

    #impressao { display: none; }
    @media print {
      body.imprimindo > *:not(#impressao) { display: none !important; }
      body.imprimindo { background: #fff; }
      #impressao { display: block; font: 13pt/1.4 Arial, sans-serif; color: #000; }
      #impressao .cab { border: 2px solid #000; border-radius: 8px; padding: 8px 12px; margin-bottom: 14px; }
      #impressao .cab div { margin: 5px 0; }
      #impressao .q { margin: 0 0 16px; break-inside: avoid; }
      #impressao .q .cmd { font-weight: 700; margin-bottom: 8px; }
      #impressao .q .destaque { font-size: 22pt; font-weight: 700; }
      #impressao .q .destaque.fig { font-size: 40pt; }
      #impressao .ops { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
      #impressao .op { border: 2px solid #000; border-radius: 10px; padding: 6px; text-align: center; min-height: 80px; }
      #impressao .op .let { font-weight: 700; text-align: left; }
      #impressao .op .v { font-size: 34pt; }
      #impressao .op .v.txt { font-size: 15pt; font-weight: 700; padding-top: 12px; }
      #impressao table { border-collapse: collapse; }
      #impressao td, #impressao th { border: 1px solid #000; padding: 4px 10px; text-align: center; }
      #impressao .quebra { break-before: page; }
    }
  </style>

  <!-- Lista -->
  <div id="av-lista" class="pilha">
    <div class="linha">
      <select id="av-filtro-serie"></select>
      <span class="espaco"></span>
      <button class="btn" id="av-novo-diag">+ Diagnóstico</button>
      <button class="btn primario" id="av-novo-mensal">+ Quiz mensal</button>
    </div>
    <p class="suave pequeno" style="margin:0">As questões são montadas sozinhas a partir das palavras dos temas: <strong>👂 ouvir</strong> e escolher a figura, <strong>📖 ler</strong> e escolher a figura, <strong>🖼️ ver a figura</strong> e escolher a palavra.
      O nível do aluno é a média das avaliações (os jogos não entram).</p>
    <div class="cartao tabela-rolagem">
      <table>
        <thead><tr><th>Avaliação</th><th>Série</th><th>Tipo</th><th>Mês</th><th>Status</th><th>Respostas</th><th></th></tr></thead>
        <tbody id="av-tabela"></tbody>
      </table>
    </div>
  </div>

  <!-- Editor -->
  <div id="av-editor" class="pilha" hidden>
    <div class="linha">
      <button class="btn" data-av-voltar>← Voltar</button>
      <h2 style="margin:0" id="ave-titulo-tela">Avaliação</h2>
      <span class="espaco"></span>
      <button class="btn" id="ave-imprimir">Imprimir prova</button>
      <button class="btn primario" id="ave-salvar">Salvar</button>
    </div>
    <p id="ave-bloqueado" class="cartao pequeno" style="color:var(--perigo)" hidden>Esta avaliação já tem respostas: as questões e a série não podem mais mudar.</p>
    <div class="cartao">
      <div class="grade-2">
        <div class="campo"><label for="ave-titulo">Título</label><input id="ave-titulo"></div>
        <div class="grade-2">
          <div class="campo"><label for="ave-tipo">Tipo</label>
            <select id="ave-tipo"><option value="diagnostico">Diagnóstico</option><option value="mensal">Quiz mensal</option></select></div>
          <div class="campo"><label for="ave-serie">Série</label><select id="ave-serie"></select></div>
        </div>
      </div>
      <div class="grade-2" style="margin-top:14px">
        <div class="campo"><label for="ave-mes">Mês de referência</label><input id="ave-mes" type="month"></div>
        <div class="campo"><label for="ave-qtd">Quantidade de questões</label><input id="ave-qtd" type="number" min="3" max="20" value="10"></div>
      </div>
      <div class="campo" style="margin-top:14px">
        <label>Temas avaliados</label>
        <div class="temas-check" id="ave-temas"></div>
      </div>
      <div class="linha" style="margin-top:12px">
        <button class="btn primario" id="ave-montar">🎲 Montar questões</button>
        <span class="suave pequeno">Não gostou de alguma? Use 🔄 para trocar só aquela questão.</span>
      </div>
    </div>
    <div class="linha"><h3 style="margin:0">Questões <span class="suave" id="ave-contagem"></span></h3></div>
    <div id="ave-questoes" class="pilha"></div>
  </div>

  <!-- Resultados -->
  <div id="av-resultados" class="pilha" hidden>
    <div class="linha">
      <button class="btn" data-av-voltar>← Voltar</button>
      <h2 style="margin:0" id="avr-titulo"></h2>
      <span class="espaco"></span>
      <button class="btn" id="avr-imprimir">Imprimir prova</button>
      <button class="btn" id="avr-gabarito">Imprimir gabarito</button>
    </div>
    <div class="chips" id="avr-turmas"></div>
    <div class="cartao">
      <p class="suave pequeno" style="margin-top:0">Para provas impressas, digite as letras marcadas pela criança em ordem (ex.: <code>ABDC…</code>; use <code>-</code> para questão em branco) ou só o número de acertos. Com as letras, o sistema mostra o acerto por questão.</p>
      <div class="tabela-rolagem">
        <table>
          <thead><tr><th></th><th>Nome</th><th>Situação</th><th>Acertos</th><th>%</th><th>Lançar impresso</th><th></th></tr></thead>
          <tbody id="avr-tabela"></tbody>
        </table>
      </div>
      <div class="rodape-modal"><button class="btn primario" id="avr-salvar">Salvar lançamentos</button></div>
    </div>
    <div class="cartao">
      <h3>Acerto por questão <span class="suave pequeno">(todas as turmas da série)</span></h3>
      <div id="avr-questoes"></div>
    </div>
  </div>
</section>

<script>
  const TIPOS_AV = { diagnostico: 'Diagnóstico', mensal: 'Quiz mensal' };
  const STATUS_AV = { rascunho: 'Rascunho', aberto: 'Aberto', encerrado: 'Encerrado' };
  const TIPOS_QUESTAO = {
    ouvir: { icone: '👂', nome: 'Ouvir', cmd: 'Ouça a palavra e marque a figura.' },
    ler: { icone: '📖', nome: 'Ler', cmd: 'Leia a palavra e marque a figura.' },
    figura: { icone: '🖼️', nome: 'Figura', cmd: 'Olhe a figura e marque a palavra em inglês.' },
  };
  const LETRAS_AV = ['A', 'B', 'C', 'D'];
  let avEdicao = null, avResultados = null, avTurma = '';

  function telaAvaliacoes(qual) {
    ['av-lista', 'av-editor', 'av-resultados'].forEach((id) => ($(id).hidden = id !== qual));
    window.scrollTo(0, 0);
  }

  /** Comando da questão. Na questão "figura" de uma palavra sem emoji, a criança lê o português. */
  function comandoQ(x) {
    return x.tipo === 'figura' && !x.palavra.figura ? 'Leia em português e marque a palavra em inglês.' : TIPOS_QUESTAO[x.tipo].cmd;
  }

  function rotuloAlt(tipo, a) { return tipo === 'figura' ? a.en : a.figura || a.pt; }
  function altEhTexto(tipo, a) { return tipo === 'figura' || !a.figura; }

  // ---------- Lista ----------
  function renderAvaliacoes() {
    const serie = $('av-filtro-serie').value;
    const lista = estado.avaliacoes.filter((q) => !serie || q.serie === serie);
    $('av-tabela').innerHTML = lista.length ? lista.map((q) => {
      const acao = q.status === 'rascunho' ? ['aberto', 'Liberar para alunos'] : q.status === 'aberto' ? ['encerrado', 'Encerrar'] : ['aberto', 'Reabrir'];
      return `<tr>
        <td><strong>${esc(q.titulo)}</strong><div class="suave pequeno">${q.questoes.length} questões</div></td>
        <td>${esc(q.serie)}</td>
        <td>${TIPOS_AV[q.tipo] || esc(q.tipo)}</td>
        <td>${esc(q.mes)}</td>
        <td><span class="selo ${esc(q.status)}">${STATUS_AV[q.status]}</span></td>
        <td>${q.respostas}</td>
        <td class="acoes">
          <button class="btn mini" data-av="status" data-id="${esc(q.id)}" data-novo="${acao[0]}">${acao[1]}</button>
          <button class="btn mini" data-av="resultados" data-id="${esc(q.id)}">Resultados</button>
          <button class="btn mini" data-av="editar" data-id="${esc(q.id)}">Editar</button>
          <button class="btn mini perigo" data-av="excluir" data-id="${esc(q.id)}">Excluir</button>
        </td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="vazio">Nenhuma avaliação ainda. Comece pelo diagnóstico de cada série.</td></tr>';
  }

  // ---------- Editor ----------
  function renderTemasEditor(marcados) {
    const serie = $('ave-serie').value;
    const temas = estado.temas.filter((t) => t.serie === serie);
    $('ave-temas').innerHTML = temas.map((t) => `
      <label><input type="checkbox" value="${esc(t.id)}" ${marcados.includes(t.id) ? 'checked' : ''}>
        <span>${esc(t.titulo)} <span class="suave pequeno">· ${t.trimestre}º tri · ${t.palavras.length} pal.${t.status === 'oculto' ? ' · oculto' : ''}</span></span></label>`).join('')
      || '<p class="suave pequeno">Nenhum tema nesta série.</p>';
  }
  function temasMarcados() { return [...$('ave-temas').querySelectorAll('input:checked')].map((i) => i.value); }

  async function novaAvaliacao(tipo) {
    const serie = $('av-filtro-serie').value || estado.resumo.series[0];
    const s = await chamar('profSugestaoAvaliacao', tipo, serie);
    abrirEditorAv({ id: '', tipo: s.tipo, serie: s.serie, mes: s.mes, titulo: s.titulo, temas: s.temas, questoes: [], respostas: 0 });
  }

  function abrirEditorAv(q) {
    avEdicao = { id: q.id, respostas: q.respostas || 0, questoes: q.questoes.map((x) => JSON.parse(JSON.stringify(x))) };
    $('ave-titulo-tela').textContent = q.id ? 'Editar avaliação' : q.tipo === 'diagnostico' ? 'Novo diagnóstico' : 'Novo quiz mensal';
    $('ave-titulo').value = q.titulo;
    $('ave-tipo').value = q.tipo;
    $('ave-serie').value = q.serie;
    $('ave-mes').value = q.mes;
    $('ave-qtd').value = q.questoes.length || 10;
    renderTemasEditor(q.temas || []);
    renderQuestoesAv();
    telaAvaliacoes('av-editor');
  }

  function renderQuestoesAv() {
    const ed = avEdicao, bloqueado = ed.respostas > 0;
    $('ave-bloqueado').hidden = !bloqueado;
    ['ave-serie', 'ave-montar', 'ave-tipo'].forEach((id) => ($(id).disabled = bloqueado));
    $('ave-contagem').textContent = `(${ed.questoes.length})`;
    $('ave-questoes').innerHTML = ed.questoes.length ? ed.questoes.map((q, i) => {
      const T = TIPOS_QUESTAO[q.tipo];
      const enunciado = q.tipo === 'ouvir'
        ? `${T.cmd} <button class="btn mini" data-ouvir-q="${i}">🔊 ${esc(q.palavra.en)}</button>`
        : q.tipo === 'ler' ? `${T.cmd} <strong style="font-size:1.4rem">${esc(q.palavra.en)}</strong>`
        : `${comandoQ(q)} <span class="grande">${esc(q.palavra.figura || q.palavra.pt)}</span>`;
      return `<div class="questao-k" data-q="${i}">
        <div class="topo-q"><strong>${i + 1}.</strong>
          <select data-tipo="${i}" style="width:auto" ${bloqueado ? 'disabled' : ''}>${Object.keys(TIPOS_QUESTAO).map((k) =>
            `<option value="${k}" ${k === q.tipo ? 'selected' : ''}>${TIPOS_QUESTAO[k].icone} ${TIPOS_QUESTAO[k].nome}</option>`).join('')}</select>
          <span class="suave pequeno">${esc(q.tema)}</span><span class="espaco"></span>
          <button class="btn mini" data-trocar="${i}" ${bloqueado ? 'disabled' : ''}>🔄 Trocar</button>
          <button class="btn mini perigo" data-remover-q="${i}" ${bloqueado ? 'disabled' : ''}>✕</button></div>
        <div class="enunciado-k">${enunciado}</div>
        <div class="alts-k">${q.alternativas.map((a, j) => `
          <div class="alt-k ${j === q.correta ? 'certa' : ''}"><div class="l">${LETRAS_AV[j]}${j === q.correta ? ' ✓' : ''}</div>
            <div class="v ${altEhTexto(q.tipo, a) ? 'txt' : ''}">${esc(rotuloAlt(q.tipo, a))}</div></div>`).join('')}</div>
      </div>`;
    }).join('') : '<div class="cartao vazio">Escolha os temas e clique em "🎲 Montar questões".</div>';
  }

  function dadosAv() {
    return {
      id: avEdicao.id, titulo: $('ave-titulo').value, tipo: $('ave-tipo').value, serie: $('ave-serie').value,
      mes: $('ave-mes').value, temas: temasMarcados(), questoes: avEdicao.questoes,
    };
  }

  // ---------- Resultados ----------
  async function abrirResultadosAv(id) {
    avResultados = await chamar('profResultadosAvaliacao', id);
    if (!avResultados.turmas.includes(avTurma)) {
      avTurma = avResultados.turmas.find((t) => avResultados.alunos.some((a) => a.turma === t)) || avResultados.turmas[0];
    }
    renderResultadosAv();
    telaAvaliacoes('av-resultados');
  }

  function renderResultadosAv() {
    const r = avResultados;
    $('avr-titulo').textContent = `${r.avaliacao.titulo} · ${r.avaliacao.serie} ano`;
    $('avr-turmas').innerHTML = r.turmas.map((t) => {
      const al = r.alunos.filter((a) => a.turma === t);
      return `<button class="btn ${t === avTurma ? 'ativa' : ''}" data-turma="${esc(t)}">${esc(t)} <span class="pequeno">${al.filter((a) => a.resposta).length}/${al.length}</span></button>`;
    }).join('');
    const alunos = r.alunos.filter((a) => a.turma === avTurma).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    $('avr-tabela').innerHTML = alunos.length ? alunos.map((a) => {
      const x = a.resposta;
      return `<tr>
        <td class="avatar">${esc(a.avatar)}</td>
        <td>${esc(a.nome)}</td>
        <td>${x ? `<span class="selo ${x.origem === 'online' ? 'aberto' : 'rascunho'}">${x.origem === 'online' ? 'Online' : 'Impresso'}</span>` : '<span class="suave pequeno">pendente</span>'}</td>
        <td>${x ? x.pontuacao + '/' + x.total : ''}</td>
        <td>${x ? x.percentual + '%' : ''}</td>
        <td><input class="lanc" data-email="${esc(a.email)}" data-nome="${esc(a.nome)}" placeholder="${x && x.marcadas ? esc(x.marcadas) : 'letras ou nº'}"></td>
        <td class="acoes">${x ? `<button class="btn mini perigo" data-apagar="${esc(a.email)}">Apagar</button>` : ''}</td>
      </tr>`;
    }).join('') : '<tr><td colspan="7" class="vazio">Nenhum aluno cadastrado nesta turma.</td></tr>';
    $('avr-questoes').innerHTML = r.porQuestao.map((q) => {
      const pct = q.respostas ? Math.round((q.acertos / q.respostas) * 100) : null;
      return `<div class="barra-q"><strong>${q.numero}</strong>
        <span class="suave pequeno">${TIPOS_QUESTAO[q.tipo].icone} ${TIPOS_QUESTAO[q.tipo].nome}</span>
        <span>${esc(q.palavra.figura)} <strong>${esc(q.palavra.en)}</strong> <span class="suave pequeno">${esc(q.tema)}</span></span>
        <div class="barra"><i style="width:${pct || 0}%;${pct !== null && pct < 50 ? 'background:var(--perigo)' : ''}"></i></div>
        <span class="suave">${pct === null ? '—' : pct + '%'}</span></div>`;
    }).join('') + '<p class="suave pequeno">Considera as respostas online e as impressas lançadas com letras.</p>';
  }

  // ---------- Impressão ----------
  function imprimirAv(q, gabarito) {
    const titulo = esc(q.titulo || 'Avaliação');
    let html;
    if (gabarito) {
      const ouvir = q.questoes.map((x, i) => (x.tipo === 'ouvir' ? `<li>Questão ${i + 1}: <strong>${esc(x.palavra.en)}</strong></li>` : '')).join('');
      html = `<h2>Gabarito – ${titulo} (${esc(q.serie)} ano)</h2>
        <table><tr><th>Questão</th>${q.questoes.map((_, i) => `<th>${i + 1}</th>`).join('')}</tr>
        <tr><th>Resposta</th>${q.questoes.map((x) => `<td><strong>${LETRAS_AV[x.correta]}</strong></td>`).join('')}</tr></table>
        <p>Sequência para lançar no sistema: <strong style="font-family:monospace;font-size:14pt">${q.questoes.map((x) => LETRAS_AV[x.correta]).join('')}</strong></p>
        ${ouvir ? `<h3>👂 Palavras para o professor falar em voz alta (2 vezes cada)</h3><ul>${ouvir}</ul>` : ''}`;
    } else {
      html = `<div class="cab"><div><strong>${titulo}</strong> – Língua Inglesa – ${esc(q.serie)} ano</div>
          <div>Nome: ________________________________________ Turma: ______ Data: ___/___/______</div></div>
        <p><em>Marque um X na resposta certa de cada questão.</em></p>
        ${q.questoes.map((x, i) => {
          const destaque = x.tipo === 'ouvir' ? '<div class="destaque">👂 🔊</div>'
            : x.tipo === 'ler' ? `<div class="destaque">${esc(x.palavra.en)}</div>`
            : `<div class="destaque ${x.palavra.figura ? 'fig' : ''}">${esc(x.palavra.figura || x.palavra.pt)}</div>`;
          return `<div class="q"><div class="cmd">${i + 1}. ${x.tipo === 'ouvir' ? 'Ouça a palavra que o professor vai falar e marque a figura.' : comandoQ(x)}</div>${destaque}
            <div class="ops">${x.alternativas.map((a, j) => `<div class="op"><div class="let">( ) ${LETRAS_AV[j]}</div>
              <div class="v ${altEhTexto(x.tipo, a) ? 'txt' : ''}">${esc(rotuloAlt(x.tipo, a))}</div></div>`).join('')}</div></div>`;
        }).join('')}`;
    }
    $('impressao').innerHTML = html;
    document.body.classList.add('imprimindo');
    setTimeout(() => { window.print(); document.body.classList.remove('imprimindo'); }, 80);
  }

  function configurarAvaliacoes() {
    $('av-filtro-serie').innerHTML = opcoesSerie(true);
    $('ave-serie').innerHTML = opcoesSerie(false);
    $('av-filtro-serie').addEventListener('change', renderAvaliacoes);
    $('av-novo-diag').addEventListener('click', (ev) => comBotao(ev.target, () => novaAvaliacao('diagnostico')));
    $('av-novo-mensal').addEventListener('click', (ev) => comBotao(ev.target, () => novaAvaliacao('mensal')));
    document.querySelectorAll('[data-av-voltar]').forEach((b) => b.addEventListener('click', async () => {
      telaAvaliacoes('av-lista');
      estado.avaliacoes = await chamar('profListarAvaliacoes');
      renderAvaliacoes();
    }));

    $('av-tabela').addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-av]');
      if (!b) return;
      const q = estado.avaliacoes.find((x) => x.id === b.dataset.id);
      if (b.dataset.av === 'editar') abrirEditorAv(q);
      if (b.dataset.av === 'resultados') comBotao(b, () => abrirResultadosAv(q.id));
      if (b.dataset.av === 'status') {
        if (b.dataset.novo === 'aberto' && !confirm(`Liberar "${q.titulo}" para todos os alunos do ${q.serie} ano?`)) return;
        comBotao(b, async () => {
          estado.avaliacoes = await chamar('profAlterarStatusAvaliacao', q.id, b.dataset.novo);
          renderAvaliacoes();
          avisar('Status atualizado.');
        });
      }
      if (b.dataset.av === 'excluir') {
        const aviso = q.respostas ? `\n\nATENÇÃO: as ${q.respostas} respostas também serão apagadas e os níveis recalculados.` : '';
        if (!confirm(`Excluir "${q.titulo}"?${aviso}`)) return;
        comBotao(b, async () => {
          estado.avaliacoes = await chamar('profExcluirAvaliacao', q.id);
          renderAvaliacoes();
          estado.alunos = await chamar('profListarAlunos');
          renderAlunos();
          avisar('Avaliação excluída.');
        });
      }
    });

    $('ave-serie').addEventListener('change', () => { renderTemasEditor([]); });
    $('ave-montar').addEventListener('click', (ev) => {
      if (avEdicao.questoes.length && !confirm('Montar novas questões no lugar das atuais?')) return;
      comBotao(ev.target, async () => {
        avEdicao.questoes = await chamar('profGerarQuestoes', { serie: $('ave-serie').value, temas: temasMarcados(), quantidade: $('ave-qtd').value });
        renderQuestoesAv();
        avisar('Questões montadas. Revise e clique em Salvar.');
      });
    });

    $('ave-questoes').addEventListener('click', async (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.dataset.ouvirQ !== undefined) { await Fala.iniciar(); Fala.falar(avEdicao.questoes[Number(b.dataset.ouvirQ)].palavra.en); }
      if (b.dataset.removerQ !== undefined) { avEdicao.questoes.splice(Number(b.dataset.removerQ), 1); renderQuestoesAv(); }
      if (b.dataset.trocar !== undefined) {
        const i = Number(b.dataset.trocar), atual = avEdicao.questoes[i];
        comBotao(b, async () => {
          const [nova] = await chamar('profGerarQuestoes', {
            serie: $('ave-serie').value, temas: temasMarcados(), quantidade: 1, evitar: avEdicao.questoes.map((q) => q.palavra.en), tipo: atual.tipo,
          });
          avEdicao.questoes[i] = nova;
          renderQuestoesAv();
        });
      }
    });
    $('ave-questoes').addEventListener('change', (ev) => {
      const s = ev.target.closest('[data-tipo]');
      if (!s) return;
      const q = avEdicao.questoes[Number(s.dataset.tipo)];
      const rotulos = q.alternativas.map((a) => rotuloAlt(s.value, a).toLowerCase());
      if (new Set(rotulos).size < rotulos.length) {
        avisar('Neste tipo, duas alternativas ficariam iguais. Use 🔄 Trocar para outra palavra.', true);
        s.value = q.tipo;
        return;
      }
      q.tipo = s.value;
      renderQuestoesAv();
    });

    $('ave-salvar').addEventListener('click', (ev) => comBotao(ev.target, async () => {
      const r = await chamar('profSalvarAvaliacao', dadosAv());
      avEdicao.id = r.id;
      estado.avaliacoes = r.avaliacoes;
      avisar('Avaliação salva. Para os alunos verem, clique em "Liberar para alunos" na lista.');
    }));
    $('ave-imprimir').addEventListener('click', () => imprimirAv(dadosAv(), false));

    $('avr-turmas').addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-turma]');
      if (!b) return;
      avTurma = b.dataset.turma;
      renderResultadosAv();
    });
    $('avr-salvar').addEventListener('click', (ev) => {
      const lancamentos = [...document.querySelectorAll('#avr-tabela input.lanc')].filter((i) => i.value.trim())
        .map((i) => ({ email: i.dataset.email, nome: i.dataset.nome, valor: i.value }));
      if (!lancamentos.length) { avisar('Nada para salvar: preencha a coluna "Lançar impresso".', true); return; }
      comBotao(ev.target, async () => {
        avResultados = await chamar('profLancarRespostas', avResultados.avaliacao.id, lancamentos);
        renderResultadosAv();
        estado.alunos = await chamar('profListarAlunos');
        renderAlunos();
        avisar(lancamentos.length + ' lançamento(s) salvo(s).');
      });
    });
    $('avr-tabela').addEventListener('click', (ev) => {
      const email = ev.target.dataset.apagar;
      if (!email) return;
      if (!confirm('Apagar a resposta desta criança? Ela poderá responder de novo online, ou você poderá lançar outra vez.')) return;
      comBotao(ev.target, async () => {
        avResultados = await chamar('profExcluirResposta', avResultados.avaliacao.id, email);
        renderResultadosAv();
        estado.alunos = await chamar('profListarAlunos');
        renderAlunos();
      });
    });
    $('avr-imprimir').addEventListener('click', () => imprimirAv(avResultados.avaliacao, false));
    $('avr-gabarito').addEventListener('click', () => imprimirAv(avResultados.avaliacao, true));
  }
</script>
````

### Arquivo: `ProfEquipes.html`

Aba Equipes e placar. (306 linhas)

````html
<!-- Equipes -->
<section id="aba-equipes" hidden>
  <style>
    .equipes-grade { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .equipe-card h3 { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .equipe-card.excedida { border-color: var(--perigo); }
    .membro { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; padding: 6px 0; border-top: 1px solid var(--borda); font-size: .9rem; }
    .membro .nome { flex: 1 1 calc(100% - 34px); min-width: 0; font-weight: 600; }
    .membro select { width: auto; padding: 3px 6px; font-size: .8rem; margin-left: auto; }
    .composicao { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px; }
    .info-equipes { background: var(--primaria-clara); border-radius: 8px; padding: 10px 12px; }
    .placar-grande { background: linear-gradient(160deg, #fff4e6, #fff9db); border-radius: 18px; padding: 22px; }
    .placar-grande h2 { font-size: 1.8rem; text-align: center; }
    .linha-placar { display: grid; grid-template-columns: 56px 64px 1fr auto; gap: 14px; align-items: center; background: #fff; border-radius: 14px;
      padding: 10px 16px; margin-top: 10px; box-shadow: 0 3px 0 #ffd8a8; font-size: 1.3rem; }
    .linha-placar .pos { font-size: 1.8rem; font-weight: 800; text-align: center; }
    .linha-placar .em { font-size: 2.6rem; text-align: center; }
    .linha-placar .nm { font-weight: 800; }
    .linha-placar .bichos { font-size: 1.3rem; letter-spacing: 2px; }
    .linha-placar .pts { font-size: 1.8rem; font-weight: 800; white-space: nowrap; }
    .placar-grande .barra { height: 10px; margin-top: 4px; }
  </style>

  <!-- Visão geral -->
  <div id="eq-geral" class="pilha">
    <div class="linha">
      <h2 style="margin:0">Equipes do mês</h2>
      <input id="eq-mes" type="month" style="width:auto">
      <span class="espaco"></span>
      <span class="suave pequeno">As crianças veem a equipe mais recente da turma e o placar do mês.</span>
    </div>
    <div class="cartao tabela-rolagem">
      <table>
        <thead><tr><th>Turma</th><th>Alunos</th><th>Avaliados</th><th>Situação no mês</th><th></th></tr></thead>
        <tbody id="eq-tabela"></tbody>
      </table>
    </div>
  </div>

  <!-- Turma -->
  <div id="eq-turma" class="pilha" hidden>
    <div class="linha">
      <button class="btn" id="eq-voltar">← Voltar</button>
      <h2 style="margin:0" id="eq-titulo"></h2>
      <span class="espaco"></span>
      <button class="btn" id="eq-ver-placar">🏆 Placar</button>
      <button class="btn" id="eq-imprimir">Imprimir equipes</button>
    </div>
    <div class="info-equipes pequeno" id="eq-info"></div>
    <div class="linha">
      <button class="btn" id="eq-sugerir">✨ Gerar sugestão</button>
      <button class="btn" id="eq-manter">Manter equipes atuais neste mês</button>
      <span class="espaco"></span>
      <span class="suave pequeno" id="eq-estado"></span>
      <button class="btn primario" id="eq-aplicar">Aplicar equipes</button>
    </div>
    <div id="eq-equipes" class="equipes-grade"></div>
    <div class="cartao" id="eq-fora-box">
      <h3>Fora das equipes</h3>
      <p class="suave pequeno" style="margin-top:0">Use "Mover para…" para encaixar estes alunos (por exemplo, quem se cadastrou depois).</p>
      <div id="eq-fora"></div>
    </div>
  </div>

  <!-- Placar (para projetar) -->
  <div id="eq-placar" class="pilha" hidden>
    <div class="linha">
      <button class="btn" id="eq-placar-voltar">← Voltar</button>
      <span class="espaco"></span>
      <button class="btn" id="eq-placar-atualizar">↻ Atualizar</button>
      <button class="btn" id="eq-tela-cheia">⛶ Tela cheia</button>
    </div>
    <div class="placar-grande" id="eq-placar-conteudo"></div>
    <p class="suave pequeno">Pontos = média de estrelas por membro neste mês (cada membro soma a melhor nota de cada jogo em cada tema).
      Assim equipes menores não ficam em desvantagem. Passe o mouse nos pontos para ver o total. Os níveis não aparecem aqui.</p>
  </div>
</section>

<script>
  const eq = { turma: null, rascunho: [], alterado: false };
  const ABREV_N = { 'Iniciante': 'Ini', 'Básico': 'Bás', 'Intermediário': 'Int', 'Avançado': 'Av' };

  function mesHojeEq() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function telaEquipes(qual) {
    ['eq-geral', 'eq-turma', 'eq-placar'].forEach((id) => ($(id).hidden = id !== qual));
    window.scrollTo(0, 0);
  }
  function nomeEq(i) { const n = eq.turma.nomes[i % eq.turma.nomes.length]; return `${n.emoji} ${n.nome}`; }

  // ---------- Visão geral ----------
  async function carregarResumoEquipes() {
    $('eq-tabela').innerHTML = '<tr><td colspan="5" class="carregando">Carregando…</td></tr>';
    const resumo = await chamar('profEquipesResumo', $('eq-mes').value || mesHojeEq());
    $('eq-tabela').innerHTML = resumo.map((t) => {
      const situacao = t.definido
        ? `<span class="selo aberto">Definidas</span> <span class="suave pequeno">${esc(t.aplicado_em)}</span>`
        : t.ultimoMes ? `<span class="selo rascunho">Pendente</span> <span class="suave pequeno">em vigor: equipes de ${esc(t.ultimoMes)}</span>`
        : '<span class="selo encerrado">Sem equipes</span>';
      return `<tr><td><strong>${esc(t.turma)}</strong></td><td>${t.alunos}</td>
        <td>${t.avaliados}${t.alunos > t.avaliados ? ` <span class="suave pequeno">(${t.alunos - t.avaliados} sem avaliação)</span>` : ''}</td>
        <td>${situacao}</td>
        <td class="acoes"><button class="btn mini" data-abrir-turma="${esc(t.turma)}">Abrir</button>
          <button class="btn mini" data-placar-turma="${esc(t.turma)}">🏆 Placar</button></td></tr>`;
    }).join('');
  }

  // ---------- Turma ----------
  async function abrirTurmaEquipes(turma) {
    eq.turma = await chamar('profEquipesTurma', turma, $('eq-mes').value || mesHojeEq());
    carregarRascunhoEq();
    telaEquipes('eq-turma');
  }
  function carregarRascunhoEq() {
    eq.rascunho = eq.turma.equipes.map((g) => g.membros.slice());
    eq.alterado = false;
    renderTurmaEquipes();
  }
  function alunoEq(email) { return eq.turma.alunos.find((a) => a.email === email); }
  function mediaEq(emails) {
    const m = emails.map(alunoEq).filter((a) => a && a.media != null).map((a) => a.media);
    return m.length ? Math.round((m.reduce((s, x) => s + x, 0) / m.length) * 10) / 10 : null;
  }

  function renderTurmaEquipes() {
    const t = eq.turma;
    eq.rascunho = eq.rascunho.filter((g) => g.length);
    $('eq-titulo').textContent = `Equipes – ${t.turma} · ${t.mes}`;
    $('eq-info').innerHTML = t.definidoNoMes
      ? `Equipes <strong>definidas para ${esc(t.mes)}</strong>. Você pode gerar outra sugestão ou ajustar e aplicar de novo.`
      : t.mesVigente ? `Ainda não há decisão para ${esc(t.mes)}. Em vigor: <strong>equipes de ${esc(t.mesVigente)}</strong>. Mantenha ou gere novas.`
      : 'Esta turma ainda não tem equipes. Clique em <strong>Gerar sugestão</strong>. Quem ainda não fez avaliação também entra (nas equipes menores).';
    $('eq-manter').hidden = !t.mesVigente || t.definidoNoMes;
    $('eq-estado').textContent = eq.alterado ? 'Rascunho não aplicado' : '';

    const opcoes = (atual) => `<select data-mover><option value="">Mover para…</option>${eq.rascunho.map((_, i) =>
      i === atual ? '' : `<option value="${i}">${nomeEq(i)}</option>`).join('')}<option value="novo">Nova equipe</option>${atual === -1 ? '' : '<option value="fora">Fora das equipes</option>'}</select>`;
    const linhaAluno = (email, g) => {
      const a = alunoEq(email);
      if (!a) return '';
      return `<div class="membro" data-email="${esc(email)}"><span>${esc(a.avatar)}</span>
        <span class="nome" title="${esc(a.nome)}">${esc(a.nome)}</span>
        ${a.nivel ? `<span class="selo ${esc(a.nivel)}">${ABREV_N[a.nivel] || esc(a.nivel)}</span>` : '<span class="selo">sem avaliação</span>'}
        <span class="suave pequeno">${a.media != null ? a.media + '%' : ''}</span>${opcoes(g)}</div>`;
    };
    $('eq-equipes').innerHTML = eq.rascunho.length ? eq.rascunho.map((g, i) => {
      const comp = {};
      g.forEach((e) => { const a = alunoEq(e); const n = a && a.nivel ? a.nivel : 'sem avaliação'; comp[n] = (comp[n] || 0) + 1; });
      const media = mediaEq(g);
      return `<div class="cartao equipe-card ${g.length > t.maxEquipe ? 'excedida' : ''}">
        <h3>${nomeEq(i)} <span class="suave pequeno">${g.length}/${t.maxEquipe}</span><span class="espaco"></span>
          <span class="pequeno">${media != null ? 'média ' + media + '%' : ''}</span></h3>
        <div class="composicao">${Object.keys(comp).map((n) => `<span class="selo ${esc(n)}">${comp[n]} ${ABREV_N[n] || esc(n)}</span>`).join('')}</div>
        ${g.map((e) => linhaAluno(e, i)).join('')}</div>`;
    }).join('') : '<div class="cartao vazio">Nenhuma equipe ainda.</div>';

    const dentro = new Set(eq.rascunho.flat());
    const fora = t.alunos.filter((a) => !dentro.has(a.email)).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    $('eq-fora-box').hidden = !fora.length;
    $('eq-fora').innerHTML = fora.map((a) => linhaAluno(a.email, -1)).join('');
  }

  function moverAlunoEq(ev) {
    if (!ev.target.matches('select[data-mover]') || !ev.target.value) return;
    const email = ev.target.closest('[data-email]').dataset.email, destino = ev.target.value;
    eq.rascunho = eq.rascunho.map((g) => g.filter((e) => e !== email));
    if (destino === 'novo') eq.rascunho.push([email]);
    else if (destino !== 'fora') eq.rascunho[Number(destino)].push(email);
    eq.alterado = true;
    renderTurmaEquipes();
  }

  /**
   * Sugestão: serpentina pela média (com pequena variação para gerar sugestões diferentes),
   * depois trocas entre alunos do MESMO nível enquanto aproximarem as médias das equipes.
   * Quem ainda não tem avaliação entra por último, sempre na equipe menor.
   */
  function sugerirEquipes(alunos, max) {
    if (!alunos.length) { avisar('Nenhum aluno nesta turma.', true); return []; }
    const n = Math.ceil(alunos.length / max);
    const avaliados = alunos.filter((a) => a.media != null)
      .map((a) => ({ ...a, chave: a.media + (Math.random() - 0.5) * 6 })).sort((a, b) => b.chave - a.chave);
    const semNota = alunos.filter((a) => a.media == null).sort(() => Math.random() - 0.5);
    const ordem = [...Array(n).keys()].sort(() => Math.random() - 0.5);
    const equipes = Array.from({ length: n }, () => []);
    avaliados.forEach((a, i) => {
      const volta = Math.floor(i / n), pos = i % n;
      equipes[ordem[volta % 2 === 0 ? pos : n - 1 - pos]].push(a);
    });
    const media = (g) => { const v = g.filter((a) => a.media != null); return v.length ? v.reduce((s, a) => s + a.media, 0) / v.length : 0; };
    const dispersao = () => {
      const ms = equipes.filter((g) => g.some((a) => a.media != null)).map(media);
      if (!ms.length) return 0;
      const m = ms.reduce((s, x) => s + x, 0) / ms.length;
      return ms.reduce((s, x) => s + (x - m) ** 2, 0);
    };
    for (let iter = 0; iter < 300; iter++) {
      let melhor = null, atual = dispersao();
      for (let g1 = 0; g1 < n; g1++) for (let g2 = g1 + 1; g2 < n; g2++) {
        for (let i = 0; i < equipes[g1].length; i++) for (let j = 0; j < equipes[g2].length; j++) {
          const a = equipes[g1][i], b = equipes[g2][j];
          if (a.nivel !== b.nivel || a.media === b.media) continue;
          equipes[g1][i] = b; equipes[g2][j] = a;
          const d = dispersao();
          equipes[g1][i] = a; equipes[g2][j] = b;
          if (d < atual - 1e-9) { atual = d; melhor = [g1, i, g2, j]; }
        }
      }
      if (!melhor) break;
      const [g1, i, g2, j] = melhor;
      [equipes[g1][i], equipes[g2][j]] = [equipes[g2][j], equipes[g1][i]];
    }
    semNota.forEach((a) => {
      const menor = equipes.reduce((m, g, k) => (g.length < equipes[m].length ? k : m), 0);
      equipes[menor].push(a);
    });
    return equipes.map((g) => g.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map((a) => a.email));
  }

  function imprimirEquipes() {
    const equipes = eq.rascunho.filter((g) => g.length);
    if (!equipes.length) { avisar('Não há equipes para imprimir.', true); return; }
    $('impressao').innerHTML = `<h2>Equipes – ${esc(eq.turma.turma)} – ${esc(eq.turma.mes)}</h2>
      <div style="columns:2;column-gap:32px">${equipes.map((g, i) => `
        <div class="q"><strong style="font-size:15pt">${nomeEq(i)}</strong><ol style="margin:4px 0 0 20px">${g.map((e) => {
          const a = alunoEq(e);
          return `<li>${esc(a ? a.avatar + ' ' + a.nome : e)}</li>`;
        }).join('')}</ol></div>`).join('')}</div>`;
    document.body.classList.add('imprimindo');
    setTimeout(() => { window.print(); document.body.classList.remove('imprimindo'); }, 80);
  }

  // ---------- Placar ----------
  let turmaPlacar = '';
  async function abrirPlacar(turma) {
    turmaPlacar = turma;
    const p = await chamar('profPlacar', turma);
    const nomesMes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const max = Math.max(1, ...p.equipes.map((e) => e.pontos));
    const medalha = ['🥇', '🥈', '🥉'];
    $('eq-placar-conteudo').innerHTML = `<h2>🏆 Team scoreboard – ${esc(p.turma)} · ${nomesMes[Number(p.mes.slice(5)) - 1]}</h2>` +
      (p.equipes.length ? p.equipes.map((e, i) => `
        <div class="linha-placar">
          <span class="pos">${medalha[i] || i + 1 + 'º'}</span>
          <span class="em">${esc(e.emoji)}</span>
          <span><div class="nm">${esc(e.nome)}</div><div class="bichos">${e.membros.map((m) => esc(m.avatar)).join('')}</div>
            <div class="barra"><i style="width:${(e.pontos / max) * 100}%"></i></div></span>
          <span class="pts" title="${e.estrelas} estrelas no total">⭐ ${Number(e.pontos).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</span>
        </div>`).join('') : '<p class="vazio">Esta turma ainda não tem equipes.</p>');
    telaEquipes('eq-placar');
  }

  function configurarEquipes() {
    $('eq-mes').value = mesHojeEq();
    $('eq-mes').addEventListener('change', carregarResumoEquipes);
    document.querySelector('.abas button[data-aba="equipes"]').addEventListener('click', () => { if (!$('eq-geral').hidden) carregarResumoEquipes(); });
    $('eq-tabela').addEventListener('click', (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.dataset.abrirTurma) comBotao(b, () => abrirTurmaEquipes(b.dataset.abrirTurma));
      if (b.dataset.placarTurma) comBotao(b, () => abrirPlacar(b.dataset.placarTurma));
    });
    $('eq-voltar').addEventListener('click', () => {
      if (eq.alterado && !confirm('Sair sem aplicar? As mudanças deste rascunho serão perdidas.')) return;
      telaEquipes('eq-geral');
      carregarResumoEquipes();
    });
    $('eq-sugerir').addEventListener('click', () => {
      if (eq.alterado && !confirm('Descartar o rascunho atual e gerar outra sugestão?')) return;
      eq.rascunho = sugerirEquipes(eq.turma.alunos, eq.turma.maxEquipe);
      eq.alterado = true;
      renderTurmaEquipes();
    });
    $('eq-manter').addEventListener('click', (ev) => {
      if (!confirm(`Manter as equipes de ${eq.turma.mesVigente} também em ${eq.turma.mes}?`)) return;
      comBotao(ev.target, async () => {
        eq.turma = await chamar('profSalvarEquipes', eq.turma.turma, eq.turma.mes, eq.turma.equipes.map((g) => g.membros));
        carregarRascunhoEq();
        avisar('Equipes mantidas para este mês.');
      });
    });
    $('eq-aplicar').addEventListener('click', (ev) => {
      const equipes = eq.rascunho.filter((g) => g.length);
      if (!equipes.length) { avisar('Não há equipes para aplicar. Clique em "Gerar sugestão".', true); return; }
      const grande = equipes.findIndex((g) => g.length > eq.turma.maxEquipe);
      if (grande !== -1) { avisar(`A equipe ${nomeEq(grande)} passou do limite de ${eq.turma.maxEquipe} alunos.`, true); return; }
      comBotao(ev.target, async () => {
        eq.turma = await chamar('profSalvarEquipes', eq.turma.turma, eq.turma.mes, equipes);
        carregarRascunhoEq();
        avisar('Equipes aplicadas. As crianças já veem a nova equipe.');
      });
    });
    $('eq-imprimir').addEventListener('click', imprimirEquipes);
    $('eq-equipes').addEventListener('change', moverAlunoEq);
    $('eq-fora').addEventListener('change', moverAlunoEq);
    $('eq-ver-placar').addEventListener('click', (ev) => comBotao(ev.target, () => abrirPlacar(eq.turma.turma)));
    $('eq-placar-voltar').addEventListener('click', () => { telaEquipes('eq-geral'); carregarResumoEquipes(); });
    $('eq-placar-atualizar').addEventListener('click', (ev) => comBotao(ev.target, () => abrirPlacar(turmaPlacar)));
    $('eq-tela-cheia').addEventListener('click', () => {
      const el = $('eq-placar-conteudo');
      if (el.requestFullscreen) el.requestFullscreen().catch(() => avisar('A tela cheia não é permitida aqui. Use F11 no navegador.', true));
    });
  }
</script>
````

### Arquivo: `ProfRelatorios.html`

Aba Relatórios. (214 linhas)

````html
<!-- Relatórios -->
<section id="aba-relatorios" class="pilha" hidden>
  <style>
    .dist { display: flex; height: 16px; border-radius: 6px; overflow: hidden; background: var(--borda); min-width: 140px; }
    .dist span { display: block; height: 100%; }
    .cor-Iniciante { background: #ff8787; } .cor-Básico { background: #ffd43b; }
    .cor-Intermediário { background: #74c0fc; } .cor-Avançado { background: #69db7c; }
    .legenda-n { display: flex; gap: 14px; flex-wrap: wrap; font-size: .85rem; color: var(--suave); }
    .legenda-n i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 5px; vertical-align: -1px; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
    .kpi { border: 1px solid var(--borda); border-radius: 10px; padding: 10px 12px; background: #fff; }
    .kpi .valor { font-size: 1.5rem; font-weight: 700; }
    .pal-linha { display: grid; grid-template-columns: 36px 1fr 120px 46px; gap: 8px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--borda); font-size: .9rem; }
    .pal-linha .fg { font-size: 1.4rem; text-align: center; }
    .pal-linha .barra { margin: 0; height: 10px; }
    .tema-linha { display: grid; grid-template-columns: 1fr 160px 50px 60px; gap: 10px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--borda); font-size: .9rem; }
    .tema-linha .barra { margin: 0; height: 10px; }
    .grafico svg { width: 100%; height: auto; display: block; }
    .ficha-cab { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .ficha-cab .av { font-size: 3rem; }
    #impressao * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>

  <div class="linha">
    <div class="chips" id="rel-vistas">
      <button class="btn ativa" data-vista="turmas">Comparativo das turmas</button>
      <button class="btn" data-vista="palavras">Palavras com mais dificuldade</button>
      <button class="btn" data-vista="aluno">Ficha do aluno</button>
    </div>
    <span class="espaco"></span>
    <button class="btn" id="rel-atualizar">↻ Atualizar</button>
    <button class="btn" id="rel-imprimir">Imprimir / PDF</button>
    <button class="btn primario" id="rel-exportar">Exportar para planilha</button>
  </div>
  <div id="rel-exportado" class="link-box" hidden></div>

  <div id="rel-turmas" class="pilha" data-titulo="Comparativo das turmas"></div>

  <div id="rel-palavras" class="pilha" data-titulo="Palavras com mais dificuldade" hidden>
    <div class="linha"><select id="rel-pal-serie" style="width:auto"></select>
      <span class="suave pequeno">Do menor para o maior acerto. Boas candidatas para retomar em aula.</span></div>
    <div class="grade-2">
      <div class="cartao"><h3>📝 Nas avaliações</h3><p class="suave pequeno" style="margin-top:0">% de acerto nas questões sobre a palavra (online e impressas lançadas com letras).</p><div id="rel-pal-av"></div></div>
      <div class="cartao"><h3>🎮 Nos jogos</h3><p class="suave pequeno" style="margin-top:0">Domínio médio entre os alunos que já jogaram a palavra.</p><div id="rel-pal-jogo"></div></div>
    </div>
  </div>

  <div id="rel-aluno" class="pilha" data-titulo="Ficha do aluno" hidden>
    <div class="linha">
      <select id="rel-al-turma" style="width:auto"></select>
      <select id="rel-al-aluno" style="flex:1;min-width:220px"></select>
    </div>
    <div id="rel-al-conteudo"><div class="cartao vazio">Escolha a turma e o aluno.</div></div>
  </div>
</section>

<script>
  let relGeral = null, relVista = 'turmas', relFicha = null;
  const NOMES_MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const mesCurto = (m) => (m && m.length === 7 ? NOMES_MES[Number(m.slice(5)) - 1] + '/' + m.slice(2, 4) : m);
  const pctBr = (v) => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
  const corBarra = (v) => (v < 40 ? 'var(--perigo)' : v < 70 ? '#f08c00' : 'var(--ok)');
  const tempoRel = (s) => { const m = Math.round((Number(s) || 0) / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; };

  async function carregarRelatorios() {
    $('rel-turmas').innerHTML = '<div class="carregando">Carregando…</div>';
    relGeral = await chamar('profRelatorioGeral');
    renderRelTurmas();
    renderRelPalavras();
  }

  function trocarVista(v) {
    relVista = v;
    document.querySelectorAll('#rel-vistas button').forEach((b) => b.classList.toggle('ativa', b.dataset.vista === v));
    ['turmas', 'palavras', 'aluno'].forEach((x) => ($('rel-' + x).hidden = x !== v));
  }

  // ---------- Comparativo ----------
  function renderRelTurmas() {
    const g = relGeral;
    const meses = [...new Set(g.turmas.flatMap((t) => t.porMes.map((m) => m.mes)))].sort();
    $('rel-turmas').innerHTML = `
      <div class="legenda-n">${g.niveis.map((n) => `<span><i class="cor-${n}"></i>${n}</span>`).join('')}<span><i style="background:var(--borda)"></i>sem avaliação</span></div>
      ${g.series.map((s) => {
        const ts = g.turmas.filter((t) => t.serie === s);
        if (!ts.length) return '';
        return `<div class="cartao"><h3>${esc(s)} ano</h3><div class="tabela-rolagem"><table>
          <thead><tr><th>Turma</th><th>Alunos</th><th>Média aval.</th><th>Níveis</th><th>Jogaram</th><th>Ativos no mês</th><th>Domínio jogos</th><th>Partidas</th><th>Tempo</th></tr></thead>
          <tbody>${ts.map((t) => `<tr>
            <td><strong>${esc(t.turma)}</strong></td>
            <td>${t.alunos}<div class="suave pequeno">${t.avaliados} avaliados</div></td>
            <td>${t.media != null ? pctBr(t.media) : '—'}</td>
            <td><div class="dist" title="${g.niveis.map((n) => n + ': ' + t.niveis[n]).join(' · ')}">${g.niveis.map((n) =>
              t.niveis[n] ? `<span class="cor-${n}" style="width:${(t.niveis[n] / Math.max(1, t.alunos)) * 100}%"></span>` : '').join('')}</div>
              <div class="suave pequeno">${g.niveis.map((n) => t.niveis[n]).join(' · ')}</div></td>
            <td>${t.jogaram}/${t.alunos}</td>
            <td>${t.ativosMes}</td>
            <td>${t.dominio != null ? pctBr(t.dominio) : '—'}</td>
            <td>${t.partidas}</td>
            <td class="pequeno">${tempoRel(t.segundos)}</td></tr>`).join('')}</tbody></table></div></div>`;
      }).join('')}
      <div class="cartao"><h3>Média das avaliações por mês</h3>
        ${meses.length ? `<div class="tabela-rolagem"><table><thead><tr><th>Turma</th>${meses.map((m) => `<th>${mesCurto(m)}</th>`).join('')}</tr></thead>
          <tbody>${g.turmas.filter((t) => t.porMes.length).map((t) => `<tr><td><strong>${esc(t.turma)}</strong></td>${meses.map((m) => {
            const x = t.porMes.find((p) => p.mes === m);
            return `<td>${x ? `<span style="color:${corBarra(x.media)};font-weight:700">${pctBr(x.media)}</span>` : '<span class="suave">—</span>'}</td>`;
          }).join('')}</tr>`).join('')}</tbody></table></div>` : '<p class="vazio">Nenhuma avaliação respondida ainda.</p>'}
      </div>`;
  }

  // ---------- Palavras ----------
  function linhaPalavra(w, v, extra) {
    return `<div class="pal-linha"><span class="fg">${esc(w.figura) || '🔤'}</span>
      <span><strong>${esc(w.en)}</strong> <span class="suave pequeno">${esc(w.pt)} · ${extra}</span></span>
      <div class="barra"><i style="width:${v}%;background:${corBarra(v)}"></i></div><span class="suave">${v}%</span></div>`;
  }
  function renderRelPalavras() {
    const lista = relGeral.dificeis[$('rel-pal-serie').value] || [];
    const av = lista.filter((w) => w.avaliacao != null).sort((a, b) => a.avaliacao - b.avaliacao).slice(0, 15);
    const jg = lista.filter((w) => w.jogos != null).sort((a, b) => a.jogos - b.jogos).slice(0, 15);
    $('rel-pal-av').innerHTML = av.length ? av.map((w) => linhaPalavra(w, w.avaliacao, w.respostas + ' respostas')).join('') : '<p class="vazio">Sem avaliações respondidas nesta série.</p>';
    $('rel-pal-jogo').innerHTML = jg.length ? jg.map((w) => linhaPalavra(w, w.jogos, w.alunos + ' alunos')).join('') : '<p class="vazio">Ninguém desta série jogou ainda.</p>';
  }

  // ---------- Ficha do aluno ----------
  function graficoAvaliacoes(av, fx) {
    if (!av.length) return '<p class="vazio">Nenhuma avaliação respondida ainda.</p>';
    const W = 600, H = 200, m = { l: 34, r: 12, t: 12, b: 34 };
    const x = (i) => m.l + (av.length === 1 ? (W - m.l - m.r) / 2 : (i * (W - m.l - m.r)) / (av.length - 1));
    const y = (v) => m.t + ((100 - v) * (H - m.t - m.b)) / 100;
    const faixas = [[fx.basico, '#ffd43b'], [fx.intermediario, '#74c0fc'], [fx.avancado, '#69db7c']]
      .map(([v, c]) => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" stroke="${c}" stroke-dasharray="4 4"/><text x="${W - m.r}" y="${y(v) - 3}" text-anchor="end" font-size="10" fill="#868e96">${v}%</text>`).join('');
    const pts = av.map((a, i) => `${x(i)},${y(a.percentual)}`).join(' ');
    return `<div class="grafico"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução nas avaliações">
      ${[0, 50, 100].map((v) => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" stroke="#e9ecef"/><text x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end" font-size="10" fill="#868e96">${v}</text>`).join('')}
      ${faixas}
      <polyline points="${pts}" fill="none" stroke="#c2410c" stroke-width="2.5"/>
      ${av.map((a, i) => `<circle cx="${x(i)}" cy="${y(a.percentual)}" r="5" fill="#c2410c"><title>${esc(a.titulo)}: ${a.percentual}%</title></circle>
        <text x="${x(i)}" y="${y(a.percentual) - 9}" text-anchor="middle" font-size="11" font-weight="700" fill="#343a40">${Math.round(a.percentual)}%</text>
        <text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="10" fill="#868e96">${a.tipo === 'diagnostico' ? 'Diagn.' : mesCurto(a.mes)}</text>`).join('')}
    </svg></div>`;
  }

  function htmlFicha(f) {
    const a = f.aluno;
    return `<div class="pilha">
      <div class="cartao ficha-cab"><span class="av">${esc(a.avatar)}</span>
        <div style="flex:1"><h2 style="margin:0">${esc(a.nome)}</h2><div class="suave">Turma ${esc(a.turma)} · ${esc(a.serie)} ano · Língua Inglesa</div></div>
        <div>${f.nivel ? `<span class="selo ${esc(f.nivel)}" style="font-size:1rem">${esc(f.nivel)}</span>` : '<span class="selo">sem avaliação</span>'}
          <div class="suave pequeno" style="text-align:right">${f.media != null ? 'média ' + pctBr(f.media) : ''}</div></div></div>
      <div class="kpis">
        <div class="kpi"><div class="suave pequeno">Avaliações feitas</div><div class="valor">${f.avaliacoes.length}</div></div>
        <div class="kpi"><div class="suave pequeno">Estrelas nos jogos</div><div class="valor">⭐ ${f.jogos.estrelas}</div></div>
        <div class="kpi"><div class="suave pequeno">Partidas</div><div class="valor">${f.jogos.jogadas}</div></div>
        <div class="kpi"><div class="suave pequeno">Tempo jogando</div><div class="valor" style="font-size:1.2rem">${tempoRel(f.jogos.segundos)}</div></div>
        <div class="kpi"><div class="suave pequeno">Palavras dominadas</div><div class="valor">🏅 ${f.jogos.dominadas}</div></div>
        <div class="kpi"><div class="suave pequeno">Equipe</div><div class="valor" style="font-size:1.2rem">${f.equipe ? esc(f.equipe.emoji + ' ' + f.equipe.nome) : '—'}</div></div>
      </div>
      <div class="cartao"><h3>Evolução nas avaliações</h3>${graficoAvaliacoes(f.avaliacoes, f.faixas)}
        ${f.avaliacoes.length ? `<div class="tabela-rolagem"><table><thead><tr><th>Avaliação</th><th>Mês</th><th>Acertos</th><th>%</th><th>Forma</th></tr></thead><tbody>
          ${f.avaliacoes.map((x) => `<tr><td>${esc(x.titulo)}</td><td>${mesCurto(x.mes)}</td><td>${x.pontuacao}/${x.total}</td><td><strong>${pctBr(x.percentual)}</strong></td><td class="suave pequeno">${x.origem === 'online' ? 'online' : 'impressa'}</td></tr>`).join('')}
        </tbody></table></div>` : ''}</div>
      <div class="cartao"><h3>Domínio nos temas (jogos)</h3>
        ${f.temas.length ? f.temas.map((t) => `<div class="tema-linha"><span><strong>${esc(t.titulo)}</strong> <span class="suave pequeno">${esc(t.titulo_pt)}</span></span>
          ${t.dominio == null ? '<span class="suave pequeno">ainda não jogou</span><span></span><span></span>' : `
          <div class="barra"><i style="width:${t.dominio}%;background:${corBarra(t.dominio)}"></i></div><span>${t.dominio}%</span><span class="suave pequeno">⭐ ${t.estrelas}</span>`}</div>`).join('')
        : '<p class="vazio">Nenhum tema liberado ainda.</p>'}</div>
      <div class="cartao"><h3>Palavras para reforçar</h3>
        ${f.reforcar.length ? `<p class="suave pequeno" style="margin-top:0">Palavras que a criança já encontrou nos jogos e ainda erra (domínio abaixo de 50%).</p>
          ${f.reforcar.map((w) => linhaPalavra(w, w.pontos, esc(w.tema))).join('')}` : '<p class="vazio">Nenhuma palavra com dificuldade nos jogos. 🎉</p>'}</div>
    </div>`;
  }

  async function carregarFicha() {
    const email = $('rel-al-aluno').value;
    if (!email) { $('rel-al-conteudo').innerHTML = '<div class="cartao vazio">Escolha a turma e o aluno.</div>'; relFicha = null; return; }
    $('rel-al-conteudo').innerHTML = '<div class="carregando">Carregando…</div>';
    relFicha = await chamar('profRelatorioAluno', email);
    $('rel-al-conteudo').innerHTML = htmlFicha(relFicha);
  }

  function opcoesAlunosRel() {
    const turma = $('rel-al-turma').value;
    const lista = estado.alunos.filter((a) => a.turma === turma).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    $('rel-al-aluno').innerHTML = '<option value="">Escolha o aluno…</option>' + lista.map((a) => `<option value="${esc(a.email)}">${esc(a.avatar)} ${esc(a.nome)}</option>`).join('');
  }

  function configurarRelatorios() {
    $('rel-pal-serie').innerHTML = opcoesSerie(false);
    $('rel-al-turma').innerHTML = opcoesTurma(false);
    opcoesAlunosRel();
    document.querySelector('.abas button[data-aba="relatorios"]').addEventListener('click', () => { if (!relGeral) comBotao($('rel-atualizar'), carregarRelatorios); });
    $('rel-vistas').addEventListener('click', (ev) => { const b = ev.target.closest('[data-vista]'); if (b) trocarVista(b.dataset.vista); });
    $('rel-atualizar').addEventListener('click', (ev) => comBotao(ev.target, async () => { await carregarRelatorios(); if (relVista === 'aluno' && relFicha) await carregarFicha(); }));
    $('rel-pal-serie').addEventListener('change', renderRelPalavras);
    $('rel-al-turma').addEventListener('change', () => { opcoesAlunosRel(); carregarFicha(); });
    $('rel-al-aluno').addEventListener('change', () => carregarFicha());
    $('rel-imprimir').addEventListener('click', () => {
      const secao = $('rel-' + relVista);
      if (relVista === 'aluno' && !relFicha) { avisar('Escolha um aluno antes de imprimir.', true); return; }
      const titulo = relVista === 'aluno' ? 'Ficha do aluno – English Kids App' : secao.dataset.titulo + ' – English Kids App';
      const corpo = relVista === 'aluno' ? htmlFicha(relFicha) : secao.innerHTML;
      $('impressao').innerHTML = `<h2>${esc(titulo)}</h2><p style="color:#666">Gerado em ${new Date().toLocaleString('pt-BR')}</p>${corpo}`;
      $('impressao').querySelectorAll('select').forEach((s) => s.remove());
      document.body.classList.add('imprimindo');
      setTimeout(() => { window.print(); document.body.classList.remove('imprimindo'); }, 80);
    });
    $('rel-exportar').addEventListener('click', (ev) => comBotao(ev.target, async () => {
      const url = await chamar('profExportarPlanilha');
      $('rel-exportado').hidden = false;
      $('rel-exportado').innerHTML = `<span>✅ Planilha criada no seu Drive:</span> <a href="${esc(url)}" target="_blank" rel="noopener">abrir relatório</a>`;
    }));
  }
</script>
````

### Arquivo: `Teste.html`

Página de teste de voz e microfone (?teste=1). (20 linhas)

````html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="utf-8">
  <?!= incluir('Estilo'); ?>
  <?!= incluir('Fala'); ?>
  <style>main { max-width: 720px; }</style>
</head>
<body>
  <header class="topo">
    <div class="marca-app"><?!= incluir('Marca'); ?><span class="sub-app">Teste do Chromebook</span></div>
    <div class="suave pequeno"><?= email ?></div>
  </header>
  <main>
    <p class="suave">Esta página só testa a voz e o microfone deste aparelho. Nada é gravado nem salvo.</p>
    <?!= incluir('TesteConteudo'); ?>
  </main>
</body>
</html>
````

### Arquivo: `TesteConteudo.html`

Conteúdo do teste de voz e microfone. (178 linhas)

````html
<div class="pilha" id="teste-chromebook">
  <div class="cartao">
    <h2>🔊 1. Voz em inglês</h2>
    <p class="suave pequeno">Os jogos falam as palavras com a voz do próprio Chrome. Aumente o volume e clique no botão.</p>
    <div class="linha">
      <button class="btn primario" type="button" id="tc-falar">🔊 Falar "Hello! Let's play English games!"</button>
      <button class="btn" type="button" id="tc-lento">🐢 Falar devagar</button>
    </div>
    <div id="tc-voz-res" class="pequeno" style="margin-top:10px"></div>
  </div>

  <div class="cartao">
    <h2>🎤 2. Microfone e reconhecimento de voz</h2>
    <p class="suave pequeno">Para o jogo "Speak!". Clique no botão, permita o microfone se o Chrome perguntar e diga <strong>"apple"</strong> em voz alta.</p>
    <div class="linha">
      <button class="btn primario" type="button" id="tc-ouvir">🎤 Ouvir agora</button>
      <span class="suave pequeno" id="tc-ouvindo"></span>
    </div>
    <div id="tc-mic-res" class="pequeno" style="margin-top:10px"></div>
  </div>

  <div class="cartao">
    <h2>🩺 3. Diagnóstico detalhado do microfone</h2>
    <p class="suave pequeno">Descobre <strong>quem</strong> está bloqueando: a página, o Chrome, a conta da escola ou o aparelho. Clique e, se o Chrome perguntar, escolha <strong>Permitir</strong>.</p>
    <button class="btn primario" type="button" id="tc-diag">🩺 Diagnosticar</button>
    <div id="tc-diag-res" class="pequeno" style="margin-top:10px"></div>
  </div>

  <div class="cartao">
    <h2>📋 Resumo deste aparelho</h2>
    <div id="tc-resumo" class="pequeno"></div>
    <p class="suave pequeno">Anote o resultado (ou tire um print) e mande no chat do Claude para ajustarmos os jogos.</p>
  </div>
</div>

<script>
  (function () {
    const el = (id) => document.getElementById(id);
    const res = { voz: null, mic: null };
    const ok = (t) => `<span style="color:#2b8a3e;font-weight:700">✅ ${t}</span>`;
    const ruim = (t) => `<span style="color:#c92a2a;font-weight:700">❌ ${t}</span>`;
    const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function resumo() {
      const politica = document.featurePolicy && document.featurePolicy.allowsFeature
        ? (document.featurePolicy.allowsFeature('microphone') ? 'permite' : 'NÃO permite') : 'desconhecida';
      el('tc-resumo').innerHTML = `
        <div>Navegador: <code>${e(navigator.userAgent.match(/(CrOS|Windows|Mac OS X|Android|Linux)[^;)]*/)?.[0] || '?')}</code>
          ${/CrOS/.test(navigator.userAgent) ? '· <strong>Chromebook</strong>' : ''}</div>
        <div>Voz do Chrome: ${Fala.disponivel() ? ok('disponível') : ruim('indisponível')}</div>
        <div>Vozes em inglês: <strong>${Fala.vozesIngles().length}</strong>${Fala.voz ? ' · usando <code>' + e(Fala.voz.name) + '</code>' : ''}</div>
        <div>Reconhecimento de voz: ${Escuta.suportada() ? ok('existe no navegador') : ruim('não existe neste navegador')}</div>
        <div>Microfone permitido pela página: <strong>${politica}</strong></div>
        <div>Teste da voz: ${res.voz === null ? '<span class="suave">não feito</span>' : res.voz ? ok('falou') : ruim('não falou')}</div>
        <div>Teste do microfone: ${res.mic === null ? '<span class="suave">não feito</span>' : res.mic === true ? ok('entendeu "apple"') : ruim(e(res.mic))}</div>`;
    }

    async function falar(lento) {
      await Fala.iniciar();
      el('tc-voz-res').innerHTML = '<span class="suave">Falando…</span>';
      const falou = await Fala.falar("Hello! Let's play English games!", lento);
      res.voz = falou;
      el('tc-voz-res').innerHTML = falou
        ? ok('A voz funcionou.') + ` <span class="suave">Voz: ${e(Fala.voz ? Fala.voz.name + ' (' + Fala.voz.lang + ')' : 'padrão do Chrome')}. Se não ouviu nada, confira o volume.</span>`
        : ruim('A voz não funcionou neste navegador.');
      resumo();
    }
    el('tc-falar').addEventListener('click', () => falar(false));
    el('tc-lento').addEventListener('click', () => falar(true));

    el('tc-ouvir').addEventListener('click', async () => {
      const botao = el('tc-ouvir');
      botao.disabled = true;
      el('tc-mic-res').innerHTML = '';
      el('tc-ouvindo').textContent = 'Preparando…';
      try {
        const frases = await Escuta.ouvir({ aoComecar: () => (el('tc-ouvindo').textContent = '🔴 Ouvindo… diga "apple"') });
        const entendeu = frases.some((f) => normalizarFala(f).split(' ').includes('apple'));
        res.mic = entendeu ? true : 'ouviu, mas não reconheceu "apple"';
        el('tc-mic-res').innerHTML = (entendeu ? ok('Funcionou! Entendi "apple".') : ruim('Ouvi, mas não reconheci "apple". Tente de novo, falando claramente.')) +
          `<div class="suave">O Chrome entendeu: ${frases.map((f) => '"' + e(f) + '"').join(', ')}</div>`;
      } catch (erro) {
        res.mic = erro.mensagem + ' [' + erro.codigo + ']';
        el('tc-mic-res').innerHTML = ruim(e(erro.mensagem)) + ` <span class="suave">(código: ${e(erro.codigo)})</span>`;
      } finally {
        el('tc-ouvindo').textContent = '';
        botao.disabled = false;
        resumo();
      }
    });

    // ---------- Diagnóstico detalhado ----------
    el('tc-diag').addEventListener('click', async () => {
      const botao = el('tc-diag');
      botao.disabled = true;
      const linhas = [];
      const d = {};
      const add = (t) => { linhas.push(`<div>${t}</div>`); el('tc-diag-res').innerHTML = linhas.join(''); };
      try {
        let topo = true;
        try { topo = window.top === window; } catch (x) { topo = false; }
        d.topo = topo;
        d.politica = document.featurePolicy && document.featurePolicy.allowsFeature ? document.featurePolicy.allowsFeature('microphone') : null;
        add(`Página: ${topo ? 'aberta direto no navegador' : '<strong>dentro de uma moldura (iframe)</strong>'} · ${window.isSecureContext ? 'conexão segura (https)' : '<strong>conexão NÃO segura</strong>'}`);
        add(`A página pode pedir o microfone? ${d.politica === null ? 'desconhecido' : d.politica ? ok('sim') : ruim('não: a moldura não tem permissão de microfone')}`);

        if (navigator.permissions && navigator.permissions.query) {
          try { d.permissao = (await navigator.permissions.query({ name: 'microphone' })).state; } catch (x) { d.permissao = 'indisponível'; }
        } else d.permissao = 'indisponível';
        const PERM = { granted: ok('permitido para este site'), denied: ruim('BLOQUEADO para este site'), prompt: 'vai perguntar (ainda não decidido)' };
        add(`Permissão do microfone no Chrome: ${PERM[d.permissao] || e(d.permissao)}`);

        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const disp = await navigator.mediaDevices.enumerateDevices();
          d.microfones = disp.filter((x) => x.kind === 'audioinput').length;
          add(`Microfones encontrados: <strong>${d.microfones}</strong>`);
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const t0 = performance.now();
          try {
            const fluxo = await navigator.mediaDevices.getUserMedia({ audio: true });
            fluxo.getTracks().forEach((t) => t.stop());
            d.captura = 'ok';
            add(`Abrir o microfone: ${ok('funcionou')}`);
          } catch (x) {
            d.captura = x.name;
            d.ms = Math.round(performance.now() - t0);
            add(`Abrir o microfone: ${ruim(e(x.name) + ' (' + e(x.message || '') + ')')} <span class="suave">em ${d.ms} ms</span>`);
          }
        } else {
          d.captura = 'sem-api';
          add(`Abrir o microfone: ${ruim('este navegador não permite')}`);
        }

        if (d.captura === 'ok' && Escuta.suportada()) {
          add('Reconhecimento de voz: diga <strong>"apple"</strong> agora…');
          try {
            const frases = await Escuta.ouvir({ segundos: 6 });
            d.reconhecimento = 'ok';
            add(`Reconhecimento de voz: ${ok('funcionou')} <span class="suave">(entendi: ${frases.map((f) => '"' + e(f) + '"').join(', ')})</span>`);
          } catch (x) {
            d.reconhecimento = x.codigo;
            add(`Reconhecimento de voz: ${ruim(e(x.mensagem) + ' [' + e(x.codigo) + ']')}`);
          }
        }

        // Conclusão em linguagem simples.
        let c;
        if (d.politica === false || !d.topo) {
          c = 'A <strong>moldura da página</strong> não deixa usar o microfone. Isso acontece em todo app do Google Apps Script e não depende da sua rede nem de configuração: o microfone só funciona numa página aberta fora do Apps Script (como a página de teste no GitHub).';
        } else if (d.captura === 'ok' && d.reconhecimento === 'ok') {
          c = '🎉 <strong>Tudo funciona neste aparelho.</strong> O jogo Speak! pode rodar numa página fora do Apps Script.';
        } else if (d.captura === 'ok') {
          c = 'O microfone abre, mas o <strong>reconhecimento de voz do Google</strong> está bloqueado ou sem conexão. Em Chromebooks e contas da escola, isso costuma ser bloqueado pela administração; em janela anônima, tente numa janela normal.';
        } else if (d.captura === 'NotFoundError' || d.microfones === 0) {
          c = 'Nenhum microfone foi encontrado neste aparelho (ou ele está desligado/desconectado).';
        } else if (d.captura === 'NotReadableError') {
          c = 'O microfone está sendo usado por outro programa (Meet, Zoom…) ou o sistema operacional não deixa o Chrome usá-lo. No Windows: Configurações > Privacidade > Microfone > permitir aplicativos da área de trabalho.';
        } else if (d.captura === 'NotAllowedError' && d.permissao === 'denied' && d.ms < 400) {
          c = 'O microfone foi <strong>negado sem perguntar</strong>. Ou o site está bloqueado no Chrome (cadeado ao lado do endereço > Microfone > Permitir), ou a <strong>administração da conta/aparelho da escola</strong> desligou o microfone. Isso vale em qualquer rede, porque a regra vem junto com a conta @edu ou com o Chromebook. Para confirmar, abra <code>chrome:' + '/' + '/policy</code> e procure por <code>AudioCapture</code>.';
        } else if (d.captura === 'NotAllowedError') {
          c = 'O pedido de microfone foi recusado. Se você não clicou em "Bloquear", clique no cadeado ao lado do endereço > Microfone > Permitir e recarregue a página.';
        } else {
          c = 'Resultado incomum: mande um print deste quadro.';
        }
        add(`<div class="feedback" style="margin-top:10px;background:#fff9db;border-left:4px solid #fab005;border-radius:6px;padding:10px 12px">💡 ${c}</div>`);
      } catch (x) {
        add(ruim('Erro no diagnóstico: ' + e(x.message)));
      } finally {
        botao.disabled = false;
      }
    });

    Fala.iniciar().then(resumo);
    resumo();
  })();
</script>
````

---

## 7. Página externa do Speak! (repositório `english-kids-speak`, GitHub Pages)

Este arquivo não vai para o Apps Script: fica no GitHub Pages. A página `index.html` do mesmo repositório é o teste de microfone, montada com `Estilo.html` + `Fala.html` + `TesteConteudo.html`.

### Arquivo: `english-kids-speak/jogo.html`

````html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Speak! – English Kids</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
<script>
  /**
   * Voz (fala em inglês) e escuta (reconhecimento de voz) do próprio Chrome.
   * Nada é gravado: o áudio do microfone é tratado pelo Chrome e só o texto reconhecido chega à página.
   */
  const Fala = {
    voz: null,
    velocidade: 0.85,
    pronta: null,

    disponivel() { return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window; },

    /** Escolhe a melhor voz em inglês. As vozes do Chrome carregam depois da página, por isso a espera. */
    iniciar() {
      if (this.pronta) return this.pronta;
      this.pronta = new Promise((ok) => {
        if (!this.disponivel()) { ok(null); return; }
        const escolher = () => {
          const vozes = speechSynthesis.getVoices();
          const ingles = vozes.filter((v) => /^en[-_]/i.test(v.lang));
          this.voz = ingles.find((v) => /Google US English/i.test(v.name))
            || ingles.find((v) => /^en[-_]US/i.test(v.lang) && v.localService)
            || ingles.find((v) => /^en[-_]US/i.test(v.lang))
            || ingles.find((v) => /^en[-_]GB/i.test(v.lang))
            || ingles[0] || null;
          return vozes.length > 0;
        };
        if (escolher()) { ok(this.voz); return; }
        speechSynthesis.addEventListener('voiceschanged', () => { escolher(); ok(this.voz); }, { once: true });
        setTimeout(() => { escolher(); ok(this.voz); }, 2500);
      });
      return this.pronta;
    },

    vozesIngles() {
      return this.disponivel() ? speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang)) : [];
    },

    /** Fala o texto em inglês. lento = para repetir devagar. Resolve quando termina (ou falha). */
    falar(texto, lento) {
      return new Promise((ok) => {
        if (!this.disponivel() || !texto) { ok(false); return; }
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(texto));
        u.lang = this.voz ? this.voz.lang : 'en-US';
        if (this.voz) u.voice = this.voz;
        u.rate = lento ? Math.max(0.5, this.velocidade - 0.25) : this.velocidade;
        // Alguns navegadores nunca disparam onend; o limite evita que o jogo fique esperando para sempre.
        let comecou = false, fim = false;
        const terminar = (v) => { if (!fim) { fim = true; clearTimeout(limite); ok(v); } };
        const limite = setTimeout(() => terminar(comecou), 2500 + String(texto).length * 150 / u.rate);
        u.onstart = () => (comecou = true);
        u.onend = () => terminar(true);
        u.onerror = () => terminar(false);
        speechSynthesis.speak(u);
      });
    },
  };

  const Escuta = {
    Reconhecedor: window.SpeechRecognition || window.webkitSpeechRecognition || null,

    suportada() { return !!this.Reconhecedor; },

    /**
     * Ouve uma fala curta em inglês e devolve as transcrições possíveis (em minúsculas).
     * Em caso de erro, rejeita com { codigo, mensagem } em português.
     */
    ouvir(opcoes) {
      opcoes = opcoes || {};
      return new Promise((ok, falha) => {
        if (!this.suportada()) { falha({ codigo: 'sem-suporte', mensagem: Escuta.mensagem('sem-suporte') }); return; }
        const r = new this.Reconhecedor();
        r.lang = opcoes.lang || 'en-US';
        r.interimResults = false;
        r.maxAlternatives = 5;
        r.continuous = false;
        let terminou = false;
        const limite = setTimeout(() => { try { r.stop(); } catch (e) { /* já parou */ } }, opcoes.segundos ? opcoes.segundos * 1000 : 6000);
        r.onresult = (ev) => {
          terminou = true;
          clearTimeout(limite);
          const res = ev.results[0];
          const lista = [];
          for (let i = 0; i < res.length; i++) lista.push(String(res[i].transcript).toLowerCase().trim());
          ok(lista);
        };
        r.onerror = (ev) => {
          if (terminou) return;
          terminou = true;
          clearTimeout(limite);
          falha({ codigo: ev.error, mensagem: Escuta.mensagem(ev.error) });
        };
        r.onend = () => {
          clearTimeout(limite);
          if (!terminou) { terminou = true; falha({ codigo: 'no-speech', mensagem: Escuta.mensagem('no-speech') }); }
        };
        if (opcoes.aoComecar) r.onstart = opcoes.aoComecar;
        try { r.start(); } catch (e) { falha({ codigo: 'start', mensagem: e.message }); }
      });
    },

    mensagem(codigo) {
      return {
        'sem-suporte': 'Este navegador não tem reconhecimento de voz.',
        'not-allowed': 'O microfone foi bloqueado (pelo navegador, pela página ou pela administração dos Chromebooks).',
        'service-not-allowed': 'O reconhecimento de voz está bloqueado neste navegador ou nesta página.',
        'no-speech': 'Não ouvi nada. Fale mais perto do microfone.',
        'audio-capture': 'Nenhum microfone encontrado.',
        'network': 'O reconhecimento de voz precisa de internet e não conseguiu se conectar.',
        'aborted': 'A escuta foi interrompida.',
        'language-not-supported': 'O idioma inglês não está disponível para reconhecimento.',
      }[codigo] || 'Erro no reconhecimento de voz (' + codigo + ').';
    },
  };

  /** Normaliza para comparar o que a criança falou com a palavra esperada. */
  function normalizarFala(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
</script>

</head>
<body>
<style>
  :root { --tinta: #2b2f42; }
  body { margin: 0; font-family: Nunito, "Segoe UI", Roboto, Arial, sans-serif; font-size: 18px; color: var(--tinta); background: #fff9f2; }
  main { max-width: 760px; margin: 0 auto; padding: 18px 16px 60px; }
  h1 { font-size: 1.7rem; font-weight: 900; margin: 0; }
  .topo { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
  .topo h1 { flex: 1; }
  .pontinhos { display: flex; gap: 6px; }
  .pontinhos i { width: 14px; height: 14px; border-radius: 50%; background: #dee2e6; display: block; }
  .pontinhos i.feito { background: #51cf66; } .pontinhos i.meio { background: #fcc419; } .pontinhos i.pulou { background: #ff8787; }
  .pontinhos i.agora { outline: 3px solid #e8590c; outline-offset: 2px; }
  .cartao { background: #fff; border-radius: 26px; padding: 24px 18px; text-align: center; box-shadow: 0 5px 0 #ffe8cc; }
  .fig { font-size: 5.5rem; line-height: 1.1; }
  .fig.texto { font-size: 2rem; font-weight: 900; color: #5f3dc4; }
  .en { font-size: 2.3rem; font-weight: 900; margin: 6px 0 2px; }
  .pt { color: #6c7086; font-weight: 700; }
  .linha { display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 16px; }
  .bt { border: 0; border-radius: 16px; padding: 14px 22px; font: inherit; font-size: 1.15rem; font-weight: 800; cursor: pointer; background: #e8590c; color: #fff; box-shadow: 0 4px 0 #a33a05; }
  .bt.claro { background: #fff; color: var(--tinta); box-shadow: 0 4px 0 #dee2e6; border: 2px solid #dee2e6; }
  .bt:disabled { opacity: .55; cursor: default; }
  .mic { width: 110px; height: 110px; border-radius: 50%; font-size: 3.2rem; padding: 0; background: #2f9e44; box-shadow: 0 6px 0 #1b5e20; }
  .mic.ouvindo { background: #e03131; box-shadow: 0 6px 0 #a61e1e; animation: pulsar 1s infinite; }
  @keyframes pulsar { 50% { transform: scale(1.08); } }
  .som { width: 58px; height: 58px; border-radius: 50%; padding: 0; font-size: 1.5rem; }
  .retorno { min-height: 3.2rem; margin-top: 14px; font-weight: 800; font-size: 1.15rem; }
  .retorno.bom { color: #2b8a3e; } .retorno.ruim { color: #c92a2a; }
  .ouvi { color: #6c7086; font-weight: 700; font-size: .95rem; }
  .estrelas { font-size: 4rem; letter-spacing: 6px; }
  .estrelas span { opacity: .2; filter: grayscale(1); } .estrelas span.ganha { opacity: 1; filter: none; }
  .aviso { background: #fff3bf; border-left: 5px solid #fab005; border-radius: 10px; padding: 12px 14px; text-align: left; font-weight: 700; }
</style>

<main>
  <div class="topo">
    <h1 id="titulo">🎤 Speak!</h1>
    <div class="pontinhos" id="pontinhos"></div>
  </div>
  <div id="area"></div>
</main>

<script>
  (function () {
    const area = document.getElementById('area');
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
    const URL_APP = /^https:\/\/script\.google\.com\/[\w.\/-]+\/exec$/; // só volta para um app do Google Apps Script

    function lerDados() {
      try {
        const b64 = location.hash.slice(1).replace(/-/g, '+').replace(/_/g, '/');
        const bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
        const d = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
        if (!d || !Array.isArray(d.p) || !d.p.length || !d.id) return null;
        d.r = URL_APP.test(d.r || '') ? d.r : '';
        return d;
      } catch (e) { return null; }
    }
    const b64url = (txt) => {
      let bin = '';
      new TextEncoder().encode(txt).forEach((b) => (bin += String.fromCharCode(b)));
      return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    // ---------- Comparar o que a criança falou ----------
    const NUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
      thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
      fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
    function emNumero(txt) {
      const t = txt.replace(/-/g, ' ').trim();
      if (t === 'one hundred' || t === 'a hundred' || t === 'hundred') return '100';
      const partes = t.split(' ');
      if (partes.length === 1 && NUM[partes[0]] !== undefined) return String(NUM[partes[0]]);
      if (partes.length === 2 && NUM[partes[0]] >= 20 && NUM[partes[1]] < 10) return String(NUM[partes[0]] + NUM[partes[1]]);
      return null;
    }
    function distancia(a, b) {
      const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
      for (let j = 1; j <= b.length; j++) d[0][j] = j;
      for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      return d[a.length][b.length];
    }
    function confere(alvo, ouvidas) {
      const a = normalizarFala(alvo), semEspaco = a.replace(/ /g, ''), num = emNumero(a);
      return ouvidas.some((o) => {
        const x = normalizarFala(o);
        if (!x) return false;
        if (x === a || x.replace(/ /g, '') === semEspaco || (num && x.split(' ').includes(num))) return true;
        // A criança pode falar "it's a cat": basta a palavra aparecer.
        if ((' ' + x + ' ').includes(' ' + a + ' ')) return true;
        // Pequena tolerância para palavras longas (sotaque, plural).
        return semEspaco.length >= 5 && distancia(x.replace(/ /g, ''), semEspaco) <= 1;
      });
    }

    // ---------- Jogo ----------
    const dados = lerDados();
    if (!dados) {
      area.innerHTML = '<div class="cartao"><div class="fig">🎤</div><p>Abra o <strong>Speak!</strong> pelo English Kids App, dentro de um tema.</p></div>';
      return;
    }
    document.title = 'Speak! – ' + (dados.tt || 'English Kids');
    document.getElementById('titulo').textContent = '🎤 Speak! · ' + (dados.tt || '');
    Fala.velocidade = Number(dados.vel) || 0.85;
    const palavras = dados.p.map(([en, pt, figura]) => ({ en: String(en), pt: String(pt || ''), figura: String(figura || '') }));
    const resultado = {};
    const inicio = Date.now();
    let acertos = 0, micBloqueado = false;
    document.getElementById('pontinhos').innerHTML = palavras.map(() => '<i></i>').join('');
    const pontos = () => [...document.querySelectorAll('#pontinhos i')];

    async function rodada(i) {
      const p = palavras[i], r = (resultado[p.en] = { a: 0, e: 0, c: 0 });
      pontos().forEach((x, k) => x.classList.toggle('agora', k === i));
      let tentativas = 0;
      await new Promise((proxima) => {
        area.innerHTML = `<div class="cartao">
            ${p.figura ? `<div class="fig">${esc(p.figura)}</div>` : `<div class="fig texto">${esc(p.pt)}</div>`}
            <div class="en">${esc(p.en)}</div><div class="pt">${p.figura ? esc(p.pt) : ''}</div>
            <div class="linha">
              <button class="bt claro som" id="ouvir" aria-label="Ouvir">🔊</button>
              <button class="bt mic" id="falar" aria-label="Falar">🎤</button>
              <button class="bt claro som" id="devagar" aria-label="Ouvir devagar">🐢</button>
            </div>
            <div class="retorno" id="retorno">Ouça e depois toque no 🎤 para falar.</div>
            <div class="ouvi" id="ouvi"></div>
            <div class="linha"><button class="bt claro" id="pular">Pular ➡</button></div>
          </div>`;
        const ret = document.getElementById('retorno'), ouvi = document.getElementById('ouvi'), mic = document.getElementById('falar');
        document.getElementById('ouvir').onclick = () => Fala.falar(p.en);
        document.getElementById('devagar').onclick = () => Fala.falar(p.en, true);
        document.getElementById('pular').onclick = () => { pontos()[i].className = 'pulou'; proxima(); };
        mic.onclick = async () => {
          if (mic.disabled) return;
          mic.disabled = true;
          ret.className = 'retorno';
          ret.textContent = 'Preparando…';
          try {
            const ouvidas = await Escuta.ouvir({ segundos: 6, aoComecar: () => { mic.classList.add('ouvindo'); ret.textContent = '🔴 Pode falar!'; } });
            mic.classList.remove('ouvindo');
            ouvi.textContent = 'Ouvi: "' + ouvidas[0] + '"';
            if (confere(p.en, ouvidas)) {
              r.c = 1;
              if (!tentativas) { r.a = 1; acertos++; }
              pontos()[i].className = tentativas ? 'meio' : 'feito';
              ret.className = 'retorno bom';
              ret.textContent = tentativas ? '👍 Good job!' : '🌟 Excellent!';
              await Fala.falar(tentativas ? 'Good job!' : 'Excellent!');
              await espera(500);
              proxima();
              return;
            }
            tentativas++;
            r.e = Math.min(5, r.e + 1);
            ret.className = 'retorno ruim';
            if (tentativas >= 3) {
              ret.textContent = 'Quase! Vamos para a próxima.';
              pontos()[i].className = 'pulou';
              await Fala.falar(p.en);
              await espera(900);
              proxima();
              return;
            }
            ret.textContent = 'Quase! Ouça de novo e tente outra vez. 💪';
            await Fala.falar(p.en);
          } catch (erro) {
            mic.classList.remove('ouvindo');
            if (erro.codigo === 'not-allowed' || erro.codigo === 'service-not-allowed' || erro.codigo === 'audio-capture') {
              micBloqueado = true;
              area.innerHTML = `<div class="cartao"><div class="fig">🔇</div>
                <div class="aviso">O microfone está bloqueado neste aparelho (${esc(erro.codigo)}). Clique no cadeado ao lado do endereço &gt; Microfone &gt; Permitir e recarregue a página. Se não aparecer essa opção, peça ajuda ao professor.</div>
                <div class="linha"><button class="bt" onclick="location.reload()">🔄 Tentar de novo</button></div></div>`;
              return;
            }
            ret.className = 'retorno ruim';
            ret.textContent = erro.mensagem;
          } finally {
            const m = document.getElementById('falar');
            if (m) m.disabled = false;
          }
        };
        setTimeout(() => Fala.falar(p.en), 300);
      });
    }

    async function salvar(final) {
      const status = document.getElementById('status');
      // 1º caminho: avisar a aba do app que abriu esta.
      if (window.opener && !window.opener.closed) {
        const confirmado = await new Promise((ok) => {
          const ouvir = (ev) => {
            if (ev.data && ev.data.tipo === 'speak-ok' && ev.data.id === dados.id) { window.removeEventListener('message', ouvir); ok(true); }
          };
          window.addEventListener('message', ouvir);
          try { window.opener.postMessage(Object.assign({ tipo: 'speak-resultado' }, final), '*'); } catch (e) { /* segue para o plano B */ }
          setTimeout(() => { window.removeEventListener('message', ouvir); ok(false); }, 3500);
        });
        if (confirmado) {
          status.innerHTML = '✅ Estrelas salvas! Esta aba vai fechar e você volta para o English Kids.';
          await espera(2200);
          window.close();
          status.innerHTML = '✅ Estrelas salvas! Pode fechar esta aba e voltar para o English Kids.';
          return;
        }
      }
      // 2º caminho: voltar para o app levando o resultado.
      if (dados.r) {
        status.innerHTML = '💾 Salvando no English Kids…';
        await espera(800);
        location.href = dados.r + '?speak=' + b64url(JSON.stringify(final));
        return;
      }
      status.textContent = 'Não consegui salvar automaticamente. Volte ao English Kids e jogue de novo.';
    }

    (async function jogar() {
      area.innerHTML = `<div class="cartao"><div class="fig">🎤</div><div class="en">Speak!</div>
        <p>Você vai ver e ouvir ${palavras.length} palavras. Toque no 🎤 e fale em inglês.<br>O Chrome confere se entendeu. Você tem 3 tentativas por palavra.</p>
        <div class="linha"><button class="bt" id="comecar">Começar ▶</button></div></div>`;
      await new Promise((ok) => (document.getElementById('comecar').onclick = ok));
      await Fala.iniciar();
      for (let i = 0; i < palavras.length; i++) {
        await rodada(i);
        if (micBloqueado) return;
      }
      const pct = (acertos / palavras.length) * 100;
      const estrelas = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
      const final = { id: dados.id, t: dados.t, palavras: resultado, acertos, total: palavras.length, estrelas, segundos: Math.round((Date.now() - inicio) / 1000) };
      const frase = estrelas === 3 ? 'Excellent!' : estrelas === 2 ? 'Great job!' : 'Good try!';
      area.innerHTML = `<div class="cartao"><div class="estrelas">${[1, 2, 3].map((n) => `<span class="${n <= estrelas ? 'ganha' : ''}">⭐</span>`).join('')}</div>
        <div class="en">${frase}</div><p style="font-weight:700">${acertos} de ${palavras.length} certas de primeira</p>
        <p id="status" style="font-weight:800">💾 Salvando…</p></div>`;
      Fala.falar(frase);
      salvar(final);
    })();
  })();
</script>

</body>
</html>
````

---

## 8. Documentação do projeto

### Arquivo: `README.md`

````markdown
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
| + | Speak!: pronúncia com microfone, numa página externa (GitHub Pages `english-kids-speak`) que devolve as estrelas ao app | ✅ entregue |
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
| `Fala.html` | Voz em inglês e reconhecimento de voz do Chrome |
| `Teste.html` / `TesteConteudo.html` | Teste de voz e microfone (`?teste=1`) |
| `Estilo.html` / `Marca.html` | Estilos compartilhados e marca do cabeçalho (bandeira + nome) |

## Privacidade

Os dados dos alunos ficam somente na planilha do professor, dentro da conta Google da escola. A voz e o reconhecimento de voz são os do próprio Chrome, e nada é gravado. A geração de temas com IA, que é opcional, envia apenas o conteúdo pedagógico.

## Autor

Lindomar Andrade Gertrudes, professor de Língua Inglesa.
````

### Arquivo: `GUIA-INSTALACAO.md`

````markdown
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
````
