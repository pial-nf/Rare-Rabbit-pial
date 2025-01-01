const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a song from the queue based on its position.')
    .addIntegerOption(option =>
      option
        .setName('position')
        .setDescription('The position of the song in the queue to remove')
        .setRequired(true)),
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

        const player = client.manager.get(interaction.guild.id);

        if (!player || !player.queue.current) {
          return interaction.editReply("There is no track currently playing.");
        }

        const position = interaction.options.getInteger('position');

        if (position < 1 || position > player.queue.tracks.length) {
          return interaction.editReply(`Invalid position! Please provide a number between 1 and ${player.queue.tracks.length}.`);
        }

        const removedTrack = player.queue.remove(position - 1);

        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(`<:remove:1244870641744875541> | Track Removed! **${removedTrack.title}** has been removed from the queue.`);

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply("An error occurred while processing your request. Please try again later.");
    }
  },
};
