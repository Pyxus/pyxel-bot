import mongoose, { Schema, model } from 'mongoose';

export interface IGuildInfo {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: number;
    permissions_new: string;
	features: string[] | undefined;
}

export const GuildInfoSchema  = new Schema<IGuildInfo>({
	id: { type: String, required: true },
	name: { type: String, required: true },
	icon: { type: String, default: null },
	owner: { type: Boolean, required: true },
    permissions_new: {type: String},
	permissions: { type: Number, required: true },
	features: [{ type: String }],
});