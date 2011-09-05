# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# Add files and commands to this file, like the example:
#   watch('file/path') { `command(s)` }
#
guard 'shell' do
  watch( %r{^_layouts/.*} ) { `jekyll` }
  watch( %r{^_sass/.*} ) { `compass compile ./; jekyll` }
  watch( %r{^_includes/.*} ) {  `jekyll` }
  watch( %r{^_posts/.*} ) {  `jekyll` }
  watch( 'index.html') {  `jekyll` }
end
