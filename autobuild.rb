# Copied from specs.watchr.rb
#
# Convenience Methods
def run(cmd)
  puts(cmd)
  system(cmd)
end

watch( '^_layouts/.*' ) { |m| run ( "jekyll" ) }
watch( '^_sass/.*' ) { |m| run ( "compass compile ./; jekyll" ) }
watch( '^_includes/.*' ) { |m| run ( "jekyll" ) }
watch( '^_posts/.*' ) { |m| run ( "jekyll" ) }

