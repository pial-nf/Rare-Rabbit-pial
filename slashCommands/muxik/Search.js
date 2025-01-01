const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

function convertTime(duration, format = false) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours > 0 ? hours : 0;
  minutes = minutes > 0 ? minutes : 0;
  seconds = seconds > 0 ? seconds : 0;

  return format
    ? `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    : `${hours}:${minutes}:${seconds}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-song')
    .setDescription('Search for a song and add it to the queue, if you dare...')
    .addStringOption((option) =>
      option
        .setName('search')
        .setDescription('The song to search for, or your doom')
        .setRequired(true)
    ),
  async execute(client, interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getString("search");

        const { channel } = interaction.member.voice;

        if (!channel) return interaction.editReply("You are not in a voice channel!");

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect))
          return interaction.editReply("I don't have permission to join your voice channel!");

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak))
          return interaction.editReply("I don't have permission to speak in your voice channel!");

        const msg = await interaction.editReply(`Searching for \`${args}\`...`);

        const player = await client.manager.createPlayer({
          guildId: interaction.guild.id,
          textId: interaction.channel.id,
          voiceId: channel.id,
          volume: 100,
          deaf: true,
        });

        let res = await player.search(args, { requester: interaction.user });

        if (!res.tracks.length) return interaction.editReply("No results found!");

        const options = res.tracks.slice(0, 10).map((track, index) => ({
          label: track.title.substring(0, 100),
          value: track.identifier,
          description: `${convertTime(track.length, true)} | ${track.author}`,
        }));

        const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('search-results')
              .setPlaceholder('Select a track')
              .addOptions(options)
          );

        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setDescription(`<a:google_search:1248897077656813690> Select a track from the search results:`);

        const message = await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = (interaction) => interaction.customId === 'search-results';
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
          const selectedTrack = res.tracks.find(track => track.identifier === i.values[0]);
          player.queue.add(selectedTrack);

          if (!player.playing && !player.paused) player.play();

          const trackEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`<:nmusic:1222077221200465944> | Track: ${selectedTrack.title.substring(0, 15)}
 Requested by <:narrow:1222088485331144836> ${selectedTrack.requester} (Bored?)                     `);

          await i.update({ embeds: [trackEmbed], components: [] });
          collector.stop();
        });

        collector.on('end', collected => {
          if (collected.size === 0) {
            const embed = new EmbedBuilder()
              .setColor(0xFF0000)
              .setDescription(`<:nclock:1222291552886329466> Time's up! No track selected. `);
            interaction.editReply({ embeds: [embed], components: [] });
          }
        });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply("An error occurred while processing your request. Please try again later.");
    }
  },
};