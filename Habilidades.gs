/**
 * Etapa 3: habilidades por tema e tipo (ouvir, ler, escrever), ligadas aos códigos do Mapa de Progressão.
 *
 * Nada novo para a criança responder: as habilidades são calculadas com o que já existe.
 *   - Jogos: cada palavra de uma partida é uma evidência (acertou de primeira = 1, acertou depois = 0,5, não acertou = 0).
 *     Valem só as 5 partidas mais recentes de cada tema e tipo, para mostrar como a criança está agora.
 *   - Quizzes e diagnóstico: cada questão é uma evidência (ouvir = ouvir; ler e figura = ler).
 *   - Missões: cada desafio é uma evidência (Listen & Click = ouvir, Read & Choose = ler, Spell it e Build it = escrever).
 * Com menos de 3 evidências o resultado fica em branco (pouca informação).
 */

const HABILIDADES = {
  ouvir: { nome: 'Ouvir', icone: '👂', codigo: '04', descricao: 'Reconhecer o assunto e as informações principais em textos orais sobre temas familiares.' },
  ler: { nome: 'Ler', icone: '📖', codigo: '07', descricao: 'Localizar informações específicas em texto.' },
  escrever: { nome: 'Escrever', icone: '✏️', codigo: '09', descricao: 'Escrever pequenos textos em língua inglesa (palavras e frases).' },
};
const TIPOS_HABILIDADE = ['ouvir', 'ler', 'escrever'];
const JOGO_HABILIDADE = { ouvir: 'ouvir', colorir: 'ouvir', memoria: 'ler', arrastar: 'ler', cacar: 'ler', montar: 'escrever', abelha: 'escrever', frases: 'escrever' };
const QUESTAO_HABILIDADE = { ouvir: 'ouvir', ler: 'ler', figura: 'ler' };
const DESAFIO_HABILIDADE = ['ouvir', 'ler', 'escrever', 'escrever'];
const PARTIDAS_RECENTES = 5;
const MIN_EVIDENCIAS = 3;

/** Código do Mapa da habilidade na série (ex.: 4º + ouvir = EF04LI04-JO). */
function codigoHabilidade_(serie, tipo) {
  return 'EF0' + String(serie).charAt(0) + 'LI' + HABILIDADES[tipo].codigo + '-JO';
}

function legendaHabilidades_(serie) {
  return TIPOS_HABILIDADE.map(function (k) {
    const h = HABILIDADES[k];
    return { tipo: k, nome: h.nome, icone: h.icone, codigo: codigoHabilidade_(serie, k), descricao: h.descricao };
  });
}

/**
 * Evidências de habilidade de vários alunos da mesma série.
 * Devolve { email: { tema_id: { ouvir: {soma, n}, ler: {...}, escrever: {...} } } }.
 */
function evidenciasHabilidades_(emails, serie, temas) {
  const temaPorId = {}, temaPorTitulo = {};
  temas.forEach(function (t) { temaPorId[t.id] = t; temaPorTitulo[t.titulo.toLowerCase()] = t; });
  const res = {};
  const somar = function (email, temaId, tipo, valor) {
    if (!emails[email] || !temaPorId[temaId] || !tipo) return;
    const a = res[email] = res[email] || {};
    const t = a[temaId] = a[temaId] || {};
    const h = t[tipo] = t[tipo] || { soma: 0, n: 0 };
    h.soma += valor;
    h.n += 1;
  };

  // Jogos: as partidas mais recentes primeiro (a aba é preenchida em ordem de tempo).
  const jogadas = lerTabela_('Jogadas');
  const contagem = {};
  for (let i = jogadas.length - 1; i >= 0; i--) {
    const j = jogadas[i];
    const email = String(j.email).toLowerCase(), temaId = String(j.tema_id), tipo = JOGO_HABILIDADE[String(j.jogo)];
    if (!emails[email] || !temaPorId[temaId] || !tipo) continue;
    const chave = email + '|' + temaId + '|' + tipo;
    contagem[chave] = (contagem[chave] || 0) + 1;
    if (contagem[chave] > PARTIDAS_RECENTES) continue;
    const palavras = jsonObj_(j.palavras_json);
    Object.keys(palavras).forEach(function (en) {
      const r = palavras[en] || {};
      somar(email, temaId, tipo, Number(r.a) ? 1 : Number(r.c) ? 0.5 : 0);
    });
  }

  // Quizzes e diagnóstico (só os respondidos no app: o impresso não guarda acerto por questão).
  const questionarios = {};
  lerQuestionarios_().forEach(function (q) { questionarios[q.id] = q; });
  lerRespostas_().forEach(function (r) {
    const q = questionarios[r.questionario_id];
    if (!q || !emails[r.email] || !Array.isArray(r.detalhe.acertos)) return;
    q.questoes.forEach(function (questao, i) {
      const t = temaPorTitulo[String(questao.tema || '').toLowerCase()];
      if (t) somar(r.email, t.id, QUESTAO_HABILIDADE[questao.tipo], r.detalhe.acertos[i] ? 1 : 0);
    });
  });

  // Missões (só a missão comum: o reforço repete palavras e mediria duas vezes a mesma coisa).
  let feitas = [];
  try { feitas = lerFeitas_(); } catch (e) { /* aba ainda não criada */ }
  const temaDaMissao = {};
  feitas.forEach(function (f) {
    if (f.tipo !== 'comum' || !emails[f.email] || !Array.isArray(f.detalhe.desafios)) return;
    if (!temaDaMissao.hasOwnProperty(f.missao_id)) {
      let t = null;
      try { t = temaDaMissao_(buscarMissao_(f.missao_id), temas); } catch (e) { /* missão removida do banco */ }
      temaDaMissao[f.missao_id] = t;
    }
    const t = temaDaMissao[f.missao_id];
    if (!t) return;
    f.detalhe.desafios.forEach(function (pontos, i) { somar(f.email, t.id, DESAFIO_HABILIDADE[i], Math.max(0, Math.min(25, Number(pontos) || 0)) / 25); });
  });
  return res;
}

/** {soma, n} → { pct, n } (pct = null quando há poucas evidências). */
function percentualHabilidade_(h) {
  if (!h || !h.n) return { pct: null, n: 0 };
  return { pct: h.n >= MIN_EVIDENCIAS ? Math.round((h.soma / h.n) * 100) : null, n: h.n };
}

/** Junta as evidências de todos os temas de um aluno por tipo. */
function geralHabilidades_(porTema) {
  const total = {};
  Object.keys(porTema || {}).forEach(function (tid) {
    TIPOS_HABILIDADE.forEach(function (k) {
      const h = porTema[tid][k];
      if (!h) return;
      total[k] = total[k] || { soma: 0, n: 0 };
      total[k].soma += h.soma;
      total[k].n += h.n;
    });
  });
  const res = {};
  TIPOS_HABILIDADE.forEach(function (k) { res[k] = percentualHabilidade_(total[k]); });
  return res;
}

function habilidadesPorTema_(porTema) {
  const res = {};
  Object.keys(porTema || {}).forEach(function (tid) {
    res[tid] = {};
    TIPOS_HABILIDADE.forEach(function (k) { res[tid][k] = percentualHabilidade_(porTema[tid][k]); });
  });
  return res;
}

/** Painel turma × habilidade: cada aluno com o resultado por tema e o geral. */
function profHabilidadesTurma(turma) {
  exigirProfessor_();
  validarTurma_(turma);
  const serie = serieDaTurma_(turma);
  const temas = ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie; }));
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === turma; });
  const emails = {};
  alunos.forEach(function (a) { emails[String(a.email).toLowerCase()] = true; });
  const ev = evidenciasHabilidades_(emails, serie, temas);
  return {
    turma: turma, serie: serie, legenda: legendaHabilidades_(serie), minimo: MIN_EVIDENCIAS,
    temas: temas.map(function (t) { return { id: t.id, titulo: t.titulo, titulo_pt: t.titulo_pt, mes: t.mes, status: t.status }; }),
    alunos: alunos.map(function (a) {
      const email = String(a.email).toLowerCase();
      return { email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)), porTema: habilidadesPorTema_(ev[email]), geral: geralHabilidades_(ev[email]) };
    }).sort(function (a, b) { return a.nome.localeCompare(b.nome); }),
  };
}

/** Habilidades de um aluno para a ficha do relatório. */
function habilidadesDoAluno_(email, serie, temas) {
  const emails = {};
  emails[email] = true;
  const ev = evidenciasHabilidades_(emails, serie, temas)[email] || {};
  const porTema = habilidadesPorTema_(ev);
  return {
    legenda: legendaHabilidades_(serie), geral: geralHabilidades_(ev),
    temas: temas.filter(function (t) { return porTema[t.id]; }).map(function (t) { return { titulo: t.titulo, habilidades: porTema[t.id] }; }),
  };
}
