const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const moment = require('moment');
moment.locale('ENG');

const verificationLevels = {
    NONE: "None",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    VERY_HIGH: "Very High"
};

const disabled = '<:disabled:1196663413556903967>';
const enabled = '<:enabled:1196663364424835202>';

module.exports = {
    name: "serverinfo",
    aliases: ["si"],
    category: "utility",
    run: async (client, message, args) => {
        const server = message.guild;
        const owner = await server.fetchOwner();
        const memberCount = server.memberCount;
        const userCount = server.members.cache.filter(member => !member.user.bot).size;
        const botCount = server.members.cache.filter(member => member.user.bot).size;
        const emojiCount = server.emojis.cache.size;
        const roles = server.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);

        let rolesDisplay = roles.length < 25 ? roles.join(' ') : 'Too many roles to show.';
        if (rolesDisplay.length > 1024) rolesDisplay = `${roles.slice(4).join(" ")} more.`;

        let baseVerification = verificationLevels[server.verificationLevel] || 'Unknown';

        const createEmbed = (fields) => {
            return new EmbedBuilder()
                .setColor('#00FF00') 
                .setAuthor({ name: `${server.name}'s Information`, iconURL: server.iconURL({ dynamic: true }) })
                .setThumbnail(server.iconURL({ dynamic: true }))
                .setImage(server.bannerURL({ size: 4096, dynamic: true, format: "gif" }))
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .addFields(fields);
        };

        const embedGeneral = createEmbed([
            { name: '__About__', value: `**Name:** ${server}\n**ID:** ${server.id}\n**Owner <:icons_eventcolour_416:1061555545045204992>:** ${owner.user.tag} (${owner.user})\n**Members:** ${memberCount}\n**Created At:** <t:${moment(server.createdAt).format('X')}:R>` }
        ]);

        const embedSystem = createEmbed([
            { name: '__Server Information__', value: `**Verification Level:** ${baseVerification}\n**Inactive Channel:** ${server.afkChannelId ? `<#${server.afkChannelId}>` : `${disabled}`}\n**Inactive Timeout:** ${server.afkTimeout / 60} mins\n**System Messages Channel:** ${server.systemChannelId ? `<#${server.systemChannelId}>` : disabled}\n**Boost Bar Enabled:** ${server.premiumProgressBarEnabled ? enabled : disabled}` },
            { name: '__Emojis__', value: `Total Emojis: ${emojiCount}` },
            { name: '__Boost Status__', value: `Count <:qsfgqsegf:1061555586036142160>: ${server.premiumSubscriptionCount}` }
        ]);

        const embedModules = createEmbed([
            { name: '__Server Roles__', value: `[${roles.length}] ${rolesDisplay}` }
        ]);

        const buttons = [
            new ButtonBuilder().setCustomId('general').setLabel('General').setStyle(ButtonStyle.Success).setDisabled(true),
            new ButtonBuilder().setCustomId('system').setLabel('System').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('modules').setLabel('Modules').setStyle(ButtonStyle.Secondary)
        ];

        const row = new ActionRowBuilder().addComponents(buttons);

        const messageComponent = await message.reply({ embeds: [embedGeneral], components: [row] });

        const collector = messageComponent.createMessageComponentCollector({ time: 600000 });

        collector.on('collect', async (interaction) => {
            if (interaction.isButton()) {
                buttons.forEach(button => button.setDisabled(false).setStyle(ButtonStyle.Secondary));
                switch (interaction.customId) {
                    case 'general':
                        buttons[0].setDisabled(true).setStyle(ButtonStyle.Success);
                        await interaction.update({ embeds: [embedGeneral], components: [new ActionRowBuilder().addComponents(buttons)] });
                        break;
                    case 'system':
                        buttons[1].setDisabled(true).setStyle(ButtonStyle.Success);
                        await interaction.update({ embeds: [embedSystem], components: [new ActionRowBuilder().addComponents(buttons)] });
                        break;
                    case 'modules':
                        buttons[2].setDisabled(true).setStyle(ButtonStyle.Success);
                        await interaction.update({ embeds: [embedModules], components: [new ActionRowBuilder().addComponents(buttons)] });
                        break;
                }
            }
        });

        collector.on('end', () => {
            buttons.forEach(button => button.setDisabled(true).setStyle(ButtonStyle.Secondary));
            messageComponent.edit({ components: [new ActionRowBuilder().addComponents(buttons)] });
        });
    }
};
