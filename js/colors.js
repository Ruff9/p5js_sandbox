var w, h, base;
var table, columns, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);

  base = 20;

  table = new Table();

  for ( var i = 0; i < table.columns; i++ ) {
    for ( var j = 0; j < table.rows; j++ ) {
      cell = new Cell({x: i, y: j})
      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
  var randomCell= table.cells[Math.floor(Math.random() * table.cells.length)];

  randomCell.color = {r: 255, g: random(20, 200), b: random(20, 200)};
  randomCell.display();
}

var Table = function() {
  this.columns = floor(width/base);
  this.rows = floor(height/base);
  this.cells = [];
}

var Cell = function(position) {
  this.position = position;
  this.color = {r: 255, g: random(20, 200), b: random(20, 200)};
  this.width = width/table.columns;
  this.height = height/table.rows;
};

Cell.prototype.display = function() {
  fill(this.color.r, this.color.g, this.color.b);
  noStroke();

  rect(this.position.x*this.width,
       this.position.y*this.height,
       this.width+1,
       this.height+1);
};