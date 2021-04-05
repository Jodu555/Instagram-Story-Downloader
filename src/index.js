const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet')

const fm = require('./FileManager.js');
const downloader = require('./Downloader.js');

fm.createDirectory();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

app.get('/download/:username', async (req, res) => {
    const username = req.params.username;
    console.log('Donwloading Story of ' + username);
    await downloader.donwloadStory(username);
    res.json({
        message: 'Successfully Downloaded Story from ' + username,
    });
});

app.listen(9090, () => {
    console.log('Insta-Donwloader listening on 9090');
});



