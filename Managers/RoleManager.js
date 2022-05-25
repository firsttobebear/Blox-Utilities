const Main = {
    Initialize: Initialize,
    GetGuild: GetGuild,
    HasRole: HasRole,
    GetRole: GetRole,
    RoleReferences: {
        "Dev Team": "945075296820949033"
    },
}

function GetGuild() {
    return Main.Client.guilds.cache.get(process.env.GUILDID)
}

function GetRole(RoleName, Guild) {
    if (!Guild) {
        Guild = Main.Client.guilds.cache.get(Settings.MainGuildId)
    }

    return Guild.roles.cache.find(r => r.id === Main.RoleReferences[RoleName])
}

function HasRole(Member, Roles) {
    if (!Member) {
        return
    }

    if (typeof(Roles) != "object") {
        Roles = [Roles]
    }

    for (const Index in Roles) {
        const RoleName = Roles[Index]

        if (RoleName == "@everyone" || Member.roles.cache.find(r => r.id === Main.RoleReferences[RoleName])) {
            return true
        }
    }
}

async function Initialize(Client) {
    Main.Client = Client

    const Guild = GetGuild()
    await Guild.channels.fetch()
    await Guild.roles.fetch()
}

module.exports = Main