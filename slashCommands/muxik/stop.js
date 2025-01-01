const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and clear the queue.'),
  async execute(client, interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ ephemeral: false });

        const { channel } = interaction.member.voice;

        if (!channel) return interaction.editReply("You are not in a voice channel!");

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect))
          return interaction.editReply("I don't have permission to join your voice channel!");

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak))
          return interaction.editReply("I don't have permission to speak in your voice channel!");

        const player = client.manager.players.get(interaction.guild.id);

        if (!player) {
          return interaction.editReply("There is no music currently playing.");
        }

        player.destroy();

        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(` <:eg_stop:1243485825476591677> | Music Stopped! The music has been stopped and the queue has been cleared. `);

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply("An error occurred while processing your request. Please try again later.");
    }
  },
};
