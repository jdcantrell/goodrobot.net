Title: Luggage, a simple way to share files
Date: 2012-01-01
Tags: ruby, projects, luggage

A while ago I got pointed to [CloudApp](http://getcloudapp.com/). It
is a pretty cool service that makes it easy to share files in the cloud.
They have a large number of handlers for different types of files so
that when you post images it looks good or if you post a source file it
gets syntax highlighted. It even renders markdown. The free service is
somewhat limited, but for my low usage it was more than adequate.

As much as I like CloudApp, I wanted something I could put on my own domain.
CloudApp does have a paid service that lets you use your own domain, but
the more I thought about it, this seemed like a perfect chance to learn
something new and create my own thing. So enter
[Luggage](http://github.com/jdcantrell/luggage). It is a small ruby
script that lets you drag and drop files on to the page which then can
be shared with anyone. Right now it has custom viewers for source code
and images, everything else will get a download page (I'm sure I'll add
more as needed). 

For this project I went with [Ruby](http://www.ruby-lang.org/) using the
[Camping](http://camping.rubyforge.org/) framework. It's small, simple,
and more or less does the trick. One of the great things about CloudApp
is how easy it is to share files. You just drag and drop files to the
icon in your menu bar, or if you take a screenshot it will automatically
upload it for you. While I wasn't able to go that far with Luggage, I do
use the [File
API](https://developer.mozilla.org/en/Using_files_from_web_applications)
in browsers that support it. This means you can drag files from Explorer
or Finder (or w/e you linux kids use) and have them uploaded right away
(with a progress bar and everything!). 

The other things I used in Luggage were jQuery and Twitter Bootstrap
(for this project I didn't want to spend time styling it, at least not
initially). I also added in google-code-prettify after fidling around
with Albino/pygments for too long.

The name, by the way, comes from a character in Discworld: [The
Luggage](http://wiki.lspace.org/wiki/The_Luggage), and I wrote this app
so I could more easily share [this](http://goodrobot.net/luggage/open/bro).
