import { HYPHENATE_CACHE, TYPE_STRING } from './shared';

/**
 * Convert the given string to kebab-case.
 *
 * @param {String} str - The to be converted string.
 *
 * @returns {String}
 */
export function kebabCase(str) {
  return HYPHENATE_CACHE[str] // eslint-disable-line no-return-assign
    || (HYPHENATE_CACHE[str] = str.replace(/\B([A-Z])/g, '-$1').toLowerCase());
}

/**
 * Create an Array of modifier classes from the given modifiers Object.
 *
 * @param {String} className - The className stump.
 * @param {Object} modifiers - An Object of `key: value` BEM modifiers.
 * @param {Object} delimiters - The to be used delimiters.
 * @param {Boolean} [hyphenate=false] - Defines if hyphenated should be used on the modifiers.
 *
 * @returns {Array.<String>}
 */
export function getModifiers(className, modifiers, delimiters, hyphenate) { // eslint-disable-line max-params
  const classNameWithDelimiter = className + delimiters.modifier;

  return Object.entries(modifiers || {}).map((entry) => {
    const modifier = entry[0];
    const value = entry[1];
    let modifierStump = null;

    if (value) {
      switch (typeof value) { // eslint-disable-line default-case
        case 'boolean':
          modifierStump = modifier;
          break;

        case TYPE_STRING:
        // Fall through

        case 'number':
          modifierStump = modifier + delimiters.value + value;
      }
    }

    return modifierStump
      ? classNameWithDelimiter + (hyphenate ? kebabCase(modifierStump) : modifierStump)
      : modifierStump;
  }).filter(Boolean);
}

/**
 * Adds a class to the given DOM element.
 *
 * @param {Node} element - The to be modified element.
 * @param {String} className - The to be reoved class name.
 */
export function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Removes a class from the given DOM element.
 *
 * @param {Node} element - The to be modified element.
 * @param {String} className - The to be added class name.
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}
