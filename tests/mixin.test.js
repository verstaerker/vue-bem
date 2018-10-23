import { mount, createLocalVue } from '@vue/test-utils';
import {
  component,
  delimiters,
  directiveAndMixinCases,
} from './testing-cases';
import mixin from '../src/modules/mixin';
import plugin from '../src/modules/plugin';

describe('Check invalid use of mixin', () => {
  test('Expect global mixin to throw error because of missin plugin', () => {
    const localVue = createLocalVue();

    localVue.mixin(mixin);

    spyOn(console, 'error'); // Prevent intended error log from showing.

    expect(() => {
      mount(component, {
        localVue
      });
    }).toThrow();
  });

  test('Expect local mixin to throw error because of missin plugin', () => {
    const localVue = createLocalVue();

    spyOn(console, 'error'); // Prevent intended error log from showing.

    component.mixins = [mixin];

    expect(() => {
      mount(component, {
        localVue
      });
    }).toThrow();
  });
});

describe('Check global installation of mixin', () => {
  const localVue = createLocalVue();

  localVue.use(plugin);
  localVue.mixin(mixin);

  const wrapper = mount(component, {
    localVue
  });

  test('Component is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('Component has "bem" property', () => {
    expect(typeof wrapper.vm.bem).toBe('function');
  });
});

describe('Check mixin output', () => {
  const localVue = createLocalVue();

  localVue.use(plugin, {
    delimiters
  });
  localVue.mixin(mixin);

  const { vm } = mount(component, {
    localVue
  });

  Object.entries(directiveAndMixinCases).forEach((testCase) => {
    const [output, input] = testCase;

    test(`Return of the mixins "bem" is "${output}"`, () => {
      expect(vm.bem(...input.mixin)).toBe(output);
    });
  });
});
