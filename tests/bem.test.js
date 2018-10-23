import {
  component,
  delimiters,
  directiveAndMixinCases,
} from './testing-cases';
import bem from '../src/modules/bem';

describe('Check bem output', () => {
  Object.entries(directiveAndMixinCases).forEach((testCase) => {
    const [output, input] = testCase;

    test(`Return of "bem" is "${output}"`, () => {
      expect(bem({ blockName: component.name, delimiters, hyphenate: true }, ...input.mixin)).toBe(output);
    });
  });
});
