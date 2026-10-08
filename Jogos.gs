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
};

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
  // "Meu reforço" treina palavras fracas de vários temas: muda o domínio, mas não dá estrelas.
  if (j.reforco !== true) atual.estrelas[j.jogo] = Math.max(Number(atual.estrelas[j.jogo]) || 0, estrelas);

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
