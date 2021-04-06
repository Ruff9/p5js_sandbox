let table, origin;
let black;

const baseSize = 9; // pixels
const rayonExt = 320/baseSize;
const rayonInt = 90/baseSize;

const fadingRadius = 10;

const flickSpeed = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  black = color(0);
  background(black);

  table = new Table();

  origin = {x: floor(table.columns/2), y: floor(table.rows/2)};

  for ( let k = 0; k < table.columns; k++ ) {
    for ( let l = 0; l < table.rows; l++ ) {
      const cell = new Cell({x: k, y: l});

      if (cell.isInActiveArea(origin)) {
        cell.active = true;
        cell.bkgColor = randomBlueColor();

        if (cell.isInFadingArea(origin)) {
          cell.fading = true;
        };
      };

      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
  for (let i = 0; i < flickSpeed; i++) {
    cell = table.randomActiveCell();
    cell.colorize();
  }
}

const Table = function() {
  this.columns = round(width/baseSize);
  this.rows = round(height/baseSize);
  this.cells = [];
};

Table.prototype.randomActiveCell = function() {
  const activeCells = this.cells.filter(cell => cell.active == true);
  return activeCells[floor(random() * activeCells.length)];
};

const Cell = function(position) {
  this.position = position;
  this.bkgColor = black;
  this.width = round(width/table.columns);
  this.height = round(height/table.rows);
  this.active = false;
  this.fading = false;
  this.fadeArea = 'none'
};

Cell.prototype.display = function() {
  bkg = this.bkgColor;

  if (this.fading) { bkg = this.fade(); }

  noStroke();
  fill(bkg);

  rect(this.position.x * this.width,
       this.position.y * this.height,
       this.width,
       this.height);
};

Cell.prototype.colorize = function() {
  this.bkgColor = randomBlueColor();
  this.display();
}

Cell.prototype.isInActiveArea = function(origin) {
  var distance = distanceBetween(this.position, origin);

  return  distance < rayonExt && distance > rayonInt;
}

Cell.prototype.isInFadingArea = function(origin) {
  var distance = distanceBetween(this.position, origin);

  let isFadingExterior = distance < rayonExt && distance > (rayonExt - fadingRadius)
  let isFadingInterior = distance > rayonInt && distance < (rayonInt + fadingRadius)

  if (isFadingExterior) {
    this.fadeArea = 'exterior'
    return true
  } else if (isFadingInterior) {
    this.fadeArea = 'interior'
    return true
  } else {
    return false
  }
}

Cell.prototype.fade = function() {
  var distance = distanceBetween(this.position, origin);
  var fadeRatio;

  if (this.fadeArea == 'exterior') {
    fadeRatio = 1 - floor(rayonExt - distance)/fadingRadius;
  } else if (this.fadeArea == 'interior') {
    fadeRatio = 1 - floor(distance - rayonInt)/fadingRadius;
  }

  return lerpColor(this.bkgColor, black, fadeRatio);
}

function distanceBetween(ptA, ptB) {
  return sqrt(sq(ptA.x - ptB.x) + sq(ptA.y - ptB.y));
}

function randomBlueColor() {
  return color(random(0, 220), random(150, 220), 255, 255);
}

function mouseMoved() {
  overredCells().forEach(function(cell) {
    if (cell.active) {
      cell.bkgColor = lerpColor(cell.bkgColor, black, 0.2);

      cell.display();
    }
  });
}

function mouseDragged() {
  overredCells().forEach(function(cell) {
    if (cell.active) {
      cell.bkgColor = randomBlueColor();

      cell.display();
    }
  });
}

function overredCells() {
  let cellX = floor(mouseX/table.cells[0].width);
  let cellY = floor(mouseY/table.cells[0].height);

  let radius = 2;

  cells = table.cells.filter(cell => cell.position.x > cellX - radius &&
                                    cell.position.x < cellX + radius &&
                                    cell.position.y > cellY - radius &&
                                    cell.position.y < cellY + radius);

  return cells;
}
