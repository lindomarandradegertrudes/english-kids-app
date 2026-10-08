/**
 * Etapa 2 (narrativa): mapa de aventura, medalhas por marcos automáticos, acessórios do bichinho,
 * itens da casinha e o tutorial com o Max (Missão 0).
 *
 * Nada é "gasto": cada medalha é ganha uma vez, quando a criança atinge o marco, e libera um prêmio
 * (um acessório para o bichinho ou um item para a casinha). A escolha dos acessórios e o tutorial
 * concluído ficam na coluna visual_json da aba Alunos.
 */

// prêmio.slot: 'cabeca' ou 'rosto' (acessórios); itens da casinha não têm slot.
const MARCOS = [
  { id: 'partida1', icone: '🎮', nome: 'Primeira partida', en: 'First game!', meta: 1, medida: 'partidas',
    premio: { tipo: 'item', id: 'balao', icone: '🎈', nome: 'Balão' } },
  { id: 'estrelas10', icone: '⭐', nome: '10 estrelas', en: '10 stars!', meta: 10, medida: 'estrelas',
    premio: { tipo: 'acessorio', slot: 'cabeca', id: 'bone', icone: '🧢', nome: 'Boné' } },
  { id: 'temas3', icone: '🗺️', nome: '3 ilhas visitadas', en: '3 islands!', meta: 3, medida: 'temasJogados',
    premio: { tipo: 'item', id: 'livros', icone: '📚', nome: 'Livros' } },
  { id: 'estrelas25', icone: '🌟', nome: '25 estrelas', en: '25 stars!', meta: 25, medida: 'estrelas',
    premio: { tipo: 'acessorio', slot: 'rosto', id: 'oculos', icone: '🕶️', nome: 'Óculos escuros' } },
  { id: 'missao1', icone: '🐶', nome: 'Primeira missão do Max', en: 'Mission complete!', meta: 1, medida: 'missoes',
    premio: { tipo: 'item', id: 'osso', icone: '🦴', nome: 'Ossinho do Max' } },
  { id: 'missao90', icone: '🎯', nome: 'Missão com 90 pontos ou mais', en: 'Super mission!', meta: 1, medida: 'missoes90',
    premio: { tipo: 'acessorio', slot: 'cabeca', id: 'laco', icone: '🎀', nome: 'Laço' } },
  { id: 'reforco3', icone: '💪', nome: '3 reforços', en: 'Strong learner!', meta: 3, medida: 'reforcos',
    premio: { tipo: 'item', id: 'planta', icone: '🪴', nome: 'Plantinha' } },
  { id: 'dominio', icone: '🏅', nome: 'Uma ilha dominada (90% ou mais)', en: 'Island master!', meta: 1, medida: 'temasDominados',
    premio: { tipo: 'item', id: 'quadro', icone: '🖼️', nome: 'Quadro' } },
  { id: 'estrelas50', icone: '💫', nome: '50 estrelas', en: '50 stars!', meta: 50, medida: 'estrelas',
    premio: { tipo: 'acessorio', slot: 'cabeca', id: 'cartola', icone: '🎩', nome: 'Cartola' } },
  { id: 'estrelas100', icone: '🏆', nome: '100 estrelas', en: '100 stars!', meta: 100, medida: 'estrelas',
    premio: { tipo: 'acessorio', slot: 'cabeca', id: 'coroa', icone: '👑', nome: 'Coroa' } },
  { id: 'dia1', icone: '🌞', nome: 'Um dia com as 3 tarefas', en: 'Great day!', meta: 1, medida: 'dias',
    premio: { tipo: 'item', id: 'urso', icone: '🧸', nome: 'Ursinho' } },
  { id: 'dias5', icone: '📅', nome: '5 dias com as 3 tarefas', en: '5 great days!', meta: 5, medida: 'dias',
    premio: { tipo: 'acessorio', slot: 'cabeca', id: 'flor', icone: '🌸', nome: 'Flor' } },
  { id: 'dias15', icone: '🗓️', nome: '15 dias com as 3 tarefas', en: '15 great days!', meta: 15, medida: 'dias',
    premio: { tipo: 'acessorio', slot: 'cabeca', id: 'capelo', icone: '🎓', nome: 'Capelo' } },
  { id: 'projeto1', icone: '🎨', nome: 'Primeiro miniprojeto entregue', en: 'First project!', meta: 1, medida: 'projetos',
    premio: { tipo: 'item', id: 'tintas', icone: '🎨', nome: 'Tintas' } },
];

function lerVisual_(texto) {
  const v = jsonObj_(texto);
  return {
    cabeca: String(v.cabeca || ''), rosto: String(v.rosto || ''), tutorial: v.tutorial === true,
    dias: Math.max(0, Math.floor(Number(v.dias) || 0)), ultimoDia: String(v.ultimoDia || ''),
  };
}

/** Números que medem o caminho da criança (vindos dos jogos e das missões). */
function estatisticasAluno_(email, progresso, alunoLinha) {
  const porTema = (progresso && progresso.porTema) || {};
  const temas = Object.keys(porTema).map(function (k) { return porTema[k]; });
  let feitas = [];
  try { feitas = feitasDoAluno_(email); } catch (e) { /* sem missões ainda */ }
  const comuns = feitas.filter(function (f) { return f.tipo === 'comum'; });
  return {
    estrelas: progresso ? progresso.totalEstrelas : 0,
    partidas: temas.reduce(function (s, t) { return s + (t.jogadas || 0); }, 0),
    temasJogados: temas.filter(function (t) { return t.jogadas > 0; }).length,
    temasDominados: temas.filter(function (t) { return t.dominio >= 90; }).length,
    missoes: comuns.length,
    missoes90: comuns.filter(function (f) { return f.pontos >= 90; }).length,
    reforcos: feitas.filter(function (f) { return f.tipo === 'reforco'; }).length,
    dias: lerVisual_(alunoLinha ? alunoLinha.visual_json : '').dias,
    projetos: projetosEntregues_(email),
  };
}

function conquistasDe_(stats) {
  return MARCOS.map(function (m) {
    const valor = Number(stats[m.medida]) || 0;
    return {
      id: m.id, icone: m.icone, nome: m.nome, en: m.en, feito: valor >= m.meta,
      progresso: Math.min(valor, m.meta) + '/' + m.meta, premio: m.premio,
    };
  });
}

/** Mapa da série: todas as ilhas (temas) em ordem de mês, liberadas ou não, com 1–3 figuras. */
function mapaDaSerie_(serie, temas) {
  return ordenarTemas_((temas || lerTemas_()).filter(function (t) { return t.serie === serie; })).map(function (t) {
    return {
      id: t.id, titulo: t.titulo, titulo_pt: t.titulo_pt, mes: t.mes, liberado: t.status === 'liberado',
      figuras: t.palavras.map(function (p) { return p.figura; }).filter(Boolean).slice(0, 3),
    };
  });
}

/**
 * Parte "narrativa" do estado do aluno. O navegador recebe os marcos e os números atuais e calcula as medalhas
 * sozinho, para comemorar na hora em que a criança ganha uma. Se algo falhar, o resto da tela abre.
 */
function narrativaSegura_(email, serie, progresso, alunoLinha) {
  try {
    const stats = estatisticasAluno_(email, progresso, alunoLinha);
    const visual = lerVisual_(alunoLinha ? alunoLinha.visual_json : '');
    const ganhos = acessoriosGanhos_(stats);
    if (visual.cabeca && ganhos[visual.cabeca] !== 'cabeca') visual.cabeca = '';
    if (visual.rosto && ganhos[visual.rosto] !== 'rosto') visual.rosto = '';
    return { mapa: mapaDaSerie_(serie), marcos: MARCOS, stats: stats, visual: visual };
  } catch (e) {
    return { mapa: [], marcos: [], stats: {}, visual: { cabeca: '', rosto: '', tutorial: true } };
  }
}

/** { id do acessório: slot } dos acessórios que a criança já ganhou. */
function acessoriosGanhos_(stats) {
  const ganhos = {};
  conquistasDe_(stats).forEach(function (c) { if (c.feito && c.premio.tipo === 'acessorio') ganhos[c.premio.id] = c.premio.slot; });
  return ganhos;
}

/** Salva os acessórios escolhidos e/ou o tutorial concluído. Só aceita acessórios já ganhos. */
function alunoSalvarVisual(novo) {
  const aluno = alunoAtual_();
  const linha = aluno.linha;
  if (!linha) throw new Error('Cadastro não encontrado. Recarregue a página.');
  const atual = lerVisual_(linha.visual_json);
  const temas = temasDoAluno_(serieDaTurma_(aluno.turma));
  const ganhos = acessoriosGanhos_(estatisticasAluno_(aluno.email, resumoProgressoAluno_(aluno.email, temas), linha));
  ['cabeca', 'rosto'].forEach(function (slot) {
    if (!novo || !novo.hasOwnProperty(slot)) return;
    const id = String(novo[slot] || '');
    if (id && ganhos[id] !== slot) throw new Error('Este acessório ainda não foi ganho.');
    atual[slot] = id;
  });
  if (novo && novo.tutorial === true) atual.tutorial = true;
  const aba = aba_('Alunos');
  const col = CABECALHOS.Alunos.indexOf('visual_json') + 1;
  // Se o professor ainda não executou "instalar" depois desta atualização, o título da coluna é criado aqui.
  if (String(aba.getRange(1, col).getValue()) !== 'visual_json') aba.getRange(1, col).setValue('visual_json').setFontWeight('bold');
  aba.getRange(linha._linha, col).setValue(JSON.stringify(atual));
  return atual;
}
