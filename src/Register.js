const NLC = require('nlc');
const Glob = require('glob');
const Serve = require('../index');

module.exports = class Register {

  constructor() {
    this._routes = null;
  }

  /**
   * @returns {Map<string, Serve.RouteDefinition>}
   */
  get routes() {
    if (this._routes === null) {
      this._routes = new Map();

      const manager = NLC.get();
      const serve = manager.config.all('serve');
      const path = manager.config.all('path');

      for (const index in serve) {
        if (!serve[index]) continue;

        if (!Array.isArray(serve[index])) {
          serve[index] = [serve[index]];
        }

        for (const pattern of serve[index]) {
          const files = Glob.sync(pattern, {
            cwd: path[index],
            absolute: true,
          });

          for (const file of files) {
            const controller = require(file);

            for (const route in controller.getRoutes) {
              this._routes.set(controller.key + '.' + route, {
                route: controller.key + '.' + route,
                method: route,
                pattern: controller.getRoutes[route],
                controller: controller,
              });
            }
          }
        }
      }

      manager.trigger('serve:routes', this, this._routes);
    }
    return this._routes;
  }

  /**
   *
   * @param {Serve.Request} request
   * @returns {Promise}
   */
  execute(request) {
    const promises = [];

    for (const [route, definition] of this.routes) {
      const match = definition.pattern.match(request.path);

      if (match !== null) {
        const controller = new definition.controller(request);

        request.setMatch(match);
        promises.push(controller[definition.method].call(controller, match));
      }
    }
    return Promise.all(promises);
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
