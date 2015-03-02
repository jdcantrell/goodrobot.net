---
title: Local .dev domains
date: 2014-11-24
tags:
  - linux
---

#Local .dev domains
One of my favorite apps on OSX is Anvil. It easily creates local .dev
domains for you to serve static content/sites. It also can serve up Rack
apps if you happen to be developing with ruby and Rack. This comes in
pretty handy and I wanted something similar in Linux.

Fortunately Linux is more than capable of doing what Anvil does, and
depending on how you set things up, you're not limited to only ruby as a
server side language.

##Install dependencies
Install `nginx` and `dnsmasq`. Fedora users may already have dnsmasq
installed, and both of these you will want to have started on system
boot.

##Setup dnsmasq
Create a file called `devtld.conf` in `/etc/dnsmasq.d/` and put this content in:

<div class="box code-header">/etc/dnsmasq.d/devtld.conf</div>

```
address=/dev/127.0.0.1
```

Now start (or restart) dnsmasq and if you ping any domain that ends in
.dev you should see `127.0.0.1` as the response IP.

```
~ ping pancakes.dev
PING pancakes.dev (127.0.0.1) 56(84) bytes of
data.  64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.014
ms
```

If you get `unknown host pancakes.dev` then you most likely need to
update your network settings. In GNOME you can use the network manager
to add 127.0.0.1 and your router's dns (or any other dns).

##Setup Nginx
We need an vhost config for nginx that will do the following:

1. Extract the first part of the domain and use that to determine what
   folder to serve content out of.
2. Check if the URI is a file or a directory with an index.html
3. Otherwise attempt to proxy to a server running on 127.0.0.1:8080
4. Finally, if the proxy server fails serve a friendly error page
   reminding us to check a few things before we start cursing the
   infernal machines involved in this process.

<div class="box code-header">
  local_dev.conf <a href="https://gist.github.com/jdcantrell/8028709">gist</a>
</div>

```nginx
upstream app_server {
  server localhost:8080 fail_timeout=0;
}

server {
  listen 80;
  server_name "~^(?<base_dir>.+)\.dev$";
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

##Setup your ~/.sites folder

The nginx config above reads out the defined user's home directory
in the .sites directory.

```
mkdir ~/.sites
mkdir ~/.sites/errors/
```

You can use different directories if you'd like, just be sure to update
the nginx local_dev config to match. In the `~/.sites/errors/` directory
add a simple `502.html` page:

<div class="box code-header">
  ~/.sites/errors/502.html <a href="https://gist.github.com/jdcantrell/9320869">gist</a>
</div>

```html
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

This is the page that lets you know your .dev domains are working,
but for whatever reason the particular domain you visited is not.


##Sym link your project folders
If you visit [http://pancakes.dev](http://pancakes.dev) or any other
.dev domain you should see the error page. Here's the final step to
using this with a project:

```
cd /path/to/project/great/pancakes echo "haay friend" >> index.html
ln -s ./ ~/.sites/pancakes
```

Now [http://pancakes.dev](http://pancakes.dev) should give you actual
content. If you want to use this to develop a non-static site, just fire
up your dev server on 127.0.0.1:8080 and then visit your domain.

##SELinux settings
SELinux will prevent nginx from accessing user directories by
default. On Fedora the easiest way to fix this is to check the selinux
notifcations and follow the instructions it gives for allowing access.

The commands you'll want will be along these lines:

```
setsebool -P httpd_enable_homedirs 1
setsebool -P httpd_read_user_content 1
setsebool -P httpd_can_network_connect 1
setsebool -P httpd_can_network_relay 1
```

You may need to change permissions on your /home/user folder to allow
others to read from it.

##Sharing with xip.io
It is handy to be able to share your local .dev from time to time. An
easy way to do this is to use a xip.io domain. This domain will echo
whatever IP address is prepended to it:

```
pancakes.127.0.0.1.xip.io
```

will have a DNS response of 127.0.0.1. You can use this to share only on
your local network or with people external to your network depending on
which IP you use in the xip.io domain. You will need to setup an
additional nginx config:

<div class="box code-header">
  xipio.conf <a href="https://gist.github.com/jdcantrell/8028720">gist</a>
</div>

```nginx
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

##Bash Aliases
Additionally, I use a few bash functions make setting up and using dev domains easier:

<div class="box code-header">
  .bashrc <a href="https://gist.github.com/jdcantrell/8036482">gist</a>
</div>

```bash
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
      echo "http://$name.dev"
    else
      echo "http://$link.dev"
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
