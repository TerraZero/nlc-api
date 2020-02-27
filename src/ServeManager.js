import 'nlc-util/types';



export default class ServeManager {

  /**
   * @param {import('nlc/src/Core').default} core
   * @param {import('nlc-util/src/data/Bag').default} controllers
   */
  constructor(core, controllers) {
    this._core = core;
    this._controllers = controllers;

    this._routes = null;
    this._drivers = null;
  }

  /**
   * @returns {Object<Map<string, T_RouteDefinition>>}
   */
  get routes() {
    if (this._routes === null) {
      this._routes = new Map();

      for (const name in this._controllers.data) {
        /** @type {T_FactoryItem} */
        const definition = this._controllers.get(name);
        /** @type {typeof import('nlc-serve/src/base/ControllerBase').default} */
        const controller = definition.subject;
        const routes = controller.getRoutes();

        for (const method in routes) {
          this._routes.set(controller.controller + '.' + method, {
            route: controller.controller + '.' + method,
            method: method,
            pattern: routes[method],
            controller: controller,
          });
        }
      }

      this._core.container.trigger('on.serve.boot', this, this._routes);
    }
    return this._routes;
  }

  /**
   * @param {string} name
   * @returns {import('nlc-serve/src/base/DriverBase').default}
   */
  getDriver(name) {
    if (this._drivers === null) {
      this._drivers = {};
      for (const definition of this._core.container.getRelevantTags('driver', this._core.container.findTags('driver'))) {
        /** @type {import('nlc-serve/src/base/DriverBase').default} */
        const driver = this._core.service(definition.key);

        driver.setRoutes(this.routes);
        this._drivers[driver.driver] = driver;
      }
    }
    return this._drivers[name];
  }

}
