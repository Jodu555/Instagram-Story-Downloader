const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const fm = require('./FileManager.js');
const downloader = require('./Downloader.js');

fm.createDirectory();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.json({
        message: 'Instagram Downloader is working fine! 🤯👌'
    });
});

app.get('/cache/:username', (req, res) => {
    const username = req.params.username;
    res.json({
        username: username,
        message: 'Username loaded in cache!'
    });
    downloader.getUserID(username);
    res.status(200);
});

app.get('/download/storys/:username', async(req, res) => {
    const username = req.params.username;
    console.log('Donwloading Story of ' + username);
    var obj = await downloader.donwloadStory(username);
    res.json(obj);
});

app.get('/download/reels/:username', async(req, res) => {
    const username = req.params.username;
    console.log('Donwloading Reels of ' + username);
    var obj = await downloader.downloadReels(username, true);
    res.json(obj);
});

const port = process.env.PORT || 1769;

app.listen(port, () => {
    console.log(`Insta-Donwloader listening on ${port}`);

    downloader.downloadReels('alexasearth');
    // downloader.donwloadStory('timjacken');

});