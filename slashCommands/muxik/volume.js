const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the volume of the music player.')
    .addIntegerOption(option =>
      option
        .setName('level')
        .setDescription('The volume level to set (0-100).')
        .setRequired(true)),
  async execute(client,interaction) {
const player = client.manager.players.get(interaction.guild.id);
		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        const value = interaction.options.getInteger("level");
        if (!value) return interaction.reply(`*Current volume:* ${player.volume}%`);

        await player.setVolume(Number(value));

        const embed = new EmbedBuilder()
    .setDescription(`<a:Speaker:1244868426611032084> Volume Adjusted! Volume set to: ${value}`);

        return interaction.reply({ embeds: [embed] });
  }
};
// 