const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Sends a random anime-related image')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of image to send')
        .setRequired(true)
        .addChoices(
          { name: 'Neko', value: 'neko' },
          { name: 'Husbando', value: 'husbando' },
          { name: 'Kitsune', value: 'kitsune' },
          { name: 'Waifu', value: 'waifu' }
        )),
  async execute(client,interaction) {
    try {
      const type = interaction.options.getString('type');
      const response = await axios.get(`https://nekos.best/api/v2/${type}`);

      if (!response.data || !response.data.results || !response.data.results[0].url) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription('An error occurred while fetching the image. Please try again later.')
          ]
        });
      }

      const imageUrl = response.data.results[0].url;
      const embed = new EmbedBuilder()
        .setImage(imageUrl)
        .setTitle(`Random ${type} image`)
        .setDescription('Here is your requested image!');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('An unexpected error occurred. Please try again later.')
        ]
      });
    }
  }
};