{% extends '_tpls/page.html' %}

{% block title %}{{ title }}{% endblock %}
{% block head %}
  <link href='/css/code.css' rel='stylesheet' type='text/css'>
{% endblock %}

{% block content %}
<div class="content">
  {{ markdown }}
</div>
{% endblock %}
