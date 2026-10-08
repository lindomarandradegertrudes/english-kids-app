/**
 * Missões do mês padrão (outubro e novembro) — 3º, 4º e 5º ano, cada uma em 3 degraus.
 *
 * Uma missão = história curta com o Max + 4 desafios (25 pontos cada):
 *   ouvir    – Listen & Click: ouvir a palavra e tocar na figura (palavras do tema);
 *   ler      – Read & Choose: ler a frase e escolher a figura (opções: emojis ou monstros desenhados; a 1ª é a certa);
 *   soletrar – Spell it!: montar a palavra (no degrau 3 há letras extras);
 *   montar   – Build it!: montar a frase com blocos.
 * Falas: [inglês, português]. No degrau 3, [[palavra|tradução]] vira palavra-chave sublinhada com tradução.
 * As palavras de ouvir/soletrar precisam existir no tema (série + título).
 */

const MISSOES_PADRAO = [
  // ---------------- 3º ano ----------------
  {
    id: 'm3-2026-10-pets', serie: '3º', mes: '2026-10', tema: 'My pets', titulo: 'Max e o Show dos Bichinhos', icone: '🐾',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Today is the Pet Show!", 'Oi! Eu sou o Max. Hoje é o Show dos Bichinhos!'],
        2: ["Hi! I'm Max. Today is the school Pet Show, but the pets are lost! Can you help me?", 'Oi! Eu sou o Max. Hoje é o Show dos Bichinhos da escola, mas os bichinhos se perderam! Você me ajuda?'],
        3: ["Hi, I'm Max! Today is the school [[Pet Show|Show dos Bichinhos]], but the [[gate|portão]] was open and the pets [[ran away|fugiram]]. Listen and help me [[find|achar]] them!", ''],
      },
      c2: {
        1: ['Look! A pet is here.', 'Olhe! Um bichinho está aqui.'],
        2: ['Now read the name card. Which pet is it?', 'Agora leia o cartão. Qual bichinho é?'],
        3: ['The [[owner|dona]] wrote a [[card|cartão]] about her pets. Read it and find her pets!', ''],
      },
      c3: {
        1: ['Oh no! The name fell off!', 'Ah, não! O nome caiu!'],
        2: ['Oh no! A name tag fell off. Help me spell it!', 'Ah, não! Um crachá caiu. Me ajude a soletrar!'],
        3: ['Oh no! The [[name tags|crachás]] fell in the [[water bowl|tigela de água]] and the letters got [[mixed up|misturadas]]. Spell the name again!', ''],
      },
      c4: {
        1: ['Last one! Talk about your pet!', 'Última! Fale do seu bichinho!'],
        2: ['Last one! The judge needs a sentence. Build it!', 'Última! O juiz precisa de uma frase. Monte-a!'],
        3: ['Last one! The [[judge|juiz]] will read your sentence to [[everyone|todos]]. Put the words in the [[right order|ordem certa]]!', ''],
      },
      fim: {
        1: ['Thank you! All the pets are home! 🎉', 'Obrigado! Todos os bichinhos estão em casa! 🎉'],
        2: ['Thank you! The pets are back. The Pet Show can start! 🎉', 'Obrigado! Os bichinhos voltaram. O show pode começar! 🎉'],
        3: ['Thank you so much! Every pet is [[back|de volta]] and the Pet Show can [[start|começar]]. You are a [[great|ótimo]] helper! 🎉', ''],
      },
    },
    ouvir: { 1: ['cat', 'dog', 'fish'], 2: ['rabbit', 'bird', 'turtle'], 3: ['parrot', 'hamster', 'mouse'] },
    ler: {
      1: { en: 'It is a cat.', pt: 'É um gato.', opcoes: ['🐱', '🐶'] },
      2: { en: 'I have a black cat.', pt: 'Eu tenho um gato preto.', opcoes: ['🐈‍⬛', '🐱', '🐶'] },
      3: { en: 'I have [[two|dois]] cats and a [[fish|peixe]].', pt: '', opcoes: ['🐱🐱🐠', '🐱🐠', '🐶🐶🐠', '🐱🐱🐦'] },
    },
    soletrar: { 1: { en: 'dog', extras: '' }, 2: { en: 'rabbit', extras: '' }, 3: { en: 'parrot', extras: 'tk' } },
    montar: {
      1: { blocos: ['I have', 'a', 'dog.'], pt: 'Eu tenho um cachorro.' },
      2: { blocos: ['My', 'cat', 'is', 'black.'], pt: 'Meu gato é preto.' },
      3: { blocos: ['I', 'have', 'three', 'white', 'rabbits.'], pt: 'Eu tenho três coelhos brancos.' },
    },
  },
  {
    id: 'm3-2026-11-toys', serie: '3º', mes: '2026-11', tema: 'Toys', titulo: 'Max na Loja de Brinquedos', icone: '🧸',
    historia: {
      intro: {
        1: ["Hi! I'm Max. It's my birthday!", 'Oi! Eu sou o Max. É meu aniversário!'],
        2: ["Hi! I'm Max. Today is my birthday! Let's go to the toy shop!", 'Oi! Eu sou o Max. Hoje é meu aniversário! Vamos à loja de brinquedos!'],
        3: ["Hi, I'm Max! Today is my [[birthday|aniversário]] and Grandma gave me money for a [[new toy|brinquedo novo]]. Let's go to the [[toy shop|loja de brinquedos]] and choose!", ''],
      },
      c2: {
        1: ['Look at the shop window!', 'Olhe a vitrine!'],
        2: ['The shop has a sign. Read it and find the toy.', 'A loja tem uma placa. Leia e ache o brinquedo.'],
        3: ['The [[shop owner|dono da loja]] has a [[special offer|oferta especial]]. Read the sign and find the right toys!', ''],
      },
      c3: {
        1: ['Oh no! The toy box is open!', 'Ah, não! A caixa de brinquedos abriu!'],
        2: ['Oh no! The letters on the toy box fell off. Help me!', 'Ah, não! As letras da caixa de brinquedos caíram. Me ajude!'],
        3: ['Oh no! A little kid [[dropped|derrubou]] the [[letter blocks|blocos de letras]] from the shelf. Spell the toy name again!', ''],
      },
      c4: {
        1: ['Last one! Say what you like!', 'Última! Diga do que você gosta!'],
        2: ['Last one! Write my birthday card!', 'Última! Escreva meu cartão de aniversário!'],
        3: ['Last one! Grandma wants a [[thank-you card|cartão de agradecimento]]. Build the sentence for her!', ''],
      },
      fim: {
        1: ['Thank you! I love my new toy! 🎉', 'Obrigado! Eu amo meu brinquedo novo! 🎉'],
        2: ["Thank you! I have a new toy. Let's play! 🎉", 'Obrigado! Eu tenho um brinquedo novo. Vamos brincar! 🎉'],
        3: ["Thank you so much! My [[new|novo]] robot is [[awesome|incrível]]. Let's play [[together|juntos]]! 🎉", ''],
      },
    },
    ouvir: { 1: ['ball', 'car', 'kite'], 2: ['doll', 'robot', 'train'], 3: ['puzzle', 'skateboard', 'balloon'] },
    ler: {
      1: { en: 'It is a ball.', pt: 'É uma bola.', opcoes: ['⚽', '🚗'] },
      2: { en: 'I have a red car.', pt: 'Eu tenho um carrinho vermelho.', opcoes: ['🚗', '🚙', '🚂'] },
      3: { en: 'Two [[kites|pipas]] and one [[robot|robô]] for ten [[dollars|dólares]]!', pt: '', opcoes: ['🪁🪁🤖', '🪁🤖🤖', '🪁🪁🚂', '🎈🎈🤖'] },
    },
    soletrar: { 1: { en: 'car', extras: '' }, 2: { en: 'robot', extras: '' }, 3: { en: 'puzzle', extras: 'sb' } },
    montar: {
      1: { blocos: ['I like', 'my', 'ball.'], pt: 'Eu gosto da minha bola.' },
      2: { blocos: ['My', 'new', 'toy', 'is', 'red.'], pt: 'Meu brinquedo novo é vermelho.' },
      3: { blocos: ['Thank', 'you', 'for', 'my', 'new', 'robot!'], pt: 'Obrigado pelo meu robô novo!' },
    },
  },

  // ---------------- 4º ano ----------------
  {
    id: 'm4-2026-10-body', serie: '4º', mes: '2026-10', tema: 'My body', titulo: 'Max e a Festa dos Monstros', icone: '👾',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Help me make a monster!", 'Oi! Eu sou o Max. Me ajude a fazer um monstro!'],
        2: ["Hi! I'm Max. Tonight is the Monster Party! I need a monster costume. Can you help me?", 'Oi! Eu sou o Max. Hoje à noite é a Festa dos Monstros! Preciso de uma fantasia de monstro. Você me ajuda?'],
        3: ["Hi, I'm Max! Tonight is the big [[Monster Party|Festa dos Monstros]] at school, and every dog [[needs|precisa de]] a [[costume|fantasia]]. My monster needs [[eyes|olhos]], [[ears|orelhas]] and a big [[mouth|boca]]. Can you [[help|ajudar]] me [[find|achar]] the parts?", ''],
      },
      c2: {
        1: ['Great! Now look at my monster.', 'Ótimo! Agora olhe o meu monstro.'],
        2: ['Great job! I drew my monster. Which one is it?', 'Muito bem! Eu desenhei o meu monstro. Qual é ele?'],
        3: ['Great job! I [[drew|desenhei]] four monsters, but my friend Bella only [[likes|gosta de]] one. Read her [[message|mensagem]] and find it.', ''],
      },
      c3: {
        1: ['Oh no! My sign fell down!', 'Ah, não! Minha placa caiu!'],
        2: ['Oh no! The letters fell off my party sign. Help me!', 'Ah, não! As letras caíram da minha placa da festa. Me ajude!'],
        3: ['Oh no! The [[wind|vento]] [[blew|soprou]] the letters off my party [[sign|placa]], and some letters from another sign are [[mixed in|misturadas]]. [[Spell|Soletre]] the word again!', ''],
      },
      c4: {
        1: ['Last one! Say it like a monster!', 'Última! Fale como um monstro!'],
        2: ['Last one! The DJ needs my monster sentence. Build it!', 'Última! O DJ precisa da minha frase de monstro. Monte-a!'],
        3: ['Last one! The DJ will read my monster [[sentence|frase]] on [[stage|palco]]. Put the words in the [[right order|ordem certa]], please!', ''],
      },
      fim: {
        1: ['Thank you! See you at the party! 🎉', 'Obrigado! Até a festa! 🎉'],
        2: ['Thank you! My costume is ready. See you at the party! 🎉', 'Obrigado! Minha fantasia está pronta. Até a festa! 🎉'],
        3: ['Thank you so much! My costume is [[ready|pronta]] and Bella [[loves|adora]] it. See you at the Monster Party [[tonight|hoje à noite]]! 🎉', ''],
      },
    },
    ouvir: { 1: ['ear', 'hand', 'eye'], 2: ['mouth', 'ear', 'foot'], 3: ['tongue', 'teeth', 'leg'] },
    ler: {
      1: { en: 'It has two eyes.', pt: 'Ele tem dois olhos.', monstros: true,
        opcoes: [{ olhos: 2, grande: true, bracos: 2 }, { olhos: 1, grande: true, bracos: 2 }] },
      2: { en: 'It has three small eyes.', pt: 'Ele tem três olhos pequenos.', monstros: true,
        opcoes: [{ olhos: 3, grande: false, bracos: 2 }, { olhos: 3, grande: true, bracos: 2 }, { olhos: 2, grande: false, bracos: 2 }] },
      3: { en: 'My [[favourite|favorito]] monster has three [[big|grandes]] eyes and four [[arms|braços]].', pt: '', monstros: true,
        opcoes: [{ olhos: 3, grande: true, bracos: 4 }, { olhos: 3, grande: false, bracos: 4 }, { olhos: 3, grande: true, bracos: 2 }, { olhos: 2, grande: true, bracos: 4 }] },
    },
    soletrar: { 1: { en: 'hand', extras: '' }, 2: { en: 'mouth', extras: '' }, 3: { en: 'tongue', extras: 'ra' } },
    montar: {
      1: { blocos: ['I have', 'two', 'hands.'], pt: 'Eu tenho duas mãos.' },
      2: { blocos: ['The', 'monster', 'has', 'big', 'ears.'], pt: 'O monstro tem orelhas grandes.' },
      3: { blocos: ['My', 'monster', 'has', 'three', 'small', 'noses.'], pt: 'Meu monstro tem três narizes pequenos.' },
    },
  },
  {
    id: 'm4-2026-11-food', serie: '4º', mes: '2026-11', tema: 'Food and drinks', titulo: 'Max e o Piquenique', icone: '🧺',
    historia: {
      intro: {
        1: ["Hi! I'm Max. Let's have a picnic!", 'Oi! Eu sou o Max. Vamos fazer um piquenique!'],
        2: ["Hi! I'm Max. It's a sunny day. Let's make a picnic basket!", 'Oi! Eu sou o Max. É um dia de sol. Vamos montar uma cesta de piquenique!'],
        3: ["Hi, I'm Max! It's a [[sunny|ensolarado]] day and my friends are coming to the park. I need to [[pack|arrumar]] the [[picnic basket|cesta de piquenique]]. Can you help me?", ''],
      },
      c2: {
        1: ['Look! My friend likes this.', 'Olhe! Meu amigo gosta disto.'],
        2: ['My friend Bella sent a note. Read it!', 'Minha amiga Bella mandou um bilhete. Leia!'],
        3: ['Bella sent a message about her [[favorite|favorita]] food. Read it and [[pack|coloque]] the right food!', ''],
      },
      c3: {
        1: ['Oh no! The menu fell!', 'Ah, não! O cardápio caiu!'],
        2: ['Oh no! The menu got wet. Help me spell the word!', 'Ah, não! O cardápio molhou. Me ajude a soletrar a palavra!'],
        3: ['Oh no! It started to rain and the [[menu|cardápio]] got [[wet|molhado]]. Some letters [[washed away|sumiram]]. Spell the food again!', ''],
      },
      c4: {
        1: ['Last one! Tell me what you like!', 'Última! Me diga do que você gosta!'],
        2: ['Last one! Answer my question!', 'Última! Responda à minha pergunta!'],
        3: ["Last one! Bella [[asks|pergunta]]: Do you like milk? Build your [[answer|resposta]]!", ''],
      },
      fim: {
        1: ['Yummy! Thank you! 🎉', 'Delícia! Obrigado! 🎉'],
        2: ["Thank you! The basket is ready. Let's eat! 🎉", 'Obrigado! A cesta está pronta. Vamos comer! 🎉'],
        3: ["Thank you so much! The basket is [[full|cheia]] of [[yummy|gostosa]] food. Let's [[eat|comer]] in the park! 🎉", ''],
      },
    },
    ouvir: { 1: ['apple', 'banana', 'pizza'], 2: ['bread', 'cheese', 'juice'], 3: ['sandwich', 'grapes', 'carrot'] },
    ler: {
      1: { en: 'I like apples.', pt: 'Eu gosto de maçãs.', opcoes: ['🍎', '🍕'] },
      2: { en: "I like cake. I don't like fish.", pt: 'Eu gosto de bolo. Eu não gosto de peixe.', opcoes: ['🍰', '🐟', '🍕'] },
      3: { en: "I [[don't like|não gosto de]] pizza. I like [[sandwiches|sanduíches]] and [[orange juice|suco de laranja]].", pt: '', opcoes: ['🥪🍊🧃', '🍕🍊🧃', '🥪🥛', '🍕🍎'] },
    },
    soletrar: { 1: { en: 'egg', extras: '' }, 2: { en: 'bread', extras: '' }, 3: { en: 'cheese', extras: 'ky' } },
    montar: {
      1: { blocos: ['I', 'like', 'pizza.'], pt: 'Eu gosto de pizza.' },
      2: { blocos: ['I', "don't", 'like', 'fish.'], pt: 'Eu não gosto de peixe.' },
      3: { blocos: ['No,', 'I', "don't.", 'I', 'like', 'juice.'], pt: 'Não, eu não gosto. Eu gosto de suco.' },
    },
  },

  // ---------------- 5º ano ----------------
  {
    id: 'm5-2026-10-weather', serie: '5º', mes: '2026-10', tema: 'The weather', titulo: 'Max, o Repórter do Tempo', icone: '🌦️',
    historia: {
      intro: {
        1: ["Hi! I'm Max. I'm a weather reporter!", 'Oi! Eu sou o Max. Eu sou repórter do tempo!'],
        2: ["Hi! I'm Max. Today I'm the TV weather reporter. Help me with the news!", 'Oi! Eu sou o Max. Hoje sou o repórter do tempo da TV. Me ajude com o jornal!'],
        3: ["Hi, I'm Max! Today I'm the [[weather reporter|repórter do tempo]] on TV, but my [[notes|anotações]] are a [[mess|bagunça]]. Help me get the [[forecast|previsão]] ready!", ''],
      },
      c2: {
        1: ['Look at the map!', 'Olhe o mapa!'],
        2: ['Read the message from the studio.', 'Leia a mensagem do estúdio.'],
        3: ['The [[studio|estúdio]] sent the forecast for [[tomorrow|amanhã]]. Read it and choose the right [[weather icons|ícones do tempo]]!', ''],
      },
      c3: {
        1: ['Oh no! My sign fell!', 'Ah, não! Minha placa caiu!'],
        2: ['Oh no! The wind blew my sign. Spell the word!', 'Ah, não! O vento levou minha placa. Soletre a palavra!'],
        3: ['Oh no! A [[strong wind|vento forte]] blew the letters off my [[weather board|quadro do tempo]]. Spell the word again before we go [[live|ao vivo]]!', ''],
      },
      c4: {
        1: ['Last one! Say the weather!', 'Última! Diga como está o tempo!'],
        2: ['Last one! Build my TV sentence!', 'Última! Monte minha frase da TV!'],
        3: ['Last one! We are [[on air|no ar]] in ten seconds! Build the [[sentence|frase]] for the [[news|jornal]]!', ''],
      },
      fim: {
        1: ['Great job! Thank you! 🎉', 'Muito bem! Obrigado! 🎉'],
        2: ['Great job! The weather news was perfect! 🎉', 'Muito bem! O jornal do tempo foi perfeito! 🎉'],
        3: ['Great job! The forecast was [[perfect|perfeita]] and the [[viewers|telespectadores]] loved it. See you tomorrow on TV! 🎉', ''],
      },
    },
    ouvir: { 1: ['sunny', 'rainy', 'cold'], 2: ['cloudy', 'windy', 'hot'], 3: ['stormy', 'foggy', 'snowy'] },
    ler: {
      1: { en: "It's sunny.", pt: 'Está ensolarado.', opcoes: ['☀️', '🌧️'] },
      2: { en: "It's cold and rainy.", pt: 'Está frio e chuvoso.', opcoes: ['🥶🌧️', '🥵☀️', '🥶❄️'] },
      3: { en: "In the [[morning|manhã]] it's foggy, but in the [[afternoon|tarde]] it's sunny and hot.", pt: '', opcoes: ['🌫️☀️🥵', '☀️🌫️🥶', '🌧️☀️🥵', '🌫️⛈️🥵'] },
    },
    soletrar: { 1: { en: 'hot', extras: '' }, 2: { en: 'windy', extras: '' }, 3: { en: 'rainbow', extras: 'ue' } },
    montar: {
      1: { blocos: ["It's", 'sunny', 'today.'], pt: 'Está ensolarado hoje.' },
      2: { blocos: ["It's", 'cold', 'and', 'rainy.'], pt: 'Está frio e chuvoso.' },
      3: { blocos: ['Take', 'your', 'umbrella.', "It's", 'rainy', 'today.'], pt: 'Leve seu guarda-chuva. Está chuvoso hoje.' },
    },
  },
  {
    id: 'm5-2026-11-seasons', serie: '5º', mes: '2026-11', tema: 'Seasons and days', titulo: 'Max e a Agenda Maluca', icone: '📅',
    historia: {
      intro: {
        1: ["Hi! I'm Max. I have a busy week!", 'Oi! Eu sou o Max. Tenho uma semana cheia!'],
        2: ["Hi! I'm Max. My calendar is a mess. Can you help me?", 'Oi! Eu sou o Max. Minha agenda está uma bagunça. Você me ajuda?'],
        3: ["Hi, I'm Max! I have a [[busy|cheia]] week and my [[calendar|calendário]] is a mess. I also need to plan a trip for every [[season|estação]]. Can you help me?", ''],
      },
      c2: {
        1: ['Look at my plan!', 'Olhe meu plano!'],
        2: ['Read my plan for the weekend.', 'Leia meu plano para o fim de semana.'],
        3: ['My friend Bella wrote my [[plan|plano]] for the [[holidays|férias]]. Read it and find the right pictures!', ''],
      },
      c3: {
        1: ['Oh no! My calendar fell!', 'Ah, não! Meu calendário caiu!'],
        2: ['Oh no! The day names fell off my calendar!', 'Ah, não! Os nomes dos dias caíram do meu calendário!'],
        3: ['Oh no! My little brother [[played|brincou]] with my calendar and [[mixed up|misturou]] the letters. Spell the word again!', ''],
      },
      c4: {
        1: ['Last one! What day is today?', 'Última! Que dia é hoje?'],
        2: ['Last one! Build my sentence for the calendar!', 'Última! Monte minha frase para o calendário!'],
        3: ['Last one! Write the [[note|recado]] for my [[birthday party|festa de aniversário]]!', ''],
      },
      fim: {
        1: ['Thank you! My week is ready! 🎉', 'Obrigado! Minha semana está pronta! 🎉'],
        2: ['Thank you! My calendar is perfect now! 🎉', 'Obrigado! Minha agenda está perfeita agora! 🎉'],
        3: ["Thank you so much! My calendar is [[organized|organizado]] and I'm ready for every season. See you on [[Saturday|sábado]]! 🎉", ''],
      },
    },
    ouvir: { 1: ['spring', 'summer', 'winter'], 2: ['autumn', 'Monday', 'Friday'], 3: ['Tuesday', 'Thursday', 'Saturday'] },
    ler: {
      1: { en: "It's hot in summer.", pt: 'Faz calor no verão.', opcoes: ['🏖️', '⛄'] },
      2: { en: 'On Saturday I go to the beach.', pt: 'No sábado eu vou à praia.', opcoes: ['🏖️', '⛄', '🌸'] },
      3: { en: "In [[winter|inverno]] it's cold, so we [[build|construímos]] a [[snowman|boneco de neve]]. In spring we see [[flowers|flores]].", pt: '', opcoes: ['⛄🌸', '🏖️🌸', '⛄🍂', '🏖️🍂'] },
    },
    soletrar: { 1: { en: 'summer', extras: '' }, 2: { en: 'Sunday', extras: '' }, 3: { en: 'Wednesday', extras: 'ko' } },
    montar: {
      1: { blocos: ['Today', 'is', 'Monday.'], pt: 'Hoje é segunda-feira.' },
      2: { blocos: ["It's", 'cold', 'in', 'winter.'], pt: 'Faz frio no inverno.' },
      3: { blocos: ['My', 'party', 'is', 'on', 'Saturday', 'afternoon.'], pt: 'Minha festa é no sábado à tarde.' },
    },
  },
];
