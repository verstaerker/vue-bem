import { hyphenateString } from './utils';
import bem from './bem';

export default {
  beforeCreate() {
    if (!this.$bemOptions) {
      this.$bemOptions = {};

      throw new Error('Looks like the plugin of vue-bem is not used by Vue. Please do so or the mixin will not work!');
    }
  },
  created() {
    const {
      blockSource,
      namespace,
      hyphenate,
      delimiters,
      methodName
    } = this.$bemOptions;
    const block = this.$options[blockSource];

    if (block && typeof block === 'string') {
      const hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
      const hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
      const namespacedBlock = (namespace || '') + block;
      const blockName = hyphenateBlockAndElement ? hyphenateString(namespacedBlock) : namespacedBlock;

      this[methodName] = (...args) => bem({ blockName, delimiters, hyphenate: hyphenateModifier }, ...args);
    }
  }
};
