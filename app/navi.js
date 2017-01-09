'use strict';

const geolib = require('geolib');

/**
 * Navigator
 * @param {object} location - Coordinates of initial point.
 * @param {int} distance - Distance to move from point.
 * @param {int} direction - Direction in degrees.
 */
const navi = (location, distance, direction) => (
  geolib.computeDestinationPoint(location, distance, direction)
);

module.exports = {
  moveUp: (l, d) => navi(l, d, 0),
  moveRight: (l, d) => navi(l, d, 90),
  moveDown: (l, d) => navi(l, d, 180),
  moveLeft: (l, d) => navi(l, d, 270),
};
