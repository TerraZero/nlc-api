import 'nlc-serve/types';

import DriverBase from 'nlc-serve/src/base/DriverBase';
import ExpressRequest from 'nlc-serve/src/express/ExpressRequest';

export default class ExpressDriver extends DriverBase {

  get driver() {
    return 'express';
  }

  /**
   * @param {T_ExpressData} data
   * @returns {ExpressRequest}
   */
  createRequest(data) {
    return new ExpressRequest(data);
  }

  /**
   * @param {ExpressRequest} request
   * @returns {Promise}
   */
  doNonExecute(request) {
    if (request.next) {
      request.next();
    }
    return Promise.resolve();
  }

}
