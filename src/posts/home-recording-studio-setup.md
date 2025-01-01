---
title: Home Studio Setup on Fedora
date: 2018-05-14
published: no
tags:
  - linux
  - fedora
  - music
  - studio
---

# Home Studio Setup on Fedora

Here is my preferred setup for recoding music through a microphone on Fedora.
I've been playing guitar for about a year now and have slowly been learning the
way to setup my system so that it works more often than not. At the time of this
writing this should be fairly up-to-date for Fedora 28.

## Quick Start

dnf install jackd qjackctrl jack-audio-plugin-examples ardour adduser to jackd
fix rtprio

## Windows VSTs via wine

dnf install wine wine-dev download VST sdk clone linvst make make install

## Decisions

When getting started there are so many decisions to make even before you get
into the actual act of creating music. Many of my decisions where made based off
the best information I could find and recommendations from friends and my guitar
teacher. Once you start researching audio equipment and software it is as if
everything starts speaking a new language. Here's things I've either decided on
based on the best research I could do (with the realization that I was learning
as I was going through all this) or just picked something without really
knowing.

First up hardware:

- Blue Yeti USB Microphone - this microphone makes great recordings, it wasn't
  the cheapest nor the most expensive. USB connectivity is a bit of a blessing
  and a curse.
- A hefty PC mostly built for playing games - I haven't bought any specific
  hardware for audio recording aside for the USB microphone. I've looked into
  getting a more studio-minded sound card but since my microphone works over
  USB, Linux is going to see it as its own sound card and at that point unless
  you're going to switch to a microphone that connects over XT (or w/e) it
  doesn't seem to make sense to upgrade anything else.
- Audio-Technica M30 Headphones - These headphones seem to work well for my
  needs. While playing an instrument it's absolutely critical to have headphones
  so that you can hear the metronome and any backing tracks on the headphones
  while the microphone records just your instrument. The Blue Yeti microphone
  has a headphone jack that once you plug-in it automatically monitors what's
  coming in to the headphone.
- Actual instruments - I have a few guitars, one is electric and instead of
  plugging directly into my computer I use the microphone to record my amp. This
  seems to work really well for me.
- Additionally I have a midi controller, I don't fully use it to the all of its
  capabilities but it works well for when I want to use a keyboard to make
  music. (Also the controller I bought came with a lite version of Bitwig, which
  I then was able to upgrade to the full version for a cheaper total price
  compared to buying a separate midi controller and a DAW).

So that covers the bare essentials needed, the midi controller is definitely
optional but as you play more with DAWs it's probably worth it to pick up a
cheap one.

Next up is software, since we're using Fedora we're limited on a few things.

- jackd - If you've been around the linux world for a while you've definitely
  heard of alsa and pulseaudio (and maybe OSS). It's likely you've also heard of
  jackd but maybe you've not used it since most distributions do not install it
  by default. jackd's main benefit is that it a low latency sound system. This
  means that the time it takes for your microphone to record a noise and for
  your computer to then be able to process and record it is minimized (compared
  to the other systems. You can good performance using also (and probably
  pulseaudio) but they don't make any promises where jackd is a realtime system.
  jackd also will help you understand when your machine was unable to record
  correctly (audio-wise this sounds like pops and glitching). For Fedora you can
  install jackd using dnf, but you need add your user to the jackd group before
  you can use it.
- qjackctrl - This is a small program that lets you start and stop jackd. You
  can also use it to tweak any settings needed to get things working smoothly.
  It also allows you to run scripts at various times in jackd's lifecycle.
- Ardour - This is an open source DAW that is really impressive for all its
  capabilities. I no longer use Ardour as my main DAW but I do like that it
  allows for an simple way to determine your systemic audio latency. This is a
  good DAW to get started with. It also has good documentation for many
  questions you will definitely run into.
- jack-audio-plugin-examples - One of the challenges with jackd is that it only
  works with a single sound card. This is problematic if you want sound from
  your sound card but want to use a USB microphone since the microphone will
  appear as a separate sound card. The solution here is to alsa_out to add your
  system sound card as another audio sink in jackd. This way you can have
  real-time control over your microphone for recording but later when you want
  to listen to your recording you'll have the option to go through your
  headphones (via the microphone) or play it through your desktop speakers.

# Software setup

On Fedora there are a few things you will need to do before you can use the
above. First you need to add your user to the jack users group. Next you need to
allow you users on your machine to set real time priority.

user_add

rtprio in limits.conf?

Next set up an alsa_out sink so that you can use your system sound card as an
output. This requires writing a bash script:

```bash
#!/bin/bash
set -uex

NAME="Audioengine"
ALSA_DETAILS=$(aplay -l | grep -A 2 $NAME)
CARD_NUMBER=$(echo "$ALSA_DETAILS" | grep -oP "card \K[0-9]")
DEVICE_NUMBER=$(echo "$ALSA_DETAILS" | grep -oP "Subdevice #\K[0-9]")
alsa_out -j "speakers" -d "hw:$CARD_NUMBER,$DEVICE_NUMBER"
```

You will want to change `Audioengine` to the correct name for your sound card.
On my system it's named `Audioengine D2` yours will probably be different. You
can inspect the output of `aplay -l` to determine this. If you prefer you can
adjust the last `"speakers"` name in the last line to whatever makes sense for
your setup. This is just a name so that you know where audio will go when routed
to this output.

Finally we add this script to `qjackctrl` so that it will start after jackd is
started.

So now if you hit start in qjackctrl you'll at least see system sources and
sinks and a 'speaker's sync in the patchbay panel.

At this point you should be good to for recording within your DAW.

To me this is the smallest amount of software you'll need to get started. As you
get more into recording you might want add some additional components. So far
the above base has been a great starting point for me, but I've moved on to
using Bitwig as my main DAW and using LinVST and Wine to run Windows-only VST
plugins on linux. Setting the latter up can be painful but at the same time it
is worth it for the expanded set of tools you can use. Bitwig also allows you to
install it on three different machines so another route may be to have a linux
install and a windows install. If you choose to go with Bitwig you might be able
to get it on sale (usually end of the year). And if you want a midi controller
some controllers come with a lite version of Bitwig than can be upgraded for
even cheaper than buying the full version out-right.

I mentioned LinVST, I use this so that I can run EZDrummer within Bitwig.
Getting that setup is probably a whole other article, but it can be done and
once you get it working things seem to work surprisingly well. (Though you have
to go through the process again when wine gets updated)

Things I wish for:

- A soundcard with USB ports that will automatically combine my usb micrphone
  with itself. (and more points for having 1/4 inch audio inputs).
- Decent headphones with standard audio cable (the Audio-Technica's have a
  custom plug for the end that goes into the headphones)
- Software/Books/Instruments that actually lived up to their claim they'd make
  me a great musician within hours (nothing so far has been a replacement for
  practice and study)
- Native Linux VSTs - running through Wine works but I wish it wasn't needed.
- More tutorials and resources for recording live music using modern DAWs, a lot
  information out there is heavily geared towards electronic music (though still
  much of it applies)
- More people writing using screen-shots and short summaries for their tutorials
  instead of just producing an hour long video to say something that could be a
  couple of paragraphs (generals internet gripe)
- A more gentle introduction to all of the above.

# DAWs

DAWs are complicated software. It can be overwhelming when trying to learn a new
instrument and all you want to do is record a few tracks and then make
everything sound nice. My experience so far has been that is worth investing in
learning how to use your particular DAW. There are a few concepts that are
general across all music recording but if you do not know about it's hard to
find with random google searches. For me one of the first things I wanted to do
was re-record parts of a song (hopefully playing some parts better). The thing
you're looking for is called punch-in (and possibly punch-out).

Punch-in lets you play a track normally and then at a marked time begin
recording. Punch-out allows you to stop recording. This is incredibly useful for
when you're happy with one part of a song but want to improve a specific part.
Playing ahead of the record point lets you play along and get into the song
before the actual recording starts.

When starting out another key tool will be the metronome. You'll want to hear a
metronome while playing but only record the sound of your instrument. This is
accomplished by monitoring. Monitoring just means that the output of an audio is
going to a specific device (generally for my use case a set of headphones). This
allows the microphone to only hear the part you're playing while you're
listening to the metronome (and other tracks you've enabled). If you start
adding drums you'll want to either use the metronome alongside the drums or just
use the drums only, this will help your playing stay more in sync (or in my case
highlight when you've gotten off rhythm and need to re-record).

A lot of DAWs are geared towards electronic music (or at least making music
completely electronically). You'll end up ignoring parts of a DAW for a while,
things like clips and launchers. It's still worth learning to use these tools
because you can split your audio track in to samples and then quickly set up a
series of chords as a simple backing track.

# Making noise and music

The most important thing about any of the above and the only thing will help you
be a better musician is practicing and making music.

The next biggest thing in all of this that has been the most helpful is that
I've some how lucked into finding a wonderful guitar teacher who also does
studio work and so any questions I have he can typically point me into the right
direction. Even if your particular teacher doesn't have a specific skill that
you need help with they may be able to point you to someone who does and
spending an hour or two with someone who really understands what you're trying
to achieve and all the ways to do it can make a huge difference in your own
ability.
