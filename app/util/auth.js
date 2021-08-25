const CryptoJS = require('crypto-js')

// 签名
function sign(config, date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.path} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
}

module.exports = {
    sign
}
