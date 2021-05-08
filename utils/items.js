module.exports = client => {
  const emojis = require("./emojis.js").logibotEmojis(client)
  const items = {
    dirtPickaxe: {
      id: 0,
      name: "Pico de tierra",
      sprite: null,
      price: 1,
      description: "Piénsalo dos veces, te pueden carrear sus gusanos",
      amount: 0,
    },
    cocoaPickaxe: {
      id: 1,
      name: "Pico de cacao",
      sprite: null,
      price: 50,
      description: "100% Cacao",
      amount: 0,
    },
    goldPickaxe: {
      id: 2,
      name: "Pico de oro",
      sprite: null,
      price: 200,
      description: "Forjado en los Bastiones del Inframundo",
      amount: 0,
    },
    ironPickaxe: {
      id: 3,
      name: "Pico de hierro",
      sprite: null,
      price: 850,
      description: "El mejor amigo del minero",
      amount: 0,
    },
    diamondPickaxe: {
      id: 4,
      name: "Pico de diamante",
      sprite: null,
      price: 2000,
      description: "",
      amount: 0,
    },
    ironCluster: {
      id: 5,
      name: "Mena de hierro",
      sprite: null,
      price: null,
      description: "",
      amount: 0,
    },
    goldCluster: {
      id: 6,
      name: "Mena de oro",
      sprite: null,
      price: null,
      description: "",
      amount: 0,
    },
    diamondCluster: {
      id: 7,
      name: "Mena de diamante",
      sprite: null,
      price: null,
      description: "",
      amount: 0,
    },
    nullItem: {
      id: 8,
      name: "Nulo",
      sprite: null,
      price: null,
      description: "WIP",
      amount: 0,
    },
  }
  return items
}
