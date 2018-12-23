require('http').createServer().listen(3000)
const Discord = require('discord.js');
const client = new Discord.Client({fetchAllMembers: true}); 
const config = require("./conf.json");

client.on('ready', () => {
  console.log(`Bot iniciado com sucesso!`);
  let status = [
      { name: 'Conexão BR', type: 'PLAYING' },
      { name: 'Participe do sorteio de uma key de GTA V? bit.ly/conexaobr', type: 'PLAYING' },
      { name: 'Developer: Vinícius Marotti', type: 'PLAYING' },
      { name: 'As Whitelists são lidas todos dias às 19:00', type: 'PLAYING' },
      { name: 'Deseja ajudar o servidor? Realize um donate', type: 'PLAYING' },
      { name: 'Acesse nosso fórum: http://bit.ly/forumconexao', type: 'PLAYING' },
  ];
  //https://www.twitch.tv/xzirty
  //STREAMING = Transmitindo
  //LISTENING = Ouvindo
  //PLAYING = Jogando
  //WATCHING = Assistindo
  ///Ser pobre é um bug criado por Deus - DBR 2018

  function setStatus() {
      let randomStatus = status[Math.floor(Math.random() * status.length)];
      client.user.setPresence({ game: randomStatus });
  }

  setStatus();
  setInterval(() => setStatus(), 10000);  //10000 = 10Ms = 10 segundos
});

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  if(comando === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
  }
  if(comando === "ban") {
    //adicione o nome do cargo que vc quer que use esse comando!
    if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
      return message.reply("Desculpe, você não tem permissão para usar isto!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.bannable) 
      return message.reply("Eu não posso banir este usuário! Ele possui um cargo maior que o meu.");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    await member.ban(reason)
      .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
    message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
  }
  if(comando === "apagar") {
    const deleteCount = parseInt(args[0], 10);
    if(!message.member.roles.some(r=>["👑 MODERADOR", "Admin"].includes(r.name)) )
          return message.reply("Desculpe, você não tem permissão para usar isto!");
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem excluídas");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Não foi possível deletar mensagens devido a: ${error}`));
  }
  
  if(comando === "kick") {
    //adicione o nome dos cargos que vc quer que use esse comando!
        if(!message.member.roles.some(r=>["👑 MODERADOR", "Admin"].includes(r.name)) )
          return message.reply("Desculpe, você não tem permissão para usar isto!");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
          return message.reply("Por favor mencione um membro válido deste servidor");
        if(!member.kickable) 
          return message.reply("Eu não posso expulsar este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de expulsar?");
        
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "Nenhuma razão fornecida";
        
        await member.kick(reason)
          .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
        message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);
    
      }

      if(comando === "invite") {
        const m = await message.channel.send("discord.gg/XHkhgzn");
      }
      
});

client.on('guildMemberAdd', member => {
    let role = member.guild.roles.find(role => role.name == 'DEV');
    member.addRole(role);
  
});

client.on("guildMemberAdd", member => {
    member.send('Bem vindo ao **Conexão BR** RolePlay! Sabia que estamos sorteando uma key de GTA V? Participe também: https://www.bit.ly/conexaobr');

});

client.login(process.env.TOKEN);