import URLPattern from 'url-pattern';
import ControllerBase from 'nlc-serve/src/base/ControllerBase';

export default class TestController extends ControllerBase {

  static get controller() {
    return 'test.controller';
  }

  static get routes() {
    return {
      view: new URLPattern('/api/:id'),
      entity: new URLPattern('/entity/:id'),
    };
  }

  view({ id }) {
    console.log(id);
    this.write(id);
  }

  entity({ id }) {
    console.log('entity', id);
  }

}
