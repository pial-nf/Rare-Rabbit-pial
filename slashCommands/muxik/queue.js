const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function formatQueue(tracks) {
  return tracks.map((track, index) => `${index + 1}. ${track.title} (${convertTime(track.length, true)})`).join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the current song queue.'),
  async execute(client, interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ ephemeral: false });

        const { channel } = interaction.member.voice;

        if (!channel) return interaction.editReply("You are not in a voice channel!");

        const player = client.manager.get(interaction.guild.id);

        if (!player || !player.queue.current) {
          return interaction.editReply("There are no tracks currently in the queue.");
        }

        const queue = player.queue;
        const currentTrack = queue.current;
        const upcomingTracks = queue.tracks;

        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setTitle("Current Song Queue")
          .setDescription(`
<:nmusic:1222077221200465944> | Now Playing: ${currentTrack.title} (${convertTime(currentTrack.length, true)})
${upcomingTracks.length > 0 ? `\n**Up Next:**\n${formatQueue(upcomingTracks)}` : "\nNo more songs in the queue."}
`);

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply("An error occurred while processing your request. Please try again later.");
    }
  },
};
