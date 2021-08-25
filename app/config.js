const authUtil = require('./util/auth');
const fs = require('fs');

// 系统配置
const tts_config = {
    host: "tts-api.xfyun.cn",
    uri: "/v2/tts",
}

const iat_config = {
    host: "iat-api.xfyun.cn",
    uri: "/v2/iat",
}

// Config
function Config(host, path) {
    this.scheme = 'wss'
    this.host = host
    this.path = path
    const key = JSON.parse(fs.readFileSync('./key.json', {encoding: 'utf8'}))
    this.appid = key.appid
    this.apiKey = key.apiKey
    this.apiSecret = key.apiSecret
}

function Config(obj) {
    this.scheme = 'wss'
    this.host = obj.host
    this.path = obj.path || obj.uri
    const key = JSON.parse(fs.readFileSync('./key.json', {encoding: 'utf8'}))
    this.appid = key.appid
    this.apiKey = key.apiKey
    this.apiSecret = key.apiSecret
}

Config.prototype.getWsUrl = function () {
    const date = (new Date().toUTCString())
    const hostUrl = `${this.scheme}://${this.host}${this.path}`
    return hostUrl + "?authorization=" + authUtil.sign(this, date) + "&date=" + date + "&host=" + this.host
}

exports.Config = Config
exports.Config_Iat = new Config(iat_config)
exports.Config_Tts = new Config(tts_config)
