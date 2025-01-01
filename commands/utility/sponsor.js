const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

function createCodeButton(client) {
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Website")
            .setStyle("Link")
            .setURL(client.sponsor),
        new ButtonBuilder()
            .setLabel("Discord Server")
            .setStyle("Link")
            .setURL('https://discord.gg/gdW2fudg7Y')
    );

    return button;
}

module.exports = {
    name: "sponsor",
    voteOnly: false,
    run: async (client, message, args) => {
        const button = createCodeButton(client);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: client.user.username + ' - Sponsor Information', iconURL: client.user.displayAvatarURL() })
            .setTitle('__Team Kronix__')
            .setDescription(`An Optimistic Community of Developers, Based around iShowKronix on youtube!, Endeavouring to Learn as we grow.
          

**__Check Out Them__**
[Webiste](https://teamkronix.me) | [Discord](https://discord.gg/teamkronix)`)
            .setImage('https://media.discordapp.net/attachments/1219250729860993084/1232368936767459408/backgrd.png?ex=66293482&is=6627e302&hm=2af6aae9432f80eea1ac48babc86e45e5b1333724c851eff106f584cccec7bf5&=&format=webp&quality=lossless&width=618&height=347')

        message.channel.send({ embeds: [embed], components: [button] });
    },
};
