import { Router } from 'express';
import UserModel, { IUser } from '@database/models/User';
import axios from 'axios';
import { IGuildInfo } from '@database/models/GuildInfo';
import GuildModel from '@database/models/Guild';

const PERMISSION_MANAGE_GUILD = 0x20;
const router = Router();

export async function getBotGuilds() {
	const res = await axios.get('http://discord.com/api/v6/users/@me/guilds', {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
		},
	});
	return res.data;
}

router.get('/guilds', async (req, res) => {
	const discordUser = req.user as IUser;
	const botGuilds = await getBotGuilds();
	const user = await UserModel.findOne<IUser>({
		discordId: discordUser.discordId,
	});

	if (user) {
		const mutualGuilds = user.guilds.filter((userGuild) =>
			botGuilds.find(
				(botGuild: IGuildInfo) =>
					botGuild.id === userGuild.id &&
					(userGuild.permissions & PERMISSION_MANAGE_GUILD) ===
						PERMISSION_MANAGE_GUILD
			)
		);
		res.send(mutualGuilds);
	}
});

export default router;
