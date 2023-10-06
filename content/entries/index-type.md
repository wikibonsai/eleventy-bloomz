---
title: Index DocType
date: '2023-10-05'
layout: layouts/entry.njk
---

Index documents are the primary method of structuring the [[semantic-tree]]. They are one of the central document types to this template (besides [[entry-type]]s and [[post-type]]s).

### Navigate

- Via the [[map-page]].
- Via [[wikirefs]].

### Markdown

Index files build the [[semantic-tree]], which can be viewed on the [[map-page]]. They are placed in the `./content/index/` directory and each file should contain a markdown outline with [[wikirefs]] that typically point to [[entry-type]]s (but can point to any [[doctype]]). They may or may not contain yaml [[frontmatter]].

Documents should look like this (minus comments):

(escape chars '\\' added to ensure raw text display)

```markdown
// file: i.bonsai.md

- [[bk.how-to-read-a-book]]
  - [[read]]
    - [[4-levels-of-reading]]
      - [[elementary-reading]]
      - [[inspectional-reading]]
      - [[analytical-reading]]
      - [[syntopical-reading]]
```

The tree may also be broken up into multiple index files:

```markdown
// file: i.bonsai.md

- [[bk.how-to-read-a-book]]
  - [[i.read]]
```

```markdown
// file: i.read.md

- [[4-levels-of-reading]]
  - [[elementary-reading]]
  - [[inspectional-reading]]
  - [[analytical-reading]]
  - [[syntopical-reading]]
```

Both of the above examples will generate a tree that looks like this:

```markdown
i.bonsai
└── bk.how-to-read-a-book
    └── i.read
        └── 4-levels-of-reading
          ├── elementary-reading
          ├── inspectional-reading
          ├── analytical-reading
          └── syntopical-reading
```
