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

function getBEM(binding, vnode) {
  const block = vnode.context.$options.name;
  const element = binding.arg;
  const modifiers = binding.value;

  return {
    block,
    element,
    modifiers,
    className: block + (element ? `__${element}` : ''),
  };
}

export default {
  install(Vue) {
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
