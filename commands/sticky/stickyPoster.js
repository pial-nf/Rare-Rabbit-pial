const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const stickyFilePath = path.join(__dirname, '../../stickies.json');

const loadStickies = () => {
    if (!fs.existsSync(stickyFilePath)) {
        fs.writeFileSync(stickyFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(stickyFilePath, 'utf8'));
};

const postStickies = async (client) => {
    const stickies = loadStickies();
    for (const [channelId, sticky] of Object.entries(stickies)) {
        try {
            const channel = await client.channels.fetch(sticky.channel);
            if (!channel) continue;

            if (sticky.embed === 'true') {
                const embed = new EmbedBuilder()
                    .setColor(sticky.color)
                    .setDescription(sticky.message);
                await channel.send({ embeds: [embed] });
            } else {
                await channel.send(sticky.message);
            }
        } catch (error) {
            console.error(`Failed to post sticky message in channel ${channelId}:`, error);
        }
    }
};

module.exports = {
    name: 'stickyPoster',
    execute: async (client) => {
        // Run the stickyPoster every minute
        setInterval(() => postStickies(client), 60000);
    }
};
