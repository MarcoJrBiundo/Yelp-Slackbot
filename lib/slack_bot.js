const Bot = require('slackbots');
const Yelp = require('./yelp.js');
const dotenv = require('dotenv').config();

class SlackBot {
    constructor(handle = 'yelphelp') {
        this.handle = handle;
        this.ready = false;
        this.yelp = new Yelp();

        this.settings = {
            token: process.env.SLACK_TOKEN,
            name: this.handle
        }

        this.instance = new Bot(this.settings);

        this.instance.on('start', this.started.bind(this));
        this.instance.on('message', this.messaged.bind(this));
    }

    // Event callback for Slack API 'start' event
    started() {
        this.ready = true;
        console.log("SlackBot is ready.");
    }

    // Event callback for Slack API 'message' event
    messaged(data) {
        let sb = this; // Create a reference to "this" for later

        // Check which type of data we are receiving
        switch(data.type) {
            case "message":
                let user_id_from = data.user;
                let message_segments = data.text.split(' ');
                let command = message_segments[0].toLowerCase(); 
                let args = message_segments[1].split(' ') || []; 
                let user = this.get_user_by_id(user_id_from)

                    .then((user) => {
                        if(!user) return false; 
                        // nearby, events, top, closest, findme, reviews, searchbyphone, statusupdate
                        switch(command) {
                            case "nearby":
                                let location = "";
                                for ( var x = 1; x < message_segments.length; x++){
                                    location = location + " " + message_segments[x]
                                } 
                                location = location.trim()
                                let slackBotOutput = `No restaurant found near that address that phone number`;
                                this.yelp.get_nearby_restaurants_by_address(location)
                                .then(data => {
                                    if(data) {
                                         let returned_data = JSON.parse(data);
                                         slackBotOutput = "These 5 restuarants are in your area"
                                         for( var x = 0; x < returned_data.businesses.length; x++){
                                            slackBotOutput = slackBotOutput + "\n " + returned_data.businesses[x].name
                                         }
                                    }
                                    sb.post_to_channel("general", slackBotOutput);
                                });
                                break;
                            case "events":


                                let lat = ""
                                let lng = ""

                                if(message_segments[1].includes('N') || message_segments[1].includes('S')){
                                    lat = message_segments[1]
                                    lng = message_segments[2] 
                                }else{
                                    lat = message_segments[2]
                                    lng = message_segments[1] 
                                }
                                if(lat.includes('S')){
                                    lat = -parseFloat(lat);
                                }else{
                                    lat = parseFloat(lat);

                                }

                                if(lng.includes('W')){
                                    lng = -parseFloat(lng);
                                }else{
                                    lng = parseFloat(lng);
                                }
                                
                                let slackBotOutput1 = `No close by events can be found`;
                                this.yelp.get_events_by_point(lat, lng)
                                .then(data => {
                                    if(data) {
                                        let returned_data = JSON.parse(data);
                                        slackBotOutput1 = "These 5 events are in your area \n"
                                        for( var x = 0; x < returned_data.events.length; x++){
                                           slackBotOutput1 = slackBotOutput1 + "\n Name: " + returned_data.events[x].name + "\n Address: " + returned_data.events[x].location.address1 + "\n Description: " + returned_data.events[x].description + "\n \n"
                                        }
                                   }
                                   sb.post_to_channel("general", slackBotOutput1);
                                    
                                     });
                         
                                break;
                            case "top":
                                break; 
                            case "closest":
                                break;
                            case "findme":
                                break;
                            case "reviews":
                                break;
                            case "searchbyphone": 
                                let phone_number = args[0]; // Get phone number
                                let formatted_message = `No restaurant found using that phone number`;
                                // Use yelp.js to respond to the user's request:
                                this.yelp.get_restaurant_by_phone_number(phone_number)
                                    .then(data => {
                                        if(data) {
                                            let returned_data = JSON.parse(data);
                                            if(returned_data.businesses[0]) {
                                                let restaurant = returned_data.businesses[0];
                                                formatted_message = `
                                                *I think I found what you're looking for:*
                                                > ${restaurant['name']}
                                                > ${restaurant['location']['address1']}, ${restaurant['location']['city']}
                                                > ${restaurant['phone']}`;
                                            }
                                        }
                                        sb.post_to_channel("general", formatted_message);
                                    });
                                break;
                            case "statusupdate":
                                break;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return false;});
                break;
        }
    }

    // Allows for posting to a specific channel
    post_to_channel(channel, message) {
        if(this.ready)
            this.instance.postMessageToChannel(channel, message);
    }

    // Allows for posting to a specific user
    post_to_user(username, message) {
        if(this.ready)
            this.instance.postMessageToUser(username, message);
    }

    // Get user information by UserID, from Slack API
    async get_user_by_id(user_id) {
        if(this.ready) {
            // https://npmdoc.github.io/node-npmdoc-slackbots/build/apidoc.html
            return this.instance.getUserById(user_id)
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    return false;
                });
        } else {
            return false
        }
    }
}

module.exports = SlackBot;