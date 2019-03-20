// Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.

module.exports = {
  babelrcRoots: ['examples/*'],
  overrides: [
    {
      presets: [require.resolve('@babel/preset-flow')],
      test: '**/*.js',
    },
    {
      plugins: [
        require.resolve('babel-plugin-typescript-strip-namespaces'),
        require.resolve(
          './scripts/babel-plugin-jest-replace-ts-export-assignment.js'
        ),
      ],
      presets: [require.resolve('@babel/preset-typescript')],
      test: /\.tsx?$/,
    },
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-modules-commonjs'),
      {allowTopLevelThis: true},
    ],
    [require.resolve('@babel/plugin-transform-strict-mode')],
    [require.resolve('@babel/plugin-proposal-class-properties')],
  ],
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        shippedProposals: true,
        targets: {node: 6},
      },
    ],
  ],
};
