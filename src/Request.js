const NLC = require('nlc');

module.exports = class Request {

  /**
   *
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
   * @param {Object} match
   * @returns {this}
   */
  setMatch(match) {
    const args = this.bags.bags.get('args');

    args.clear();
    for (const name in match) {
      args.set(name, match[name]);
    }
    return this;
  }

}
