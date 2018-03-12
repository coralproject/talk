<header class="header">
  <form class="search d-flex align-items-center">
    <input type="search" class="form-control" id="search-input" placeholder="Search documentation..." aria-label="Search for..." autocomplete="off">
    <nav class="header__nav">
      {% for item in config.sidebar.top %}
      <a target="_blank" rel="nofollow noreferer" alt="{{ item.title }}" href="{{ item.url }}">{{ item.title }}</a>
      {% endfor %}
      <a href="#" alt="Toggle Sidebar" id="sidebar-toggle"><i class="material-icons">menu</i></a>
    </nav>
  </form>
</header>