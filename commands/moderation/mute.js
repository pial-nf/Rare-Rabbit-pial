const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "timeout",
    UserPerms: ['ModerateMembers'],
    aliases: ["mute"],
    usage: "<ID|@member> <duration><s|m|h|d> [reason]",
    BotPerms: ['ModerateMembers'],
    voteOnly: true,
    run: async function (client, message, args) {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const durationArg = args[1];
        const reason = args.slice(2).join(' ') || 'No reason provided';

        if (!target) {
            return message.reply('Please mention a user to timeout.');
        }

        if (!durationArg) {
            return message.reply('Please specify a duration.');
        }

        const duration = parseDuration(durationArg);
        if (duration <= 0) {
            return message.reply('Please specify a valid duration.');
        }

        if (target.id === message.author.id) {
            return message.reply('You cannot timeout yourself.');
        }

        if (target.communicationDisabledUntilTimestamp && target.communicationDisabledUntilTimestamp > Date.now()) {
            return message.reply(`${target.user.tag} is already timed out.`);
        }

        const botMember = message.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has('ModerateMembers')) {
            return message.reply('I do not have the `ModerateMembers` permission.');
        }

        if (message.member.roles.highest.position <= target.roles.highest.position) {
            return message.reply('You cannot timeout a member with a role equal to or higher than yours.');
        }

        try {
            await target.timeout(duration, reason);
            message.reply(`${target.user.tag} has been timed out for ${durationArg}. Reason: ${reason}`);
        } catch (error) {
            console.error('Timeout command error:', error);
            if (error.code === 50013) {
                message.reply('I do not have permission to timeout this user. Please ensure my role is higher than the user’s role and I have the appropriate permissions.');
            } else {
                message.reply('An error occurred while timing out the user.');
            }
        }
    },
};

function parseDuration(duration) {
    const regex = /^(\d+)(s|m|h|d)$/;
    const match = duration.match(regex);

    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return 0;
    }
}
