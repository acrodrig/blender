Blender
=======

A dynamic almost-static Blog Aware page non-generator (based on GitHub Pages).

Drop a suitable blender `index.html` page into a Jekyll structure and get an instant blog with Markdown rendering,
code highlighting, latex math and full control.


## Table of Contents

- [Why Blender](#why-blender)
- [Demo](#demo)
- [Known Limitations](#known-limitations)
- [Testing Bind](#testing-bind)
- [Contributing](contributing)
- [License](license)


## Why Blender

TBW


## Demo

TBW


## Configuration

There are various variables that configure how blender will work. They are:

Variable | Default | Description
--- | --- | ---
`branch` | `master` | Branch to use from reposotory `repo`
`index` | `` | If there is no URL, load this page similar to the way servers serve `index.html` if there is no document
`path` | `` | Additional path to add to repository `repo`
`relative` | `false` | Use relative URLs (instead of going to `raw.githubusercontent.com` (very useful for development)
`repo` | `/acrodrig/acrodrig.github.io` | Repository where the data is stored

They can be set either by adding an additional attribute to the `script` tag or by setting them in the `blender` object.
The snippet below shows a configuration of `branch` via the first method and `repo` via the second method.

```html
<script src="//acrodrig.github.io/include/dist/blender-0.1.0.min.js" branch="test"></script>
<script>
    blender.repo = "/acrodrig/acrodrig.github.io";
</script>
```


## Known Limitations

SEO for non JS search engines (i.e. Bing and Yahoo).


## Testing Blender


## Contributing

Do the usual GitHub fork and pull request dance. Add yourself to the
contributors section of [package.json] too if you want to.


## License

Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
