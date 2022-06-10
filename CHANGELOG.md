# Changelog

## [Unreleased]
### Security
- Updated `mocha` to 10.0.0
- Updated `fecha` to 4.2.3
- Updated `strip-ansi` to 6.0.1

### Added
- Implemented modifier options to `write` method
- Implemented linting for improved coding standards

### Changed
- Refactored tests - #6

## [1.0.0-beta.4] - 2020-11-25

### Security
- Updated `mocha` to 8.2.1

### Added
- Implemented default modifiers - #4

### Changed
- Migrated CI to `travis-ci.com``

## [1.0.0-beta.3] - 2020-11-11

### Added
- Implemented writing the log to a file - #2 #3

### Changed
- Moved the test file location to /test

## [1.0.0-beta.2] - 2020-09-14

### Added
-   Implemented formatting the timestamp

### Changed
-   Converted all methods except for write to getters as they didn't need to be methods
-   `modifier` is now called `decoration`
-   Reverted back to the original single file structure as it's now more simplified!

### Removed
-   Calling `return` no longer adds an end statement, `end` should be called before this

## [1.0.0-beta.1] - 2020-09-10

### Added
-   Implemented basic mocha tests
-   Timestamps can now be disabled
-   Outputs can be buffered for use at a later point
-   Added a Readme detailing how to use the logger
-   Added this here changelog!

### Changed
-   Converted the logger to a class instead of a function with prototypes
-   Implemented more checks to the `modifier`, `reset` and `output` methods
-   Moved functionality out to libs for simplicity of updating

### Fixed
-   Fixed issues with the bright colors on the `fg` and `bg` methods

## [1.0.0-beta.0] - 2020-09-10

### Added
-   Initial (beta) version

[unreleased]: https://github.com/stgdp/fancy-logger/compare/v1.0.0-beta.4...HEAD
[1.0.0-beta.4]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.4
[1.0.0-beta.3]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.2
[1.0.0-beta.1]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.1
[1.0.0-beta.0]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.0
