from __future__ import with statement
from fabric.api import local, settings, abort

def build():
  local("compass compile ./")
  local("jekyll")

def deploy():
  code_dir = "~/goodrobot.net"
  with cd(code_dir):
    run("git pull")
    run("compass compile ./")
    run("jekyll")

