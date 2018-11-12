import { DEFAULT_OPTIONS } from './shared';
import directive from './directive';

export default {
  /**
   * Plugin install method.
   *
   * @param {Object} Vue - The Vue instance
   * @param {Object} customOptions - The plugin options
   * @param {Object} customOptions.hyphenate - The plugin options
   *
   */
  install(Vue, customOptions = { delimiters: {} }) {
    const delimiters = Object.assign({}, DEFAULT_OPTIONS.delimiters, customOptions.delimiters);
    const options = Object.assign({}, DEFAULT_OPTIONS, customOptions, { delimiters });

    Vue.prototype.$bemOptions = options;

    Vue.directive('bem', directive(options));
  }
};
