import 'module-alias/register';
import { config } from 'dotenv';
config();

import {
	Client,
	GatewayIntentBits,
	Collection,
	PermissionFlagsBits,
} from 'discord.js';
import { Command, SlashCommand } from './types';
import { readdirSync } from 'fs';
import { join } from 'path';
import express from 'express';
import {color} from './functions';
import routes from './routes';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import './strategies/discord';
import passport = require('passport');

// Initialize Discord Bot
const { Guilds, MessageContent, GuildMessages, GuildMembers } =
	GatewayIntentBits;
const client = new Client({
	intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
});

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, './handlers');
readdirSync(handlersDir).forEach((handler) => {
	require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.DISCORD_TOKEN);

// Initialize Express
const PORT = process.env.PORT | 3001
const app = express();

app.use(session({
	secret: 'secret',
	cookie:{
		maxAge: 60000 * 60 * 24
	},
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongoUrl: process.env.MONGO_URI})
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(color("text", `📡 Successfully listening to requests on port ${color("variable", PORT)}`));
})