import mongoose, { Schema, model } from 'mongoose';

export interface IUser extends mongoose.Document{
    discordId: string,
    discordTag: string,
    avatar: string,
    guilds: string[],
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