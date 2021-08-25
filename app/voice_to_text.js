/**
 * 语音听写流式 WebAPI 接口调用示例 接口文档（必看）：https://doc.xfyun.cn/rest_api/语音听写（流式版）.html
 * webapi 听写服务参考帖子（必看）：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=38947&extra=
 * 错误码链接：https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 */
const WebSocket = require('ws')
const log = require('log4node');
const fs = require('fs')
const config = require('./config').Config_Iat

const file = "./voice/16k_10.pcm"//请填写您的音频文件路径

const STATUS = {
    START: 0,
    TRANSFORM: 1,
    END: 2
}

function convert() {
    let webSocket = new WebSocket(config.getWsUrl())

    // 连接建立完毕，读取数据进行识别
    webSocket.on('open', () => {
        log.info("连接已建立!")
        let status = undefined
        const readerStream = fs.createReadStream(file, {highWaterMark: 1280});
        readerStream.on('data', function (chunk) {
            send(webSocket, chunk, status || STATUS.START)
            status = STATUS.TRANSFORM
        });
        // 最终帧发送结束
        readerStream.on('end', function () {
            send(webSocket, "", STATUS.END)
        });
    })

    // 识别结果
    let result = []

    // 得到识别结果后进行处理，仅供参考，具体业务具体对待
    webSocket.on('message', (data, err) => {
        if (err) {
            log.error('出错了：' + err)
            return
        }
        const res = JSON.parse(data)
        if (res.code !== 0) {
            log.error('出错了：' + res.code + ', ' + res.message)
            return
        }

        let str = ""
        if (res.data.status === 2) { // res.data.status ==2 说明数据全部返回完毕，可以关闭连接，释放资源
            str += "最终识别结果"
            webSocket.close()
        } else {
            str += "中间识别结果"
        }
        result[res.data.result.sn] = res.data.result
        if (res.data.result.pgs === 'rpl') {
            res.data.result.rg.forEach(i => {
                result[i] = null
            })
            str += "【动态修正】"
        }
        str += "："
        result.forEach(i => {
            if (i != null) {
                i.ws.forEach(j => {
                    j.cw.forEach(k => {
                        str += k.w
                    })
                })
            }
        })
        console.log(str)
    })

    // 资源释放
    webSocket.on('close', () => log.info('连接已关闭!'))

    // 连接错误
    webSocket.on('error', (err) => log.error("出错了: " + err))
}

// 传输数据
function send(webSocket, data, status) {
    log.info("正在发送数据：...");
    const frame = {
        common: {app_id: config.appid},
        business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            dwa: "wpgs" // 可选参数，动态修正
        },
        data: {
            "status": status,
            "encoding": "raw",
            "format": "audio/L16;rate=16000",
            "audio": data.toString('base64')
        }
    }
    webSocket.send(JSON.stringify(frame))
}

module.exports = convert
