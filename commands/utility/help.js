const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const Settings = require("../../settings.js");
const emoji = require("../../emoji.js");
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: "help",
  aliases: ["h"],
  BotPerms: ["EmbedLinks"],
  voteOnly: false,
  run: async function (client, message, args) {
    const prefix =
      (await client.db8.get(`${message.guild.id}_prefix`)) ||
      Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);
    const premium = await client.db12.get(`${message.guild.id}_premium`);

    const menuOptionsPrefix = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("helpOptionPrefix")
        .setPlaceholder("Prefix Commands")
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel("Automod")
            .setValue("automod")
            .setEmoji("1276444796377894942")
            .setDescription("Explore Automod Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Moderation")
            .setValue("moderation")
            .setEmoji("1276444793240555571")
            .setDescription("Explore Moderation Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Server")
            .setValue("server")
            .setEmoji("1275459515873231001")
            .setDescription("Explore Server Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Giveaway")
            .setValue("giveaway")
            .setEmoji("1276462641967272018")
            .setDescription("Explore Giveaway Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Utility")
            .setValue("utility")
            .setEmoji("1276461572214231042")
            .setDescription("Explore Utility Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Sticky Message")
            .setValue("sticky")
            .setEmoji("1275390600014725150")
            .setDescription("Explore Sticky Message Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Vanity")
            .setValue("vanity")
            .setEmoji("1275390607145041991") 
            .setDescription("Explore Vanity Commands"),
        ])
    );

    const menuOptionsSlash = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("helpOptionSlash")
        .setPlaceholder("Slash Commands")
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel("Home")
            .setValue("home")
            .setEmoji("1275390594893611009")
            .setDescription("Explore Home Page"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Welcome")
            .setValue("welcome")
            .setEmoji("1275460866325610577")
            .setDescription("Explore Welcome Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Ticket")
            .setValue("ticket")
            .setEmoji("1276445075101974538")
            .setDescription("Explore Ticket Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Music")
            .setValue("music")
            .setEmoji("1275390609749966921")
            .setDescription("Explore Music Commands"),
          new StringSelectMenuOptionBuilder()
            .setLabel("AI")
            .setValue("ai")
            .setEmoji("1275390612316753953")
            .setDescription("Explore AI Commands"),
        ])
    );

    const embed1 = new EmbedBuilder()
      .setColor("#090000")
      .setDescription(
        "<a:121_Flower:1276444798244360303> [**Welcome to Rabbit! Your ultimate Versatile bot.**](https://discord.gg/teamkronix) \n" + 
        "<:projects:1254846606734528573> [*Use the dropdown menu below to explore various command categories.*](https://discord.gg/teamkronix)"
      )
      .addFields({
        name: "<:Category:1265733980918120563> __Categories__",
        value: 
          "> <:eg_shield:1276444796377894942> - **Automod**\n" +
          "> <:ntools:1276444793240555571> - **Moderation**\n" +
          "> <:eg_wave:1275460866325610577> - **Welcome**\n" +
          "> <:nmusic:1275390609749966921> - **Music**\n" +
          "> <:eg_ticket:1276445075101974538> - **Ticket**\n" +
          "> <:_giveaway2:1276462641967272018> - **Giveaway**\n" +
          "> <:eg_discovery:1275459515873231001> - **Server**\n" +
          "> <:eg_wrench:1276461572214231042> - **Utility**\n" +
          "> <:eg_fire:1275390600014725150> - **Sticky Message**\n" +
          "> <:eg_premium:1275390612316753953> - **AI**\n" +
          "> <:nlink:1275390607145041991> - **Vanity**",
        inline: false,
      })
      .setImage(
        "https://github.com/akshew/image-hosting/blob/main/cmds.png?raw=true"
      );

    const embeds = {
      automod: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.automod} Automod Commands`,
        value:
          "automod, automod anti message spam enable/disable, automod anti mention spam enable/disable, automod anti toxicity enable/disable, automod config, automod reset",
        inline: false,
      }),
      moderation: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.moderation} Moderation Commands`,
        value:
          "timeout <user>, untimeout <user>, clear bots, clear humans, clear embeds, clear files, clear mentions, clear pins, ban <user>, unban <user>, kick <user>, hide <channel>, unhide <channel>, lock <channel>, unlock <channel>, nuke, purge, voice, voice muteall, voice unmuteall, voice deafenall, voice undeafenall, voice mute <user>, voice unmute <user>, voice deafen <user>, voice undeafen <user>",
        inline: false,
      }),
      welcome: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.welcome} Welcome Commands`,
        value:
          "welcome setup, welcome variable, autorole, autorole humans add <role mention/id>, autorole humans remove <role mention/id>, autorole bots add <role mention/id>, autorole bots remove <role mention/id>, autorole config, autorole reset",
        inline: false,
      }),
      server: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.ignore} Server Commands`,
        value:
          "extra, extra owner add <user mention/id>, extra admin add <user mention/id>, extra owner remove <user mention/id>, extra admin remove <user mention/id>, extra owner show, extra admin show, extra owner reset, extra admin reset, premium, premium add <guild id>, premium remove <guild id>, resetall",
        inline: false,
      }),
      giveaway: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.giveaway} Giveaway Commands`,
        value: "gcreate, reroll, end",
        inline: false,
      }),
      ticket: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.ticket} Ticket Commands`,
        value: "ticket-panel",
        inline: false,
      }),
      utility: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.utility} Utility Commands`,
        value:
          "help, invite, ping, prefix, support, uptime, userinfo, serverinfo, avatar user, botinfo, afk, report, roles, membercount, vote",
        inline: false,
      }),
      music: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.music} Music Commands`,
        value:
          "play, pause, resume, stop, skip, volume, loop, nowplaying, queue, remove, clear, leave, search, forward, rewind",
        inline: false,
      }),
      sticky: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.sticky} Sticky Message Commands`,
        value: "stickyadd, stickyremove",
        inline: false,
      }),
      ai: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.ai} AI Commands`,
        value: "random",
        inline: false,
      }),
      vanity: new EmbedBuilder().setColor(client.color).addFields({
        name: `${emoji.id.vanity} Vanity Commands`,
        value: "vanity set, vanity remove, vanity list",
        inline: false,
      }),
    };

    await message.reply({
      components: [menuOptionsPrefix, menuOptionsSlash],
      embeds: [embed1],
    });

    const collector = message.channel.createMessageComponentCollector({
      filter: (interaction) =>
        interaction.user.id === message.author.id &&
        interaction.customId === "helpOptionPrefix",
      componentType: "SELECT_MENU",
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      const selectedEmbed = embeds[interaction.values[0]];
      await interaction.reply({
        embeds: [selectedEmbed],
        ephemeral: true,
      });
    });
  },
};
