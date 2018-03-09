<aside>
<nav class="toc">
{% if include.title %}<header><h4 class="nav__title">{{ include.title }}</h4></header>{% endif %}
<%- toc(page.content) %>
</nav>
</aside>