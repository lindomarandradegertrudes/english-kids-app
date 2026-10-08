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
  const daSerie = {};
  alunos.forEach(function (a) { daSerie[a.email] = true; });
  const comDetalhe = respostas.filter(function (r) { return Array.isArray(r.detalhe.acertos) && daSerie[r.email]; });
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
