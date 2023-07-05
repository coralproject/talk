---
title: Integrating on your site
---

With Coral setup and running locally you can find your **Embed code** under **Configure** > **Organization** > **Site Details** (when logged in as an ADMIN). It should look something like this, but with your domain in place of `CORAL_DOMAIN_NAME`. You can test placing the comment stream embed on your page with this sample embed script:

```html
<div id="coral_thread"></div>
<script type="text/javascript">
  (function () {
    var d = document,
      s = d.createElement("script");
    var URL = "{{ CORAL_DOMAIN_NAME }}";
    s.src = "//" + URL + "/assets/js/embed.js";
    s.async = false;
    s.defer = true;
    s.onload = function () {
      Coral.createStreamEmbed({
        id: "coral_thread",
        autoRender: true,
        rootURL: "//" + URL,
      });
    };
    (d.head || d.body).appendChild(s);
  })();
</script>
`;
```

## Options

Options object for `createStreamEmbed`:

- `id` - [string] _(required)_: ID of a DOM element on the page into which the comment stream will be rendered.
- `rootURL` - [string] _(required)_: The root URL of the coral installation.
- `storyID` - [string] _(optional)_: ID for the story. May alternately specify via `storyURL` or allow Coral to scrape and determine automatically. If used without a `storyURL`, the comment stream will use the canonical URL of the page it's running on as the `storyURL`.
- `storyURL` - [string] _(optional)_: URL for the story. May alternately specify via `storyID` or allow Coral to scrape and determine automatically.
- `accessToken` - [string] _(optional)_: Access token to log in a user via [SSO](/sso).
- `refreshAccessToken` - [function] _(optional)_: Callback to obtain a new access token when the current one has expired. A parameter `nextAccessToken` is passed as the first argument that should be called with the next access token.
- `containerClassName` - [string] _(optional)_: HTML class name to add to the container of the stream embed for CSS targeting.
- `customCSSURL` - [string] _(optional)_: URL for a custom stylesheet to be included for this stream. To configure a custom stylesheet for _all_ streams, see advanced configuration options in the admin.
- `customFontsCSSURL` - [string] _(optional)_: URL for a custom stylesheet with font-face definitions to be included for this stream. To configure a custom stylesheet for _all_ streams, see advanced configuration options in the admin.
- `autoRender` - [boolean] _(optional)_: Render the comment stream automatically when the element is scrolled into the viewport
- `amp` - [boolean] _(optional)_: enable support for [Accelerated Mobile Pages](/amp)

> **NOTE:** Replace the value of `{{ CORAL_DOMAIN_NAME }}` with the location of your running instance of Coral.

## Story Creation

Lazy `Story` Creation enables stories to be automatically created when they are published from your CMS. Triggering the embed script above renders the comment stream embed on your page. By default that script dynamically generates `Stories` in Coral for seamless integration.

### storyURL

If you do not specify a `storyURL` when rendering the embed, the `storyURL` is first inferred from the Canonical link element, which takes the form of a `<link>` element in your `<head>` of the page:

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

The URL must reference an existing Permitted Domain. If your articles/stories always have unique URLs, then you will not need to modify the default behavior.

If this tag is not present, or if the canonical URL references a different URL than your site such as a wire service, you can specify the `storyURL` parameter in the render function.

The URL will be used by Coral to build user facing links, and should reference the location where you would direct a user back to this particular story or article.

### storyID

To more tightly couple Coral with your CMS you can provide your CMS's unique identifier to Coral by including a `storyID` parameter in the render function. Doing so will allow you to target the `Story` for later updates via Coral's Graphql API, such as updating the URL if it changes.

Instructions for integrating the API are at https://docs.coralproject.net/api/schema and the mutation to call for URL updates is https://docs.coralproject.net/api/mutations/update-story

## Integration via API

Story creation can also be controlled by direct calls to Coral's API. When Lazy Story Creation is disabled embed streams can only be created by data migration or API POST request.

See [GraphQL API Overview](/api/schema) for help with the API.

## Story Scraping

By default, stories have their metadata scraped when they are loaded. This provides the easiest way for newsrooms to integrate their CMS’s into Coral in a simple way. We use the meta tags in the table below on the target pages to allow us to extract some properties.

Metadata scraping is performed by the `scraper` job which is enabled by default. If you see story Titles in the **Stories** list as `Not available`, this likely means the story could not be scraped automatically. Try re-running the scraper job by selecting `Re-scrape` from the menu in the **Actions** column.

If your production site is behind a paywall or otherwise prevents scraping, you might need to configure a **Scraper Proxy URL**. When specified it allows scraping requests to use the provided proxy. All requests are then passed through the appropriate proxy as parsed by the npm proxy-agent package. A Scraper Proxy URL can be added in the coral Admin under "CONFIGURE" -> "Advanced" -> "Story creation".

If your story URL returns an HTTP response status code other than 200 (as when it returns a [300-399] "redirect" code), the scraper cannot retrieve metadata. To see what response code your story URL is returning, use: `curl -I <storyURL>`

| Asset Property     | Selector                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | See [`metascraper-title`](https://github.com/microlinkhq/metascraper/blob/master/packages/metascraper-title/index.js)             |
| `description`      | See [`metascraper-description`](https://github.com/microlinkhq/metascraper/blob/master/packages/metascraper-description/index.js) |
| `image`            | See [`metascraper-image`](https://github.com/microlinkhq/metascraper/blob/master/packages/metascraper-image/index.js)             |
| `author`           | See [`metascraper-author`](https://github.com/microlinkhq/metascraper/blob/master/packages/metascraper-author/index.js)           |
| `publication_date` | See [`metascraper-date`](https://github.com/microlinkhq/metascraper/blob/master/packages/metascraper-date/index.js)               |
| `modified_date`    | `meta[property="article:modified"]`                                                                                               |
| `section`          | `meta[property="article:section"]`                                                                                                |

You can debug story scraping for your stories using the [GraphQL API debugScrapeStoryMetadata](https://docs.coralproject.net/api/queries/debug-scrape-story-metadata) query.
