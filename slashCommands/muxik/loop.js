const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggle looping of the currently playing track.'),
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

        if (!player || !player.queue.current) {
          return interaction.editReply("There is no track currently playing.");
        }

        const loopStatus = player.queue.current.loop;
        player.queue.current.loop = !loopStatus;

        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setDescription(` 
<a:aloading:1219269987617738772> Loop ${player.queue.current.loop ? 'Enabled' : 'Disabled'}! │
 The loop for the current track 
 has been ${player.queue.current.loop ? 'enabled' : 'disabled'}. `);

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply("An error occurred while processing your request. Please try again later.");
    }
  },
};
