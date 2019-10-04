const Serve = require('../index');

module.exports = class Controller {

  /**
   * @returns {string}
   */
  static get controller() {
    return null;
  }

  /**
   * @returns {Object<string, import('url-pattern')}
   */
  static get routes() {
    return {};
  }

  /**
   * @returns {Object<string, import('url-pattern')}
   */
  static get getRoutes() {
    if (this._routes === undefined) {
      this._routes = this.routes;
    }
    return this._routes;
  }

  /**
   * @param {Serve.RouteDefinition} route
   * @param {Serve.Request} request
   */
  constructor(route, request) {
    this._route = route;
    this._request = request;
  }

  /**
   * @returns {Serve.RouteDefinition}
   */
  get route() {
    return this._route;
  }

  /**
   * @returns {Serve.Request}
   */
  get request() {
    return this._request;
  }

  /**
   * @param {Object|Array|string} data
   * @returns {this}
   */
  write(data = {}) {
    this.request.write(this.route.route, data);
    return this;
  }

  /**
 * @param {any} data
 * @returns {this}
 */
  debug(data) {
    this.request.meta.get('debug')[this.route.route].push(data);
    return this;
  }

}
