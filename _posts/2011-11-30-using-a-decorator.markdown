--- 
layout: post
title: Using a decorator
tags:
- python
date: 2011-11-30
---
If you are somewhat new to python but have worked with Django, flask or really 
any recent framework, you might have come across function decorators. The first
time I ran into these, I was slightly confused, but it worked as I needed so I 
didn't look into them any deeper other than to say to myself "Oh that's neat."

I was recently working on [Ankh](http://github.com/jdcantrell/ankh.git) and ran
into the prospect of modifying a bunch of a functions with exact same set of
code. Ankh has a set of display functions, each function takes an entry from 
an RSS feed and returns the output. We have different functions so that an entry
from a twitter feed displays differently than an entry from a regular rss feed, 
for example.

Initially each function worked exactly as I described above, take an entry in a
feed, return the output for that one entry, wait to be called again:

{% highlight python %}
def display_simple(entry, feed):
    '''Display the title of an entry'''
    if 'content' in entry:
        return  u'<li>%s' % entry.content[0].value
    return u'<li>%s' % entry.title
{% endhighlight %}

I decided it'd be nice to have the ability to take a set of feeds, parse their
most recent entry and display those in order of newest to oldest. For this to
work though my display function would not need just a single entry from a feed.
It'd need the list of entries and then it'd need to do the parsing of each feed
itself.

At first I was frustrated with myself for having coded into this corner. If I
were to just simply make the above change I'd have to also change all the
display functions to parse a feed and return however many number of entries we
want displayed. It turns out though, this is a perfect spot for a decorator. So
here are the changes I made.

First the display function signature was changed from `display_function(entry,
feed)` to be `display_function(fnParams, count, options)`. This is the new
signature that would give me more flexibility. I then wrote a function called
parse_feed that converts my original display_functions to have the same function
signature as the new function:

{% highlight python %}
def parse_feed(fn):
  '''A decorator for displays that only need a single parsed item from 
  feedparser'''
  def new(url, count, options):
    '''Uses feedparser to fetch feeds and parse through the correct display
    function'''
    if options.verbose:
        print "Parsing %s(%d entries)..." % (url, count)

    feed = feedparser.parse(url)
    output = ['']
    for entry in feed.entries[0:count]:
        #Call passed in function and append the output
        output.append(fn(entry, feed))
    output.append('')
    return u'\n\t\t\t'.join(output)
  return new
 {% endhighlight %}

Now my existing functions just need to be updated with a single line before
their definition:
{% highlight python %}
@parse_feed
def display_simple(entry, feed):
    '''Display the title of an entry'''
    if 'content' in entry:
        return  u'<li>%s' % entry.content[0].value
    return u'<li>%s' % entry.title
{% endhighlight %}

If I had to put decorators in as simple terms as possible it is this: a 
decorator is a function that takes another function as an argument and returns 
a new, different function. 

There are tons of [good](http://stackoverflow.com/questions/739654/understanding-python-decorators) [examples](http://avinashv.net/2008/04/python-decorators-syntactic-sugar/) available on the web, you can also use classes to create decorators. Hopefully, this helps clear up 
this seemingly magic bits of python. Unsurprisingly, they work pretty much like 
you would expect if you worked it out yourself.
