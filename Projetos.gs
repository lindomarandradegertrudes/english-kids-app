/**
 * Etapa 4 (rotina): miniprojetos.
 *
 * O professor cria um miniprojeto para a série (ex.: "Cartaz do meu bichinho"), com instruções e até 4 critérios.
 * A criança faz o trabalho no papel, tira uma foto no Chromebook e envia, dizendo como achou que ficou (😀 🙂 😐).
 * As fotos ficam numa pasta do Drive do professor ("English Kids App – Projetos").
 * O professor avalia cada critério com 3 carinhas: 😀 = 100, 🙂 = 70, 😐 = 40. A nota é a média.
 * Se o projeto "vale nota", ela entra em Respostas como "PRJ-<id>" (origem 'projeto') e conta no nível como um quiz.
 * O professor também pode avaliar quem entregou no papel, sem foto.
 */

const CRITERIOS_PADRAO = ['Usou as palavras do tema em inglês', 'Capricho e criatividade', 'Apresentou ou explicou o trabalho'];
const VALOR_FACE = { 3: 100, 2: 70, 1: 40 };
const MAX_FOTO_BYTES = 4 * 1024 * 1024;

function abaProjetos_(nome) {
  return abaMissoes_(nome);
}

function lerProjetos_() {
  abaProjetos_('Projetos');
  return lerTabela_('Projetos').map(function (p) {
    let criterios = [];
    try { criterios = JSON.parse(p.criterios_json || '[]'); } catch (e) { /* vazio */ }
    return {
      _linha: p._linha, id: String(p.id), serie: String(p.serie), mes: mesDe_(p.mes), titulo: String(p.titulo),
      instrucoes: String(p.instrucoes || ''), tema_id: String(p.tema_id || ''),
      criterios: Array.isArray(criterios) && criterios.length ? criterios.map(String) : CRITERIOS_PADRAO.slice(),
      vale_nota: String(p.vale_nota) !== 'NÃO', status: String(p.status) === 'encerrado' ? 'encerrado' : 'aberto',
      criado_em: String(p.criado_em),
    };
  });
}

function buscarProjeto_(id) {
  const p = lerProjetos_().filter(function (x) { return x.id === String(id); })[0];
  if (!p) throw new Error('Miniprojeto não encontrado. Recarregue a página.');
  return p;
}

function lerEntregas_() {
  abaProjetos_('Entregas');
  return lerTabela_('Entregas').map(converterEntrega_);
}

function converterEntrega_(e) {
  let faces = [];
  try { faces = JSON.parse(e.faces_json || '[]'); } catch (err) { /* vazio */ }
  return {
    _linha: e._linha, id: String(e.id), projeto_id: String(e.projeto_id), email: String(e.email).toLowerCase(), turma: String(e.turma),
    arquivo_id: String(e.arquivo_id || ''), autoavaliacao: Number(e.autoavaliacao) || 0, enviado_em: String(e.enviado_em || ''),
    faces: Array.isArray(faces) ? faces.map(function (f) { return Number(f) || 0; }) : [], recado: String(e.recado || ''),
    nota: e.nota === '' || e.nota == null ? null : Number(e.nota), avaliado_em: String(e.avaliado_em || ''),
  };
}

/** Entregas de um aluno (busca pela planilha). */
function entregasDoAluno_(email) {
  const aba = abaProjetos_('Entregas');
  const n = aba.getLastRow() - 1;
  if (n < 1) return [];
  const cab = CABECALHOS.Entregas;
  return aba.getRange(2, cab.indexOf('email') + 1, n, 1).createTextFinder(email).matchEntireCell(true).matchCase(false).findAll()
    .map(function (c) {
      const v = aba.getRange(c.getRow(), 1, 1, cab.length).getValues()[0];
      const o = { _linha: c.getRow() };
      cab.forEach(function (k, i) { o[k] = v[i]; });
      return converterEntrega_(o);
    })
    .filter(function (e) { return e.email === email; });
}

/** Quantos miniprojetos a criança já entregou (com foto ou avaliado no papel). Para as medalhas. */
function projetosEntregues_(email) {
  try { return entregasDoAluno_(email).filter(function (e) { return e.arquivo_id || e.nota != null; }).length; }
  catch (e) { return 0; }
}

function gravarEntrega_(e) {
  const aba = abaProjetos_('Entregas');
  const linha = linhaDe_('Entregas', {
    id: e.id, projeto_id: e.projeto_id, email: e.email, turma: e.turma, arquivo_id: e.arquivo_id, autoavaliacao: e.autoavaliacao || '',
    enviado_em: e.enviado_em || '', faces_json: e.faces && e.faces.length ? JSON.stringify(e.faces) : '', recado: e.recado || '',
    nota: e.nota == null ? '' : e.nota, avaliado_em: e.avaliado_em || '',
  });
  if (e._linha) aba.getRange(e._linha, 1, 1, linha.length).setValues([linha]);
  else aba.appendRow(linha);
}

/** Pasta do Drive onde ficam as fotos (criada na primeira vez). */
function pastaProjetos_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PASTA_PROJETOS');
  if (id) {
    try { const p = DriveApp.getFolderById(id); if (!p.isTrashed()) return p; } catch (e) { /* pasta apagada: cria outra */ }
  }
  const pasta = DriveApp.createFolder('English Kids App – Projetos');
  props.setProperty('PASTA_PROJETOS', pasta.getId());
  return pasta;
}

// ============================================================
// Área do aluno
// ============================================================

/** Miniprojetos abertos da série e os já avaliados (para a criança ver as carinhas e o recado). */
function projetosDoAluno_(email, serie) {
  const projetos = lerProjetos_().filter(function (p) { return p.serie === serie; });
  if (!projetos.length) return [];
  const minhas = {};
  entregasDoAluno_(email).forEach(function (e) { minhas[e.projeto_id] = e; });
  return projetos
    .filter(function (p) { return p.status === 'aberto' || (minhas[p.id] && minhas[p.id].nota != null); })
    .map(function (p) {
      const e = minhas[p.id];
      return {
        id: p.id, titulo: p.titulo, instrucoes: p.instrucoes, aberto: p.status === 'aberto', criterios: p.criterios,
        enviado: !!(e && e.arquivo_id), enviado_em: e ? e.enviado_em : '', autoavaliacao: e ? e.autoavaliacao : 0,
        avaliado: !!(e && e.nota != null), faces: e ? e.faces : [], recado: e ? e.recado : '',
      };
    })
    .sort(function (a, b) { return (b.aberto - a.aberto) || (a.enviado - b.enviado); })
    .slice(0, 4);
}

function projetosSeguros_(email, serie) {
  try { return projetosDoAluno_(email, serie); } catch (e) { return []; }
}

/** A criança envia (ou troca) a foto do trabalho. dataUrl = "data:image/jpeg;base64,...". */
function alunoEnviarProjeto(projetoId, dataUrl, autoavaliacao) {
  const aluno = alunoAtual_();
  const p = buscarProjeto_(projetoId);
  if (p.serie !== serieDaTurma_(aluno.turma)) throw new Error('Este miniprojeto não é da sua turma.');
  if (p.status !== 'aberto') throw new Error('Este miniprojeto já foi encerrado pelo professor.');
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+\/=]+)$/.exec(String(dataUrl || ''));
  if (!m) throw new Error('A foto não chegou. Tente de novo.');
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > MAX_FOTO_BYTES) throw new Error('A foto ficou grande demais. Tente de novo.');

  const nome = aluno.turma + ' - ' + aluno.nome + ' - ' + p.titulo + '.' + (m[1] === 'image/png' ? 'png' : m[1] === 'image/webp' ? 'webp' : 'jpg');
  const arquivo = pastaProjetos_().createFile(Utilities.newBlob(bytes, m[1], nome));
  const id = p.id + '|' + aluno.email;
  const atual = entregasDoAluno_(aluno.email).filter(function (e) { return e.projeto_id === p.id; })[0];
  if (atual && atual.arquivo_id) {
    try { DriveApp.getFileById(atual.arquivo_id).setTrashed(true); } catch (e) { /* foto antiga já removida */ }
  }
  const nova = Object.assign(atual || { id: id, projeto_id: p.id, email: aluno.email, faces: [], recado: '', nota: null, avaliado_em: '' }, {
    turma: aluno.turma, arquivo_id: arquivo.getId(), autoavaliacao: inteiro_(autoavaliacao, 0, 3),
    enviado_em: Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm'),
  });
  gravarEntrega_(nova);
  return projetosDoAluno_(aluno.email, serieDaTurma_(aluno.turma));
}

// ============================================================
// Painel do professor
// ============================================================

function profListarProjetos() {
  exigirProfessor_();
  const entregas = lerEntregas_();
  const alunos = {};
  lerTabela_('Alunos').forEach(function (a) { alunos[String(a.email).toLowerCase()] = true; });
  return lerProjetos_().map(function (p) {
    const minhas = entregas.filter(function (e) { return e.projeto_id === p.id && alunos[e.email]; });
    delete p._linha;
    p.enviados = minhas.filter(function (e) { return e.arquivo_id; }).length;
    p.avaliados = minhas.filter(function (e) { return e.nota != null; }).length;
    return p;
  }).sort(function (a, b) { return b.mes.localeCompare(a.mes) || a.serie.localeCompare(b.serie) || a.titulo.localeCompare(b.titulo); });
}

function profSalvarProjeto(dados) {
  exigirProfessor_();
  const titulo = textoLimpo_(dados.titulo, 80);
  if (!titulo) throw new Error('Dê um título ao miniprojeto.');
  if (SERIES.indexOf(dados.serie) === -1) throw new Error('Escolha a série.');
  const mes = String(dados.mes || mesAtual_());
  if (!/^\d{4}-\d{2}$/.test(mes)) throw new Error('Mês inválido.');
  const criterios = (dados.criterios || []).map(function (c) { return textoLimpo_(c, 80); }).filter(String).slice(0, 4);
  if (!criterios.length) throw new Error('Escreva pelo menos um critério.');
  const instrucoes = String(dados.instrucoes || '').replace(/\r/g, '').trim().slice(0, 800);
  comTrava_(function () {
    const aba = abaProjetos_('Projetos');
    const atual = dados.id ? lerProjetos_().filter(function (p) { return p.id === String(dados.id); })[0] : null;
    if (dados.id && !atual) throw new Error('Miniprojeto não encontrado. Recarregue a página.');
    const linha = linhaDe_('Projetos', {
      id: atual ? atual.id : 'PJ' + Utilities.getUuid().slice(0, 8), serie: dados.serie, mes: "'" + mes, titulo: titulo,
      instrucoes: instrucoes, tema_id: String(dados.tema_id || ''), criterios_json: JSON.stringify(criterios),
      vale_nota: dados.vale_nota === false ? 'NÃO' : 'SIM', status: atual ? atual.status : 'aberto', criado_em: atual ? atual.criado_em : new Date(),
    });
    if (atual) aba.getRange(atual._linha, 1, 1, linha.length).setValues([linha]);
    else aba.appendRow(linha);
  });
  return profListarProjetos();
}

function profStatusProjeto(id, status) {
  exigirProfessor_();
  const p = buscarProjeto_(id);
  aba_('Projetos').getRange(p._linha, CABECALHOS.Projetos.indexOf('status') + 1).setValue(status === 'encerrado' ? 'encerrado' : 'aberto');
  return profListarProjetos();
}

function profExcluirProjeto(id) {
  exigirProfessor_();
  const p = buscarProjeto_(id);
  if (lerEntregas_().some(function (e) { return e.projeto_id === p.id; })) {
    throw new Error('Este miniprojeto já tem fotos ou avaliações. Use "Encerrar" em vez de excluir.');
  }
  aba_('Projetos').deleteRow(p._linha);
  return profListarProjetos();
}

/** Alunos de uma turma com a entrega de cada um. */
function profProjetoTurma(id, turma) {
  exigirProfessor_();
  validarTurma_(turma);
  const p = buscarProjeto_(id);
  delete p._linha;
  const entregas = {};
  lerEntregas_().forEach(function (e) { if (e.projeto_id === p.id) entregas[e.email] = e; });
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === turma; }).map(function (a) {
    const email = String(a.email).toLowerCase(), e = entregas[email];
    return {
      email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)),
      foto: !!(e && e.arquivo_id), enviado_em: e ? e.enviado_em : '', autoavaliacao: e ? e.autoavaliacao : 0,
      faces: e ? e.faces : [], recado: e ? e.recado : '', nota: e ? e.nota : null,
    };
  }).sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  return { projeto: p, turma: turma, alunos: alunos };
}

/** Foto de uma entrega como data URL (para mostrar no painel sem depender de permissões do Drive). */
function profFotoEntrega(id, email) {
  exigirProfessor_();
  const e = lerEntregas_().filter(function (x) { return x.projeto_id === String(id) && x.email === String(email).toLowerCase(); })[0];
  if (!e || !e.arquivo_id) throw new Error('Este aluno ainda não enviou foto.');
  const arquivo = DriveApp.getFileById(e.arquivo_id);
  const blob = arquivo.getBlob();
  return { dataUrl: 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()), url: arquivo.getUrl() };
}

/** Avalia um aluno: faces = uma carinha por critério (3 😀, 2 🙂, 1 😐). Também serve para trabalho entregue no papel. */
function profAvaliarEntrega(id, email, faces, recado) {
  exigirProfessor_();
  const p = buscarProjeto_(id);
  email = String(email || '').toLowerCase();
  const aluno = lerTabela_('Alunos').filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
  if (!aluno) throw new Error('Aluno não encontrado. Recarregue a página.');
  if (serieDaTurma_(String(aluno.turma)) !== p.serie) throw new Error('Este aluno não é da série do miniprojeto.');
  const lista = p.criterios.map(function (_, i) { return inteiro_((faces || [])[i], 0, 3); });
  if (lista.some(function (f) { return !f; })) throw new Error('Escolha uma carinha para cada critério.');
  const nota = Math.round(lista.reduce(function (s, f) { return s + VALOR_FACE[f]; }, 0) / lista.length);
  comTrava_(function () {
    const atual = entregasDoAluno_(email).filter(function (e) { return e.projeto_id === p.id; })[0];
    gravarEntrega_(Object.assign(atual || { id: p.id + '|' + email, projeto_id: p.id, email: email, arquivo_id: '', autoavaliacao: 0, enviado_em: '' }, {
      turma: String(aluno.turma), faces: lista, recado: String(recado || '').trim().slice(0, 200), nota: nota,
      avaliado_em: Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm'),
    }));
    if (p.vale_nota) {
      gravarResposta_({ id: 'PRJ-' + p.id }, email, String(aluno.turma), {
        pontuacao: nota, total: 100, percentual: nota, detalhe: { faces: lista },
      }, 'projeto');
    }
  });
  return profProjetoTurma(p.id, String(aluno.turma));
}

/** "Questionários virtuais" dos miniprojetos que valem nota (para relatórios e ficha do aluno). */
function questionariosDeProjetos_() {
  try {
    return lerProjetos_().map(function (p) {
      return { id: 'PRJ-' + p.id, tipo: 'projeto', serie: p.serie, mes: p.mes, titulo: 'Miniprojeto: ' + p.titulo, questoes: [], status: 'encerrado' };
    });
  } catch (e) {
    return [];
  }
}
