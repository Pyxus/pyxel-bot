import mongoose, { Schema, model } from 'mongoose';
import { IGuild } from '../../types';

interface IUser extends mongoose.Document{
    discordId: String,
    discordTag: String,
    avatar: String,
    guilds: String[],
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
        type: [String]
    }
});

const UserModel = model('user', UserSchema);

export default UserModel;
