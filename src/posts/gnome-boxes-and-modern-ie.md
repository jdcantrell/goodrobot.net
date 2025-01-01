---
title: Gnome <a>Boxes</a> and Modern.ie
date: 2016-01-12
tags:
  - linux
  - vm
---

# Gnome <a>Boxes</a> and Modern.ie

If you need to test Internet Explorer and all you have is a linux machine you
might be disappointed when you see that [modern.ie](http://modern.ie) only
offers VirtualBox images for linux. Fortunately, it is easy to use these images
with QEMU and Gnome Boxes if you so desire.

1. Download the appropriate VirtualBox image.
2. Extract the .ova image
3. Open as disk (use Archive Mounter) and copy the `*.vmdk` file to your hard
   drive.
4. In Gnome Boxes, create a new vm and select the `.vmdk` file.
5. Start the VM and uninstall the Virtual Box Guest Additions
6. Install the Windows Guest tools from
   [spice-space.org](http://www.spice-space.org/download.html)
7. At this point you are good to go and it is a good time to take a snapshot.

Gnome Boxes does not give you a lot of detailed settings to fiddle with. For the
most part this is fine, but if you find yourself wanting to install more Virt-IO
drivers (such as those found
[here](https://fedoraproject.org/wiki/Windows_Virtio_Drivers)) you will need to
install Virtual Machine Manager to actually select the devices.
