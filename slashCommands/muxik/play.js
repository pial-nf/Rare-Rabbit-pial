const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Search for a song and add it to the queue, if you dare...')
    .addStringOption((option) =>
      option
        .setName('search')
        .setDescription('The song to search for, or your doom')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(client, interaction) {
    try {
      const { channel } = interaction.member.voice;
      if (!channel) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(`You're not in a voice channel, genius. Join one first.`);
        return interaction.reply({ embeds: [embed] });
      }
      if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(`I can't join your voice channel. Guess I'll just sit here.`);
        return interaction.reply({ embeds: [embed] });
      }
      if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(`  (ಠ⌣ಠ) You won't let me speak in your voice channel? Silent treatment?`);
        return interaction.reply({ embeds: [embed] });
      }

      await interaction.reply(`<a:google_search:1248897077656813690> **Searching for** \`${interaction.options.getString("search")}\`. *This could take a while...*`);

      const player = await client.manager.createPlayer({
        guildId: interaction.guild.id,
        textId: interaction.channel.id,
        voiceId: channel.id,
        volume: 100,
        deaf: true
      });
      const string = interaction.options.getString("search");

      const res = await player.search(string, { requester: interaction.user });
      if (!res.tracks.length) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(` <a:google_search:1248897077656813690> Nothing Your search skills suck.`);
        return interaction.editReply({ embeds: [embed] });
      }

      if (res.type === "PLAYLIST") {
        for (let track of res.tracks) player.queue.add(track);

        if (!player.playing && !player.paused) player.play();

        const queueLength = res.tracks.length;

        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setDescription(`<:nmusic:1222077221200465944> | Playlist:${res.playlistName.substring(0, 15)} Tracks: ${queueLength} (RIP) 
          Requested by <:narrow:1222088485331144836> ${res.tracks[0].requester} (Masochist)                      `);
        return interaction.editReply({ embeds: [embed] });
      } else {
        player.queue.add(res.tracks[0]);

        if (!player.playing && !player.paused) player.play();

        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setDescription(`
<:nmusic:1222077221200465944> | Track: ${res.tracks[0].title.substring(0, 15)}
 Requested by <:narrow:1222088485331144836> ${res.tracks[0].requester} (Bored?)`);
        return interaction.editReply({ embeds: [embed] });
      }
    } catch {
      // Handle any errors
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = await this.getAutocompleteSuggestions(focusedValue);
    await interaction.respond(choices);
  },
  async getAutocompleteSuggestions(query) {
    let choice = [];
    await ytsr(query || SEARCH_DEFAULT, { safeSearch: true, limit: 10 }).then(result => {
      result.items.forEach(x => { choice.push({ name: x.name, value: x.url }) });
    });
    return choice;
  }
};