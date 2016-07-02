import MandelbrotRenderer from './MandelbrotRenderer';
let renderer;

self.addEventListener('message', function(message) {
  const action = message.data[0];

  switch (action) {
    case 'init':
      renderer = new MandelbrotRenderer(message.data[1], message.data[2]);
      self.postMessage(['init']);
      break;
    case 'set':
      const method = message.data[1];
      const args = message.data[2];
      renderer[method].call(renderer, ...args)
      self.postMessage(['set']);
      break;
    case 'render':
      const imageData = renderer.render();
      self.postMessage(['render', imageData]);
      break;
  }
}, false);
