const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const tLog = new Date();

module.exports = async (client) => {
    
    console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m Loading Commands`)
    const commandFiles = await globPromise(`${process.cwd()}/commands/*/*.js`);

    commandArray = [];

    commandFiles.map(async (file) => {
        const command = await require(file);

        if(!command.name) return;
        if (command.Perms) command.defaultPermission = false;

        const splitted = file.split("/");
        const directory = splitted[splitted.length - 2];
        console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[32m Loaded \x1b[1m ${command.name}\x1b[0m\x1b[32m from ${directory}\x1b[0m`);

        await client.commands.set(command.name, command);
        commandArray.push(command);
    });

    client.on("ready", async () => {

        const Guilds = client.guilds.cache.map((guild) => guild.id);

        Guilds.forEach(async (guild) => {
          const clientGuild = await client.guilds.cache.get(guild);
    
          clientGuild.commands.set(commandArray).then((command) => {
            const Roles = (commandName) => {
              const cmdPerms = commandArray.find(
                (c) => c.name === commandName
              ).Perms;
    
              if (!cmdPerms) return null;
    
              return clientGuild.roles.cache.filter(
                (r) => r.permissions.has(cmdPerms) && !r.managed
              );
            };
    
            const fullPermissions = command.reduce((accumulator, x) => {
              const roles = Roles(x.name);
              if (!roles) return accumulator;
    
              const permissions = roles.reduce((a, v) => {
                return [...a, { id: v.id, type: 'ROLE', permission: true }];
              }, []);
    
              return [...accumulator, { id: x.id, permissions }];
            }, []);
    
            clientGuild.commands.permissions.set({ fullPermissions });
          });
        });
      });
}