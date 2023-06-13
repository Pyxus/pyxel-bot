import mongoose, { Schema, model } from 'mongoose';

interface GuildOptions {
	prefix: string;
	music_channel: string;
}

export type GuildOption = keyof GuildOptions;

export interface IGuild extends mongoose.Document {
	id: string;
	options: GuildOptions;
	joinedAt: Date;
}

const GuildSchema = new Schema<IGuild>({
	id: { type: String, required: true, unique: true },
	options: {
		prefix: { type: String, required: true, default: '!' },
		music_channel: {type: String}
	},
	joinedAt: {
		type: Date,
		default: Date.now(),
	},
});

const GuildModel = model('guild', GuildSchema);

export default GuildModel;
