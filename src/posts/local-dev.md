---
title: Simple project domains
date: 2014-11-24
tags:
  - linux
---

# Local .dev domains
One of my favorite apps on OSX is Anvil. It easily creates local .dev
domains for you to serve static content/sites. It also can serve up Rack
apps if you happen to be developing with ruby and Rack. This comes in
pretty handy and I wanted something similar in Linux.

Fortunately Linux is more than capable of doing what Anvil does, and
depending on how you set things up, you're not limited to only ruby as a
server side language.

This guide will show you how to setup `nginx` to serve static content
and/or fall back to an app server with custom project domains.
Originally, this guide described how to actually get local .dev domains
working, but I've had enough fiddling around dnsmasq every time my linux
distribution upgrades that I have now settled on the much simpler
solution relying on a wildcard domain pointing back to 127.0.0.1.

## Install and enable nginx
Install `nginx` and start it up on boot. If you have a systemd system,
you enable it on boot like so:

```
sudo systemctl enable nginx
```

## Setup nginx
Now let's setup nginx to figure out what project to serve by our
incoming url. You have a few choices on domains to use: `lvh.me`,
`127.0.0.1.xip.io`, `vcap.me`, `sim.bz`

The key with all these domains is that when you ask what the IP is for
any subdomain, it will respond with 127.0.0.1. You could even setup your
own domain (or a sub-domain) to do the same thing. These examples will
use `sim.bz`.

Our nginx config will need to do a few things:

1. Extract the first part of the domain and use that to determine what
   folder to serve content out of.
2. Check if the URI is a directory with an index.html or a file.
3. Otherwise attempt to proxy to a server running on 127.0.0.1:8080
4. Finally, if the proxy server fails serve a friendly error page
   reminding us to check a few things before we start cursing all the
   duct tape involved in this process.

```nginx::local_dev.conf::gist;;https://gist.github.com/jdcantrell/8028709
upstream app_server {
  server localhost:8080 fail_timeout=0;
}

server {
  listen 80;
  server_name "~^(?<base_dir>.+)\.sim\.bz$";
  if ($base_dir = "") {
    set $base_dir ".";
  }

  set $username "jd";

  access_log /var/log/nginx/dev.access.log;
  error_log /var/log/nginx/dev.error.log;

  location / {
    root /home/$username/.sites/$base_dir/;
    index index.html index.htm;
    try_files $uri/index.html $uri @app;
  }

  location /error/ {
    root /home/$username/.sites/;
    rewrite ^(/error)(.*)$ /errors$2 break;
  }

  location @app {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_pass http://app_server;
    proxy_intercept_errors on;
    error_page 502 =502 /error/502.html;
  }

}
```

Depending on your linux system you may need to put the above config into
`/etc/nginx/sites-available` and then sym-link it to
`/etc/nginx/sites-enabled`. Or it may go in `/etc/nginx/conf.d`. Your
distribution should have some information on this, but you should be
able to use what folders exist in `/etc/nginx` as a guide.
**Be sure to update `$username` in the config file!** Finally, restart
nginx and then you're nearly done.

## SELinux settings
SELinux will prevent nginx from accessing user directories by
default. On Fedora the easiest way to fix this is to check the selinux
notifications and follow the instructions it gives for allowing access.

The commands you'll want will be along these lines:

```
setsebool -P httpd_enable_homedirs 1
setsebool -P httpd_read_user_content 1
setsebool -P httpd_can_network_connect 1
setsebool -P httpd_can_network_relay 1
```

You may need to change permissions on your /home/user folder to allow
nginx to read from it.

```
chmod 755 ~
```

## Setup your ~/.sites folder

The nginx config above reads out the defined user's home directory
in the .sites directory.

```
mkdir ~/.sites
mkdir ~/.sites/errors/
```

You can use different directories if you'd like, just be sure to update
the nginx local_dev config to match. In the `~/.sites/errors/` directory
add a simple `502.html` page:

```html::~/.sites/errors/502.html::gist;;https://gist.github.com/jdcantrell/9320869
<!DOCTYPE html>
<html>
  <head>
    <title>Oh hai</title>
    <style>
      html { width: 100% }
      body {
        width: 600px; margin: auto;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 24px;
        font-style: normal;
        font-weight: normal;
        text-transform: normal;
        letter-spacing: -0.1;
        line-height: 1.4em;
        color: #333;
      }
      h1 { line-height: 1em; font-size: 1.4em; }
    </style>
  </head>
  <body>
    <h1>First we herped and then we derped</h1>
    <p>
      Sorry, something did not work.
    </p>
    <p>
      First we tried to see if you requested an existing file, but that
      did not work.
    </p>
    <p>
      Second we tried to pass your request to a proxy server, and we
      received:  <code>502 Bad Gateway</code>.
    </p>
    <p> So now you're being served this message.  </p>
    <p>
      Where you should go from here:
      <ol>
        <li>Start your dev server. It needs to run on 8080.
        <li>Check that your path/file exists.
        <li>Check that you setup this .dev domain correctly.
      </ol>
    </p>
  </body>
</html>
```

This is the page that lets you know your local server is working, but
for whatever reason the particular project domain you visited is not.


## Symlink your project folders
If you visit [http://pancakes.sim.bz](http://pancakes.sim.bz) or any other
.dev domain you should see the error page. Here's the final step to
using this with a project:

```
cd /path/to/project/great/pancakes echo "haay friend" >> index.html
ln -s ./ ~/.sites/pancakes
```

Now [http://pancakes.sim.bz](http://pancakes.sim.bz) should give you actual
content. If you want to use this to develop a non-static site, just fire
up your dev server on 127.0.0.1:8080 and then visit your domain.

Whatever you name the sym link will be the sub-domain you use to access
your project. In the above case the sym link is the same as the actual
directory, you could sym link the directory to ~/.sites/waffles and then
the sub-domain `waffles.sim.bz` would work.

## Sharing with xip.io
It is handy to be able to share your local .dev from time to time. An
easy way to do this is to use a xip.io domain. This domain will echo
whatever IP address is prepended to it:

```
pancakes.192.168.0.100.xip.io
```

will have a DNS response of 192.168.0.100. You can use your local IP to
share only on your local network or with people external to your network
depending on which IP you use in the xip.io domain. You will need to
setup an additional nginx config:


```nginx::xipio.conf::gist;;https://gist.github.com/jdcantrell/8028720
upstream xip_app_server {
  server localhost:8080 fail_timeout=0;
}

server {
  listen   80;
  server_name  "~^(?<base_dir>.+)\.([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)\.xip.io$";

  access_log  /var/log/nginx/xip.access.log  main;
  error_log  /var/log/nginx/xip.error.log;

  set $username "jd";

  location / {
    root /home/$username/.sites/$base_dir/;
    index index.html index.htm;
    try_files $uri/index.html $uri @app;
  }

  location @app {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_pass http://app_server;
  }
}
```

You will likely need to modify your firewall rules and/or router
settings to allow outside connections to your machine. Typically, I
will only enable them when needed.

## Bash aliases
Additionally, I use a few bash functions make setting up and using dev domains easier:

```bash::.bashrc::gist;;https://gist.github.com/jdcantrell/8036482
#Local dev site functions

  #find current directory in our list of sites
  function dev-find {
    pwd=$(pwd)

    for link in $(ls ~/.sites)
    do
      if [[ $pwd = $(readlink -f ~/.sites/$link) ]]; then
        echo $link
        break
      fi
    done
  }

  #if this directory is not already a site create it
  #$1 - a name for the site, defaults to current directory name
  function dev-mk {
    link=$(dev-find)
    if [[ -z $link ]]; then
      name=${1:-$(basename $(pwd))}
      if [! -f ~/.sites/$name ]; then
        ln -s $(pwd) ~/.sites/$name
      fi
      echo "http://$name.sim.bz"
    else
      echo "http://$link.sim.bz"
    fi
  }

  #open dev site in ff (and create it first if needed)
  function dev-ff {
    firefox $(dev-mk $1)
  }

  #get xip.io url
  function xip {
    ip=$(ifconfig p5p1 | grep -Eo 'inet [0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | cut -d ' ' -f2)
    link=$(dev-find)
    echo "http://$link.$ip.xip.io"
  }

  #use icanhazip.com to get your external ip
  function xip-all {
    ip=$(curl icanhazip.com)
    link=$(dev-find)
    echo "http://$link.$ip.xip.io"
  }

  #open xip.io url in FF
  function xip-ff {
    firefox $(xip)
  }
```
