const prefix = process.env.prefix || '?'
const status = `${prefix}help`;

module.exports = {
  bot: {
    info: {
      prefix: '?',
      token: 'MTI0MjQ2MDMzMzAyNTc4NzkyNg.Gz5-zb.2S5q0vTByM3Y3BJKkDlLgWUl7hSYr6BMsoricY',
      invLink: 'https://discord.com/api/oauth2/authorize?client_id=1242460333025787926&permissions=8&scope=bot%20applications.commands',
      privacy: 'https://discord.gg/teamkronix',
      terms: 'https://discord.gg/teamkronix',
    },
    presence: {
      name: status,
      type: 'Listening',
      url: 'https://discord.gg/teamkronix'
    },
    credits: {
      developerId: '747321055319949312',
      supportServer: 'https://discord.gg/teamkronix'
    },
  }
}
