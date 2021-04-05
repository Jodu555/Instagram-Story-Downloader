const fetch = require('node-fetch');
const download = require('video-downloader');
const fs = require('fs');

const fm = require('./FileManager.js');

const { exit } = require('process');

const opts = {
    headers: {
        "PUT" : "here",
        "YOUR": "headers / cookies",
    }

};


exports.donwloadStory = async (username) => {
    fm.createUserDirectory(username);
    const userID = await getUserID(username);

    var elements = await getVideoElements(userID);

    var id = 0;
    finalId = 0;
    elements.forEach(async (videoElement) => {
        id++;
        if (id % 2) {
            finalId++;
            var src = videoElement.src.replace('https', 'http');
            var filename = `${username} Story #${finalId}.mp4`;
            downloadAndMove(username, src, filename, id);
        }
    });
}

// async function donwloadStory(username) {
    
// }

async function downloadAndMove(username, src, filename, id) {
    await download(src, '', './').then(async (output) => {
        fs.rename(output, fm.getUserDirectory(username) + '/' + filename, function (err) {
            if (err) {
                console.log('ERROR: ' + err);
                throw err;
            }
            console.log('Story "' + filename + '" Successfully Downloaded');
        });
    });
}

async function getVideoElements(userID) {
    var elements = [];
    await fetch(`https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables=%7B%22reel_ids%22%3A%5B%22${userID}%22%5D%2C%22tag_names%22%3A%5B%5D%2C%22location_ids%22%3A%5B%5D%2C%22highlight_reel_ids%22%3A%5B%5D%2C%22precomposed_overlay%22%3Afalse%2C%22show_story_viewer_list%22%3Atrue%2C%22story_viewer_fetch_count%22%3A50%2C%22story_viewer_cursor%22%3A%22%22%7D`, opts)
        .then(res => res.json())
        .then(json => {
            var reels_media = json.data.reels_media;
            reels_media[0].items.forEach(element => {

                if (element.video_resources) {
                    elements.push(element.video_resources[1]);
                }

                if (element.display_resources) {
                    elements.push(element.display_resources[1]);
                }
            });
        });
    return elements
}

async function getUserID(username) {
    let userid = 0;
    await fetch(`https://www.instagram.com/${username}/?__a=1`, opts)
        .then(res => res.json())
        .then(json => {
            if (json.status == 'fail') {
                console.log(json);
                console.log('Failed to get User-ID: ' + username);
                if (json.spam)
                    console.log('Maybe cause by API spamming!');
                exit();
            }

            userid = json.graphql.user.id;
        });
    return userid;
}