/**
 * @typedef {Object} RouteDefinition
 * @property {string} route
 * @property {string} method
 * @property {import('url-pattern')} pattern
 * @property {typeof import('./src/Controller')} controller
 */

module.exports.Request = require('./src/Request');
module.exports.Controller = require('./src/Controller');
module.exports.Register = require('./src/Register');
