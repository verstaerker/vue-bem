import { hyphenateString } from './utils';
import { TYPE_STRING } from './shared';
import bem from './bem';

const mixin = {
  created() {
    const {
      blockSource,
      namespace,
      hyphenate,
      delimiters,
      method
    } = this.$bemOptions || {};
    const block = this.$options[blockSource];

    if (block && typeof block === TYPE_STRING) { // eslint-disable-line valid-typeof
      const hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
      const hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
      const namespacedBlock = (namespace || '') + block;
      const blockName = hyphenateBlockAndElement ? hyphenateString(namespacedBlock) : namespacedBlock;

      this[method] = (...args) => bem({ blockName, delimiters, hyphenate: hyphenateModifier }, ...args);
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  mixin.beforeCreate = function() {
    if (!this.$bemOptions) {
      throw new Error('Looks like the plugin of vue-bem is not used by Vue. Please do so or the mixin will not work!');
    }
  };
}

export default mixin;
