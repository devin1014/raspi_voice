/*
 * 在线语音合成 WebAPI 接口调用示例 接口文档（必看）：https://www.xfyun.cn/doc/tts/online_tts/API.html
 * 错误码链接：https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 */
const WebSocket = require('ws')
const config = require('./config').Config_Tts;
const log = require('log4node');
const fs = require('fs');

/**
 * @description: 将文本信息批量转换为语音文件
 * @return:
 */
function convert(text, callback) {
    let webSocket = new WebSocket(config.getWsUrl())

    // 连接建立完毕，读取数据进行识别
    webSocket.on('open', () => {
        log.info("连接已建立!")
        // 发送文本请求合成
        send(text)
    })

    // 得到结果后进行处理，仅供参考，具体业务具体对待
    webSocket.on('message', (data, err) => {
        if (err) {
            log.error('出错了：' + err)
            return
        }
        let res = JSON.parse(data)
        if (res.code !== 0) {
            log.error('出错了：' + res.code + ', ' + res.message)
            webSocket.close()
            return
        }
        const timeStr = getDateMMddHHmm();
        // 将返回内容写入音频文件
        const audioBuf = Buffer.from(res.data.audio, 'base64')
        log.info('正在接收数据：... ' + audioBuf.byteLength + ' byte');
        const audioFile = process.cwd() + '/voice/audio_' + timeStr + ".mp3";
        save(audioFile, audioBuf);
        // 完成
        if (res.code === 0 && res.data.status === 2) {
            log.info('保存文件：' + audioFile);
            const txtFile = process.cwd() + '/voice/data_' + timeStr + ".txt";
            log.info('保存文件：' + txtFile);
            save(txtFile, text, (err) => {
                if (err) callback(err)
                else callback(null, audioFile)
            })
            webSocket.close()
        }
    })

    // 资源释放
    webSocket.on('close', () => log.info('连接已关闭!'))

    // 连接错误
    webSocket.on('error', (err) => log.error("出错了: " + err))

    // 传输数据
    function send(text) {
        log.info("正在发送数据：\n```\n" + text + '\n```');
        const frame = {
            "common": {"app_id": config.appid},
            "business": {
                "aue": "lame",
                "sfl": 1,
                "auf": "audio/L16;rate=16000",
                "vcn": "xiaoyan",
                "tte": "UTF8",
                "speed": 50
            },
            "data": {
                "status": 2,
                "text": Buffer.from(text).toString('base64')
            }
        }
        webSocket.send(JSON.stringify(frame))
    }
}

function getDateMMddHHmm() {
    const date = new Date();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const min = ("0" + date.getMinutes()).slice(-2);
    return month + day + hour + min;
}

// 将文件保存在output目录
function save(file, data, callback) {
    fs.writeFile(file, data, {flag: 'a'}, (err) => {
        if (err) {
            log.error('出错了：' + err)
        }
        if (callback) callback(err)
    })
}

module.exports = convert
