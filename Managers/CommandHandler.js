const { REST } = require("@discordjs/rest")
const DiscordAPI = require("discord-api-types/v9")
const Builder = require("@discordjs/builders")
const fs = require("fs")
const RoleManager = require("./RoleManager.js")
const Main = {
    Initialize: Initialize,
    Commands: {}
}

async function Initialize(Client) {
    const Contents = await fs.readdirSync("./Commands")
    const SlashCommands = []

    for (const Index in Contents) {
        const Command = Contents[Index]
        const CommandName = Command.toLowerCase().slice(0, Command.length - 3)
        Main.Commands[CommandName] = require("../Commands/" + Command)

        const CommandInstance = Main.Commands[CommandName]
        
        const SlashCommand = new Builder.SlashCommandBuilder()
            .setName(CommandName)
            .setDescription(CommandInstance.Description)

        if (CommandInstance.Parameters) {
            for (let i = 0; i < CommandInstance.Parameters.length; i++) {
                const Parameter = CommandInstance.Parameters[i]
                
                if (Parameter.Type == "String") {
                    const Option = new Builder.SlashCommandStringOption()
                        .setName(Parameter.OptionName.toLowerCase()) //Has to be lowercase otherwise gives format exception🙄
                        .setDescription(Parameter.Description)
                        .setRequired(Parameter.Required && true || false)                       

                    SlashCommand.addStringOption(Option)
                } else if (Parameter.Type == "User") {
                    const Option = new Builder.SlashCommandUserOption()
                        .setName(Parameter.OptionName.toLowerCase()) //Has to be lowercase otherwise gives format exception🙄
                        .setDescription(Parameter.Description)
                        .setRequired(Parameter.Required && true || false)

                    SlashCommand.addUserOption(Option)
                }
            }
        }

        SlashCommands.push(SlashCommand.toJSON())
    }

    const ActivatedREST = new REST({
        version: "9"
    }).setToken(process.env.TOKEN)

    await ActivatedREST.put(
        DiscordAPI.Routes.applicationGuildCommands(Client.user.id, process.env.GUILDID),
        {
            body: SlashCommands
        }
    )

    Client.on("rateLimit", async Info => {
        console.log("RATE LIMIT: Timed out for " + Info.timeout + ", max requests for this are " + Info.limit + ", using the method " + Info.method + ", using the path " + Info.path + ", using the route " + Info.route + ".")
    })

    Client.on("interactionCreate", async function(Interaction) {
        if (!Interaction.isCommand()) {
            return
        }

        const CommandName = Interaction.commandName.toLowerCase()
        
        if (!Main.Commands[CommandName]) {
            return
        }

        if (!Interaction.guild) {
            return
        }

        const CommandInstance = Main.Commands[CommandName]

        if (!RoleManager.HasRole(Interaction.member, CommandInstance.Authority)) {
            await Interaction.reply({
                content: "You do not have the correct privelages to use this command",
                ephemeral: true
            })

            return
        }

        try {
            await CommandInstance.Initialize({
                Interaction: Interaction,
                Client: Client
            })
        } catch (err) {
            console.log(err)

            await Interaction.reply({
                content: "An error occured while executing this command"
            })
        }
    })
}

module.exports = Main