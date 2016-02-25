0.1.4 / 2016-02-25
==================

- Added a shim for a reduced version of `String.endsWith`
- Replaced regular expression used for HTML comment front matter (i.e. `<!--- ... --->`)
- Added image redirection for content
- When `index.html` is present in the URL, remove it
- Flushed out the documentation a little bit better (not great yet)


0.1.3 / 2016-02-22
==================

- Made the `article` selector fully customizable via the `blender.selector` parameter


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
