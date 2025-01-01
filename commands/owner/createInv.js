const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { ownerIDS } = require('../../dev.json');

module.exports = {
  name: "createinvite",
  aliases: ["ci", "gi", "ginvite", "guildinvite"],
  VoteOnly: true,
  BotPerms: ['SendMessages', 'CreateInstantInvite', 'ReadMessageHistory', 'EmbedLinks', 'ViewChannel'],
  run: async (client, message, args) => {

    if (!ownerIDS.includes(message.author.id)) return;

    const guild = client.guilds.cache.get(args[0]);

    if (!guild) {
      const errorEmbed = new EmbedBuilder()
         
        .setDescription('Guild not found');
      return await message.channel.send({ embeds: [errorEmbed] });
    }

    const textChannel = guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText &&
        c
          .permissionsFor(guild.members.me)
          ?.has(
            PermissionFlagsBits.CreateInstantInvite |
            PermissionFlagsBits.SendMessages |
            PermissionFlagsBits.ViewChannel
          )
    );

    if (!textChannel) {
      const noChannelEmbed = new EmbedBuilder()
         
        .setDescription('No suitable channel found');
      return await message.channel.send({ embeds: [noChannelEmbed] });
    }

    try {
      const invite = await textChannel.createInvite({
        maxAge: 3600,
        maxUses: 0,
        reason: `bot usage`,
      });

      const successEmbed = new EmbedBuilder()
        .setDescription(`Invite link for ${guild.name}: [Link](${invite.url})`);

      return await message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
         
        .setDescription('An error occurred while creating the invite.');
      console.error('Error creating invite:', error);
      return await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
