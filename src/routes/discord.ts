import { Router } from 'express';
import { getBotGuilds } from '../utils/api';
import UserModel, {IUser} from '@database/models/User';

const router = Router();

router.get('/guilds', async (req, res) => {
	const discordUser = req.user as IUser;
	const botGuilds = await getBotGuilds();
	const user = await UserModel.findOne<IUser>({
		discordId: discordUser.discordId,
	});

	if (user) {
		const mutualGuilds = user.guilds.filter((guild) =>
			botGuilds.find((botGuild: any) => (botGuild.id == guild) && (botGuild.permissions & 0x20) === 0x20)
		);
	}

	res.send(botGuilds);
});

export default router;
