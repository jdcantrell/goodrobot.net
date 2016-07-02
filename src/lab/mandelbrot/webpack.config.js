module.exports = {
  entry: {
    mandelbrot: "./src/mandelbrot.js",
    mandelbrot_worker: "./src/mandelbrot_worker.js",
  },
  output: {
    path: './build',
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
