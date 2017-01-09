'use strict';

const mongoose = require('mongoose');
const GeoJSON = require('geojson');
const jsonfile = require('jsonfile');
const Place = require('../models/place');
const database = require('../config/database');

// Connect to database.
mongoose.connect(database.url);
// Set mongoose promise to the default ES6 Promise.
mongoose.Promise = global.Promise;

Place.find({}, (err, places) => {
  let ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  let classes = ['none', 'half', 'one', 'one-half', 'two', 'two-half', 'three', 'three-half', 'four', 'four-half', 'five'];
  let features = [];
  places.forEach(place => {
    features.push({
      type: 'Feature',
      geometry: { 
        type: 'Point',
        coordinates: [place.coordinates.longitude, place.coordinates.latitude]
      },
      properties: {
        title: place.name,
        rating: place.rating,
        reviewCount: place.review_count,
        icon: {
          className: `marker ${classes[ratings.indexOf(place.rating)]}`,
          iconSize: null
        },
      },
    });
  });
  
  let json =  { type: 'FeatureCollection', features };

  jsonfile.writeFile('./places.small.geo.json', json, err => console.log(err));
}).sort({'review_count': -1}).limit(10000);
