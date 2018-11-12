import {
  addClass,
  getModifiers,
  removeClass,
  kebabCase
} from './utils';

/**
 * Adds BEM classes to the element with the directive.
 *
 * e.g.
 * input `v-bem:element="modifiers"`
 * output `class="componentName componentName__element componentName--modifier"`
 *
 * @param {Object} options - The directive options.
 * @param {Boolean|Object} hyphenate - Defines if class elements should be converted to kebab-case.
 * @param {String} blockSource - Defines where the block name should be taken from.
 * @param {String} namespace - Adds a namespace to each block.
 * @param {Object} delimiters - An Object which contains a list of delimiter Strings which should be used to glue the class sections.
 *
 * @returns {Object}
 */
export default function({ hyphenate, blockSource, namespace, delimiters }) { // eslint-disable-line object-curly-newline
  const hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
  const hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;

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
    let block = namespace + vnode.context.$options[blockSource];
    let element = binding.arg;

    if (hyphenateBlockAndElement) {
      block = kebabCase(block);

      if (element) {
        element = kebabCase(element);
      }
    }

    return {
      block,
      element,
      modifiers,
      staticModifiers: Object.keys(binding.modifiers).length ? binding.modifiers : null,
      className: block + (element ? delimiters.element + element : ''),
    };
  }

  return {
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
        staticModifiers,
        className
      } = getBEM(binding, vnode);
      let modifierClasses = staticModifiers || {};

      addClass(el, element ? className : block);

      if (modifiers) {
        modifierClasses = Object.assign(modifierClasses, modifiers);
      }

      getModifiers(className, modifierClasses, delimiters, hyphenateModifier)
        .forEach(modifier => addClass(el, modifier));
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
        const modifierClasses = getModifiers(className, modifiers, delimiters, hyphenateModifier);

        if (oldModifiers) {
          const oldModifierClasses = getModifiers(className, oldModifiers, delimiters, hyphenateModifier);

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
  };
}
