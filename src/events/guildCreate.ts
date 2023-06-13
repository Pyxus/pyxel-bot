import { Guild } from "discord.js";
import GuildModel from "@database/models/Guild";
import {BotEvent} from '@events/types'

const event: BotEvent = {
    name: "guildCreate",
    execute: (guild : Guild) => {
        let newGuild = new GuildModel({
            id: guild.id,
        })
        newGuild.save()
    }
}

export default event;