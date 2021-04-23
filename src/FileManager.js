
const fs = require('fs');

var currentDir = '';

//Folder Structure: 
// eg. /storys/2021/04/23
// /storys/JAHR/MONAT/DAY

const createDirectoryOptions = {
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
    var time = new Date().toLocaleDateString('de').replace('.', '-').replace('.', '-');
    const splitter = time.split('-');
    const year = splitter[2];
    const month = splitter[1];
    const day = splitter[0];
    const dir = `./storys/${year}/${month}/${day}`
    fs.mkdir(dir, createDirectoryOptions, (err) => {
        if (!err) {
            console.log('Story Directory Successfully Created!')
        } else {
            console.error(err);
            console.error('Failed to create Story Directory');
        }
    });
    currentDir = dir;
}

exports.createUserDirectory = (username) => {
    this.createDirectory();
    fs.mkdir(currentDir + "/" + username, createDirectoryOptions, (err) => {

    });
}

exports.getUserDirectory = (username) => {
    this.createDirectory();
    return currentDir + '/' + username;
}