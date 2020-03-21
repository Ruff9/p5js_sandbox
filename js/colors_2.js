let table, origin;
let black, white;

const baseSize = 65;
const baseframeRate = 15;
const density = 1;
const activeAreaSize = 10;

function setup() {
  frameRate(baseframeRate);
  createCanvas(windowWidth, windowHeight);
  black = color(0);

  background(black);

  table = new Table();

  origin = {x: floor(table.columns/2), y: floor(table.rows/2)};

  for ( let i = 0; i < table.columns; i++ ) {
    for ( let j = 0; j < table.rows; j++ ) {
      const cell = new Cell({x: i, y: j});

      if (cell.isInActiveArea(origin)) { cell.active = true; };

      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
  for (step = 0; step < density; step++) {
    table.randomActiveCell().colorize();
  }
}

const Table = function() {
  this.columns = floor(width/baseSize);
  this.rows = floor(height/baseSize);
  this.cells = [];
};

Table.prototype.randomCell = function() {
  return this.cells[floor(random() * this.cells.length)];
};

Table.prototype.randomActiveCell = function() {
  const activeCells = this.cells.filter(cell => cell.active == true);
  return activeCells[floor(random() * activeCells.length)];
};

const Cell = function(position) {
  this.position = position;
  this.bkgColor = black;
  this.width = width/table.columns;
  this.height = height/table.rows;
  this.active = false;
  this.live = false;
};

Cell.prototype.display = function() {
  fill(this.bkgColor);
  noStroke();

  rect(this.position.x * this.width,
       this.position.y * this.height,
       this.width,
       this.height);
};

Cell.prototype.colorize = function() {
  this.bkgColor = randomGreenColor();
  this.live = true;

  this.display();
  this.fade();
}

Cell.prototype.fade = function() {
  const fading = () => {
    // const currentAlpha = this.bkgColor._getAlpha()

    // if (currentAlpha <= 0) { stopFading(); }

    const brightnness = this.bkgColor._array.slice(0, 2)
                                            .reduce((a, b) => a + b, 0)


    if (brightnness < 0.05) { stopFading(); }
    const newColor = lerpColor(this.bkgColor, black, 0.1);
    this.bkgColor = newColor;

    // this.bkgColor.setAlpha(currentAlpha - 10)
    // console.log(this.bkgColor._getAlpha())
    this.display();
  }

  const stopFading = () => {
    this.bkgColor = black;
    this.live = false;
    this.display();
    clearInterval(fadingProcess);
  }

  const fadingProcess = setInterval(fading, 100);
}

Cell.prototype.isInActiveArea = function(origin) {
  var distance = sqrt(sq(this.position.x - origin.x) +
                      sq(this.position.y - origin.y));

  return distance < activeAreaSize;
};

function randomBlueColor() {
  return color(random(150, 220), random(150, 220), 255);
}

function randomGreenColor() {
  return color(random(150, 220), 255,random(150, 220));
}
