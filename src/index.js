function addClass(el, className) {
  el.classList.add(className);
}

function removeClass(el, className) {
  el.classList.remove(className);
}

function applyModifiers(el, modifiers, className, remove) {
  const action = remove ? removeClass : addClass;

  Object.entries(modifiers).map((entry) => {
    const modifier = `${className}--${entry[0]}`;
    const value = entry[1];

    if (typeof value === 'boolean') {
      if (value) {
        action(el, modifier);
      }
    } else if (typeof value === 'string' || typeof value === 'number') {
      action(el, `${modifier}-${value}`);
    }
  });
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
  install(Vue, options) {
    const hyphenateCache = {}; // TODO: test if this has not more downsides than profits.

    /**
     * Convert the given string to kebab-case.
     *
     * @param {String} str - The to be converted string.
     *
     * @returns {String}
     */
    function hyphenate(str) {
      return hyphenateCache[str] // eslint-disable-line no-return-assign
        || (hyphenateCache[str] = str.replace(/\B([A-Z0-9])/g, '-$1').toLowerCase());
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
      let block = vnode.context.$options.name;
      let element = binding.arg;

      if (options.hyphenate) {
        block = hyphenate[block];

        if (element) {
          element = hyphenate[element];
        }
      }

      return {
        block,
        element,
        modifiers,
        className: block + (element ? `__${element}` : ''),
      };
    }

    /**
     * Adds BEM classes to the element with the directive.
     *
     * e.g.
     * input `v-bem:element.mixin="modifiers"`
     * output `class="componentName componentName__element componentName--modifier mixin"`
     */
    Vue.directive('em', {
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
          applyModifiers(el, modifiers, className);
        }

        mixins.forEach((mixin) => {
          addClass(el, mixin);
        });
      },
      update(el, binding, vnode) {
        const { modifiers, className } = getBEM(binding, vnode);
        const oldModifiers = binding.oldValue;

        if (modifiers && modifiers !== oldModifiers) {
          if (oldModifiers) {
            applyModifiers(el, oldModifiers, className, true);
          }

          applyModifiers(el, modifiers, className);
        }
      }
    });
  }
};
