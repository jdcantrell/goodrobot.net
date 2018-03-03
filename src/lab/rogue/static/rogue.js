//TODO
//don't create so many objects so that we can reduce gc
//add grass animation
//add player movement
//add tile interaction
const tileMap = {
  '.': {
    type: 'grass',
    defaults: {
      render: () => '<span class="grass">.</span>',
    },
  },
  '~': {
    type: 'water',
    defaults: {
      shimmer: 0,
      update: (tile, newTile, ticks, pos, neighbors) => {
        if (tile.shimmer === 0) {
          if (pos.x === 0) {
            newTile.shimmer = 5 + Math.floor(Math.random() * Math.floor(10));
          } else if (
            (neighbors.w && neighbors.w.shimmer > 0) ||
            (neighbors.n && neighbors.n.shimmer > 0) ||
            (neighbors.s && neighbors.s.shimmer > 0)
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
    },
  },
  r: {
    type: 'road',
    defaults: {
      render: () => '<span class="road">.</span>',
    },
  },
  '#': {
    type: 'wall',
    defaults: {
      render: () => '<span class="wall">#</span>',
    },
  },
  '+': {
    type: 'door',
    defaults: {
      render: () => '<span class="door">+</span>',
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
              type: tileMap[char].type,
              ...tileMap[char].defaults,
            }
          : null
    )
    .filter(tile => tile);

const overworld = parseLevel(document.getElementById('overworld').innerHTML);
const screen = document.getElementById('screen');

const xy = idx => ({
  x: idx % 80,
  y: Math.floor(idx / 80),
});

const getIdx = (x, y) => {
  if (x >= 0 && x < 80 && y >= 0 && y < 80) {
    return y * 80 + x;
  }
  return null;
};

const neighbors = ({ x, y }, data) => ({
  n: data[getIdx(x, y - 1)],
  s: data[getIdx(x, y + 1)],
  w: data[getIdx(x - 1, y)],
  e: data[getIdx(x + 1, y)],
});

const render = (data, ticks) => {
  const newState = [];
  const chars = data.map((tile, idx) => {
    // iterate state
    if (tile.update) {
      const pos = xy(idx);
      const tileState = Object.assign({}, tile);
      tile.update(tile, tileState, ticks, pos, neighbors(pos, data));
      if (tileState) {
        newState[idx] = tileState;
      }
    } else {
      newState[idx] = tile;
    }

    // render
    const renderedTile = tile.render(newState[idx]);

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
