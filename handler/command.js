const { readdirSync } = require('fs');

module.exports = (client) => {
  console.log(`
┏━━━━━━━━━┓
┃RaBBiT v1┃
┗━━━━━━━━━┛
  `);

  let commandCount = loadCommands(client);
  let eventCount = loadEvents(client);

  console.log(`Kronix | Loaded ${commandCount} commands.`);
  console.log(`Kronix | Loaded ${eventCount} events.`);
};

function loadCommands(client) {
  let commandCount = 0;
  readdirSync('./commands/').forEach((dir) => {
    const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));
    commandCount += commands.length;
    for (let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);
      if (pull.name) {
        client.commands.set(pull.name, pull);
      }
      if (pull.aliases && Array.isArray(pull.aliases)) {
        pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
      }
    }
  });
  return commandCount;
}

function loadEvents(client) {
  let eventCount = 0;
  readdirSync('./events/').forEach((file) => {
    let pull = require(`../events/${file}`);
    if (pull.name) {
      client.events.set(pull.name, pull);
      eventCount++;
    }
  });
  return eventCount;
}
