import axios from 'axios';

export async function getBotGuilds() {
	const res = await axios.get('http://discord.com/api/v6/users/@me/guilds', {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
		},
	});
	return res.data;
}
