const fs = require("fs");
const path = require("path");
const glob = require("glob");

const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItWikiRefs = require("markdown-it-wikirefs");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");

const buildBonsai = require('./wikibonsai/semtree');
const wikirefs = require('wikirefs');
const buildWikirefsOpts = require('./wikibonsai/wikirefs');


module.exports = function(eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  }

  eleventyConfig.addFilter("filterTagList", filterTagList);

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  //////////////////////////
  // wikibonsai additions //
  //////////////////////////

  ////
  // markdown wikirefs

  // Customize Markdown library and settings:
  let markdownLibrary;
  markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#"
    }),
    level: [1,2,3,4],
    slugify: eleventyConfig.getFilter("slugify")
  }).use(markdownItWikiRefs, {
    ...buildWikirefsOpts(markdownLibrary),
    // wikiembed note:
    // - 'markdownLibrary' _must_ be declared before assigning it to the markdown-it
    //   instance, and before the 'resolveEmbedContent' function usage.
    // - the 'resolveEmbedContent' function definition needs to be near the
    //   'markdownLibrary' instance so 'markdownLibrary.render()' can be recursively called
    resolveEmbedContent: (env, fname) => {
      // markdown-only
      if (wikirefs.isMedia(fname)) { return; }
      // cycle detection
      if (!env.cycleStack) {
        env.cycleStack = [];
      } else {
        if (env.cycleStack.includes(fname)) {
          delete env.cycleStack;
          return '♻️ cycle detected';
        }
      }
      env.cycleStack.push(fname);
      // get content
      let htmlContent;
      let doc = env.collections.all.find((doc) => {
        return (fname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      // default case
      try {
        const mkdnContent = fs.readFileSync(doc.inputPath, { encoding: 'utf8', flag: 'r' });
        if (mkdnContent === undefined) {
          htmlContent = undefined;
        } else if (mkdnContent.length === 0) {
          htmlContent = '';
        } else {
          htmlContent = markdownLibrary.render(mkdnContent, env);
        }
      // zombie (or error) case
      } catch (e) {
        console.warn(e);
        htmlContent = '🧟';
      }
      delete env.cycleStack;
      return htmlContent;
    },
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // collections
  eleventyConfig.addCollection("index", function(collectionApi) {
    // get unsorted items
    return collectionApi.getFilteredByGlob("./index/**/*.md");
  });
  eleventyConfig.addCollection("entries", function(collectionApi) {
    // get unsorted items
    return collectionApi.getFilteredByGlob("./entries/**/*.md");
  });

  // semtree bonsai
  // attach to global data
  const bonsai = buildBonsai();
  eleventyConfig.addGlobalData("root", () => {
    // returning as an array of length 1 since
    // 'branch.njk' include requires a nodes parameter
    return [bonsai.tree.find((node) => node.text == bonsai.root)];
  });
  eleventyConfig.addGlobalData("tree", () => {
    return bonsai.tree;
  });
  // provide nunjucks filter to retrieve node url
  function findNodeUrl(files, text) {
    const indexFile = new RegExp(text + '\.md', 'i');
    const nodeFile = (files || []).find(file => indexFile.test(file.inputPath));
    return nodeFile ? nodeFile.url : '';
  }
  function getNode(fname) {
    return bonsai.tree.filter((node) => node.text === fname);
  }
  function getNodes(fnames) {
    return bonsai.tree.filter((node) => fnames.includes(node.text));
  }
  eleventyConfig.addFilter("findNodeUrl", findNodeUrl);
  eleventyConfig.addFilter("getNode", getNode);
  eleventyConfig.addFilter("getNodes", getNodes);

  //////////////////////////

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
  };
};
