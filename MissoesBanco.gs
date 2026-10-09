/**
 * Etapa 5: banco completo de missões, gerador sem custo e relatório mensal das missões.
 *
 * Banco = missões padrão (MissoesPadrao.gs + MissoesAno.gs) + missões criadas pelo professor (aba MissoesCriadas).
 * Gerador sem custo: o app monta um pedido (prompt) com as palavras do tema; o professor cola no Claude.ai gratuito,
 * copia a resposta (JSON) e cola de volta. O app confere tudo, mostra a prévia nos 3 degraus e só então salva.
 */

const PARTES_HISTORIA = ['intro', 'c2', 'c3', 'c4', 'fim'];
const DEGRAUS = [1, 2, 3];

// ============================================================
// Banco
// ============================================================

function missoesCriadas_() {
  abaMissoes_('MissoesCriadas');
  return lerTabela_('MissoesCriadas').map(function (l) {
    let m = null;
    try { m = JSON.parse(l.json); } catch (e) { return null; }
    if (!m || typeof m !== 'object') return null;
    m.id = String(l.id);
    m.serie = String(l.serie);
    m.mes = mesDe_(l.mes);
    m.tema = String(l.tema);
    m.criada = true;
    m._linha = l._linha;
    return m;
  }).filter(Boolean);
}

/** Todas as missões disponíveis (padrão do ano + criadas pelo professor). */
function todasMissoes_() {
  let criadas = [];
  try { criadas = missoesCriadas_(); } catch (e) { /* aba ainda não criada */ }
  return MISSOES_PADRAO.concat(MISSOES_ANO, criadas);
}

// ============================================================
// Conferência de uma missão (usada no gerador)
// ============================================================

function texto_(v) { return typeof v === 'string' ? v.trim() : ''; }

/** Palavras-chave [[palavra|tradução]] bem formadas? */
function chavesOk_(s) {
  const semChaves = s.replace(/\[\[[^\[\]|]+\|[^\[\]|]+\]\]/g, '');
  return semChaves.indexOf('[[') === -1 && semChaves.indexOf(']]') === -1;
}

/**
 * Confere a estrutura de uma missão contra o tema. Devolve a lista de problemas (vazia = tudo certo).
 * As mensagens são para o professor, em português.
 */
function validarMissao_(m, tema) {
  const erros = [];
  const porEn = {};
  (tema ? tema.palavras : []).forEach(function (p) { porEn[p.en.toLowerCase()] = p; });
  if (!m || typeof m !== 'object') return ['A resposta não é uma missão (objeto JSON).'];
  if (!texto_(m.titulo)) erros.push('Falta o "titulo" da missão.');
  if (!texto_(m.icone)) erros.push('Falta o "icone" (um emoji).');

  const h = m.historia || {};
  PARTES_HISTORIA.forEach(function (parte) {
    DEGRAUS.forEach(function (d) {
      const f = h[parte] && h[parte][d];
      const onde = 'historia.' + parte + ' degrau ' + d;
      if (!Array.isArray(f) || !texto_(f[0])) { erros.push(onde + ': falta a fala em inglês.'); return; }
      if (d < 3 && !texto_(f[1])) erros.push(onde + ': falta a tradução em português.');
      if (!chavesOk_(f[0])) erros.push(onde + ': palavra-chave mal escrita (use [[palavra|tradução]]).');
    });
  });

  DEGRAUS.forEach(function (d) {
    const ouvir = m.ouvir && m.ouvir[d];
    if (!Array.isArray(ouvir) || ouvir.length !== 3) erros.push('ouvir degrau ' + d + ': precisa de 3 palavras.');
    else {
      ouvir.forEach(function (en) {
        if (!porEn[String(en).toLowerCase()]) erros.push('ouvir degrau ' + d + ': "' + en + '" não é uma palavra do tema.');
      });
      if (new Set(ouvir.map(function (x) { return String(x).toLowerCase(); })).size !== 3) erros.push('ouvir degrau ' + d + ': as 3 palavras devem ser diferentes.');
    }

    const ler = m.ler && m.ler[d];
    if (!ler || !texto_(ler.en)) erros.push('ler degrau ' + d + ': falta a frase em inglês.');
    else {
      if (d < 3 && !texto_(ler.pt)) erros.push('ler degrau ' + d + ': falta a tradução em português.');
      if (!chavesOk_(ler.en)) erros.push('ler degrau ' + d + ': palavra-chave mal escrita (use [[palavra|tradução]]).');
      const ops = Array.isArray(ler.opcoes) ? ler.opcoes.map(function (o) { return o && typeof o === 'object' ? JSON.stringify(o) : String(o).trim(); }) : [];
      if (ops.length !== d + 1) erros.push('ler degrau ' + d + ': precisa de ' + (d + 1) + ' opções (a 1ª é a certa).');
      else if (new Set(ops).size !== ops.length || ops.some(function (o) { return !o; })) erros.push('ler degrau ' + d + ': as opções devem ser diferentes e não vazias.');
    }

    const sol = m.soletrar && m.soletrar[d];
    const letras = sol ? texto_(sol.en).replace(/[\s'’-]/g, '') : '';
    if (!sol || !/^[a-z]{2,12}$/i.test(letras)) erros.push('soletrar degrau ' + d + ': a palavra deve ter de 2 a 12 letras (sem números).');
    else if (sol.extras && !/^[a-z]{0,4}$/i.test(String(sol.extras))) erros.push('soletrar degrau ' + d + ': "extras" deve ter até 4 letras.');

    const mon = m.montar && m.montar[d];
    const blocos = mon && Array.isArray(mon.blocos) ? mon.blocos.map(function (b) { return String(b).trim(); }) : [];
    if (blocos.length < 2 || blocos.length > 10 || blocos.some(function (b) { return !b; })) erros.push('montar degrau ' + d + ': de 2 a 10 blocos, nenhum vazio.');
    else if (d < 3 && !texto_(mon.pt)) erros.push('montar degrau ' + d + ': falta a tradução em português.');
  });
  return erros;
}

/** Fica só com os campos conhecidos (o que vier a mais na resposta é ignorado). */
function normalizarMissao_(m) {
  const g = function (obj, k) { return obj && obj[k] !== undefined ? obj[k] : obj && obj[String(k)]; };
  const n = { titulo: texto_(m.titulo).slice(0, 60), icone: texto_(m.icone).slice(0, 8), historia: {}, ouvir: {}, ler: {}, soletrar: {}, montar: {} };
  PARTES_HISTORIA.forEach(function (parte) {
    n.historia[parte] = {};
    DEGRAUS.forEach(function (d) {
      const f = g(m.historia && m.historia[parte], d) || [];
      n.historia[parte][d] = [texto_(f[0]).slice(0, 400), d < 3 ? texto_(f[1]).slice(0, 400) : ''];
    });
  });
  DEGRAUS.forEach(function (d) {
    n.ouvir[d] = (g(m.ouvir, d) || []).map(function (x) { return texto_(String(x)); });
    const ler = g(m.ler, d) || {};
    n.ler[d] = { en: texto_(ler.en).slice(0, 200), pt: d < 3 ? texto_(ler.pt).slice(0, 200) : '', opcoes: (ler.opcoes || []).map(function (o) { return String(o).trim().slice(0, 40); }) };
    const sol = g(m.soletrar, d) || {};
    n.soletrar[d] = { en: texto_(sol.en).toLowerCase(), extras: texto_(sol.extras || '').toLowerCase() };
    const mon = g(m.montar, d) || {};
    n.montar[d] = { blocos: (mon.blocos || []).map(function (b) { return String(b).trim().slice(0, 40); }), pt: d < 3 ? texto_(mon.pt).slice(0, 200) : '' };
  });
  return n;
}

/** Tira o JSON de uma resposta (com ou sem ```json ... ```). */
function extrairJson_(texto) {
  const s = String(texto || '');
  const i = s.indexOf('{'), j = s.lastIndexOf('}');
  if (i === -1 || j <= i) throw new Error('Não encontrei a missão na resposta. Copie a resposta inteira do Claude e cole aqui.');
  try { return JSON.parse(s.slice(i, j + 1)); }
  catch (e) { throw new Error('A resposta não está num formato que o app entende (JSON). Peça ao Claude: "responda só com o JSON, sem comentários".'); }
}

function temaPorId_(id) {
  const t = lerTemas_().filter(function (x) { return x.id === String(id); })[0];
  if (!t) throw new Error('Escolha um tema.');
  return t;
}

// ============================================================
// Gerador (professor)
// ============================================================

/** Pedido para colar no Claude.ai gratuito, com as palavras do tema e um exemplo completo. */
function profPromptMissao(temaId) {
  exigirProfessor_();
  const t = temaPorId_(temaId);
  const exemplo = MISSOES_PADRAO.filter(function (m) { return m.id === 'm3-2026-10-pets'; })[0];
  const ex = JSON.stringify({ titulo: exemplo.titulo, icone: exemplo.icone, historia: exemplo.historia, ouvir: exemplo.ouvir, ler: exemplo.ler, soletrar: exemplo.soletrar, montar: exemplo.montar });
  const palavras = t.palavras.map(function (p) { return p.en + ' (' + p.pt + (p.figura ? ', ' + p.figura : '') + ')'; }).join('; ');
  const frases = t.frases.map(function (f) { return f.en; }).join(' | ');
  return [
    'Você vai criar uma "missão" de inglês para crianças de 8 a 10 anos (' + t.serie + ' ano, escola pública no Brasil).',
    'O mascote é o Max, um cachorro simpático. A missão é uma história curta em 5 falas do Max + 4 desafios, cada um em 3 degraus de dificuldade.',
    '',
    'TEMA: ' + t.titulo + ' (' + t.titulo_pt + ')' + (t.conteudo ? ' — ' + t.conteudo : ''),
    'PALAVRAS DO TEMA (inglês (português, emoji)): ' + palavras,
    frases ? 'FRASES DO TEMA: ' + frases : '',
    '',
    'REGRAS:',
    '1. Responda SOMENTE com um objeto JSON válido, sem comentários e sem texto antes ou depois.',
    '2. historia: intro, c2, c3, c4, fim. Cada uma tem os degraus "1", "2" e "3", e cada degrau é ["fala em inglês", "tradução em português"].',
    '   - Degrau 1: 1 frase bem curta. Degrau 2: 1 ou 2 frases. Degrau 3: um parágrafo curto, com 3 a 6 palavras-chave no formato [[palavra|tradução]], e a tradução em português fica "" (vazia).',
    '   - c2 apresenta o desafio de leitura, c3 o de soletrar e c4 o de montar a frase (começando com "Last one!"). fim comemora com 🎉.',
    '3. ouvir: 3 palavras por degrau, todas copiadas EXATAMENTE da lista de palavras do tema, diferentes entre si; o degrau 3 com as palavras mais difíceis.',
    '4. ler: uma frase por degrau e as opções de figura (emojis). A 1ª opção é a CERTA. Degrau 1 = 2 opções, degrau 2 = 3 opções, degrau 3 = 4 opções. As opções erradas devem ser parecidas (mudar quantidade, cor ou um item).',
    '   - Degrau 1 e 2 com "pt" (tradução). Degrau 3 com palavras-chave [[palavra|tradução]] na frase e "pt": "".',
    '5. soletrar: uma palavra do tema por degrau, só letras (2 a 12). "extras" = letras a mais para confundir: "" nos degraus 1 e 2, e 2 letras no degrau 3.',
    '6. montar: a frase dividida em blocos (degrau 1: 3 blocos; degrau 2: 4 ou 5; degrau 3: 5 a 9), com "pt" nos degraus 1 e 2 e "pt": "" no degrau 3.',
    '7. Inglês simples, correto e adequado à idade. Nada de violência ou sustos. "titulo" em português (até 60 letras) e "icone" com 1 emoji.',
    '',
    'EXEMPLO COMPLETO (tema My pets, 3º ano) — siga exatamente o mesmo formato:',
    ex,
    '',
    'Agora crie uma missão NOVA para o tema ' + t.titulo + ', com outra história (não copie o exemplo).',
  ].filter(function (l, i, a) { return l !== '' || a[i - 1] !== ''; }).join('\n');
}

/** Confere a resposta colada. Devolve { erros, missao } — missao vem normalizada. */
function conferirMissao_(texto, temaId) {
  const t = temaPorId_(temaId);
  const m = normalizarMissao_(extrairJson_(texto));
  const erros = validarMissao_(m, t);
  m.serie = t.serie;
  m.tema = t.titulo;
  m.mes = mesAtual_().slice(0, 5) + ('0' + t.mes).slice(-2);
  return { tema: t, missao: m, erros: erros };
}

function profConferirMissao(texto, temaId) {
  exigirProfessor_();
  const r = conferirMissao_(texto, temaId);
  return { erros: r.erros, titulo: r.missao.titulo, icone: r.missao.icone };
}

/** Prévia de uma missão ainda não salva. */
function profPreviaMissaoNova(texto, temaId, degrau) {
  exigirProfessor_();
  const r = conferirMissao_(texto, temaId);
  if (r.erros.length) throw new Error('Corrija os problemas antes da prévia.');
  r.missao.id = 'previa';
  return resolverMissao_(r.missao, inteiro_(degrau, 1, 3), r.tema);
}

function profSalvarMissaoCriada(texto, temaId) {
  exigirProfessor_();
  const r = conferirMissao_(texto, temaId);
  if (r.erros.length) throw new Error('A missão ainda tem ' + r.erros.length + ' problema(s). Confira antes de salvar.');
  const m = r.missao;
  const id = 'mc-' + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
  const corpo = { titulo: m.titulo, icone: m.icone, historia: m.historia, ouvir: m.ouvir, ler: m.ler, soletrar: m.soletrar, montar: m.montar };
  abaMissoes_('MissoesCriadas').appendRow(linhaDe_('MissoesCriadas', {
    id: id, serie: m.serie, mes: "'" + m.mes, tema: m.tema, json: JSON.stringify(corpo), criado_em: new Date(),
  }));
  return { id: id, titulo: m.titulo };
}

function profExcluirMissaoCriada(id) {
  exigirProfessor_();
  const m = missoesCriadas_().filter(function (x) { return x.id === String(id); })[0];
  if (!m) throw new Error('Só dá para excluir missões criadas por você.');
  if (lerSessoes_().some(function (s) { return s.missao_id === m.id; })) {
    throw new Error('Esta missão já foi usada em aula. Ela fica no banco para não perder o histórico.');
  }
  aba_('MissoesCriadas').deleteRow(m._linha);
  return true;
}

// ============================================================
// Relatório mensal das missões (professor)
// ============================================================

const NOMES_DESAFIOS = ['Listen & Click', 'Read & Choose', 'Spell it!', 'Build it!'];

/** Resumo das missões de uma turma num mês: alunos, desafios e palavras mais erradas. */
function profRelatorioMissoes(turma, mes) {
  exigirProfessor_();
  validarTurma_(turma);
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === turma; });
  const emails = {};
  alunos.forEach(function (a) { emails[String(a.email).toLowerCase()] = true; });
  const feitasTurma = lerFeitas_().filter(function (f) { return emails[f.email]; });
  const meses = Array.from(new Set(feitasTurma.map(function (f) { return f.mes; }))).sort().reverse();
  mes = String(mes || meses[0] || mesAtual_());
  const feitas = feitasTurma.filter(function (f) { return f.mes === mes; });
  const missoes = {};
  todasMissoes_().forEach(function (m) { missoes[m.id] = m; });

  const desafios = [0, 0, 0, 0].map(function () { return { soma: 0, n: 0 }; });
  const erros = {};
  feitas.forEach(function (f) {
    if (f.tipo === 'comum' && Array.isArray(f.detalhe.desafios)) {
      f.detalhe.desafios.forEach(function (p, i) { if (desafios[i]) { desafios[i].soma += Math.max(0, Math.min(25, Number(p) || 0)) * 4; desafios[i].n++; } });
    }
    (Array.isArray(f.detalhe.erros) ? f.detalhe.erros : []).forEach(function (en) { erros[en] = (erros[en] || 0) + 1; });
  });

  const lista = alunos.map(function (a) {
    const email = String(a.email).toLowerCase();
    const minhas = feitas.filter(function (f) { return f.email === email; });
    const comuns = minhas.filter(function (f) { return f.tipo === 'comum'; });
    const reforcos = minhas.filter(function (f) { return f.tipo === 'reforco'; });
    const media = function (l) { return l.length ? Math.round(l.reduce(function (s, f) { return s + f.pontos; }, 0) / l.length) : null; };
    return {
      email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)),
      missoes: comuns.map(function (f) { const m = missoes[f.missao_id]; return { titulo: m ? m.titulo : f.missao_id, icone: m ? m.icone : '🐶', pontos: f.pontos, degrau: f.degrau }; }),
      comum: media(comuns), reforco: media(reforcos), nota: minhas.length ? Math.round(minhas.reduce(function (s, f) { return s + f.pontos; }, 0) / minhas.length * 10) / 10 : null,
    };
  }).sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });

  const comNota = lista.filter(function (a) { return a.nota != null; });
  return {
    turma: turma, mes: mes, meses: meses.length ? meses : [mes],
    participaram: comNota.length, total: lista.length,
    media: comNota.length ? Math.round(comNota.reduce(function (s, a) { return s + a.nota; }, 0) / comNota.length * 10) / 10 : null,
    desafios: desafios.map(function (d, i) { return { nome: NOMES_DESAFIOS[i], media: d.n ? Math.round(d.soma / d.n) : null, n: d.n }; }),
    erros: Object.keys(erros).map(function (en) { return { en: en, vezes: erros[en] }; }).sort(function (a, b) { return b.vezes - a.vezes; }).slice(0, 12),
    alunos: lista,
  };
}
