var table, origin;
var base = 20;
var velocity = 0.2;

function setup() {
  createCanvas(windowWidth, windowHeight);

  table = new Table();

  origin = {x: floor(table.columns/2), y: floor(table.rows/2)};

  for ( var i = 0; i < table.columns; i++ ) {
    for ( var j = 0; j < table.rows; j++ ) {
      cell = new Cell({x: i, y: j})

      if (cell.isInBlueArea(origin)) { cell.type = 'blue'; };

      table.cells.push(cell);
      cell.display();
    }
  }
}

function draw() {
  moveBlueArea();

  updateRedCells();
  updateBlueCells();
}

function moveBlueArea() {
  if (floor(origin.x) == floor(table.columns*3/4)) {
    velocity = -0.2;
  } else if (floor(origin.x) == floor(table.columns/4)) {
    velocity = 0.2;
  }

  origin.x = origin.x + velocity;

  table.cells.forEach(function(cell) {
    if (cell.isInBlueArea(origin) && cell.type == 'red') {
      cell.type = 'blue';
      cell.color = randomBlueColor();
      cell.display();
    } else if (!cell.isInBlueArea(origin) && cell.type == 'blue') {
      cell.type = 'red';
      cell.color = randomRedColor();
      cell.display();
    }
  });
}

function updateRedCells() {
  var redCells = table.redCells();
  var randomRedCell = redCells[floor(random() * redCells.length)];

  randomRedCell.color = randomRedColor();
  randomRedCell.display();
}

function updateBlueCells() {
  var blueCells = table.blueCells();
  var randomBlueCell = blueCells[floor(random() * blueCells.length)];

  if (randomBlueCell == null) { return }
  randomBlueCell.color = randomBlueColor();
  randomBlueCell.display();
}

var Table = function() {
  this.columns = floor(width/base);
  this.rows = floor(height/base);
  this.cells = [];
}

Table.prototype.redCells = function() {
  return this.cells.filter(cell => cell.type === 'red');
}

Table.prototype.blueCells = function() {
  return this.cells.filter(cell => cell.type === 'blue');
}

var Cell = function(position) {
  this.position = position;
  this.color = randomRedColor();
  this.width = width/table.columns;
  this.height = height/table.rows;
  this.type = 'red';
};

Cell.prototype.display = function() {
  if(this.type == 'blue') {this.color = randomBlueColor()}
  fill(this.color.r, this.color.g, this.color.b);
  noStroke();

  rect(this.position.x * this.width,
       this.position.y * this.height,
       this.width + 1,
       this.height + 1);
};

Cell.prototype.isInBlueArea = function(origin) {
  var areaWidth = 5;

  var distance = sqrt(sq(this.position.x - origin.x) +
                      sq(this.position.y - origin.y));

  return distance < areaWidth;
};

function randomRedColor() {
  return {r: 255, g: random(20, 200), b: random(20, 100)};
}

function randomBlueColor() {
  return {r: random(20, 100), g: random(20, 200), b: 255};
}
