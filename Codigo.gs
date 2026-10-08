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
  Alunos: ['email', 'nome', 'turma', 'avatar', 'cadastrado_em', 'atualizado_em', 'visual_json', 'teste'],
  Temas: ['id', 'serie', 'trimestre', 'mes', 'titulo', 'titulo_pt', 'conteudo', 'palavras_json', 'frases_json', 'status', 'criado_em', 'atualizado_em'],
  Progresso: ['email', 'turma', 'tema_id', 'dominio_json', 'estrelas_json', 'jogadas', 'segundos', 'atualizado_em'],
  Jogadas: ['id', 'email', 'turma', 'tema_id', 'jogo', 'acertos', 'total', 'estrelas', 'segundos', 'palavras_json', 'jogado_em'],
  Questionarios: ['id', 'tipo', 'serie', 'mes', 'titulo', 'temas_json', 'questoes_json', 'status', 'criado_em'],
  Respostas: ['questionario_id', 'email', 'turma', 'pontuacao', 'total', 'percentual', 'detalhe_json', 'origem', 'respondido_em'],
  Equipes: ['mes', 'turma', 'equipe', 'email', 'nome', 'nivel', 'media', 'aplicado_em'],
  Sessoes: ['id', 'missao_id', 'turma', 'serie', 'mes', 'status', 'aberta_ms', 'fechada_ms', 'reabertos_json'],
  MissoesFeitas: ['id', 'sessao_id', 'missao_id', 'email', 'turma', 'mes', 'tipo', 'degrau', 'pontos', 'detalhe_json', 'feito_em'],
  Projetos: ['id', 'serie', 'mes', 'titulo', 'instrucoes', 'tema_id', 'criterios_json', 'vale_nota', 'status', 'criado_em'],
  Entregas: ['id', 'projeto_id', 'email', 'turma', 'arquivo_id', 'autoavaliacao', 'enviado_em', 'faces_json', 'recado', 'nota', 'avaliado_em'],
};

const CONFIG_PADRAO = [
  ['dominio', 'edu.joinville.sc.gov.br', 'Domínio dos e-mails da escola, sem @. Vazio = aceita qualquer conta.'],
  ['professores', '', 'E-mails com acesso ao painel do professor, separados por vírgula.'],
  ['cadastro_aberto', 'SIM', 'SIM = alunos podem se cadastrar; NÃO = novos cadastros bloqueados.'],
  ['velocidade_voz', 0.85, 'Velocidade da voz em inglês nos jogos (0,5 = bem devagar; 1 = normal).'],
  ['tamanho_max_grupo', 5, 'Alunos por equipe sugerido ao abrir uma turma (você pode mudar na hora de formar as equipes).'],
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
  // Pasta das fotos dos miniprojetos (também faz o Google pedir a permissão do Drive).
  pastaProjetos_();

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

/**
 * Lê uma aba como lista de objetos. Datas viram texto (google.script.run não transporta Date).
 * Na aba Alunos, o "aluno teste" do professor fica de fora, a não ser que incluirTeste seja true.
 */
function lerTabela_(nome, incluirTeste) {
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
    .filter(function (o) { return cab.some(function (c) { return o[c] !== ''; }); })
    .filter(function (o) { return nome !== 'Alunos' || incluirTeste || String(o.teste) !== 'SIM'; });
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
  if (dominio && !email.endsWith('@' + dominio) && !ehProfessor_(email, cfg)) {
    throw new Error('Use a sua conta Google da escola (@' + dominio + '). Você entrou como ' + email + '.');
  }
}

// ============================================================
// Páginas
// ============================================================

function doGet(e) {
  try {
    const email = usuarioAtual_();
    // ?aluno=1: o professor abre a tela da criança como "aluno teste".
    const comoAluno = e && e.parameter && e.parameter.aluno;
    const pagina = ehProfessor_(email) && !comoAluno ? 'Professor' : 'Aluno';
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
  const aluno = lerTabela_('Alunos', true).filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
  if (!aluno && ehProfessor_(email, cfg)) throw new Error('Para ver o app como criança, abra o painel do professor e use "Ver o app como aluno" (aba Turmas).');
  const serie = aluno ? serieDaTurma_(String(aluno.turma)) : '';
  const temas = aluno ? temasDoAluno_(serie) : [];
  const progresso = aluno ? resumoProgressoAluno_(email, temas) : null;
  return {
    email: email,
    cadastroAberto: String(cfg.cadastro_aberto).toUpperCase() !== 'NÃO' && String(cfg.cadastro_aberto).toUpperCase() !== 'NAO',
    turmas: listarTurmas_(),
    avatares: AVATARES,
    velocidadeVoz: velocidadeVoz_(cfg),
    aluno: aluno ? { nome: String(aluno.nome), turma: String(aluno.turma), serie: serie, avatar: avatarValido_(String(aluno.avatar)) } : null,
    temas: temas,
    jogos: Object.keys(JOGOS).map(function (k) { return { id: k, nome: JOGOS[k].nome }; }),
    progresso: progresso,
    urlApp: ScriptApp.getService().getUrl(),
    avaliacoes: aluno ? avaliacoesPendentes_(email, serie) : [],
    equipe: aluno ? equipeSegura_(email, String(aluno.turma)) : null,
    missoes: aluno ? missoesSeguras_(email, String(aluno.turma)) : [],
    narrativa: aluno ? narrativaSegura_(email, serie, progresso, aluno) : null,
    rotina: aluno ? rotinaSegura_(email, temas, progresso, aluno) : null,
    projetos: aluno ? projetosSeguros_(email, serie) : [],
    teste: !!(aluno && String(aluno.teste) === 'SIM'),
  };
}

/** As missões são um extra da tela inicial: se der erro, o resto da tela abre normalmente. */
function missoesSeguras_(email, turma) {
  try { return missoesDoAluno_(email, turma); } catch (e) { return []; }
}

/** A equipe é um extra da tela inicial: se der erro, a criança continua jogando normalmente. */
function equipeSegura_(email, turma) {
  try { return equipeDoAluno_(email, turma); } catch (e) { return null; }
}

function alunoCadastrar(nome, turma, avatar) {
  const email = usuarioAtual_();
  const cfg = lerConfig_();
  validarAluno_(email, cfg);
  if (ehProfessor_(email, cfg)) throw new Error('Professor: use "Ver o app como aluno" na aba Turmas do painel.');
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
  const aluno = lerTabela_('Alunos', true).filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
  if (!aluno) throw new Error('Cadastro não encontrado. Recarregue a página.');
  return { email: email, turma: String(aluno.turma), nome: String(aluno.nome), teste: String(aluno.teste) === 'SIM', linha: aluno };
}

function alunoTrocarAvatar(avatar) {
  const email = usuarioAtual_();
  validarAluno_(email, lerConfig_());
  comTrava_(function () {
    const aluno = lerTabela_('Alunos', true).filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
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
      cadastrado_em: cadastro, atualizado_em: new Date(), visual_json: String(atual.visual_json || ''), teste: String(atual.teste || ''),
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
