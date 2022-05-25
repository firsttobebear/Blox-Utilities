const Request = require("request-promise")

const Main = {
    Initialize: Initialize,
    Authority: ["Staff Team"],
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
    const UniverseIds = []

    for (let i = 0; i < PlaceIds.length; i++) {
        const PlaceId = PlaceIds[i]

        const Query = await Request("https://api.roblox.com/universes/get-universe-containing-place?placeid=" + PlaceId)
        
        console.log(Query)
    }

    await Interaction.reply("Done")
}

module.exports = Main