---
title: SEO
---

## Google Web Vitals

As of May 2021, Google includes [page experience metrics](https://developers.google.com/search/blog/2020/11/timing-for-page-experience) in their search ranking algorithm.

One of the aspects contributing to page experience is Cumulative Layout Score, or CLS. As Coral embeds are rendered after the initial render and are dynamically sized, they _may_ contribute to layout shifts, but in our experience Coral usually has a minimal impact on CLS. Google only counts layout shifts [on visible elements](https://web.dev/cls/#layout-shifts-in-detail), and Coral is most likely to only impact the position of elements that are below the bottom of the viewport.

If you are concerned about CLS and want to ensure that Coral does not cause layout shifts, you may want to set a minimum height on the element Coral is rendered into, to reserve space for the embed.

## Links in comments

To prevent spam, by default all links shared in Coral comments will have a [rel=nofollow](https://developers.google.com/search/docs/advanced/guidelines/qualify-outbound-links) attribute added to them.

## Search Snippets

Coral use the [data-nosnippet](https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr) attribute to prevent search engines from including comment content in search previews content.
