import { getModifiers } from './utils';

/**
 * Returns a String of BEM and mixin classes based on the given parameters.
 *
 * @param {Object} options - The internal instance options.
 * @param {String} options.blockName - The block name for the current component.
 * @param {Object} options.delimiters - The to be used delimiters.
 * @param {Boolean} [options.hyphenate=false] - Defines if hyphenated should be used on the modifiers.
 * @param {Object} args - The arguments used on the method call.
 * @param {String} [args.element] - An optional element name.
 * @param {Object} [args.modifiers] - An Object of to be applied modifiers.
 * @param {Array} [args.mixins] - An Array of to be applied mixin classes.
 *
 * @returns {String}
 */
export default function({ blockName, delimiters, hyphenate }, ...args) {
  const classNames = [];
  const length = args.length < 4 ? args.length : 3;
  let className = blockName;

  if (!length) {
    return className;
  }

  if (typeof args[0] !== 'string') {
    classNames.push(blockName);
  }

  for (let i = 0; i < length; i += 1) {
    const value = args[i];

    switch (typeof value) {
      case 'string':
        className = blockName + delimiters.element + value;

        classNames.push(className);
        break;

      case 'object': // Is modifier
        if (value && value.constructor === Object) {
          classNames.push(...getModifiers(className, value, delimiters, hyphenate));
        } else if (Array.isArray(value)) { // Is mixin
          classNames.push(...value);
        }

        // no default
    }
  }

  return classNames.join(' ');
}
