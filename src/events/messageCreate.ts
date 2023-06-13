import { ChannelType, Message } from "discord.js";
import {} from '@discordjs/voice'
import { checkPermissions, getGuildOption, sendTimedMessage } from "../utils/functions";
import {BotEvent} from '@events/types'
import ytdl from 'ytdl-core'
import fs from 'fs'
import GuildModel from "@database/models/Guild";
import { url } from "inspector";

interface Song{
    name: string,
    url: string
}

class MusicSession {
    public voice_connection: string;
    public session_msg: Message;
    public is_looping: boolean = false;
    public current_song?: Song;
    public song_queue: Song[] = [];
  
    constructor(
      voiceConnection: string,
      sessionMsg: Message,
    ) {
      this.voice_connection = voiceConnection;
      this.session_msg = sessionMsg;
    }
  
    // Example methods:
    public playNextSong(): void {
      // Code to play the next song in the queue
    }
  
    public toggleLooping(): void {
      this.is_looping = !this.is_looping;
      // Code to handle looping logic
    }
  }

interface GuildCache {
    id: string
    prefix: string
    music_channel?: string
    music_session?
    : MusicSession
}

const YT_LINK_REGEX = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}/;
const cacheById = new Map<string, GuildCache>();


const fetchGuildCache = async (guildId: string) => {
    const guildCache: GuildCache = {id: guildId, prefix: process.env.DISCORD_DEFAULT_PREFIX}

    if (!cacheById.has(guildId)){
        const guild = await GuildModel.findOne({id: guildId});
        
        if (guild){
            guildCache.prefix = guild.options.prefix;
            guildCache.music_channel = guild.options.music_channel;
        } else{
            console.error('Guild does not exist in dabtase')
        }
    }

    return guildCache;
}


const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        if (!message.member || message.member.user.bot) return;
        if (!message.guild) return;

        //message.member.voice.channel.

        const guildCache = await fetchGuildCache(message.guild.id);
        const prefix = guildCache.prefix;

        if (message.channel.id == guildCache.music_channel){
            // Check for YT URL
            const searchResult = YT_LINK_REGEX.exec(message.content)
            if (searchResult){
                await message.react('🎶');

                const ytLink = searchResult[0];
                const ytInfo = await ytdl.getInfo(ytLink);
                const saveDir = `downloads/music/${message.guild.id}`
                const savePath = `${saveDir}/${ytInfo.videoDetails.videoId}.mp3`
                const song: Song = {name: ytInfo.videoDetails.title, url: savePath }

                if (!fs.existsSync(saveDir))
                    fs.mkdirSync(saveDir, {recursive: true});

                ytdl.downloadFromInfo(ytInfo, {filter: 'audioonly'})
                    .pipe(fs.createWriteStream(savePath))
                
                
                // Start new music session or if one exists add this song to queue
            }

            // Check for MP3
            message.attachments.forEach(async (attachment) => {
                if (attachment.contentType === 'audio/mpeg'){
                    await message.react('🎶');
                    const song: Song = {name: attachment.name!, url: attachment.url }
                    // Start new music session or if one exists add this song to queue
                }
            })
        }

        if (!message.content.startsWith(prefix)) return;
        if (message.channel.type !== ChannelType.GuildText) return;

        const args = message.content.substring(prefix.length).split(" ")
        let command = message.client.commands.get(args[0])

        if (!command) {
            let commandFromAlias = message.client.commands.find((command) => command.aliases.includes(args[0]))
            if (commandFromAlias) command = commandFromAlias
            else return;
        }

        let cooldown = message.client.cooldowns.get(`${command.name}-${message.member.user.username}`)
        let neededPermissions = checkPermissions(message.member, command.permissions)
        if (neededPermissions !== null)
            return sendTimedMessage(
                `
            You don't have enough permissions to use this command. 
            \n Needed permissions: ${neededPermissions.join(", ")}
            `,
                message.channel,
                5000
            )


        if (command.cooldown && cooldown) {
            if (Date.now() < cooldown) {
                sendTimedMessage(
                    `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`,
                    message.channel,
                    5000
                )
                return
            }
            message.client.cooldowns.set(`${command.name}-${message.member.user.username}`, Date.now() + command.cooldown * 1000)
            setTimeout(() => {
                message.client.cooldowns.delete(`${command?.name}-${message.member?.user.username}`)
            }, command.cooldown * 1000)
        } else if (command.cooldown && !cooldown) {
            message.client.cooldowns.set(`${command.name}-${message.member.user.username}`, Date.now() + command.cooldown * 1000)
        }

        command.execute(message, args)
    }
}

export default event