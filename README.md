# eleventy-wikibonsai

[![A WikiBonsai Project](https://img.shields.io/badge/%F0%9F%8E%8B-A%20WikiBonsai%20Project-brightgreen)](https://github.com/wikibonsai/wikibonsai)

An [11ty base blog](https://github.com/11ty/eleventy-base-blog) with [wikibonsai](https://github.com/wikibonsai/wikibonsai) support.

You can see the live demo [here](https://eleventy-wikibonsai.netlify.com/).

💐 Display your [🎋 WikiBonsai](https://github.com/wikibonsai/wikibonsai) digital garden for others.

## Getting Started

### 1. Clone this Repository

```
git clone https://github.com/wikibonsai/eleventy-wikibonsai.git my-blog-name
```

### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `.eleventy.js` to see if you want to configure any Eleventy options differently.

### 3. Install dependencies

```
npm install
```

### 4. Run

```
npx @11ty/eleventy
```

Or build and host locally for local development

```
npx @11ty/eleventy --serve
```

Or build automatically when a template changes:

```
npx @11ty/eleventy --watch
```

Or in debug mode:

```
DEBUG=* npx @11ty/eleventy
```

## 🪴 Project Structure

Inside of your Astro-Wikibonsai project, you'll see the following folders and files:

```text
├── _data/
├── _includes/
│   └── layouts/
├── content/
├── css/
├── img/
├── wikibonsai/
├── .eleventy.js
├── .eleventyignore
├── README.md
└── package.json
```

- `about/index.md` shows how to add a content page.
- `posts/` has the blog posts but really they can live in any directory. They need only the `post` tag to be added to this collection.
- Use the `eleventyNavigation` key in your front matter to add a template to the top level site navigation. For example, this is in use on `index.njk` and `about/index.md`.
- Content can be any template format (blog posts needn’t be markdown, for example). Configure your supported templates in `.eleventy.js` -> `templateFormats`.
- The `css` and `img` directories in the input directory will be copied to the output folder (via `addPassthroughCopy()` in the `.eleventy.js` file).
- The blog post feed template is in `feed/feed.njk`. This is also a good example of using a global data files in that it uses `_data/metadata.json`.
- This example uses three layouts:
  - `_includes/layouts/base.njk`: the top level HTML structure
  - `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  - `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
- `_includes/postlist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `index.njk` has an example of how to use it.

## 🧚 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run bench`           | Run benchmarks                                   |
| `npm run watch`           | Preview your build locally, watch for changes    |
| `npm run serve`           | Starts local dev server at `localhost:4321`      |
| `npm run start`           | Preview your build locally, before deploying     |
| `npm run debug`           | Run in debug mode                                |

## 👀 Want to learn more?

Check out the [eleventy documentation](https://www.11ty.dev/docs/local-installation/) or [WikiBonsai documentation](https://github.com/wikibonsai/wikibonsai/).
