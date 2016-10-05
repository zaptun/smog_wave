---
layout: null
---
// {{ post.date | date: "%b %-d, %Y" }}

window.SiteBaseurl = "{{ site.baseurl }}";

window.DATA = {
	"post" : [
		{% for post in site.posts %}
			{
				"title" : "{{ post.title }}",
				"layout" : "{{ post.layout }}",
				"time" : {{ post.date | date: "%s" }},
				{% if post.img %}
				"img" : "{{ site.baseurl }}{{ post.img }}",
				{% endif %}
				"excerpt" : "{{ post.excerpt }}",
				"categories" : [{% for category in post.categories %}{% if forloop.rindex != 1 %}"{{ category }}",{% else %}"{{ category }}"{% endif %}{% endfor %}],
				"tags" : [{% for _tag in post.tags %}{% if forloop.rindex != 1 %}"{{ _tag }}",{% else %}"{{ _tag }}"{% endif %}{% endfor %}],
				"url" : "{{ site.baseurl }}{{ post.url }}"
			}
			{% if forloop.rindex != 1  %}
			,
			{% endif %}
	    {% endfor %}
	],
	"categories" : [
		{% for tag in site.categories %}
			{
				"name" : "{{ tag[0] }}",
				"post":[
					{% for post in tag[1] %}
					    {
							"title" : "{{ post.title }}",
							"layout" : "{{ post.layout }}",
							"time" : {{ post.date | date: "%s" }},
							{% if post.img %}
							"img" : "{{ site.baseurl }}{{ post.img }}",
							{% endif %}
							"excerpt" : "{{ post.excerpt }}",
							"categories" : [{% for category in post.categories %}{% if forloop.rindex != 1 %}"{{ category }}",{% else %}"{{ category }}"{% endif %}{% endfor %}],
							"tags" : [{% for _tag in post.tags %}{% if forloop.rindex != 1 %}"{{ _tag }}",{% else %}"{{ _tag }}"{% endif %}{% endfor %}],
							"url" : "{{ site.baseurl }}{{ post.url }}"
						}
						{% if forloop.rindex != 1  %}
						,
						{% endif %}
				    {% endfor %}
				]
			}
			{% if forloop.rindex != 1  %}
			,
			{% endif %}
	    {% endfor %}
	],
	"tags" : [
		{% for tag in site.tags %}
			{
				"name" : "{{ tag[0] }}",
				"post":[
					{% for post in tag[1] %}
					    {
							"title" : "{{ post.title }}",
							"layout" : "{{ post.layout }}",
							"time" : {{ post.date | date: "%s" }},
							{% if post.img %}
							"img" : "{{ site.baseurl }}{{ post.img }}",
							{% endif %}
							"excerpt" : "{{ post.excerpt }}",
							"categories" : [{% for category in post.categories %}{% if forloop.rindex != 1 %}"{{ category }}",{% else %}"{{ category }}"{% endif %}{% endfor %}],
							"tags" : [{% for _tag in post.tags %}{% if forloop.rindex != 1 %}"{{ _tag }}",{% else %}"{{ _tag }}"{% endif %}{% endfor %}],
							"url" : "{{ site.baseurl }}{{ post.url }}"
						}
						{% if forloop.rindex != 1  %}
						,
						{% endif %}
				    {% endfor %}
				]
			}
			{% if forloop.rindex != 1  %}
			,
			{% endif %}
	    {% endfor %}
	]
}
