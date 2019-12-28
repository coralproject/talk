---
title: Integrating on your site
permalink: /v5/integrating/cms/
---

With Coral setup and running locally you can find your **Embed code** under **Configure** > **Advanced** (logged in as an ADMIN). It should look something like this, but with your domain in place of `CORAL_DOMAIN_NAME`. You can test placing the comment stream embed on your page with this sample embed script:

```
<div id="coral_thread"></div>
<script type="text/javascript">
(function() {
    var talk = document.createElement('script'); talk.type = 'text/javascript'; talk.async = true;
    var url = '{{ CORAL_DOMAIN_NAME }}';
    talk.src = '//' + url + '/assets/js/embed.js';
    talk.onload = function() {
        Coral.createStreamEmbed({
            id: "coral_thread",
            autoRender: true,
            rootURL: '//' + url,
        });
    };
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(talk);
})();
</script>
```

> **NOTE:** Replace the value of `{% raw %}{{ CORAL_DOMAIN_NAME }}{% endraw %}` with the location of your running instance of Coral.


## Story Creation

Lazy `Story` Creation enables stories to be automatically created when they are published from your CMS. Triggering the embed script above renders the comment stream iFrame on your page. By default that script dynamically generates `Stories` in Coral for seamless integration.

### storyURL

If you do not specify a `storyURL` when rendering the embed, the `storyURL` is first inferred from the Canonical link element, which takes the form of a <link> element in your <head> of the page:
```
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

See [GraphQL API Overview](/v5/api/overview) for help with the API. 


 