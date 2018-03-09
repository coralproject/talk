<article class="{% if page.class %}{{ page.class }} {% endif %}clearfix">
    {% if page.title %}
        <a class="btn btn-sm btn-light float-right suggest-edits plain-link" href="https://github.com/coralproject/talk/edit/master/docs/source/{{ page.source }}" title="Suggest edits to this page">Suggest Edits</a>
        <h1>{{ page.title }}</h1>
        <hr/>
    {% endif %}
    {% if page.plugin %}
        <aside class="card bg-light plugin-details float-md-right ml-md-3 mb-md-3">
            <div class="card-header">Plugin Details</div>
            <div class="card-body">
                <dl>
                    <dt>Name</dt>
                    <dd>{{ page.plugin.name }}</dd>
                    <dt>Source</dt>
                    <dd>
                        {% if page.plugin.source %}
                            <a href="{{ page.plugin.source.link }}">{% if page.plugin.source.name %}{{ page.plugin.source.name }}{% else %}{{ page.plugin.source.link }}{% endif %}</a>
                        {% else %}
                            <a href="https://github.com/coralproject/talk/tree/master/plugins/{{ page.plugin.name }}">plugins/{{ page.plugin.name }}</a>
                        {% endif %}
                    </dd>
                    <dt>Enabled by default</dt>
                    <dd>{% if page.plugin.default %}Yes{% else %}No{% endif %}</dd>
                {% if page.plugin.depends %}
                    <dt>Dependancies</dt>
                    <dd>
                        <ul>
                            {% for dep in page.plugin.depends %}
                                <li><a href="{% if !dep.link %}/talk/plugin/{{ dep.name }}{% else %}{{ dep.link }}{% endif %}">{{ dep.name }}</a></li>
                            {% endfor %}
                        </ul>
                    </dd>
                {% endif %}
                    <dt>Provides</dt>
                    <dd>
                        <ul>
                            {% for provides in page.plugin.provides %}
                                <li>{{ provides }}</li>
                            {% endfor %}
                        </ul>
                    </dd>
                </dl>
            </div>
        </aside>
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