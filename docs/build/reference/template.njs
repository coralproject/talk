{# 
  It's important that when you're nesting markdown contents (like the
  description) embedded in HTML that you leave a blank line before and after so
  that the markdown gets parsed.
#}
<header>
  <h1>{{ name }}</h1>
  {% if description %}

  {{ description }}

  {% endif %}
</header>

{% if fields %}
## Fields

{% for field in fields %}
### `{{ field.name }}` {{ field.type.name }}

{{ field.description }}

{% endfor %}
{% endif %}