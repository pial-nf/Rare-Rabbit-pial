const fs = require('fs');
const path = require('path');
const stickyFilePath = path.join(__dirname, 'stickies.json');

const loadStickies = () => {
    if (!fs.existsSync(stickyFilePath)) {
        fs.writeFileSync(stickyFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(stickyFilePath, 'utf8'));
};

const saveStickies = (data) => {
    fs.writeFileSync(stickyFilePath, JSON.stringify(data, null, 2));
};

module.exports = {
    name: "stickyremove",
    aliases: ['deletesticky', 'delsticky', 'removesticky', 'remsticky'],
    description: "Delete a sticky message.",
    run: async (client, message, args) => {
        if (message.channel.type === 'dm') {
            return message.channel.send('Please only run commands in a Discord server.').then(msg => {
                msg.delete({ timeout: 12000 });
            }).catch(e => {});
        }

        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send("You don't have permission to use this command.").catch(e => {});
        }

        const stickies = loadStickies();
        if (stickies[message.channel.id]) {
            delete stickies[message.channel.id];
            saveStickies(stickies);
            message.channel.send('**Sticky Message Deleted!**').catch(e => {});
        } else {
            message.channel.send('**There is no sticky message in this channel.**').catch(e => {});
        }
    }
};
