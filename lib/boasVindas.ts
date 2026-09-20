const MENSAGENS: string[] = [
  "Fique à vontade, {nome}. Sente-se onde quiser — só veja se não há mais ninguém ali antes.",
  "{nome}, observe e leve o que quiser. Daqui nada me pertence — mas o pix é sempre bem-vindo.",
  "Bem-vindo, {nome}. Limpe os sapatos e não deixe rastro, a não ser que seja um comentário bonito.",
  "Ah, {nome} chegou. As paredes já sabiam, eu só estava esperando você confirmar.",
  "{nome}, entre. Aqui o tempo é decorativo e as portas são só sugestões.",
  "Cuidado onde pisa, {nome} — algumas estrofes ainda estão molhadas de tinta.",
  "{nome}. Eu ia fingir que não te esperava, mas a poesia nunca finge bem.",
  "Pode entrar, {nome}. Só não acorde os poemas que ainda estão dormindo.",
  "{nome}, isso aqui não é bem um site. É mais uma desculpa organizada pra sentir alguma coisa.",
  "Ninguém escolhe entrar aqui por acaso, {nome}. Ou escolhe, e isso já diz algo sobre você.",
  "{nome}, respira fundo. Os próximos poemas não avisam antes de doer.",
  "Entre, {nome}. Aqui dentro o silêncio também tem estrofe.",
  "{nome}? Nome bonito pra quem tá prestes a se encontrar com um monte de sentimento mal resolvido.",
  "Bem-vindo, {nome}. Deixa o casaco na entrada — aqui dentro não tem frio, só saudade.",
  "{nome}, essa realidade paralela não é tão paralela assim. Você vai reconhecer coisas demais.",
  "Ah, mais um curioso. Prazer, {nome} — os poemas já estavam de olho em você.",
  "{nome}, aqui as regras são simples: leia devagar, sinta rápido.",
  "Chegou na hora certa, {nome}. Ou talvez toda hora seja a hora certa por aqui.",
  "{nome}, se alguma estrofe parecer familiar demais, não é coincidência — é só a vida sendo repetitiva.",
  "Entra, {nome}. Prometo que pelo menos um poema vai fingir que não é sobre você.",
  "{nome}, aviso justo: sair daqui é mais fácil do que sair de dentro dos poemas.",
  "Boa, {nome} apareceu. Alguém tinha que ler essas coisas em voz baixa às 2h da manhã.",
  "{nome}, sente-se. Ou fique de pé. A poesia não liga muito pra postura.",
  "Ei, {nome}. Aqui ninguém pergunta como você está — os poemas simplesmente assumem que não muito bem.",
  "{nome}, essa porta só abre pra quem ainda acredita que palavras resolvem alguma coisa. Boa sorte.",
  "Chegou, {nome}. Espero que tenha trazido paciência — e talvez um lencinho.",
  "{nome}, aqui dentro tudo é meio confessional. Finge que não é constrangedor.",
  "Seja bem-vindo, {nome}. Os poemas estavam quietos até você chegar — agora vão começar a sussurrar.",
];

export function gerarSaudacao(nome: string): string {
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome.trim();
  const escolhida = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
  return escolhida.replaceAll("{nome}", primeiroNome);
}
