import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../utils/functions";
import {BotEvent} from '@events/types'

module.exports = (client: Client) => {
    let eventsDir = join(__dirname, "../events")

    readdirSync(eventsDir).forEach(file => {
        if ((!file.endsWith(".js") && !file.endsWith(".ts"))) return;
        let event: BotEvent = require(`${eventsDir}/${file}`).default
        event.once ?
            client.once(event.name, (...args) => event.execute(...args))
            :
            client.on(event.name, (...args) => event.execute(...args))
        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
    })
}
