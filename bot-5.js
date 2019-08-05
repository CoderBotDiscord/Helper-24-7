/*
-Prefix <
-Warn command
-Ban command
-Make it playing (Prefix < or <help)
-If you ping Mod or Owner Bot says (Do not ping them) And will warn them for pinging Them 
*/
const config = {
    token: "NjA2NTc4MjYzOTgwMTEzOTQz.XUb1jA.rq3lrHd-f3-m6hBAnnquj-wLR3A",
    prefix: "<",
    server: "605025487580037121",
    adminRole: "607590633275654185",
    log: "607590886263488525"
}

const Discord = require("discord.js");
var client = new Discord.Client();

function isAdmin(user) {
    return client.role.members.has(user.id) || client.guild.owner.user.equals(user);
}

client.on("ready", () => {

    client.guild = client.guilds.get(config.server);
    client.role = client.guild.roles.get(config.adminRole);
    client.log = client.channels.get(config.log);

    console.log("Bot ready'd");
    client.user.setActivity("🔥🔥🔥Helping Prefix:< 🔥🔥🔥");
    client.user.setStatus("onlne")
    setInterval(() => {
        client.user.setActivity("🔥🔥🔥Helping Prefix:< 🔥🔥🔥");
        client.user.setStatus("online")
    }, 1800000);
})

function warn(msg, warnee, warner, reason) {
    var embed = new Discord.RichEmbed()
        .setTitle("User Warned")
        .setDescription(`${warnee} warned by ${warner} for ${reason || "No reason provided"}`)
        .setThumbnail(warnee.displayURL)
        .setColor("ORANGE")
        .setTimestamp(new Date());

    msg.channel.send(embed);
    client.log.send(embed);
}

client.on("message", (message) => {

    if(message.author.bot || !message.guild) return;

    if(message.mentions.users.some(x=>isAdmin(x)) && !isAdmin(message.author)) {
        message.delete()
        warn(message, message.author, client.user, "Pinging mods");
    }

    if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "warn") {
        message.delete();
        if(!isAdmin(message.author)) return message.reply("You're not allowed to run that command!");
        var warnee = message.mentions.members.first();
        if(!warnee) return message.reply("Mention someone!").then(x=>x.delete(3000));

        warn(message, warnee, message.author, args.splice(1).join(" "));
    }

    if(command == "ban") {
        message.delete();
        if(!isAdmin(message.author)) return message.reply("You're not allowed to run that command!");
        var banee = message.mentions.members.first();
        if(!banee) return message.reply("Mention someone!").then(x=>x.delete(3000));

        banee.ban({
            days: 7,
            reason: `${message.author.tag} for ${args.splice(1).join(" ")}`
        })
            .then(x=>{
                var embed = new Discord.RichEmbed()
                    .setTitle("User Banned")
                    .setDescription(`${banee} (${banee.user.tag}) banned by ${message.author} for ${args.splice(1).join(" ") || "No reason provided"}`)
                    .setThumbnail(banee.user.displayAvatarURL)
                    .setColor("RED")
                    .setTimestamp(new Date())

                message.channel.send(embed);
                client.log.send(embed);
            })
            .catch(err=>{
                console.error(err);
                message.reply("Failed to ban user!").then(x=>x.delete(3000));
            })
    }
    
    if(command == "help") {
        message.delete()
        message.channel.send("<help : Shows this menu \n<warn : Warn a user ADMIN-ONLY \n<ban : Ban a user ADMIN-ONLY", {code: "xl"})
    }
})

client.login(config.token);