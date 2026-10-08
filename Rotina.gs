/**
 * Etapa 4 (rotina): tarefas do dia e "aluno teste" do professor.
 *
 * Tarefas do dia: 3 tarefas curtas, iguais para todos, conferidas com as partidas do dia (aba Jogadas).
 *   1. Jogar na ilha mais nova (o tema liberado mais recente).
 *   2. Fazer o Meu reforço ou um jogo de escrever (Spell it!, Spelling Bee, Build it!).
 *   3. Ganhar 3 estrelas em um jogo.
 * Quem completa as 3 ganha um "dia completo" (conta para as medalhas 🌞 📅 🗓️). O contador fica em visual_json.
 *
 * Aluno teste: o professor vira uma criança da turma que escolher (linha da aba Alunos com teste = SIM).
 * Essa linha não aparece em listas, relatórios, equipes nem habilidades. "Zerar" apaga tudo o que ele fez.
 */

function hoje_() {
  return Utilities.formatDate(new Date(), FUSO, 'yyyy-MM-dd');
}

/** Partidas que um aluno jogou hoje (busca pela planilha, sem ler a aba inteira). */
function jogadasDeHoje_(email) {
  const aba = aba_('Jogadas');
  const n = aba.getLastRow() - 1;
  if (n < 1) return [];
  const cab = CABECALHOS.Jogadas;
  const dia = hoje_();
  return aba.getRange(2, cab.indexOf('email') + 1, n, 1).createTextFinder(email).matchEntireCell(true).matchCase(false).findAll()
    .map(function (c) {
      const v = aba.getRange(c.getRow(), 1, 1, cab.length).getValues()[0];
      const o = {};
      cab.forEach(function (k, i) { o[k] = v[i]; });
      return o;
    })
    .filter(function (o) {
      const d = o.jogado_em instanceof Date ? Utilities.formatDate(o.jogado_em, FUSO, 'yyyy-MM-dd') : String(o.jogado_em).slice(0, 10);
      return String(o.email).toLowerCase() === email && d === dia;
    })
    .map(function (o) {
      return { id: String(o.id), tema_id: String(o.tema_id), jogo: String(o.jogo), estrelas: Number(o.estrelas) || 0, reforco: String(o.id).indexOf('rf') === 0 };
    });
}

/** Há pelo menos 4 palavras fracas (abaixo de 70%) nos temas já jogados? (a mesma regra do cartão "Meu reforço") */
function temReforco_(temas, progresso) {
  let fracas = 0;
  const vistas = {};
  temas.forEach(function (t) {
    const p = progresso && progresso.porTema[t.id];
    if (!p || !p.jogadas) return;
    t.palavras.forEach(function (w) {
      const k = w.en.toLowerCase();
      if (vistas[k]) return;
      vistas[k] = true;
      if ((Number(p.palavras[w.en]) || 0) < 70) fracas++;
    });
  });
  return fracas >= 4;
}

/** As 3 tarefas de hoje e se cada uma já foi feita. temas = temas liberados da série (em ordem de mês). */
function tarefasDoDia_(email, temas, progresso) {
  if (!temas.length) return null;
  const nova = temas[temas.length - 1];
  const hoje = jogadasDeHoje_(email);
  const comReforco = temReforco_(temas, progresso);
  const tarefas = [
    { id: 'ilha', icone: '🏝️', en: 'Play on the newest island', pt: 'Jogue um jogo na ilha ' + nova.titulo + '.', tema_id: nova.id,
      feito: hoje.some(function (j) { return j.tema_id === nova.id && !j.reforco; }) },
    comReforco
      ? { id: 'reforco', icone: '💪', en: 'Do My practice', pt: 'Faça um jogo do Meu reforço (ou um jogo de escrever).' }
      : { id: 'escrever', icone: '✏️', en: 'Play a writing game', pt: 'Jogue Spell it!, Spelling Bee ou Build it! em qualquer ilha.' },
    { id: 'estrelas', icone: '⭐', en: 'Get 3 stars in a game', pt: 'Ganhe as 3 estrelas em um jogo.',
      feito: hoje.some(function (j) { return j.estrelas >= 3 && !j.reforco; }) },
  ];
  tarefas[1].feito = hoje.some(function (j) { return j.reforco || JOGO_HABILIDADE[j.jogo] === 'escrever'; });
  return { data: hoje_(), tarefas: tarefas, completo: tarefas.every(function (t) { return t.feito; }) };
}

/** Se as 3 tarefas de hoje estão feitas e o dia ainda não foi contado, soma 1 dia completo. Devolve os dias. */
function registrarDia_(alunoLinha, rotina) {
  const visual = lerVisual_(alunoLinha.visual_json);
  if (!rotina || !rotina.completo || visual.ultimoDia === rotina.data) return visual.dias;
  visual.dias += 1;
  visual.ultimoDia = rotina.data;
  const aba = aba_('Alunos');
  const col = CABECALHOS.Alunos.indexOf('visual_json') + 1;
  if (String(aba.getRange(1, col).getValue()) !== 'visual_json') aba.getRange(1, col).setValue('visual_json').setFontWeight('bold');
  aba.getRange(alunoLinha._linha, col).setValue(JSON.stringify(visual));
  alunoLinha.visual_json = JSON.stringify(visual);
  return visual.dias;
}

/** Rotina para a tela do aluno. Se algo falhar, o resto da tela abre. */
function rotinaSegura_(email, temas, progresso, alunoLinha) {
  try {
    const r = tarefasDoDia_(email, temas, progresso);
    const dias = registrarDia_(alunoLinha, r);
    return r ? Object.assign(r, { dias: dias }) : { data: hoje_(), tarefas: [], completo: false, dias: dias };
  } catch (e) {
    return null;
  }
}

// ============================================================
// Aluno teste (professor)
// ============================================================

/** Cria ou muda a turma do aluno teste do professor. Devolve o link para abrir a tela da criança. */
function profAlunoTeste(turma) {
  const email = exigirProfessor_();
  validarTurma_(turma);
  comTrava_(function () {
    const aba = aba_('Alunos');
    const col = CABECALHOS.Alunos.indexOf('teste') + 1;
    if (String(aba.getRange(1, col).getValue()) !== 'teste') aba.getRange(1, col).setValue('teste').setFontWeight('bold');
    const atual = lerTabela_('Alunos', true).filter(function (a) { return String(a.email).toLowerCase() === email; })[0];
    if (atual && String(atual.teste) !== 'SIM') throw new Error('Seu e-mail está cadastrado como aluno de verdade. Exclua esse cadastro na aba Alunos antes de usar o aluno teste.');
    const agora = new Date();
    const linha = linhaDe_('Alunos', {
      email: email, nome: 'Aluno Teste', turma: turma, avatar: atual ? avatarValido_(String(atual.avatar)) : '🐶',
      cadastrado_em: atual ? aba.getRange(atual._linha, CABECALHOS.Alunos.indexOf('cadastrado_em') + 1).getValue() : agora,
      atualizado_em: agora, visual_json: atual ? String(atual.visual_json || '') : '', teste: 'SIM',
    });
    if (atual) aba.getRange(atual._linha, 1, 1, linha.length).setValues([linha]);
    else aba.appendRow(linha);
  });
  return infoAlunoTeste_(email);
}

function infoAlunoTeste_(email) {
  const t = lerTabela_('Alunos', true).filter(function (a) { return String(a.email).toLowerCase() === email && String(a.teste) === 'SIM'; })[0];
  const url = ScriptApp.getService().getUrl();
  return { turma: t ? String(t.turma) : '', link: url ? url + '?aluno=1' : '' };
}

function profInfoAlunoTeste() {
  return infoAlunoTeste_(exigirProfessor_());
}

/** Apaga o aluno teste e tudo o que ele fez (partidas, progresso, respostas, missões e miniprojetos). */
function profZerarAlunoTeste() {
  const email = exigirProfessor_();
  comTrava_(function () {
    const apagar = function (aba, colEmail) {
      if (!aba) return;
      const n = aba.getLastRow() - 1;
      if (n < 1) return;
      aba.getRange(2, colEmail, n, 1).createTextFinder(email).matchEntireCell(true).matchCase(false).findAll()
        .map(function (c) { return c.getRow(); })
        .sort(function (a, b) { return b - a; })
        .forEach(function (r) { aba.deleteRow(r); });
    };
    const ss = planilha_();
    ['Progresso', 'Jogadas', 'Respostas', 'MissoesFeitas', 'Entregas'].forEach(function (nome) {
      const aba = ss.getSheetByName(nome);
      if (!aba) return;
      if (nome === 'Entregas') {
        lerEntregas_().filter(function (e) { return e.email === email && e.arquivo_id; })
          .forEach(function (e) { try { DriveApp.getFileById(e.arquivo_id).setTrashed(true); } catch (err) { /* já removida */ } });
      }
      apagar(aba, CABECALHOS[nome].indexOf('email') + 1);
    });
    const t = lerTabela_('Alunos', true).filter(function (a) { return String(a.email).toLowerCase() === email && String(a.teste) === 'SIM'; })[0];
    if (t) aba_('Alunos').deleteRow(t._linha);
  });
  return infoAlunoTeste_(email);
}
