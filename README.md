<img src="http://acrodrig.github.io/blender/biomass.svg" width="64"> Blender
============================================================================

A dynamic almost-static Blog Aware page non-generator (based on GitHub Pages). This is **work in progress**.
Consider the documentation to be on-going and the code to be **alpha** at best.

![demo](demo.png#screenshot)

Drop a suitable blender `index.html` page into a Jekyll structure and get an instant blog with Markdown rendering,
code highlighting, latex Math and no static generation building phase.


## Table of Contents

- [Why Blender](#why-blender)
- [How](#how)
- [Demo](#demo)
- [Features](#features)
- [Configuration](#configuration)
- [Known Limitations](#known-limitations)
- [Testing Blender](#testing-blender)
- [Contributing](contributing)
- [License](license)


## Why Blender

I like writing in Markdown. I like [Jekyll](https://jekyllrb.com) and [Ghost](https://ghost.org). But I dislike
page generators (reverse wink to Jekyll), they feel like a throwback to a 1960's C make file. And I would love to get away with
having no server (reverse wink to Ghost). So Blender is an attempt to merge these two seemingly contradictory goals. The
guidelines:

- Keep Jekyll's nice structure (posts go in `_posts` and so forth) and [front matter](http://jekyllrb.com/docs/frontmatter/)
- Use a [client side router](http://fdietz.github.io/recipes-with-angular-js/backend-integration-with-node-express/implementing-client-side-routing.html) to manage URL addresses
- If possible store your website in [GitHub Pages](https://pages.github.com) (although not a requirement) so that we can use the search API
- Write content in Markdown or HTML
- Allow for client side plugins (meaning, as long as it is reachable on the net, it can be a plugin)


## How

The main idea behind Blender is to have a single page app that acts as a router for a blog, a wiki or a website. As such it
is really a client side router with some conventions as to where to store metadata (i.e. front matter) and how to list
files (i.e. Github API).


## Demo

My blog [R@ndomCurve](http://randomcurve.com) is a good demo. It demonstrates several of the capabilities of Blender. It
is hosted on Github Pages, it uses its API, it can display Math (via [MathJax](https://www.mathjax.org)), it is Google SEO
friendly (AFAIK Bing or other search engines cannot index dynamic pages yet).

There is a more bare bones demo in the test page for this project: [demo.html](/test/demo.html) with a small Table of Contents
(TOC) plugin in [toc.html](/test/toc.html). The nice thing about this demo is that
representative Jekyll websites.



## Features

- [Routing](#routing)
- [Static Pages](#static-pages)
- [Cross Browser](#cross-browser)
- [Layouts](#layouts)
- [Front Matter](#front-matter)
- [Math](#math)
- [Private GitHub Pages](#private-github-pages)


### Routing

The routing is all done via the hash or [Fragment Identifier](https://en.wikipedia.org/wiki/Fragment_identifier), in a way
similar to Angular. Fragment Identifiers start with the hash mark. For example, take the following URL:

```
http://www.randomcurve.com/#:_pages/about.md
```

The fragment identifier is: `#:_pages/about.md`. Blender interprets fragment identifiers starting with `#:` as URL routing. As
such, the URL above is pointing to the Markdown page `_posts/about.md`.

What happens is that the contents of that page are going to be fetched, parsed as Markdown, transformed to HTML an inserted
into the first `article` tag (can be parameterized via `blender.selector`, see below) in the page.


### Static Pages

All pages reside in a file hierarchy structure, such as the one provided by Github pages or an [AWS S3](https://aws.amazon.com/s3/)
bucket. There are two very important requirements to be able to structure the dynamic pages:

- **Listing**: there must be a way to do a directory listing (such as GitHub API or S3 XML BucketList)
- **CORS**: the files must be accessible via CORS (if they do not reside in the same domain)


### Cross Browser

As long as the browser supports CORS (Chrome, Firefox, IE9+, Opera, Safari), Blender is cross-browser compatible.


### Layouts

Layouts are a little different in Blender that they are in Jekyll. Instead of a layout being a full HTML page that must
be rendered, a `layout` attribute is added to the `body` of the document. If there is no layout property in the front matter
(or no front matter) then the layout is assumed to be `default`. Then the layout is nothing more than an attribute
and can be implemented via CSS in one of two ways (I prefer the first one). Both of them can be considered best
practices and not Blender supported.

##### 1. Layout Page Attributes

Different parts of the main page can shown based on the layout property via CSS. Using the following CSS rules:

```css
body[layout=default] [layout]:not([layout=default]) { display: none; }
body[layout=page] [layout]:not([layout=page]) { display: none; }
body[layout=post] [layout]:not([layout=post]) { display: none; }
```

And different parts of the page can be tagged with their specific layout. For example, if we want a *Table Of Contents* (TOC)
plugin to be visible only for blog posts, when we can tag in the following way:

```html
<div class="toc" layout="post">
  <ul>
    <!-- ... -->
  </ul>
</div>
```

##### 2. CSS Rules per Layout

The other option is to have things appear and dissapear based on the style:

```css
body[layout=default] div.toc { display: none; }
/* Other `default` layout rules ... */

body[layout=post] div.toc { display: block; }
/* Other `post` layout rules ... */
```


### Front Matter

Blender accepts the usual [Front Matter](http://jekyllrb.com/docs/frontmatter/) format.

```yaml
---
layout: post
title: Blogging Like a Hacker
---
```

And a format with enclosed in HTML comments.

```html
<!---
layout: post
title: Blogging Like a Hacker
--->
```

The latter is useful if you do not want it to show while rendering Markdown.


### Private Github Pages

Since we point at a directory, a nice unexpected consequence of Blender is that all of a sudden you can have private
GitHub pages (or pages of a private reposity that only work based on Github access in the browsre). Pretty sweet.


## Configuration

There are various variables that configure how blender will work. They are:

Variable | Default | Description
--- | --- | ---
`branch` | `"master"` | Branch to use from reposotory `repo`
`index` | *`<empty-string>`* | If there is no URL, load this page similar to the way servers serve `index.html` if there is no document
`path` | *`<empty-string>`* | Additional path to add to repository `repo`
`relative` | `false` | Use relative URLs (instead of going to `raw.githubusercontent.com` (very useful for development)
`repo` | `"/acrodrig/acrodrig.github.io"` | Repository where the data is stored
`selector` | `"article"` | Repository where the data is stored

They can be set either by adding an additional attribute to the `script` tag or by setting them in the `blender` object.
The snippet below shows a configuration of `branch` via the first method and `repo` via the second method.

```html
<!-- Configure Blender via script attributes -->
<script src="//acrodrig.github.io/include/dist/blender-0.1.0.min.js" branch="test"></script>
<script>
  // Configure Blender via Javascript
  blender.repo = "/acrodrig/acrodrig.github.io";
</script>
```

Blender can be hosted anywhere, but since GitHub Pages is pretty popular, I decided to re-use the Jekyll structure


## Known Limitations

SEO for non JS search engines (i.e. Bing and Yahoo).


## Testing Blender

Use the [demo.html](/test/demo.html) page.


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
