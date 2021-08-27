// const OMXPlayer = require('omxplayer');
// const text2voice = require('./app/text_to_voice');
// text2voice('新诗信息科技（上海）有限公司\n天山西路567号神州智慧天地8楼D室', (err, path) => {
//     if (path) new OMXPlayer({}).start(path, (err) => {
//         console.error("omxPlayer err: " + err);
//     })
// });
//
// const voice2text = require('./app/voice_to_text');
// voice2text();

// new OMXPlayer({}).start(__dirname + '/sample/audio.mp3', {spawnOptions: {}}, (err) => {
//     console.error("omxPlayer err: " + err);
// })


// const {exec} = require('child_process');
//
// exec('rec test.wav', (err, stdout, stderr) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('success')
//         // console.log(`stdout: ${stdout}`);
//         // console.log(`stderr: ${stderr}`);
//     }
// })

const recorder = require('node-record-lpcm16');
const fs = require('fs');
const file = fs.createWriteStream('voice/test.wav', {encoding: 'binary'});

const recording = recorder.record({sampleRate: 44100});
recording.stream().pipe(file);

setTimeout(() => {
    recording.stop();
}, 3000);
