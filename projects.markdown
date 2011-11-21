--- 
layout: page
title: Things I've worked on
date: 2011-09-16
---
These are projects that I've done in my spare time. Most of them scratch an itch
or was simply something I felt like writing. All of them are open source and
available on Github, except for Intones (eventually it will be available, I just
have to clean up the git history of some private keys and what not...doh!).
Anyhow feel free to browse or use anything available here. If you have questions
shoot an email to jd at goodrobot.net.

## Intones
<ul class="project-links">
  <li><a class="website" href="http://intones.notsoevil.net">Website</a></li>
</ul>
Intones is a simple website built off Django and Amazon AWS with the goal
of helping me keep up to date with new band releases. It allows users to
keep a list of bands they are interested in and then view either a nicely
formatted (imho) web page or RSS feed to see if there are any upcoming
releases they might be interested in. 

## Ankh
<ul class="project-links">
  <li><a class="source" href="http://github.com/jdcantrell/ankh.git">Source</a></li>
  <li><a class="website" href="http://goodrobot.net/stream">Demo</a></li>
</ul>
Initially written to replace a lifestream plugin that wasn't living up to my
expectations, Ankh, in essence, is an RSS feed reader and parser. With Ankh 
you create an HTML template and then have Ankh parse and fill in the latest
feed data. See my [links page](http://goodrobot.net/stream) for an example.

## triggerFinger.js
<ul class="project-links">
  <li><a class="source" href="http://github.com/jdcantrell/triggerfinger.js">Source</a></li>
</ul>
This tool was created, with my buddy [Derek](http://whatupderek.com), to help us get a better picture of
how we are using jQuery to bind objects. It generates a report for any time
.bind() or .once() is called. It also keeps track of the handlers, and records
the number of times they were fired and the run time for the entire event to
process all associated handlers. We still has some cleanup and features to add
to it, but it is more or less usable in its current state.

## Vimes
<ul class="project-links">
  <li><a class="source" href="http://github.com/jdcantrell/vimes.git">Source</a></li>
  <li><a class="website" href="http://notsoevil.net/vimes">Demo</a></li>
</ul>
I needed an easy to use and more beautiful todo list manager. So enter Vimes.
Created with flask on the backend and jquery on the front and leveraging
content editable it is a pretty straightforward to use system. The demo isn't
the fully working system, but it gives an pretty good example on what I am
working towards. 

## Future Ideas
Here are a few ideas/back burner things that I'm thinking about or hoping
someone else will right so I don't have to ;)

- A nice pinboard.in aggregator - should group by tags
- A site generator that will take a directory of music and create:
     - An easy to use interface to play music
     - Easy links to fully download music in a folder
     - Utilize HTML5 and potentially flash and look good on a TV
- A system for interactive code tutorials, each chapter would have a small set
  of challenges with the user gaining points for challenge completed. Ideally
  it'd have one half that is the chapter text and the other half is an python
  shell (or w/e language equivalent)
- A node script (or vim plugin?) that checks for EMCAScript methods against a
  list of target browsers. The goal will be to prevent errors like using
  Date.now() when you want to support IE7 and IE8
- Django based game service. I'd want to be able to write games as an app and
  have a separate app that controls saving the game state and playing back game
  messages. a separate core app would be chat, and there would also be some sort
  of common meeting area to create games and match players. This would be a good
  place for websockets!
