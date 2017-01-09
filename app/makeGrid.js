'use strict';

const _ = require('lodash');
const jsonfile = require('jsonfile');
const GeoJSON = require('GeoJSON');
const navi = require('./navi');

const startPoint = { latitude: 52.580728, longitude: 13.288042 };
const cols = 50;
const rows = 30;
const horizontalDistance = 400;
const verticalDistance = 600;

let horizontal = [startPoint];
let vertical = [startPoint];

_.times(cols, i => {
  let hLen = horizontal.length;
  let point = horizontal[hLen - 1];
  horizontal.push(navi.moveRight(point, horizontalDistance));

  _.times(rows, j => {
    let vLen = vertical.length;
    let vLoc = j == rows - 1 ? point : vertical[vLen - 1];
    vertical.push(navi.moveDown(vLoc, verticalDistance));
  });
});

const jsonTemplate = { Point: ['latitude', 'longitude'] };
jsonfile.writeFile('./grid.geo.json', GeoJSON.parse(vertical, jsonTemplate), err => {
  if (err) console.error(err);
});
