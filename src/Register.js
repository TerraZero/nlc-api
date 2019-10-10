const NLC = require('nlc');
const Glob = require('glob');
const Serve = require('../index');

module.exports = class Register {

  constructor(debug = false) {
    this._routes = null;
    this._debug = debug;
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
              this._routes.set(controller.controller + '.' + route, {
                route: controller.controller + '.' + route,
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
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<Serve.Request>}
   */
  serve(req, res, next) {
    const request = new Serve.Request(req, res, next);

    return this.execute(request)
      .then(() => request)
      .catch((e) => request.setError(e).send(this._debug));
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
        const controller = new definition.controller(definition, request);

        request.setMatch(definition, match);
        promises.push(controller[definition.method].call(controller, match));
      }
    }

    if (promises.length) {
      return Promise.all(promises).then(() => request.send(this._debug));
    }

    if (request._next) {
      request._next();
    }
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
