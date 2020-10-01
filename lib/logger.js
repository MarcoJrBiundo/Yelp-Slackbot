//"StAuth10065: I Marco Biundo, 000299457 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const fs = require('fs');

class Logger {
    constructor(file = './testlog.txt') {
        this.file = file;
    }

    log(line) {
        fs.appendFile(this.file, `${line}\n`, function (err) {
            if(err) throw err;
        });
    }
}

module.exports = Logger;