/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import micromatch from 'micromatch';
import {replacePathSepForGlob} from 'jest-util';
import {Config} from '@jest/types';
import {FileData} from './types';
import * as fastPath from './lib/fast_path';
import H from './constants';

export default class HasteFS {
  _rootDir: string;
  _files: FileData;

  constructor({rootDir, files}: {rootDir: string; files: FileData}) {
    this._rootDir = rootDir;
    this._files = files;
  }

  getModuleName(file: string): string | null {
    const fileMetadata = this._getFileData(file);
    // @ts-ignore: ts doesnt understand the index lookup
    return (fileMetadata && fileMetadata[H.ID]) || null;
  }

  getSize(file: Config.Path): number | null {
    const fileMetadata = this._getFileData(file);
    return (fileMetadata && (fileMetadata[H.SIZE] as number)) || null;
  }

  getDependencies(file: string): Array<string> | null {
    const fileMetadata = this._getFileData(file);
    // @ts-ignore: ts doesnt understand the index lookup
    return (fileMetadata && fileMetadata[H.DEPENDENCIES]) || null;
  }

  getSha1(file: string): string | null {
    const fileMetadata = this._getFileData(file);
    // @ts-ignore: ts doesnt understand the index lookup
    return (fileMetadata && fileMetadata[H.SHA1]) || null;
  }

  exists(file: string): boolean {
    return this._getFileData(file) != null;
  }

  getAllFiles(): Array<string> {
    return Array.from(this.getAbsoluteFileIterator());
  }

  getFileIterator(): Iterable<string> {
    return this._files.keys();
  }

  *getAbsoluteFileIterator(): Iterable<string> {
    for (const file of this.getFileIterator()) {
      yield fastPath.resolve(this._rootDir, file);
    }
  }

  matchFiles(pattern: RegExp | string): Array<string> {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern);
    }
    const files = [];
    for (const file of this.getAbsoluteFileIterator()) {
      if (pattern.test(file)) {
        files.push(file);
      }
    }
    return files;
  }

  matchFilesWithGlob(globs: Array<string>, root: string | null): Set<string> {
    const files = new Set();
    for (const file of this.getAbsoluteFileIterator()) {
      const filePath = root ? fastPath.relative(root, file) : file;
      if (micromatch.some(replacePathSepForGlob(filePath), globs)) {
        files.add(file);
      }
    }
    return files;
  }

  _getFileData(file: string) {
    const relativePath = fastPath.relative(this._rootDir, file);
    return this._files.get(relativePath);
  }
}
