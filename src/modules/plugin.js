import { DEFAULT_OPTIONS } from './shared';
import {
  hyphenateString,
  getModifiers,
  addClass,
  removeClass
} from './utils';

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
    const options = Object.assign({}, DEFAULT_OPTIONS, customOptions);
    const { hyphenate } = options;
    const hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
    const hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;

    options.delimiters = delimiters;

    Vue.prototype.$bemOptions = options;

    /**
     * Get BEM segments.
     *
     * @param {Object} binding - The Vue directive binding.
     * @param {Object} vnode - The Vue directive vnode.
     *
     * @returns {Object}
     */
    function getBEM(binding, vnode) {
      const modifiers = binding.value;
      let block = options.namespace + vnode.context.$options[options.blockSource];
      let element = binding.arg;

      if (hyphenateBlockAndElement) {
        block = hyphenateString(block);

        if (element) {
          element = hyphenateString(element);
        }
      }

      return {
        block,
        element,
        modifiers,
        className: block + (element ? delimiters.element + element : ''),
      };
    }

    /**
     * Adds BEM classes to the element with the directive.
     *
     * e.g.
     * input `v-bem:element="modifiers"`
     * output `class="componentName componentName__element componentName--modifier"`
     */
    Vue.directive('bem', {
      /**
       * Set block, element and modifier classes on element insert.
       *
       * @param {Node} el - The element with the directive.
       * @param {Object} binding - Binding information.
       * @param {Object} vnode - The virtual DOM node of the element.
       */
      inserted(el, binding, vnode) {
        const {
          block,
          element,
          modifiers,
          className
        } = getBEM(binding, vnode);

        addClass(el, element ? className : block);

        if (modifiers) {
          getModifiers(className, modifiers, options.delimiters, hyphenateModifier).forEach((modifier) => {
            addClass(el, modifier);
          });
        }
      },

      /**
       * Add/remove modifier classes on update event.
       *
       * @param {Node} el - The element with the directive.
       * @param {Object} binding - Binding information.
       * @param {Object} vnode - The virtual DOM node of the element.
       */
      update(el, binding, vnode) {
        const modifiersValue = binding.value;
        const oldModifiers = binding.oldValue;

        if (modifiersValue !== oldModifiers) {
          const { modifiers, className } = getBEM(binding, vnode);
          const modifierClasses = getModifiers(className, modifiers, options.delimiters, hyphenateModifier);

          if (oldModifiers) {
            const oldModifierClasses = getModifiers(className, oldModifiers, options.delimiters, hyphenateModifier);

            oldModifierClasses.forEach((oldModifierClass) => {
              const index = modifierClasses.indexOf(oldModifierClass);

              if (index === -1) {
                removeClass(el, oldModifierClass);
              } else {
                modifierClasses.splice(index, 1); // Value will not be removed and needs not to be added therefore.
              }
            });
          }

          modifierClasses.forEach((modifierClass) => {
            addClass(el, modifierClass);
          });
        }
      }
    });
  }
};
