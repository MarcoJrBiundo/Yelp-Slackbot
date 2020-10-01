//"StAuth10065: I Marco Biundo, 000299457 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const YelpAPI = require('yelp-api');
const dotenv = require('dotenv').config();

class Yelp {
    constructor() {this.api = new YelpAPI(process.env.YELP_API_KEY);}

    //  Get x nearby restaurants
    async get_nearby_restaurants_by_address(address, items = 5, radius = 10000) { 
        return this.api.query('businesses/search', [{ location: address }, {limit: items}, {radius: radius} ])
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    }
    //  Get x nearby restaurants
    async get_restaurants_by_category(address, category ,radius = 20000) { 
        return this.api.query('businesses/search', [{ location: address }, {radius: radius}, {categories: category}])
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    }
    //  Get top restaurants by address
    async get_top_restaurants_by_address(address, items, radius = 10000, sortby = "rating") { 
        return this.api.query('businesses/search', [{ location: address }, {limit: items}, {radius: radius}, {sort_by: sortby} ])
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    }
    //  Get closest restaurants by address
    async get_closest_restaurants_by_address(address, items, sortby ="distance") { 
        return this.api.query('businesses/search', [{ location: address }, {limit: items}, {sort_by: sortby} ])
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    }
    //  Get events by point (lat, lng)
    async get_events_by_point(lat, lng, items = 5, radius = 10000) { 
        return this.api.query('events', [{ latitude: lat }, {longitude: lng}, {limit: items}])
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
            return false;
        });

    }
    //  Get a restaurant by phone number
    async get_restaurant_by_phone_number(phone_number) {
        return this.api.query('businesses/search/phone', [{ phone: phone_number }])
            .then(data => {
                return data;
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    }
    //  Get closest restaurant by address and restaurant name
    async get_restaurant_reviews_by_address(address, name, sortby ="distance") { 
       return this.api.query('businesses/search', [{ location: address }, {term: name}, {sort_by: sortby} ])
       .then(data => {
        return data;
    })
    .catch(err => {
        console.log(err);
        return false;
    });


    }


    async get_reviews_by_restaurant_id(id) { 
        return this.api.query(`businesses/${id}/reviews`, )
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
            return false;
        });

    }

}

module.exports = Yelp;