
const fs = require('fs');

var currentDir = '';
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
    fs.mkdir(currentDir + "/" + username, (err) => {

    });
}

exports.getUserDirectory = (username) => {
    return currentDir + '/' + username;
}