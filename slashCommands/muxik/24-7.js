const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('24-7')
    .setDescription('Make the bot stay in the voice channel 24/7'),
  async execute(client, interaction) {
    const { channel } = interaction.member.voice;
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setDescription(`You're not in a voice channel, genius. Join one first.`);
      return interaction.reply({ embeds: [embed] });
    }

    // Save the voice channel information in QuickDB
    await client.db24_7.set(`24-7_${interaction.guild.id}`, channel.id);

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setDescription(`I'll stay in the voice channel \`${channel.name}\` 24/7.`);
    return interaction.reply({ embeds: [embed] });
  },
};
