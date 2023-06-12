import { PermissionFlagsBits } from "discord.js";
import { PrefixCommand } from '@commands/types';

const command : PrefixCommand = {
    name: "greet",
    execute: (message, args) => {
        let toGreet = message.mentions.members?.first()
        message.channel.send(`Hello there ${toGreet ? toGreet.user.username : message.member?.user.username}!`)
    },
    cooldown: 10,
    aliases: ["sayhello"],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers] // to test
}

export default command