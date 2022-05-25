const Request = require("request-promise")

const Main = {
    Initialize: Initialize,
    Authority: ["Dev Team"],
    Description: "Update the sound access to the games you specify",
    Parameters: [
        {
            Type: "String",
            OptionName: "SoundId",
            Description: "Seperate by spaces for multiple sound ids",
            Required: true 
        },
        {
            Type: "String",
            OptionName: "PlaceId",
            Description: "Seperate by spaces for multiple place ids",
            Required: true 
        },
    ]
}

async function Initialize(Content) {
    const Interaction = Content.Interaction
    const SoundIds = Interaction.options.getString("soundid").split(" ")
    const PlaceIds = Interaction.options.getString("placeid").split(" ")

    for (let i = 0; i < PlaceIds.length; i++) {
        const PlaceId = PlaceIds[i]
        const SoundId = SoundIds[i]

        const Query = await Request("https://api.roblox.com/universes/get-universe-containing-place?placeid=" + PlaceId)
        const UniverseId = JSON.parse(Query).UniverseId

        const Response = await Request({
            // This will never actually sign you out because an X-CSRF-TOKEN isn't provided, only received
            uri: 'https://auth.roblox.com/v2/logout', // REQUIRES https. Thanks for letting me know, ROBLOX...
            method: 'POST',
            resolveWithFullResponse: true,
            headers: {
                cookie: process.env.COOKIE,
            }
        })

        const Parsed = await JSON.parse(Response.body)
        console.log(UniverseId)


        /*const Response = await Request({
            uri: "https://apis.roblox.com/asset-permissions-api/v1/assets/" + SoundId + "/permissions",
            options: {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': token
                },
                json: {
                    action: "use",
                    subjectId: UniverseId,
                    subjectType: "Universe"
                }
            }
        })*/

        console.log(Response)
    }

    await Interaction.reply("Done")
}

module.exports = Main