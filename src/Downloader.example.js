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

const userID = fm.loadCacheFile();

exports.donwloadStory = async (username) => {
    fm.createUserDirectory(username);
    const userID = await this.getUserID(username);
    const elements = await getVideoElements(username, userID);
    if(elements == null || elements.length == 0) {
        console.log('It seems that the user ' + username + ' dont have any storys yet!');
        return {
            success: false,
            message: 'It seems that the user ' + username + ' dont have any storys yet!',
        }
    }
    var id = 0;
    finalId = 0;
    elements.forEach(async (videoElement) => {
        id++;
        if (id % 2) {
            finalId++;
            var src = videoElement.src.replace('https', 'http');
            var filename = `${username} Story #${finalId}.mp4`;
            await downloadAndMove(username, src, filename, id);
            return { 
                success: true,
                message: 'Successfully Downloaded Story from ' + username,
             }
        }
    });
}

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

async function getVideoElements(username, userID) {
    var elements = [];
    await fetch(`https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables=%7B%22reel_ids%22%3A%5B%22${userID}%22%5D%2C%22tag_names%22%3A%5B%5D%2C%22location_ids%22%3A%5B%5D%2C%22highlight_reel_ids%22%3A%5B%5D%2C%22precomposed_overlay%22%3Afalse%2C%22show_story_viewer_list%22%3Atrue%2C%22story_viewer_fetch_count%22%3A50%2C%22story_viewer_cursor%22%3A%22%22%7D`, opts)
        .then(res => res.json())
        .then(json => {
            try {
                var reels_media = json.data.reels_media;
                reels_media[0].items.forEach(element => {

                    if (element.video_resources) {
                        elements.push(element.video_resources[1]);
                    }

                    if (element.display_resources) {
                        elements.push(element.display_resources[1]);
                    }
                });
            } catch (error) {
                return null;
            }
        });
    return elements
}

exports.getUserID = async (username) => {
    let userid = 0;
    if (userID[username]) {
        console.log('User-ID of ' + username + " have already been cached!");
        return userID[username];
    }
    await fetch(`https://www.instagram.com/${username}/?__a=1`, opts)
        .then(res => res.json())
        .then(json => {
            if (json.status == 'fail') {
                console.log('Failed to get User-ID: ' + username);
                if (json.spam)
                    console.log('Maybe cause by API spamming!');
                exit();
            }

            userid = json.graphql.user.id;
        });

    userID[username] = userid;
    fm.updateCacheFile(userID);
    return userid;
}