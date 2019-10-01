const Serve = require('../index');

module.exports = class Controller {

  /**
   * @returns {string}
   */
  static key() {
    return null;
  }

  /**
   * @returns {Object<string, import('url-pattern')}
   */
  static get routes() {
    return {};
  }

  static get getRoutes() {
    if (this._routes === undefined) {
      this._routes = this.routes;
    }
    return this._routes;
  }

  /**
   * @param {Serve.Request} request
   */
  constructor(request) {
    this._request = request;
  }

  /**
   * @returns {Serve.Request}
   */
  get request() {
    return this._request;
  }

}
