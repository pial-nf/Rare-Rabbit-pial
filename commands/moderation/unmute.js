const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "untimeout",
    UserPerms: ['ModerateMembers'],
    aliases: ["unmute"],
    usage: "<ID|@member> [reason]",
    BotPerms: ['ModerateMembers'],
    voteOnly: true,
    run: async function (client, message, args) {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('Please mention a user to remove timeout.');
        }

        if (!target.communicationDisabledUntilTimestamp || target.communicationDisabledUntilTimestamp < Date.now()) {
            return message.reply(`${target.user.tag} is not currently timed out.`);
        }

        try {
            await target.timeout(null, reason);
            message.reply(`${target.user.tag}'s timeout has been removed. Reason: ${reason}`);
        } catch (error) {
            console.error('Untimeout command error:', error);
            message.reply('An error occurred while removing the timeout.');
        }
    },
};
