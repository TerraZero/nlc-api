const NLC = require('nlc');

module.exports = class Request {

  /**
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   */
  constructor(request, response, next) {
    this._request = request;
    this._response = response;
    this._next = next;

    this._bags = new NLC.sys.BagCollection('data');
    this._bags.addBag('data', new NLC.sys.Bag());
    this._bags.addBag('args', new NLC.sys.Bag());
    this._bags.addBag('GET', new NLC.sys.Bag(request.query));
    this._bags.addBag('POST', new NLC.sys.Bag(request.body));

    this._error = null;
    this._meta = new Map();
    this._meta.set('debug', {});
    this._write = new Map();
  }

  /**
   * @returns {import('express').Request}
   */
  get request() {
    return this._request;
  }

  /**
   * @returns {import('express').Response}
   */
  get response() {
    return this._response;
  }

  /**
   * @returns {NLC.sys.BagCollection}
   */
  get bags() {
    return this._bags;
  }

  /**
   * @returns {string}
   */
  get path() {
    return this.request.path;
  }

  /**
   * @returns {Map<string, any>}
   */
  get meta() {
    return this._meta;
  }

  /**
   * @returns {NLC.sys.Bag}
   */
  get args() {
    return this.bags.get('args');
  }

  /**
   * @returns {NLC.sys.Bag}
   */
  get GET() {
    return this.bags.get('GET');
  }

  /**
   * @returns {NLC.sys.Bag}
   */
  get POST() {
    return this.bags.get('POST');
  }

  /**
   * @param {import('../index').RouteDefinition} route
   * @param {Object} match
   * @returns {this}
   */
  setMatch(route, match) {
    const args = this.bags.bags.get('args');

    args.clear();
    for (const name in match) {
      args.set(name, match[name]);
    }
    this.meta.get('debug')[route.route] = [];
    return this;
  }

  /**
   * @param {string} name
   * @param {any} data
   */
  write(name, data = {}) {
    if (!this._write.has(name)) {
      this._write.set(name, []);
    }
    this._write.get(name).push(data);
    return this;
  }

  /**
   * @param {boolean} debug
   * @returns {this}
   */
  send(debug = false) {
    const response = {
      code: 200,
      data: [],
    };

    if (this._error !== null) {
      response.code = 500;
      response.error = {};
      if (debug) {
        for (const key of Object.getOwnPropertyNames(this._error)) {
          response.error[key] = this._error[key];
        }
      } else {
        response.error.message = this._error.message;
      }
    }

    for (const [name, value] of this.meta) {
      if (name === 'debug' && !debug) continue;
      response[name] = value;
    }

    for (const [route, output] of this._write) {
      for (const value of output) {
        response.data.push(value);
      }
    }

    this.response.json(response);
    return this;
  }

  /**
   * @param {Error} error
   * @returns {this}
   */
  setError(error) {
    this._error = error;
    return this;
  }

}
