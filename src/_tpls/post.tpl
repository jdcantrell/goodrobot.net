{% extends '_tpls/page.html' %}

{% block title %}{{ title }}{% endblock %}

{% block content %}
<div class="content">
  {{ markdown }}
</div>
{% endblock %}
