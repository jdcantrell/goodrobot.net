# Copied from specs.watchr.rb
#
# Convenience Methods
def run(cmd)
  puts(cmd)
  system(cmd)
end

watch( '^_layouts/.*' ) { |m| run ( "build.sh" ) }
watch( '^_sass/.*' ) { |m| run ( "build.sh" ) }
watch( '^_includes/.*' ) { |m| run ( "build.sh" ) }
watch( '^_posts/.*' ) { |m| run ( "build.sh" ) }

