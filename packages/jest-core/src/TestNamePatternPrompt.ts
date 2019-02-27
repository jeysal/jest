/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  PatternPrompt,
  Prompt,
  ScrollOptions,
  printPatternCaret,
  printRestoredPatternCaret,
} from 'jest-watcher';
import {TestResult} from '@jest/types';

export default class TestNamePatternPrompt extends PatternPrompt {
  private _cachedTestResults: Array<TestResult.TestResult>;

  constructor(pipe: NodeJS.WritableStream, prompt: Prompt) {
    super(pipe, prompt);
    this._entityName = 'tests';
    this._cachedTestResults = [];
  }

  private _onChange(pattern: string, options: ScrollOptions) {
    super._onChange();
    this._printPrompt(pattern, options);
  }

  private _printPrompt(pattern: string) {
    const pipe = this._pipe;
    printPatternCaret(pattern, pipe);
    printRestoredPatternCaret(pattern, this._currentUsageRows, pipe);
  }

  private _getMatchedTests(pattern: string) {
    let regex: RegExp;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {
      return [];
    }

    const matchedTests: Array<string> = [];

    this._cachedTestResults.forEach(({testResults}) =>
      testResults.forEach(({title}) => {
        if (regex.test(title)) {
          matchedTests.push(title);
        }
      }),
    );

    return matchedTests;
  }

  updateCachedTestResults(testResults: Array<TestResult.TestResult> = []) {
    this._cachedTestResults = testResults;
  }
}
