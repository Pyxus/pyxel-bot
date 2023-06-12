import mongoose, { Schema, model } from 'mongoose';
import {IGuildInfo, GuildInfoSchema} from './GuildInfo';


export interface IUser extends mongoose.Document{
    discordId: string,
    discordTag: string,
    avatar: string,
    guilds: IGuildInfo[],
}

const UserSchema = new Schema<IUser>({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    discordTag: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    guilds: {
        type: [GuildInfoSchema],
    }
});

const UserModel = model('user', UserSchema);

export default UserModel;