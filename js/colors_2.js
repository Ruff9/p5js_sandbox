let table, origin;
let black;
let i = 0.0;
let j = 0.0;

const baseSize = 35;
const rayonExt = 11;
const rayonInt = 7;

const density = 15; // float low density between 0 and 1
const fadeSpeed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  black = color(0);
  background(black);

  table = new Table();

  origin = {x: floor(table.columns/2), y: floor(table.rows/2)};

  for ( let k = 0; k < table.columns; k++ ) {
    for ( let l = 0; l < table.rows; l++ ) {
      const cell = new Cell({x: k, y: l});

      if (cell.isInActiveArea(origin)) { cell.active = true; };

      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
  i += 0.1;
  j += 0.1;

  if (i >= 1/density) {
    i = 0.0;
    table.randomActiveCell().colorize();
  }

  if (j >= 1/fadeSpeed) {
    j = 0.0;
    for (const cell of table.liveCells()) {
      cell.fade();
    }
  }
}

const Table = function() {
  this.columns = round(width/baseSize);
  this.rows = round(height/baseSize);
  this.cells = [];
};

Table.prototype.randomCell = function() {
  return this.cells[floor(random() * this.cells.length)];
};

Table.prototype.randomActiveCell = function() {
  const activeCells = this.cells.filter(cell => cell.active == true);
  return activeCells[floor(random() * activeCells.length)];
};

Table.prototype.liveCells = function() {
  return this.cells.filter(cell => cell.live == true);
};

const Cell = function(position) {
  this.position = position;
  this.bkgColor = black;
  this.width = round(width/table.columns);
  this.height = round(height/table.rows);
  this.active = false;
  this.live = false;
  this.speed = floor(random(1, 7));
};

Cell.prototype.display = function() {
  bkg = this.bkgColor;

  noStroke();
  fill(bkg);

  rect(this.position.x * this.width,
       this.position.y * this.height,
       this.width,
       this.height);
};

Cell.prototype.colorize = function() {
  this.bkgColor = randomBlueColor();
  this.live = true;

  this.display();
}

Cell.prototype.fade = function() {
  const brightnness = this.bkgColor._getLightness()

  if (brightnness < 2) {
    this.bkgColor = black;
    this.live = false;
    this.display();
  }

  let n = 0;

  while (n < this.speed) {
    n++;
    this.bkgColor = lerpColor(this.bkgColor, black, 0.1);
  }

  this.display();
}

Cell.prototype.isInActiveArea = function(origin) {
  var distance = sqrt(sq(this.position.x - origin.x) +
                      sq(this.position.y - origin.y));

  return distance < rayonExt && distance > rayonInt;
}

function randomBlueColor() {
  return color(random(0, 220), random(150, 220), 255);
}

function lightBlue() {
  return color(173, 216, 230);
}

function randomGreenColor() {
  return color(random(150, 220), 255,random(150, 220));
}
