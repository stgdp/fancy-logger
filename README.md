# @stgdp/fancy-logger

Bring some color to your console outputs!

[![npm Version](https://img.shields.io/npm/v/@stgdp/fancy-logger?style=flat-square)](https://www.npmjs.com/package/@stgdp/fancy-logger)
[![Build Status](https://img.shields.io/travis/stgdp/fancy-logger?style=flat-square)](https://travis-ci.org/stgdp/fancy-logger)
[![License](https://img.shields.io/github/license/stgdp/fancy-logger?style=flat-square)](LICENSE)
[![Dependency Status](https://img.shields.io/david/stgdp/fancy-logger?style=flat-square)](https://david-dm.org/stgdp/fancy-logger)

`fancy-logger` is a Node.js module that supplies you with a fully-featured console logger to format your terminal. Change the text color, background color, make the text bold, italic, underline and more.

## Installation

### With npm

```
npm install @stgdp/fancy-logger
```

### With yarn

```
yarn add @stgdp/fancy-logger
```

## Usage

```javascript
const logger = require("@stgdp/fancy-logger")

// Produces a bold console log with red background and white text
logger().white().bold().bg_red().write("I'm formatted!").end()
```

## Reference

### logger( ?options: Object )

Starts the logger with a timestamp by default. Options can be supplied to the logger in an object.

| Options     | Default    | Operation                                                                                           |
| ----------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `timestamp` | `true`     | Enables the timestamp                                                                               |
| `format`    | `HH:mm:ss` | Sets the format for the timestamp. Check out the [fecha documentation](https://github.com/taylorhakes/fecha#formatting-tokens) for the formatting characters. |
| `buffer`    | `false`    | Buffers the output to be returned or outputted at a later time                                      |

#### Usage

```javascript
// Without options
logger()

// With options
logger({
    timestamp: true,
    buffer: false,
})
```

### fg( color: String )

The `fg` method allows a foreground color to be applied to the console log. All options listed below are also available as standalone methods (e.g. `red()`) and as methods prefixed with `fg_` (e.g. `fg_red()`)

-   `black`
-   `red`
-   `green`
-   `yellow`
-   `blue`
-   `magenta`
-   `cyan`
-   `white`
-   `bright_black`
-   `bright_red`
-   `bright_green`
-   `bright_yellow`
-   `bright_blue`
-   `bright_magenta`
-   `bright_cyan`
-   `bright_white`

#### Usage

```javascript
logger().fg("red")

// Or
logger().red()

// Or
logger().fg_red()
```

### bg( color: String )

The `bg` method allows a background color to be applied to the console log. All options listed below are available as methods prefixed with `bg_` (e.g. `bg_red()`)

-   `black`
-   `red`
-   `green`
-   `yellow`
-   `blue`
-   `magenta`
-   `cyan`
-   `white`
-   `bright_black`
-   `bright_red`
-   `bright_green`
-   `bright_yellow`
-   `bright_blue`
-   `bright_magenta`
-   `bright_cyan`
-   `bright_white`

#### Usage

```javascript
logger().bg("red")

// Or
logger().bg_red()
```

### modifier( ?options: Object|String )

The `modifier` method allows a modifier to be applied to the console log. All options listed below can be supplied as an object (e.g. `{ bold: true }`) or as a string (e.g. `"bold"`). All options are also available as standalone methods (e.g. `bold()`) and as methods prefixed with `mod_` (e.g. `mod_bold()`)

-   `bold`
-   `dim`
-   `italic`
-   `underline`
-   `inverse`
-   `hidden`
-   `strike`
-   `frame`
-   `encircle`
-   `overline`

#### Usage

```javascript
logger().modifier({ bold: true })

// Or
logger().modifier("bold")

// Or
logger().bold()

// Or
logger().mod_bold()
```

### reset( ?options: Object|String )

The `reset` method allows you to reset any of the modifiers applied to the console log. All options listed below can be supplied as an object (e.g. `{ bold: true }`) or as a string (e.g. `"bold"`). All options are also available as methods prefixed with `reset_` (e.g. `mod_bold()`)

-   `all`
-   `bold`
-   `dim`
-   `italic`
-   `underline`
-   `inverse`
-   `hidden`
-   `strike`
-   `fg`
-   `bg`
-   `frame`
-   `encircle`
-   `overline`

#### Usage

```javascript
logger().reset({ bold: true })

// Or
logger().reset("bold")

// Or
logger().reset_bold()
```

## License

```
MIT License

Copyright (c) 2020 Andrew Palfrey <apalfrey@apalfrey.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
