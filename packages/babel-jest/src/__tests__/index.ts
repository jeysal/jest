/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Config, Transform} from '@jest/types';
import babelJest from '../index';

//Mock data for all the tests
const sourceString = `
const sum = (a, b) => a+b;
const difference = (a, b) => a-b;

const customMultiply = (obj, mul) => {
    const {a, ...rest} = obj;
    return a * mul;
}

customMultiply({a: 32, dummy: "test"}, 2);
`;

const mockConfig = {
  moduleFileExtensions: [],
};

test(`Returns source string with inline maps when no transformOptions is passed`, () => {
  const result = babelJest.process(
    sourceString,
    'dummy_path.js',
    (mockConfig as unknown) as Config.ProjectConfig,
  ) as Transform.TransformedSource;
  expect(typeof result).toBe('object');
  expect(result.code).toBeDefined();
  expect(result.map).toBeDefined();
  expect(result.code).toMatch('//# sourceMappingURL');
  expect(result.code).toMatch('customMultiply');
  // @ts-ignore: it's fine if we get wrong types, the tests will fail then
  expect(result.map.sources).toEqual(['dummy_path.js']);
  // @ts-ignore: it's fine if we get wrong types, the tests will fail then
  expect(JSON.stringify(result.map.sourcesContent)).toMatch('customMultiply');
});
