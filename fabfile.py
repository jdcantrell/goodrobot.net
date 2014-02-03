from fabric.api import *
import fabric.contrib.project as project
import os

# Local path configuration (can be absolute or relative to fabfile)
env.deploy_path = 'output'
DEPLOY_PATH = env.deploy_path

# Remote server configuration
production = 'jd@goodrobot.net:22'
dest_path = '/srv/http/goodrobot'

def clean():
  if os.path.isdir(DEPLOY_PATH):
    local('rm -rf {deploy_path}'.format(**env))
    local('mkdir {deploy_path}'.format(**env))

def build():
  local('pelican -s pelicanconf.py')

def rebuild():
  clean()
  build()

def regenerate():
  local('pelican -r -s pelicanconf.py')

@hosts(production)
def push(filename):
  put(filename, '/srv/http/static/cdn/%s' % filename)

@hosts(production)
def publish():
  local('pelican -s publishconf.py')
  project.rsync_project(
    remote_dir=dest_path,
    exclude=".DS_Store",
    local_dir=DEPLOY_PATH.rstrip('/') + '/',
    delete=False
  )
