'use strict';

let table;

const baseSize = 50;
const baseframeRate = 10;

function setup() {
  frameRate(baseframeRate);
  createCanvas(windowWidth, windowHeight);

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
  table.randomCell().display();
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
  this.color = {r: 0, g: 0, b: 0};
  this.strokeColor = {r: 0, g: 0, b: 0};
  this.width = width/table.columns;
  this.height = height/table.rows;
};

Cell.prototype.display = function() {
  this.color = randomBlueColor();
  this.strokeColor = randomBlueColor();

  fill(this.color.r, this.color.g, this.color.b);
  stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b);

  rect(this.position.x * this.width,
       this.position.y * this.height,
       this.width + 1,
       this.height + 1);
};

function randomRedColor() {
  return {r: 255, g: random(0, 170), b: random(0, 100)};
}

function randomBlueColor() {
  return {r: random(100, 200), g: random(100, 200), b: 255};
}

function randomGreenColor() {
  return {r: random(0, 200), g: 255, b: random(0, 200)};
}
