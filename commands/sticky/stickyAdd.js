const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const stickyFilePath = path.join(__dirname, 'stickies.json');

const loadStickies = () => {
    try {
        if (!fs.existsSync(stickyFilePath)) {
            fs.writeFileSync(stickyFilePath, JSON.stringify({}), 'utf8');
        }
        const data = fs.readFileSync(stickyFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading stickies:', err);
        return {};
    }
};

const saveStickies = (data) => {
    try {
        fs.writeFileSync(stickyFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving stickies:', err);
    }
};

module.exports = {
    name: "stickyadd",
    aliases: ['addsticky', 'newsticky', 'stickynew', 'stickycreate', 'createsticky'],
    description: "Add a sticky message.",
    run: async (client, message, args) => {
        if (message.channel.type === 'dm') {
            return message.channel.send('Please only run commands in a Discord server.').then(msg => {
                msg.delete({ timeout: 12000 });
            }).catch(e => {});
        }

        const stickies = loadStickies();
        if (stickies[message.channel.id]) {
            return message.channel.send('There is already a sticky message in this channel.').then(msg => {
                msg.delete({ timeout: 12000 });
                message.delete();
            }).catch(e => {});
        }

        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send("You don't have permission to use this command.").catch(e => {});
        }

        const filter = m => m.author.id === message.author.id;

        const build1 = new EmbedBuilder()
            .setColor('#000000')
            .setDescription('**Welcome to the Sticky Message Builder!**\n**Type `cancel` at any time to cancel the command.**');

        const build2 = new EmbedBuilder()
            .setColor('#000000')
            .setDescription('**Please provide a channel for the sticky message to be placed in.**');

        const build3 = new EmbedBuilder()
            .setColor('#000000')
            .setDescription('**Please provide a color HEX for the embed (e.g., `#FF5733`).**');

        const build4 = new EmbedBuilder()
            .setColor('#000000')
            .setDescription('**Please enter the message you would like the sticky message to say.**');

        const build5 = new EmbedBuilder()
            .setColor('#000000')
            .setDescription('**Sticky Message Created!**');

        message.channel.send({ embeds: [build1] }).catch(e => {});

        message.channel.send({ embeds: [build2] }).then(() => {
            message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    let newcol = collected.first().content.toLowerCase();
                    if (newcol === 'cancel') return message.channel.send('**Sticky Message Builder Canceled.**').catch(e => {});

                    let deChan;
                    if (collected.first().mentions.channels.first()) {
                        deChan = collected.first().mentions.channels.first().id;
                    } else if (!isNaN(collected.first().content)) {
                        deChan = collected.first().content;
                    } else {
                        return message.channel.send('**Invalid channel provided. Command canceled.**').catch(e => {});
                    }

                    if (!message.guild.channels.cache.has(deChan)) {
                        return message.channel.send('**The provided channel ID does not exist in this server. Command canceled.**').catch(e => {});
                    }

                    message.channel.send({ embeds: [build3] }).then(() => {
                        message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                let newcol = collected.first().content.toLowerCase();
                                if (newcol === 'cancel') return message.channel.send('**Sticky Message Builder Canceled.**').catch(e => {});
                                let content4 = collected.first().content;

                               
                                if (!/^#[0-9A-F]{6}$/i.test(content4)) {
                                    return message.channel.send('**Invalid HEX color format. Command canceled.**').catch(e => {});
                                }
                                const hexColor = content4;

                                message.channel.send({ embeds: [build4] }).then(() => {
                                    message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                                        .then(collected => {
                                            let newcol = collected.first().content.toLowerCase();
                                            if (newcol === 'cancel') return message.channel.send('**Sticky Message Builder Canceled.**').catch(e => {});
                                            let content5 = collected.first().content;

                                            stickies[message.channel.id] = {
                                                guild: message.guild.id,
                                                channel: deChan,
                                                message: content5,
                                                embed: 'true',
                                                color: hexColor
                                            };

                                            saveStickies(stickies);
                                            message.channel.send({ embeds: [build5] }).catch(e => {});
                                        }).catch(() => {
                                            message.channel.send('**No response received. Command canceled.**').catch(e => {});
                                        });
                                }).catch(e => {});
                            }).catch(() => {
                                message.channel.send('**No response received. Command canceled.**').catch(e => {});
                            });
                    }).catch(e => {});
                }).catch(() => {
                    message.channel.send('**No response received. Command canceled.**').catch(e => {});
                });
        }).catch(e => {});
    }
};
