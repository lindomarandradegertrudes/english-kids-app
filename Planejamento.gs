/**
 * Etapa 7: roteiro mensal das aulas e registro por turma.
 *
 * Roteiro (por série e mês, vale para todos os anos): as 4 aulas do mês divididas entre o planejamento do professor
 * (Google Docs, com o link guardado aqui) e o aplicativo. O app sugere um roteiro a partir dos temas e da missão do mês;
 * o professor ajusta e salva.
 * Registro (por turma, ano e mês): data, conteúdo dado e observações de cada aula, para o diário de classe.
 */

const TIPOS_AULA = {
  plano: { icone: '📘', nome: 'Meu planejamento' },
  telao: { icone: '📺', nome: 'Telão (projetor)' },
  ficha: { icone: '📄', nome: 'Ficha impressa' },
  chromebook: { icone: '💻', nome: 'Chromebook' },
  projeto: { icone: '🎨', nome: 'Miniprojeto' },
  quiz: { icone: '📝', nome: 'Quiz' },
  revisao: { icone: '🔁', nome: 'Revisão' },
};
const MAX_AULAS_ROTEIRO = 5;

function lerPlanejamentos_() {
  abaMissoes_('Planejamentos');
  return lerTabela_('Planejamentos').map(function (p) {
    let roteiro = [];
    try { roteiro = JSON.parse(p.roteiro_json || '[]'); } catch (e) { /* vazio */ }
    return { _linha: p._linha, id: String(p.id), serie: String(p.serie), mes: Number(p.mes), link: String(p.link || ''), roteiro: Array.isArray(roteiro) ? roteiro : [] };
  });
}

function lerRegistros_() {
  abaMissoes_('RegistroAulas');
  return lerTabela_('RegistroAulas').map(function (r) {
    return {
      _linha: r._linha, id: String(r.id), turma: String(r.turma), ano: Number(r.ano), mes: Number(r.mes), aula: Number(r.aula),
      data: r.data instanceof Date ? Utilities.formatDate(r.data, FUSO, 'yyyy-MM-dd') : String(r.data || '').slice(0, 10),
      conteudo: String(r.conteudo || ''), observacoes: String(r.observacoes || ''), feito: String(r.feito) === 'SIM',
    };
  });
}

/** Temas e missão sugerida de uma série num mês (1–12). */
function conteudoDoMes_(serie, mes) {
  const temas = ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie && t.mes === mes; }));
  const missoes = todasMissoes_().filter(function (m) { return m.serie === serie && Number(String(m.mes).slice(5, 7)) === mes; });
  return { temas: temas, missoes: missoes };
}

/** Roteiro sugerido: 2 aulas com o planejamento do professor, 1 de Chromebook e 1 de produção/avaliação. */
function roteiroPadrao_(serie, mes) {
  const c = conteudoDoMes_(serie, mes);
  const nomes = c.temas.length ? c.temas.map(function (t) { return t.titulo; }).join(' + ') : 'revisão dos temas anteriores';
  const missao = c.missoes.filter(function (m) { return !m.criada; })[0] || c.missoes[0];
  return [
    { tipo: 'plano', titulo: 'Apresentação: ' + nomes,
      descricao: 'Meu planejamento (Docs) para apresentar o vocabulário. No fim, projete a ilha do tema no app (telão) e ouçam as palavras juntos, repetindo em voz alta.' },
    { tipo: 'ficha', titulo: 'Prática: ' + nomes,
      descricao: 'Meu planejamento + ficha impressa do tema (ligar, completar, caça-palavras ou colorir pelo comando). Corrigir em grupo.' },
    { tipo: 'chromebook', titulo: missao ? 'Chromebook: ' + missao.icone + ' ' + missao.titulo : 'Chromebook: jogos do tema',
      descricao: (missao ? 'Abrir a missão do mês na aba Missões no início da aula e fechar no fim. ' : '') +
        'Depois da missão e do reforço, jogos livres do tema e tarefas do dia. Quem faltou: reabrir a missão depois.' },
    { tipo: 'projeto', titulo: 'Produção e avaliação: ' + nomes,
      descricao: 'Miniprojeto (cartaz, desenho com frases) com foto pelo app, ou quiz do mês impresso. Fechar o tema com uma retomada das palavras mais erradas (aba Missões > Relatório).' },
  ];
}

function limparRoteiro_(roteiro) {
  return (roteiro || []).slice(0, MAX_AULAS_ROTEIRO).map(function (a) {
    return {
      tipo: TIPOS_AULA[a && a.tipo] ? a.tipo : 'plano',
      titulo: String((a && a.titulo) || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      descricao: String((a && a.descricao) || '').replace(/\r/g, '').trim().slice(0, 800),
    };
  }).filter(function (a) { return a.titulo || a.descricao; });
}

/** Roteiro de uma série num mês (o salvo ou o sugerido), com os temas e a missão do mês. */
function profPlanejamento(serie, mes) {
  exigirProfessor_();
  if (SERIES.indexOf(serie) === -1) throw new Error('Escolha a série.');
  mes = inteiro_(mes, 1, 12);
  const salvo = lerPlanejamentos_().filter(function (p) { return p.serie === serie && p.mes === mes; })[0];
  const c = conteudoDoMes_(serie, mes);
  return {
    serie: serie, mes: mes, tipos: TIPOS_AULA,
    link: salvo ? salvo.link : '',
    roteiro: salvo && salvo.roteiro.length ? limparRoteiro_(salvo.roteiro) : roteiroPadrao_(serie, mes),
    sugerido: !(salvo && salvo.roteiro.length), sugestao: roteiroPadrao_(serie, mes),
    temas: c.temas.map(function (t) { return { titulo: t.titulo, titulo_pt: t.titulo_pt, status: t.status, palavras: t.palavras.length }; }),
    missoes: c.missoes.map(function (m) { return { titulo: m.titulo, icone: m.icone }; }),
    turmas: listarTurmas_().filter(function (t) { return t.serie === serie; }).map(function (t) { return t.turma; }),
  };
}

function profSalvarPlanejamento(serie, mes, dados) {
  exigirProfessor_();
  if (SERIES.indexOf(serie) === -1) throw new Error('Escolha a série.');
  mes = inteiro_(mes, 1, 12);
  const link = String((dados && dados.link) || '').trim();
  if (link && !/^https:\/\/\S+$/.test(link)) throw new Error('O link do planejamento deve começar com https:// (copie o link do Google Docs).');
  const roteiro = limparRoteiro_(dados && dados.roteiro);
  comTrava_(function () {
    const aba = abaMissoes_('Planejamentos');
    const id = serie + '|' + mes;
    const atual = lerPlanejamentos_().filter(function (p) { return p.id === id; })[0];
    const linha = linhaDe_('Planejamentos', { id: id, serie: serie, mes: mes, link: link, roteiro_json: JSON.stringify(roteiro), atualizado_em: new Date() });
    if (atual) aba.getRange(atual._linha, 1, 1, linha.length).setValues([linha]);
    else aba.appendRow(linha);
  });
  return profPlanejamento(serie, mes);
}

/** Registro das aulas de uma turma num mês (até 5 aulas). */
function profRegistroTurma(turma, ano, mes) {
  exigirProfessor_();
  validarTurma_(turma);
  ano = Number(ano);
  mes = inteiro_(mes, 1, 12);
  const serie = serieDaTurma_(turma);
  const salvo = lerPlanejamentos_().filter(function (p) { return p.serie === serie && p.mes === mes; })[0];
  const roteiro = salvo && salvo.roteiro.length ? limparRoteiro_(salvo.roteiro) : roteiroPadrao_(serie, mes);
  const regs = {};
  lerRegistros_().forEach(function (r) { if (r.turma === turma && r.ano === ano && r.mes === mes) regs[r.aula] = r; });
  const aulas = [];
  for (let n = 1; n <= MAX_AULAS_ROTEIRO; n++) {
    const r = regs[n], prevista = roteiro[n - 1];
    aulas.push({
      aula: n, prevista: prevista ? TIPOS_AULA[prevista.tipo].icone + ' ' + prevista.titulo : '',
      data: r ? r.data : '', conteudo: r ? r.conteudo : '', observacoes: r ? r.observacoes : '', feito: r ? r.feito : false,
    });
  }
  return { turma: turma, serie: serie, ano: ano, mes: mes, aulas: aulas };
}

function profSalvarRegistro(turma, ano, mes, linhas) {
  exigirProfessor_();
  validarTurma_(turma);
  ano = Number(ano);
  mes = inteiro_(mes, 1, 12);
  if (!(ano >= 2020 && ano <= 2100)) throw new Error('Ano inválido.');
  comTrava_(function () {
    const aba = abaMissoes_('RegistroAulas');
    const existentes = {};
    lerRegistros_().forEach(function (r) { existentes[r.id] = r; });
    (linhas || []).forEach(function (l) {
      const aula = inteiro_(l.aula, 1, MAX_AULAS_ROTEIRO);
      const data = String(l.data || '').trim();
      if (data && !/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error('Aula ' + aula + ': data inválida.');
      const id = turma + '|' + ano + '-' + ('0' + mes).slice(-2) + '|' + aula;
      const linha = linhaDe_('RegistroAulas', {
        id: id, turma: turma, ano: ano, mes: mes, aula: aula, data: data ? "'" + data : '',
        conteudo: String(l.conteudo || '').replace(/\r/g, '').trim().slice(0, 600),
        observacoes: String(l.observacoes || '').replace(/\r/g, '').trim().slice(0, 600),
        feito: l.feito ? 'SIM' : '', atualizado_em: new Date(),
      });
      if (existentes[id]) aba.getRange(existentes[id]._linha, 1, 1, linha.length).setValues([linha]);
      else aba.appendRow(linha);
    });
  });
  return profRegistroTurma(turma, ano, mes);
}
