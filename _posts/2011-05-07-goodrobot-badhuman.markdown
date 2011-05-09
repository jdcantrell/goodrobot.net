--- 
layout: post
title: Good Robot! Bad Human!
date: 2011-05-07
---

Okay this will be a test post, we need to test the various elements of
markdown and make sure we create some output that looks nice for it. So
here is my first paragraph, nothing great, but hopefully there will be 
enough text that I can get my head around the different things

# Let me tell you about this

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

1. Apples
2. Bananas
3. Cucumbers
4. Dates

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
