import { Guild } from "discord.js";
import GuildModel from "@database/models/Guild";
import { BotEvent } from "../types";

const event: BotEvent = {
    name: "guildCreate",
    execute: (guild : Guild) => {
        let newGuild = new GuildModel({
            guildID: guild.id,
            options: {},
            joinedAt: Date.now(),
        })
        newGuild.save()
    }
}

export default event;