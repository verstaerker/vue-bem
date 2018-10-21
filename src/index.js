const DEFAULT_OPTIONS = {
  namespace: '',
  hyphenate: {
    blockAndElement: false,
    modifier: true,
  },
  delimiters: {
    element: '__',
    modifier: '--',
    value: '-',
  }
};

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
   * @param {Object} options - The plugin options
   * @param {Object} options.hyphenate - The plugin options
   *
   */
  install(Vue, options = {}) {
    const internalOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      delimiters: {
        ...DEFAULT_OPTIONS.delimiters,
        ...options.delimiters
      }
    };
    const { delimiters, hyphenate } = internalOptions;
    const hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
    const hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
    const hyphenateCache = {};

    /**
     * Convert the given string to kebab-case.
     *
     * @param {String} str - The to be converted string.
     *
     * @returns {String}
     */
    function hyphenateString(str) {
      return hyphenateCache[str] // eslint-disable-line no-return-assign
        || (hyphenateCache[str] = str.replace(/\B([A-Z])/g, '-$1').toLowerCase());
    }

    /**
     * Create an Array of modifier classes from the given modifiers Object.
     *
     * @param {String} className - The className stump.
     * @param {Object} modifiers - An Object of `key: value` BEM modifiers.
     *
     * @returns {Array.<String>}
     */
    function getModifiers(className, modifiers) {
      return Object.entries(modifiers || {}).map((entry) => {
        const modifier = entry[0];
        const value = entry[1];
        let modifierStump = null;

        if (value) {
          switch (typeof value) { // eslint-disable-line default-case
            case 'boolean':
              modifierStump = modifier;
              break;

            case 'string':
            // Fall through

            case 'number':
              modifierStump = modifier + delimiters.value + value;
          }
        }

        return modifierStump
          ? className + delimiters.modifier + (hyphenateModifier ? hyphenateString(modifierStump) : modifierStump)
          : modifierStump;
      }).filter(Boolean);
    }

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
      let block = internalOptions.namespace + vnode.context.$options.name;
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
          getModifiers(className, modifiers).forEach((modifier) => {
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
          const modifierClasses = getModifiers(className, modifiers);

          if (oldModifiers) {
            const oldModifierClasses = getModifiers(className, oldModifiers);

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
