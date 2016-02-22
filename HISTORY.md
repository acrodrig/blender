0.1.2 / 2016-02-22
==================

- Changed way to create events so that is compatible with IE9+ (via `createEvent`)
- The regular expression `/^<?[-!]--([^]+?)--[->]$/` does not work in IE (specifically changed `[^]` for `[\s\S]`)
- Removed use of `endsWith` because IE does not support it
- Added small TOC plugin example via `toc.html` in the `demo` directory


0.1.1 / 2016-02-10
==================

- Defined configuration variables
- Make `index` variable optional


0.1.0 / 2016-02-10
==================

- Initial release
