# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.2]
### Added
- Compatability with latest 2021 snaps branches ([#114](https://github.com/MetaMask/snaps-cli/pull/114))
- Init command unit tests ([#97](https://github.com/MetaMask/snaps-cli/pull/97))
- GitHub Actions for CI/Releases ([#116](https://github.com/MetaMask/snaps-cli/pull/116))
- CODEOWNERS file ([#108](https://github.com/MetaMask/snaps-cli/pull/108))

### Changed
- Colocate tests and migrate them to TypeScript ([#106](https://github.com/MetaMask/snaps-cli/pull/106))
- Fix line coverage ([#104](https://github.com/MetaMask/snaps-cli/pull/104))
- @metamask/eslint-config*@6.0.0 ([#102](https://github.com/MetaMask/snaps-cli/pull/102))
- Clear all mocks in Jest config ([#103](https://github.com/MetaMask/snaps-cli/pull/103))
- Build Cmd Unit Tests ([#98](https://github.com/MetaMask/snaps-cli/pull/98))
- Watch Command Unit Tests ([#93](https://github.com/MetaMask/snaps-cli/pull/93))
- Manifest Command Unit Tests ([#94](https://github.com/MetaMask/snaps-cli/pull/94))
- Serve Command Unit Tests ([#92](https://github.com/MetaMask/snaps-cli/pull/92))
- Eval Cmd Unit Tests ([#91](https://github.com/MetaMask/snaps-cli/pull/91))
- Prevent serve command from caching files ([#90](https://github.com/MetaMask/snaps-cli/pull/90))
- buildweb3wallet init refactor ([#89](https://github.com/MetaMask/snaps-cli/pull/89))
- Add license file ([#88](https://github.com/MetaMask/snaps-cli/pull/88))
- Restore crypto to eval environment ([#87](https://github.com/MetaMask/snaps-cli/pull/87))
- Fix applyConfig behavior ([#85](https://github.com/MetaMask/snaps-cli/pull/85))
- Make applyConfig transform argv instead of builders ([#84](https://github.com/MetaMask/snaps-cli/pull/84))
- Refactor snap-config utils and tests ([#83](https://github.com/MetaMask/snaps-cli/pull/83))
- Add utils unit tests ([#76](https://github.com/MetaMask/snaps-cli/pull/76))
- @metamask/eslint-config@5.0.0 ([#80](https://github.com/MetaMask/snaps-cli/pull/80))
- Change alias for suppressWarnings ([#81](https://github.com/MetaMask/snaps-cli/pull/81))
- Reorganize utils file structure ([#79](https://github.com/MetaMask/snaps-cli/pull/79))
- Node version to 14 ([#77](https://github.com/MetaMask/snaps-cli/pull/77))
- Source code to use Typescript ([#75](https://github.com/MetaMask/snaps-cli/pull/75))
- File structure using commandDir for yargs ([#72](https://github.com/MetaMask/snaps-cli/pull/72))
- File existence checks and fixes in init.js ([#73](https://github.com/MetaMask/snaps-cli/pull/73))
- fs.exists and fs.readdir usage to better handle errors ([#71](https://github.com/MetaMask/snaps-cli/pull/71))
- Comment strip option ([#65](https://github.com/MetaMask/snaps-cli/pull/65))
- Convert to Web Workers and ses@^0.11.0 ([#60](https://github.com/MetaMask/snaps-cli/pull/60))
- .nvmrc to 10.17.0

### Removed
- 3box example
- Environment option ([#86](https://github.com/MetaMask/snaps-cli/pull/86))

## [0.4.1]
### Uncategorized
- Rename `plugin` option to `bundle`, but keep alias
- Bugfixes after renaming

## [0.4.0]
### Uncategorized
- Rename package to `snaps-cli`
- Rename CLI entry point to `snap`
  - Maintain `mm-plugin` entry point alias and `mm-plugin.config.json` config files

## [0.3.13]
### Uncategorized
- Fix fatal `watch` command bug

## [0.3.12]
### Uncategorized
- Use existing `package.json` for `mm-plugin init`, if it exists
  - Fixes [#38](https://github.com/MetaMask/snaps-cli/issues/38)

## [0.3.11]
### Uncategorized
- Stop publishing example builds to `npm`
- Add `buildExamples` script to `package.json`
  - Use this to build all examples with source maps
- Rename `build` and `watch` option `debug` to `sourceMaps`
  - Maintain `debug` alias for backwards compatibility

## [0.3.10]
### Uncategorized
- Add optional source mapping via `debug` option to `build` and `watch` commands

## [0.3.9]
### Uncategorized
- Fix `undefined` `port` in `package.json` on build
- The `populate` option for `mm-plugin manifest` (and `mm-plugin build`, which calls
  `manifest` by default) no longer has the alias `p`
  - `p` is now in every case reserved as an alias for `port`.

## [0.3.8]
### Uncategorized
- Update readme

## [0.3.7]
### Uncategorized
- `mm-plugin manifest` now populates `package.json:web3Wallet.bundle.url` using config values
  - It only does this if `bundle.url` is missing or starts with `http://localhost`.
  - It applies: `bundle.url = 'http://localhost:${port}/${bundlePath}'`
- Basic handling of HTML comment syntax in bundle
  - `<!--` and `-->` can be valid JavaScript, but are always forbidden by SES.
    They are now destructed into `<! --` and `-- >`. This may break code in some edge cases.

## [0.3.6]
### Uncategorized
- Update faulty ignore files; package size decreased

## [0.3.5]
### Uncategorized
- Updated examples to work with `metamask-plugin-beta` as of [this commit](https://github.com/MetaMask/metamask-plugin-beta/commit/b8ba321689cec6749502969f0084e12193e92dab)

## [0.3.4]
### Uncategorized
- `mm-plugin watch` should no longer terminate on on parse or write errors

## [0.3.3]
### Uncategorized
- Update `realms-shim`

## [0.3.2]
### Uncategorized
- Handle SES edge cases
  - Babel: `regeneratorRuntime` global variable
  - Browserify: modules that use `Buffer`
    - Added regex that replaces lines in the bundle of the form `(function (Buffer){`

## [0.3.1]
### Uncategorized
- Rename `.mm-plugin.json` to `mm-plugin.config.json`
  - Still support `.mm-plugin.json` for backwards compatibility

## [0.3.0]
### Uncategorized
- Remove default command; at least one command must now be specified
- Add `init` command

## [0.2.1]
### Uncategorized
- Specifying `web3Wallet.bundle.local` or `dist` in `.mm-plugin.json` no longer
  overwrites the default for the `serve` command's `root` directory argument

## [0.2.0]
### Uncategorized
- Use named rather than positional arguments

[Unreleased]: https://github.com/MetaMask/snaps-cli/compare/v0.4.2...HEAD
[0.4.2]: https://github.com/MetaMask/snaps-cli/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/MetaMask/snaps-cli/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/MetaMask/snaps-cli/compare/v0.3.13...v0.4.0
[0.3.13]: https://github.com/MetaMask/snaps-cli/compare/v0.3.12...v0.3.13
[0.3.12]: https://github.com/MetaMask/snaps-cli/compare/v0.3.11...v0.3.12
[0.3.11]: https://github.com/MetaMask/snaps-cli/compare/v0.3.10...v0.3.11
[0.3.10]: https://github.com/MetaMask/snaps-cli/compare/v0.3.9...v0.3.10
[0.3.9]: https://github.com/MetaMask/snaps-cli/compare/v0.3.8...v0.3.9
[0.3.8]: https://github.com/MetaMask/snaps-cli/compare/v0.3.7...v0.3.8
[0.3.7]: https://github.com/MetaMask/snaps-cli/compare/v0.3.6...v0.3.7
[0.3.6]: https://github.com/MetaMask/snaps-cli/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/MetaMask/snaps-cli/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/MetaMask/snaps-cli/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/MetaMask/snaps-cli/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/MetaMask/snaps-cli/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/MetaMask/snaps-cli/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/MetaMask/snaps-cli/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/MetaMask/snaps-cli/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/MetaMask/snaps-cli/releases/tag/v0.2.0
