const { EmbedBuilder } = require("discord.js");


module.exports = {
  name: "steal",
  UserPerms: ['MANAGE_EMOJIS'],
  BotPerms: ['EMBED_LINKS', 'MANAGE_EMOJIS'],
  VoteOnly: false,
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply({ content: `Please provide the emojis to steal!` });
    }

    try {
      let steal = args.join("") || message.stickers.first();
      let stealname = args[1] || steal.name;

      if (args[0]) {
        let animemojis = steal.match(/[a][:]([A-Za-z0-9_~])+[:]\d{1,}/g);
        let normemojis = steal.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{1,}/g);

        if (animemojis) {
          if (animemojis.length > 1) {
            return message.reply({ content: `You can only add 1 emojis at a time!` });
          }

          for (let aemoji in animemojis) {
            const list = animemojis[aemoji].split(":");
            const Url = `https://cdn.discordapp.com/emojis/${list[2]}.gif`;
            await message.guild.emojis.create({ attachment: Url, name: list[1] });

            let embed1 = new EmbedBuilder()
              .setColor("#ffffff")
              .setTitle('Added Emoji')
              .setImage(Url);
            message.reply({ embeds: [embed1] });
          }
        }

        if (normemojis) {
          if (normemojis.length > 1) {
            return message.reply({ content: `You can only add 1 emojis at a time!` });
          }

          for (let emojis in normemojis) {
            const list = normemojis[emojis].split(":");
            const Url = `https://cdn.discordapp.com/emojis/${list[2]}.png`;
            await message.guild.emojis.create({ attachment: Url, name: list[1] });

            let embed2 = new EmbedBuilder()
              .setColor("#ffffff")
              .setTitle('Added Emoji')
              .setImage(Url);
            message.reply({ embeds: [embed2] });
          }
        }
      } else if (message.stickers.first()) {
        const Url = `https://media.discordapp.net/stickers/${steal.id}.${steal.animated ? "gif" : "png"}?size=320`;
        await message.guild.stickers.create({ file: { attachment: Url }, name: stealname });

        let embed = new EmbedBuilder()
          .setColor("#ffffff")
          .setTitle('Added Sticker')
          .setImage(`https://media.discordapp.net/stickers/${steal.id}.${steal.animated ? "gif" : "png"}?size=320`);
        message.reply({ embeds: [embed] });
      }
    } catch (e) {
      message.reply(`Failed to create the sticker. Maybe slots full or size above discord limit.`);
    }
  }
};
