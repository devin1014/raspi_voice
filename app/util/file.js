const fs = require('fs');
const log = require('log4node')

// 将文件保存在output目录
function save(name, data) {
    fs.writeFile(`./voice/${name}`, data, {flag: 'a'}, (err) => {
        if (err) {
            log.error('出错了：' + err)
        }
    })
}

module.exports = {
    save
}
