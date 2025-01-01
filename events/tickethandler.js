const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
const winston = require('winston');

const ticketDbPath = path.join(__dirname, 'ticketdb.json');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

function readTicketDb() {
  if (!fs.existsSync(ticketDbPath)) {
    return {};
  }

  const rawData = fs.readFileSync(ticketDbPath);
  if (rawData.length === 0) {
    return {};
  }

  return JSON.parse(rawData);
}

function writeTicketDb(data) {
  fs.writeFileSync(ticketDbPath, JSON.stringify(data, null, 2));
}

class TicketHandler {
  constructor(client) {
    this.client = client;
  }

  async createTicketPanel(interaction, ticketPanelData) {
    try {
      const { category, description, buttonLabel, supportRole, ticketChannel, ticketOpenMessage, ticketCloseMessage } = ticketPanelData;

      const supportRoleObj = interaction.guild.roles.cache.get(supportRole);
      if (!supportRoleObj) {
        logger.error(`Support role with ID ${supportRole} not found in the server ${interaction.guildId}.`);
        return interaction.reply({ content: 'The support role for this ticket panel could not be found.', ephemeral: true });
      }

      const ticketChannelObj = interaction.guild.channels.cache.get(ticketChannel);
      if (!ticketChannelObj) {
        logger.error(`Ticket channel with ID ${ticketChannel} not found in the server ${interaction.guildId}.`);
        return interaction.reply({ content: 'The ticket channel for this panel could not be found.', ephemeral: true });
      }

      const panelEmbed = new EmbedBuilder()
        .setTitle(`Welcome to Support of ${interaction.guild.name}`)
        .setDescription(description)
        .setImage("https://github.com/akshew/image-hosting/blob/main/rabbit-banner.png?raw=true")
        .setColor('#0099ff');

      const panelButton = new ButtonBuilder()
        .setCustomId('ticket-create')
        .setLabel(buttonLabel)
        .setStyle(ButtonStyle.Primary);

      const panelRow = new ActionRowBuilder().addComponents(panelButton);

      // Send the message to the specified ticket channel
      await ticketChannelObj.send({ embeds: [panelEmbed], components: [panelRow] });

      const ticketDb = readTicketDb();
      ticketDb[interaction.guildId] = {
        category,
        supportRole: supportRole,
        ticketChannel: ticketChannel,
        ticketOpenMessage,
        ticketCloseMessage,
      };
      writeTicketDb(ticketDb);

      logger.info(`Ticket panel created in guild ${interaction.guildId}`);
      interaction.reply({ content: 'Panel sent', ephemeral: true });
    } catch (error) {
      logger.error('Error creating ticket panel:', error);
      await interaction.reply({ content: 'An error occurred while creating the ticket panel. Please try again later.', ephemeral: true });
    }
  }

  async handleTicketInteraction(interaction) {
    console.log('Handling ticket interaction'); // Debug log
    try {
      const ticketPanelData = this.getTicketPanelData(interaction.guildId);
      if (!ticketPanelData) {
        logger.error(`Ticket panel configuration not found for guild ${interaction.guildId}`);
        return interaction.reply({ content: 'The ticket panel configuration could not be found.', ephemeral: true });
      }

      if (interaction.customId.startsWith('ticket-create')) {
        await this.openTicket(interaction, ticketPanelData);
      } else if (interaction.customId === 'ticket-close') {
        await this.closeTicket(interaction, ticketPanelData);
      }
    } catch (error) {
      logger.error('Error handling ticket interaction:', error);
      await interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
    }
  }

  getTicketPanelData(guildId) {
    const ticketDb = readTicketDb();
    return ticketDb[guildId] || null;
  }

  async openTicket(interaction, ticketPanelData) {
    try {
      const existingTickets = readTicketDb();
      const ticketKey = `${interaction.guildId}-${ticketPanelData.category}-${interaction.user.id}`;
      if (existingTickets[ticketKey]) {
        logger.info('User already has an open ticket');
        return interaction.reply({ content: 'You already have an open ticket. Please use that one.', ephemeral: true });
      }

      const supportRole = interaction.guild.roles.cache.get(ticketPanelData.supportRole);
      if (!supportRole) {
        logger.error(`Support role with ID ${ticketPanelData.supportRole} not found in the server ${interaction.guildId}.`);
        return interaction.reply({ content: 'The support role for this ticket panel could not be found.', ephemeral: true });
      }

      logger.info('Creating new ticket channel');
      const channel = await interaction.guild.channels.create({
        name: `${ticketPanelData.category}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory],
          },
          {
            id: interaction.client.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory],
          },
          {
            id: ticketPanelData.supportRole,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory],
          },
        ],
      });
      interaction.reply({ content: `Ticket created in ${channel}`, ephemeral: true });

      logger.info('Creating new ticket embed');
      const newEmbed = new EmbedBuilder()
        .setTitle(`Ticket - ${ticketPanelData.category}`)
        .setDescription(`${interaction.user} has opened a new ticket.\n\n**Topic:** ${ticketPanelData.ticketOpenMessage}`)
        .setColor('#0099ff')
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: `Ticket created by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

      logger.info('Creating new ticket button');
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket-close')
          .setLabel('Delete Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('<:eg_wrong:1243485864303005706>')
      );

      logger.info('Sending ticket message');
      await channel.send({ content: `${supportRole.toString()}, ${interaction.user} has opened a new ticket.`, embeds: [newEmbed], components: [row] });

      logger.info('Storing ticket information in database');
      existingTickets[ticketKey] = channel.id;
      writeTicketDb(existingTickets);

      logger.info('Replying to user');
      await interaction.reply({ content: `Your ticket has been created in ${channel}`, ephemeral: true });
    } catch (error) {
      logger.error('Error opening ticket:', error);
      await interaction.reply({ content: 'An error occurred while creating your ticket. Please try again later.', ephemeral: true });
    }
  }

  async closeTicket(interaction, ticketPanelData) {
    try {
      const existingTickets = readTicketDb();
      const ticketChannelId = interaction.channel.id;
      const ticketEntry = Object.entries(existingTickets).find(([key, id]) => id === ticketChannelId);

      if (!ticketEntry) {
        logger.info('Ticket channel not found in the database');
        return interaction.reply({ content: 'The ticket channel could not be found.', ephemeral: true });
      }

      const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
      const isManager = interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild);
      const supportRole = interaction.guild.roles.cache.get(ticketPanelData.supportRole);
      const isSupportRole = supportRole && interaction.member.roles.cache.has(supportRole.id);

      if (!isAdmin && !isManager && !isSupportRole) {
        logger.info('User does not have permission to close the ticket');
        return interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });
      }

      await interaction.reply({ content: 'Deleting ticket...', ephemeral: true });
      await interaction.channel.delete();

      delete existingTickets[ticketEntry[0]];
      writeTicketDb(existingTickets);

      const closeEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setDescription(`The ticket has been closed by ${interaction.user}.\n\n**Reason:** ${ticketPanelData.ticketCloseMessage}`)
        .setColor('#ff0000')
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: `Ticket closed by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

      await interaction.followUp({ embeds: [closeEmbed], ephemeral: true });
    } catch (error) {
      logger.error('Error closing ticket:', error);
      await interaction.reply({ content: 'An error occurred while closing the ticket. Please try again later.', ephemeral: true });
    }
  }
}

module.exports = TicketHandler;
