// TODO
// don't create so many objects so that we can reduce gc
// add grass animation
// add player movement
// add tile interaction
const tileMap = {
  '.': {
    type: 'grass',
    render: () => '<span class="grass">.</span>',
    defaults: {},
  },
  '~': {
    type: 'water',
    update: (tile, newTile, ticks, pos, neighbors) => {
      if (tile.shimmer === 0) {
        if (pos.x === 0) {
          newTile.shimmer = 5 + Math.floor(Math.random() * Math.floor(10));
        } else if (
          (neighbors.w && neighbors.w.state.shimmer > 0) ||
          (neighbors.n && neighbors.n.state.shimmer > 0) ||
          (neighbors.s && neighbors.s.state.shimmer > 0)
        ) {
          newTile.shimmer = 5;
        }
      } else if (tile.shimmer === 1) {
        // cooldown
        newTile.shimmer = -5 + -Math.floor(Math.random() * Math.floor(10));
      } else if (tile.shimmer > 1) {
        newTile.shimmer--;
      } else if (tile.shimmer < 0) {
        newTile.shimmer++;
      }
    },
    render: tile => {
      if (tile.shimmer > 0) {
        return '<span class="water shimmering">~</span>';
      }
      return '<span class="water">~</span>';
    },
    defaults: {
      shimmer: 0,
    },
  },
  r: {
    type: 'road',
    render: () => '<span class="road">.</span>',
    defaults: {},
  },
  '#': {
    type: 'wall',
    render: () => '<span class="wall">#</span>',
    defaults: {},
  },
  '+': {
    type: 'door',
    render: () => '<span class="door">+</span>',
    defaults: {
      closed: true,
    },
  },
};

const parseLevel = levelText =>
  Array.from(levelText)
    .map(
      char =>
        tileMap[char]
          ? {
              ...tileMap[char],
              state: { ...tileMap[char].defaults },
            }
          : null
    )
    .filter(tile => tile);

const overworld = parseLevel(document.getElementById('overworld').innerHTML);
const screen = document.getElementById('screen');

const xyStruct = { x: 0, y: 0 };
const xy = idx => {
  xyStruct.x = idx % 80;
  xyStruct.y = Math.floor(idx / 80);
  return xyStruct;
};

const getIdx = (x, y) => {
  if (x >= 0 && x < 80 && y >= 0 && y < 80) {
    return y * 80 + x;
  }
  return null;
};

const nhStruct = { n: null, s: null, w: null, e: null };
const neighbors = ({ x, y }, data) => {
  nhStruct.n = data[getIdx(x, y - 1)];
  nhStruct.s = data[getIdx(x, y + 1)];
  nhStruct.w = data[getIdx(x - 1, y)];
  nhStruct.e = data[getIdx(x + 1, y)];
  return nhStruct;
};

const render = (data, ticks) => {
  const newState = [];
  const chars = data.map((tile, idx) => {
    // iterate state
    if (tile.update) {
      const pos = xy(idx);
      const tileState = Object.assign({}, tile.state);
      tile.update(tile.state, tileState, ticks, pos, neighbors(pos, data));
      if (tileState) {
        newState[idx] = Object.assign({}, tile, { state: tileState });
      }
    } else {
      newState[idx] = tile;
    }

    // render
    const renderedTile = tile.render(newState[idx].state);

    // out to screen
    if (idx && idx % 80 === 0) {
      return `\n${renderedTile}`;
    }
    return renderedTile;
  });
  screen.innerHTML = chars.join('');
  return newState;
};

let prevTimestamp = 0;
let ticks = 0;
let screenState = overworld;
const loop = timestamp => {
  if (timestamp - prevTimestamp > 40) {
    screenState = render(screenState, timestamp - prevTimestamp);
    prevTimestamp = timestamp;
    ticks += 1;
  }
  if (ticks < 600) {
    window.requestAnimationFrame(loop);
  }
};
window.requestAnimationFrame(loop);
