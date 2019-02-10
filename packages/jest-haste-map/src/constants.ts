/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable sort-keys */

/*
 * This file exports a set of constants that are used for Jest's haste map
 * serialization. On very large repositories, the haste map cache becomes very
 * large to the point where it is the largest overhead in starting up Jest.
 *
 * This constant key map allows to keep the map smaller without having to build
 * a custom serialization library.
 */
export default {
  /* file map attributes */
  ID: 0,
  MTIME: 1,
  SIZE: 2,
  VISITED: 3,
  DEPENDENCIES: 4,
  SHA1: 5,

  /* module map attributes */
  PATH: 0,
  TYPE: 1,

  /* module types */
  MODULE: 0,
  PACKAGE: 1,

  /* platforms */
  GENERIC_PLATFORM: 'g',
  NATIVE_PLATFORM: 'native',
} as {
  /* file map attributes */
  ID: 0;
  MTIME: 1;
  SIZE: 2;
  VISITED: 3;
  DEPENDENCIES: 4;
  SHA1: 5;

  /* module map attributes */
  PATH: 0;
  TYPE: 1;

  /* module types */
  MODULE: 0;
  PACKAGE: 1;

  /* platforms */
  GENERIC_PLATFORM: 'g';
  NATIVE_PLATFORM: 'native';
};
// TODO avoid duplication using `as const` after release of https://github.com/Microsoft/TypeScript/pull/29510
