var table, origin, velocity;

var baseSize = 12;
var blueAreaSize = 10;
var baseVelocity = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);

  table = new Table();
  velocity = baseVelocity;

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

  for (step = 0; step < 3; step++) {
    updateRandomRedCell();
  }
}

function moveBlueArea() {
  if (floor(origin.x) == floor(table.columns*3/4)) {
    velocity = -baseVelocity;
  } else if (floor(origin.x) == floor(table.columns/4)) {
    velocity = baseVelocity;
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

function updateRandomRedCell() {
  var redCells = table.cells.filter(cell => cell.type === 'red');
  var randomRedCell = redCells[floor(random() * redCells.length)];

  randomRedCell.color = randomRedColor();
  randomRedCell.display();
}

var Table = function() {
  this.columns = floor(width/baseSize);
  this.rows = floor(height/baseSize);
  this.cells = [];
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
  var distance = sqrt(sq(this.position.x - origin.x) +
                      sq(this.position.y - origin.y));

  return distance < blueAreaSize;
};

function randomRedColor() {
  return {r: 255, g: random(0, 170), b: random(0, 100)};
}

function randomBlueColor() {
  return {r: random(100, 200), g: random(100, 200), b: 255};
}
