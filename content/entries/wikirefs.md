---
title: WikiRefs
date: '2023-10-05'
layout: layouts/entry.njk
---

plugin::[[markdown-it-wikirefs]]


`[[WikiRefs]]`[^names] are a crucial part of the world of [[digital-garden|digital gardening]]. They are the basic building block of the interlinking accomplished in many gardens, including this one. They are rendered with the [[markdown-it-wikirefs]] plugin and you can check out those docs for more details.

But in short, This particular flavour of `[[wikirefs]]` includes three kinds of wiki constructs: wikiattrs, wikilinks, and wikiembeds.

_WikiAttrs_ are formalized attributes of a file. They include a descriptive attrtype and a wikilink to another file. They look `:like-this::[[wikilink]]` (with a newline after) and are rendered in the attributes box (attrbox).

_WikiLinks_ are traditional bidirectional links using the square bracket syntax and may appear anywhere in a file. There are `:typed::[[wikilinks]]` and regular untyped `[[wikilinks]]`. They are highlighted in a different color than external web links.

_WikiEmbeds_ embed the content of the linked file into the current one in-place. Markdown files may be embedded as well as images, audio, or video files.


[^names]: "wikiref" actually goes by many names: "[wikilink](https://en.wikipedia.org/wiki/Help:Link)", "[bidirectional link](https://maggieappleton.com/bidirectionals)", "[wikitext linking](https://tiddlywiki.com/#Linking%20in%20WikiText)","backlink", "[internal link](https://help.obsidian.md/How+to/Internal+link)", "humble double bracket internal link", to name only a few...
