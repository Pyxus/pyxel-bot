import { Schema, model } from 'mongoose';
import { IGuild } from '../../types';

const GuildSchema = new Schema<IGuild>({
	guildID: { type: String, required: true, unique: true },
	options: {
		prefix: { type: String, required: true, default: process.env.DISCORD_DEFAULT_PREFIX },
	},
});

const GuildModel = model('guild', GuildSchema);

export default GuildModel;
