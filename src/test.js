const dotenv = require('dotenv').config();
const fetch = require('node-fetch');



async function test(params) {
    const response = await fetch("https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=1088089078", {
        "headers": {
            "accept": "*/*",
            "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-csrftoken": process.env.csrftoken,
            "x-ig-app-id": process.env.igappid,
            "cookie": process.env.cookie,
        },
        "body": null,
        "method": "GET"
    });

    const json = await response.json();


    const content = [];
    json.reels_media[0].items.forEach(item => {
        delete item.url;
        delete item.video_dash_manifest;
        if (item.video_versions) {
            console.log(item.video_versions[0]);
        } else {
            content.push(item.image_versions2.candidates[0]);
        }
    });

    // console.log(content);

}

test();
