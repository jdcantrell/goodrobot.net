Title: Camping with Ruby
Tags: ruby
Date: 2012-01-13

I mentioned in my previous post, that I built my first Ruby project
using the Camping framework. I wanted to give some follow up information
about that because I think there are somethings about Camping
specifically that people new to Ruby or Camping would greatly benefit
from.

Here is how to get up to speed with Camping:

1. Read the [examples](https://github.com/camping/camping/blob/master/examples/blog.rb) included with Camping
2. Don't be afraid to read the [source](https://github.com/camping/camping/blob/master/lib/camping-unabridged.rb) to Camping. It's quite friendly,
   and the best resource for how things are accomplished.
3. [Markaby](http://markaby.github.com/) is the templating library
4. [ActiveRecord](http://ar.rubyonrails.com/) is your ORM

Camping is an amazingly brief amount code. In fact from what I can tell,
this is a main source of pride for the Camping devs. The uncommented
version is only 55 lines of code long. And even the commented version is
only 764 lines of code. There are two important points to draw from
this. First, if you want to know something about Camping the best
reference is the [unabridged
source](https://github.com/camping/camping/blob/master/lib/camping-unabridged.rb).
The comments are extensive, and the code is very easy to follow.

Secondly, Camping lets some other Ruby gems do the heavy lifting, which
means the documentation about templating(markaby) or ORM(ActiveRecord)
is very thin on the Camping site, but each have their own sites with
more useful documentation.  ActiveRecord is great because it is used in
many other Ruby frameworks.  Markaby is less used but once you get the
hang of overall idea, it is pretty much dead easy to use. Both of these
gems are popular enough that it is easy finding information on them if
you search for them specifically.

Finally, now that I've had some time to think about this a bit. I really
like this framework. I will definitely consider using it again. There
were times in this project I thought I had made a bad choice on
frameworks due to popularity and ease of finding answers for other ones,
but this forced me to rely more on reading the Camping source code.
Which in turn, was a great thing to be forced into since I was using
[Luggage](github.com/jdcantrell/luggage) as a way to learn Ruby.

*Bonus Round:* Camping apps work great with Unicorn. Just remove the
ActiveRecord dis/connection in the before\_fork and after\_fork
functions from the example file and you're good to go!
