// future pixel library ?

let table, origin;
let black;

const baseSize = 9; // pixels

function setup() {
  createCanvas(windowWidth, windowHeight);
  black = color(0);
  background(black);

  table = new Table();

  origin = { x: floor(table.columns/2), y: floor(table.rows/2) };

  for ( let k = 0; k < table.columns; k++ ) {
    for ( let l = 0; l < table.rows; l++ ) {
      let cell = new Cell({x: k, y: l});

      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
}

class Table {
  constructor() {
    this.columns = round(width/baseSize);
    this.rows = round(height/baseSize);
    this.cells = [];
    this.plants = [];
  }
};

class Cell {
  constructor(position, color = black) {
    this.position = position;
    this.color = randomColor();
    this.width = round(width/table.columns);
    this.height = round(height/table.rows);
  }

  display() {
    let bkg = this.color;

    noStroke();
    fill(bkg);

    rect(this.position.x * this.width,
         this.position.y * this.height,
         this.width,
         this.height);
  }
}

function randomColor() {
  return color(random(0, 255), random(0, 255), random(0, 255));
}
