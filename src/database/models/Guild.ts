import mongoose, { Schema, model } from 'mongoose';

interface GuildOptions {
    prefix: string,
}

export type GuildOption = keyof GuildOptions

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

const GuildSchema = new Schema<IGuild>({
	guildID: { type: String, required: true, unique: true },
	options: {
		prefix: { type: String, required: true, default: process.env.DISCORD_DEFAULT_PREFIX },
	},
});

const GuildModel = model('guild', GuildSchema);

export default GuildModel;
