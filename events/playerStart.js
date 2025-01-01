const client = require("../index.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
const { muzicard } = require("muzicard");

client.manager.on("playerStart", async (player, track) => {
    const { embed, attachment } = await createEmbed(client, player, track);

    const filterOptions = [
        { label: 'Clear', value: 'clear' },
        { label: '8D', value: 'eightD' },
        { label: 'Soft', value: 'soft' },
        { label: 'Speed', value: 'speed' },
        { label: 'Karaoke', value: 'karaoke' },
        { label: 'Nightcore', value: 'nightcore' },
        { label: 'Pop', value: 'pop' },
        { label: 'Vaporwave', value: 'vaporwave' },
        { label: 'Bass', value: 'bass' },
        { label: 'Party', value: 'party' },
        { label: 'Earrape', value: 'earrape' },
        { label: 'Equalizer', value: 'equalizer' },
        { label: 'Electronic', value: 'electronic' },
        { label: 'Radio', value: 'radio' },
        { label: 'Tremolo', value: 'tremolo' },
        { label: 'Treble Bass', value: 'treblebass' },
        { label: 'Vibrato', value: 'vibrato' },
        { label: 'China', value: 'china' },
        { label: 'Chipmunk', value: 'chipmunk' },
        { label: 'Darth Vader', value: 'darthvader' },
        { label: 'Daycore', value: 'daycore' },
        { label: 'Doubletime', value: 'doubletime' },
        { label: 'Pitch', value: 'pitch' },
        { label: 'Rate', value: 'rate' },
        { label: 'Slow', value: 'slow' }
    ];

    const filterMenu = new StringSelectMenuBuilder()
        .setCustomId('filters')
        .setPlaceholder('Select a filter')
        .addOptions(filterOptions);

    const filterRow = new ActionRowBuilder().addComponents(filterMenu);

    const controlButtons = {
        stop: new ButtonBuilder()
            .setCustomId('stop')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('⏹️'),
        rewind: new ButtonBuilder()
            .setCustomId('rewind')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏪'),
        pause: new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Success)
            .setEmoji('⏯️'),
        play: new ButtonBuilder()
            .setCustomId('play')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏩'),
        loop: new ButtonBuilder()
            .setCustomId('loop')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔁')
    };

    const buttonRow = new ActionRowBuilder().addComponents(
        controlButtons.stop,
        controlButtons.rewind,
        controlButtons.pause,
        controlButtons.play,
        controlButtons.loop
    );

    const message = await client.channels.cache.get(player.textId)?.send({ embeds: [embed], components: [filterRow, buttonRow], files: [attachment] });

    const collector = message.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === track.requester.id,
        time: player.queue.current.length // Time in milliseconds, set this to a long enough duration if needed
    });

    collector.on('collect', async (interaction) => {
        await handleButtonInteraction(client, player, track, interaction, message, controlButtons, buttonRow, filterRow);
    });

    collector.on('end', (collected, reason) => {
        if (reason === 'time') {
            message.edit({ components: [] });
        }
    });

    player.on('end', async () => {
        await message.delete().catch(console.error);
    });

    return message;
});

async function createEmbed(client, player, track) {
    const totalDurationFormatted = convertTime(track.length);

    const card = new muzicard()
        .setName(track.title)
        .setAuthor(track.author)
        .setColor("auto")
        .setTheme("blueskyx")
        .setBrightness(69)
        .setThumbnail(track.thumbnail)
        .setProgress(15)
        .setStartTime("0:00")
        .setEndTime(totalDurationFormatted);

    const buffer = await card.build();
    const attachment = new AttachmentBuilder(buffer, { name: `muzicard.png` });

    const embed = new EmbedBuilder()
        .setTitle(`**Rabbit is currently playing:**`)
        .setDescription(`> [${track.title}](https://discord.gg/teamkronix)`)
        .setColor(client.color)
        .setImage("attachment://muzicard.png");

    return { embed, attachment };
}

async function handleButtonInteraction(client, player, track, interaction, message, controlButtons, buttonRow, filterRow) {
    if (!player) return await interaction.reply(`> "No playing in this guild!"`);

    const { channel } = interaction.member.voice;

    if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
        return await interaction.reply(`> "I'm not in the same voice channel as you!"`);
    }

    switch (interaction.customId) {
        case 'pause':
            await player.pause(player.playing);
            const pausedStatus = player.paused ? `Paused` : `Resumed`;
            controlButtons.pause.setEmoji(player.paused ? '▶️' : '⏸️');
            controlButtons.pause.setCustomId(player.paused ? 'resume' : 'pause');
            await message.edit({ components: [buttonRow, filterRow] });
            await interaction.reply({ content: `*> "${pausedStatus.toLowerCase()}!"*`, ephemeral: true });
            break;
        case 'rewind':
            await player.seek(0);
            await interaction.reply({ content: `*> "Rewinded the track!"*`, ephemeral: true });
            break;
        case 'play':
            await player.play();
            await interaction.reply({ content: `*> "Skipped to the next track!"*`, ephemeral: true });
            break;
        case 'stop':
            await player.destroy();
            console.log(`Player destroyed for guild ${interaction.guild.id}`);
            await interaction.reply({ content: `*> "Stopped the music!"*`, ephemeral: true });
            break;
        case 'loop':
            player.setTrackRepeat(!player.trackRepeat);
            const loopStatus = player.trackRepeat ? 'enabled' : 'disabled';
            await interaction.reply({ content: `*> "Loop ${loopStatus}!"*`, ephemeral: true });
            break;
        case 'filters':
            const selectedFilter = interaction.values[0];
            if (selectedFilter === 'clear') {
                await player.shoukaku.node.rest.updatePlayer({ guildId: interaction.guild.id, playerOptions: { filters:{} } });
                await interaction.reply({ content: `*> "Filters cleared!"*`, ephemeral: true });
            } else {
                await player.filter(selectedFilter);
                await interaction.reply({ content: `*> "${selectedFilter}" filter applied!*`, ephemeral: true });
            }
            break;
    }
}

function convertTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (duration < 3600000) {
        return minutes + ":" + seconds;
    } else {
        return hours + ":" + minutes + ":" + seconds;
    }
}
