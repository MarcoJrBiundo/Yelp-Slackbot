//"StAuth10065: I Marco Biundo, 000299457 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const sqlite3 = require('sqlite3');

class Database {
    constructor(db_file) {
        this.db_file = db_file;
    }

    //  Provide access to the database for the class
    db() { 
        return new sqlite3.Database(this.db_file); 
    }

    //  Get all message from the database
    //  SELECT * FROM messages;
    async get_messages() { 
        let response_messages = [];
        return new Promise((resolve, reject) => {
            this.db().serialize(() => {
                this.db().each("SELECT * FROM messages;", (error, message) => {
                    if(!error) {
                        response_messages.push(message);
                    } else {
                        //  Provide feedback for the error
                        console.log(error);
                    }
                }, () => {
                    resolve(response_messages);
                });
            });
        });
    }

    //  Get a message from the database
    //  SELECT * FROM messages WHERE msgid = ?;
    async get_message(msgid) { 
        var return_value = false;
        return new Promise((resolve, reject) => {
            this.db().get("SELECT * FROM messages WHERE msgid = ?", [msgid], (error, row) => {
                if(!error) {
                    resolve(row);
                } else {
                    //  Provide feedback for the error
                    console.log(error);
                    resolve(false);
                }
            });
        });        
    }

    //  Add a message to the database
    //  INSERT INTO messages (status, message) VALUES (?, ?);
    async add_message(status) {
        var return_value = false;
        return new Promise((resolve, reject) => {
            this.db().run("INSERT INTO messages (status) VALUES (?);", [status], async (error) => {
                if(!error) {
                } else {
                    console.log(error);
                    resolve(false);
                }
            });
        });        
    }

    //  Update a message in the database
    //  UPDATE messages SET status = ?, message = ? WHERE msgid = ?;
    async update_message(msgid, status, message) {
        var return_value = false;
        return new Promise((resolve, reject) => {
            console.log(msgid, status, message);
            this.db().run("UPDATE messages SET status = ?, message = ? WHERE msgid = ?", [status, message, msgid], (error) => {
                if(!error) {
                    resolve(true);
                } else {
                    //  Provide feedback for the error
                    console.log(error);
                    resolve(false);
                }
            });
        });
    }

    async get_last_message_id() {
        var return_value = false;
        return new Promise((resolve, reject) => {
            this.db().get("SELECT DISTINCT msgid FROM messages ORDER BY timestamp;", [], (error, row) => {
                if(!error) {
                    resolve(row.msgid);
                } else {
                    //  Provide feedback for the error
                    console.log(error);
                    resolve(false);
                }
            });
        });
    }

    //  Delete a message from the database
    //  DELETE FROM messages WHERE msgid = ?;
    async delete_message(msgid) {
        
    }

    //  Delete all messages from the database
    //  DELETE FROM messages;
    async delete_messages() {
        var return_value = false;
        return new Promise((resolve, reject) => {
            this.db().each("DELETE FROM messages;", (error, message) => {
                if(!error) {
                    return_value = true;
                } else {
                    //  Provide feedback for the error
                    console.log(error);
                    return_value = false;
                }
            }, () => {
                resolve(return_value);
            });
        });
    }
} 

module.exports = Database;