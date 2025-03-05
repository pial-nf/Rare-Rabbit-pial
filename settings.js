const prefix = process.env.prefix || '?'
const status = `${prefix}help`;

module.exports = {
  bot: {
    info: {
      prefix: '?',
      token: 'MTMzNDIxMDQ5NTE2NjU0NTk1MA.GboJLz.P1rmJQ4uZn-D5FuTkRKjSqqcOSudVflEYA1iKw',
      invLink: 'https://discord.com/oauth2/authorize?client_id=1334210495166545950&permissions=8&integration_type=0&scope=bot',
      privacy: 'https://discord.gg/YAqrQKS5qu',
      terms: 'https://discord.gg/YAqrQKS5qu',
    },
    presence: {
      name: status,
      type: 'Listening',
      url: 'https://discord.gg/YAqrQKS5qu'
    },
    credits: {
      developerId: '713758139425751150',
      supportServer: 'https://discord.gg/YAqrQKS5qu'
    },
  }
}
