import 'module-alias/register';
import { config } from 'dotenv';
import discordBot from './discordBot'; 
import expressApp from './expressApp';
import { PrefixCommand, SlashCommand } from '@commands/types';
import { Collection } from 'discord.js';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string,
            DISCORD_CLIENT_ID: string,
            DISCORD_CLIENT_SECRET: string,
            DISCORD_CLIENT_REDIRECT: string,
            DISCORD_DEFAULT_PREFIX: string,
            MONGO_URI: string,
            MONGO_DATABASE_NAME: string,
            SESSION_SECRET: string,
            FRONTEND_URL: string 
            PORT: number
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, PrefixCommand>,
        cooldowns: Collection<string, number>
    }
}

config();
discordBot()
expressApp()