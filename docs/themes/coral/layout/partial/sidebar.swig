<aside class="sidebar">
  <div>
    <a class="brand" href="{{ url_for("/") }}">
      {{ image_tag('images/coralproject.png') }}
    </a>
    <ul class="sidebar__list">
    {% for item in config.sidebar.side %}
        {% if item.url %}
          <li class="sidebar__section{% if is_current(item.url) %} active toggled{% endif %}">
              <a href="{{ url_for(item.url) }}" class="sidebar__header sidebar__header__link">{{ item.title }}</a>
          </li>
        {% else %}
          <li class="sidebar__section{% for item in item.children %}{% for item in item.children %}{% if is_current(item.url) %} active toggled{% endif %}{% endfor %}{% endfor %}">
              <a href="#" class="sidebar__header">{{ item.title }}</a>
              <ul class="sidebar__headers">
                {% for item in item.children %}
                  <li class="sidebar__subsection{% for item in item.children %}{% if is_current(item.url) %} active toggled{% endif %}{% endfor %}">
                      <a href="#" class="sidebar__header">{{ item.title }}</a>
                      <ul class="sidebar__links">
                        {% for item in item.children %}
                          <li class="{% if is_current(item.url) %}active{% endif %}">
                            <a href="{{ url_for(item.url) }}">{{ item.title }}</a>
                          </li>
                        {% endfor %}
                      </ul>
                  </li>
                {% endfor %}
              </ul>
          </li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>


  <div class="notice">
    <p>Made by <a href="https://coralproject.net/" class="coral-link-invert" target="_blank">The Coral Project</a> by <a href="https://www.voxmedia.com/" class="coral-link-invert" target="_blank" title="Vox Media">Vox Media</a>.</p>
    <a href="https://www.voxmedia.com/" target="_blank" title="Vox Media"><figure class="voxmedia" alt="Vox Media">{{ image_tag('images/voxmedia.svg') }}</figure></a>
  </div>
</aside>
<div class="sidebar__backdrop"></div>
