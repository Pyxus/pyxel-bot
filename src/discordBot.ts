import {
	Client,
	GatewayIntentBits,
	Collection,
	PermissionFlagsBits,
} from 'discord.js';
import { PrefixCommand, SlashCommand } from '@commands/types';
import { readdirSync } from 'fs';
import { join } from 'path';

export default function() {
	const { Guilds, MessageContent, GuildMessages, GuildMembers } =
		GatewayIntentBits;
	const client = new Client({
		intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
	});

	client.slashCommands = new Collection<string, SlashCommand>();
	client.commands = new Collection<string, PrefixCommand>();
	client.cooldowns = new Collection<string, number>();

	const handlersDir = join(__dirname, './handlers');
	readdirSync(handlersDir).forEach((handler) => {
		require(`${handlersDir}/${handler}`)(client);
	});

	client.login(process.env.DISCORD_TOKEN);
}
