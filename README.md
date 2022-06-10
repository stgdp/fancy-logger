# @stgdp/fancy-logger

Bring some color to your console outputs!

[![npm Version](https://img.shields.io/npm/v/@stgdp/fancy-logger?style=flat-square)](https://www.npmjs.com/package/@stgdp/fancy-logger)
[![License](https://img.shields.io/github/license/stgdp/fancy-logger?style=flat-square)](LICENSE)

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
const logger = require("@stgdp/fancy-logger");

// Produces a bold console log with a white background and red text
logger().red.bold.bg.white.write("I'm formatted!").end;
```

## Reference

### logger( ?options: Object )

Starts the logger with a timestamp by default. Options can be supplied to the logger in an object.

| Options        | Default    | Operation                                                                                                                                                         |
| -------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timestamp`    | `true`     | Enables the timestamp                                                                                                                                             |
| `format`       | `HH:mm:ss` | Sets the format for the timestamp. Check out the [fecha documentation](https://github.com/taylorhakes/fecha#formatting-tokens) for the formatting characters.     |
| `buffer`       | `false`    | Buffers the output to be returned or outputted at a later time                                                                                                    |
| `file`         | `false`    | Sets a file to store the current log buffer to when `to_file` is called                                                                                           |
| `file_options` | `{}`       | Sets the file options for the `to_file` method. Gets passed to `fs.writeFileSync`. See more: https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options |
| `modifiers`    | `{}`       | Sets the default modifiers for the logger to run with. See: [Default Modifiers](#default-modifiers)                                                               |

#### Usage

```javascript
// Without options
logger();

// With options
logger({
    timestamp: true,
    format: "HH:mm:ss",
    buffer: false,
    file: "./logs/node-app.log",
    file_options: {
        encoding: "utf8",
    },
});
```

### write( content: String, modifiers: Object )

Outputs provided content to the console through the logger. When the `buffer` option is set to `true`, this will be stored within the logger until either `output` or `return` are called instead.

`modifiers` uses the [Default Modifiers](#default-modifiers) with an additional parameter of `reset` for [reset modifiers](#reset)

#### Usage

```javascript
// Outputs "hello world" to the console with a timestamp and new line.
logger().write("hello world").end;

// Outputs "hello world" to the console with a timestamp, new line and blue "world".
logger().write("hello ").write("world", {fg:"blue"}).end;
```

### to_file( file: String )

Writes the current log to file. Recommended to be used at the end of a log to prevent the log from being written to file twice. The `file` parameter can be left blank to use the default set in the `logger` constructor, or be set to a file location.

#### Usage

```javascript
logger({
    file: "./logs/node-app.log",
})
    .write("hello world")
    .end.to_file();
// Or
logger({
    file: path.resolve("./logs/node-app.log"),
})
    .write("hello world")
    .end.to_file();
// Or
logger().write("hello world").end.to_file("./logs/node-app.log");
// Or
logger().write("hello world").end.to_file(path.resolve("./logs/node-app.log"));
```

### end

Resets all styles and outputs a new line to the console through the logger.

#### Usage

```javascript
// Outputs "hello world" to the console with a timestamp and new line.
logger().write("hello world").end;
```

### output

Outputs the buffer to the console through the logger.

#### Usage

```javascript
// Outputs "hello world" to the console with a timestamp and new line.
logger({ buffer: true }).write("hello world").end.output;
```

### return

Returns the buffer created by the logger, along with the ansi codes for the modifiers used.

#### Usage

```javascript
// Returns "hello world"
var msg = logger({ buffer: true }).write("hello world").end.return;
```

### Modifier types

Modifier types adjust a parameter within the logger system, allowing the console to have it's foreground, background or decoration changed. The following modifier types are available;

| Modifier type | Description                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `fg`          | Allows for setting a foreground color modifier (e.g. `red`)                                                           |
| `bg`          | Allows for setting a background color modifier (e.g. `red`)                                                           |
| `decoration`  | Allows for setting a decoration modifier (e.g. `bold`)                                                                |
| `reset`       | Allows for issuing a reset modifier (e.g. `all`)                                                                      |
| `bright`      | Alters the foreground and background modifiers to use the bright variant. This modifier type works on a toggle system |

### fg and bg

Foreground and background modifiers allow the logger to change their foreground and background colors respectively. While foreground modifiers only need to be preceeded by the `fg` modifier type if another modifier type was previously used, background modifiers always need to be preceeded by the `bg` modifier type. Bright variants can be accessed by using the `bright` modifier type.

#### Available modifiers

-   `black`
-   `red`
-   `green`
-   `yellow`
-   `blue`
-   `magenta`
-   `cyan`
-   `white`

#### Usage

```javascript
// Sets the logger foreground color to red
logger().red.write("hello world").end;
logger().fg.red.write("hello world").end;

// Sets the logger background color to red
logger().bg.red.write("hello world").end;

// Sets the logger background color to bright red
logger().bg.bright.red.write("hello world").end;
```

### decoration

Decoration modifiers allow the logger to change their decorations. These modifiers only have to be preceeded by the `decoration` modifier type is another modifier type was previously used.

#### Available modifiers

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
// Sets the logger decoration to bold
logger().bold.write("hello world").end;
logger().decoration.bold.write("hello world").end;
```

### reset

Reset modifiers allow the logger to reset previously applied modifiers back to their default values. All modifiers except for `all`, `reset_fg` and `reset_bg` have to be preceeded by the `reset` modifier type.

#### Available modifiers

-   `all`
-   `bold`
-   `dim`
-   `italic`
-   `underline`
-   `inverse`
-   `hidden`
-   `strike`
-   `reset_fg`
-   `reset_bg`
-   `frame`
-   `encircle`
-   `overline`

#### Usage

```javascript
// Resets all modifiers
logger().red.bold.write("hello").all.write(" world").end;
logger().red.bold.write("hello").reset.all.write(" world").end;

// Resets the bold modifier, leaving the foreground modifier alone
logger().red.bold.write("hello").reset.bold.write(" world").end;
```

### Default Modifiers

Default modifiers can be sent with the logger options to style the log without needing to chain modifiers. **NOTE:** You don't have to send the full object, only send what you need and leave the rest.

#### Usage

```javascript
// Output will have a bright red foreground, blue background and be bold
logger({
    modifiers: {
        fg: "red",
        bg: "blue",
        bright: {
            fg: true,
            bg: false,
        },
        decoration: {
            bold: true,
            dim: false,
            italic: false,
            underline: false,
            inverse: false,
            hidden: false,
            strike: false,
            frame: false,
            encircle: false,
            overline: false,
        },
    },
}).write("hello world").end;
// OR
// Output will have a bright red foreground, blue background and be bold
logger({
    modifiers: {
        fg: "red",
        bg: "blue",
        bright: ["fg"],
        decoration: ["bold"],
    },
}).write("hello world").end;
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
