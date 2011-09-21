# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# Add files and commands to this file, like the example:
#   watch('file/path') { `command(s)` }
def build
  `compass compile ./`
  `jekyll`
  `ln -s ~/Development/personal/ankh/ankh.html ./_site/stream.html`
end

guard 'shell' do
  watch( %r{^_includes/.*} ) { `jekyll` }
  watch( %r{^_layouts/.*} ) { `jekyll` }
  watch( %r{.markdown$} ) { `jekyll` }
  watch( %r{^_sass/.*} ) { `compass compile ./; jekyll` }
end
