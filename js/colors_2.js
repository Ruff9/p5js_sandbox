let table;
let black, white;

const baseSize = 95;
const baseframeRate = 15;

function setup() {
  frameRate(baseframeRate);
  createCanvas(windowWidth, windowHeight);
  black = color(0);
  white = color(255);

  table = new Table();

  for ( let i = 0; i < table.columns; i++ ) {
    for ( let j = 0; j < table.rows; j++ ) {
      const cell = new Cell({x: i, y: j});

      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
  table.randomCell().colorize();
}

const Table = function() {
  this.columns = floor(width/baseSize);
  this.rows = floor(height/baseSize);
  this.cells = [];
};

Table.prototype.randomCell = function() {
  return this.cells[floor(random() * this.cells.length)];
};

const Cell = function(position) {
  this.position = position;
  this.bkgColor = black;
  this.strokeColor = black;
  this.width = width/table.columns;
  this.height = height/table.rows;
};

Cell.prototype.display = function() {
  fill(this.bkgColor);
  stroke(this.strokeColor);

  rect(this.position.x * this.width,
       this.position.y * this.height,
       this.width + 1,
       this.height + 1);
};

Cell.prototype.colorize = function() {
  this.bkgColor = randomGreenColor();

  this.display();
  this.fade();
}

Cell.prototype.fade = function() {
  const fading = () => {
    const brightnness = this.bkgColor._array.slice(0, 2)
                                            .reduce((a, b) => a + b, 0)

    if (brightnness < 0.05) { stopFading(); }

    const newColor = lerpColor(this.bkgColor, black, 0.1);

    this.bkgColor = newColor;
    this.display();
  }

  const stopFading = () => {
    this.bkgColor = black;
    this.display();
    clearInterval(fadingProcess);
  }

  const fadingProcess = setInterval(fading, 100);
}

function randomBlueColor() {
  return color(random(200, 220), random(200, 220), 255);
}

function randomGreenColor() {
  return color(random(0, 200), 255,random(0, 200));
}
