import { DEFAULT_OPTIONS } from './shared';
import { hyphenateString, getModifiers } from './utils';

/**
 * Adds a class to the given DOM element.
 *
 * @param {Node} element - The to be modified element.
 * @param {String} className - The to be reoved class name.
 */
function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Removes a class from the given DOM element.
 *
 * @param {Node} element - The to be modified element.
 * @param {String} className - The to be added class name.
 */
function removeClass(element, className) {
  element.classList.remove(className);
}

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
    const internalOptions = {
      ...DEFAULT_OPTIONS,
      ...customOptions,
      delimiters: {
        ...DEFAULT_OPTIONS.delimiters,
        ...customOptions.delimiters
      }
    };
    const { delimiters, hyphenate } = internalOptions;
    const hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
    const hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;

    Vue.prototype.$bemOptions = internalOptions;

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
      let block = internalOptions.namespace + vnode.context.$options[internalOptions.blockSource];
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
     * input `v-bem:element.mixin="modifiers"`
     * output `class="componentName componentName__element componentName--modifier mixin"`
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
        const mixins = Object.keys(binding.modifiers);

        addClass(el, block);

        if (element) {
          addClass(el, className);
        }

        if (modifiers) {
          getModifiers(className, modifiers, internalOptions.delimiters, hyphenateModifier).forEach((modifier) => {
            addClass(el, modifier);
          });
        }

        mixins.forEach((mixin) => {
          addClass(el, mixin);
        });
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
          const modifierClasses = getModifiers(className, modifiers, internalOptions.delimiters, hyphenateModifier);

          if (oldModifiers) {
            const oldModifierClasses = getModifiers(className, oldModifiers, internalOptions.delimiters, hyphenateModifier);

            oldModifierClasses.forEach((oldModifierClass) => {
              if (!modifierClasses.includes(oldModifierClass)) {
                removeClass(el, oldModifierClass);
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
