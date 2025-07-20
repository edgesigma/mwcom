
// Set cell size in pixels
const CELL_SIZE = 10;
// Set grid colors
const COLOR_ALIVE = '#000000ff'; // dark cell color
const COLOR_DEAD = '#312d2aff';  // light cell color
let canvas, ctx;
window.onload = function() {
  canvas = document.getElementById('grid');
  ctx = canvas.getContext('2d');
  // Calculate grid size based on cell size
  const gridWidth = Math.floor(canvas.width / CELL_SIZE);
  const gridHeight = Math.floor(canvas.height / CELL_SIZE);
  const grid = new Grid(gridWidth, gridHeight);
  grid.init();
  // Clear canvas
  ctx.fillStyle = COLOR_DEAD;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  setInterval(moveAnt, 1000/13, grid);
}

const ANTUP = 0;
const ANTRIGHT = 1;
const ANTDOWN = 2;
const ANTLEFT = 3;

class Ant {
  x = 0;
  y = 0;
  direction = ANTUP;

  moveForward(width, height) {
    switch (this.direction) {
      case ANTUP:
        this.y = ((this.y - 1) + height) % height;
        break;
      case ANTRIGHT:
        this.x = ((this.x + 1) + width) % width;
        break;
      case ANTDOWN:
        this.y = ((this.y + 1) + height) % height;
        break;
      case ANTLEFT:
        this.x = ((this.x - 1) + width) % width;
        break;
    }
  }

  rotateRight() {
    this.direction = ((this.direction + 1) + (ANTLEFT + 1)) % (ANTLEFT + 1);
  }

  rotateLeft() {
    this.direction = ((this.direction - 1) + (ANTLEFT + 1)) % (ANTLEFT + 1);
  }
}

class Cell {
  alive = false;

  setAlive(alive) {
    this.alive = alive;
  }

  get isAlive() {
    return this.alive;
  }
}

class Grid {
  cells = [];
  ant;
  height = 0;
  width = 0;
  moves = 0;

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  init() {
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.height; y++) {
        const cell = new Cell();
        this.cells[x][y] = cell;
      }
    }
    this.ant = new Ant();
    this.ant.x = Math.floor(this.width / 2);
    this.ant.y = Math.floor(this.height / 2);
  }

  move () {
    for (let i = 0; i < 100; i++) {
      let cell = this.cells[this.ant.x][this.ant.y];
      if (cell.isAlive) {
        cell.alive = false;
        ctx.fillStyle = COLOR_DEAD;
        ctx.fillRect(this.ant.x * CELL_SIZE, this.ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        this.ant.rotateRight();
        this.ant.moveForward(this.width, this.height);
      }
      else {
        cell.alive = true;
        ctx.fillStyle = COLOR_ALIVE;
        ctx.fillRect(this.ant.x * CELL_SIZE, this.ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        this.ant.rotateLeft();
        this.ant.moveForward(this.width, this.height);
      }
      // Draw the ant in red
      ctx.fillStyle = 'red';
      ctx.fillRect(this.ant.x * CELL_SIZE, this.ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      this.moves++;
    }
  }
}

function moveAnt(grid) {
  grid.move();
  // No need for ctx.stroke() with fillRect
  var moves = document.getElementById('moves');
  if (moves) moves.innerHTML = grid.moves;
}