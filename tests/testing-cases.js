/* eslint-disable quote-props */
export const block = 'BlockName';
export const element = 'ElementName';
export const directive = 'v-bem';
export const mixinName = 'MixinName';
export const namespace = 'namespace-';
export const delimiters = {
  element: '==',
  modifier: '++',
  value: '~',
};

export const component = {
  name: 'TestComponent',
  template: '<div>Content of test Component</div>'
};

export const elementClassName = component.name + delimiters.element + element;

export const hyphenateStringCases = {
  'has-focus': 'has-focus',
  'hasFocus': 'has-focus',
  'hasFocus0': 'has-focus0',
  'has0Focus0': 'has0-focus0',
  'HasFocus': 'has-focus',
};

export const getModifierCases = [{
  title: 'Expect modifier class to be "%1"',
  setup: {
    className: 'ClassName',
    delimiters,
    hyphenate: false,
  },
  entities: {
    [`ClassName${delimiters.modifier}Boolean`]: { Boolean: true },
    [`ClassName${delimiters.modifier}String${delimiters.value}one`]: { String: 'one' },
    [`ClassName${delimiters.modifier}Number${delimiters.value}1`]: { Number: 1 },
    '': {
      invalid1: null,
      invalid2: { key: 'value' },
      invalid3: new Date(),
    },
  }
}, {
  title: 'Expect to get hyphenated modifier "%1"',
  setup: {
    className: 'ClassName',
    delimiters,
    hyphenate: true,
  },
  entities: {
    [`ClassName${delimiters.modifier}boolean`]: { Boolean: true },
    [`ClassName${delimiters.modifier}string${delimiters.value}one`]: { String: 'one' },
    [`ClassName${delimiters.modifier}number${delimiters.value}1`]: { Number: 1 },
    '': {
      invalid1: null,
      invalid2: { key: 'value' },
      invalid3: new Date(),
    },
  }
},
];

export const addClassCases = [
  'css-class-1'
];

export const removeClassCases = [
  'css-class-1'
];

export const directiveAndMixinCases = {
  [component.name]: {
    mixin: [],
    directive,
  },
  [elementClassName]: {
    mixin: [element],
    directive: `${directive}:${element}`,
  },
  [`${elementClassName} ${elementClassName}${delimiters.modifier}modifier`]: {
    mixin: [element, { modifier: true }],
    directive: `${directive}:${element}="{ modifier: true }"`,
  },
  [`${elementClassName} ${elementClassName}${delimiters.modifier}modifier${delimiters.value}hyphenated`]: {
    mixin: [element, { Modifier: 'Hyphenated' }],
    directive: `${directive}:${element}="{ Modifier: 'Hyphenated' }"`,
  },
  [`${elementClassName} ${elementClassName}${delimiters.modifier}modifier${delimiters.value}hyphenated mixin-1 Mixin-2`]: {
    mixin: [element, { Modifier: 'Hyphenated' }, ['mixin-1', 'Mixin-2']],
    directive: `${directive}:${element}.mixin-1.Mixin-2="{ Modifier: 'Hyphenated' }"`,
  },
  [`${component.name} ${component.name}${delimiters.modifier}modifier${delimiters.value}hyphenated`]: {
    mixin: [{ Modifier: 'Hyphenated' }],
    directive: `${directive}="{ Modifier: 'Hyphenated' }"`,
  },
  [`${component.name} ${component.name}${delimiters.modifier}modifier${delimiters.value}hyphenated mixin-1 Mixin-2`]: {
    mixin: [{ Modifier: 'Hyphenated' }, ['mixin-1', 'Mixin-2']],
    directive: `${directive}.mixin-1.Mixin-2="{ Modifier: 'Hyphenated' }"`,
  },
  [`${component.name} mixin-1 Mixin-2`]: {
    mixin: [['mixin-1', 'Mixin-2']],
    directive: `${directive}.mixin-1.Mixin-2`,
  },
  [`${component.name} mixin`]: {
    mixin: [null, null, ['mixin']],
    directive: `${directive}.mixin`,
  },
  [`${elementClassName} mixin`]: {
    mixin: [element, null, ['mixin']],
    directive: `${directive}:${element}.mixin`,
  },
  [`${component.name} ${component.name}${delimiters.modifier}modifier2${delimiters.value}hyphenated`]: {
    mixin: [null, { Modifier2: 'Hyphenated' }, null],
    directive: `${directive}="{ Modifier2: 'Hyphenated' }"`,
  },
};
