import { getModifiers } from './utils';
import { TYPE_STRING } from './shared';

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
 *
 * @returns {String}
 */
export default function({ blockName, delimiters, hyphenate }, ...args) {
  const modifier = args[1] || args[0];
  let classNames = [];
  let className = blockName;

  if (!args.length) {
    return className;
  }

  if (typeof args[0] !== TYPE_STRING) { // eslint-disable-line valid-typeof
    classNames.push(blockName);
  } else {
    className = blockName + delimiters.element + args[0];

    classNames.push(className);
  }

  if (modifier && typeof modifier === 'object' && modifier.constructor === Object) {
    classNames = classNames.concat(getModifiers(className, modifier, delimiters, hyphenate));
  }

  return classNames.join(' ');
}
