/* global ROT */
var Game = {
  display: null,
  map: {},

  init: function() {
    this.display = new ROT.Display({
      fontFamily: 'vga',
      bg: '#2e2a31',
      fg: '#f5f4f7'
    });
    document.body.appendChild(this.display.getContainer());

    this._generateMap();
  },

  _generateMap: function() {
    var digger = new ROT.Map.Digger();
    var freeCells = [];

    var digCallback = function(x, y, value) {
      if (value) { return; }

      var key = x+","+y;
      this.map[key] = ".";
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);

    this._drawWholeMap();
  },

  _generateBoxes: function(freeCells) {
    for (var i=0;i<10;i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      var key = freeCells.splice(index, 1)[0];
      this.map[key] = "*";
    }
  },

  _drawWholeMap: function() {
    for (var key in this.map) {
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
    }
  }
};

Game.init();

