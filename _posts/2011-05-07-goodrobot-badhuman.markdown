--- 
layout: post
title: Good Robot! Bad Human!
tags:
- test
- ideas
date: 2011-05-07
---
Things todo:
* Normalize.css
* CSS3 green gradient that looks awesome
* Create the logo we want using either inkscape or something like it
* Add enough graphical elements to the text and body of the page that it is still clean but
looks elegant and well done

## Here is the next section

Okay this will be a test post, we need to test the various elements of
markdown and make sure we create some output that looks nice for it. So
here is my first paragraph, nothing great, but hopefully there will be 
enough text that I can get my head around the different things

# Let me tell you about this cool thing known as the jekyll

This is a major topic, and so it was giving a big important looking heading
you need to be careful and read this completely. Sometimes it will rain
fish, or that just may be a myth. At this time no one really knows except
what the internet tells us we know.

## More headings

Okay one last thing before I go, let me just say that this will be a really
short paragraph, I hope this will do the trick!.
> I think this is what pain feels like! Mommy, someone maternal!
> Get out of my way! Get out of my way!
> > It's not until you've given up everything that you can appreciate anything
> Gee, it would be nice ot have some grenades about now!

* One
* Two
* Three
* Four

1. js objects made dead simple
2. sf vs kc
3. how not to treat employees
4. what I'm doing to rise above
5. 5 coding project ideas

Here is some code:
	
{% highlight python %}
def load_feed(url, display, count, options):
	'''Uses feedparser to fetch feeds and parse through the correct display
	function'''
	if options.verbose:
		print "Parsing %s(%d entries)..." % (url, count)

	feed = feedparser.parse(url)
	output = ['']
	for entry in feed.entries[0:count]:
		output.append(display(entry))
	output.append('')
	return u'\n\t\t\t'.join(output)
{% endhighlight %}

---

We are *almost done* here **not too much left try this** however: 
[notsoevil.net](http://notsoevil.net/) it has some mildly interesting
content. Or you can go to [Intones](http://intones.notsoevil.net)
