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
  const questionarios = questionariosEMissoes_();
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
  questionariosEMissoes_().forEach(function (q) { qPorId[q.id] = q; });
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
  const questionarios = questionariosEMissoes_().sort(function (a, b) { return a.serie.localeCompare(b.serie) || a.mes.localeCompare(b.mes); });
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
          if (q.serie !== serie && q.tipo !== 'missoes') return '';
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
