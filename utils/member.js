"use strict"
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.")
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
var moment_1 = __importDefault(require("moment"))
require("module-alias/register")
var fs = require("fs")
var profileSchema = require("../schemas/profile-schema.js")
var muteSchema = require("../schemas/mute-schema.js")
var defaultAvatarURL = "https://media.minecraftforum.net/attachments/300/619/636977108000120237.png"
var messageHandler = require("@messages")
function checkSchema(guild, target) {
  return __awaiter(this, void 0, void 0, function () {
    var result
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            profileSchema.findOne({
              guildId: guild.id,
              userId: target.id,
            }),
          ]
        case 1:
          result = _a.sent()
          if (!!result) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            new profileSchema({
              name: target.username,
              guildId: guild.id,
              userId: target.id,
            }).save(),
          ]
        case 2:
          _a.sent()
          return [
            4 /*yield*/,
            profileSchema.findOne({
              guildId: guild.id,
              userId: target.id,
            }),
          ]
        case 3:
          result = _a.sent()
          _a.label = 4
        case 4:
          if (!!result.name) return [3 /*break*/, 6]
          return [
            4 /*yield*/,
            profileSchema.updateOne(
              {
                guildId: guild.id,
                userId: target.id,
              },
              {
                $set: { name: target.username },
              }
            ),
          ]
        case 5:
          _a.sent()
          _a.label = 6
        case 6:
          return [2 /*return*/, result]
      }
    })
  })
}
function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}
module.exports.getUserAvatar = function (target) {
  return target.avatarURL() ? target.avatarURL() : defaultAvatarURL
}
module.exports.getUserProfile = function (guild, target) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, checkSchema(guild, target)]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
module.exports.incUserSchema = function (guild, target, key, amount) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, checkSchema(guild, target)]
        case 1:
          _b.sent()
          return [
            4 /*yield*/,
            profileSchema.updateOne(
              {
                guildId: guild.id,
                userId: target.id,
              },
              {
                $inc: ((_a = {}), (_a["" + key] = amount), _a),
              }
            ),
          ]
        case 2:
          _b.sent()
          return [2 /*return*/]
      }
    })
  })
}
module.exports.setUserSchema = function (guild, target, key, value) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, checkSchema(guild, target)]
        case 1:
          _b.sent()
          return [
            4 /*yield*/,
            profileSchema.updateOne(
              {
                guildId: guild.id,
                userId: target.id,
              },
              {
                $set: ((_a = {}), (_a[key] = value), _a),
              }
            ),
          ]
        case 2:
          _b.sent()
          return [2 /*return*/]
      }
    })
  })
}
module.exports.checkSchemaOnJoin = function (guild, target) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, checkSchema(guild, target)]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
module.exports.checkSchemaOnStart = function (client, guildId) {
  return __awaiter(void 0, void 0, void 0, function () {
    var guild
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, client.guilds.cache.get(guildId)]
        case 1:
          guild = _a.sent()
          return [
            4 /*yield*/,
            guild.members.fetch().then(function (members) {
              return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        members.forEach(function (m) {
                          return __awaiter(void 0, void 0, void 0, function () {
                            var target
                            return __generator(this, function (_a) {
                              switch (_a.label) {
                                case 0:
                                  target = m.user
                                  return [4 /*yield*/, checkSchema(guild, target)]
                                case 1:
                                  _a.sent()
                                  return [2 /*return*/]
                              }
                            })
                          })
                        }),
                      ]
                    case 1:
                      _a.sent()
                      return [2 /*return*/]
                  }
                })
              })
            }),
          ]
        case 2:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
module.exports.getAvatarColor = function (target) {
  return __awaiter(void 0, void 0, void 0, function () {
    var getColorFromURL, url, _a, r, g, b
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ;(getColorFromURL = require("color-thief-node").getColorFromURL),
            (url = target.avatarURL() ? target.avatarURL().replace(".webp", ".png") : defaultAvatarURL)
          return [4 /*yield*/, getColorFromURL(url)]
        case 1:
          ;(_a = _b.sent()), (r = _a[0]), (g = _a[1]), (b = _a[2])
          return [2 /*return*/, rgbToHex(r, g, b)]
      }
    })
  })
}
function immuneUser(message, target) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, _b
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!(target.bot || target.id == message.guild.ownerID)) return [3 /*break*/, 2]
          _b = (_a = message.channel).send
          return [
            4 /*yield*/,
            messageHandler("immuneUser", message.member, {
              username: message.author.username,
              targetUsername: target.username,
            }),
          ]
        case 1:
          _b.apply(_a, [_c.sent()])
          return [2 /*return*/, true]
        case 2:
          return [2 /*return*/, false]
      }
    })
  })
}
function immuneRole(message, target, protectedRoles) {
  return __awaiter(this, void 0, void 0, function () {
    var targetMember, _loop_1, _i, protectedRoles_1, protectedRole, state_1
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, message.guild.members.cache.get(target.id)]
        case 1:
          targetMember = _a.sent()
          _loop_1 = function (protectedRole) {
            var role, _b, _c, _d, _e, _f
            return __generator(this, function (_g) {
              switch (_g.label) {
                case 0:
                  if (!isNaN(protectedRole)) return [3 /*break*/, 2]
                  return [
                    4 /*yield*/,
                    message.guild.roles.cache.find(function (role) {
                      return role.name.toLowerCase().includes(protectedRole.toLowerCase())
                    }),
                  ]
                case 1:
                  _b = _g.sent()
                  return [3 /*break*/, 4]
                case 2:
                  return [4 /*yield*/, message.guild.roles.cache.get(protectedRole)]
                case 3:
                  _b = _g.sent()
                  _g.label = 4
                case 4:
                  role = _b
                  if (!!role) return [3 /*break*/, 6]
                  _d = (_c = message.channel).send
                  return [
                    4 /*yield*/,
                    messageHandler("missingRole", message.member, {
                      username: message.author.username,
                    }),
                  ]
                case 5:
                  _d.apply(_c, [_g.sent()])
                  return [2 /*return*/, "continue"]
                case 6:
                  if (!targetMember.roles.cache.has(role.id)) return [3 /*break*/, 8]
                  _f = (_e = message.channel).send
                  return [
                    4 /*yield*/,
                    messageHandler("immuneRole", message.member, {
                      username: message.author.username,
                      roleName: role.name,
                    }),
                  ]
                case 7:
                  _f.apply(_e, [_g.sent()])
                  return [2 /*return*/, { value: true }]
                case 8:
                  return [2 /*return*/]
              }
            })
          }
          ;(_i = 0), (protectedRoles_1 = protectedRoles)
          _a.label = 2
        case 2:
          if (!(_i < protectedRoles_1.length)) return [3 /*break*/, 5]
          protectedRole = protectedRoles_1[_i]
          return [5 /*yield**/, _loop_1(protectedRole)]
        case 3:
          state_1 = _a.sent()
          if (typeof state_1 === "object") return [2 /*return*/, state_1.value]
          _a.label = 4
        case 4:
          _i++
          return [3 /*break*/, 2]
        case 5:
          return [2 /*return*/, false]
      }
    })
  })
}
module.exports.checkImmunity = function (message, target, protectedRoles) {
  if (protectedRoles === void 0) {
    protectedRoles = null
  }
  return __awaiter(void 0, void 0, void 0, function () {
    var immune
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          immune = false
          return [4 /*yield*/, immuneUser(message, target)]
        case 1:
          immune = _a.sent()
          if (!(protectedRoles && !immune)) return [3 /*break*/, 3]
          return [4 /*yield*/, immuneRole(message, target, protectedRoles)]
        case 2:
          immune = _a.sent()
          _a.label = 3
        case 3:
          return [2 /*return*/, immune]
      }
    })
  })
}
module.exports.getCreatedAt = function (guild, target) {
  return __awaiter(void 0, void 0, void 0, function () {
    var result, date
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            muteSchema.findOne({
              guildId: guild.id,
              userId: target.id,
              current: true,
            }),
          ]
        case 1:
          result = _a.sent()
          date = new Date(result.createdAt)
          return [2 /*return*/, date]
      }
    })
  })
}
module.exports.getJoinedAt = function (date) {
  moment_1.default.locale("es")
  return moment_1.default(date).format("llll")
}
