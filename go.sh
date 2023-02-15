#!/bin/bash
set -e

_red=$(     tput setaf 1 || tput AF 1 )
_green=$(   tput setaf 2 || tput AF 2 )
_yellow=$(  tput setaf 3 || tput AF 3 )
_blue=$(    tput setaf 4 || tput AF 4 )
reset=$(   tput sgr0 )

blue() { echo "$_blue$1$reset"; }
red() { echo "$_red$1$reset"; }
yellow() { echo "$_yellow$1$reset"; }
green() { echo "$_green$1$reset"; }

css() {
  mkdir -p ./build/css
  pysassc ./src/_sass/highlight/highlight.scss ./build/css/highlight.css
  pysassc ./src/_sass/gxl/gxl.sass ./build/css/gxl.css
  pysassc ./src/_sass/mono/mono-light.sass ./build/css/mono-light.css
  pysassc ./src/_sass/mono/mono-dark.sass ./build/css/mono-dark.css
  pysassc ./src/_sass/mono/mono-gruvbox.sass ./build/css/mono-gruvbox.css
  pysassc ./src/_sass/mono/mono-gruvbox-light.sass ./build/css/mono-gruvbox-light.css
  pysassc ./src/_sass/goodrobot/goodrobot.sass ./build/css/goodrobot.css
  pysassc ./src/_sass/clean/clean.scss ./build/css/clean.css
}

link() {
  rm -rf ./build/lab
  mkdir -p ./build/lab
  find src/lab -maxdepth 1 -mindepth 1 -type d -exec ln -s ../../'{}' build/lab/ \;
}

stream() {
  CACHE=${1}
  ankh src/stream/_stream.html.j2 build/stream/index.html --template-paths ./src $CACHE
}

stream_pic() {
  CACHE=${1}
  ankh src/stream/_pic.html.j2 build/stream/pics.html --template-paths ./src $CACHE
}

generate() {
  rm -rf ./build # todo - make this optional
  blue 'Building folder structure'
  python build.py dirs
  blue 'Parsing templates'
  python build.py tpls
  blue 'Parsing markdown'
  python build.py md
  blue 'Generating css'
  css
  green 'Site build complete.'
}

generate_all() {
  generate
  blue 'Generating stream'
  stream $1
  blue 'Generating pic stream'
  stream_pic $1
  green 'Full site build complete.'
}

sync() {
  blue "Rsyncing to $1"
  rsync -avh  ./build/* "$1:/srv/http/goodrobot/"
}

publish() {
  generate_all
  sync "$1"
}


case "$1" in
  publish)
    publish "$2"
    ;;
  sync)
    sync "$2"
    ;;
  generate)
    rm -f ankh_cache.sqlite
    generate_all
    ;;
  generate_site)
    generate
    ;;
  stream)
    stream
    ;;
  stream_cache)
    stream "--cache"
    stream_pic "--cache"
    ;;
  css)
    css
    ;;
  link)
    link
    ;;
  *)
    red "Sorry, I don't know that command :-("
    echo '  publish server - build and sync to server'
    echo '  sync server - sync to server'
    echo '  generate - generate everything'
    echo '  generate_site - only the site (not stream pages)'
    echo '  css - generate css'
    echo '  link - symlink the labs folder'
    ;;
esac
