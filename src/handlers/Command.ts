import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest"
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../utils/functions";
import { PrefixCommand, SlashCommand } from "@commands/types";

module.exports = (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = []
    const prefixCommands : PrefixCommand[] = []

    let slashCommandsDir = join(__dirname,"../commands/slash")
    let prefixCommandsDir = join(__dirname,"../commands/prefix")

    readdirSync(slashCommandsDir).forEach(file => {
        if (!file.endsWith(".js") && !file.endsWith(".ts"))  return;
        let command : SlashCommand = require(`${slashCommandsDir}/${file}`).default
        slashCommands.push(command.command)
        client.slashCommands.set(command.command.name, command)
    })

    readdirSync(prefixCommandsDir).forEach(file => {
        if (!file.endsWith(".js") && !file.endsWith(".ts")) return;
        let command : PrefixCommand = require(`${prefixCommandsDir}/${file}`).default
        prefixCommands.push(command)
        client.commands.set(command.name, command)
    })
    const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN);

    rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data : any) => {
        console.log(color("text", `🔥 Successfully loaded ${color("variable", data.length)} slash command(s)`))
        console.log(color("text", `🔥 Successfully loaded ${color("variable", prefixCommands.length)} command(s)`))
    }).catch(e => {
        console.log(e)
    })
}