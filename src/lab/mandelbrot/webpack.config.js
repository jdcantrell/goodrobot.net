module.exports = {
  entry: "./src/mandelbrot.js",
  output: {
    path: './build',
    filename: 'mandelbrot.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
