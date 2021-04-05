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

app.get('/cache/:username', (req, res) => {
    const username = req.params.username;
    res.json({
        username: username,
        message: 'Username loaded in cache!'
    });
    downloader.getUserID(username);
    res.status(200);
});

app.get('/download/:username', async (req, res) => {
    const username = req.params.username;
    console.log('Donwloading Story of ' + username);
    var obj = await downloader.donwloadStory(username);
    console.log(obj);
    res.json(obj);
});

app.listen(9090, () => {
    console.log('Insta-Donwloader listening on 9090');
});



