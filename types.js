/**
 * @typedef {Object} T_RouteDefinition
 * @property {string} route
 * @property {string} method
 * @property {import('url-pattern')} pattern
 * @property {typeof import('./src/base/ControllerBase')} controller
 */

/**
 * @typedef {Object} T_MatchDefinition
 * @property {string} url
 * @property {Object} match
 * @property {RouteDefinition} route
 */

/**
 * @typedef {Object} T_ExpressData
 * @property {import('express').Request} request
 * @property {import('express').Response} response
 * @property {import('express').NextFunction} next
 */

/**
 * @typedef {Object} T_SocketData
 * @property {import('socket.io').Socket[]} sockets all loaded sockets
 * @property {string} url the url to find the controller
 * @property {string} request the request id to find the request promise
 * @property {string} client the client id to find the socket
 * @property {Object} args the args for the request
 */
