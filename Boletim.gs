/**
 * Etapa 6: nota e parecer do trimestre.
 *
 * Trimestres (como nos Mapas de Progressão): T1 = fevereiro a maio, T2 = junho a setembro, T3 = outubro a dezembro.
 * Nota (0 a 10, uma casa decimal) = média das notas do trimestre que já entram no nível: quizzes mensais (online ou
 * impressos), notas mensais de missões e miniprojetos que valem nota. O diagnóstico NÃO entra (mede o ponto de partida).
 * O professor pode digitar a nota final de qualquer aluno (nota_manual) e editar o parecer.
 * O parecer é um rascunho automático de 3 a 5 frases: participação, desempenho, ponto forte, o que melhorar e orientação.
 */

const NOMES_TRIMESTRE = { 1: '1º trimestre (fev–mai)', 2: '2º trimestre (jun–set)', 3: '3º trimestre (out–dez)' };
const DESCRICAO_HABILIDADE = {
  ouvir: 'compreender palavras e frases ouvidas em inglês',
  ler: 'ler e reconhecer palavras e frases em inglês',
  escrever: 'escrever e soletrar palavras em inglês',
};
const ORIENTACAO_HABILIDADE = {
  ouvir: 'Recomenda-se ouvir e repetir as palavras em voz alta, usando o botão 🐢 do aplicativo e músicas ou vídeos curtos em inglês.',
  ler: 'Recomenda-se praticar a leitura das palavras com apoio das figuras, nos jogos Match it! e Memory.',
  escrever: 'Recomenda-se praticar a escrita das palavras com os jogos Spell it! e Spelling Bee.',
};

/** Trimestre de um mês "aaaa-mm" (janeiro fica de fora). */
function trimestreDeMes_(mes) {
  const m = Number(String(mes).slice(5, 7));
  return m >= 2 && m <= 5 ? 1 : m >= 6 && m <= 9 ? 2 : m >= 10 ? 3 : 0;
}

function noTrimestre_(mes, ano, tri) {
  return String(mes).slice(0, 4) === String(ano) && trimestreDeMes_(mes) === tri;
}

function trimestreAtual_() {
  const mes = mesAtual_();
  return { ano: Number(mes.slice(0, 4)), tri: trimestreDeMes_(mes) || 1 };
}

function lerBoletins_() {
  abaMissoes_('Boletins');
  return lerTabela_('Boletins').map(function (b) {
    return {
      _linha: b._linha, id: String(b.id), ano: Number(b.ano), trimestre: Number(b.trimestre), email: String(b.email).toLowerCase(),
      turma: String(b.turma), nota_manual: b.nota_manual === '' || b.nota_manual == null ? null : Number(b.nota_manual),
      parecer: String(b.parecer || ''), atualizado_em: String(b.atualizado_em || ''),
    };
  });
}

function numeroBr_(v) {
  return String(v).replace('.', ',');
}

function listaBr_(itens) {
  return itens.length <= 1 ? itens.join('') : itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
}

/** Rascunho do parecer (3 a 5 frases, linguagem neutra). */
function rascunhoParecer_(d) {
  const nome = d.nome.split(' ')[0];
  const frases = [];
  if (!d.atividades.total) frases.push('Neste trimestre, ' + nome + ' ainda não teve atividades avaliativas no aplicativo de inglês.');
  else if (d.atividades.feitas >= d.atividades.total) frases.push(nome + ' participou de todas as atividades avaliativas do trimestre no aplicativo de inglês.');
  else if (d.atividades.feitas) frases.push(nome + ' participou de parte das atividades avaliativas do trimestre (' + d.atividades.feitas + ' de ' + d.atividades.total + ').');
  else frases.push(nome + ' ainda não realizou as atividades avaliativas do trimestre no aplicativo de inglês.');

  const temas = d.temas.length ? (d.temas.length === 1 ? ' no tema ' : ' nos temas ') + listaBr_(d.temas) : '';
  if (d.nota != null) {
    if (d.nota >= 8.5) frases.push('Demonstra ótimo desempenho' + temas + ', reconhecendo o vocabulário com segurança.');
    else if (d.nota >= 7) frases.push('Apresenta bom desempenho' + temas + '.');
    else if (d.nota >= 5) frases.push('Está em desenvolvimento' + temas + ', com avanços no vocabulário estudado.');
    else frases.push('Ainda apresenta dificuldades com o vocabulário estudado' + temas + '.');
  }

  const h = d.habilidades;
  const comDados = TIPOS_HABILIDADE.filter(function (k) { return h[k] && h[k].pct != null; });
  const forte = comDados.slice().sort(function (a, b) { return h[b].pct - h[a].pct; })[0];
  const fraca = comDados.slice().sort(function (a, b) { return h[a].pct - h[b].pct; })[0];
  if (forte && h[forte].pct >= 70) frases.push('Destaca-se ao ' + DESCRICAO_HABILIDADE[forte] + '.');
  if (fraca && fraca !== forte && h[fraca].pct < 70) {
    frases.push('Precisa fortalecer a habilidade de ' + DESCRICAO_HABILIDADE[fraca] +
      (d.palavras.length ? ', especialmente as palavras ' + listaBr_(d.palavras.map(function (p) { return p; })) : '') + '.');
    frases.push(ORIENTACAO_HABILIDADE[fraca]);
  } else if (d.palavras.length && d.nota != null && d.nota < 8.5) {
    frases.push('Precisa revisar as palavras ' + listaBr_(d.palavras) + '.');
    frases.push('Recomenda-se continuar praticando no aplicativo para ampliar o vocabulário.');
  } else if (d.nota != null) {
    frases.push('Recomenda-se continuar praticando para ampliar ainda mais o vocabulário.');
  } else if (d.atividades.total) {
    frases.push('É importante participar das próximas atividades para acompanhar a aprendizagem em inglês.');
  }
  return frases.slice(0, 5).join(' ');
}

/** { email: [{ titulo, percentual }] } com as notas do trimestre que entram no boletim (sem o diagnóstico). */
function notasDoTrimestre_(emails, ano, tri, respostas) {
  const questionarios = {};
  questionariosEMissoes_(respostas).forEach(function (q) { questionarios[q.id] = q; });
  const notas = {};
  (respostas || lerRespostas_()).forEach(function (r) {
    const q = questionarios[r.questionario_id];
    if (!q || !emails[r.email] || q.tipo === 'diagnostico' || isNaN(r.percentual)) return;
    if (!noTrimestre_(mesDe_(q.mes), ano, tri)) return;
    (notas[r.email] = notas[r.email] || []).push({ titulo: q.titulo, percentual: r.percentual });
  });
  return notas;
}

/** Boletim de uma turma num trimestre: nota calculada, nota manual, parecer salvo e rascunho de cada aluno. */
function profBoletimTurma(turma, ano, tri) {
  exigirProfessor_();
  validarTurma_(turma);
  const atual = trimestreAtual_();
  ano = Number(ano) || atual.ano;
  tri = inteiro_(tri || atual.tri, 1, 3);
  const serie = serieDaTurma_(turma);
  const alunos = lerTabela_('Alunos').filter(function (a) { return String(a.turma) === turma; })
    .sort(function (a, b) { return String(a.nome).localeCompare(String(b.nome), 'pt-BR'); });
  const emails = {};
  alunos.forEach(function (a) { emails[String(a.email).toLowerCase()] = true; });

  // Notas do trimestre (sem o diagnóstico).
  const notas = notasDoTrimestre_(emails, ano, tri);

  // Atividades oferecidas no trimestre (para a participação).
  const sessoes = lerSessoes_().filter(function (s) { return s.turma === turma && noTrimestre_(s.mes, ano, tri); });
  const idsSessoes = {};
  sessoes.forEach(function (s) { idsSessoes[s.id] = true; });
  const quizzes = lerQuestionarios_().filter(function (q) {
    return q.serie === serie && q.tipo !== 'diagnostico' && q.status !== 'rascunho' && noTrimestre_(mesDe_(q.mes), ano, tri);
  });
  const idsQuiz = {};
  quizzes.forEach(function (q) { idsQuiz[q.id] = true; });
  let projetos = [];
  try { projetos = lerProjetos_().filter(function (p) { return p.serie === serie && noTrimestre_(p.mes, ano, tri); }); } catch (e) { /* sem aba */ }
  const idsProjeto = {};
  projetos.forEach(function (p) { idsProjeto[p.id] = true; });
  let feitas = [], entregas = [];
  try { feitas = lerFeitas_(); } catch (e) { /* sem aba */ }
  try { entregas = lerEntregas_(); } catch (e) { /* sem aba */ }
  const respondeu = {};
  lerRespostas_().forEach(function (r) { if (idsQuiz[r.questionario_id]) respondeu[r.email + '|' + r.questionario_id] = true; });

  // Habilidades nos temas do trimestre e palavras mais fracas.
  const temasTri = ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie && t.trimestre === tri; }));
  const temasLiberados = temasTri.filter(function (t) { return t.status === 'liberado'; });
  const ev = evidenciasHabilidades_(emails, serie, temasTri);
  const progresso = lerProgresso_().filter(function (p) { return emails[p.email]; });
  const boletins = {};
  lerBoletins_().forEach(function (b) { if (b.ano === ano && b.trimestre === tri) boletins[b.email] = b; });

  const lista = alunos.map(function (a) {
    const email = String(a.email).toLowerCase();
    const minhas = notas[email] || [];
    const nota = minhas.length ? Math.round(minhas.reduce(function (s, n) { return s + n.percentual; }, 0) / minhas.length) / 10 : null;
    const missoesFeitas = Object.keys(idsSessoes).filter(function (sid) {
      return feitas.some(function (f) { return f.email === email && f.sessao_id === sid && f.tipo === 'comum'; });
    }).length;
    const quizzesFeitos = quizzes.filter(function (q) { return respondeu[email + '|' + q.id]; }).length;
    const projetosFeitos = projetos.filter(function (p) {
      return entregas.some(function (e) { return e.email === email && e.projeto_id === p.id && (e.arquivo_id || e.nota != null); });
    }).length;
    const fracas = [];
    temasTri.forEach(function (t) {
      const p = progresso.filter(function (x) { return x.email === email && x.tema_id === t.id; })[0];
      if (!p) return;
      t.palavras.forEach(function (w) {
        if (p.dominio.hasOwnProperty(w.en) && Number(p.dominio[w.en]) < 50) fracas.push({ en: w.en, v: Number(p.dominio[w.en]) });
      });
    });
    const dados = {
      nome: String(a.nome), nota: nota, temas: temasLiberados.map(function (t) { return t.titulo; }),
      atividades: { feitas: missoesFeitas + quizzesFeitos + projetosFeitos, total: sessoes.length + quizzes.length + projetos.length },
      habilidades: geralHabilidades_(ev[email]),
      palavras: fracas.sort(function (x, y) { return x.v - y.v; }).slice(0, 3).map(function (f) { return f.en; }),
    };
    const b = boletins[email];
    return {
      email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)),
      notaCalculada: nota, notas: minhas, notaManual: b ? b.nota_manual : null,
      parecer: b && b.parecer ? b.parecer : '', rascunho: rascunhoParecer_(dados),
      participacao: dados.atividades, habilidades: dados.habilidades, atualizado_em: b ? b.atualizado_em : '',
    };
  });
  return { turma: turma, serie: serie, ano: ano, tri: tri, nomeTri: NOMES_TRIMESTRE[tri], temas: temasLiberados.map(function (t) { return t.titulo; }), alunos: lista };
}

/** Salva notas manuais e pareceres. linhas = [{ email, notaManual: '' ou número, parecer }]. */
function profSalvarBoletim(turma, ano, tri, linhas) {
  exigirProfessor_();
  validarTurma_(turma);
  ano = Number(ano);
  tri = inteiro_(tri, 1, 3);
  if (!(ano >= 2020 && ano <= 2100)) throw new Error('Ano inválido.');
  const daTurma = {};
  lerTabela_('Alunos').forEach(function (a) { if (String(a.turma) === turma) daTurma[String(a.email).toLowerCase()] = String(a.nome); });
  comTrava_(function () {
    const aba = abaMissoes_('Boletins');
    const existentes = {};
    lerBoletins_().forEach(function (b) { existentes[b.id] = b; });
    (linhas || []).forEach(function (l) {
      const email = String(l.email || '').toLowerCase();
      if (!daTurma[email]) throw new Error('Há um aluno que não é da turma ' + turma + '. Recarregue a página.');
      let nota = String(l.notaManual == null ? '' : l.notaManual).replace(',', '.').trim();
      if (nota !== '') {
        nota = Number(nota);
        if (isNaN(nota) || nota < 0 || nota > 10) throw new Error(daTurma[email] + ': a nota deve ficar entre 0 e 10.');
        nota = Math.round(nota * 10) / 10;
      }
      const id = ano + '-T' + tri + '-' + email;
      const linha = linhaDe_('Boletins', {
        id: id, ano: ano, trimestre: tri, email: email, turma: turma, nota_manual: nota,
        parecer: String(l.parecer || '').replace(/\r/g, '').trim().slice(0, 1500), atualizado_em: new Date(),
      });
      if (existentes[id]) aba.getRange(existentes[id]._linha, 1, 1, linha.length).setValues([linha]);
      else aba.appendRow(linha);
    });
  });
  return profBoletimTurma(turma, ano, tri);
}

/** Planilha no Drive com o boletim da turma (nota final e parecer). Devolve o link. */
function profExportarBoletim(turma, ano, tri) {
  const b = profBoletimTurma(turma, ano, tri);
  const ss = SpreadsheetApp.create('Boletim de Inglês – ' + b.turma + ' – ' + b.tri + 'º trimestre ' + b.ano);
  const cab = ['Nº', 'Aluno', 'Nota final', 'Nota calculada', 'Avaliações no trimestre', 'Parecer'];
  const linhas = b.alunos.map(function (a, i) {
    const final = a.notaManual != null ? a.notaManual : a.notaCalculada;
    return [i + 1, a.nome, final == null ? '' : final, a.notaCalculada == null ? '' : a.notaCalculada, a.notas.length, a.parecer || a.rascunho];
  });
  const aba = ss.getSheets()[0].setName(b.turma + ' T' + b.tri);
  const dados = [cab].concat(linhas.length ? linhas : [['', '(sem alunos)', '', '', '', '']]);
  aba.getRange(1, 1, dados.length, cab.length).setValues(dados);
  aba.getRange(1, 1, 1, cab.length).setFontWeight('bold').setBackground('#ffe8cc');
  aba.setFrozenRows(1);
  aba.setColumnWidth(2, 220);
  aba.setColumnWidth(6, 620);
  aba.getRange(2, 6, Math.max(1, linhas.length), 1).setWrap(true);
  return ss.getUrl();
}
