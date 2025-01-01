const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  voteOnly: false,
  run: async (client, message, args) => {
    const start = Date.now();
    const [setResult, getResult, deleteResult] = await Promise.all([
      client.db4.set("latency-test", "test-value"),
      client.db4.get("latency-test"),
      client.db4.delete("latency-test"),
    ]);
    const dbLatency = Date.now() - start;
    const messageLatency = (Date.now() - message.createdTimestamp);
    const apiLatency = client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setDescription('## <:StatusRole:1265734031102840964> Pong!')
      .addFields(
        { name: 'Basic:', value: `\`\`\`yaml\nPING      : ${messageLatency.toFixed(0)}ms\n\`\`\``, inline: false }
      )
      .setFooter({ text: 'I\'m up and running!' });

    return message.channel.send({ embeds: [embed] });
  },
};
