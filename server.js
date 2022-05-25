const Discord = require("discord.js")
const fs = require("fs")
const Intents = Discord.Intents
const Client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
})

const LoadOrder = ["DataHandler", "RoleManager"]
const Parameters = {}

const LoadedModules = {}

require("dotenv").config()

async function LoadModule(ModuleName) {
    LoadedModules[ModuleName] = true

    const Module = await require("./Managers/" + ModuleName)

    if (Parameters[ModuleName]) {
        await Module.Initialize(...Parameters[ModuleName]) //If special parameters
    } else {
        await Module.Initialize(Client)
    }

    console.log("Initialized " + ModuleName.slice(0, ModuleName.length - 3))
}

Client.on("ready", async function() {
    for (let i = 0; i < LoadOrder.length; i++) {
        await LoadModule(LoadOrder[i] + ".js")
    }

    const Contents = fs.readdirSync("./Managers")
    for (let i = 0; i < Contents.length; i++) {
        const ModuleName = Contents[i]

        if (!LoadedModules[ModuleName]) {
            await LoadModule(ModuleName)
        }
    }

    console.log("Bot is ready")
})

Client.login(process.env.TOKEN)