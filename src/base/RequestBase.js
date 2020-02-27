import 'nlc-serve/types';

import Bag from 'nlc-util/src/data/Bag';
import BagCollection from 'nlc-util/src/data/BagCollection';

export default class RequestBase {

  constructor(data) {
    this._bags = new BagCollection('data');
    this._bags.addBag('data', new Bag(data));
    this._bags.addBag('args', new Bag());

    this._error = null;
    this._meta = new Map();
    this._meta.set('debug', {});
    this._write = new Map();
  }

  /**
   * @returns {BagCollection}
   */
  get bags() {
    return this._bags;
  }

  /**
   * @returns {Map<string, any>}
   */
  get meta() {
    return this._meta;
  }

  /**
   * @returns {string}
   */
  getUrl() { }

  /**
   * @param {T_RouteDefinition} route
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

    this.doSend(response);
    return this;
  }

  doSend(response) { }

  /**
   * @param {Error} error
   * @returns {this}
   */
  setError(error) {
    this._error = error;
    return this;
  }

}
