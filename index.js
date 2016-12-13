'use strict';

const Yelp = require('yelpv3');
const jsonfile = require('jsonfile');
const request = require('request');

// Set up access to API
const yelp = new Yelp({
  app_id: 'i2wmw0jJ7ZHwxUW-jDc_AA',
  app_secret: '6M8YAIDd8v8VAI66pCxnOFMe2Pr4qeSn1QKHgQEG63gin1Fo1NdbFiFELkIsbWC9',
});

// Options for search
const options = {
  latitude: 52.529663,
  longitude: 13.401363,
  limit: 50,
  radius: 500,
  offset: 0,
};

// Search places
search(options, data => {
  let output = geoJson(data.businesses);
  saveJson(output, `./data/${+ new Date()}.json`);
});

/**
 * Search API
 * @param {object} options - API options (https://www.yelp.com/developers/documentation/v3/business_search).
 * @param {function} callback - Called after results are ready.
 * @callback({object}) - Raw search results from API.
 */
function search(options, callback) {
  yelp.search(options)
  .then(data => callback(JSON.parse(data)))
  .catch(err => { console.error(err); });
};

/**
 * Create GeoJSON from API result.
 * @param {array} places - `businesses` returned from the API.
 * @returns {array}
 */
function geoJson(places) {
  let ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  let classes = ['none', 'half', 'one', 'one-half', 'two', 'two-half', 'three', 'three-half', 'four', 'four-half', 'five'];

  // TODO: Remove closed places (inactive)
  let geoJson = places.map(place => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [place.coordinates.longitude, place.coordinates.latitude],
    },
    properties: {
      id: place.id,
      title: place.name,
      rating: place.rating,
      reviewCount: place.review_count,
      categories: place.categories,
      icon: {
        className: `marker ${classes[ratings.indexOf(place.rating)]}`,
        html: classes[ratings.indexOf(place.rating)],
        iconSize: null
      },
    },
  }));
  return geoJson;
};

/**
 * Save JSON to file.
 * @param {object} json - JSON to be saved.
 * @param {string} location - Location of file.
 * @returns {boolean}
 */
function saveJson(json, location) {
  jsonfile.writeFile(location, json, { spaces: 2 }, function (err) {
    if (err) return false;
    return true;
  });
};
