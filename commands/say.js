module.exports = {
    commands: "say",
    expectedArgs: "<content>",
    permissionError: "you don't have permissions",
    minArgs: 1,
    maxArgs: 199,
    callback: (message, arguments, text) => {
        message.channel.send(text)
    },
    permissions: ["ADMINISTRATOR"],
    requiredRoles: []
}