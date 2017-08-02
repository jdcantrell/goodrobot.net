#!/bin/bash
set -e

PYTHON=python3
PIP=pip3

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
  sassc ./src/_sass/gxl/gxl.sass ./build/css/gxl.css
  sassc ./src/_sass/mono/mono.sass ./build/css/mono.css
}

link() {
  rm -rf ./build/lab
  mkdir -p ./build/lab
  find src/lab -maxdepth 1 -mindepth 1 -type d -exec ln -s ../../'{}' build/lab/ \;
}

stream() {
  ankh src/stream/_stream.html build/stream/index.html --template-paths ./src
}

stream_pic() {
  ankh src/stream/_pic.html build/stream/pics.html --template-paths ./src
}

generate() {
  rm -rf ./build
  blue 'Building folder structure'
  $PYTHON build.py dirs
  blue 'Parsing templates'
  $PYTHON build.py tpls
  blue 'Parsing markdown'
  $PYTHON build.py md
  blue 'Generating css'
  css
  green 'Site build complete.'
}

generate_all() {
  generate
  blue 'Generating stream'
  stream
  blue 'Generating pic stream'
  stream_pic
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

init() {
  $PIP install pyyaml mistune pygments jinja2 libsass
  $PIP install git+https://github.com/jdcantrell/ankh.git@master#egg=Ankh
}

activate() {
  if [ ! -d "./env" ]; then
    $PYTHON -m venv ./env
    yellow "Creating virtual env, you may want to run ./go.sh init"
  fi
  source ./env/bin/activate
}

case "$1" in
  publish)
    publish "$2"
    ;;
  init)
    init
    ;;
  sync)
    sync "$2"
    ;;
  generate)
    generate_all
    ;;
  generate_site)
    generate
    ;;
  css)
    css
    ;;
  link)
    link
    ;;
  activate)
    activate
    ;;
  *)
    red "Sorry, I don't know that command :-("
    ;;
esac
