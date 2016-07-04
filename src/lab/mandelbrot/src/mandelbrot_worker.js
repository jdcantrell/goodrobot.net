import MandelbrotRenderer from './MandelbrotRenderer';
let renderer;

self.addEventListener('message', function(message) {
  console.log(message);
  const action = message.data[0];
  console.log(action);

  switch (action) {
    case 'init':
      renderer = new MandelbrotRenderer(message.data[1], message.data[2]);
      self.postMessage(['init']);
      break;
    case 'render':
      const settings = message.data[1]
      Object.keys(settings).forEach((method) => {
        if (settings[method] !== null) {
          renderer[method].call(renderer, ...settings[method]);
        }
      });
      const imageData = renderer.render();
      self.postMessage([
        'render',
        imageData,
        [renderer.realRange, renderer.imaginaryRange]
      ]);
      break;
  }
}, false);
