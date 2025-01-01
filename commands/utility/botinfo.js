const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const emoji = require("../../emoji.js");

module.exports = {
  name: "botinfo",
  aliases: ["info", "bi", "rabbitinfo"],
  voteOnly: false,
  BotPerms: ["EmbedLinks"],
  run: async (client, message, args) => {
    const button1 = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("first")
      .setLabel("Basic Info")
      .setEmoji("1243485812373590016")
      .setDisabled(true);

    const button2 = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("second")
      .setLabel("Team Info")
      .setEmoji("1222290414866923702")
      .setDisabled(false);

    const row = new ActionRowBuilder().addComponents(button1, button2);

    const createEmbed = (fields) => {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: message.author.tag,
          iconURL: message.member.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(message.member.displayAvatarURL({ dynamic: true }));

      fields.forEach((field) => {
        if (field.value) {
          embed.addFields({
            name: field.name,
            value: field.value,
            inline: false,
          });
        }
      });

      return embed;
    };

    const embed1 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `Rare Rabbit - Go Beyond Imagination \n Your Discord server's all-in-one solution. Featuring Antinuke, Automod, Autorole, Welcome, Giveaways, Music, Ticket, Custom-Roles, Extra Owner/Admin and more. Use '?' prefix to empower your server.`
      )
      .addFields(
        {
          name: "__Basic Information__",
          value: `**NodeJs Version**: v${process.version.slice(
            1
          )}\n**Library**: [discord.js](https://discord.js.org/)`,
        },
        {
          name: "__Links__",
          value: `[Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) : [Support](${client.support}) : [Vote](https://top.gg/bot/${client.user.id}/vote) : [Website](${client.website})`,
        }
      )
      .setImage(
        "https://github.com/akshew/image-hosting/blob/main/rabbit-banner.png?raw=true"
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    const embed2 = createEmbed([
      {
        name: "__Developers__",
        value: `- [akshat](https://discord.com/users/747321055319949312)\n- [A R J U N](https://discord.com/users/1180995684380459018)`,
      },
      {
        name: "__Core Team__",
        value: `- [bre4d77](https://discord.com/users/1219568207719960578)\n- [Carli](https://discord.com/users/1131610350886846655)\n- [deVu](https://discord.com/users/840545614109343774)`,
      },
      {
        name: "__Organisation__",
        value: `- [Team Kronix](https://discord.gg/teamkronix)`,
      },
    ]).setImage(
      "https://github.com/akshew/image-hosting/blob/main/rabbit-team-banner.png?raw=true"
    );

    const messageComponent = await message.channel.send({
      embeds: [embed1],
      components: [row],
    });

    const collector = messageComponent.createMessageComponentCollector({
      filter: (interaction) => {
        if (message.author.id === interaction.user.id) return true;
        else {
          interaction.reply({
            content: `${emoji.util.cross} | This Pagination is not for you.`,
            ephemeral: true,
          });
          return false;
        }
      },
      time: 600000,
      idle: 800000 / 2,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isButton()) {
        switch (interaction.customId) {
          case "first":
            button1.setDisabled(true).setStyle(ButtonStyle.Success);
            button2.setDisabled(false).setStyle(ButtonStyle.Secondary);
            interaction.update({
              embeds: [embed1],
              components: [
                new ActionRowBuilder().addComponents(button1, button2),
              ],
            });
            break;
          case "second":
            button1.setDisabled(false).setStyle(ButtonStyle.Secondary);
            button2.setDisabled(true).setStyle(ButtonStyle.Success);
            interaction.update({
              embeds: [embed2],
              components: [
                new ActionRowBuilder().addComponents(button1, button2),
              ],
            });
            break;
        }
      }
    });

    collector.on("end", async () => {
      button1.setDisabled(true);
      button2.setDisabled(true);
      messageComponent.edit({
        components: [new ActionRowBuilder().addComponents(button1, button2)],
      });
    });
  },
};
