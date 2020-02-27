import 'nlc-serve/types';

import DriverBase from 'nlc-serve/src/base/DriverBase';
import SocketRequest from 'nlc-serve/src/socket/SocketRequest';

export default class SocketDriver extends DriverBase {

  get driver() {
    return 'socket';
  }

  /**
   * @param {T_SocketData} data
   * @returns {SocketRequest}
   */
  createRequest(data) {
    return new SocketRequest(data);
  }

}
