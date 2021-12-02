const path = require('path');
const builder = require('electron-builder');

builder
    .build({
        projectDir: path.resolve(__dirname),

        win: ['nsis', 'portable'], // nsis . portable
        config: {
            appId: 'com.example.app',
            productName: 'AudioClock',
            directories: {
                output: 'build/win',
            },
            win: {
                icon: path.resolve(__dirname, 'clock.ico'),
            },
        },
    })
    .then(
        (data) => console.log(data),
        (err) => console.error(err)
    );
