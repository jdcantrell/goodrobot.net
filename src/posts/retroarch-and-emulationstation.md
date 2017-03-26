---
title: RetoArch and EmulationStation on Fedora
date: 2017-01-08
tags:
  - linux
  - fedora
  - emulators
  - games
---

#RetoArch and EmulationStation on Fedora

If you like playing emulated games on your machine and you also like
Fedora you might be a little disappointed to see that RetroArch and
EmulationStation are neither available nor packaged as RPMs.
Fortunately, it can be easily fixed by compiling from source. However
there are a few extra steps needed beyond `make` and `make install`.


##Build RetroArch

First install RetroArch. You can essentially follow the directions on
the [compilation guide][1]. Here's an abriged version:

Install dependencies:


```bash
dnf install make automake gcc gcc-c++ kernel-devel mesa-libEGL-devel libv4l-devel libxkbcommon-devel mesa-libgbm-devel zlib-devel freetype-devel libxml2-devel ffmpeg-devel SDL2-devel SDL-devel perl-X11-Protocol perl-Net-DBus pulseaudio-libs-devel openal-soft-devel libusb-devel libXinerama-devel
```

The guide adds Cg and libCg but I was unable to find packages for those
and everything works just fine without. Additionally ffmpeg-devel is
probably optional, but if you want it, be sure to enable RPM Fusion or
the Fedora Multimedia repo at [negativo17.org](http://negativo17.org/handbrake/).

Next clone and build:

```bash
git clone https://github.com/libretro/RetroArch.git
cd ./RetroArch
./configure
make
make install DESTDIR=~/Games/retroarch/
```

##Build EmulationStation

EmulationStation is slightly more work since you currently need to patch
the source. Anyhow, first install the dependencies:

```bash
dnf install cmake freeimage-devel boost-devel eigen3-devel lubcurl-devel
```

Clone the source and patch:

```bash
git https://github.com/Aloshi/EmulationStation.git
wget https://raw.githubusercontent.com/thias/retroarch-fedora/master/emulationstation/emulationstation-2.0.1a-float.patch
cd ./EmulationStation
git apply ../emulationstation-2.0.1a-float.patch
```

Then build:

```bash
cmake -DCMAKE_INSTALL_PREFIX:PATH=~/Games/emulationstation .
make
make install
```

Finally, the last thing you need to do to make EmulationStation is setup
your themes directory. You can do this either in
`/etc/emulationstate/themes` or `~/.emulationstation/themes/`:

```bash
mkdir -p ~/.emulationstation/themes
cd ~/.emulationstation/themes/
wget http://emulationstation.org/downloads/themes/simple_latest.zip
unzip simple_latest.zip
```

Now you should be able run EmulationStation and get it set up. If you
get an assertion error like:

```
EmulationStation/es-core/src/resources/Font.cpp:536: void Font::renderTextCache(TextCache*): Assertion `*it->textureIdPtr != 0' failed.
```

It's likely because your themes directory is not set up correctly (not
found or nested incorrectly).

###Additional Resources
The EmulationStation steps were greatly aided by looking at this
[retroarch-fedora repo](https://github.com/thias/retroarch-fedora). It's
worth a shot to see if http://dl.marmotte.net/rpms/fedora/ has updated
builds for the current version of Fedora.

[1]: https://github.com/libretro/RetroArch/wiki/Compilation-guide-(Linux)
