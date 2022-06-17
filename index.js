const Discord = require("discord.js");
const config = require(`./config/client.json`);
const filters = require(`./config/filters.json`);
const colors = require("colors");
const Enmap = require("enmap");
const libsodium = require("libsodium-wrappers");
const ffmpeg = require("ffmpeg-static");
const voice = require("@discordjs/voice");
const DisTube = require("distube").default;
const https = require('https-proxy-agent');
const client = new Discord.Client({
    fetchAllMembers: false,
    //restTimeOffset: 0,
    //restWsBridgetimeout: 100,
    shards: "auto",
    //shardCount: 5,
    allowedMentions: {
        parse: [],
        repliedUser: false,
    },
    failIfNotExists: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
        activities: [{
            name: "Deployment",
            type: "WATCHING",
        }],
        status: "idle"
    }
});

//const proxy = 'http://123.123.123.123:8080';
//const agent = https(proxy);
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
let spotifyoptions = {
    parallel: true,
    emitEventsAfterFetching: true,
}

if (config.spotify_api.enabled) {
    spotifyoptions.api = {
        clientId: config.spotify_api.clientId,
        clientSecret: config.spotify_api.clientSecret,
    }
}

client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    //emitAddListWhenCreatingQueue: false,
    searchSongs: 0,
    youtubeCookie: config.youtubeCookie,
    nsfw: config.nsfwMusic,
    emptyCooldown: 25,
    ytdlOptions: {
        // requestOptions: {
        //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO
        // },
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 75000,
        dlChunkSize: 1024 * 1024 * 4,
    },
    youtubeDL: true,
    updateYouTubeDL: true,
    customFilters: filters,
    plugins: [
        new SpotifyPlugin(spotifyoptions),
        new SoundCloudPlugin()
    ]
})

//Define Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.maintenance = false;
client.fatalError = false;

try { client.categories = require("fs").readdirSync(`./commands`) } catch { };
try { client.slashCategories = require("fs").readdirSync(`./commands`) } catch { };
client.emoji = require("./config/emojis.json");
client.maps = new Map();

client.setMaxListeners(100); require('events').defaultMaxListeners = 100;

client.settings = new Enmap({ name: "settings", dataDir: "./databases/settings" });
client.infos = new Enmap({ name: "infos", dataDir: "./databases/infos" });
client.autoresume = new Enmap({ name: "autoresume", dataDir: "./databases/infos"});

//Require the Handlers
["events", "commands", config.antiCrash ? "antiCrash" : null, "distubeEvent"]
    .filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
    })

//Start the Bot
client.login(config.token)