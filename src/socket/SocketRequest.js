import 'nlc-serve/types';

import RequestBase from 'nlc-serve/src/base/RequestBase';

export default class SocketRequest extends RequestBase {

  /**
   * @param {T_SocketData} data
   */
  constructor(data) {
    super(data);
    this._data = data;
  }

  /**
   * @returns {import('socket.io').Socket[]}
   */
  get sockets() {
    return this._data.sockets;
  }

  /**
   * @returns {string}
   */
  get client() {
    return this._data.client;
  }

  /**
   * @returns {string}
   */
  get request() {
    return this._data.request;
  }

  /**
   * @returns {import('socket.io').Socket}
   */
  get socket() {
    return this.sockets[this.client];
  }

  /**
   * @returns {Object}
   */
  get args() {
    return this._data.args;
  }

  /**
   * @returns {string}
   */
  getUrl() {
    return this._data.url;
  }

  /**
   * @param {Object} response
   */
  doSend(response) {
    response.request = this.request;
    response.client = this.client;
    this.socket.emit('response', response);
  }

}
