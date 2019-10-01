---
title: Integrating on your site
permalink: /v5/integrating/cms/
---

With Coral setup and running you can embed the comment stream with this sample embed script:

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
