<h1 align="center">infinite-debugger/rmk-utils</h1>

## Installation

infinite-debugger/rmk-utils is available as an [npm package](https://www.npmjs.com/package/@infinite-debugger/rmk-utils).

```sh
// with npm
npm install @infinite-debugger/rmk-utils

// with yarn
yarn add @infinite-debugger/rmk-utils
```

## Usage

Here is a quick example to get you started, **it's all you need**:

```ts
import { getInterpolatedPath } from '@infinite-debugger/rmk-utils/paths';

getInterpolatedPath("/users/:userId", { userId: 123 }); // -> "/users/123"
```

## Contributing

Read the [contributing guide](/CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to the utility library.

## Changelog

If you have recently updated, please read the [changelog](https://github.com/rmkasendwa/rmk-utils/releases) for details of what has changed.

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).
