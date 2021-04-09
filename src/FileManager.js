
const fs = require('fs');

var currentDir = '';

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
    fs.mkdir('./storys', (err) => {
    });
    var time = new Date().toLocaleDateString('de').replace('.', '-').replace('.', '-');
    fs.mkdir("./storys/" + time, (err) => {
        if (!err) {
            console.log("Story Directory Successfully Created!")
        }
    });
    currentDir = './storys/' + time;
}

exports.createUserDirectory = (username) => {
    this.createDirectory();
    fs.mkdir(currentDir + "/" + username, (err) => {

    });
}

exports.getUserDirectory = (username) => {
    this.createDirectory();
    return currentDir + '/' + username;
}