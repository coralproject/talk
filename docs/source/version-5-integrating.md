---
title: Integrating on your site
permalink: /v5/integrating/cms/
---

With Coral setup and running locally you can test embeding the comment stream with this sample embed script:

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
