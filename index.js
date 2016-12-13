'use strict';

const Yelp = require('yelpv3');
const mongoose = require('mongoose');
const database = require('./config/database');
const Place = require('./models/place');
const credentials = require('./config/credentials');

// Connect to database.
mongoose.connect(database.url);
// Set mongoose promise to the default ES6 Promise.
mongoose.Promise = global.Promise;

// Set up access to API
const yelp = new Yelp({
  app_id: credentials.app_id,
  app_secret: credentials.app_secret,
});

// Set default options. 
const options = {
  latitude: 52.522688,
  longitude: 13.402251,
  limit: 50, radius: 200,
  offset: 0,
};

// Search places
search(options, () => {
  console.log('We got the data!');
});

/**
 * Search API
 * @param {object} options - API options (http://bit.ly/2gy1fmx).
 * @param {function} callback - Called after results are ready.
 * @callback - Fired once done.
 */
function search(options, callback) {
  yelp.search(options)
  .then(data => {
    // Parse data.
    data = JSON.parse(data);

    // Set variables to work with.
    let total = data.total;
    let offset = options.offset;
    let newOffset = offset + 50;
    let stillLeft = total - newOffset;
    console.log(`[SUCCESS] Received data starting from ${offset} of ${total}.`);

    // Save data to database.
    savePlacesToDatabase(data.businesses);

    // Check if another request is in order.
    if (newOffset < total) {
      console.log(`[INFO] There are still ${stillLeft} places left.`);
      // Set new offset for next request.
      options.offset = newOffset;
      search(options, callback);
    } else {
      callback();
    }
  })
  .catch(err => { console.error(err); });
};

/**
 * Save places to Database.
 * @param {array} places - All places to be saved.
 * @callback - Fired once saving is done.
 */
function savePlacesToDatabase(places, callback) {
  places.map(placeData => {
    let place = new Place(placeData);
    place.save();
  });
  if (callback) callback();
  console.log(`[SUCCESS] Saved data from request to database.`);
}
