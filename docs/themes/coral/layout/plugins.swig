<article class="{% if page.class %}{{ page.class }} {% endif %}clearfix">
    {% if page.title %}
        <a class="btn btn-sm btn-light float-right suggest-edits plain-link" href="https://github.com/coralproject/talk/edit/master/docs/source/{{ page.source }}" title="Suggest edits to this page">Suggest Edits</a>
        <h1>{{ page.title }}</h1>
        <hr/>
    {% endif %}

    {{ page.content }}

    <div class="form-group mt-5">
        <div class="clearfix">
            <label for="exampleInputEmail1">Plugin Search</label>
            <div class="text-muted float-md-right" id="plugin-list-count">{{ site.data[page.data].length }} plugins</div>
        </div>
        <input type="text" class="form-control" id="plugin-search-input" aria-describedby="pluginSearchHelp">
        <small id="pluginSearchHelp" class="form-text text-muted">Enter a few keywords about the plugin to filter the list</small>
    </div>

    <div class="row plugins">
        {% for plugin in _.sortBy(site.data[page.data], 'name') %}
            <div class="col-sm-6 plugin d-block">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title"><a class="coral-link" href="{% if !plugin.link %}/talk/plugin/{{ plugin.name }}{% else %}{{ plugin.link }}{% endif %}">{{ plugin.name }}</a></h5>
                        <p class="card-text">{{ plugin.description }}</p>
                        {% if plugin.tags %}
                            <p class="card-text">
                                {% for tag in plugin.tags %}
                                    <a class="plain-link" title="Search for plugins with the {{ tag }} tag" href="?q={{ tag }}"><span class="badge badge-light badge-tag badge-tag-{{ _.kebabCase(tag) }}">{{ tag }}</span></a>
                                {% endfor %}
                            </p>
                        {% endif %}
                    </div>
                </div>
            </div>
        {% endfor %}
    </ul>
</article>
<script>window.SEARCH_INDEX = {{ lunr_index(site.data[page.data]) }}</script>
