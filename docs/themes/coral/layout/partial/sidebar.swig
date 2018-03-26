<aside class="sidebar">
  <a class="brand" href="{{ url_for("/") }}">
    <h2>
      {{ image_tag('images/logo.svg', {width: 50, height: 50}) }}
      <span>Talk</span>
    </h2>
  </a>
  <ul class="sidebar__list">
  {% for item in config.sidebar.side %}
      {% if item.url %}
        <li class="sidebar__section{% if is_current(item.url) %} active toggled{% endif %}">
            <a href="{{ url_for(item.url) }}" class="sidebar__header sidebar__header__link">{{ item.title }}</a>
        </li>
      {% else %}
        <li class="sidebar__section{% for item in item.children %}{% if is_current(item.url) %} active toggled{% endif %}{% endfor %}">
            <a href="#" class="sidebar__header">{{ item.title }}</a>
            <ul class="sidebar__links">
              {% for item in item.children %}
                <li class="{% if is_current(item.url) %}active{% endif %}">
                  <a href="{{ url_for(item.url) }}">{{ item.title }}</a>
                </li>
              {% endfor %}
            </ul>
        </li>
      {% endif %}
    {% endfor %}
  </ul>


  <div class="notice">
    <p>Don't see what you're looking for? We're upgrading the docs, check out our <a href="https://github.com/coralproject/talk/tree/ef49d9a3d2acc4d2fc03b00e0c872dfbc57f005a/docs/_docs" target="_blank" class="coral-link-invert">old docs</a>.</p>
    <p><a href="https://coralproject.net/" class="coral-link-invert" target="_blank">The Coral Project</a> from Mozilla</p>
    <a href="https://www.mozilla.org/" target="_blank" title="Mozilla"><figure class="mozilla" alt="Mozilla">{{ image_tag('images/moz-logo-bw-rgb.svg') }}</figure></a>
  </div>
</aside>
<div class="sidebar__backdrop"></div>