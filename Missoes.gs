/**
 * Missões do mês (valem nota).
 *
 * - O professor ABRE uma missão para a turma na aula com Chromebook e FECHA no fim (uma "aula de missão").
 * - Quem faltou ou não terminou: o professor REABRE só para essas crianças.
 * - Cada criança faz a missão comum (4 desafios, 0–100) e depois uma mini-missão de REFORÇO (~5 min, 0–100)
 *   com as palavras que mais erra. Vale só a 1ª vez de cada uma.
 * - Nota do mês = média de todas as missões feitas no mês (comum + reforço), gravada em Respostas
 *   como "MIS-aaaa-mm" (origem 'missoes'). Entra no nível com o mesmo peso de um quiz.
 *   Quem não fez nenhuma missão no mês fica sem nota (não zero).
 * - Degrau pelo nível: Iniciante ou sem avaliação = 1, Básico/Intermediário = 2, Avançado = 3.
 */

const COL_SESSOES = ['id', 'missao_id', 'turma', 'serie', 'mes', 'status', 'aberta_ms', 'fechada_ms', 'reabertos_json'];
const COL_FEITAS = ['id', 'sessao_id', 'missao_id', 'email', 'turma', 'mes', 'tipo', 'degrau', 'pontos', 'detalhe_json', 'feito_em'];
const TOLERANCIA_FECHAMENTO_MS = 10 * 60 * 1000; // resultado que chega da fila até 10 min depois de a aula fechar ainda vale
const NOMES_MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// ============================================================
// Abas (criadas sozinhas se ainda não existirem)
// ============================================================

function abaMissoes_(nome) {
  const ss = planilha_();
  let aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
    const cab = CABECALHOS[nome];
    aba.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#ffe8cc');
    aba.setFrozenRows(1);
  }
  return aba;
}

function lerSessoes_() {
  abaMissoes_('Sessoes');
  return lerTabela_('Sessoes').map(function (s) {
    let reabertos = [];
    try { reabertos = JSON.parse(s.reabertos_json || '[]'); } catch (e) { /* vazio */ }
    return {
      _linha: s._linha, id: String(s.id), missao_id: String(s.missao_id), turma: String(s.turma), serie: String(s.serie),
      mes: String(s.mes), status: String(s.status) === 'aberta' ? 'aberta' : 'fechada',
      aberta_ms: Number(s.aberta_ms) || 0, fechada_ms: Number(s.fechada_ms) || 0,
      reabertos: Array.isArray(reabertos) ? reabertos.map(function (e) { return String(e).toLowerCase(); }) : [],
    };
  });
}

function lerFeitas_() {
  abaMissoes_('MissoesFeitas');
  return lerTabela_('MissoesFeitas').map(converterFeita_);
}

function converterFeita_(f) {
  return {
    id: String(f.id), sessao_id: String(f.sessao_id), missao_id: String(f.missao_id), email: String(f.email).toLowerCase(),
    turma: String(f.turma), mes: String(f.mes), tipo: String(f.tipo), degrau: Number(f.degrau) || 1,
    pontos: Number(f.pontos) || 0, detalhe: jsonObj_(f.detalhe_json),
  };
}

/** Missões feitas por um aluno (busca pela planilha, sem ler a aba inteira). */
function feitasDoAluno_(email) {
  const aba = abaMissoes_('MissoesFeitas');
  const n = aba.getLastRow() - 1;
  if (n < 1) return [];
  const col = COL_FEITAS.indexOf('email') + 1;
  return aba.getRange(2, col, n, 1).createTextFinder(email).matchEntireCell(true).matchCase(false).findAll()
    .map(function (c) {
      const v = aba.getRange(c.getRow(), 1, 1, COL_FEITAS.length).getValues()[0];
      const o = {};
      COL_FEITAS.forEach(function (k, i) { o[k] = v[i]; });
      return converterFeita_(o);
    })
    .filter(function (f) { return f.email === email; });
}

function gravarSessao_(s) {
  const aba = abaMissoes_('Sessoes');
  const linha = linhaDe_('Sessoes', {
    id: s.id, missao_id: s.missao_id, turma: s.turma, serie: s.serie, mes: "'" + s.mes, status: s.status,
    aberta_ms: s.aberta_ms, fechada_ms: s.fechada_ms || '', reabertos_json: JSON.stringify(s.reabertos || []),
  });
  if (s._linha) aba.getRange(s._linha, 1, 1, linha.length).setValues([linha]);
  else aba.appendRow(linha);
}

// ============================================================
// Banco de missões
// ============================================================

function buscarMissao_(id) {
  const m = todasMissoes_().filter(function (x) { return x.id === id; })[0];
  if (!m) throw new Error('Missão não encontrada.');
  return m;
}

function degrauDoNivel_(nivel) {
  return nivel === 'Avançado' ? 3 : nivel === 'Básico' || nivel === 'Intermediário' ? 2 : 1;
}

function temaDaMissao_(m, temas) {
  return (temas || lerTemas_()).filter(function (t) { return t.serie === m.serie && t.titulo.toLowerCase() === m.tema.toLowerCase(); })[0] || null;
}

/** Monta a missão no degrau pedido, já com as palavras do tema (figura e tradução) para a tela. */
function resolverMissao_(m, degrau, tema) {
  const palavras = tema ? tema.palavras : [];
  const porEn = {};
  palavras.forEach(function (p) { porEn[p.en.toLowerCase()] = p; });
  // Palavras de ouvir que saíram do tema são trocadas por outras do mesmo tema.
  const usadas = {};
  const ouvir = m.ouvir[degrau].map(function (en) {
    let p = porEn[en.toLowerCase()];
    if (!p) p = palavras.filter(function (x) { return !usadas[x.en]; })[0];
    if (p) usadas[p.en] = true;
    return p ? p.en : null;
  }).filter(Boolean);
  const sol = m.soletrar[degrau];
  const solP = porEn[sol.en.toLowerCase()] || { en: sol.en, pt: '', figura: '' };
  const hist = {};
  Object.keys(m.historia).forEach(function (k) { hist[k] = m.historia[k][degrau]; });
  return {
    id: m.id, titulo: m.titulo, icone: m.icone, serie: m.serie, mes: m.mes, tema: m.tema, degrau: degrau,
    historia: hist, palavras: palavras, ouvir: ouvir, ler: m.ler[degrau],
    soletrar: { en: solP.en, pt: solP.pt, figura: solP.figura, extras: sol.extras || '' },
    montar: m.montar[degrau],
  };
}

// ============================================================
// Nota do mês
// ============================================================

function idNotaMes_(mes) { return 'MIS-' + mes; }

/** Recalcula a nota de missões do mês do aluno (média de tudo o que ele fez no mês). */
function atualizarNotaMes_(email, turma, mes) {
  const doMes = feitasDoAluno_(email).filter(function (f) { return f.mes === mes; });
  if (!doMes.length) return;
  const media = doMes.reduce(function (s, f) { return s + f.pontos; }, 0) / doMes.length;
  gravarResposta_({ id: idNotaMes_(mes) }, email, turma, {
    pontuacao: Math.round(media), total: 100, percentual: Math.round(media * 10) / 10,
    detalhe: { missoes: doMes.length },
  }, 'missoes');
}

/** Questionários + "questionários virtuais" das notas de missões e dos miniprojetos (para relatórios e ficha do aluno). */
function questionariosEMissoes_(respostas) {
  const lista = lerQuestionarios_().concat(questionariosDeProjetos_());
  const vistos = {};
  (respostas || lerRespostas_()).forEach(function (r) {
    const id = r.questionario_id;
    if (id.indexOf('MIS-') !== 0 || vistos[id]) return;
    vistos[id] = true;
    const mes = id.slice(4);
    lista.push({ id: id, tipo: 'missoes', serie: '', mes: mes, titulo: 'Missões de ' + (NOMES_MESES[Number(mes.slice(5)) - 1] || mes), questoes: [], status: 'encerrado' });
  });
  return lista;
}

// ============================================================
// Área do aluno
// ============================================================

function podeJogar_(s, email) {
  return s.status === 'aberta' || s.reabertos.indexOf(email) !== -1;
}

/** Missões disponíveis agora para o aluno (aulas abertas ou reabertas para ele). */
function missoesDoAluno_(email, turma) {
  const sessoes = lerSessoes_().filter(function (s) { return s.turma === turma && podeJogar_(s, email); });
  if (!sessoes.length) return [];
  const feitas = feitasDoAluno_(email);
  return sessoes.map(function (s) {
    let m;
    try { m = buscarMissao_(s.missao_id); } catch (e) { return null; }
    const daSessao = feitas.filter(function (f) { return f.sessao_id === s.id; });
    const comum = daSessao.filter(function (f) { return f.tipo === 'comum'; })[0];
    const reforco = daSessao.filter(function (f) { return f.tipo === 'reforco'; })[0];
    return {
      sessao_id: s.id, missao_id: m.id, titulo: m.titulo, icone: m.icone,
      comum: comum ? comum.pontos : null, reforco: reforco ? reforco.pontos : null,
    };
  }).filter(Boolean);
}

function sessaoDoAluno_(sessaoId, aluno) {
  const s = lerSessoes_().filter(function (x) { return x.id === String(sessaoId); })[0];
  if (!s || s.turma !== aluno.turma) throw new Error('Esta missão não é da sua turma.');
  return s;
}

function degrauDoAluno_(email) {
  const n = calcularNiveis_(lerConfig_())[email];
  return degrauDoNivel_(n ? n.nivel : '');
}

function alunoAbrirMissao(sessaoId) {
  const aluno = alunoAtual_();
  const s = sessaoDoAluno_(sessaoId, aluno);
  if (!podeJogar_(s, aluno.email)) throw new Error('Esta missão está fechada. Fale com o professor.');
  const m = buscarMissao_(s.missao_id);
  return { sessao_id: s.id, missao: resolverMissao_(m, degrauDoAluno_(aluno.email), temaDaMissao_(m)) };
}

/** Só letras (espaço, hífen e apóstrofo ficam fixos), de 2 a 12 letras. */
function soletravelServ_(en) {
  const l = String(en).replace(/[\s'’-]/g, '');
  return /^[a-z]+$/i.test(l) && l.length >= 2 && l.length <= 12;
}

/**
 * Mini-missão de reforço: 1 Listen & Click + 1 Spell it! com as palavras que a criança mais erra.
 * Ordem de escolha: palavras erradas na missão comum → menor domínio nos jogos → palavras do tema da missão.
 */
function alunoAbrirReforco(sessaoId, errosComum) {
  const aluno = alunoAtual_();
  const s = sessaoDoAluno_(sessaoId, aluno);
  if (!podeJogar_(s, aluno.email)) throw new Error('Esta missão está fechada. Fale com o professor.');
  const m = buscarMissao_(s.missao_id);
  const temas = lerTemas_().filter(function (t) { return t.serie === m.serie; });
  const temaMissao = temaDaMissao_(m, temas);
  const candidatos = [];
  const visto = {};
  const add = function (tema, p) {
    if (!tema || !p || visto[p.en.toLowerCase()]) return;
    visto[p.en.toLowerCase()] = true;
    candidatos.push({ tema: tema, p: p });
  };
  if (temaMissao) {
    (Array.isArray(errosComum) ? errosComum : []).slice(0, 10).forEach(function (en) {
      add(temaMissao, temaMissao.palavras.filter(function (p) { return p.en.toLowerCase() === String(en).toLowerCase(); })[0]);
    });
  }
  const fracas = [];
  progressoDoAluno_(aluno.email).forEach(function (pr) {
    const t = temas.filter(function (x) { return x.id === pr.tema_id && (x.status === 'liberado' || x === temaMissao); })[0];
    if (!t) return;
    t.palavras.forEach(function (p) {
      if (!pr.dominio.hasOwnProperty(p.en)) return;
      const v = Math.min(PONTOS_DOMINIO, Number(pr.dominio[p.en]) || 0);
      if (v < PONTOS_DOMINIO) fracas.push({ tema: t, p: p, v: v });
    });
  });
  fracas.sort(function (a, b) { return a.v - b.v; }).forEach(function (x) { add(x.tema, x.p); });
  if (temaMissao) embaralhar_(temaMissao.palavras).forEach(function (p) { add(temaMissao, p); });
  if (!candidatos.length) throw new Error('Não encontrei palavras para o reforço.');

  const paraOuvir = candidatos.filter(function (c) { return c.tema.palavras.length >= 4; })[0] || candidatos[0];
  const paraSoletrar = candidatos.filter(function (c) { return c !== paraOuvir && soletravelServ_(c.p.en); })[0] ||
    candidatos.filter(function (c) { return soletravelServ_(c.p.en); })[0];
  const degrau = degrauDoAluno_(aluno.email);
  return {
    sessao_id: s.id, degrau: degrau,
    ouvir: { alvo: paraOuvir.p.en, palavras: paraOuvir.tema.palavras },
    soletrar: paraSoletrar
      ? { en: paraSoletrar.p.en, pt: paraSoletrar.p.pt, figura: paraSoletrar.p.figura, extras: degrau === 3 ? 'k' : '' }
      : null,
  };
}

/**
 * Grava o resultado de uma missão (comum ou reforço). r = { id, sessao_id, tipo, degrau, pontos, detalhe, concluido_em }.
 * Se a mesma criança mandar de novo (reenvio da fila), não grava duas vezes.
 */
function alunoSalvarMissao(r) {
  const aluno = alunoAtual_();
  const s = sessaoDoAluno_(r && r.sessao_id, aluno);
  const tipo = r.tipo === 'reforco' ? 'reforco' : 'comum';
  const jaFeita = feitasDoAluno_(aluno.email).some(function (f) { return f.sessao_id === s.id && f.tipo === tipo; });
  if (jaFeita) return { ok: true, repetida: true };
  const concluido = Number(r.concluido_em) || Date.now();
  const dentroDoPrazo = podeJogar_(s, aluno.email) ||
    (s.fechada_ms && concluido >= s.aberta_ms && concluido <= s.fechada_ms + TOLERANCIA_FECHAMENTO_MS);
  if (!dentroDoPrazo) throw new Error('Esta missão foi encerrada pelo professor.');
  const pontos = Math.max(0, Math.min(100, Math.round(Number(r.pontos) || 0)));
  const detalhe = JSON.stringify(r.detalhe || {}).slice(0, 20000);
  abaMissoes_('MissoesFeitas').appendRow(linhaDe_('MissoesFeitas', {
    id: String(r.id || '').slice(0, 60) || ('mf' + Date.now()), sessao_id: s.id, missao_id: s.missao_id, email: aluno.email,
    turma: aluno.turma, mes: "'" + s.mes, tipo: tipo, degrau: inteiro_(r.degrau, 1, 3), pontos: pontos,
    detalhe_json: detalhe, feito_em: new Date(),
  }));
  atualizarNotaMes_(aluno.email, aluno.turma, s.mes);
  return { ok: true, pontos: pontos };
}

// ============================================================
// Painel do professor
// ============================================================

function profMissoesPainel(turma) {
  exigirProfessor_();
  validarTurma_(turma);
  const serie = serieDaTurma_(turma);
  const temas = lerTemas_();
  const todas = todasMissoes_();
  const banco = todas.filter(function (m) { return m.serie === serie; }).map(function (m) {
    return { id: m.id, titulo: m.titulo, icone: m.icone, mes: m.mes, tema: m.tema, temaExiste: !!temaDaMissao_(m, temas), criada: !!m.criada };
  }).sort(function (a, b) { return a.mes.slice(5).localeCompare(b.mes.slice(5)) || a.tema.localeCompare(b.tema) || (a.criada - b.criada); });
  const feitas = lerFeitas_().filter(function (f) { return f.turma === turma; });
  const daTurma = {};
  lerTabela_('Alunos').forEach(function (a) { if (String(a.turma) === turma) daTurma[String(a.email).toLowerCase()] = true; });
  const nAlunos = Object.keys(daTurma).length;
  const sessoes = lerSessoes_().filter(function (s) { return s.turma === turma; })
    .sort(function (a, b) { return b.aberta_ms - a.aberta_ms; })
    .map(function (s) {
      const m = todas.filter(function (x) { return x.id === s.missao_id; })[0];
      return {
        id: s.id, missao_id: s.missao_id, titulo: m ? m.titulo : s.missao_id, icone: m ? m.icone : '🐶', mes: s.mes,
        status: s.status, aberta_ms: s.aberta_ms, fechada_ms: s.fechada_ms, reabertos: s.reabertos.length,
        concluidas: feitas.filter(function (f) { return f.sessao_id === s.id && f.tipo === 'comum' && daTurma[f.email]; }).length, alunos: nAlunos,
      };
    });
  const temasSerie = ordenarTemas_(temas.filter(function (t) { return t.serie === serie; }))
    .map(function (t) { return { id: t.id, titulo: t.titulo, titulo_pt: t.titulo_pt, mes: t.mes }; });
  return { turma: turma, serie: serie, mesAtual: mesAtual_(), banco: banco, sessoes: sessoes, temas: temasSerie };
}

/** Abre uma missão para a turma (fecha antes qualquer outra aula de missão aberta da mesma turma). */
function profAbrirSessao(turma, missaoId) {
  exigirProfessor_();
  validarTurma_(turma);
  const m = buscarMissao_(missaoId);
  const serie = serieDaTurma_(turma);
  if (m.serie !== serie) throw new Error('Esta missão é do ' + m.serie + ' ano.');
  comTrava_(function () {
    const agora = Date.now();
    lerSessoes_().filter(function (s) { return s.turma === turma && s.status === 'aberta'; }).forEach(function (s) {
      s.status = 'fechada'; s.fechada_ms = agora; gravarSessao_(s);
    });
    gravarSessao_({
      id: 'S' + Utilities.getUuid().replace(/-/g, '').slice(0, 8), missao_id: m.id, turma: turma, serie: serie,
      mes: mesAtual_(), status: 'aberta', aberta_ms: agora, fechada_ms: 0, reabertos: [],
    });
  });
  return profMissoesPainel(turma);
}

function sessaoPorId_(id) {
  const s = lerSessoes_().filter(function (x) { return x.id === String(id); })[0];
  if (!s) throw new Error('Aula de missão não encontrada. Recarregue a página.');
  return s;
}

function profFecharSessao(sessaoId) {
  exigirProfessor_();
  let turma;
  comTrava_(function () {
    const s = sessaoPorId_(sessaoId);
    turma = s.turma;
    s.status = 'fechada'; s.fechada_ms = Date.now(); s.reabertos = [];
    gravarSessao_(s);
  });
  return profMissoesPainel(turma);
}

/** Reabre uma aula já fechada só para alguns alunos (faltaram ou não terminaram). emails vazio = encerra as reaberturas. */
function profReabrirSessao(sessaoId, emails) {
  exigirProfessor_();
  let turma;
  comTrava_(function () {
    const s = sessaoPorId_(sessaoId);
    turma = s.turma;
    if (s.status === 'aberta') throw new Error('Esta aula ainda está aberta para todos.');
    s.reabertos = (emails || []).map(function (e) { return String(e).toLowerCase(); });
    gravarSessao_(s);
  });
  return profSessaoDetalhe(sessaoId);
}

/** Alunos da turma com o resultado de cada um nesta aula de missão e a nota do mês. */
function profSessaoDetalhe(sessaoId) {
  exigirProfessor_();
  const s = sessaoPorId_(sessaoId);
  const m = todasMissoes_().filter(function (x) { return x.id === s.missao_id; })[0];
  const niveis = calcularNiveis_(lerConfig_());
  const feitas = lerFeitas_().filter(function (f) { return f.turma === s.turma || f.sessao_id === s.id; });
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === s.turma; }).map(function (a) {
    const email = String(a.email).toLowerCase();
    const minhas = feitas.filter(function (f) { return f.email === email; });
    const daAula = minhas.filter(function (f) { return f.sessao_id === s.id; });
    const comum = daAula.filter(function (f) { return f.tipo === 'comum'; })[0];
    const reforco = daAula.filter(function (f) { return f.tipo === 'reforco'; })[0];
    const doMes = minhas.filter(function (f) { return f.mes === s.mes; });
    const n = niveis[email];
    return {
      email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)),
      degrau: comum ? comum.degrau : degrauDoNivel_(n ? n.nivel : ''),
      comum: comum ? comum.pontos : null, reforco: reforco ? reforco.pontos : null,
      mediaMes: doMes.length ? Math.round((doMes.reduce(function (x, f) { return x + f.pontos; }, 0) / doMes.length) * 10) / 10 : null,
      reaberto: s.reabertos.indexOf(email) !== -1,
    };
  }).sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
  return {
    sessao: { id: s.id, titulo: m ? m.titulo : s.missao_id, icone: m ? m.icone : '🐶', mes: s.mes, status: s.status,
      aberta_ms: s.aberta_ms, fechada_ms: s.fechada_ms, turma: s.turma },
    alunos: alunos,
  };
}

/** Prévia para o professor: a missão resolvida no degrau escolhido (nada é gravado). */
function profPreviaMissao(missaoId, degrau) {
  exigirProfessor_();
  const m = buscarMissao_(missaoId);
  return resolverMissao_(m, inteiro_(degrau, 1, 3), temaDaMissao_(m));
}
