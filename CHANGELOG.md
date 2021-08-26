# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.2]
### Uncategorized
- Migrate to GitHub Actions ([#116](https://github.com/MetaMask/snaps-cli/pull/116))
- 2021 compat rebased ([#114](https://github.com/MetaMask/snaps-cli/pull/114))
- Bump path-parse from 1.0.6 to 1.0.7 ([#113](https://github.com/MetaMask/snaps-cli/pull/113))
- Bump glob-parent from 5.1.0 to 5.1.2 ([#112](https://github.com/MetaMask/snaps-cli/pull/112))
- Bump browserslist from 4.16.3 to 4.16.6 ([#110](https://github.com/MetaMask/snaps-cli/pull/110))
- Bump ws from 7.4.3 to 7.4.6 ([#111](https://github.com/MetaMask/snaps-cli/pull/111))
- Bump hosted-git-info from 2.8.5 to 2.8.9 ([#109](https://github.com/MetaMask/snaps-cli/pull/109))
- Add CODEOWNERS file ([#108](https://github.com/MetaMask/snaps-cli/pull/108))
- Bump lodash from 4.17.19 to 4.17.21 ([#107](https://github.com/MetaMask/snaps-cli/pull/107))
- Colocate tests and migrate them to TypeScript ([#106](https://github.com/MetaMask/snaps-cli/pull/106))
- Fix line coverage ([#104](https://github.com/MetaMask/snaps-cli/pull/104))
- @metamask/eslint-config*@6.0.0 ([#102](https://github.com/MetaMask/snaps-cli/pull/102))
- Clear all mocks in Jest config ([#103](https://github.com/MetaMask/snaps-cli/pull/103))
- Build Cmd Unit Tests ([#98](https://github.com/MetaMask/snaps-cli/pull/98))
- Add init command unit tests ([#97](https://github.com/MetaMask/snaps-cli/pull/97))
- Watch Command Unit Tests ([#93](https://github.com/MetaMask/snaps-cli/pull/93))
- Manifest Command Unit Tests ([#94](https://github.com/MetaMask/snaps-cli/pull/94))
- Update ethers in example ([#100](https://github.com/MetaMask/snaps-cli/pull/100))
- Serve Command Unit Tests ([#92](https://github.com/MetaMask/snaps-cli/pull/92))
- Bump elliptic from 6.5.3 to 6.5.4 ([#95](https://github.com/MetaMask/snaps-cli/pull/95))
- Eval Cmd Unit Tests ([#91](https://github.com/MetaMask/snaps-cli/pull/91))
- Prevent serve command from caching files ([#90](https://github.com/MetaMask/snaps-cli/pull/90))
- refactor init buildweb3wallet ([#89](https://github.com/MetaMask/snaps-cli/pull/89))
- Add license file ([#88](https://github.com/MetaMask/snaps-cli/pull/88))
- Restore crypto to eval environment ([#87](https://github.com/MetaMask/snaps-cli/pull/87))
- Remove environment option ([#86](https://github.com/MetaMask/snaps-cli/pull/86))
- Fix applyConfig behavior ([#85](https://github.com/MetaMask/snaps-cli/pull/85))
- Make applyConfig transform argv instead of builders ([#84](https://github.com/MetaMask/snaps-cli/pull/84))
- Refactor snap-config utils and tests ([#83](https://github.com/MetaMask/snaps-cli/pull/83))
- Add utils unit tests ([#76](https://github.com/MetaMask/snaps-cli/pull/76))
- @metamask/eslint-config@5.0.0 ([#80](https://github.com/MetaMask/snaps-cli/pull/80))
- Change alias for suppressWarnings ([#81](https://github.com/MetaMask/snaps-cli/pull/81))
- reorganize utils file structure ([#79](https://github.com/MetaMask/snaps-cli/pull/79))
- Use Node 14 ([#77](https://github.com/MetaMask/snaps-cli/pull/77))
- Typescript Migration ([#75](https://github.com/MetaMask/snaps-cli/pull/75))
- Reorganize file structure using commandDir for yargs ([#72](https://github.com/MetaMask/snaps-cli/pull/72))
- Fix file existence checks in init.js ([#73](https://github.com/MetaMask/snaps-cli/pull/73))
- fix fs.exists and fs.readdir errors ([#71](https://github.com/MetaMask/snaps-cli/pull/71))
- Fix building examples, minor issues ([#69](https://github.com/MetaMask/snaps-cli/pull/69))
- Fix examples dependency installation in CI ([#68](https://github.com/MetaMask/snaps-cli/pull/68))
- Add CircleCI config ([#67](https://github.com/MetaMask/snaps-cli/pull/67))
- Add comment strip option ([#65](https://github.com/MetaMask/snaps-cli/pull/65))
- Fix linting ([#66](https://github.com/MetaMask/snaps-cli/pull/66))
- add eslint and fix related errors ([#64](https://github.com/MetaMask/snaps-cli/pull/64))
- Update README.md
- Fix typo in changelog
- Stop committing example build files
- Convert to Web Workers and ses@^0.11.0 ([#60](https://github.com/MetaMask/snaps-cli/pull/60))
- Update readme files
- Upgrade ethers in examples/ethers-js
- Update minimist resolution
- Remove unnecessary dependency from bls-signer
- Bump npm-user-validate from 1.0.0 to 1.0.1 in /examples/bls-signer ([#57](https://github.com/MetaMask/snaps-cli/pull/57))
- Bump ini from 1.3.5 to 1.3.8 in /examples/bls-signer ([#59](https://github.com/MetaMask/snaps-cli/pull/59))
- Bump dot-prop from 4.2.0 to 4.2.1 in /examples/bls-signer ([#58](https://github.com/MetaMask/snaps-cli/pull/58))
- Use yarn in examples
- browserify@17.0.0
- Bump yargs-parser from 15.0.0 to 15.0.1 ([#56](https://github.com/MetaMask/snaps-cli/pull/56))
- Use yarn, update .nvmrc
- Remove 3box example
- Bump elliptic from 6.5.1 to 6.5.3 ([#53](https://github.com/MetaMask/snaps-cli/pull/53))
- Bump lodash from 4.17.15 to 4.17.19 ([#52](https://github.com/MetaMask/snaps-cli/pull/52))
- Bump npm from 6.13.4 to 6.14.6 in bls-signer example ([#51](https://github.com/MetaMask/snaps-cli/pull/51))
- bump nvmrc version in readme ([#47](https://github.com/MetaMask/snaps-cli/pull/47))
- Update README.md
- Bump acorn from 7.1.0 to 7.1.1 ([#49](https://github.com/MetaMask/snaps-cli/pull/49))
- fix 3box frontend errors, SES errors remain
- Add custom account example ([#48](https://github.com/MetaMask/snaps-cli/pull/48))
- update .nvmrc to 10.17.0
- Bump npm from 6.11.3 to 6.13.4 in /examples/bls-signer ([#42](https://github.com/MetaMask/snaps-cli/pull/42))
- update example dapps for new API
- update bundle
- add identicon settings example
- Add ethers.js example
- Fix 3box example ([#39](https://github.com/MetaMask/snaps-cli/pull/39))
- 0.4.1
- post-rename fixes
- 0.4.0
- rename to snaps-cli
- 0.3.13
- fix watch bug
- 0.3.12
- init: use existing package.json if available
- fix development script location
- 0.3.11
- add example source maps; add buildExamples script
- rename 'debug' to 'sourceMaps'
- 0.3.10
- add source maps; debug option
- 0.3.9; remove stray console.log
- fix undefined port on build; update README
- 0.3.8
- update README
- 0.3.7
- manifest: populate bundle.url from config for development
- handle html comment syntax in bundle
- 0.3.6
- update ignore files
- 0.3.5
- update examples per recent changes
- update example typos/naming
- Add async api example ([#33](https://github.com/MetaMask/snaps-cli/pull/33))
- 0.3.4
- do not terminate watch on error
- Add async api example
- fixup! lint
- lint
- fix 3box ports
- Implement 3ID Provider example ([#29](https://github.com/MetaMask/snaps-cli/pull/29))
- 0.3.3
- update realms-shim
- 0.3.2
- update changelog
- handle build edge cases; example fixes
- build: handle Babel regeneratorRuntime
- update example error handling
- update readme
- update init default perms
- Clean up examples
- rename config file; rewrite ping-pong
- Add recipient address audit example
- Adds submitted-tx-hash-tracker example
- use old provider api in examples
- init touchups
- minor code reorg; init input validation
- changelog; require one known command
- 0.3.0
- add init command
- wip
- Merge branch 'master' into init
- update ses to fix vuln
- init branch
- add warnings, minor changes
- Update usage instructions
- update readme
- update changelog
- Add ipfs plugin example ([#18](https://github.com/MetaMask/snaps-cli/pull/18))
- Remove root default
- Fix serve command behavior ([#21](https://github.com/MetaMask/snaps-cli/pull/21))
- Fix example
- Specify ipfs plugin port 8086
- Removed default value
- fix example ports; update 3box
- Fix ping pong bundle location ([#19](https://github.com/MetaMask/snaps-cli/pull/19))
- Fix ping pong bundle location
- Add ipfs plugin example
- Custom token ([#17](https://github.com/MetaMask/snaps-cli/pull/17))
- fixup! require bundle url
- require bundle url
- Add rdfc to dependencies
- fix manifest bug
- Simplify ping pong
- 0.2.0
- switch to named arguments
- rename requestedPermissions to initialPermissions
- build: change eval to indirect eval
- Merge branch 'master' of github.com:MetaMask/plugin-starter
- Fix bls example
- rebuild bls
- Correct permission name
- Merge branch 'master' into req-perms
- Add prompt to BLS signature ([#11](https://github.com/MetaMask/snaps-cli/pull/11))
- bugfix
- fix requestedPermissions
- update eval-unwrap ([#8](https://github.com/MetaMask/snaps-cli/pull/8))
- bugfixes
- update manifest structure; bufixes
- Get bls-signer to a working state
- Add ping pong example ([#5](https://github.com/MetaMask/snaps-cli/pull/5))
- add .nvmrc
- add postprocessing
- Move example to examples folder ([#4](https://github.com/MetaMask/snaps-cli/pull/4))
- Refactor to use NPM conventions ([#3](https://github.com/MetaMask/snaps-cli/pull/3))
- remove most defaults, add config
- add watch, bugfixes
- use yargs, support directories, add serve
- Use 'ethereumProvider' as global
- Update README
- Commit package-lock.json
- Move bash scripts to old-bash-scripts/
- Add up to date example
- Move outdated examples to old-examples/
- Add bundling file for cli
- Add gitignore
- Add note on example to readme
- Fix formatting in readme
- bundle-plugin-basic.sh working; bundle-plugin.sh not working

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
