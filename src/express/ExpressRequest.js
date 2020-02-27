import 'nlc-serve/types';

import Bag from 'nlc-util/src/data/Bag';

import RequestBase from 'nlc-serve/src/base/RequestBase';

export default class ExpressRequest extends RequestBase {

  /**
   * @param {T_ExpressData} data
   */
  constructor(data) {
    super(data);
    this._data = data;
    this._bags.addBag('GET', new Bag(this.request.query));
    this._bags.addBag('POST', new Bag(this.request.body));
  }

  /**
   * @returns {import('express').Request}
   */
  get request() {
    return this._data.request;
  }

  /**
   * @returns {import('express').Response}
   */
  get response() {
    return this._data.response;
  }

  /**
   * @returns {import('express').NextFunction}
   */
  get next() {
    return this._data.next;
  }

  /**
   * @returns {string}
   */
  getUrl() {
    return this.request.path;
  }

  /**
   * @param {Object} response
   */
  doSend(response) {
    this.response.json(response);
  }

}
