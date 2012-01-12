--- 
layout: post
title: Camping with Ruby
tags:
- ruby
date: 2012-01-08
---
As I mentioned in my previous post, I built my first Ruby project using
the Camping framework. I wantd to give some follow up information about
that because I think there are somethings about Camping specifically
that people new to Ruby or Camping would greatly benefit from.

Here is how to get up to speed with Camping:
1. Read the examples included with Camping
2. Don't be afraid to read the source to Camping. It's quite friendly,
   and the best resource for how things are accomplished.
3. Markaby is the templating library
4. ActiveRecord is your ORM

Because Markaby and ActiveRecord are used in other Ruby apps, you can
find a lot of information on them that will apply for Camping, just be
sure to search for Markaby or ActiveRecord instead of Camping. I don't
have specific numbers but for me Camping appears to be quite bit less
popular than Rails(no shock there) and Sinatra. This isn't a huge hurdle
but may be something to consider when deciding what framework you want
to use.

Camping is an amazingly brief amount code. In fact from what I can tell,
this is a main source of pride for the Camping devs. The uncommented
version is only 55 lines of code long. And even the commented version is
only 764 lines of code (at the current time of writing this). There are
two important points to draw from this. First, if you want to know
something about Camping the best reference is the unabridged version.
The comments are extensive and the code is very easy to follow.
Secondly, Camping lets some other Ruby gems do the heavy lifting, which
means the documentation about templating(markaby) or ORM(ActiveRecord)
is very thin on the Camping site, but each have their own sites with
more useful documentation. ActiveRecord is great because it is used in
many other Ruby frameworks. Markaby is less used but once you get the
hang of overall idea, it is pretty much dead easy to use.

Finally, now that I've had some time to think about this a bit. I really
like this framework. I would definitely consider using it again. I might
not recommend it to someone just learning to program. But for me, coming
in with plenty of programming experience but no Ruby experience,
learning Ruby while using Camping actually was helpful, since I could
jump into the Camping code base and see how experiences Ruby devs use
the language. This may not be unique to Camping, but I was pleasantly
suprised by it anyhow.

Bonus Round: Camping apps work great with Unicorn. Just remove the
ActiveRecord dis/connection in the before\_fork and after\_fork
functions from the example file and you're good to go!
