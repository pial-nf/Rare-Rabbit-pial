const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearqueue')
    .setDescription('Clear the entire song queue.'),
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

        player.queue.clear();

        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(`<:eg_stop:1243485825476591677> |  Queue Cleared! The entire song queue has been cleared.`);

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply("An error occurred while processing your request. Please try again later.");
    }
  },
};
