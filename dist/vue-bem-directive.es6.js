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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var DEFAULT_OPTIONS = {
  namespace: '',
  blockSource: 'name',
  methodName: 'bem',
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

/**
 * Convert the given string to kebab-case.
 *
 * @param {String} str - The to be converted string.
 *
 * @returns {String}
 */

function hyphenateString(str) {
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

        case 'string': // Fall through

        case 'number':
          modifierStump = modifier + delimiters.value + value;
      }
    }

    return modifierStump ? className + delimiters.modifier + (hyphenate ? hyphenateString(modifierStump) : modifierStump) : modifierStump;
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

    var internalOptions = _objectSpread({}, DEFAULT_OPTIONS, customOptions, {
      delimiters: _objectSpread({}, DEFAULT_OPTIONS.delimiters, customOptions.delimiters)
    });

    var delimiters = internalOptions.delimiters,
        hyphenate = internalOptions.hyphenate;
    var hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
    var hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
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
      var modifiers = binding.value;
      var block = internalOptions.namespace + vnode.context.$options[internalOptions.blockSource];
      var element = binding.arg;

      if (hyphenateBlockAndElement) {
        block = hyphenateString(block);

        if (element) {
          element = hyphenateString(element);
        }
      }

      return {
        block: block,
        element: element,
        modifiers: modifiers,
        className: block + (element ? delimiters.element + element : '')
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
      inserted: function inserted(el, binding, vnode) {
        var _getBEM = getBEM(binding, vnode),
            block = _getBEM.block,
            element = _getBEM.element,
            modifiers = _getBEM.modifiers,
            className = _getBEM.className;

        var mixins = Object.keys(binding.modifiers);
        addClass(el, block);

        if (element) {
          addClass(el, className);
        }

        if (modifiers) {
          getModifiers(className, modifiers, internalOptions.delimiters, hyphenateModifier).forEach(function (modifier) {
            addClass(el, modifier);
          });
        }

        mixins.forEach(function (mixin) {
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
      update: function update(el, binding, vnode) {
        var modifiersValue = binding.value;
        var oldModifiers = binding.oldValue;

        if (modifiersValue !== oldModifiers) {
          var _getBEM2 = getBEM(binding, vnode),
              modifiers = _getBEM2.modifiers,
              className = _getBEM2.className;

          var modifierClasses = getModifiers(className, modifiers, internalOptions.delimiters, hyphenateModifier);

          if (oldModifiers) {
            var oldModifierClasses = getModifiers(className, oldModifiers, internalOptions.delimiters, hyphenateModifier);
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
    });
  }
};

/**
 * Returns an Array of BEM and mixin classes based on the given parameters.
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
 * @returns {Array}
 */

function bem (_ref) {
  var blockName = _ref.blockName,
      delimiters = _ref.delimiters,
      hyphenate = _ref.hyphenate;
  var classNames = [];

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var length = args.length;
  var className = blockName;

  if (!length) {
    return [className];
  }

  for (var i = 0; i < length; i += 1) {
    var value = args[i];

    switch (_typeof(value)) {
      case 'string':
        className = blockName + delimiters.element + value;
        classNames.push(className);
        break;

      case 'object':
        // Is modifier
        if (value && value.constructor === Object) {
          classNames.push.apply(classNames, _toConsumableArray(getModifiers(className, value, delimiters, hyphenate)));
        } else if (Array.isArray(value)) {
          // Is mixin
          classNames.push.apply(classNames, _toConsumableArray(value));
        }

      // no default
    }
  }

  return classNames;
}

var mixin = {
  created: function created() {
    var _this$$bemOptions = this.$bemOptions,
        blockSource = _this$$bemOptions.blockSource,
        namespace = _this$$bemOptions.namespace,
        hyphenate = _this$$bemOptions.hyphenate,
        delimiters = _this$$bemOptions.delimiters,
        methodName = _this$$bemOptions.methodName;
    var block = this.$options[blockSource];

    if (block && typeof block === 'string') {
      var hyphenateBlockAndElement = hyphenate === true || (hyphenate || {}).blockAndElement || false;
      var hyphenateModifier = hyphenate === true || (hyphenate || {}).modifier || false;
      var namespacedBlock = (namespace || '') + block;
      var blockName = hyphenateBlockAndElement ? hyphenateString(namespacedBlock) : namespacedBlock;

      this[methodName] = function () {
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
//# sourceMappingURL=vue-bem-directive.es6.js.map
