/**
 * Etapa 5: banco de missões do ano inteiro — uma missão para cada tema padrão que ainda não tinha missão
 * (março a setembro). Mesmo formato de MissoesPadrao.gs: história com o Max + 4 desafios em 3 degraus.
 * O "mes" de cada missão só serve para sugerir a missão do mês; a nota vai para o mês em que a aula foi aberta.
 */

const MISSOES_ANO = [
  // ---------------- 3º ano ----------------
  {
    id: 'm3-03-meeting', serie: '3º', mes: '2026-03', tema: 'Meeting people', titulo: 'Max na Escola Nova', icone: '👋',
    historia: {
      intro: {
        1: ["Hi! I'm Max. It's my first day at school!", 'Oi! Eu sou o Max. É meu primeiro dia na escola!'],
        2: ["Hi! I'm Max. Today is my first day at a new school. I want to make friends!", 'Oi! Eu sou o Max. Hoje é meu primeiro dia numa escola nova. Quero fazer amigos!'],
        3: ["Hi, I'm Max! Today is my [[first day|primeiro dia]] at a [[new|nova]] school. I'm a little [[nervous|nervoso]]. Can you help me [[meet|conhecer]] everyone?", ''],
      },
      c2: {
        1: ['Look! Who is this?', 'Olhe! Quem é?'],
        2: ['The teacher wrote a sentence. Read it!', 'A professora escreveu uma frase. Leia!'],
        3: ['The [[teacher|professora]] wrote a [[note|bilhete]] on the board. Read it and find the right picture!', ''],
      },
      c3: {
        1: ['Oh no! My name tag fell!', 'Ah, não! Meu crachá caiu!'],
        2: ['Oh no! The letters on the door fell off. Help me spell!', 'Ah, não! As letras da porta caíram. Me ajude a soletrar!'],
        3: ['Oh no! The [[wind|vento]] blew the letters off the [[classroom door|porta da sala]]. Some letters are [[extra|sobrando]]. Spell the word!', ''],
      },
      c4: {
        1: ['Last one! Say hello!', 'Última! Diga olá!'],
        2: ['Last one! Help me introduce myself!', 'Última! Me ajude a me apresentar!'],
        3: ['Last one! I want to [[introduce myself|me apresentar]] to the class. Put the words in the [[right order|ordem certa]]!', ''],
      },
      fim: {
        1: ['Thank you! I have new friends! 🎉', 'Obrigado! Tenho amigos novos! 🎉'],
        2: ['Thank you! Now I know everyone at school! 🎉', 'Obrigado! Agora eu conheço todo mundo na escola! 🎉'],
        3: ['Thank you so much! My first day was [[awesome|incrível]] and now I have [[lots of|muitos]] friends! 🎉', ''],
      },
    },
    ouvir: { 1: ['hello', 'boy', 'girl'], 2: ['teacher', 'student', 'friend'], 3: ['school', 'goodbye', 'name'] },
    ler: {
      1: { en: 'It is a girl.', pt: 'É uma menina.', opcoes: ['👧', '👦'] },
      2: { en: 'Hello! I am the teacher.', pt: 'Olá! Eu sou a professora.', opcoes: ['🧑‍🏫', '🧒', '👦'] },
      3: { en: 'Two [[girls|meninas]] and one [[boy|menino]] are [[friends|amigos]].', pt: '', opcoes: ['👧👧👦', '👧👦👦', '👦👦👦', '👧👧👧'] },
    },
    soletrar: { 1: { en: 'boy', extras: '' }, 2: { en: 'girl', extras: '' }, 3: { en: 'school', extras: 'kp' } },
    montar: {
      1: { blocos: ['Hello!', 'My name is', 'Max.'], pt: 'Olá! Meu nome é Max.' },
      2: { blocos: ['Hi!', 'My', 'name', 'is', 'Max.'], pt: 'Oi! Meu nome é Max.' },
      3: { blocos: ['Hello,', 'my', 'name', 'is', 'Max.', 'Nice', 'to', 'meet', 'you!'], pt: 'Olá, meu nome é Max. Prazer em conhecer você!' },
    },
  },
  {
    id: 'm3-04-magic', serie: '3º', mes: '2026-04', tema: 'Magic words', titulo: 'Max e as Palavras Mágicas', icone: '🪄',
    historia: {
      intro: {
        1: ["Hi! I'm Max. I know magic words!", 'Oi! Eu sou o Max. Eu sei palavras mágicas!'],
        2: ["Hi! I'm Max. A wizard needs magic words for his door. Can you help?", 'Oi! Eu sou o Max. Um mago precisa de palavras mágicas para a porta dele. Você ajuda?'],
        3: ["Hi, I'm Max! The school [[wizard|mago]] lost his [[magic book|livro mágico]]. Only [[polite|educadas]] words can open his door. Let's help him!", ''],
      },
      c2: {
        1: ['Look at the picture!', 'Olhe a figura!'],
        2: ['The wizard wrote a message. Read it!', 'O mago escreveu uma mensagem. Leia!'],
        3: ['There is a [[secret|secreta]] message on the [[door|porta]]. Read it and choose the right picture!', ''],
      },
      c3: {
        1: ['Oh no! The magic word broke!', 'Ah, não! A palavra mágica quebrou!'],
        2: ['Oh no! The letters flew away. Spell the magic word!', 'Ah, não! As letras voaram. Soletre a palavra mágica!'],
        3: ['Oh no! The [[spell|feitiço]] [[mixed up|misturou]] the letters, and there are [[extra|a mais]] letters too. Spell the magic words!', ''],
      },
      c4: {
        1: ['Last one! Ask nicely!', 'Última! Peça com educação!'],
        2: ['Last one! Build the magic sentence!', 'Última! Monte a frase mágica!'],
        3: ['Last one! The door opens only with a [[full|completa]] polite sentence. Put the words in [[order|ordem]]!', ''],
      },
      fim: {
        1: ['Thank you! Magic! ✨🎉', 'Obrigado! Mágica! ✨🎉'],
        2: ['Thank you! The door is open. You are a great wizard! ✨🎉', 'Obrigado! A porta abriu. Você é um ótimo mago! ✨🎉'],
        3: ['Thank you so much! The door is [[open|aberta]] and the wizard found his book. [[Well done|Muito bem]], little wizard! ✨🎉', ''],
      },
    },
    ouvir: { 1: ['please', 'thank you', 'sorry'], 2: ['good morning', 'good night', 'excuse me'], 3: ['good afternoon', 'good evening', "you're welcome"] },
    ler: {
      1: { en: 'Good night!', pt: 'Boa noite!', opcoes: ['🌙', '🌅'] },
      2: { en: 'Good morning, teacher!', pt: 'Bom dia, professor(a)!', opcoes: ['🌅', '🌙', '🌆'] },
      3: { en: 'I go to [[bed|cama]] and say: good night, [[mom|mamãe]]!', pt: '', opcoes: ['🌙🛏️', '🌅🛏️', '☀️🏫', '🌆🍽️'] },
    },
    soletrar: { 1: { en: 'sorry', extras: '' }, 2: { en: 'please', extras: '' }, 3: { en: 'thank you', extras: 'gr' } },
    montar: {
      1: { blocos: ['Can I', 'have it,', 'please?'], pt: 'Posso pegar, por favor?' },
      2: { blocos: ['Thank', 'you', 'very', 'much!'], pt: 'Muito obrigado!' },
      3: { blocos: ['Can', 'I', 'have', 'a', 'pencil,', 'please?'], pt: 'Posso pegar um lápis, por favor?' },
    },
  },
  {
    id: 'm3-05-school', serie: '3º', mes: '2026-05', tema: 'School objects', titulo: 'Max e a Mochila Bagunçada', icone: '🎒',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Look at my backpack!", 'Oi! Eu sou o Max. Olhe minha mochila!'],
        2: ["Hi! I'm Max. My backpack is a mess! Help me find my school things.", 'Oi! Eu sou o Max. Minha mochila está uma bagunça! Me ajude a achar meu material.'],
        3: ["Hi, I'm Max! My [[backpack|mochila]] is a [[mess|bagunça]] and the class starts in five [[minutes|minutos]]. Help me find my school things, [[quick|rápido]]!", ''],
      },
      c2: {
        1: ['What is this?', 'O que é isto?'],
        2: ['The teacher has a list. Read it!', 'A professora tem uma lista. Leia!'],
        3: ['The teacher wrote the [[list|lista]] of [[things|coisas]] for today. Read it and find the right [[desk|carteira]]!', ''],
      },
      c3: {
        1: ['Oh no! The label fell!', 'Ah, não! A etiqueta caiu!'],
        2: ['Oh no! A label fell off. Spell it!', 'Ah, não! Uma etiqueta caiu. Soletre!'],
        3: ['Oh no! My little brother [[played|brincou]] with the letter [[stickers|adesivos]]. Spell the word again, but [[be careful|cuidado]]: some letters are extra!', ''],
      },
      c4: {
        1: ['Last one! Say it!', 'Última! Fale!'],
        2: ["Last one! Build the teacher's sentence!", 'Última! Monte a frase da professora!'],
        3: ['Last one! The teacher needs a [[sentence|frase]] for the [[board|quadro]]. Put the words in order!', ''],
      },
      fim: {
        1: ['Thank you! My backpack is ready! 🎉', 'Obrigado! Minha mochila está pronta! 🎉'],
        2: ["Thank you! I have all my things. Let's go to class! 🎉", 'Obrigado! Tenho todo o meu material. Vamos para a aula! 🎉'],
        3: ["Thank you so much! My backpack is [[organized|organizada]] and I'm [[on time|na hora]] for class! 🎉", ''],
      },
    },
    ouvir: { 1: ['book', 'pencil', 'ruler'], 2: ['scissors', 'backpack', 'crayon'], 3: ['notebook', 'paintbrush', 'computer'] },
    ler: {
      1: { en: 'It is a book.', pt: 'É um livro.', opcoes: ['📕', '✏️'] },
      2: { en: 'I have a pencil and a ruler.', pt: 'Eu tenho um lápis e uma régua.', opcoes: ['✏️📏', '✏️✂️', '📕📏'] },
      3: { en: 'On my [[desk|carteira]] there are two [[books|livros]] and one [[crayon|giz de cera]].', pt: '', opcoes: ['📕📕🖍️', '📕🖍️🖍️', '📕📕✏️', '📓📓🖍️'] },
    },
    soletrar: { 1: { en: 'book', extras: '' }, 2: { en: 'ruler', extras: '' }, 3: { en: 'scissors', extras: 'zt' } },
    montar: {
      1: { blocos: ['It is', 'a', 'pencil.'], pt: 'É um lápis.' },
      2: { blocos: ['Open', 'your', 'book,', 'please.'], pt: 'Abra o seu livro, por favor.' },
      3: { blocos: ['I', 'have', 'a', 'red', 'pencil', 'case.'], pt: 'Eu tenho um estojo vermelho.' },
    },
  },
  {
    id: 'm3-06-colors', serie: '3º', mes: '2026-06', tema: 'Colors', titulo: 'Max e o Arco-Íris Sumido', icone: '🌈',
    historia: {
      intro: {
        1: ["Hi! I'm Max. I love colors!", 'Oi! Eu sou o Max. Eu amo cores!'],
        2: ["Hi! I'm Max. The rainbow lost its colors! Can you help me find them?", 'Oi! Eu sou o Max. O arco-íris perdeu as cores! Você me ajuda a achá-las?'],
        3: ["Hi, I'm Max! After the [[rain|chuva]], the [[rainbow|arco-íris]] came out [[gray|cinza]]. A [[naughty|travessa]] cloud took the colors. Let's get them [[back|de volta]]!", ''],
      },
      c2: {
        1: ['What color is it?', 'Que cor é?'],
        2: ['The cloud left a note. Read it!', 'A nuvem deixou um bilhete. Leia!'],
        3: ['The [[cloud|nuvem]] left a [[clue|pista]]. Read it and choose the right [[balloons|balões]]!', ''],
      },
      c3: {
        1: ['Oh no! The paint spilled!', 'Ah, não! A tinta derramou!'],
        2: ['Oh no! The paint can label is wet. Spell the color!', 'Ah, não! A etiqueta da lata de tinta molhou. Soletre a cor!'],
        3: ['Oh no! The [[label|etiqueta]] of the paint [[can|lata]] got wet and the letters [[slid|escorregaram]]. Spell the color again!', ''],
      },
      c4: {
        1: ['Last one! Say the color!', 'Última! Diga a cor!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write a sentence for the rainbow [[poster|cartaz]]!', ''],
      },
      fim: {
        1: ['Thank you! Look at the rainbow! 🌈🎉', 'Obrigado! Olhe o arco-íris! 🌈🎉'],
        2: ['Thank you! The rainbow has all its colors again! 🌈🎉', 'Obrigado! O arco-íris tem todas as cores de novo! 🌈🎉'],
        3: ['Thank you so much! The rainbow is [[beautiful|lindo]] again and the cloud said [[sorry|desculpa]]! 🌈🎉', ''],
      },
    },
    ouvir: { 1: ['red', 'blue', 'yellow'], 2: ['green', 'orange', 'purple'], 3: ['brown', 'pink', 'gray'] },
    ler: {
      1: { en: 'It is red.', pt: 'É vermelho.', opcoes: ['🔴', '🔵'] },
      2: { en: 'The apple is green.', pt: 'A maçã é verde.', opcoes: ['🍏', '🍎', '🍌'] },
      3: { en: 'I have one [[red|vermelho]] balloon and two [[yellow|amarelos]] balloons.', pt: '', opcoes: ['🔴🟡🟡', '🔴🔴🟡', '🔵🟡🟡', '🔴🟢🟢'] },
    },
    soletrar: { 1: { en: 'red', extras: '' }, 2: { en: 'green', extras: '' }, 3: { en: 'purple', extras: 'kb' } },
    montar: {
      1: { blocos: ['The sun', 'is', 'yellow.'], pt: 'O sol é amarelo.' },
      2: { blocos: ['My', 'favorite', 'color', 'is', 'pink.'], pt: 'Minha cor favorita é rosa.' },
      3: { blocos: ['What', 'color', 'is', 'your', 'backpack?'], pt: 'Qual é a cor da sua mochila?' },
    },
  },
  {
    id: 'm3-08-numbers', serie: '3º', mes: '2026-08', tema: 'Numbers 1 to 10', titulo: 'Max e o Piquenique', icone: '🧺',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's count!", 'Oi! Eu sou o Max. Vamos contar!'],
        2: ["Hi! I'm Max. I'm making a picnic for my friends. Help me count!", 'Oi! Eu sou o Max. Estou fazendo um piquenique para meus amigos. Me ajude a contar!'],
        3: ["Hi, I'm Max! I'm [[planning|planejando]] a [[picnic|piquenique]] for my friends, but I'm not [[good at|bom em]] counting. Can you help me count [[everything|tudo]]?", ''],
      },
      c2: {
        1: ['How many?', 'Quantos?'],
        2: ['My friend sent a message. Read it!', 'Meu amigo mandou uma mensagem. Leia!'],
        3: ['My friend Bella sent a [[shopping list|lista de compras]]. Read it and find the right [[basket|cesta]]!', ''],
      },
      c3: {
        1: ['Oh no! The number fell!', 'Ah, não! O número caiu!'],
        2: ['Oh no! The number card is broken. Spell it!', 'Ah, não! O cartão do número quebrou. Soletre!'],
        3: ['Oh no! An [[ant|formiga]] [[carried|carregou]] some letters away and brought [[others|outras]]. Spell the number again!', ''],
      },
      c4: {
        1: ['Last one! Count with me!', 'Última! Conte comigo!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write the [[invitation|convite]] sentence for my friends!', ''],
      },
      fim: {
        1: ['Thank you! Picnic time! 🧺🎉', 'Obrigado! Hora do piquenique! 🧺🎉'],
        2: ['Thank you! Everything is ready for the picnic! 🧺🎉', 'Obrigado! Tudo pronto para o piquenique! 🧺🎉'],
        3: ["Thank you so much! We have [[enough|bastante]] food for everybody. Let's [[eat|comer]]! 🧺🎉", ''],
      },
    },
    ouvir: { 1: ['one', 'two', 'three'], 2: ['four', 'five', 'six'], 3: ['seven', 'eight', 'nine'] },
    ler: {
      1: { en: 'Two apples.', pt: 'Duas maçãs.', opcoes: ['🍎🍎', '🍎'] },
      2: { en: 'I have three bananas.', pt: 'Eu tenho três bananas.', opcoes: ['🍌🍌🍌', '🍌🍌', '🍌🍌🍌🍌'] },
      3: { en: 'In the [[basket|cesta]] there are four [[apples|maçãs]] and two [[cakes|bolos]].', pt: '', opcoes: ['🍎🍎🍎🍎🍰🍰', '🍎🍎🍰🍰🍰🍰', '🍎🍎🍎🍰🍰', '🍎🍎🍎🍎🍰'] },
    },
    soletrar: { 1: { en: 'two', extras: '' }, 2: { en: 'five', extras: '' }, 3: { en: 'seven', extras: 'ia' } },
    montar: {
      1: { blocos: ['I have', 'two', 'pencils.'], pt: 'Eu tenho dois lápis.' },
      2: { blocos: ['I', 'have', 'five', 'apples.'], pt: 'Eu tenho cinco maçãs.' },
      3: { blocos: ['Come', 'to', 'my', 'picnic', 'at', 'ten!'], pt: 'Venha ao meu piquenique às dez!' },
    },
  },
  {
    id: 'm3-09-family', serie: '3º', mes: '2026-09', tema: 'My family', titulo: 'Max e o Álbum da Família', icone: '📸',
    historia: {
      intro: {
        1: ["Hi! I'm Max. This is my family!", 'Oi! Eu sou o Max. Esta é a minha família!'],
        2: ["Hi! I'm Max. I found an old photo album. Let's meet my family!", 'Oi! Eu sou o Max. Achei um álbum de fotos antigo. Vamos conhecer minha família!'],
        3: ["Hi, I'm Max! I found Grandma's old [[photo album|álbum de fotos]] in the [[attic|sótão]]. The photos are [[mixed up|misturadas]]. Help me [[put|colocar]] my family in order!", ''],
      },
      c2: {
        1: ['Who is this?', 'Quem é?'],
        2: ['There is a note under a photo. Read it!', 'Tem um bilhete embaixo de uma foto. Leia!'],
        3: ['Grandma wrote a [[note|bilhete]] on the [[back|verso]] of a photo. Read it and find the right photo!', ''],
      },
      c3: {
        1: ['Oh no! The name fell off!', 'Ah, não! O nome caiu!'],
        2: ['Oh no! The name under the photo is gone. Spell it!', 'Ah, não! O nome embaixo da foto sumiu. Soletre!'],
        3: ['Oh no! The [[glue|cola]] is old and the letters [[fell off|caíram]]. Some letters are from [[another|outra]] page. Spell the word!', ''],
      },
      c4: {
        1: ['Last one! Talk about your family!', 'Última! Fale da sua família!'],
        2: ['Last one! Build a sentence for the album!', 'Última! Monte uma frase para o álbum!'],
        3: ['Last one! Write a [[caption|legenda]] for the [[last|última]] photo!', ''],
      },
      fim: {
        1: ['Thank you! I love my family! ❤️🎉', 'Obrigado! Eu amo minha família! ❤️🎉'],
        2: ['Thank you! The album is ready. Grandma is happy! ❤️🎉', 'Obrigado! O álbum está pronto. A vovó está feliz! ❤️🎉'],
        3: ['Thank you so much! The album is [[perfect|perfeito]] and Grandma [[cried|chorou]] of [[happiness|felicidade]]! ❤️🎉', ''],
      },
    },
    ouvir: { 1: ['mother', 'father', 'baby'], 2: ['sister', 'brother', 'family'], 3: ['grandmother', 'grandfather', 'baby'] },
    ler: {
      1: { en: 'This is my mother.', pt: 'Esta é a minha mãe.', opcoes: ['👩', '👨'] },
      2: { en: 'I have one brother.', pt: 'Eu tenho um irmão.', opcoes: ['👦', '👦👦', '👧'] },
      3: { en: 'My [[grandparents|avós]] have a [[cat|gato]] and two [[dogs|cachorros]].', pt: '', opcoes: ['👵👴🐱🐶🐶', '👵👴🐱🐱🐶', '👩👨🐱🐶🐶', '👵👴🐶🐶'] },
    },
    soletrar: { 1: { en: 'baby', extras: '' }, 2: { en: 'sister', extras: '' }, 3: { en: 'brother', extras: 'sl' } },
    montar: {
      1: { blocos: ['This is', 'my', 'father.'], pt: 'Este é o meu pai.' },
      2: { blocos: ['I', 'have', 'one', 'sister.'], pt: 'Eu tenho uma irmã.' },
      3: { blocos: ['This', 'is', 'my', 'grandmother', 'Rosa.'], pt: 'Esta é a minha avó Rosa.' },
    },
  },

  // ---------------- 4º ano ----------------
  {
    id: 'm4-03-school', serie: '4º', mes: '2026-03', tema: 'School objects', titulo: 'Max na Papelaria', icone: '✏️',
    historia: {
      intro: {
        1: ["Hi! I'm Max. School is back!", 'Oi! Eu sou o Max. As aulas voltaram!'],
        2: ["Hi! I'm Max. School starts tomorrow and I need school things. Let's go shopping!", 'Oi! Eu sou o Max. As aulas começam amanhã e preciso de material. Vamos às compras!'],
        3: ["Hi, I'm Max! School starts [[tomorrow|amanhã]] and my [[list|lista]] of school things is [[long|longa]]. Let's go to the [[stationery shop|papelaria]] together!", ''],
      },
      c2: {
        1: ["What's this?", 'O que é isto?'],
        2: ['The shop has a sign. Read it!', 'A loja tem uma placa. Leia!'],
        3: ['The shop has a [[special offer|promoção]]. Read the [[sign|placa]] and choose the right kit!', ''],
      },
      c3: {
        1: ['Oh no! The price tag fell!', 'Ah, não! A etiqueta caiu!'],
        2: ['Oh no! The labels fell off the shelf. Spell the word!', 'Ah, não! As etiquetas caíram da prateleira. Soletre a palavra!'],
        3: ['Oh no! The [[shop owner|dono da loja]] [[dropped|derrubou]] the letter box. Some letters are extra. Spell the word!', ''],
      },
      c4: {
        1: ['Last one! Say what you have!', 'Última! Diga o que você tem!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! I want to [[ask|perguntar]] the shop owner a [[question|pergunta]]. Put the words in order!', ''],
      },
      fim: {
        1: ['Thank you! I am ready for school! 🎉', 'Obrigado! Estou pronto para a escola! 🎉'],
        2: ['Thank you! I have everything for school! 🎉', 'Obrigado! Tenho tudo para a escola! 🎉'],
        3: ["Thank you so much! My backpack is [[full|cheia]] and I'm [[ready|pronto]] for the new school year! 🎉", ''],
      },
    },
    ouvir: { 1: ['book', 'pencil', 'glue'], 2: ['scissors', 'ruler', 'backpack'], 3: ['pencil case', 'crayon', 'pen'] },
    ler: {
      1: { en: "It's a pencil.", pt: 'É um lápis.', opcoes: ['✏️', '📏'] },
      2: { en: 'I have a ruler and scissors.', pt: 'Eu tenho uma régua e uma tesoura.', opcoes: ['📏✂️', '📏✏️', '🖊️✂️'] },
      3: { en: 'Kit A: three [[pencils|lápis]], one [[glue|cola]] and one [[backpack|mochila]].', pt: '', opcoes: ['✏️✏️✏️🧴🎒', '✏️✏️🧴🎒', '✏️✏️✏️🧴🧴', '🖊️🖊️🖊️🧴🎒'] },
    },
    soletrar: { 1: { en: 'glue', extras: '' }, 2: { en: 'ruler', extras: '' }, 3: { en: 'sharpener', extras: 'ct' } },
    montar: {
      1: { blocos: ['I have', 'a', 'pen.'], pt: 'Eu tenho uma caneta.' },
      2: { blocos: ['I', 'need', 'a', 'ruler.'], pt: 'Eu preciso de uma régua.' },
      3: { blocos: ['How', 'much', 'is', 'the', 'red', 'backpack?'], pt: 'Quanto custa a mochila vermelha?' },
    },
  },
  {
    id: 'm4-03-colors', serie: '4º', mes: '2026-03', tema: 'Colors and numbers', titulo: 'Max e os Balões do Parque', icone: '🎈',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Look at my balloons!", 'Oi! Eu sou o Max. Olhe meus balões!'],
        2: ["Hi! I'm Max. I sell balloons at the park. Help me with the orders!", 'Oi! Eu sou o Max. Eu vendo balões no parque. Me ajude com os pedidos!'],
        3: ["Hi, I'm Max! I [[sell|vendo]] balloons at the [[park|parque]] on Sundays. Today I have [[lots of|muitos]] [[orders|pedidos]]. Can you help me?", ''],
      },
      c2: {
        1: ['Which balloons?', 'Quais balões?'],
        2: ['A girl wants balloons. Read her order!', 'Uma menina quer balões. Leia o pedido dela!'],
        3: ['A [[customer|cliente]] wrote a [[long|longo]] order. Read it and give her the right balloons!', ''],
      },
      c3: {
        1: ['Oh no! The sign fell!', 'Ah, não! A placa caiu!'],
        2: ['Oh no! The wind took the letters. Spell it!', 'Ah, não! O vento levou as letras. Soletre!'],
        3: ['Oh no! A [[strong|forte]] wind [[mixed|misturou]] the letters of my sign. Spell the word again!', ''],
      },
      c4: {
        1: ['Last one! Say it!', 'Última! Fale!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write the [[next|próximo]] order in my [[notebook|caderno]]!', ''],
      },
      fim: {
        1: ['Thank you! The balloons are flying! 🎈🎉', 'Obrigado! Os balões estão voando! 🎈🎉'],
        2: ['Thank you! All the children have balloons! 🎈🎉', 'Obrigado! Todas as crianças têm balões! 🎈🎉'],
        3: ['Thank you so much! I [[sold|vendi]] all my balloons today. You are a great [[partner|parceiro]]! 🎈🎉', ''],
      },
    },
    ouvir: { 1: ['red', 'blue', 'three'], 2: ['purple', 'orange', 'seven'], 3: ['brown', 'gray', 'nine'] },
    ler: {
      1: { en: 'Two red balloons.', pt: 'Dois balões vermelhos.', opcoes: ['🔴🔴', '🔴'] },
      2: { en: 'I want three green balloons.', pt: 'Eu quero três balões verdes.', opcoes: ['🟢🟢🟢', '🟢🟢', '🔵🔵🔵'] },
      3: { en: 'I want two [[yellow|amarelos]] balloons and four [[blue|azuis]] balloons, please.', pt: '', opcoes: ['🟡🟡🔵🔵🔵🔵', '🟡🟡🟡🟡🔵🔵', '🟡🟡🔵🔵🔵', '🟠🟠🔵🔵🔵🔵'] },
    },
    soletrar: { 1: { en: 'blue', extras: '' }, 2: { en: 'orange', extras: '' }, 3: { en: 'purple', extras: 'nl' } },
    montar: {
      1: { blocos: ['I have', 'two', 'balloons.'], pt: 'Eu tenho dois balões.' },
      2: { blocos: ['My', 'notebook', 'is', 'green.'], pt: 'Meu caderno é verde.' },
      3: { blocos: ['I', 'have', 'three', 'blue', 'pens.'], pt: 'Eu tenho três canetas azuis.' },
    },
  },
  {
    id: 'm4-04-months', serie: '4º', mes: '2026-04', tema: 'Months of the year', titulo: 'Max e o Calendário Molhado', icone: '📅',
    historia: {
      intro: {
        1: ["Hi! I'm Max. I love birthdays!", 'Oi! Eu sou o Max. Eu amo aniversários!'],
        2: ["Hi! I'm Max. I lost my calendar! I don't know my friends' birthdays.", 'Oi! Eu sou o Max. Perdi meu calendário! Não sei os aniversários dos meus amigos.'],
        3: ["Hi, I'm Max! My [[calendar|calendário]] fell in a [[puddle|poça]] and the months are [[wet|molhados]]. I need to [[remember|lembrar]] my friends' birthdays!", ''],
      },
      c2: {
        1: ['When is it?', 'Quando é?'],
        2: ['Bella sent a message. Read it!', 'A Bella mandou uma mensagem. Leia!'],
        3: ['Bella sent a [[party|festa]] [[invitation|convite]]. Read it and choose the right picture!', ''],
      },
      c3: {
        1: ['Oh no! The month fell off!', 'Ah, não! O mês caiu!'],
        2: ['Oh no! A month is missing on the calendar. Spell it!', 'Ah, não! Falta um mês no calendário. Soletre!'],
        3: ['Oh no! The [[rain|chuva]] [[erased|apagou]] a month, and some letters are from [[another|outra]] page. Spell it again!', ''],
      },
      c4: {
        1: ['Last one! Say your birthday month!', 'Última! Diga o mês do seu aniversário!'],
        2: ['Last one! Build the question!', 'Última! Monte a pergunta!'],
        3: ['Last one! Write a sentence for my new [[calendar|calendário]]!', ''],
      },
      fim: {
        1: ['Thank you! My calendar is ready! 🎉', 'Obrigado! Meu calendário está pronto! 🎉'],
        2: ["Thank you! Now I know my friends' birthdays! 🎉", 'Obrigado! Agora sei os aniversários dos meus amigos! 🎉'],
        3: ["Thank you so much! My new calendar is [[on the wall|na parede]] and I won't [[forget|esquecer]] any birthday! 🎉", ''],
      },
    },
    ouvir: { 1: ['January', 'May', 'December'], 2: ['March', 'July', 'October'], 3: ['February', 'August', 'November'] },
    ler: {
      1: { en: 'Christmas is in December.', pt: 'O Natal é em dezembro.', opcoes: ['🎄', '🐰'] },
      2: { en: 'Easter is in April.', pt: 'A Páscoa é em abril.', opcoes: ['🐰', '🎄', '🎃'] },
      3: { en: 'My birthday is in [[June|junho]]. Come to my party at the [[June festival|festa junina]]!', pt: '', opcoes: ['🌽🎂', '🎄🎂', '🎃🎂', '🐰🎂'] },
    },
    soletrar: { 1: { en: 'May', extras: '' }, 2: { en: 'April', extras: '' }, 3: { en: 'August', extras: 'ce' } },
    montar: {
      1: { blocos: ['My birthday', 'is in', 'May.'], pt: 'Meu aniversário é em maio.' },
      2: { blocos: ['When', 'is', 'your', 'birthday?'], pt: 'Quando é o seu aniversário?' },
      3: { blocos: ['My', 'birthday', 'is', 'in', 'September.'], pt: 'Meu aniversário é em setembro.' },
    },
  },
  {
    id: 'm4-05-birthday', serie: '4º', mes: '2026-05', tema: 'Birthday party', titulo: 'A Festa Surpresa da Bella', icone: '🎂',
    historia: {
      intro: {
        1: ["Hi! I'm Max. It's Bella's birthday!", 'Oi! Eu sou o Max. É aniversário da Bella!'],
        2: ["Hi! I'm Max. Today is Bella's birthday. Let's make a surprise party!", 'Oi! Eu sou o Max. Hoje é aniversário da Bella. Vamos fazer uma festa surpresa!'],
        3: ["Hi, I'm Max! Today is Bella's [[birthday|aniversário]] and she doesn't [[know|sabe]] about the [[surprise party|festa surpresa]]. We have one hour to get [[everything|tudo]] ready!", ''],
      },
      c2: {
        1: ['Look at the table!', 'Olhe a mesa!'],
        2: ['Mom wrote a note. Read it!', 'A mamãe escreveu um bilhete. Leia!'],
        3: ["Bella's mom wrote a [[party list|lista da festa]]. Read it and choose the right table!", ''],
      },
      c3: {
        1: ['Oh no! The banner fell!', 'Ah, não! A faixa caiu!'],
        2: ['Oh no! The letters fell off the banner. Spell the word!', 'Ah, não! As letras caíram da faixa. Soletre a palavra!'],
        3: ['Oh no! The [[cat|gato]] played with the [[banner|faixa]] and now there are extra letters. Spell the word!', ''],
      },
      c4: {
        1: ['Last one! Say happy birthday!', 'Última! Diga feliz aniversário!'],
        2: ['Last one! Ask Bella a question!', 'Última! Faça uma pergunta à Bella!'],
        3: ['Last one! Write a [[birthday card|cartão de aniversário]] for Bella!', ''],
      },
      fim: {
        1: ['Surprise! Happy birthday, Bella! 🎉', 'Surpresa! Feliz aniversário, Bella! 🎉'],
        2: ['Surprise! Bella loves her party! 🎉', 'Surpresa! A Bella amou a festa! 🎉'],
        3: ['SURPRISE! Bella was so [[surprised|surpresa]] and [[happy|feliz]]. Best party [[ever|de todas]]! 🎉', ''],
      },
    },
    ouvir: { 1: ['birthday cake', 'present', 'balloon'], 2: ['candle', 'ice cream', 'juice'], 3: ['invitation', 'party hat', 'candy'] },
    ler: {
      1: { en: 'It is a present.', pt: 'É um presente.', opcoes: ['🎁', '🎂'] },
      2: { en: 'The cake has three candles.', pt: 'O bolo tem três velas.', opcoes: ['🎂🕯️🕯️🕯️', '🎂🕯️🕯️', '🍦🕯️🕯️🕯️'] },
      3: { en: 'We need one [[cake|bolo]], two [[presents|presentes]] and three [[balloons|balões]].', pt: '', opcoes: ['🎂🎁🎁🎈🎈🎈', '🎂🎂🎁🎈🎈🎈', '🎂🎁🎁🎈🎈', '🍦🎁🎁🎈🎈🎈'] },
    },
    soletrar: { 1: { en: 'party', extras: '' }, 2: { en: 'candle', extras: '' }, 3: { en: 'present', extras: 'bu' } },
    montar: {
      1: { blocos: ['Happy', 'birthday,', 'Bella!'], pt: 'Feliz aniversário, Bella!' },
      2: { blocos: ['How', 'old', 'are', 'you?'], pt: 'Quantos anos você tem?' },
      3: { blocos: ['Happy', 'birthday!', 'You', 'are', 'nine', 'today!'], pt: 'Feliz aniversário! Você faz nove anos hoje!' },
    },
  },
  {
    id: 'm4-06-animals', serie: '4º', mes: '2026-06', tema: 'Animals', titulo: 'Max no Passeio ao Zoológico', icone: '🦁',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's go to the zoo!", 'Oi! Eu sou o Max. Vamos ao zoológico!'],
        2: ["Hi! I'm Max. Today is our school trip to the farm and the zoo!", 'Oi! Eu sou o Max. Hoje é o passeio da escola à fazenda e ao zoológico!'],
        3: ["Hi, I'm Max! Today is our school [[trip|passeio]]. In the [[morning|manhã]] we visit the farm, and in the [[afternoon|tarde]] the zoo. Don't [[get lost|se perder]]!", ''],
      },
      c2: {
        1: ['Which animal?', 'Qual animal?'],
        2: ['The guide has a sign. Read it!', 'O guia tem uma placa. Leia!'],
        3: ['The [[zookeeper|tratador]] has a [[sign|placa]] for the [[new|nova]] area. Read it and find the animals!', ''],
      },
      c3: {
        1: ['Oh no! The sign fell!', 'Ah, não! A placa caiu!'],
        2: ['Oh no! A monkey took the letters from the sign. Spell it!', 'Ah, não! Um macaco pegou as letras da placa. Soletre!'],
        3: ['Oh no! A [[cheeky|levado]] monkey took the letters and [[threw|jogou]] in some extra ones. Spell the animal name!', ''],
      },
      c4: {
        1: ['Last one! Say what you like!', 'Última! Diga do que você gosta!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write a sentence for our trip [[report|relatório]]!', ''],
      },
      fim: {
        1: ['Thank you! I love the zoo! 🎉', 'Obrigado! Eu amo o zoológico! 🎉'],
        2: ['Thank you! What a great trip! 🎉', 'Obrigado! Que passeio legal! 🎉'],
        3: ['Thank you so much! We saw [[all|todos]] the animals and [[nobody|ninguém]] got lost! 🎉', ''],
      },
    },
    ouvir: { 1: ['cow', 'lion', 'duck'], 2: ['elephant', 'monkey', 'sheep'], 3: ['giraffe', 'zebra', 'goat'] },
    ler: {
      1: { en: "It's a lion.", pt: 'É um leão.', opcoes: ['🦁', '🐯'] },
      2: { en: 'The elephant is gray.', pt: 'O elefante é cinza.', opcoes: ['🐘', '🦒', '🐄'] },
      3: { en: 'In the new area there are two [[zebras|zebras]] and one [[giraffe|girafa]].', pt: '', opcoes: ['🦓🦓🦒', '🦓🦒🦒', '🐴🐴🦒', '🦓🦓🐘'] },
    },
    soletrar: { 1: { en: 'cow', extras: '' }, 2: { en: 'monkey', extras: '' }, 3: { en: 'giraffe', extras: 'du' } },
    montar: {
      1: { blocos: ['I', 'like', 'monkeys.'], pt: 'Eu gosto de macacos.' },
      2: { blocos: ['The', 'lion', 'is', 'big.'], pt: 'O leão é grande.' },
      3: { blocos: ['My', 'favorite', 'animal', 'is', 'the', 'elephant.'], pt: 'Meu animal favorito é o elefante.' },
    },
  },
  {
    id: 'm4-08-numbers', serie: '4º', mes: '2026-08', tema: 'Numbers 11 to 20', titulo: 'Max e o Campeonato', icone: '⚽',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's play soccer!", 'Oi! Eu sou o Max. Vamos jogar futebol!'],
        2: ["Hi! I'm Max. Today is the school soccer championship. Help me with the numbers!", 'Oi! Eu sou o Max. Hoje é o campeonato de futebol da escola. Me ajude com os números!'],
        3: ["Hi, I'm Max! Today is the big [[soccer championship|campeonato de futebol]] and I'm the [[scorekeeper|marcador do placar]]. I need help with the numbers!", ''],
      },
      c2: {
        1: ['Look at the shirt!', 'Olhe a camisa!'],
        2: ['The coach wrote a note. Read it!', 'O técnico escreveu um bilhete. Leia!'],
        3: ['The [[coach|técnico]] wrote the [[score|placar]] on a paper. Read it and choose the right [[scoreboard|placar]]!', ''],
      },
      c3: {
        1: ['Oh no! The number fell!', 'Ah, não! O número caiu!'],
        2: ['Oh no! The scoreboard broke. Spell the number!', 'Ah, não! O placar quebrou. Soletre o número!'],
        3: ['Oh no! The ball [[hit|bateu]] the scoreboard and the letters [[fell|caíram]]. Spell the number again!', ''],
      },
      c4: {
        1: ['Last one! Count the cows!', 'Última! Conte as vacas!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write the [[final score|placar final]] for the school [[newspaper|jornal]]!', ''],
      },
      fim: {
        1: ['Goal! Thank you! ⚽🎉', 'Gol! Obrigado! ⚽🎉'],
        2: ['Thank you! Our team won! ⚽🎉', 'Obrigado! Nosso time ganhou! ⚽🎉'],
        3: ['Thank you so much! The score is right and our team is the [[champion|campeão]]! ⚽🎉', ''],
      },
    },
    ouvir: { 1: ['eleven', 'twelve', 'fifteen'], 2: ['thirteen', 'sixteen', 'twenty'], 3: ['fourteen', 'seventeen', 'nineteen'] },
    ler: {
      1: { en: 'Number twelve.', pt: 'Número doze.', opcoes: ['12', '11'] },
      2: { en: 'There are fifteen ducks.', pt: 'Há quinze patos.', opcoes: ['15', '50', '14'] },
      3: { en: 'Blue [[team|time]]: eighteen. Red team: [[thirteen|treze]].', pt: '', opcoes: ['🔵 18 × 13 🔴', '🔵 13 × 18 🔴', '🔵 80 × 30 🔴', '🔵 18 × 30 🔴'] },
    },
    soletrar: { 1: { en: 'eleven', extras: '' }, 2: { en: 'twenty', extras: '' }, 3: { en: 'thirteen', extras: 'fy' } },
    montar: {
      1: { blocos: ['There are', 'twelve', 'cows.'], pt: 'Há doze vacas.' },
      2: { blocos: ['How', 'many', 'players?', 'Eleven!'], pt: 'Quantos jogadores? Onze!' },
      3: { blocos: ['The', 'blue', 'team', 'has', 'eighteen', 'points.'], pt: 'O time azul tem dezoito pontos.' },
    },
  },

  // ---------------- 5º ano ----------------
  {
    id: 'm5-03-personal', serie: '5º', mes: '2026-03', tema: 'Personal information', titulo: 'Max e a Carteirinha da Biblioteca', icone: '🪪',
    historia: {
      intro: {
        1: ["Hi! I'm Max. I want a library card!", 'Oi! Eu sou o Max. Quero uma carteirinha da biblioteca!'],
        2: ["Hi! I'm Max. I want to borrow books from the library, but I need a library card first.", 'Oi! Eu sou o Max. Quero pegar livros na biblioteca, mas primeiro preciso de uma carteirinha.'],
        3: ["Hi, I'm Max! The [[library|biblioteca]] has [[amazing|incríveis]] books, but I need a [[library card|carteirinha]]. I have to [[fill in|preencher]] a form with my [[personal information|dados pessoais]]. Can you help me?", ''],
      },
      c2: {
        1: ['Look at the card!', 'Olhe a carteirinha!'],
        2: ['The librarian wrote a sentence. Read it!', 'A bibliotecária escreveu uma frase. Leia!'],
        3: ['The [[librarian|bibliotecária]] showed me my new card. Read it and choose the right one!', ''],
      },
      c3: {
        1: ['Oh no! The form is wet!', 'Ah, não! A ficha molhou!'],
        2: ['Oh no! A word is missing on my form. Spell it!', 'Ah, não! Falta uma palavra na minha ficha. Soletre!'],
        3: ['Oh no! I spilled [[juice|suco]] on the [[form|ficha]] and some letters [[disappeared|sumiram]]. Spell the word again!', ''],
      },
      c4: {
        1: ['Last one! Say your name!', 'Última! Diga seu nome!'],
        2: ['Last one! Answer the librarian!', 'Última! Responda à bibliotecária!'],
        3: ['Last one! [[Introduce yourself|Apresente-se]] to the librarian with a [[full|completa]] sentence!', ''],
      },
      fim: {
        1: ['Thank you! I have my card! 📚🎉', 'Obrigado! Tenho minha carteirinha! 📚🎉'],
        2: ['Thank you! Now I can borrow books! 📚🎉', 'Obrigado! Agora posso pegar livros! 📚🎉'],
        3: ['Thank you so much! I have my card and I [[borrowed|peguei emprestado]] three [[adventure|aventura]] books! 📚🎉', ''],
      },
    },
    ouvir: { 1: ['name', 'age', 'school'], 2: ['address', 'phone number', 'city'], 3: ['country', 'email', 'birthday'] },
    ler: {
      1: { en: 'My school is big.', pt: 'Minha escola é grande.', opcoes: ['🏫', '🏠'] },
      2: { en: 'I live in Joinville, in Brazil.', pt: 'Eu moro em Joinville, no Brasil.', opcoes: ['🇧🇷', '🇺🇸', '🇬🇧'] },
      3: { en: 'Name: Max. [[Age|Idade]]: nine. [[Country|País]]: Brazil. [[Favorite|Favorita]] food: pizza.', pt: '', opcoes: ['🐶 9 🇧🇷 🍕', '🐶 10 🇧🇷 🍕', '🐶 9 🇧🇷 🍔', '🐱 9 🇧🇷 🍕'] },
    },
    soletrar: { 1: { en: 'name', extras: '' }, 2: { en: 'city', extras: '' }, 3: { en: 'country', extras: 'ws' } },
    montar: {
      1: { blocos: ['My name', 'is', 'Max.'], pt: 'Meu nome é Max.' },
      2: { blocos: ["I'm", 'ten', 'years', 'old.'], pt: 'Eu tenho dez anos.' },
      3: { blocos: ['I', 'live', 'in', 'Joinville,', 'in', 'Brazil.'], pt: 'Eu moro em Joinville, no Brasil.' },
    },
  },
  {
    id: 'm5-04-numbers', serie: '5º', mes: '2026-04', tema: 'Numbers to 100', titulo: 'Max e o Bingo da Escola', icone: '💯',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's play bingo!", 'Oi! Eu sou o Max. Vamos jogar bingo!'],
        2: ["Hi! I'm Max. Today is the school bingo night! Listen to the numbers.", 'Oi! Eu sou o Max. Hoje é a noite do bingo da escola! Ouça os números.'],
        3: ["Hi, I'm Max! Tonight is the school [[bingo night|noite do bingo]] and the [[prize|prêmio]] is a giant chocolate cake. Listen [[carefully|com atenção]]!", ''],
      },
      c2: {
        1: ['Which number?', 'Qual número?'],
        2: ['Read my bingo card!', 'Leia minha cartela de bingo!'],
        3: ['The [[host|apresentador]] read the [[winning|vencedores]] numbers. Read them and find the [[winning card|cartela vencedora]]!', ''],
      },
      c3: {
        1: ['Oh no! The ball fell!', 'Ah, não! A bolinha caiu!'],
        2: ['Oh no! A number is missing. Spell it!', 'Ah, não! Falta um número. Soletre!'],
        3: ['Oh no! The bingo [[machine|máquina]] [[broke|quebrou]] and mixed the letters. Spell the number!', ''],
      },
      c4: {
        1: ['Last one! Say your age!', 'Última! Diga sua idade!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write a sentence about your [[house|casa]] for the prize [[form|ficha]]!', ''],
      },
      fim: {
        1: ['BINGO! Thank you! 🎉', 'BINGO! Obrigado! 🎉'],
        2: ['BINGO! We won the cake! 🎂🎉', 'BINGO! Ganhamos o bolo! 🎂🎉'],
        3: ['BINGO! We won the [[giant|gigante]] cake and we [[shared|dividimos]] it with everybody! 🎂🎉', ''],
      },
    },
    ouvir: { 1: ['thirty', 'fifty', 'one hundred'], 2: ['forty', 'sixty', 'eighty'], 3: ['seventy', 'ninety', 'twenty-one'] },
    ler: {
      1: { en: 'Number fifty.', pt: 'Número cinquenta.', opcoes: ['50', '15'] },
      2: { en: 'My house number is forty-five.', pt: 'O número da minha casa é quarenta e cinco.', opcoes: ['🏠 45', '🏠 54', '🏠 40'] },
      3: { en: 'The [[winning|vencedora]] card has thirty, [[sixty-six|sessenta e seis]] and ninety.', pt: '', opcoes: ['30 · 66 · 90', '13 · 66 · 19', '30 · 60 · 90', '30 · 66 · 19'] },
    },
    soletrar: { 1: { en: 'fifty', extras: '' }, 2: { en: 'forty', extras: '' }, 3: { en: 'ninety', extras: 'ae' } },
    montar: {
      1: { blocos: ["I'm", 'eleven', 'years old.'], pt: 'Eu tenho onze anos.' },
      2: { blocos: ['There', 'are', 'thirty', 'students.'], pt: 'Há trinta alunos.' },
      3: { blocos: ['My', 'house', 'number', 'is', 'forty-five.'], pt: 'O número da minha casa é quarenta e cinco.' },
    },
  },
  {
    id: 'm5-05-alphabet', serie: '5º', mes: '2026-05', tema: 'The alphabet', titulo: 'Max e a Sopa de Letrinhas', icone: '🥣',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's play with letters!", 'Oi! Eu sou o Max. Vamos brincar com letras!'],
        2: ["Hi! I'm Max. Grandma made alphabet soup! Let's find the letters.", 'Oi! Eu sou o Max. A vovó fez sopa de letrinhas! Vamos achar as letras.'],
        3: ["Hi, I'm Max! Grandma made [[alphabet soup|sopa de letrinhas]] for lunch. She says I can only eat [[dessert|sobremesa]] if I find the [[secret|secretas]] letters. Help me!", ''],
      },
      c2: {
        1: ['Which fruit?', 'Qual fruta?'],
        2: ['Grandma wrote a note. Read it!', 'A vovó escreveu um bilhete. Leia!'],
        3: ['Grandma wrote a [[riddle|charada]]. Read it and choose the right fruit!', ''],
      },
      c3: {
        1: ['Spell my name!', 'Soletre meu nome!'],
        2: ["Oh no! My friend's name tag fell in the soup. Spell it!", 'Ah, não! O crachá da minha amiga caiu na sopa. Soletre!'],
        3: ['Oh no! The letters in the soup are [[floating|boiando]] and some are extra. Spell the [[word|palavra]]!', ''],
      },
      c4: {
        1: ['Last one! Ask a question!', 'Última! Faça uma pergunta!'],
        2: ['Last one! Build the question!', 'Última! Monte a pergunta!'],
        3: ['Last one! Ask Grandma how to [[spell|soletrar]] her name. Put the words in order!', ''],
      },
      fim: {
        1: ['Yummy! Thank you! 🥣🎉', 'Que delícia! Obrigado! 🥣🎉'],
        2: ['Thank you! Now I can eat dessert! 🍨🎉', 'Obrigado! Agora posso comer a sobremesa! 🍨🎉'],
        3: ['Thank you so much! I found all the letters and Grandma gave me [[two|duas]] [[scoops|bolas]] of ice cream! 🍨🎉', ''],
      },
    },
    ouvir: { 1: ['A', 'E', 'O'], 2: ['G', 'J', 'R'], 3: ['H', 'Y', 'W'] },
    ler: {
      1: { en: 'A is for apple.', pt: 'A de apple (maçã).', opcoes: ['🍎', '🍌'] },
      2: { en: 'B is for banana.', pt: 'B de banana.', opcoes: ['🍌', '🍎', '🍇'] },
      3: { en: 'This [[fruit|fruta]] starts with G and it is [[purple|roxa]].', pt: '', opcoes: ['🍇', '🍆', '🍊', '🍎'] },
    },
    soletrar: { 1: { en: 'max', extras: '' }, 2: { en: 'bella', extras: '' }, 3: { en: 'grandma', extras: 'ek' } },
    montar: {
      1: { blocos: ['How do you', 'spell', 'it?'], pt: 'Como se soletra?' },
      2: { blocos: ['Can', 'you', 'spell', 'it,', 'please?'], pt: 'Você pode soletrar, por favor?' },
      3: { blocos: ['How', 'do', 'you', 'spell', 'your', 'name?'], pt: 'Como se soletra o seu nome?' },
    },
  },
  {
    id: 'm5-06-spelling', serie: '5º', mes: '2026-06', tema: 'Spelling', titulo: 'Max no Concurso de Soletrar', icone: '🐝',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's spell!", 'Oi! Eu sou o Max. Vamos soletrar!'],
        2: ["Hi! I'm Max. Today is the school Spelling Bee! Help me practice.", 'Oi! Eu sou o Max. Hoje é o concurso de soletrar da escola! Me ajude a treinar.'],
        3: ["Hi, I'm Max! Today is the school [[Spelling Bee|concurso de soletrar]] and I'm in the [[final|final]]! My [[heart|coração]] is beating fast. Help me [[practice|treinar]]!", ''],
      },
      c2: {
        1: ['Look and read!', 'Olhe e leia!'],
        2: ["Read the judge's card!", 'Leia o cartão do jurado!'],
        3: ['The [[judge|jurado]] gave me a [[card|cartão]] with a sentence. Read it and choose the right picture!', ''],
      },
      c3: {
        1: ['Spell the word!', 'Soletre a palavra!'],
        2: ['Now the real test. Spell it!', 'Agora o teste de verdade. Soletre!'],
        3: ['This is the [[final|última]] word! Be careful: there are [[tricky|complicadas]] extra letters. Spell it!', ''],
      },
      c4: {
        1: ['Last one! Ask the judge!', 'Última! Pergunte ao jurado!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! The judge wants a [[sentence|frase]] with the word. Build it!', ''],
      },
      fim: {
        1: ['I won! Thank you! 🏆🎉', 'Ganhei! Obrigado! 🏆🎉'],
        2: ['I won the Spelling Bee! Thank you! 🏆🎉', 'Ganhei o concurso! Obrigado! 🏆🎉'],
        3: ["Thank you so much! I'm the Spelling Bee [[champion|campeão]]! We are a great [[team|time]]! 🏆🎉", ''],
      },
    },
    ouvir: { 1: ['cat', 'sun', 'bus'], 2: ['hat', 'box', 'egg'], 3: ['star', 'frog', 'tree'] },
    ler: {
      1: { en: 'C, A, T. Cat!', pt: 'C, A, T. Gato!', opcoes: ['🐱', '🐶'] },
      2: { en: 'The frog is on the box.', pt: 'O sapo está em cima da caixa.', opcoes: ['🐸📦', '🐸🌳', '🐱📦'] },
      3: { en: 'Two [[fish|peixes]], one [[frog|sapo]] and three [[stars|estrelas]].', pt: '', opcoes: ['🐠🐠🐸⭐⭐⭐', '🐠🐸🐸⭐⭐⭐', '🐠🐠🐸⭐⭐', '🐱🐱🐸⭐⭐⭐'] },
    },
    soletrar: { 1: { en: 'sun', extras: '' }, 2: { en: 'fish', extras: '' }, 3: { en: 'frog', extras: 'gp' } },
    montar: {
      1: { blocos: ['How do you', 'spell', 'cat?'], pt: 'Como se soletra cat?' },
      2: { blocos: ['C,', 'A,', 'T.', 'Cat!'], pt: 'C, A, T. Gato!' },
      3: { blocos: ['The', 'frog', 'is', 'in', 'the', 'tree.'], pt: 'O sapo está na árvore.' },
    },
  },
  {
    id: 'm5-08-rooms', serie: '5º', mes: '2026-08', tema: 'Rooms of the house', titulo: 'Max e o Esconde-Esconde', icone: '🏠',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's play hide and seek!", 'Oi! Eu sou o Max. Vamos brincar de esconde-esconde!'],
        2: ["Hi! I'm Max. My friends are hiding in my house. Help me find them!", 'Oi! Eu sou o Max. Meus amigos estão escondidos na minha casa. Me ajude a achá-los!'],
        3: ["Hi, I'm Max! It's [[raining|chovendo]], so we are playing [[hide and seek|esconde-esconde]] inside the house. My friends are very good at [[hiding|se esconder]]. Help me find them!", ''],
      },
      c2: {
        1: ['Where is Bella?', 'Onde está a Bella?'],
        2: ['Bella left a clue. Read it!', 'A Bella deixou uma pista. Leia!'],
        3: ['Bella left a [[clue|pista]] on the [[fridge|geladeira]]. Read it and choose the right place!', ''],
      },
      c3: {
        1: ['Oh no! The door sign fell!', 'Ah, não! A placa da porta caiu!'],
        2: ['Oh no! The sign on the door fell. Spell the word!', 'Ah, não! A placa da porta caiu. Soletre a palavra!'],
        3: ['Oh no! My little sister [[changed|trocou]] the letters on the door [[signs|placas]]. Spell the room again!', ''],
      },
      c4: {
        1: ['Last one! Where are you?', 'Última! Onde você está?'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write a sentence about your [[house|casa]] for the game [[rules|regras]]!', ''],
      },
      fim: {
        1: ['Found you! Thank you! 🎉', 'Achei você! Obrigado! 🎉'],
        2: ['Thank you! I found all my friends! 🎉', 'Obrigado! Achei todos os meus amigos! 🎉'],
        3: ["Thank you so much! I found everybody. Now it's my [[turn|vez]] to hide! 🎉", ''],
      },
    },
    ouvir: { 1: ['kitchen', 'bedroom', 'bathroom'], 2: ['living room', 'garden', 'garage'], 3: ['dining room', 'garage', 'house'] },
    ler: {
      1: { en: "I'm in the kitchen.", pt: 'Estou na cozinha.', opcoes: ['🍳', '🛏️'] },
      2: { en: 'Bella is in the bathroom.', pt: 'A Bella está no banheiro.', opcoes: ['🛁', '🛏️', '🍳'] },
      3: { en: "I'm not in the [[kitchen|cozinha]]. I'm [[near|perto de]] the flowers, [[outside|lá fora]].", pt: '', opcoes: ['🌻', '🍳', '🛋️', '🚗'] },
    },
    soletrar: { 1: { en: 'house', extras: '' }, 2: { en: 'garden', extras: '' }, 3: { en: 'kitchen', extras: 'sb' } },
    montar: {
      1: { blocos: ["I'm in", 'the', 'bedroom.'], pt: 'Estou no quarto.' },
      2: { blocos: ['Dad', 'is', 'in', 'the', 'garden.'], pt: 'O papai está no jardim.' },
      3: { blocos: ['My', 'house', 'has', 'two', 'bedrooms.'], pt: 'Minha casa tem dois quartos.' },
    },
  },
  {
    id: 'm5-09-things', serie: '5º', mes: '2026-09', tema: 'Things in the house', titulo: 'Max e a Mudança', icone: '🛋️',
    historia: {
      intro: {
        1: ["Hi! I'm Max. We have a new house!", 'Oi! Eu sou o Max. Temos uma casa nova!'],
        2: ["Hi! I'm Max. We are moving to a new house! Help me put things in the right rooms.", 'Oi! Eu sou o Max. Estamos mudando para uma casa nova! Me ajude a colocar as coisas nos cômodos certos.'],
        3: ["Hi, I'm Max! Today is [[moving day|dia da mudança]]. The [[truck|caminhão]] is here and there are [[boxes|caixas]] everywhere. Help me [[organize|organizar]] the new house!", ''],
      },
      c2: {
        1: ['What is it?', 'O que é?'],
        2: ['Mom wrote a note on a box. Read it!', 'A mamãe escreveu um bilhete numa caixa. Leia!'],
        3: ['Mom wrote a [[plan|plano]] for the living room. Read it and choose the right picture!', ''],
      },
      c3: {
        1: ['Oh no! The box label fell!', 'Ah, não! A etiqueta da caixa caiu!'],
        2: ['Oh no! A box has no label. Spell it!', 'Ah, não! Uma caixa está sem etiqueta. Soletre!'],
        3: ['Oh no! The [[movers|carregadores]] [[tore|rasgaram]] a label and mixed the letters. Spell the word!', ''],
      },
      c4: {
        1: ['Last one! Say where it is!', 'Última! Diga onde está!'],
        2: ['Last one! Build the sentence!', 'Última! Monte a frase!'],
        3: ['Last one! Write a sentence for the [[moving list|lista da mudança]]!', ''],
      },
      fim: {
        1: ['Thank you! I love my new house! 🎉', 'Obrigado! Eu amo minha casa nova! 🎉'],
        2: ['Thank you! Everything is in the right place! 🎉', 'Obrigado! Tudo está no lugar certo! 🎉'],
        3: ['Thank you so much! The house is [[organized|organizada]] and I have a [[cozy|aconchegante]] new bed! 🎉', ''],
      },
    },
    ouvir: { 1: ['bed', 'chair', 'TV'], 2: ['sofa', 'lamp', 'door'], 3: ['mirror', 'shower', 'clock'] },
    ler: {
      1: { en: 'It is a bed.', pt: 'É uma cama.', opcoes: ['🛏️', '🪑'] },
      2: { en: 'The TV is in the living room.', pt: 'A TV está na sala.', opcoes: ['🛋️📺', '🛏️📺', '🍳📺'] },
      3: { en: 'In the living room: one [[sofa|sofá]], two [[lamps|luminárias]] and a [[clock|relógio]].', pt: '', opcoes: ['🛋️💡💡🕰️', '🛋️💡🕰️🕰️', '🛏️💡💡🕰️', '🛋️💡💡🪞'] },
    },
    soletrar: { 1: { en: 'bed', extras: '' }, 2: { en: 'lamp', extras: '' }, 3: { en: 'mirror', extras: 'nu' } },
    montar: {
      1: { blocos: ['The bed', 'is in', 'the bedroom.'], pt: 'A cama está no quarto.' },
      2: { blocos: ['There', 'is', 'a', 'TV.'], pt: 'Há uma TV.' },
      3: { blocos: ['The', 'fridge', 'is', 'in', 'the', 'kitchen.'], pt: 'A geladeira está na cozinha.' },
    },
  },
];
