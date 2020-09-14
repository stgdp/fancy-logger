# Changelog

## [Unreleased]

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

[unreleased]: https://github.com/stgdp/fancy-logger/compare/v1.0.0-beta.1...HEAD
[1.0.0-beta.1]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.1
[1.0.0-beta.0]: https://github.com/stgdp/fancy-logger/releases/tag/v1.0.0-beta.0
