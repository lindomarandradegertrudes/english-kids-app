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
