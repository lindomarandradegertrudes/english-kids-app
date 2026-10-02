/**
 * Temas padrão de 3º a 5º ano, baseados no Mapa de Progressão 2026 da Rede Municipal de Joinville.
 * Palavras: [inglês, português, figura]. A figura é um emoji (ou um número curto); vazia = o jogo mostra o português.
 * Frases: [inglês, português]. "mes" é o mês em que o tema começa a ser trabalhado.
 */

const TEMAS_PADRAO = [
  // ---------------- 3º ano ----------------
  {
    serie: '3º', trimestre: 1, mes: 3, titulo: 'Meeting people', titulo_pt: 'Conhecendo pessoas',
    conteudo: 'Cumprimentos, despedidas e apresentação pessoal (nome).',
    palavras: [
      ['hello', 'olá', '👋'], ['goodbye', 'tchau', '🚶'], ['teacher', 'professor(a)', '🧑‍🏫'], ['student', 'aluno(a)', '🧒'],
      ['friend', 'amigo(a)', '🤝'], ['name', 'nome', '📛'], ['boy', 'menino', '👦'], ['girl', 'menina', '👧'],
      ['school', 'escola', '🏫'], ['yes', 'sim', '👍'], ['no', 'não', '👎'],
    ],
    frases: [
      ['Hello!', 'Olá!'], ['Hi! My name is Ana.', 'Oi! Meu nome é Ana.'], ["What's your name?", 'Qual é o seu nome?'],
      ['My name is Leo.', 'Meu nome é Leo.'], ['Nice to meet you!', 'Prazer em conhecer você!'],
      ['Goodbye, teacher!', 'Tchau, professor(a)!'], ['See you later!', 'Até mais tarde!'],
    ],
  },
  {
    serie: '3º', trimestre: 1, mes: 4, titulo: 'Magic words', titulo_pt: 'Palavras mágicas e cumprimentos',
    conteudo: 'Linguagem de boas maneiras e cumprimentos ao longo do dia.',
    palavras: [
      ['please', 'por favor', '🥺'], ['thank you', 'obrigado(a)', '🙏'], ["you're welcome", 'de nada', '😊'],
      ['sorry', 'desculpe', '😔'], ['excuse me', 'com licença', '🙋'], ['good morning', 'bom dia', '🌅'],
      ['good afternoon', 'boa tarde', '☀️'], ['good evening', 'boa noite (ao chegar)', '🌆'], ['good night', 'boa noite (ao dormir)', '🌙'],
    ],
    frases: [
      ['Good morning, teacher!', 'Bom dia, professor(a)!'], ['Thank you, Ana!', 'Obrigado, Ana!'], ["You're welcome!", 'De nada!'],
      ['Sorry!', 'Desculpe!'], ['Excuse me, teacher.', 'Com licença, professor(a).'],
      ['Can I have a pencil, please?', 'Posso pegar um lápis, por favor?'], ['Good night, mom!', 'Boa noite, mamãe!'],
    ],
  },
  {
    serie: '3º', trimestre: 2, mes: 5, titulo: 'School objects', titulo_pt: 'Objetos escolares',
    conteudo: 'Objetos escolares e comandos de sala de aula.',
    palavras: [
      ['book', 'livro', '📕'], ['notebook', 'caderno', '📓'], ['pencil', 'lápis', '✏️'], ['pen', 'caneta', '🖊️'],
      ['eraser', 'borracha', ''], ['ruler', 'régua', '📏'], ['scissors', 'tesoura', '✂️'], ['glue', 'cola', '🧴'],
      ['backpack', 'mochila', '🎒'], ['pencil case', 'estojo', '👝'], ['crayon', 'giz de cera', '🖍️'],
      ['paintbrush', 'pincel', '🖌️'], ['computer', 'computador', '💻'],
    ],
    frases: [
      ["It's a pencil.", 'É um lápis.'], ["What's this? It's a book.", 'O que é isto? É um livro.'],
      ['Open your book, please.', 'Abra o seu livro, por favor.'], ['Close your notebook.', 'Feche o seu caderno.'],
      ['I have a backpack.', 'Eu tenho uma mochila.'],
    ],
  },
  {
    serie: '3º', trimestre: 2, mes: 6, titulo: 'Colors', titulo_pt: 'Cores',
    conteudo: 'Cores.',
    palavras: [
      ['red', 'vermelho', '🔴'], ['blue', 'azul', '🔵'], ['yellow', 'amarelo', '🟡'], ['green', 'verde', '🟢'],
      ['black', 'preto', '⚫'], ['white', 'branco', '⚪'], ['orange', 'laranja', '🟠'], ['purple', 'roxo', '🟣'],
      ['brown', 'marrom', '🟤'], ['pink', 'rosa', '🩷'], ['gray', 'cinza', '🩶'],
    ],
    frases: [
      ["It's red.", 'É vermelho.'], ['My backpack is blue.', 'Minha mochila é azul.'],
      ['What color is it?', 'Que cor é?'], ["It's green.", 'É verde.'], ['I like yellow.', 'Eu gosto de amarelo.'],
      ['I have a pink pencil.', 'Eu tenho um lápis rosa.'],
    ],
  },
  {
    serie: '3º', trimestre: 2, mes: 8, titulo: 'Numbers 1 to 10', titulo_pt: 'Números de 1 a 10',
    conteudo: 'Números de 1 a 10 com objetos escolares e cores.',
    palavras: [
      ['one', 'um', '1️⃣'], ['two', 'dois', '2️⃣'], ['three', 'três', '3️⃣'], ['four', 'quatro', '4️⃣'], ['five', 'cinco', '5️⃣'],
      ['six', 'seis', '6️⃣'], ['seven', 'sete', '7️⃣'], ['eight', 'oito', '8️⃣'], ['nine', 'nove', '9️⃣'], ['ten', 'dez', '🔟'],
    ],
    frases: [
      ['I have two pencils.', 'Eu tenho dois lápis.'], ['How many books?', 'Quantos livros?'], ['Three books.', 'Três livros.'],
      ["I'm eight years old.", 'Eu tenho oito anos.'], ['I have five red crayons.', 'Eu tenho cinco gizes vermelhos.'],
    ],
  },
  {
    serie: '3º', trimestre: 3, mes: 9, titulo: 'My family', titulo_pt: 'Minha família',
    conteudo: 'Membros da família.',
    palavras: [
      ['mother', 'mãe', '👩'], ['father', 'pai', '👨'], ['sister', 'irmã', '👧'], ['brother', 'irmão', '👦'],
      ['grandmother', 'avó', '👵'], ['grandfather', 'avô', '👴'], ['baby', 'bebê', '👶'], ['family', 'família', '👨‍👩‍👧‍👦'],
    ],
    frases: [
      ['This is my mother.', 'Esta é a minha mãe.'], ['This is my father.', 'Este é o meu pai.'],
      ['I have one brother.', 'Eu tenho um irmão.'], ['I have two sisters.', 'Eu tenho duas irmãs.'],
      ['I love my family.', 'Eu amo a minha família.'],
    ],
  },
  {
    serie: '3º', trimestre: 3, mes: 10, titulo: 'My pets', titulo_pt: 'Meus animais de estimação',
    conteudo: 'Animais de estimação, com cores e números para descrevê-los.',
    palavras: [
      ['dog', 'cachorro', '🐶'], ['cat', 'gato', '🐱'], ['fish', 'peixe', '🐠'], ['bird', 'pássaro', '🐦'],
      ['rabbit', 'coelho', '🐰'], ['hamster', 'hamster', '🐹'], ['turtle', 'tartaruga', '🐢'], ['parrot', 'papagaio', '🦜'],
      ['mouse', 'ratinho', '🐭'],
    ],
    frases: [
      ['I have a dog.', 'Eu tenho um cachorro.'], ['My cat is black.', 'Meu gato é preto.'], ['I have two fish.', 'Eu tenho dois peixes.'],
      ['Do you have a pet?', 'Você tem um animal de estimação?'], ["I don't have a pet.", 'Eu não tenho animal de estimação.'],
    ],
  },
  {
    serie: '3º', trimestre: 3, mes: 11, titulo: 'Toys', titulo_pt: 'Brinquedos',
    conteudo: 'Brinquedos, com cores e números para descrevê-los.',
    palavras: [
      ['ball', 'bola', '⚽'], ['doll', 'boneca', '🪆'], ['teddy bear', 'ursinho de pelúcia', '🧸'], ['kite', 'pipa', '🪁'],
      ['yo-yo', 'ioiô', '🪀'], ['car', 'carrinho', '🚗'], ['train', 'trem', '🚂'], ['robot', 'robô', '🤖'],
      ['puzzle', 'quebra-cabeça', '🧩'], ['video game', 'videogame', '🎮'], ['balloon', 'balão', '🎈'], ['bike', 'bicicleta', '🚲'],
      ['skateboard', 'skate', '🛹'],
    ],
    frases: [
      ['I have a red ball.', 'Eu tenho uma bola vermelha.'], ['My favorite toy is my bike.', 'Meu brinquedo favorito é a minha bicicleta.'],
      ['I have three cars.', 'Eu tenho três carrinhos.'], ["Let's play!", 'Vamos brincar!'],
    ],
  },

  // ---------------- 4º ano ----------------
  {
    serie: '4º', trimestre: 1, mes: 3, titulo: 'School objects', titulo_pt: 'Objetos escolares',
    conteudo: 'Objetos escolares; perguntar e responder sobre eles com cores e números até 10.',
    palavras: [
      ['book', 'livro', '📕'], ['notebook', 'caderno', '📓'], ['pencil', 'lápis', '✏️'], ['eraser', 'borracha', ''],
      ['sharpener', 'apontador', ''], ['pencil case', 'estojo', '👝'], ['glue', 'cola', '🧴'], ['scissors', 'tesoura', '✂️'],
      ['ruler', 'régua', '📏'], ['pen', 'caneta', '🖊️'], ['backpack', 'mochila', '🎒'], ['crayon', 'giz de cera', '🖍️'],
    ],
    frases: [
      ["What's this? It's an eraser.", 'O que é isto? É uma borracha.'], ['I have a red pencil case.', 'Eu tenho um estojo vermelho.'],
      ['How many pencils?', 'Quantos lápis?'], ['Five pencils.', 'Cinco lápis.'],
      ['Can I borrow your glue, please?', 'Posso pegar sua cola emprestada, por favor?'],
    ],
  },
  {
    serie: '4º', trimestre: 1, mes: 3, titulo: 'Colors and numbers', titulo_pt: 'Revisão: cores e números até 10',
    conteudo: 'Revisão de cores e números até 10.',
    palavras: [
      ['red', 'vermelho', '🔴'], ['blue', 'azul', '🔵'], ['yellow', 'amarelo', '🟡'], ['green', 'verde', '🟢'],
      ['black', 'preto', '⚫'], ['white', 'branco', '⚪'], ['orange', 'laranja', '🟠'], ['purple', 'roxo', '🟣'],
      ['brown', 'marrom', '🟤'], ['pink', 'rosa', '🩷'], ['gray', 'cinza', '🩶'],
      ['one', 'um', '1️⃣'], ['two', 'dois', '2️⃣'], ['three', 'três', '3️⃣'], ['four', 'quatro', '4️⃣'], ['five', 'cinco', '5️⃣'],
      ['six', 'seis', '6️⃣'], ['seven', 'sete', '7️⃣'], ['eight', 'oito', '8️⃣'], ['nine', 'nove', '9️⃣'], ['ten', 'dez', '🔟'],
    ],
    frases: [
      ['I have three blue pens.', 'Eu tenho três canetas azuis.'], ['My notebook is green.', 'Meu caderno é verde.'],
      ['What color is your backpack?', 'De que cor é a sua mochila?'],
    ],
  },
  {
    serie: '4º', trimestre: 1, mes: 4, titulo: 'Months of the year', titulo_pt: 'Meses do ano',
    conteudo: 'Meses do ano para falar de aniversário.',
    palavras: [
      ['January', 'janeiro', ''], ['February', 'fevereiro', ''], ['March', 'março', ''], ['April', 'abril', ''],
      ['May', 'maio', ''], ['June', 'junho', ''], ['July', 'julho', ''], ['August', 'agosto', ''],
      ['September', 'setembro', ''], ['October', 'outubro', ''], ['November', 'novembro', ''], ['December', 'dezembro', ''],
    ],
    frases: [
      ['When is your birthday?', 'Quando é o seu aniversário?'], ['My birthday is in May.', 'Meu aniversário é em maio.'],
      ['Christmas is in December.', 'O Natal é em dezembro.'], ['School starts in February.', 'As aulas começam em fevereiro.'],
    ],
  },
  {
    serie: '4º', trimestre: 1, mes: 5, titulo: 'Birthday party', titulo_pt: 'Festa de aniversário',
    conteudo: 'Vocabulário de aniversário, idade e convite.',
    palavras: [
      ['birthday cake', 'bolo de aniversário', '🎂'], ['party', 'festa', '🎉'], ['present', 'presente', '🎁'],
      ['balloon', 'balão', '🎈'], ['candle', 'vela', '🕯️'], ['card', 'cartão', '💌'], ['invitation', 'convite', '✉️'],
      ['ice cream', 'sorvete', '🍦'], ['candy', 'doce', '🍬'], ['juice', 'suco', '🧃'], ['party hat', 'chapéu de festa', '🥳'],
    ],
    frases: [
      ['Happy birthday!', 'Feliz aniversário!'], ['How old are you?', 'Quantos anos você tem?'],
      ["I'm nine years old.", 'Eu tenho nove anos.'], ["You're invited to my party!", 'Você está convidado para a minha festa!'],
      ['This present is for you.', 'Este presente é para você.'],
    ],
  },
  {
    serie: '4º', trimestre: 2, mes: 6, titulo: 'Animals', titulo_pt: 'Animais',
    conteudo: 'Animais da fazenda e selvagens, com cores para descrevê-los.',
    palavras: [
      ['cow', 'vaca', '🐄'], ['horse', 'cavalo', '🐴'], ['pig', 'porco', '🐷'], ['sheep', 'ovelha', '🐑'],
      ['chicken', 'galinha', '🐔'], ['duck', 'pato', '🦆'], ['goat', 'cabra', '🐐'], ['lion', 'leão', '🦁'],
      ['tiger', 'tigre', '🐯'], ['elephant', 'elefante', '🐘'], ['monkey', 'macaco', '🐒'], ['giraffe', 'girafa', '🦒'],
      ['zebra', 'zebra', '🦓'], ['bear', 'urso', '🐻'], ['snake', 'cobra', '🐍'], ['frog', 'sapo', '🐸'],
    ],
    frases: [
      ["It's a lion.", 'É um leão.'], ['The elephant is gray.', 'O elefante é cinza.'], ['I like monkeys.', 'Eu gosto de macacos.'],
      ['The frog is green.', 'O sapo é verde.'], ['A cow lives on a farm.', 'A vaca vive na fazenda.'],
    ],
  },
  {
    serie: '4º', trimestre: 2, mes: 8, titulo: 'Numbers 11 to 20', titulo_pt: 'Números de 11 a 20',
    conteudo: 'Números de 11 a 20 para contar animais.',
    palavras: [
      ['eleven', 'onze', '11'], ['twelve', 'doze', '12'], ['thirteen', 'treze', '13'], ['fourteen', 'catorze', '14'],
      ['fifteen', 'quinze', '15'], ['sixteen', 'dezesseis', '16'], ['seventeen', 'dezessete', '17'], ['eighteen', 'dezoito', '18'],
      ['nineteen', 'dezenove', '19'], ['twenty', 'vinte', '20'],
    ],
    frases: [
      ['How many cows?', 'Quantas vacas?'], ['Twelve cows.', 'Doze vacas.'], ['There are fifteen ducks.', 'Há quinze patos.'],
      ['I can see twenty birds.', 'Eu consigo ver vinte pássaros.'],
    ],
  },
  {
    serie: '4º', trimestre: 3, mes: 10, titulo: 'My body', titulo_pt: 'Partes do corpo',
    conteudo: 'Partes do corpo, adjetivos descritivos (big, small), cores e números até 20.',
    palavras: [
      ['head', 'cabeça', ''], ['eye', 'olho', '👁️'], ['ear', 'orelha', '👂'], ['nose', 'nariz', '👃'], ['mouth', 'boca', '👄'],
      ['teeth', 'dentes', '🦷'], ['hair', 'cabelo', '💇'], ['hand', 'mão', '✋'], ['arm', 'braço', '💪'], ['leg', 'perna', '🦵'],
      ['foot', 'pé', '🦶'], ['finger', 'dedo', '☝️'], ['tongue', 'língua', '👅'], ['big', 'grande', '🐘'], ['small', 'pequeno', '🐭'],
    ],
    frases: [
      ['I have two eyes.', 'Eu tenho dois olhos.'], ['The monster has three big eyes.', 'O monstro tem três olhos grandes.'],
      ['It has one small nose.', 'Ele tem um nariz pequeno.'], ['Touch your head!', 'Toque na sua cabeça!'],
      ['Clap your hands!', 'Bata palmas!'], ['My hair is brown.', 'Meu cabelo é castanho.'],
    ],
  },
  {
    serie: '4º', trimestre: 3, mes: 11, titulo: 'Food and drinks', titulo_pt: 'Alimentos e bebidas',
    conteudo: 'Alimentos e bebidas; I like / I don\'t like; Do you like…? Yes, I do / No, I don\'t.',
    palavras: [
      ['apple', 'maçã', '🍎'], ['banana', 'banana', '🍌'], ['bread', 'pão', '🍞'], ['cake', 'bolo', '🍰'], ['cheese', 'queijo', '🧀'],
      ['chicken', 'frango', '🍗'], ['egg', 'ovo', '🥚'], ['fish', 'peixe', '🐟'], ['ice cream', 'sorvete', '🍦'], ['juice', 'suco', '🧃'],
      ['milk', 'leite', '🥛'], ['orange', 'laranja', '🍊'], ['pizza', 'pizza', '🍕'], ['rice', 'arroz', '🍚'], ['salad', 'salada', '🥗'],
      ['sandwich', 'sanduíche', '🥪'], ['water', 'água', '💧'], ['carrot', 'cenoura', '🥕'], ['grapes', 'uvas', '🍇'], ['chocolate', 'chocolate', '🍫'],
    ],
    frases: [
      ['I like pizza.', 'Eu gosto de pizza.'], ["I don't like fish.", 'Eu não gosto de peixe.'], ['Do you like apples?', 'Você gosta de maçãs?'],
      ['Yes, I do.', 'Sim, eu gosto.'], ["No, I don't.", 'Não, eu não gosto.'], ["I'm hungry!", 'Estou com fome!'],
    ],
  },

  // ---------------- 5º ano ----------------
  {
    serie: '5º', trimestre: 1, mes: 3, titulo: 'Personal information', titulo_pt: 'Informações pessoais',
    conteudo: 'Informações pessoais (nome, idade, onde mora, favoritos) para se apresentar.',
    palavras: [
      ['name', 'nome', '📛'], ['age', 'idade', '🎂'], ['address', 'endereço', '🏠'], ['phone number', 'número de telefone', '📱'],
      ['email', 'e-mail', '📧'], ['city', 'cidade', '🏙️'], ['country', 'país', '🌎'], ['favorite', 'favorito', '⭐'],
      ['birthday', 'aniversário', '🎉'], ['school', 'escola', '🏫'],
    ],
    frases: [
      ['My name is Julia.', 'Meu nome é Julia.'], ["I'm ten years old.", 'Eu tenho dez anos.'], ['I live in Joinville.', 'Eu moro em Joinville.'],
      ['Where do you live?', 'Onde você mora?'], ['How old are you?', 'Quantos anos você tem?'],
      ['My favorite color is blue.', 'Minha cor favorita é azul.'], ['My favorite food is pizza.', 'Minha comida favorita é pizza.'],
    ],
  },
  {
    serie: '5º', trimestre: 1, mes: 4, titulo: 'Numbers to 100', titulo_pt: 'Números até 100',
    conteudo: 'Números até 100, com atenção à diferença entre -teen e -ty (13 x 30).',
    palavras: [
      ['thirteen', 'treze', '13'], ['thirty', 'trinta', '30'], ['fourteen', 'catorze', '14'], ['forty', 'quarenta', '40'],
      ['fifteen', 'quinze', '15'], ['fifty', 'cinquenta', '50'], ['sixteen', 'dezesseis', '16'], ['sixty', 'sessenta', '60'],
      ['seventeen', 'dezessete', '17'], ['seventy', 'setenta', '70'], ['eighteen', 'dezoito', '18'], ['eighty', 'oitenta', '80'],
      ['nineteen', 'dezenove', '19'], ['ninety', 'noventa', '90'], ['twenty-one', 'vinte e um', '21'], ['one hundred', 'cem', '100'],
    ],
    frases: [
      ["I'm eleven years old.", 'Eu tenho onze anos.'], ['My house number is forty-five.', 'O número da minha casa é quarenta e cinco.'],
      ['There are thirty students in my class.', 'Há trinta alunos na minha turma.'],
    ],
  },
  {
    serie: '5º', trimestre: 1, mes: 5, titulo: 'The alphabet', titulo_pt: 'O alfabeto',
    conteudo: 'Nomes das letras do alfabeto em inglês (preparação para o spelling bee).',
    palavras: [
      ['A', 'diga: ei', 'A'], ['B', 'diga: bi', 'B'], ['C', 'diga: si', 'C'], ['D', 'diga: di', 'D'], ['E', 'diga: i', 'E'],
      ['F', 'diga: éf', 'F'], ['G', 'diga: dji', 'G'], ['H', 'diga: eitch', 'H'], ['I', 'diga: ai', 'I'], ['J', 'diga: djei', 'J'],
      ['K', 'diga: kei', 'K'], ['L', 'diga: él', 'L'], ['M', 'diga: ém', 'M'], ['N', 'diga: én', 'N'], ['O', 'diga: ou', 'O'],
      ['P', 'diga: pi', 'P'], ['Q', 'diga: kiu', 'Q'], ['R', 'diga: ar', 'R'], ['S', 'diga: és', 'S'], ['T', 'diga: ti', 'T'],
      ['U', 'diga: iu', 'U'], ['V', 'diga: vi', 'V'], ['W', 'diga: dâbliu', 'W'], ['X', 'diga: éks', 'X'], ['Y', 'diga: uai', 'Y'],
      ['Z', 'diga: zi', 'Z'],
    ],
    frases: [
      ['How do you spell your name?', 'Como se soletra o seu nome?'], ['A, B, C, D, E, F, G.', 'A, B, C, D, E, F, G.'],
      ['Can you spell it, please?', 'Você pode soletrar, por favor?'],
    ],
  },
  {
    serie: '5º', trimestre: 2, mes: 6, titulo: 'Spelling', titulo_pt: 'Soletrando',
    conteudo: 'Soletrar palavras curtas e o próprio nome.',
    palavras: [
      ['cat', 'gato', '🐱'], ['dog', 'cachorro', '🐶'], ['sun', 'sol', '☀️'], ['book', 'livro', '📕'], ['red', 'vermelho', '🔴'],
      ['bus', 'ônibus', '🚌'], ['pen', 'caneta', '🖊️'], ['egg', 'ovo', '🥚'], ['box', 'caixa', '📦'], ['hat', 'chapéu', '🎩'],
      ['fish', 'peixe', '🐠'], ['star', 'estrela', '⭐'], ['milk', 'leite', '🥛'], ['tree', 'árvore', '🌳'], ['frog', 'sapo', '🐸'],
      ['cake', 'bolo', '🍰'],
    ],
    frases: [
      ['How do you spell cat?', 'Como se soletra "cat"?'], ['C, A, T. Cat!', 'C, A, T. Gato!'],
      ['How do you spell your name?', 'Como se soletra o seu nome?'], ['J, U, L, I, A.', 'J, U, L, I, A.'],
    ],
  },
  {
    serie: '5º', trimestre: 2, mes: 8, titulo: 'Rooms of the house', titulo_pt: 'Cômodos da casa',
    conteudo: 'Partes (cômodos) de uma casa.',
    palavras: [
      ['house', 'casa', '🏠'], ['living room', 'sala de estar', '🛋️'], ['kitchen', 'cozinha', '🍳'], ['bedroom', 'quarto', '🛏️'],
      ['bathroom', 'banheiro', '🛁'], ['dining room', 'sala de jantar', '🍽️'], ['garden', 'jardim', '🌻'], ['garage', 'garagem', '🚗'],
    ],
    frases: [
      ["I'm in the kitchen.", 'Estou na cozinha.'], ['My house has two bedrooms.', 'Minha casa tem dois quartos.'],
      ['Where is dad? He is in the garden.', 'Onde está o papai? Ele está no jardim.'],
      ['There is a sofa in the living room.', 'Há um sofá na sala de estar.'],
    ],
  },
  {
    serie: '5º', trimestre: 2, mes: 9, titulo: 'Things in the house', titulo_pt: 'Objetos da casa',
    conteudo: 'Objetos e móveis de uma casa e onde eles ficam.',
    palavras: [
      ['sofa', 'sofá', '🛋️'], ['bed', 'cama', '🛏️'], ['chair', 'cadeira', '🪑'], ['table', 'mesa', ''], ['lamp', 'abajur', '💡'],
      ['TV', 'televisão', '📺'], ['door', 'porta', '🚪'], ['window', 'janela', '🪟'], ['mirror', 'espelho', '🪞'],
      ['shower', 'chuveiro', '🚿'], ['toilet', 'vaso sanitário', '🚽'], ['clock', 'relógio', '🕰️'], ['fridge', 'geladeira', ''],
      ['stove', 'fogão', ''], ['bathtub', 'banheira', '🛁'],
    ],
    frases: [
      ['The bed is in the bedroom.', 'A cama fica no quarto.'], ['There is a TV in the living room.', 'Há uma TV na sala de estar.'],
      ['The fridge is in the kitchen.', 'A geladeira fica na cozinha.'], ['There are two windows.', 'Há duas janelas.'],
    ],
  },
  {
    serie: '5º', trimestre: 3, mes: 10, titulo: 'The weather', titulo_pt: 'O tempo',
    conteudo: 'Condições do tempo; What\'s the weather like? It\'s sunny…',
    palavras: [
      ['sunny', 'ensolarado', '☀️'], ['cloudy', 'nublado', '☁️'], ['rainy', 'chuvoso', '🌧️'], ['windy', 'com vento', '🌬️'],
      ['snowy', 'com neve', '❄️'], ['stormy', 'com tempestade', '⛈️'], ['foggy', 'com neblina', '🌫️'], ['hot', 'quente', '🥵'],
      ['cold', 'frio', '🥶'], ['rainbow', 'arco-íris', '🌈'], ['umbrella', 'guarda-chuva', '☂️'],
    ],
    frases: [
      ["What's the weather like?", 'Como está o tempo?'], ["It's sunny today.", 'Está ensolarado hoje.'],
      ["It's cold and rainy.", 'Está frio e chuvoso.'], ['Take your umbrella!', 'Leve o seu guarda-chuva!'],
      ["It's hot in Joinville.", 'Está quente em Joinville.'],
    ],
  },
  {
    serie: '5º', trimestre: 3, mes: 11, titulo: 'Seasons and days', titulo_pt: 'Estações e dias da semana',
    conteudo: 'Estações do ano e dias da semana, relacionados ao tempo.',
    palavras: [
      ['spring', 'primavera', '🌸'], ['summer', 'verão', '🏖️'], ['autumn', 'outono', '🍂'], ['winter', 'inverno', '⛄'],
      ['Monday', 'segunda-feira', ''], ['Tuesday', 'terça-feira', ''], ['Wednesday', 'quarta-feira', ''], ['Thursday', 'quinta-feira', ''],
      ['Friday', 'sexta-feira', ''], ['Saturday', 'sábado', ''], ['Sunday', 'domingo', ''],
    ],
    frases: [
      ['Today is Monday.', 'Hoje é segunda-feira.'], ['What day is today?', 'Que dia é hoje?'], ["It's hot in summer.", 'Faz calor no verão.'],
      ["It's cold in winter.", 'Faz frio no inverno.'], ['My birthday is in spring.', 'Meu aniversário é na primavera.'],
    ],
  },
];
