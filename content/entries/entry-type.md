---
title: Entry DocType
date: '2023-10-05'
layout: layouts/entry.njk
---

Like in a dictionary, encylopedia, or wikipedia, entries are one of the central document types to this template (besides [[index-type]]s and [[post-type]]s). They are atomic concepts and ideas that are meaningfully [[wikirefs|linked]] so as to understand how those concepts relate to one another.

The breadcrumb trail is formed by the current entry's position in the [[semantic-tree]]. And footer links are built from both its position in the tree as well as the fore and back [[wikirefs]].

### Markdown

Entries will typically contain frontmatter and/or wikiattrs, and markdown text respectively:

```markdown
---
frontmatter: attributes
---

:type::[[wikiattr]]

Then follows the rest of the text for the document, 
some of which might contain some more [[wikilinks]].
```
