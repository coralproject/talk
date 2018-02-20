<article{% if page.class %} class="{{ page.class }}"{% endif %}>
  {% if page.title %}
  <a class="btn btn-sm btn-light float-right suggest-edits plain-link" href="https://github.com/coralproject/talk/edit/master/docs/source/{{ page.source }}" title="Suggest edits to this page">Suggest Edits</a>
  <h1>{{ page.title }}</h1>
  <hr/>
  {% endif %}

  {% if page.toc === true %}
  <aside>
    <nav class="toc" markdown="1">
    {% if page.toc_title %}
      <header>
        <h4 class="nav__title">{{ page.toc_title }}</h4>
      </header>
    {% endif %}
    {{ oltoul(toc(page.content, {list_number: false})) }}
    </nav>
  </aside>
  {% endif %}

  {{ page.content }}

</article>