var TYPE_STRING = 'string';
var DEFAULT_OPTIONS = {
  namespace: '',
  blockSource: 'name',
  method: '$bem',
  hyphenate: {
    blockAndElement: false,
    modifier: true
  },
  delimiters: {
    element: '__',
    modifier: '--',
    value: '-'
  }
};
var HYPHENATE_CACHE = {};

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/**
 * Convert the given string to kebab-case.
 *
 * @param {String} str - The to be converted string.
 *
 * @returns {String}
 */

function kebabCase(str) {
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

function getModifiers(className, modifiers, delimiters, hyphenate) {
  // eslint-disable-line max-params
  var classNameWithDelimiter = className + delimiters.modifier;
  return Object.entries(modifiers || {}).map(function (entry) {
    var modifier = entry[0];
    var value = entry[1];
    var modifierStump = null;

    if (value) {
      switch (_typeof(value)) {
        // eslint-disable-line default-case
        case 'boolean':
          modifierStump = modifier;
          break;

        case TYPE_STRING: // Fall through

        case 'number':
          modifierStump = modifier + delimiters.value + value;
      }
    }

    return modifierStump ? classNameWithDelimiter + (hyphenate ? kebabCase(modifierStump) : modifierStump) : modifierStump;
  }).filter(Boolean);
}
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

/**
 * Adds BEM classes to the element with the directive.
 *
 * e.g.
 * input `v-bem:element="modifiers"`
 * output `class="componentName componentName__element componentName--modifier"`
 *
 * @param {Object} options - The directive options.
 * @param {Boolean|Object} options.hyphenate - Defines if class elements should be converted to kebab-case.
 * @param {String} options.blockSource - Defines where the block name should be taken from.
 * @param {String} options.namespace - Adds a namespace to each block.
 * @param {Object} options.delimiters - An Object which contains a list of delimiter Strings to glue the class sections.
 *
 * @returns {Object}
 */

function directive (_ref) {
  var hyphenate = _ref.hyphenate,
      blockSource = _ref.blockSource,
      namespace = _ref.namespace,
      delimiters = _ref.delimiters;
  // eslint-disable-line object-curly-newline
  var hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
  var hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
  /**
   * Get BEM segments.
   *
   * @param {Object} binding - The Vue directive binding.
   * @param {Object} vnode - The Vue directive vnode.
   *
   * @returns {Object}
   */

  function getBEM(binding, vnode) {
    var modifiers = binding.value;
    var block = namespace + vnode.context.$options[blockSource];
    var element = binding.arg;

    if (hyphenateBlockAndElement) {
      block = kebabCase(block);

      if (element) {
        element = kebabCase(element);
      }
    }

    return {
      block: block,
      element: element,
      modifiers: modifiers,
      staticModifiers: Object.keys(binding.modifiers).length ? binding.modifiers : null,
      className: block + (element ? delimiters.element + element : '')
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
    inserted: function inserted(el, binding, vnode) {
      var _getBEM = getBEM(binding, vnode),
          block = _getBEM.block,
          element = _getBEM.element,
          modifiers = _getBEM.modifiers,
          staticModifiers = _getBEM.staticModifiers,
          className = _getBEM.className;

      var modifierClasses = Object.assign({}, staticModifiers, modifiers);
      addClass(el, element ? className : block);
      getModifiers(className, modifierClasses, delimiters, hyphenateModifier).forEach(function (modifier) {
        return addClass(el, modifier);
      });
    },

    /**
     * Add/remove modifier classes on update event.
     *
     * @param {Node} el - The element with the directive.
     * @param {Object} binding - Binding information.
     * @param {Object} vnode - The virtual DOM node of the element.
     */
    update: function update(el, binding, vnode) {
      var modifiersValue = binding.value;
      var oldModifiers = binding.oldValue;

      if (modifiersValue !== oldModifiers) {
        var _getBEM2 = getBEM(binding, vnode),
            modifiers = _getBEM2.modifiers,
            className = _getBEM2.className;

        var modifierClasses = getModifiers(className, modifiers, delimiters, hyphenateModifier);

        if (oldModifiers) {
          var oldModifierClasses = getModifiers(className, oldModifiers, delimiters, hyphenateModifier);
          oldModifierClasses.forEach(function (oldModifierClass) {
            var index = modifierClasses.indexOf(oldModifierClass);

            if (index === -1) {
              removeClass(el, oldModifierClass);
            } else {
              modifierClasses.splice(index, 1); // Value will not be removed and needs not to be added therefore.
            }
          });
        }

        modifierClasses.forEach(function (modifierClass) {
          addClass(el, modifierClass);
        });
      }
    }
  };
}

var plugin = {
  /**
   * Plugin install method.
   *
   * @param {Object} Vue - The Vue instance
   * @param {Object} customOptions - The plugin options
   * @param {Object} customOptions.hyphenate - The plugin options
   *
   */
  install: function install(Vue) {
    var customOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      delimiters: {}
    };
    var delimiters = Object.assign({}, DEFAULT_OPTIONS.delimiters, customOptions.delimiters);
    var options = Object.assign({}, DEFAULT_OPTIONS, customOptions, {
      delimiters: delimiters
    });
    Vue.prototype.$bemOptions = options;
    Vue.directive('bem', directive(options));
  }
};

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

function bem (_ref) {
  var blockName = _ref.blockName,
      delimiters = _ref.delimiters,
      hyphenate = _ref.hyphenate;
  var modifier = (arguments.length <= 2 ? undefined : arguments[2]) || (arguments.length <= 1 ? undefined : arguments[1]);
  var classNames = [];
  var className = blockName;

  if (!(arguments.length <= 1 ? 0 : arguments.length - 1)) {
    return className;
  }

  if (_typeof(arguments.length <= 1 ? undefined : arguments[1]) !== TYPE_STRING) {
    // eslint-disable-line valid-typeof
    classNames.push(blockName);
  } else {
    className = blockName + delimiters.element + (arguments.length <= 1 ? undefined : arguments[1]);
    classNames.push(className);
  }

  if (modifier && _typeof(modifier) === 'object' && modifier.constructor === Object) {
    classNames = classNames.concat(getModifiers(className, modifier, delimiters, hyphenate));
  }

  return classNames.join(' ');
}

var mixin = {
  created: function created() {
    var _ref = this.$bemOptions || {},
        blockSource = _ref.blockSource,
        namespace = _ref.namespace,
        hyphenate = _ref.hyphenate,
        delimiters = _ref.delimiters,
        method = _ref.method;

    var block = this.$options[blockSource];

    if (block && _typeof(block) === TYPE_STRING) {
      // eslint-disable-line valid-typeof
      var hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
      var hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
      var namespacedBlock = (namespace || '') + block;
      var blockName = hyphenateBlockAndElement ? kebabCase(namespacedBlock) : namespacedBlock;

      this[method] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return bem.apply(void 0, [{
          blockName: blockName,
          delimiters: delimiters,
          hyphenate: hyphenateModifier
        }].concat(args));
      };
    }
  }
};

export default plugin;
export { mixin as bemMixin };
//# sourceMappingURL=vue-bem.esm.js.map
