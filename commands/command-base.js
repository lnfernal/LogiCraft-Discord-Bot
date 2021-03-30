const { prefix } = require("../config.json")

const validatePermissions = (permissions) => {
    const validPermissions = [
        "ADMINISTRATOR",
        "KICK_MEMBERS",
    ]
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = "",
        permissionError = "You don't have permission",
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions

    // ensure the command and aliases are in an array
    if (typeof commands === "string") {
        commands = [commands]
    }
    console.log(`Registering command "${prefix}${commands[0]}"`)

    // ensure the permissions are in an array and are all valid
    if (permissions.length) {
        if (typeof permissions === "string") {
            permissions = [permissions]
        }
        validatePermissions(permissions)
    }

    // listen for messages
    client.on("message", message => {
        const { member, content, guild } = message

        for (const alias of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
                // command will run

                // check bot trolling
                if (member.id == "824989001999712337") {
                    message.channel.send("Don't troll the bot")
                    return
                }

                // ensure user has required permissions
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.channel.send(`${message.member.displayName}, ${permissionError}`)
                        return
                    }
                }

                // ensure user has required roles
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => role.name === requiredRole)

                    if (!role || member.roles.cache.has(role.id)) {
                        message.channel.send(`${message.member.displayName}, you must have the ${requiredRole} role to use this command`)
                        return
                    }
                }

                // split
                const arguments = content.split(" ")

                // remove command
                arguments.shift()

                // join again
                if (arguments.length < minArgs || (arguments.length > maxArgs && maxArgs != null)) {
                    message.channel.send(`${message.member.displayName}, incorrent syntax! Use ${prefix}${alias} ${expectedArgs}`)
                    return
                }

                // handle the custom command code
                callback(message, arguments, arguments.join(" "))
                return
            }
        }
    })
}