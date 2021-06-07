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

const animatedActivity = ["[]", "[iLogi]", "[iLogiCraft]", "[/]", "[/ip]", "[> /ip <]", "[>>> /ip <<<]"]

const getRandomActivity = () => {
  let type = Math.floor(Math.random() * (activities.length - 1)) + 1
  let activityType = activities[type]
  let activity = {
    type,
    text: activityType[Math.floor(Math.random() * activityType.length)],
  }
  return activity
}

const animated = client => {
  if (!client.user.presence.activities[0])
    return client.user.setPresence({
      activity: {
        name: animatedActivity[0],
        type: 1,
      },
      status: "online",
    })

  const index = animatedActivity.indexOf(client.user.presence.activities[0].name)

  client.user.setPresence({
    activity: {
      name: index == animatedActivity.length - 1 ? animatedActivity[0] : animatedActivity[index + 1],
      type: 1,
    },
    status: "online",
  })
}

const setActivity = (client, activity, skipCooldown) => {
  setTimeout(() => {
    setActivity(client)
  }, 60 * 60 * 1000)
  if (!activityTriggered || skipCooldown) {
    client.user.setPresence({
      activity: {
        name: "/help", //activity.text,
        type: 3, //activity.type,
      },
      status: "online",
    })
  }
}

module.exports = {
  setActivity: (client, activity = getRandomActivity(), skipCooldown = false) => {
    //setActivity(client, activity, skipCooldown)
    setInterval(() => {
      animated(client)
    }, 10000)
  },
  activityTrigger: () => {
    /*clearTimeout(activityTimeout)
    activityTriggered = true
    activityTimeout = setTimeout(() => {
      activityTriggered = false
    }, 4 * 60 * 60 * 1000)*/
  },
}
