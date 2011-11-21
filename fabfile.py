from __future__ import with_statement
from fabric.api import local, run, cd


#TODO: Re-organize site so that the main blog is not in the base directory
#this will prevent the stream pages (and anything else that is evntually added
#from getting destroyed on deploy

def build():
  local("compass compile ./")
  local("jekyll")

def deploy():
  code_dir = "~/goodrobot.net"
  stream_dir = "~/ankh"
  
  #actually generate the site
  with cd(code_dir):
    run("git pull")
    run("compass compile ./")
    run("jekyll")

  #re-gen the stream page on deploy
  with cd(stream_dir):
    run("git pull")
    run("mkdir %s/_site/stream" % code_dir)
    run("python ankh.py -t goodrobot.template.html -o %s/_site/stream/index.html -v" % code_dir)
