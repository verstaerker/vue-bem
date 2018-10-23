/* eslint-disable padded-blocks */

import {
  hyphenateString,
  getModifiers,
  addClass,
  removeClass,
} from '../src/utils';
import {
  hyphenateStringCases,
  getModifierCases,
  addClassCases,
  removeClassCases,
} from './testing-cases';
import { HYPHENATE_CACHE } from '../src/shared';

describe('hyphenateString', () => {

  Object.entries(hyphenateStringCases).forEach((entity) => {
    const [input, output] = entity;

    Object.keys(HYPHENATE_CACHE).forEach((cacheEntry) => {
      delete(HYPHENATE_CACHE[cacheEntry]);
    });

    test(`Expected "${input}" to become "${output}".`, () => {
      expect(hyphenateString(input)).toBe(output);
    });

    test(`Expect "HYPHENATE_CACHE" to contain an entry for ${input}`, () => {
      expect(Object.keys(HYPHENATE_CACHE).includes(input)).toBeTruthy();
    });
  });

});

describe('getModifiers', () => {

  getModifierCases.forEach((getModifierTest) => {
    const { setup } = getModifierTest;

    Object.entries(getModifierTest.entities).forEach((entity) => {
      const [output, input] = entity;

      test(getModifierTest.title.replace('%1', output), () => {
        const result = getModifiers(setup.className, input, setup.delimiters, setup.hyphenate);

        expect(result.join(' ')).toBe(output);
      });
    });
  });

});

describe('addClass', () => {

  addClassCases.forEach((addClassCase) => {
    const element = document.createElement('div');

    element.classList.add('test-class');

    addClass(element, addClassCase);

    test(`Expect element classList to contain "${addClassCase}"`, () => {
      expect(element.classList.contains(addClassCase)).toBeTruthy();
    });

    test('Expect element classList to have 2 entries', () => {
      expect(element.classList.length).toBe(2);
    });
  });

});

describe('removeClass', () => {

  removeClassCases.forEach((removeClassCase) => {
    const element = document.createElement('div');

    element.classList.add('test-class');
    element.classList.add(removeClassCase);

    removeClass(element, removeClassCase);

    test(`Element classList to contain "${removeClassCase}"`, () => {
      expect(element.classList.contains(removeClassCase)).toBeFalsy();
    });

    test('Expect element classList to have 1 entry', () => {
      expect(element.classList.length).toBe(1);
    });
  });

});
