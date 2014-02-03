#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'jd'
SITENAME = u'goodrobot.net'
SITEURL = 'http://goodrobot.dev'


# http://gxl.dev/build/gxl.css
CSS_PATH = 'http://gxl.dev/build/gxl.css'

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

ARTICLE_URL = '{slug}.html'
PAGE_URL = '{slug}.html'

# Blogroll
LINKS =  (('Pelican', 'http://getpelican.com/'),
          ('Python.org', 'http://python.org/'),
          ('Jinja2', 'http://jinja.pocoo.org/'),
          ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
FEED_ATOM = "atom.xml"
FEED_RSS = "rss.xml"

THEME = 'theme'
ARTICLE_DIR = (('posts'))
PAGE_DIR = (('pages'))
