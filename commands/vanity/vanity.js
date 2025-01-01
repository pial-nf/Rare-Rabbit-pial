const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { ownerIDS } = require('../../dev.json');
const Settings = require('../../settings.js');
const owner = Settings.bot.credits.developerId;
const fs = require('fs');
const path = require('path');

const vanityFilePath = path.join(__dirname, 'vanity.json');
let vanityData = require('./vanity.json');

module.exports = {
  name: "vanity",
  aliases: ['vr'],
  UserPerms: [PermissionsBitField.Flags.Administrator],
  BotPerms: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ManageRoles],
  run: async (client, message, args) => {
    const [command, subCommand, ...subArgs] = args;

    switch (command) {
      case undefined:
        return sendHelpEmbed(client, message);

      case "set":
        switch (subCommand) {
          case "vanity":
            return setVanityURL(client, message, subArgs);

          case "role":
            return setVanityRole(client, message, subArgs);

          case "channel":
            return setVanityChannel(client, message, subArgs);

          default:
            break;
        }
        break;

      case "config":
        return sendConfigEmbed(client, message);

      case "reset":
        return resetVanitySettings(client, message);

      default:
        break;
    }
  },
};

async function saveVanityData() {
  fs.writeFileSync(vanityFilePath, JSON.stringify(vanityData, null, 2));
}

async function sendHelpEmbed(client, message) {
  const arypton = await client.users.fetch(owner);
  const helpEmbed = new EmbedBuilder()
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(client.color)
    .addFields(
      { name: `<a:arrow:1276458122734469161> \`vanity config\``, value: `Shows vanity role settings for the server.` },
      { name: `<a:arrow:1276458122734469161> \`vanity guide\``, value: `Shows the guide for vanity role settings.` },
      { name: `<a:arrow:1276458122734469161> \`vanity set role <role>\``, value: `Setups vanity role settings for the server.` },
      { name: `<a:arrow:1276458122734469161> \`vanity set vanity <vanity>\``, value: `Setups vanity role link settings for the server.` },
      { name: `<a:arrow:1276458122734469161> \`vanity set channel <channel>\``, value: `Setups vanity role settings for the server.` },
      { name: `<a:arrow:1276458122734469161> \`vanity reset\``, value: `Resets vanity role for the server.` }
    )
    .setFooter({ text: `Made by Team Kronix`, iconURL: arypton.displayAvatarURL({ dynamic: true }) });

  return message.channel.send({ embeds: [helpEmbed] });
}

async function setVanityURL(client, message, subArgs) {
  if (!subArgs[0]) {
    const vanityNoEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .addFields({ name: `Vanity Settings`, value: `Provide me a vanity URL to set for this server.` });
    return message.channel.send({ embeds: [vanityNoEmbed] });
  }

  vanityData[message.guild.id] = vanityData[message.guild.id] || {};
  vanityData[message.guild.id].Vanity = subArgs[0];
  await saveVanityData();

  const vanitySuccessEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
    .addFields({ name: `Vanity Settings`, value: `Vanity URL has been set to .gg/${subArgs[0]}.` });

  return message.channel.send({ embeds: [vanitySuccessEmbed] });
}

async function setVanityRole(client, message, subArgs) {
  const roleMention = message.mentions.roles.first();
  const roleID = subArgs[0];
  const role = roleMention || message.guild.roles.cache.get(roleID);

  if (!role) {
    const roleMissingEmbed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription('Please mention a role or provide a valid role ID.')
      .setColor(client.color);
    return message.channel.send({ embeds: [roleMissingEmbed] });
  }

  if (role.permissions.has(PermissionsBitField.Flags.Administrator)) {
    const adminRoleEmbed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription('The ADMINISTRATOR role cannot be selected.')
      .setColor(client.color);
    return message.channel.send({ embeds: [adminRoleEmbed] });
  }

  vanityData[message.guild.id] = vanityData[message.guild.id] || {};
  vanityData[message.guild.id].Role = role.id;
  await saveVanityData();

  const roleSuccessEmbed = new EmbedBuilder()
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
    .setDescription(`The vanity role has been set to ${role}.`)
    .setColor(client.color);

  return message.channel.send({ embeds: [roleSuccessEmbed] });
}

async function setVanityChannel(client, message, subArgs) {
  const channelMention = message.mentions.channels.first();
  const channelID = subArgs[0];
  const channel = channelMention || message.guild.channels.cache.get(channelID);

  if (!channel) {
    const channelMissingEmbed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription('Please mention a channel or provide a valid channel ID.')
      .setColor(client.color);
    return message.channel.send({ embeds: [channelMissingEmbed] });
  }

  vanityData[message.guild.id] = vanityData[message.guild.id] || {};
  vanityData[message.guild.id].Channel = channel.id;
  await saveVanityData();

  const channelSuccessEmbed = new EmbedBuilder()
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
    .setDescription(`The vanity channel has been set to ${channel}.`)
    .setColor(client.color);

  return message.channel.send({ embeds: [channelSuccessEmbed] });
}

async function sendConfigEmbed(client, message) {
  const guildData = vanityData[message.guild.id] || {};
  const vanityRole = guildData.Role || "Not set";
  const vanityURL = guildData.Vanity || "Not set";
  const vanityChannelID = guildData.Channel || "Not set";
  const vanityChannel = vanityChannelID !== "Not set" ? `<#${vanityChannelID}>` : "Not set";
  const arypton = await client.users.fetch(owner);

  const configEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
    .setThumbnail(client.user.displayAvatarURL())
    .setTitle('Vanity Role Config')
    .addFields(
      { name: `<a:arrow:1276458122734469161> Vanity Role:`, value: vanityRole === 'Not set' ? '`Not set`' : `<@&${vanityRole}>` },
      { name: `<a:arrow:1276458122734469161> Vanity URL:`, value: vanityURL === 'Not set' ? '`Not set`' : `.gg/${vanityURL}` },
      { name: `<a:arrow:1276458122734469161> Vanity Channel:`, value: vanityChannel }
    )
    .setFooter({ text: `Made by Team Kronix`, iconURL: arypton.displayAvatarURL({ dynamic: true }) });

  return message.channel.send({ embeds: [configEmbed] });
}

async function resetVanitySettings(client, message) {
  if (!vanityData[message.guild.id]) {
    const noSettingsEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription("No vanity settings found to reset.");
    return message.channel.send({ embeds: [noSettingsEmbed] });
  }

  delete vanityData[message.guild.id];
  await saveVanityData();

  const resetEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
    .setDescription("All vanity settings have been reset.");

  return message.channel.send({ embeds: [resetEmbed] });
}
