import express from 'express';
import { Strategy } from 'passport-discord';
import { color } from './utils/functions';
import routes from './routes';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import UserModel, { IUser } from '@database/models/User';
import passport = require('passport');

function setupDiscordStrategy(){

	passport.serializeUser((user, done) => {
		const discordUser = user as IUser;
		done(null, discordUser.discordId)
	})
	
	passport.deserializeUser(async (discordId, done) => {
		try {
			const user = await UserModel.findOne({discordId});
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
					const guildIds = guilds ? guilds.map((guild) => guild.id) : []
					const findUser = await UserModel.findOneAndUpdate(
						{ discordId: id },
						{ discordTag: `${username}#${discriminator}`, avatar, guilds: guildIds },
						{ new: true }
					);
	
					if (findUser) {
						console.log('User was found');
						return done(null, findUser);
					} else {
						const newUser = await UserModel.create({
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
}

export default function () {
	const PORT = process.env.PORT || 3001;
	const ALLOWED_ORIGINS = [process.env.FRONTEND_URL]
	const app = express();

	setupDiscordStrategy()

	app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			cookie: {
				maxAge: 60000 * 60 * 24,
			},
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/api', routes);

	app.listen(PORT, () => {
		console.log(
			color(
				'text',
				`📡 Successfully listening to requests on port ${color(
					'variable',
					PORT
				)}`
			)
		);
	});
}
