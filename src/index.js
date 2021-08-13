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

app.use((req, res, next) => {
    console.log(process.env.USE_AUTH);
    if (process.env.USE_AUTH == 'true') {
        if (req.headers.token == process.env.AUTH_TOKEN) {
            next();
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized!' });
        }
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'Instagram Downloader is working fine! 🤯👌'
    });
});

// Check what this url is for (Images etc.) Tested: anna.egb
// fetch("https://www.instagram.com/graphql/query/?query_hash=02e14f6a7812a876f7d133c9555b1151&variables=%7B%22id%22%3A%227832016953%22%2C%22first%22%3A12%7D", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
//     "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-asbd-id": "437806",
//     "x-csrftoken": "1QvFNk5Q8IDhWakU2fI2myhlejI7ZUGM",
//     "x-ig-app-id": "936619743392459",
//     "x-ig-www-claim": "hmac.AR25jUhKxWX2iQ0Mqm726eJCbNlQvwPknl3PntFTQsJ8BFrC",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "mid=XE7owQALAAHeBBhNhizRqqsumcP9; ig_did=68597950-F5F5-4213-BD64-BA017B5081CC; ds_user_id=2954377617; shbid=6663; csrftoken=1QvFNk5Q8IDhWakU2fI2myhlejI7ZUGM; sessionid=2954377617%3AeFHT2m3oOm9UzU%3A24; rur=LDC; shbts=1622657964.5181537"
//   },
//   "referrer": "https://www.instagram.com/tv/B-PAx-PHmZh/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors"
// });

app.get('/cache/:username', (req, res) => {
    const username = req.params.username;
    res.json({
        username: username,
        message: 'Username loaded in cache!'
    });
    downloader.getUserID(username);
    res.status(200);
});

app.get('/download/storys/:username', async (req, res) => {
    const username = req.params.username;
    console.log('Donwloading Story of ' + username);
    var obj = await downloader.donwloadStory(username);
    res.json(obj);
});

app.get('/download/reels/:username', async (req, res) => {
    const username = req.params.username;
    console.log('Donwloading Reels of ' + username);
    var obj = await downloader.downloadReels(username, true);
    res.json(obj);
});

const port = process.env.PORT || 1769;

app.listen(port, () => {
    console.log(`Insta-Donwloader listening on ${port}`);
});