const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { ownerIDS } = require('../../dev.json');

module.exports = {
  name: "say",
  aliases: ["echo"],
  VoteOnly: false,
  BotPerms: ['SendMessages', 'EmbedLinks'],
  run: async (client, message, args) => {
    // Check if the user is a bot owner
    if (!ownerIDS.includes(message.author.id)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('This command is restricted to bot owners.');
      return await message.channel.send({ embeds: [errorEmbed] });
    }

    // Check if there's a message to say
    if (args.length === 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('Please provide a message for the bot to say.');
      return await message.channel.send({ embeds: [errorEmbed] });
    }

    // Join the arguments into a single message
    const sayMessage = args.join(' ');

    try {
      // Delete the original command message if possible
      if (message.guild && message.channel.permissionsFor(client.user).has(PermissionFlagsBits.ManageMessages)) {
        await message.delete();
      }

      // Send the message
      await message.channel.send(sayMessage);
    } catch (error) {
      console.error('Error in say command:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('An error occurred while executing the command.');
      await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
