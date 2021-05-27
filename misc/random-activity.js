let activityTimeout,
  activityTriggered = false
const activities = [
  // jugando
  ["esclavizar aldeanos", "PvP sin skills", "crear canales", "ser Dios", "a farmear cobble", "a raidear bastiones"],
  // escuchando
  ["pistones", "zombies gruñir", "a Siber morir", "pasos", "dispenser llenándose", "Sweden - C418"],
  // viendo
  [
    "tutoriales para copiar",
    "mucho roleplay",
    "Cheems <3",
    "a Dark construir islas",
    "genocidio de mobs",
    "composter llenándose de hierro",
    "memes a las 2am",
    "dos imbéciles ponienod Soui Soil",
  ],
]

const getRandomActivity = () => {
  let type = Math.floor(Math.random() * (activities.length - 1)) + 1
  let activityType = activities[type]
  let activity = {
    type,
    text: activityType[Math.floor(Math.random() * activityType.length)],
  }
  return activity
}

const setActivity = (client, activity, skipCooldown) => {
  setTimeout(() => {
    setActivity(client)
  }, 60 * 60 * 1000)
  if (!activityTriggered || skipCooldown) {
    client.user.setPresence({
      activity: {
        name: "v1.0", //activity.text,
        type: 3, //activity.type,
      },
      status: "online",
    })
  }
}

module.exports = {
  setActivity: (client, activity = getRandomActivity(), skipCooldown = false) => {
    setActivity(client, activity, skipCooldown)
  },
  activityTrigger: () => {
    clearTimeout(activityTimeout)
    activityTriggered = true
    activityTimeout = setTimeout(() => {
      activityTriggered = false
    }, 4 * 60 * 60 * 1000)
  },
}
