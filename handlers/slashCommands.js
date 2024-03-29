const { readdirSync, lstatSync } = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../botconfig/config.json");
const dirSetup = [{
    "Folder": "Bot", "CmdName": "bot",
    "CmdDescription": "Get Bot, API or Command Information"
}, {
    "Folder": "Settings", "CmdName": "settings",
    "CmdDescription": "Bot Configuration"
}, {
    "Folder": "Music", "CmdName": "music",
    "CmdDescription": "Music Commands"
}, {
    "Folder": "Queue", "CmdName": "queue",
    "CmdDescription": "Music Queue Commands"
}, {
    "Folder": "Filter", "CmdName": "filter",
    "CmdDescription": "Modify Music Filters"
}, {
    "Folder": "JavaSkripp", "CmdName": "js",
    "CmdDescription": "Bot Moderation Commands"
}, {
    "Folder": "Moderation", "CmdName": "mod",
    "CmdDescription": "Guild Moderation Commands"
}, {
    "Folder": "User", "CmdName": "user",
    "CmdDescription": "User Commands"
}, {
    "Folder": "Search", "CmdName": "search",
    "CmdDescription": "Search Commands"
}, {
    "Folder": "Games", "CmdName": "game",
    "CmdDescription": "Play Games"
}, {
    "Folder": "Utility", "CmdName": "util",
    "CmdDescription": "Utility Commands"
}, {
    "Folder": "Code", "CmdName": "code",
    "CmdDescription": "Coding Commands"
}];

module.exports = (client) => {
    try {
        let allCommands = [];
        readdirSync("./slashCommands/").forEach((dir) => {
            if (lstatSync(`./slashCommands/${dir}`).isDirectory()) {
                const groupName = dir;
                const cmdSetup = dirSetup.find(d => d.Folder == dir);
                //Check if a valid cmdsetup
                if (cmdSetup && cmdSetup.Folder) {
                    //Set the SubCommand as a SlashCommandBuilder
                    const subCommand = new SlashCommandBuilder().setName(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase()).setDescription(String(cmdSetup.CmdDescription));
                    //For each file in that subcommand, add a command
                    const slashCommands = readdirSync(`./slashCommands/${dir}/`).filter((file) => file.endsWith(".js"));
                    for (let file of slashCommands) {
                        let pull = require(`../slashCommands/${dir}/${file}`);
                        if (pull.name && pull.description) {
                            subCommand
                                .addSubcommand((subcommand) => {
                                    subcommand.setName(String(pull.name).toLowerCase()).setDescription(pull.description)
                                    if (pull.options && pull.options.length > 0) {
                                        for (const option of pull.options) {
                                            if (option.User && option.User.name && option.User.description) {
                                                subcommand.addUserOption((op) =>
                                                    op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
                                                )
                                            } else if (option.Integer && option.Integer.name && option.Integer.description) {
                                                subcommand.addIntegerOption((op) =>
                                                    op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
                                                )
                                            } else if (option.String && option.String.name && option.String.description) {
                                                subcommand.addStringOption((op) =>
                                                    op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
                                                )
                                            } else if (option.Channel && option.Channel.name && option.Channel.description) {
                                                subcommand.addChannelOption((op) =>
                                                    op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
                                                )
                                            } else if (option.Role && option.Role.name && option.Role.description) {
                                                subcommand.addRoleOption((op) =>
                                                    op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
                                                )
                                            } else if (option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0) {
                                                subcommand.addStringOption((op) =>
                                                    op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
                                                        .addChoices(option.StringChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), String(c[1])])),
                                                )
                                            } else if (option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0) {
                                                subcommand.addStringOption((op) =>
                                                    op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
                                                        .addChoices(option.IntChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), parseInt(c[1])])),
                                                )
                                            } else {
                                                console.log(`A Option is missing the Name or/and the Description of ${pull.name}`)
                                            }
                                        }
                                    }
                                    return subcommand;
                                })
                            client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.name, pull)
                        } else {
                            console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
                            continue;
                        }
                    }
                    //add the subcommand to the array
                    allCommands.push(subCommand.toJSON());
                }
                else {
                    return console.log(`The Subcommand-Folder ${dir} is not in the dirSetup Configuration!`);
                }
            } else {
                let pull = require(`../slashCommands/${dir}`);
                if (pull.name && pull.description) {
                    let Command = new SlashCommandBuilder().setName(String(pull.name).toLowerCase()).setDescription(pull.description);
                    if (pull.options && pull.options.length > 0) {
                        for (const option of pull.options) {
                            if (option.User && option.User.name && option.User.description) {
                                Command.addUserOption((op) =>
                                    op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
                                )
                            } else if (option.Integer && option.Integer.name && option.Integer.description) {
                                Command.addIntegerOption((op) =>
                                    op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
                                )
                            } else if (option.String && option.String.name && option.String.description) {
                                Command.addStringOption((op) =>
                                    op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
                                )
                            } else if (option.Channel && option.Channel.name && option.Channel.description) {
                                Command.addChannelOption((op) =>
                                    op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
                                )
                            } else if (option.Role && option.Role.name && option.Role.description) {
                                Command.addRoleOption((op) =>
                                    op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
                                )
                            } else if (option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0) {
                                Command.addStringOption((op) =>
                                    op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
                                        .addChoices(option.StringChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), String(c[1])])),
                                )
                            } else if (option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0) {
                                Command.addStringOption((op) =>
                                    op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
                                        .addChoices(option.IntChoices.choices.map(c => [String(c[0]).replace(/\s+/g, '_').toLowerCase(), parseInt(c[1])])),
                                )
                            } else {
                                console.log(`A Option is missing the Name or/and the Description of ${pull.name}`)
                            }
                        }
                    }
                    allCommands.push(Command.toJSON());
                    client.slashCommands.set("normal" + pull.name, pull)
                }
                else {
                    console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
                }
            }
        });

        //Once the Bot is ready, add all Slash Commands to each guild
        client.on("ready", () => {
            if (config.loadSlashsGlobal) {
                client.application.commands.set(allCommands)
                    .then(slashCommandsData => {
                        client.slashCommandsData = slashCommandsData;
                        console.log("\n" + `${slashCommandsData.size} Categories ${`(With ${slashCommandsData.map(d => d.options).flat().length} slashCommands)`.green} Loaded for all possible guilds`.brightGreen +
                            "\n" + `Loading Globally (Might take up to 1 hour for Commands to update)`.bold.yellow + "\n")
                    }).catch((e) => { });
            } else {
                client.guilds.cache.map(g => g).forEach(async (guild) => {
                    try {
                        await guild.commands.set([]).catch((e) => { });
                        guild.commands.set(allCommands)
                            .then(slashCommandsData => {
                                client.slashCommandsData = slashCommandsData;
                                console.log("\n" + `${slashCommandsData.size} Categories ${`(With ${slashCommandsData.map(d => d.options).flat().length} slashCommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen + "\n");
                            }).catch((e) => { });
                    } catch (e) {
                        console.log(String(e).grey)
                    }
                });
            }
        })

        //DISABLE WHEN USING GLOBAL!
        client.on("guildCreate", async (guild) => {
            try {
                if (!config.loadSlashsGlobal) {
                    await guild.commands.set([]).catch((e) => { });
                    guild.commands.set(allCommands)
                        .then(slashCommandsData => {
                            console.log("\n" + `${slashCommandsData.size} Categories ${`(With ${slashCommandsData.map(d => d.options).flat().length} slashCommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen + "\n");
                        }).catch((e) => { console.log(String(e.stack).bgRed) });
                }
            } catch (e) {
                console.log(String(e).grey)
            }
        })

    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};