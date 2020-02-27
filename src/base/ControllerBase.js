import 'nlc-serve/types';

export default class ControllerBase {

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
  static getRoutes() {
    if (this._routes === undefined) {
      this._routes = this.routes;
    }
    return this._routes;
  }

  /**
   * @param {T_RouteDefinition} route
   * @param {import('nlc-serve/src/base/RequestBase').default} request
   */
  constructor(route, request) {
    this._route = route;
    this._request = request;
  }

  /**
   * @returns {T_RouteDefinition}
   */
  get route() {
    return this._route;
  }

  /**
   * @returns {import('nlc-serve/src/base/RequestBase').default}
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
