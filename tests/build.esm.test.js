import { mount, createLocalVue } from '@vue/test-utils';
import {
  component,
  delimiters,
  element,
  namespace,
  directive,
  elementClassName, directiveAndMixinCases,
} from './testing-cases';
import plugin from '../dist/vue-bem.esm';

describe('Check plugin installation', () => {
  const localVue = createLocalVue();

  localVue.use(plugin);

  const wrapper = mount({
    ...component,
    template: `<div ${directive}></div>`,
  }, {
    localVue
  });

  test('Expect Vue instance.', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('Expect that directive is available.', () => {
    expect(wrapper.classes().join(' ')).toBe(`${component.name}`);
  });
});

describe('Test default plugin settings', () => {
  const localVue = createLocalVue();

  localVue.use(plugin);

  const wrapper = mount({
    ...component,
    template: `<div ${directive}:${element}="{ Modifier: true }"></div>`,
  }, {
    localVue
  });

  test('Expect that directive is available.', () => {
    expect(wrapper.classes().join(' ')).toBe(`${component.name}__${element} ${component.name}__${element}--modifier`);
  });
});

describe('Check custom plugin settings 1', () => {
  const localVue = createLocalVue();

  localVue.use(plugin, {
    delimiters,
    hyphenate: false
  });

  const wrapper = mount({
    ...component,
    template: `<p ${directive}:${element}="{ Modifier: 'ModifierValue' }"><span></span></p>`,
  }, {
    localVue
  });

  test('Expect custom hypenate and delimiters.', () => {
    expect(
      wrapper.classes().join(' ')
    ).toBe(`${elementClassName} ${elementClassName}${delimiters.modifier}Modifier${delimiters.value}ModifierValue`);
  });
});

describe('Check custom plugin settings 2', () => {
  const localVue = createLocalVue();

  localVue.use(plugin, {
    namespace,
    hyphenate: {
      blockAndElement: true,
      modifiers: false,
    }
  });

  const wrapper = mount({
    ...component,
    template: `<p ${directive}:${element}="{ Modifier: 'ModifierValue' }"><span></span></p>`,
  }, {
    localVue
  });

  test('Expect custom hypenate and delimiters.', () => {
    expect(
      wrapper.classes().join(' ')
    ).toBe(`${namespace}test-component__element-name ${namespace}test-component__element-name--Modifier-ModifierValue`);
  });
});

describe('The directive works as expected', () => {
  const localVue = createLocalVue();

  localVue.use(plugin, { delimiters });

  Object.entries(directiveAndMixinCases).forEach((testCase) => {
    const [output, input] = testCase;
    const wrapper = mount({
      ...component,
      template: `<p ${input.directive}><span></span></p>`,
    }, {
      localVue
    });

    test(`Expect element class to be ${output}`, () => {
      expect(
        wrapper.classes().join(' ')
      ).toBe(output);
    });
  });
});
