import passport from 'passport';
import { Strategy } from 'passport-discord';
import User from '@database/models/User';

interface IUser extends Express.User{
    discordId: string
}

passport.serializeUser((user, done) => {
    const discordUser = user as IUser;
    done(null, discordUser.discordId)
})

passport.deserializeUser(async (discordId, done) => {
    console.log("Deserializing: ", discordId);
    try {
        const user = await User.findOne({discordId});
        return user ? done(null, user) : done(null, null)
    }catch (err){
        console.log(err);
        return done(err, null)
    }
})

passport.use(
	new Strategy(
		{
			clientID: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			callbackURL: process.env.DISCORD_CLIENT_REDIRECT,
			scope: ['identify', 'guilds'],
		},
		async (accessToken, refreshToken, profile, done) => {
			const { id, username, discriminator, avatar, guilds } = profile;

			try {
				const findUser = await User.findOneAndUpdate(
					{ discordId: id },
					//TODO: Update Guilds. I don't think I can just pass in guilds since its supposed to be an array of ids
					// Ep2 18:20
					{ discordTag: `${username}#${discriminator}`, avatar },
					{ new: true }
				);

				if (findUser) {
					console.log('User was found');
					return done(null, findUser);
				} else {
					const newUser = await User.create({
						discordId: id,
						discordTag: `${username}#${discriminator}`,
						avatar,
					});
					return done(null, newUser);
				}
			} catch (err) {
				console.log(err);
                return done(err, undefined);
			}
		}
	)
);
