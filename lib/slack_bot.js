//"StAuth10065: I Marco Biundo, 000299457 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const Database = require('./database.js');
const db = new Database('./api.db');
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
    started() {this.ready = true;}

    // Event callback for Slack API 'message' event
    messaged(data) {
        let sb = this;

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
                                let slackBotOutput = `No nearby restaurants can be found `;
                                this.yelp.get_nearby_restaurants_by_address(location)
                                .then(data => {
                                    if(data) {
                                         let returned_data = JSON.parse(data);
                                         slackBotOutput = "These 5 restuarants are in your area \n"
                                         for( var x = 0; x < returned_data.businesses.length; x++){
                                            slackBotOutput = slackBotOutput + "\n " + returned_data.businesses[x].name + "\n Address: " + returned_data.businesses[x].location.address1 + "\n \n"
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

                                if(lat.includes('S')){ lat = -parseFloat(lat);}
                                else{ lat = parseFloat(lat);}

                                if(lng.includes('W')){ lng = -parseFloat(lng);}
                                else{ lng = parseFloat(lng);}
                                
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
                                let location1 = "";
                                let itemLimit = message_segments[1];
                                for ( var x = 2; x < message_segments.length; x++){
                                    location1 = location1 + " " + message_segments[x]
                                } 
                                location1 = location1.trim()
                                let slackBotOutput2 = `No nearby restaurants can be found`;
                                this.yelp.get_top_restaurants_by_address(location1, itemLimit)
                                .then(data => {
                                    if(data) {
                                         let returned_data = JSON.parse(data);
                                         
                                         slackBotOutput2 = `These ${itemLimit} restuarants are in your area`
                                         for( var x = 0; x < returned_data.businesses.length; x++){
                                            slackBotOutput2 = slackBotOutput2 + "\n Name: " + returned_data.businesses[x].name + "\n Address: " + returned_data.businesses[x].location.address1 + "\n \n"
                                         }
                                    }
                                    sb.post_to_channel("general", slackBotOutput2);
                                });
                                break; 
                            case "closest":
                                let location2 = "";
                                let itemLimit2 = message_segments[1];
                                for ( var x = 2; x < message_segments.length; x++){
                                    location2 = location2 + " " + message_segments[x]
                                } 
                                location2 = location2.trim()
                                let slackBotOutput3 = `No nearby restaurants can be found`;
                                this.yelp.get_closest_restaurants_by_address(location2, itemLimit2)
                                .then(data => {
                                    if(data) {
                                        let returned_data = JSON.parse(data);                                  
                                        slackBotOutput3 = `These ${itemLimit2} restuarants are in your area \n`
                                        for( var x = 0; x < returned_data.businesses.length; x++){
                                            slackBotOutput3 = slackBotOutput3 + "\n Name: " + returned_data.businesses[x].name + "\n Address: " + returned_data.businesses[x].location.address1 + "\n \n"
                                        }
                                    }
                                    sb.post_to_channel("general", slackBotOutput3);
                                });    
                                break;
                            case "findme":
                                let location3 = "";
                                let category = message_segments[1];
                                for ( var x = 2; x < message_segments.length; x++){
                                    location3 = location3 + " " + message_segments[x]
                                } 
                                location3 = location3.trim()
                                let slackBotOutput4 = `No ${category} restaurants can be found`;
                                this.yelp.get_restaurants_by_category(location3, category)
                                .then(data => {
                                    if(data) {
                                        let returned_data = JSON.parse(data);
                                        slackBotOutput4 = `This ${category} establishment is in your area \n`
                                        slackBotOutput4 = slackBotOutput4 + "\n Name: " + returned_data.businesses[0].name + "\n Address: " + returned_data.businesses[0].location.address1 +  "\n Rating: " + returned_data.businesses[0].rating +"\n \n";
                                    }
                                    sb.post_to_channel("general", slackBotOutput4);
                                });  



                                break;
                            case "reviews":
                                let location4 = "";
                                let name = ""
                                let splittingLocation = ""

                                for ( var x = 1; x < message_segments.length; x++){
                                    if(!isNaN(message_segments[x])){
                                        splittingLocation = x;     
                                    }
                                } 
                                console.log(splittingLocation)

                                for ( var x = 1; x < splittingLocation; x++){
                                    name = name + " " + message_segments[x]
                                } 
                                name = name.trim()

                                for ( var x = splittingLocation; x < message_segments.length; x++){
                                    location4 = location4 + " " + message_segments[x]
                                } 

                                location4 = location4.trim()

                                let slackBotOutput5 = `Restaurant name can not be found`;
                                let id = ""
                                this.yelp.get_restaurant_reviews_by_address(location4, name)
                                .then(data => {
                                    if(data) {
                                        let returned_data = JSON.parse(data);     
                                        id = returned_data.businesses[0].id;                             
                                    }
                                    this.yelp.get_reviews_by_restaurant_id(id)
                                    .then(data =>{
                                        if(data) {
                                            let returned_data1 = JSON.parse(data); 
                                            slackBotOutput5 = `Reviews for the closeset ${name} in your area \n`
                                            for( var x = 0; x < returned_data1.reviews.length; x++){
                                               slackBotOutput5 = slackBotOutput5 + "\n Review: " + returned_data1.reviews[x].text + "\n Reviewer Name: " + returned_data1.reviews[x].user.name  + "\n Rating: " + returned_data1.reviews[x].rating + "\n Review Url: " + returned_data1.reviews[x].url + "\n \n"
                                            }
                                        }
                                    sb.post_to_channel("general", slackBotOutput5);
                                    });
                                });
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
                                                formatted_message = "I think I found what you're looking for: \n" +"\n" + returned_data.businesses[0].name + "\n " + returned_data.businesses[0].location.address1 + "\n " + returned_data.businesses[0].location.city + "\n " + returned_data.businesses[0].phone
                                            }
                                        }
                                        sb.post_to_channel("general", formatted_message);
                                    });
                                break;
                            case "status":
                                let status = "";
                                for ( var x = 1; x < message_segments.length; x++){
                                    status = status + " " + message_segments[x]
                                } 
                                status = status.trim()
                                console.log(status)
                                let messages = db.add_message(status);
                                sb.post_to_channel("general", "Status has been written to database");

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