const sadAvatarCooldown = 1000 * 60 * 60 * 3;
const happyAvatarCooldown = 1000 * 60 * 40;
const cooldownCooldown = 1000 * 60 * 10;
var timeoutHappy;
var timeoutSad;
var timeoutCooldown;
var cooldown = false;
var avatarIsSad = false;

setHappyAvatar = (client) => {
  console.log("[!] avatar-happy loaded");
  setCooldown();
  client.user.setAvatar("./avatar-manager/images/avatar-happy.jpg");
};

setSadAvatar = (client) => {
  console.log("[!] avatar-sad loaded");
  avatarIsSad = true;
  client.user.setAvatar("./avatar-manager/images/avatar-sad.jpg");
};

setAngryAvatar = (client) => {
  console.log("[!] avatar-angry loaded");
  setCooldown();
  client.user.setAvatar("./avatar-manager/images/avatar-angry.jpg");
};

setCooldown = () => {
  clearTimeout(timeoutCooldown);
  cooldown = true;
  timeoutCooldown = setTimeout(() => {
    cooldown = false;
  }, cooldownCooldown);
};

module.exports = {
  init: (client) => {
    setCooldown();
    setTimeout(() => {
      setHappyAvatar(client);
    }, cooldownCooldown);
    timeoutSad = setTimeout(() => {
      setSadAvatar(client);
    }, sadAvatarCooldown);
  },

  angry: (client) => {
    if (!cooldown) {
      avatarIsSad = false;
      setAngryAvatar(client);
      clearTimeout(timeoutHappy);
      timeoutHappy = setTimeout(() => {
        setHappyAvatar(client);
      }, happyAvatarCooldown);
    }
  },

  onMessage: (client, message) => {
    if (!cooldown && avatarIsSad && !message.content.includes("/hornyjail")) {
      setHappyAvatar(client);
      avatarIsSad = false;
    }
    clearTimeout(timeoutSad);
    timeoutSad = setTimeout(() => {
      setSadAvatar(client);
    }, sadAvatarCooldown);
  },
};
