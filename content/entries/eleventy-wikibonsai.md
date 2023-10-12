---
title: Eleventy-WikiBonsai
date: '2023-10-05'
layout: layouts/entry.njk
---

Eleventy-WikiBonsai is a [[digital-garden]], whose defining feature are [[wikirefs]] (aka "bidirectional link"). These are links using the `[[double-square-bracket]]` syntax to link between files within a collection of markdown files. They can be used in any and all markdown files across the site, though unique filenames are required.

[[wikibonsai]] style gardens in particular add a [[semantic-tree]], which is viewable as a sort of #tag tree called the [map-page](/map). It is built from [[index-type|index files]] whose content defines its structure using markdown lists and `[[wikirefs]]`. The files linked in the semantic tree are primarily [[entry-type|entries]] which act as concept summaries, much like a Wikipedia page. Each entry also displays back references, such as which posts link to those entries.

These syntaxes and workflows aim to make large amounts of content more easily navigable without the need for algorithms and opaque search mechanisms (though those are also generally readily accessible).
