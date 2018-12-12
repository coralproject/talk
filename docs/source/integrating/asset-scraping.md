---
title: Asset Scraping
permalink: /integrating/asset-scraping/
---

By default, Assets in Talk have their metadata scraped when they are loaded.
This provides the easiest way for newsrooms to integrate their CMS's into Talk
in a simple way. We use the following
[meta tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) on
the target pages that allow us to extract some properties.

| Asset Property     | Selector |
|--------------------|----------|
| `title`            | See [`metascraper-title`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-title/index.js) |
| `description`      | See [`metascraper-description`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-description/index.js) |
| `image`            | See [`metascraper-image`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-image/index.js) |
| `author`           | See [`metascraper-author`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-author/index.js) |
| `publication_date` | See [`metascraper-date`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-date/index.js) |
| `modified_date`    | `meta[property="article:modified"]` |
| `section`          | `meta[property="article:section"]` |

You can use the `./bin/cli assets debug <url>` to print the scraped metadata
from that URL. For example:

```bash
 $ ./bin/cli assets debug https://www.washingtonpost.com/technology/2018/10/30/apple-event-october-ipad-pro-macbook-air/
┌──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Property         │ Value                                                                                                                                                                            │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ title            │ Apple redesigns the iPad Pro, breathes new life in the MacBook Air                                                                                                               │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ description      │ Apple is unveiling new iPads and MacBooks at an event in New York starting at 10 a.m. Fowler is there and will report in with the news and hands-on analysis throughout the day. │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ image            │ https://www.washingtonpost.com/resizer/JAwNQE2alL2JjiWrbXeJ46wZHqA=/1484x0/arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/G5TWBFW4LAI6RC5MX7QB7TODUY.jpg          │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ author           │ Geoffrey A. Fowler                                                                                                                                                               │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ publication_date │ 2018-10-30T10:40:00.000Z                                                                                                                                                         │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ modified_date    │                                                                                                                                                                                  │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ section          │                                                                                                                                                                                  │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```