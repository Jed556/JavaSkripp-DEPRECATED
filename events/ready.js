const client = require("../main");
tLog = new Date();

client.on("ready", () => {
    console.log(`\x1b[36m [${tLog.toLocaleString("en-US")}]\x1b[0m Bot ${client.user.tag} Online`)
    client.user.setActivity('commands', {type: 'LISTENING'})
});
