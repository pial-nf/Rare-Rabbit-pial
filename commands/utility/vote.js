const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createVoteButton(client) {
  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Vote Me")
      .setStyle("Link")
      .setURL(`https://discordbotlist.com/bots/rabbit-8205/upvote`)
  );

  return button;
}

module.exports = {
  name: "vote",
  voteOnly: false,
  run: async (client, message, args) => {
    const button = createVoteButton(client);

    message.channel.send({ content: `Click the button below.`, components: [button] });
  },
};
