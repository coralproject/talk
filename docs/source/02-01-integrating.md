---
title: Integrating on your site
permalink: /v5/integrating/cms/
---

With Coral setup and running locally you can find your **Embed code** under **Configure** > **Organization** > **Site Details** (when logged in as an ADMIN). It should look something like this, but with your domain in place of `CORAL_DOMAIN_NAME`. You can test placing the comment stream embed on your page with this sample embed script:

```
<div id="coral_thread"></div>
<script type="text/javascript">
  (function() {
      var d = document, s = d.createElement('script');
      var url = '{{ CORAL_DOMAIN_NAME }}';
      s.src = '//' + url + '/assets/js/embed.js';
      s.async = false;
      s.defer = true;
      s.onload = function() {
          Coral.createStreamEmbed({
              id: "coral_thread",
              autoRender: true,
              rootURL: '//' + url,
          });
      };
      (d.head || d.body).appendChild(s);
  })();
</script>`;
```

> **NOTE:** Replace the value of `{% raw %}{{ CORAL_DOMAIN_NAME }}{% endraw %}` with the location of your running instance of Coral.


## Story Creation

Lazy `Story` Creation enables stories to be automatically created when they are published from your CMS. Triggering the embed script above renders the comment stream iFrame on your page. By default that script dynamically generates `Stories` in Coral for seamless integration.

### storyURL

If you do not specify a `storyURL` when rendering the embed, the `storyURL` is first inferred from the Canonical link element, which takes the form of a <link> element in your <head> of the page:
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="canonical" href="https://example.com/page" />
  </head>
  <body>
    ...
  </body>
</html>
```

The url must reference an existing Permitted Domain. If your articles/stories always have unique urls, then you will not need to modify the default behavior.

If this tag is not present, or if the canonical URL references a different url than your site such as a wire service, you can specify the `storyURL` parameter in the render function. 

The url will be used by Coral to build user facing links, and should reference the location where you would direct a user back to this particular story or article. 

### storyID

To more tightly couple Coral with your CMS you can provide your CMS's unique identifier to Coral by including a `storyID` parameter in the render function. Doing so will allow you to target the `Story` for later updates via Coral's Graphql API, such as updating the URL if it changes.

## Integration via API

Story creation can also be controlled by direct calls to Coral's API. When Lazy Story Creation is disabled embed streams can only be created by data migration or API POST request. 

See [GraphQL API Overview](/talk/v5/api/overview/) for help with the API. 

## Story Scraping

By default, stories have their metadata scraped when they are loaded. This provides the easiest way for newsrooms to integrate their CMS’s into Coral in a simple way. We use the following meta tags on the target pages that allow us to extract some properties.

Metadata scraping is performed by the `scraper` job which is enabled by default. 

If your production site is behind a paywall or otherwise prevents scraping, you might need to confiugre a **Scraper Proxy URL**. When specified it allows scraping requests to use the provided proxy. All requests are then passed through the appropriote proxy as parsed by the npm proxy-agent package.

| Asset Property     | Selector |
|--------------------|----------|
| `title`            | See [`metascraper-title`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-title/index.js) |
| `description`      | See [`metascraper-description`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-description/index.js) |
| `image`            | See [`metascraper-image`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-image/index.js) |
| `author`           | See [`metascraper-author`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-author/index.js) |
| `publication_date` | See [`metascraper-date`](https://github.com/microlinkhq/metascraper/blob/dc664c37ea1b238b1e3e9d5342edfacc9027892c/packages/metascraper-date/index.js) |
| `modified_date`    | `meta[property="article:modified"]` |
| `section`          | `meta[property="article:section"]` |

 
