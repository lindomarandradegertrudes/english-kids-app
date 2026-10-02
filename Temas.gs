/**
 * Temas: a lista de palavras e frases de cada assunto. Todos os jogos e avaliações são montados a partir dela.
 */

const STATUS_TEMA = ['oculto', 'liberado'];
const LIMITES_TEMA = { minPalavras: 4, maxPalavras: 40, maxFrases: 20 };

// ============================================================
// Leitura e validação
// ============================================================

function lerTemas_() {
  return lerTabela_('Temas').map(function (t) {
    const json = function (txt) { try { const v = JSON.parse(txt || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
    return {
      _linha: t._linha,
      id: String(t.id), serie: String(t.serie), trimestre: Number(t.trimestre) || 1, mes: Number(t.mes) || 2,
      titulo: String(t.titulo), titulo_pt: String(t.titulo_pt || ''), conteudo: String(t.conteudo || ''),
      palavras: json(t.palavras_json), frases: json(t.frases_json),
      status: STATUS_TEMA.indexOf(String(t.status)) !== -1 ? String(t.status) : 'oculto',
      criado_em: String(t.criado_em), atualizado_em: String(t.atualizado_em),
    };
  });
}

function ordenarTemas_(lista) {
  return lista.sort(function (a, b) {
    return a.serie.localeCompare(b.serie) || a.mes - b.mes || a.trimestre - b.trimestre || a.titulo.localeCompare(b.titulo);
  });
}

function buscarTema_(id) {
  const t = lerTemas_().filter(function (x) { return x.id === id; })[0];
  if (!t) throw new Error('Tema não encontrado. Recarregue a página.');
  return t;
}

function textoLimpo_(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Valida e normaliza um tema vindo do editor, da importação ou da IA. */
function validarTema_(d) {
  if (SERIES.indexOf(d.serie) === -1) throw new Error('Série inválida (use 3º, 4º ou 5º).');
  const titulo = textoLimpo_(d.titulo, 60);
  if (!titulo) throw new Error('Informe o título do tema (em inglês).');
  const trimestre = Number(d.trimestre);
  const mes = Number(d.mes);

  const vistas = {}, figuras = {};
  const palavras = (Array.isArray(d.palavras) ? d.palavras : []).map(function (p) {
    // Aceita {en, pt, figura} ou ["en", "pt", "figura"].
    if (Array.isArray(p)) p = { en: p[0], pt: p[1], figura: p[2] };
    return { en: textoLimpo_(p && p.en, 40), pt: textoLimpo_(p && p.pt, 40), figura: textoLimpo_(p && p.figura, 16) };
  }).filter(function (p) { return p.en || p.pt || p.figura; });
  palavras.forEach(function (p, i) {
    const n = titulo + ', palavra ' + (i + 1) + ': ';
    if (!p.en) throw new Error(n + 'falta a palavra em inglês.');
    if (!p.pt) throw new Error(n + '"' + p.en + '" está sem a tradução.');
    const chave = p.en.toLowerCase();
    if (vistas[chave]) throw new Error(titulo + ': a palavra "' + p.en + '" aparece duas vezes.');
    vistas[chave] = true;
    if (p.figura) {
      if (figuras[p.figura]) throw new Error(titulo + ': "' + figuras[p.figura] + '" e "' + p.en + '" usam a mesma figura ' + p.figura + '. Nos jogos, a criança não saberia qual escolher.');
      figuras[p.figura] = p.en;
    }
  });
  if (palavras.length < LIMITES_TEMA.minPalavras) throw new Error(titulo + ': cadastre pelo menos ' + LIMITES_TEMA.minPalavras + ' palavras (os jogos precisam de opções).');
  if (palavras.length > LIMITES_TEMA.maxPalavras) throw new Error(titulo + ': máximo de ' + LIMITES_TEMA.maxPalavras + ' palavras. Divida em dois temas.');

  const frases = (Array.isArray(d.frases) ? d.frases : []).map(function (f) {
    if (Array.isArray(f)) f = { en: f[0], pt: f[1] };
    return { en: textoLimpo_(f && f.en, 120), pt: textoLimpo_(f && f.pt, 160) };
  }).filter(function (f) { return f.en || f.pt; });
  frases.forEach(function (f, i) {
    if (!f.en || !f.pt) throw new Error(titulo + ', frase ' + (i + 1) + ': preencha o inglês e o português.');
  });
  if (frases.length > LIMITES_TEMA.maxFrases) throw new Error(titulo + ': máximo de ' + LIMITES_TEMA.maxFrases + ' frases.');

  return {
    serie: d.serie,
    trimestre: trimestre >= 1 && trimestre <= 3 ? trimestre : 1,
    mes: mes >= 2 && mes <= 12 ? mes : 2,
    titulo: titulo,
    titulo_pt: textoLimpo_(d.titulo_pt, 80),
    conteudo: String(d.conteudo || '').trim().slice(0, 1000),
    palavras: palavras,
    frases: frases,
  };
}

function mesNumero_() {
  return Number(Utilities.formatDate(new Date(), FUSO, 'M'));
}

/** Grava um tema validado. Sem id = novo. Chamar dentro de comTrava_. */
function gravarTema_(id, t, status) {
  const aba = aba_('Temas');
  const agora = new Date();
  const dados = {
    serie: t.serie, trimestre: t.trimestre, mes: t.mes, titulo: t.titulo, titulo_pt: t.titulo_pt, conteudo: t.conteudo,
    palavras_json: JSON.stringify(t.palavras), frases_json: JSON.stringify(t.frases), atualizado_em: agora,
  };
  if (!id) {
    id = 'T' + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
    aba.appendRow(linhaDe_('Temas', Object.assign(dados, { id: id, status: status || 'oculto', criado_em: agora })));
    return id;
  }
  const atual = buscarTema_(id);
  const criado = aba.getRange(atual._linha, CABECALHOS.Temas.indexOf('criado_em') + 1).getValue();
  aba.getRange(atual._linha, 1, 1, CABECALHOS.Temas.length)
    .setValues([linhaDe_('Temas', Object.assign(dados, { id: id, status: status || atual.status, criado_em: criado }))]);
  return id;
}

/**
 * Cria os temas padrão que ainda não existem (mesma série e título).
 * liberarAteHoje: libera os temas cujo mês já chegou; os demais ficam ocultos.
 */
function semearTemas_(liberarAteHoje) {
  const existentes = {};
  lerTemas_().forEach(function (t) { existentes[t.serie + '|' + t.titulo.toLowerCase()] = true; });
  const mes = mesNumero_();
  let criados = 0;
  TEMAS_PADRAO.forEach(function (p) {
    if (existentes[p.serie + '|' + p.titulo.toLowerCase()]) return;
    const t = validarTema_(p);
    gravarTema_('', t, liberarAteHoje && t.mes <= mes ? 'liberado' : 'oculto');
    criados += 1;
  });
  return criados;
}

// ============================================================
// Área do aluno
// ============================================================

function temasDoAluno_(serie) {
  return ordenarTemas_(lerTemas_().filter(function (t) { return t.serie === serie && t.status === 'liberado'; }))
    .map(function (t) {
      return { id: t.id, titulo: t.titulo, titulo_pt: t.titulo_pt, trimestre: t.trimestre, mes: t.mes, palavras: t.palavras, frases: t.frases };
    });
}

// ============================================================
// Painel do professor
// ============================================================

function profListarTemas() {
  exigirProfessor_();
  return ordenarTemas_(lerTemas_()).map(function (t) { delete t._linha; return t; });
}

function profSalvarTema(dados) {
  exigirProfessor_();
  const t = validarTema_(dados);
  let id = String(dados.id || '');
  comTrava_(function () {
    const repetido = lerTemas_().some(function (x) {
      return x.id !== id && x.serie === t.serie && x.titulo.toLowerCase() === t.titulo.toLowerCase();
    });
    if (repetido) throw new Error('Já existe um tema "' + t.titulo + '" no ' + t.serie + ' ano.');
    id = gravarTema_(id, t);
  });
  return profListarTemas();
}

/** Aceita um tema, uma lista de temas ou { temas: [...] }. Cada um entra oculto. */
function profImportarTemas(texto) {
  exigirProfessor_();
  let dados;
  try { dados = JSON.parse(texto); } catch (e) { throw new Error('O texto colado não é um JSON válido.'); }
  const lista = Array.isArray(dados) ? dados : Array.isArray(dados.temas) ? dados.temas : [dados];
  const validados = lista.map(function (d) {
    return validarTema_(Object.assign({ serie: dados.serie, trimestre: dados.trimestre, mes: dados.mes }, d));
  });
  comTrava_(function () {
    const existentes = lerTemas_();
    validados.forEach(function (t) {
      const igual = existentes.filter(function (x) { return x.serie === t.serie && x.titulo.toLowerCase() === t.titulo.toLowerCase(); })[0];
      if (igual) throw new Error('Já existe o tema "' + t.titulo + '" no ' + t.serie + ' ano. Mude o título ou edite o tema existente.');
    });
    validados.forEach(function (t) { gravarTema_('', t, 'oculto'); });
  });
  return { importados: validados.length, temas: profListarTemas() };
}

function profAlterarStatusTema(id, status) {
  exigirProfessor_();
  if (STATUS_TEMA.indexOf(status) === -1) throw new Error('Status inválido.');
  comTrava_(function () {
    const t = buscarTema_(id);
    aba_('Temas').getRange(t._linha, CABECALHOS.Temas.indexOf('status') + 1).setValue(status);
  });
  return profListarTemas();
}

function profExcluirTema(id) {
  exigirProfessor_();
  comTrava_(function () {
    const t = buscarTema_(id);
    aba_('Temas').deleteRow(t._linha);
  });
  return profListarTemas();
}

function profRestaurarTemasPadrao() {
  exigirProfessor_();
  let criados = 0;
  comTrava_(function () { criados = semearTemas_(false); });
  return { criados: criados, temas: profListarTemas() };
}

// ============================================================
// Geração de temas com a API do Claude
// ============================================================

function profSalvarChaveApi(chave) {
  exigirProfessor_();
  const props = PropertiesService.getScriptProperties();
  chave = String(chave || '').trim();
  if (chave) props.setProperty('ANTHROPIC_API_KEY', chave);
  else props.deleteProperty('ANTHROPIC_API_KEY');
  return !!chave;
}

const ESQUEMA_TEMA = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    titulo_pt: { type: 'string' },
    palavras: {
      type: 'array',
      items: {
        type: 'object',
        properties: { en: { type: 'string' }, pt: { type: 'string' }, figura: { type: 'string' } },
        required: ['en', 'pt', 'figura'],
        additionalProperties: false,
      },
    },
    frases: {
      type: 'array',
      items: {
        type: 'object',
        properties: { en: { type: 'string' }, pt: { type: 'string' } },
        required: ['en', 'pt'],
        additionalProperties: false,
      },
    },
  },
  required: ['titulo', 'titulo_pt', 'palavras', 'frases'],
  additionalProperties: false,
};

function promptTema_(dados) {
  return [
    'Você é professor de Língua Inglesa dos Anos Iniciais da Rede Municipal de Joinville (SC).',
    'Monte a lista de vocabulário de um tema para jogos educativos no Chromebook, para crianças do ' + dados.serie +
      ' ano do Ensino Fundamental (8 a 10 anos), muitas ainda em alfabetização.',
    '',
    'Tema: ' + (dados.titulo || '(sugira um título curto em inglês)'),
    'Conteúdo trabalhado em sala:',
    dados.conteudo,
    '',
    'Regras:',
    '- ' + dados.quantidade + ' palavras ou expressões curtas (até 3 palavras), concretas e do dia a dia da criança.',
    '- "figura": UM emoji que represente a palavra sem ambiguidade. Não repita o mesmo emoji em duas palavras.',
    '  Se nenhum emoji representar bem a palavra, deixe "figura" vazio (o jogo mostrará a tradução).',
    '  Para números acima de 10 use os algarismos (ex.: "15").',
    '- "pt": tradução curta em português do Brasil.',
    '- 4 a 6 frases curtas e simples (até 8 palavras) usando o vocabulário, no padrão trabalhado nessa idade.',
    '- "titulo" em inglês (até 4 palavras) e "titulo_pt" em português.',
  ].join('\n');
}

function chamarClaude_(corpo, chave) {
  const resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: corpo.fallbacks
      ? { 'x-api-key': chave, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'server-side-fallback-2026-07-01' }
      : { 'x-api-key': chave, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify(corpo),
    muteHttpExceptions: true,
  });
  let json = {};
  try { json = JSON.parse(resp.getContentText()); } catch (e) { /* resposta não-JSON */ }
  return { codigo: resp.getResponseCode(), json: json };
}

/** Pede à IA as palavras e frases de um tema. Não grava: o professor revisa no editor antes de salvar. */
function profGerarTemaIA(dados) {
  exigirProfessor_();
  const chave = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!chave) throw new Error('Cadastre a chave da API do Claude em Configurações.');
  if (!String(dados.conteudo || '').trim() && !String(dados.titulo || '').trim()) throw new Error('Informe o título ou o conteúdo do tema.');
  const quantidade = Math.min(Math.max(Number(dados.quantidade) || 12, LIMITES_TEMA.minPalavras), 30);

  const corpo = {
    model: 'claude-opus-5-5',
    max_tokens: 8000,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: ESQUEMA_TEMA } },
    fallbacks: 'default',
    messages: [{ role: 'user', content: promptTema_({ serie: dados.serie, titulo: dados.titulo, conteudo: dados.conteudo, quantidade: quantidade }) }],
  };
  let r = chamarClaude_(corpo, chave);
  if (r.codigo === 400 && JSON.stringify(r.json).indexOf('fallback') !== -1) {
    delete corpo.fallbacks;
    r = chamarClaude_(corpo, chave);
  }
  if (r.codigo === 401) throw new Error('Chave da API inválida. Confira em Configurações.');
  if (r.codigo !== 200) {
    const msg = r.json && r.json.error ? r.json.error.message : 'código ' + r.codigo;
    throw new Error('A API do Claude recusou o pedido: ' + msg);
  }
  if (r.json.stop_reason === 'refusal') throw new Error('A IA não gerou o tema para este conteúdo. Tente reformular.');
  if (r.json.stop_reason === 'max_tokens') throw new Error('A resposta ficou longa demais. Peça menos palavras.');
  const texto = (r.json.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
  let tema;
  try { tema = JSON.parse(texto); } catch (e) { throw new Error('A resposta da IA veio em formato inesperado. Tente de novo.'); }
  return {
    titulo: textoLimpo_(tema.titulo, 60), titulo_pt: textoLimpo_(tema.titulo_pt, 80),
    palavras: tema.palavras || [], frases: tema.frases || [],
  };
}
