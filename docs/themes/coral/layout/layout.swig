<!DOCTYPE html>
<html lang="en">
  {{ partial('partial/head') }}
  <body>
    <div>
      <div>

        {{ partial('partial/sidebar') }}

        <main class="content" role="main">
          {{ partial('partial/header') }}

          {% block content %}
            {{ body }}
          {% endblock %}

        </main>

        {{ partial('partial/footer') }}

      </div>
    </div>


  </body>
</html>