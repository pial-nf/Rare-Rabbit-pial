const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createCodeButton() {
  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Invite")
      .setStyle("Link")
      .setURL(
        `https://discordapp.com/oauth2/authorize?client_id=1242460333025787926&scope=bot%20applications.commands&permissions=268561646`
      )
  );

  return button;
}

module.exports = {
  name: "invite",
  aliases: ["inv"],
  voteOnly: false,
  BotPerms: ["EmbedLinks"],
  run: async (client, message, args) => {
    const button = createCodeButton();
    message.channel.send({
      content: `Click the button below.`,
      components: [button],
    });
  },
};
