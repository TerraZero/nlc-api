import 'nlc-serve/types';

export default class DriverBase {

  /**
   * @returns {string}
   */
  get driver() {
    return null;
  }

  /**
   * @returns {Map<string, T_RouteDefinition>}
   */
  get routes() {
    return this._routes;
  }

  /**
   * @param {Map<string, T_RouteDefinition>} routes
   */
  setRoutes(routes) {
    this._routes = routes;
  }

  /**
   * @param {Object} data
   * @returns {import('nlc-serve/src/base/RequestBase').default}
   */
  createRequest(data) { }

  /**
   * @param {T_ExpressData|T_SocketData} data
   * @returns {Promise<import('nlc-serve/src/base/RequestBase').default>}
   */
  serve(data) {
    const request = this.createRequest(data);

    return this.execute(request)
      .then(() => request)
      .catch((e) => request.setError(e).send());
  }

  /**
   * @param {string} url
   * @returns {T_MatchDefinition[]}
   */
  getRoutes(url) {
    const matches = [];

    for (const [, definition] of this.routes) {
      const match = definition.pattern.match(url);

      if (match !== null) {
        matches.push({
          url: url,
          match: match,
          route: definition,
        });
      }
    }
    return matches;
  }

  /**
   * @param {import('nlc-serve/src/base/RequestBase').default} request
   * @returns {Promise}
   */
  execute(request) {
    const promises = [];

    for (const { match, route } of this.getRoutes(request.getUrl())) {
      const controller = new route.controller(route, request);

      request.setMatch(route, match);
      promises.push(controller[route.method].call(controller, match));
    }

    if (promises.length) {
      return Promise.all(promises).then(() => request.send(this._debug));
    }

    return this.doNonExecute(request);
  }

  /**
   * @param {import('nlc-serve/src/base/RequestBase').default} request
   * @returns {Promise}
   */
  doNonExecute(request) {
    return Promise.resolve();
  }

  /**
   * @param {string} route
   * @param {Object} values
   * @returns {string}
   */
  getUrl(route, values = {}) {
    return this.routes.get(route).pattern.stringify(values);
  }

}
