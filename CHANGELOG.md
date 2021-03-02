# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/alexlafroscia/qunit-wait-for/compare/v2.0.0...v2.0.1) (2021-03-02)

### Bug Fixes

- re-try assertions that only temporarily throw an exception ([cebe239](https://github.com/alexlafroscia/qunit-wait-for/commit/cebe239b902e338630945691f42bd906a8380f05))

## [2.0.0](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.2.3...v2.0.0) (2021-01-04)

### ⚠ BREAKING CHANGES

- The package output is slightly different now, with a different configuration of the `package.json` pointers to different builds of the library. Because of this, the bundler consuming this library might pull in something different than before. In case that ends up being a "breaking" change, this commit is being marked as such, though in reality this should be safe for any consumers.

### Bug Fixes

- avoid deprecated QUnit extension API ([95ddfa4](https://github.com/alexlafroscia/qunit-wait-for/commit/95ddfa4b8f5688f1c59caf0f21a7a59d8ce23a91))

- replace Pika with Microbundle ([0004147](https://github.com/alexlafroscia/qunit-wait-for/commit/0004147fdd5aef2dff299ffd16ea6b456b8223e7))

### [1.2.3](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.2.2...v1.2.3) (2020-08-03)

### [1.2.2](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.2.1...v1.2.2) (2020-08-03)

### [1.2.1](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.2.0...v1.2.1) (2020-05-12)

### Bug Fixes

- avoid stubbing `pushResult` for longer than necessary ([fa4156b](https://github.com/alexlafroscia/qunit-wait-for/commit/fa4156b570980dc380b1eb33420dbcf9b7e266a0)), closes [#16](https://github.com/alexlafroscia/qunit-wait-for/issues/16)

## [1.2.0](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.1.1...v1.2.0) (2020-05-01)

### Features

- support async assertion functions ([07b4f35](https://github.com/alexlafroscia/qunit-wait-for/commit/07b4f352a82cb66497ffb08a8f3919a0441d212d))

### [1.1.1](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.1.0...v1.1.1) (2020-04-22)

### Bug Fixes

- use correct return type for `assert.waitFor` ([6f0f366](https://github.com/alexlafroscia/qunit-wait-for/commit/6f0f3666b9f9243670b01a3a53f136844a8f5e5b)), closes [#8](https://github.com/alexlafroscia/qunit-wait-for/issues/8)

## [1.1.0](https://github.com/alexlafroscia/qunit-wait-for/compare/v1.0.0...v1.1.0) (2020-04-03)

### Features

- wait for multiple assertions ([a9d2963](https://github.com/alexlafroscia/qunit-wait-for/commit/a9d29639354d90cc64f4eaabdca9e8184b395032))

## 1.0.0 (2020-03-31)

### Features

- write the library ([5b87e87](https://github.com/alexlafroscia/qunit-wait-for/commit/5b87e87307b87890702b59f22d9c8f173f7a65eb))
