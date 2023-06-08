import {
    Client,
    GatewayIntentBits,
    Collection,
    PermissionFlagsBits,
} from "discord.js";
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

const { Guilds, MessageContent, GuildMessages, GuildMembers } =
    GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
});

config();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
    if (handler != "Mongo.ts") {
        require(`${handlersDir}/${handler}`)(client);
    }
});

client.login(process.env.DISCORD_TOKEN);


/// OAUTH2 Testing
import express from 'express'
import { color } from "./functions";

const app = express();
const PORT = process.env.PORT | 3001;

app.listen(PORT, () => {
    console.log(color("text", `📡 Successfully listening to requests on port ${color("variable", PORT)}`))
})