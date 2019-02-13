/* globals Float32Array, Uint8Array */

// WebGL2 - 2D Geometry Matrix Transform with Projection
// from https://webgl2fundamentals.org/webgl/webgl-2d-geometry-matrix-transform-simpler-functions.html
const screensaver = () => {
  const m3 = {
    projection: function projection(width, height) {
      // Note: This matrix flips the Y axis so that 0 is at the top.
      return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
    },

    translation: function translation(tx, ty) {
      return [1, 0, 0, 0, 1, 0, tx, ty, 1];
    },

    rotation: function rotation(angleInRadians) {
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      return [c, -s, 0, s, c, 0, 0, 0, 1];
    },

    scaling: function scaling(sx, sy) {
      return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
    },

    multiply: function multiply(a, b) {
      const a00 = a[0 * 3 + 0];
      const a01 = a[0 * 3 + 1];
      const a02 = a[0 * 3 + 2];
      const a10 = a[1 * 3 + 0];
      const a11 = a[1 * 3 + 1];
      const a12 = a[1 * 3 + 2];
      const a20 = a[2 * 3 + 0];
      const a21 = a[2 * 3 + 1];
      const a22 = a[2 * 3 + 2];
      const b00 = b[0 * 3 + 0];
      const b01 = b[0 * 3 + 1];
      const b02 = b[0 * 3 + 2];
      const b10 = b[1 * 3 + 0];
      const b11 = b[1 * 3 + 1];
      const b12 = b[1 * 3 + 2];
      const b20 = b[2 * 3 + 0];
      const b21 = b[2 * 3 + 1];
      const b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },

    translate: (m, tx, ty) => {
      m3.multiply(m, m3.translation(tx, ty));
    },

    rotate: (m, angleInRadians) => {
      m3.multiply(m, m3.rotation(angleInRadians));
    },

    scale: (m, sx, sy) => {
      m3.multiply(m, m3.scaling(sx, sy));
    },
  };

  function unitNormal(x1, y1, x2, y2) {
    const nx = y2 - y1;
    const ny = -(x2 - x1);
    const mag = Math.sqrt(nx * nx + ny * ny);
    return {
      x: 10 * nx / mag,
      y: 10 * ny / mag,
    };
  }

  const vertexShaderSource = `#version 300 es

  // an attribute is an input (in) to a vertex shader.
  // It will receive data from a buffer
  in vec2 a_position;
  in vec4 a_color;
  in vec2 a_texcoord;

  // A matrix to transform the positions by
  uniform mat3 u_matrix;

  out vec4 v_color;
  out vec2 v_texcoord;

  // all shaders have a main function
  void main() {
    // Multiply the position by the matrix.
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

    v_color = a_color;
    v_texcoord = a_texcoord;
  }
  `;

  const fragmentShaderSource = `#version 300 es

  precision mediump float;

  in vec4 v_color;
  in vec2 v_texcoord;

  //uniform sampler2D u_texture;

  // we need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    outColor = v_color;
    //outColor = texture(u_texture, v_texcoord) * v_color;
  }
  `;

  let go = true;

  function resizeCanvasToDisplaySize(canvas, multiplier) {
    const scale = multiplier || 1;
    const width = canvas.clientWidth * scale || 0;
    const height = canvas.clientHeight * scale || 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; // eslint-disable-line no-param-reassign
      canvas.height = height; // eslint-disable-line no-param-reassign
      return true;
    }
    return false;
  }

  function error(msg) {
    console.error(msg);
  }

  function createProgram(gl, shaders, attributes, locations, errorCallback) {
    const errFn = errorCallback || error;
    const program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    if (attributes) {
      attributes.forEach((attrib, ndx) => {
        gl.bindAttribLocation(
          program,
          locations ? locations[ndx] : ndx,
          attrib
        );
      });
    }
    gl.linkProgram(program);

    // Check the link status
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // something went wrong with the link
      const lastError = gl.getProgramInfoLog(program);
      errFn(`Error in program linking: ${lastError}`);

      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  function loadShader(gl, shaderSource, shaderType, errorCallback) {
    const errFn = errorCallback || error;
    // Create the shader object
    const shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      const lastError = gl.getShaderInfoLog(shader);
      errFn(`*** Error compiling shader '${shader}': ${lastError}`);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const defaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER'];

  function genBlendingPolynomials(steps) {
    const blendingPolys = [];
    const step = 1 / (steps - 1); // potential off by one issue here
    for (let i = 0; i < steps; i += 1) {
      const j = step * i;
      const polys = [];
      polys[0] = 1 / 6 * (1 - j) * (1 - j) * (1 - j);
      polys[1] =
        1 /
        6 *
        ((j + 2) * (1 - j) * (1 - j) +
          (j + 1) * (1 - j) * (2 - j) +
          j * (2 - j) * (2 - j));
      polys[2] =
        1 /
        6 *
        ((j + 1) * (j + 1) * (1 - j) + j * (j + 1) * (2 - j) + j * j * (3 - j));
      polys[3] = 1 / 6 * j * j * j;
      blendingPolys[i] = polys;
    }

    return blendingPolys;
  }

  function genLine(numPoints, width, height, rgb1, rgb2) {
    const line = {
      points: [],
      colorStart: rgb1,
      colorEnd: rgb2,
    };
    for (let i = 0; i < numPoints; i += 1) {
      line.points.push({
        x: width * Math.random(),
        y: height * Math.random(),
        dx: Math.random() * 10 - 5,
        dy: Math.random() * 10 - 5,
      });
    }
    return line;
  }

  function setColors(gl, vertexCount, colorStart, colorEnd) {
    const colors = [];
    const steps = vertexCount / 2 / 2;
    for (let i = 0; i < steps; i += 1) {
      const to = i / steps;
      const from = 1 - to;
      const currentColor = [
        Math.trunc(colorStart.r * from + colorEnd.r * to),
        Math.trunc(colorStart.g * from + colorEnd.g * to),
        Math.trunc(colorStart.b * from + colorEnd.b * to),
      ];
      colors.push(
        currentColor[0],
        currentColor[1],
        currentColor[2],
        150,
        currentColor[0],
        currentColor[1],
        currentColor[2],
        150
      );
    }

    for (let i = 0; i < steps; i += 1) {
      const to = i / steps;
      const from = 1 - to;
      const currentColor = [
        Math.trunc(colorEnd.r * from + colorStart.r * to),
        Math.trunc(colorEnd.g * from + colorStart.g * to),
        Math.trunc(colorEnd.b * from + colorStart.b * to),
      ];
      colors.push(
        currentColor[0],
        currentColor[1],
        currentColor[2],
        150,
        currentColor[0],
        currentColor[1],
        currentColor[2],
        150
      );
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
  }

  function createProgramFromSources(
    gl,
    shaderSources,
    attributes,
    locations,
    errorCallback
  ) {
    const shaders = [];
    // todo test
    for (let ii = 0; ii < shaderSources.length; ii += 1) {
      shaders.push(
        loadShader(
          gl,
          shaderSources[ii],
          gl[defaultShaderType[ii]],
          errorCallback
        )
      );
    }
    return createProgram(gl, shaders, attributes, locations, errorCallback);
  }

  function generateTriangles(baseVertexes) {
    const vertexes = [];
    for (let i = 0; i < baseVertexes.length; i += 1) {
      const x1 = baseVertexes[i][0];
      const y1 = baseVertexes[i][1];

      const pIdx = i ? i - 1 : baseVertexes.length - 1;
      const nIdx = i + 1 === baseVertexes.length ? 0 : i + 1;

      let nnIdx;
      if (i + 2 === baseVertexes.length) {
        nnIdx = 0;
      } else if (i + 2 === baseVertexes.length + 1) {
        nnIdx = 1;
      } else {
        nnIdx = i + 2;
      }

      const px = baseVertexes[pIdx][0];
      const py = baseVertexes[pIdx][1];
      const nx = baseVertexes[nnIdx][0];
      const ny = baseVertexes[nnIdx][1];
      const x2 = baseVertexes[nIdx][0];
      const y2 = baseVertexes[nIdx][1];

      // control point
      vertexes.push(x1);
      vertexes.push(y1);

      // first normal
      const normal1 = unitNormal(px, py, x2, y2);
      vertexes.push(x1 + normal1.x);
      vertexes.push(y1 + normal1.y);

      // control point
      vertexes.push(x2);
      vertexes.push(y2);

      // second normal
      const normal2 = unitNormal(x1, y1, nx, ny);
      vertexes.push(x2 + normal2.x);
      vertexes.push(y2 + normal2.y);
    }

    return vertexes;
  }

  // Fill the current ARRAY_BUFFER buffer
  // with the values that define a letter 'F'.
  function setGeometry(gl, line, { steps, blendingPolys }) {
    // calculate our reference points
    const baseVertexes = [];
    const { points } = line;
    for (let p = 0; p < points.length; p += 1) {
      const { x, y } = points[p];

      let nx, ny, nnx, nny, nnnx, nnny;
      if (p + 1 >= points.length) {
        nx = points[p + 1 - points.length].x;
        ny = points[p + 1 - points.length].y;
      } else {
        nx = points[p + 1].x;
        ny = points[p + 1].y;
      }

      if (p + 2 >= points.length) {
        nnx = points[p + 2 - points.length].x;
        nny = points[p + 2 - points.length].y;
      } else {
        nnx = points[p + 2].x;
        nny = points[p + 2].y;
      }

      if (p + 3 >= points.length) {
        nnnx = points[p + 3 - points.length].x;
        nnny = points[p + 3 - points.length].y;
      } else {
        nnnx = points[p + 3].x;
        nnny = points[p + 3].y;
      }

      for (let s = 0; s < steps; s += 1) {
        baseVertexes.push([
          x * blendingPolys[s][0] +
            nx * blendingPolys[s][1] +
            nnx * blendingPolys[s][2] +
            nnnx * blendingPolys[s][3],
          y * blendingPolys[s][0] +
            ny * blendingPolys[s][1] +
            nny * blendingPolys[s][2] +
            nnny * blendingPolys[s][3],
        ]);
      }
    }

    const vertexes = generateTriangles(baseVertexes);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      Float32Array.from(vertexes),
      gl.DYNAMIC_DRAW,
      0
    );
  }

  function main(canvas) {
    const splines = {
      steps: 20,
      lines: [],
      blendingPolys: [],
      canvas: {},
    };

    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    const gl = canvas.getContext('webgl2', {
      premultipledAlpha: false,
    });
    if (!gl) {
      return;
    }
    resizeCanvasToDisplaySize(gl.canvas);

    // Initialize our state
    splines.blendingPolys = genBlendingPolynomials(splines.steps);
    splines.canvas = { width: gl.canvas.width, height: gl.canvas.height };
    splines.lines = [
      genLine(
        5,
        splines.canvas.width,
        splines.canvas.height,
        { r: 0, g: 255, b: 255 },
        { r: 0, g: 0, b: 255 }
      ),
      genLine(
        5,
        splines.canvas.width,
        splines.canvas.height,
        { r: 255, g: 255, b: 0 },
        { r: 255, g: 0, b: 0 }
      ),
      genLine(
        5,
        splines.canvas.width,
        splines.canvas.height,
        { r: 255, g: 255, b: 255 },
        { r: 0, g: 255, b: 0 }
      ),
      genLine(
        5,
        splines.canvas.width,
        splines.canvas.height,
        { r: 255, g: 255, b: 255 },
        { r: 114, g: 0, b: 114 }
      ),
    ];
    splines.vertexesPerLine = splines.steps * 20;

    // Use our boilerplate utils to compile the shaders and link into a program
    const program = createProgramFromSources(gl, [
      vertexShaderSource,
      fragmentShaderSource,
    ]);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      'a_position'
    );
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    // const texcoordAttributeLocation = gl.getAttribLocation(program ,'a_texcoord');

    // look up uniform locations
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    // Create a buffer50 +
    const positionBuffer = gl.createBuffer();

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // add color attribute
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(
      gl,
      splines.vertexesPerLine,
      splines.lines[0].colorStart,
      splines.lines[0].colorEnd
    );

    gl.vertexAttribPointer(
      colorAttributeLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      0,
      0
    );

    gl.enableVertexAttribArray(colorAttributeLocation);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set Geometry.
    // setGeometry(gl, splines);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Draw the scene.
    function drawScene() {
      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);

      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao);

      // Compute the matrix
      const matrix = m3.projection(
        gl.canvas.clientWidth,
        gl.canvas.clientHeight
      );

      // Set the matrix.
      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, splines.vertexesPerLine);
    }

    function loop() {
      resizeCanvasToDisplaySize(gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // eslint-disable-line no-bitwise

      const { width, height } = splines.canvas;
      for (let i = 0; i < splines.lines.length; i += 1) {
        for (let j = 0; j < splines.lines[i].points.length; j += 1) {
          let { x, y, dx, dy } = splines.lines[i].points[j];
          x += dx;
          y += dy;

          if (x >= width || x <= 0) {
            dx = -dx;
          }
          if (y >= height || y <= 0) {
            dy = -dy;
          }
          splines.lines[i].points[j] = { x, y, dx, dy };
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(
          gl,
          splines.vertexesPerLine,
          splines.lines[i].colorStart,
          splines.lines[i].colorEnd
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setGeometry(gl, splines.lines[i], splines);
        drawScene();
      }

      if (go) {
        requestAnimationFrame(loop);
      }
    }

    loop();
  }

  function initialize(options) {
    let { canvas } = options;
    const { delay } = options;

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.bottom = '0';
      canvas.style.left = '0';
      canvas.style.right = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.backgroundColor = '#000';
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
    }

    const handlers = {
      start: () => {
        go = true;
        setTimeout(() => {
          main(canvas);
        });
      },
      stop: () => {
        go = false;
      },
      canvas: canvas,
    };

    if (delay) {
      const startScreenSaver = () => {
        handlers.canvas.style.display = 'block';
        handlers.start();
      };

      let saveTimeout = setTimeout(startScreenSaver, options.delay);
      window.addEventListener('mousemove', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(startScreenSaver, options.delay);
      });

      handlers.canvas.addEventListener('mousemove', () => {
        handlers.stop();
        handlers.canvas.style.display = 'none';
      });
    }

    return handlers;
  }

  return { initialize };
};
