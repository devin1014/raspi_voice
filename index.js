const OMXPlayer = require('omxplayer');
const text2voice = require('./app/text_to_voice');

// text2voice('新诗信息科技（上海）有限公司\n天山西路567号神州智慧天地8楼D室', (err, path) => {
//     if (path) new OMXPlayer({}).start(path, (err) => {
//         console.error("omxPlayer err: " + err);
//     })
// });
//
// const voice2text = require('./app/voice_to_text');
// voice2text();

new OMXPlayer({}).start('./voice/audio_08241706.mp3', {spawnOptions: {}}, (err) => {
    console.error("omxPlayer err: " + err);
})
