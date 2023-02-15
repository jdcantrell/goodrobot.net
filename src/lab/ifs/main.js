/* globals render, ifs, Vue */
const systems = {
  barnsley: {
    viewport: { x1: -2.2, x2: 2.7, y1: 0.1, y2: 10 },
    ifs: [
      { p: 1, transform: [0, 0, 0, 0.16], translate: [0, 0] },
      { p: 85, transform: [0.85, 0.04, -0.04, 0.85], translate: [0, 1.6] },
      { p: 7, transform: [0.2, -0.26, 0.23, 0.22], translate: [0, 1.6] },
      { p: 7, transform: [-0.15, 0.28, 0.26, 0.24], translate: [0, 0.44] },
    ],
  },
  sierpinski: {
    viewport: { x1: 0, x2: 1, y1: 0, y2: 0.9 },
    ifs: [
      {
        p: 33,
        transform: [-0.25, 0.43301270189, -0.43301270189, -0.25],
        translate: [0.25, 0.43301270189],
      },
      { p: 34, transform: [0.5, 0, 0, 0.5], translate: [0.25, 0.43301270189] },
      {
        p: 33,
        transform: [-0.25, -0.43301270189, 0.43301270189, -0.25],
        translate: [1, 0],
      },
    ],
  },
  pentigre: {
    viewport: { x1: -0.1, x2: 1.1, y1: -0.3, y2: 0.8 },
    ifs: [
      { p: 16, transform: [0.309, -0.225, 0.225, 0.309], translate: [0, 0] },
      {
        p: 16,
        transform: [-0.118, -0.363, 0.363, -0.118],
        translate: [0.309, 0.225],
      },
      {
        p: 16,
        transform: [0.309, 0.225, -0.225, 0.309],
        translate: [0.191, 0.588],
      },
      {
        p: 16,
        transform: [-0.118, 0.363, -0.363, -0.118],
        translate: [0.5, 0.363],
      },
      {
        p: 16,
        transform: [0.309, 0.225, -0.225, 0.309],
        translate: [0.382, 0],
      },
      {
        p: 16,
        transform: [0.309, -0.225, 0.225, 0.309],
        translate: [0.691, -0.225],
      },
    ],
  },
  pine: {
    viewport: { x1: 0, x2: 1, y1: 0, y2: 1 },
    ifs: [
      { p: 33, transform: [0, -0.5, 0.5, 0], translate: [0.5, 0] },
      { p: 33, transform: [0, 0.5, -0.5, 0], translate: [0.5, 0.5] },
      { p: 34, transform: [0.5, 0, 0, 0.5], translate: [0.25, 0.5] },
    ],
  },
  dragon: {
    viewport: { x1: 0.1, x2: 1.1, y1: 0, y2: 1 },
    ifs: [
      { p: 33, transform: [0, 0.577, -0.577, 0], translate: [0.0951, 0.5893] },
      { p: 33, transform: [0, 0.577, -0.577, 0], translate: [0.4413, 0.7893] },
      { p: 34, transform: [0, 0.577, -0.577, 0], translate: [0.0952, 0.9893] },
    ],
  },
  crystal: {
    viewport: { x1: 0, x2: 1, y1: 0, y2: 1.1 },
    ifs: [
      { p: 20, transform: [0.383, 0, 0, 0.383], translate: [0.3072, 0.619] },
      { p: 20, transform: [0.383, 0, 0, 0.383], translate: [0.6033, 0.4044] },
      { p: 20, transform: [0.383, 0, 0, 0.383], translate: [0.0139, 0.4044] },
      { p: 20, transform: [0.383, 0, 0, 0.383], translate: [0.1253, 0.0595] },
      { p: 20, transform: [0.383, 0, 0, 0.383], translate: [0.492, 0.0595] },
    ],
  },
  tree: {
    viewport: { x1: 0, x2: 1, y1: 0, y2: 0.9 },
    ifs: [
      {
        p: 20,
        transform: [0.195, -0.488, 0.344, 0.443],
        translate: [0.4431, 0.2452],
      },
      {
        p: 20,
        transform: [0.462, 0.414, -0.252, 0.361],
        translate: [0.2511, 0.5692],
      },
      {
        p: 20,
        transform: [-0.058, -0.07, 0.453, -0.111],
        translate: [0.5976, 0.0969],
      },
      {
        p: 20,
        transform: [-0.035, 0.07, -0.469, -0.022],
        translate: [0.4884, 0.5069],
      },
      { p: 20, transform: [-0.637, 0, 0, 0.501], translate: [0.8662, 0.2513] },
    ],
  },
};

const app = new Vue({
  el: "#functions",
  data: {
    playground: false,
    fractal: JSON.parse(JSON.stringify(systems.barnsley)),
  },
  watch: {
    fractal: {
      handler: function changeHandler() {
        this.render();
      },
      deep: true,
    },
    playground: function playgroundButton(on) {
      if (on) {
        document.querySelector(".content").classList.add("playground");
      } else {
        document.querySelector(".content").classList.remove("playground");
      }
    },
  },
  methods: {
    render: function renderFractal() {
      render({
        viewport: this.fractal.viewport,
        ifs: ifs(this.fractal.ifs),
      });
    },
    removeTransform: function removeTransform() {
      this.fractal.ifs.pop();
    },
    addTransform: function addTransform() {
      this.fractal.ifs.push({
        p: 5,
        transform: [1, 0, 0, 1],
        translate: [0, 0],
      });
    },
  },
});

app.render();

let previousActive = document.getElementById("barnsley");
Object.keys(systems).forEach((name) => {
  document.getElementById(name).addEventListener("click", (event) => {
    Object.assign(app.$data.fractal, JSON.parse(JSON.stringify(systems[name])));
    event.target.classList.toggle("active");
    previousActive.classList.toggle("active");
    previousActive = event.target;
  });
});
