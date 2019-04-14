const fs = require('fs');
const path = require('path');

module.exports = {
    createDirectory,
    emptyDirectory,
    checkExists,
}

function createDirectory(directoryName){
    if (!fs.existsSync(directoryName)){
        fs.mkdirSync(directoryName);
    }
}

function emptyDirectory(directoryName) {
    fs.readdir(directoryName, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(directoryName, file), err => {
            if (err) throw err;
          });
        }
    });
}

function checkExists(fileOrDirectoryName) {
    return fs.existsSync(fileOrDirectoryName);
}