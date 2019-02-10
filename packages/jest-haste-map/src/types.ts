/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ModuleMap from './ModuleMap';
import HasteFS from './HasteFS';

export type IgnoreMatcher = (item: string) => boolean;
export type Mapper = (item: string) => Array<string> | null;

export type WorkerMessage = {
  computeDependencies: boolean;
  computeSha1: boolean;
  dependencyExtractor?: string;
  rootDir: string;
  filePath: string;
  hasteImplModulePath?: string;
};

export type WorkerMetadata = {
  dependencies?: Array<string>;
  id?: string;
  module?: ModuleMetaData;
  sha1?: string;
};

export type CrawlerOptions = {
  computeSha1: boolean;
  data: InternalHasteMap;
  extensions: Array<string>;
  forceNodeFilesystemAPI: boolean;
  ignore: IgnoreMatcher;
  mapper?: Mapper | null;
  rootDir: string;
  roots: Array<string>;
};

export type HasteImpl = {
  getHasteName(filePath: string): string | void;
};

export type FileData = Map<string, FileMetaData>;

export type FileMetaData = [
  /* id */ string,
  /* mtime */ number,
  /* visited */ 0 | 1,
  /* dependencies */ Array<string>,
  /* sha1 */ string | null
];

export type MockData = Map<string, string>;
export type ModuleMapData = Map<string, ModuleMapItem>;
export type WatchmanClocks = Map<string, string>;
export type HasteRegExp = RegExp | ((str: string) => boolean);

export type DuplicatesSet = Map<string, /* type */ number>;
export type DuplicatesIndex = Map<string, Map<string, DuplicatesSet>>;

export type InternalHasteMap = {
  clocks: WatchmanClocks;
  duplicates: DuplicatesIndex;
  files: FileData;
  map: ModuleMapData;
  mocks: MockData;
};

export type HasteMap = {
  hasteFS: HasteFS;
  moduleMap: ModuleMap;
  __hasteMapForTest?: InternalHasteMap | null;
};

export type RawModuleMap = {
  rootDir: string;
  duplicates: DuplicatesIndex;
  map: ModuleMapData;
  mocks: MockData;
};

type ModuleMapItem = {[platform: string]: ModuleMetaData};
export type ModuleMetaData = [string, /* type */ number];

export type HType = {
  ID: 0;
  MTIME: 1;
  VISITED: 2;
  DEPENDENCIES: 3;
  PATH: 0;
  TYPE: 1;
  MODULE: 0;
  PACKAGE: 1;
  GENERIC_PLATFORM: 'g';
  NATIVE_PLATFORM: 'native';
};

export type HTypeValue = 0 | 1 | 2 | 3 | 'g';
