const fs = require('fs');

var currentStoryDir = '';
var currentReelDir = '';

//Folder Structure: 
// eg. /storys/2021/04/23
// /storys/JAHR/MONAT/DAY

const directoryOptions = {
    recursive: true
};

exports.updateCacheFile = (userID) => {
    let data = JSON.stringify(userID);
    fs.writeFileSync('userCache.json', data)
};

exports.loadCacheFile = () => {
    try {
        let data = fs.readFileSync('userCache.json');
        let cache = JSON.parse(data);
        return cache;
    } catch (error) {
        return {};
    }
};

exports.createDirectory = () => {
    this.createStoryDirectory();
    this.createReelDirectory();
}

//Story based methods

exports.createStoryDirectory = () => {
    var time = new Date().toLocaleDateString('de').replace('.', '-').replace('.', '-');
    const splitter = time.split('-');
    const year = splitter[2];
    const month = splitter[1];
    const day = splitter[0];
    const dir = `./storys/${year}/${month}/${day}`
    fs.mkdir(dir, directoryOptions, (err) => {
        if (!err) {
            // console.log('Story Directory Successfully Created!')
        } else {
            console.error(err);
            console.error('Failed to create Story Directory');
        }
    });
    currentStoryDir = dir;
}

exports.createUserStoryDirectory = (username) => {
    this.createStoryDirectory();
    fs.mkdir(currentStoryDir + "/" + username, directoryOptions, (err) => {

    });
}

exports.getUserStoryDirectory = (username) => {
    this.createStoryDirectory();
    return currentStoryDir + '/' + username;
}

//Reel based methods

exports.createReelDirectory = () => {
    const dir = `./reels`
    fs.mkdir(dir, directoryOptions, (err) => {
        if (!err) {
            // console.log('Reel Directory Successfully Created!')
        } else {
            console.error(err);
            console.error('Failed to create Reel Directory');
        }
    });
    currentReelDir = dir;
}

exports.createUserReelIDDirectory = (username, ID) => {
    this.createReelDirectory();
    fs.mkdirSync(`${currentReelDir}/${username}/#${ID}`, directoryOptions, (err) => {

    });
};

exports.createUserReelDirectory = (username) => {
    this.createReelDirectory();
    fs.mkdir(currentReelDir + "/" + username, directoryOptions, (err) => {

    });
}

exports.rewriteUserReelDirectory = (username) => {
    fs.rmSync(this.getUserReelDirectory(username), directoryOptions);
}

exports.getUserReelDirectory = (username) => {
    this.createReelDirectory();
    return currentReelDir + '/' + username;
}

exports.getUserReelIDDirectory = (username, ID) => {
    this.createReelDirectory();
    return `${currentReelDir}/${username}/#${ID}`;
};