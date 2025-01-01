const { EmbedBuilder } = require('discord.js');
const { ownerIDS } = require('../../dev.json');

module.exports = {
  name: "dm",
  aliases: ["directmessage"],
  VoteOnly: false,
  BotPerms: ['SendMessages', 'EmbedLinks'],
  run: async (client, message, args) => {
    
    if (!ownerIDS.includes(message.author.id)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('This command is restricted to bot owners.');
      return await message.channel.send({ embeds: [errorEmbed] });
    }

    
    if (args.length < 2) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('Please provide a user ID and a message. Usage: dm <userID> <message>');
      return await message.channel.send({ embeds: [errorEmbed] });
    }

    const userID = args[0];
    const dmMessage = args.slice(1).join(' ');

    try {
      
      const user = await client.users.fetch(userID);

      if (!user) {
        const errorEmbed = new EmbedBuilder()
          .setColor('Red')
          .setDescription('User not found. Please provide a valid user ID.');
        return await message.channel.send({ embeds: [errorEmbed] });
      }

      
      await user.send(dmMessage);

  
      const successEmbed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`Message sent successfully to ${user.tag}`);
      await message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.error('Error in dm command:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('An error occurred while sending the DM. The user might have DMs disabled or the bot might be blocked.');
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
