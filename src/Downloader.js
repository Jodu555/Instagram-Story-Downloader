const fetch = require('node-fetch');
const fs = require('fs');
const fm = require('./FileManager.js');

const { exit } = require('process');
const { download } = require('async-file-dl');

require('dotenv').config();

const opts = {
    headers: {
        "accept": "*/*",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-csrftoken": process.env.csrftoken,
        "x-ig-app-id": process.env.igappid,
        "cookie": process.env.cookie,
    }
};

const userID = fm.loadCacheFile();

const noStoryOBJ = {
    success: false,
    message: 'It seems that the user dont have any storys yet!',
};

const noReelOBJ = {
    success: false,
    message: 'It seems that the user dont have any reels yet!',
};

const reelOBJ = {
    success: true,
    message: 'Reels from user where downloaded!',
};

// exports.downloadImages = async(username) => {
//     const userID = await this.getUserID(username);
//     fetch("https://www.instagram.com/graphql/query/?query_hash=32b14723a678bd4628d70c1f877b94c9&variables=%7B%22id%22%3A%22" + userID + "%22%2C%22first%22%3A12%2C%22after%22%3A%22QVFCSnFlTDZEU3kwQ2VQQk1mOUdsRlNXNjc0QjVYajVXYzZtRWU3VVYyckluckx0RDVsTnBZYTZaMS1EREgwRWw3UmIxcGI3QktKVzZ5T2w3MllvOWx6Xw%3D%3D%22%7D", {
//             "headers": opts.headers,
//             "referrer": "https://www.instagram.com/",
//             "referrerPolicy": "strict-origin-when-cross-origin",
//             "body": null,
//             "method": "GET",
//             "mode": "cors"
//         }).then(res => res.json())
//         .then(async(json) => {
//             json = json.data.user.edge_owner_to_timeline_media;
//             const count = json.count;
//             const edge = json.edges[0].node;
//             const location = edge.location;

//             console.log(edge);

//             // console.log(edge);
//             // json.edges.forEach(edge => {

//             // });

//             const page_info = json.page_info;
//             console.log(page_info);
//             // if (page_info.has_next_page) {
//             //     const cursor = page_info.end_cursor;
//             // }
//         });
// }

///////////////////////////////////////////////////////////////
//////////////////////// IG Reels ////////////////////////////
/////////////////////////////////////////////////////////////

exports.downloadReels = async (username, paging, CODE) => {
    let id = 0;
    fm.createUserReelDirectory(username);
    fm.rewriteUserReelDirectory(username)
    const userID = await this.getUserID(username);
    let reels = await getReelItems(userID, '', paging);
    if (reels == null || reels.length == 0) {
        console.log('It seems that the user ' + username + ' dont have any reels yet!');
        return noStoryOBJ;
    }
    reels.forEach(async (reel) => {
        reel = reel.media;
        id++;
        if (CODE && reel.code != CODE)
            return;

        fm.createUserReelIDDirectory(username, id);
        const src = reel.video_versions[0].url.replace('https', 'http');
        const filename = `Reel ${username} ${id}.mp4`;
        const reelObj = {
            username: reel.caption.user.username,
            fullname: reel.caption.user.full_name,
            profile_picture: reel.caption.user.profile_pic_url,
            text: reel.caption.text,
            view_count: reel.view_count,
            play_count: reel.play_count,
            caption_is_edited: reel.caption_is_edited,
            created_at_ms: reel.caption.created_at * 1000,
        };
        writeReelInfo(username, id, reelObj);
        await downloadAndMoveReel(username, src, filename, id);
    });
    return reelOBJ;
};

function writeReelInfo(username, id, reelObj) {
    const filename = `Reel-Info ${username} #${id}.json`
    const path = decodeURIComponent(fm.getUserReelIDDirectory(username, id) + '/' + filename);
    fs.writeFile(path, JSON.stringify(reelObj, null, 4), (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log(filename + ' writte and saved!');
        }
    });
}

async function downloadAndMoveReel(username, src, filename, id) {
    download(src, '.', filename)
        .then(output => {
            fs.rename(output, fm.getUserReelIDDirectory(username, id) + '/' + filename, function (err) {
                if (err) {
                    console.log('ERROR: ' + err);
                    throw err;
                }
                console.log('Reel "' + filename + '" Successfully Downloaded');
            });
        }).catch(console.error);
}

async function getReelItems(userid, max_id, paging) {
    const reels = [];
    await fetch("https://i.instagram.com/api/v1/clips/user/", {
        "headers": opts.headers,
        "referrer": "https://www.instagram.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "target_user_id=" + userid + "&page_size=12&max_id=" + max_id,
        "method": "POST",
        "mode": "cors"
    }).then(res => res.json())
        .then(async (json) => {
            json.items.forEach(item => {
                reels.push(item);
            });
            if (json.paging_info.more_available && paging) {
                const newReels = await getReelItems(userid, json.paging_info.max_id);
                newReels.forEach(item => {
                    reels.push(item);
                });
            }
        });
    return reels;
}

////////////////////////////////////////////////////////////////
//////////////////////// IG Storys ////////////////////////////
//////////////////////////////////////////////////////////////

exports.donwloadStory = async (username) => {
    fm.createUserStoryDirectory(username);
    const userID = await this.getUserID(username);
    const elements = await getVideoElementsStory(username, userID);
    if (elements == null || elements.length == 0) {
        console.log('It seems that the user ' + username + ' dont have any storys yet!');
        return noStoryOBJ;
    }
    var id = 0;
    var skip = false;
    elements.forEach(async (videoElement) => {
        if (skip) {
            skip = false;
            return;
        }
        skip = false;
        id++;
        if (videoElement == null || videoElement == undefined || videoElement.src == undefined || videoElement.src == null) {
            console.log('It seems that the user ' + username + ' dont have any storys yet!');
            return noStoryOBJ;
        }
        if (videoElement.mime_type && videoElement.mime_type.includes('video/'))
            skip = true;
        const src = videoElement.src.replace('https', 'http');
        const filename = `${username} Story #${id}.mp4`;
        await downloadAndMoveStory(username, src, filename);
        return {
            success: true,
            message: 'Successfully Downloaded Story from ' + username,
        }
    });
}

async function downloadAndMoveStory(username, src, filename) {
    await download(src, '.', filename).then(async (output) => {
        fs.rename(output, fm.getUserStoryDirectory(username) + '/' + filename, function (err) {
            if (err) {
                console.log('ERROR: ' + err);
                throw err;
            }
            console.log('Story "' + filename + '" Successfully Downloaded');
        });
    });
}

async function getVideoElementsStory(username, userID) {
    const elements = [];
    // await fetch(`https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables=%7B%22reel_ids%22%3A%5B%22${userID}%22%5D%2C%22tag_names%22%3A%5B%5D%2C%22location_ids%22%3A%5B%5D%2C%22highlight_reel_ids%22%3A%5B%5D%2C%22precomposed_overlay%22%3Afalse%2C%22show_story_viewer_list%22%3Atrue%2C%22story_viewer_fetch_count%22%3A50%2C%22story_viewer_cursor%22%3A%22%22%7D`, opts)
    //     .then(res => res.json())
    //     .then(json => {
    //         try {
    //             var reels_media = json.data.reels_media;
    //             reels_media[0].items.forEach(element => {
    //                 if (element.video_resources) {
    //                     elements.push(element.video_resources[1]);
    //                 }

    //                 if (element.display_resources) {
    //                     elements.push(element.display_resources[1]);
    //                 }
    //             });
    //         } catch (error) {
    //             return null;
    //         }
    //     });

    const response = await fetch("https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=1088089078", {
        "headers": headers,
        "method": "GET"
    });

    const json = await response.json();
    json.reels_media[0].items.forEach(item => {
        delete item.url;
        delete item.video_dash_manifest;
        if (item.video_versions) {
            elements.push(item.video_versions[0]);
        } else {
            elements.push(item.image_versions2.candidates[0]);
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
            try {
                userid = json.graphql.user.id;
            } catch (error) {
                console.log('Error in loading user-id from ' + username + ' maybe the user doesnt exist!');
            }

        });

    userID[username] = userid;
    fm.updateCacheFile(userID);
    return userid;
}