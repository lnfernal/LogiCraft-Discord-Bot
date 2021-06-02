const sadAvatarCooldown = 1000 * 60 * 60 * 3
const idleAvatarCooldown = 1000 * 60 * 40
const cooldownCooldown = 1000 * 60 * 10
var timeoutIdle
var timeoutSad
var timeoutCooldown
var cooldown = false
var avatarIsSad = false

setIdleAvatar = client => {
  console.log("[!] avatar-idle loaded")
  setCooldown()
  client.user.setAvatar("./utils/images/avatar-manager/avatar-idle.png")
}

setSadAvatar = client => {
  console.log("[!] avatar-sad loaded")
  avatarIsSad = true
  client.user.setAvatar("./utils/images/avatar-manager/avatar-sad.png")
}

setAngryAvatar = client => {
  console.log("[!] avatar-angry loaded")
  setCooldown()
  client.user.setAvatar("./utils/images/avatar-manager/avatar-angry.png")
}

setTrollAvatar = client => {
  console.log("[!] avatar-troll loaded")
  setCooldown()
  client.user.setAvatar("./utils/images/avatar-manager/avatar-troll.png")
}

setCooldown = () => {
  clearTimeout(timeoutCooldown)
  cooldown = true
  timeoutCooldown = setTimeout(() => {
    cooldown = false
  }, cooldownCooldown)
}

module.exports = {
  init: client => {
    setCooldown()
    setTimeout(() => {
      setIdleAvatar(client)
    }, cooldownCooldown)
    timeoutSad = setTimeout(() => {
      setSadAvatar(client)
    }, sadAvatarCooldown)
  },

  angry: client => {
    if (!cooldown) {
      avatarIsSad = false
      setAngryAvatar(client)
      clearTimeout(timeoutIdle)
      timeoutIdle = setTimeout(() => {
        setIdleAvatar(client)
      }, idleAvatarCooldown)
    }
  },

  troll: client => {
    if (!cooldown) {
      avatarIsSad = false
      setTrollAvatar(client)
      clearTimeout(timeoutIdle)
      timeoutIdle = setTimeout(() => {
        setIdleAvatar(client)
      }, idleAvatarCooldown)
    }
  },

  onMessage: (client, message) => {
    if (!cooldown && avatarIsSad && !message.content.includes("/hornyjail") && !message.content.includes("/troll")) {
      setIdleAvatar(client)
      avatarIsSad = false
    }
    clearTimeout(timeoutSad)
    timeoutSad = setTimeout(() => {
      setSadAvatar(client)
    }, sadAvatarCooldown)
  },
}
