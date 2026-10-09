/**
 * Etapa 9: painel de acompanhamento.
 *
 * Uma visão rápida de todas as turmas (uso do app, missão do mês, notas do trimestre e habilidade a reforçar)
 * e a lista "Precisa de atenção", com os motivos de cada aluno:
 *   - não fez a missão do mês (houve aula de missão na turma e ele não fez);
 *   - não respondeu um quiz aberto / não enviou um miniprojeto aberto;
 *   - está sem nota no trimestre (quando o trimestre já teve atividades) ou com nota abaixo de 5;
 *   - não usa o app há mais de 30 dias (ou nunca usou).
 */

const DIAS_PARADO = 30;

/** "dd/MM/yyyy HH:mm" (como lerTabela_ entrega as datas) → milissegundos, ou 0. */
function msDeTexto_(texto) {
  const m = String(texto || '').match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0)).getTime() : 0;
}

function profAcompanhamento() {
  exigirProfessor_();
  const agora = Date.now();
  const mes = mesAtual_();
  const t = trimestreAtual_();
  const nomeMes = NOMES_MESES[Number(mes.slice(5)) - 1];

  const alunos = lerTabela_('Alunos');
  const emails = {};
  alunos.forEach(function (a) { emails[String(a.email).toLowerCase()] = true; });

  // Última atividade de cada aluno (jogos, respostas e missões).
  const ultima = {};
  const marcar = function (email, ms) { if (ms && (!ultima[email] || ms > ultima[email])) ultima[email] = ms; };
  lerProgresso_().forEach(function (p) { marcar(p.email, msDeTexto_(p.atualizado_em)); });
  const respostas = lerRespostas_();
  respostas.forEach(function (r) { if (r.origem === 'online') marcar(r.email, msDeTexto_(r.respondido_em)); });
  abaMissoes_('MissoesFeitas');
  const feitasBrutas = lerTabela_('MissoesFeitas');
  feitasBrutas.forEach(function (f) { marcar(String(f.email).toLowerCase(), msDeTexto_(f.feito_em)); });
  const feitas = feitasBrutas.map(converterFeita_);

  // Missões do mês, quizzes e projetos abertos.
  const sessoesMes = lerSessoes_().filter(function (s) { return s.mes === mes; });
  const fezMissaoMes = {};
  feitas.forEach(function (f) { if (f.mes === mes && f.tipo === 'comum') fezMissaoMes[f.email] = true; });
  const quizzesAbertos = lerQuestionarios_().filter(function (q) { return q.status === 'aberto'; });
  const respondeu = {};
  respostas.forEach(function (r) { respondeu[r.email + '|' + r.questionario_id] = true; });
  let projetosAbertos = [], entregou = {};
  try {
    projetosAbertos = lerProjetos_().filter(function (p) { return p.status === 'aberto'; });
    lerEntregas_().forEach(function (e) { if (e.arquivo_id || e.nota != null) entregou[e.email + '|' + e.projeto_id] = true; });
  } catch (e) { /* sem abas de projetos */ }

  // Notas do trimestre e habilidades (geral de cada aluno).
  const notas = notasDoTrimestre_(emails, t.ano, t.tri, respostas);
  const temTriAtividade = {};
  lerSessoes_().forEach(function (s) { if (noTrimestre_(s.mes, t.ano, t.tri)) temTriAtividade[s.turma] = true; });
  lerQuestionarios_().forEach(function (q) {
    if (q.tipo !== 'diagnostico' && q.status !== 'rascunho' && noTrimestre_(mesDe_(q.mes), t.ano, t.tri)) temTriAtividade['serie:' + q.serie] = true;
  });
  let habil = {};
  try { habil = evidenciasHabilidades_(emails, '', lerTemas_()); } catch (e) { /* sem dados */ }

  const porTurma = {};
  const alertas = [];
  alunos.forEach(function (a) {
    const email = String(a.email).toLowerCase(), turma = String(a.turma), serie = serieDaTurma_(turma);
    const tt = porTurma[turma] = porTurma[turma] || { turma: turma, serie: serie, alunos: 0, ativos: 0, nunca: 0, fizeramMissao: 0, aulasMissao: 0, semNota: 0, notas: [], habil: { ouvir: [], ler: [], escrever: [] } };
    tt.alunos++;
    const motivos = [];

    const ult = ultima[email] || 0;
    const dias = ult ? Math.floor((agora - ult) / 86400000) : null;
    if (ult && dias <= DIAS_PARADO) tt.ativos++;
    if (!ult) { tt.nunca++; motivos.push({ tipo: 'parado', texto: 'Nunca usou o app' }); }
    else if (dias > DIAS_PARADO) motivos.push({ tipo: 'parado', texto: 'Sem usar o app há ' + dias + ' dias' });

    const aulas = sessoesMes.filter(function (s) { return s.turma === turma; });
    tt.aulasMissao = aulas.length;
    if (aulas.length) {
      if (fezMissaoMes[email]) tt.fizeramMissao++;
      else motivos.push({ tipo: 'missao', texto: 'Não fez a missão de ' + nomeMes });
    }

    quizzesAbertos.filter(function (q) { return q.serie === serie && !respondeu[email + '|' + q.id]; })
      .forEach(function (q) { motivos.push({ tipo: 'quiz', texto: 'Não respondeu: ' + q.titulo }); });
    projetosAbertos.filter(function (p) { return p.serie === serie && !entregou[email + '|' + p.id]; })
      .forEach(function (p) { motivos.push({ tipo: 'projeto', texto: 'Não entregou o miniprojeto: ' + p.titulo }); });

    const minhas = notas[email] || [];
    if (minhas.length) {
      const nota = Math.round(minhas.reduce(function (s, n) { return s + n.percentual; }, 0) / minhas.length) / 10;
      tt.notas.push(nota);
      if (nota < 5) motivos.push({ tipo: 'nota', texto: 'Nota do trimestre: ' + String(nota).replace('.', ',') });
    } else if (temTriAtividade[turma] || temTriAtividade['serie:' + serie]) {
      tt.semNota++;
      motivos.push({ tipo: 'semnota', texto: 'Sem nota no ' + t.tri + 'º trimestre' });
    }

    const g = geralHabilidades_(habil[email]);
    TIPOS_HABILIDADE.forEach(function (k) { if (g[k].pct != null) tt.habil[k].push(g[k].pct); });

    if (motivos.length) alertas.push({ turma: turma, email: email, nome: String(a.nome), avatar: avatarValido_(String(a.avatar)), motivos: motivos });
  });

  const turmas = listarTurmas_().map(function (lt) {
    const tt = porTurma[lt.turma] || { turma: lt.turma, serie: lt.serie, alunos: 0, ativos: 0, nunca: 0, fizeramMissao: 0, aulasMissao: 0, semNota: 0, notas: [], habil: { ouvir: [], ler: [], escrever: [] } };
    let fraca = null;
    TIPOS_HABILIDADE.forEach(function (k) {
      const v = tt.habil[k];
      if (v.length < 3) return;
      const media = Math.round(v.reduce(function (s, x) { return s + x; }, 0) / v.length);
      if (!fraca || media < fraca.pct) fraca = { tipo: k, nome: HABILIDADES[k].nome, icone: HABILIDADES[k].icone, pct: media };
    });
    return {
      turma: tt.turma, serie: tt.serie, alunos: tt.alunos, ativos: tt.ativos, nunca: tt.nunca,
      aulasMissao: tt.aulasMissao, fizeramMissao: tt.fizeramMissao, semNota: tt.semNota,
      media: tt.notas.length ? Math.round(tt.notas.reduce(function (s, x) { return s + x; }, 0) / tt.notas.length * 10) / 10 : null,
      fraca: fraca,
    };
  });

  return {
    mes: mes, nomeMes: nomeMes, ano: t.ano, tri: t.tri, diasParado: DIAS_PARADO, turmas: turmas,
    alertas: alertas.sort(function (a, b) { return b.motivos.length - a.motivos.length || a.turma.localeCompare(b.turma) || a.nome.localeCompare(b.nome, 'pt-BR'); }),
  };
}
