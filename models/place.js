'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  review_count: Number,
  rating: Number,
  image_url: String,
  is_closed: Boolean,
  phone: String,
  name: String,
  price: String,
  coordinates: { latitude: Number, longitude: Number },
  id: { type: String, unique: true, },
  categories: [{ alias: String, title: String }],
  url: String,
  location: {
    zip_code: String,
    address1: String,
    address2: String,
    address3: String,
  },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
