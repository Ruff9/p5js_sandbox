var w, h, base;
var columns, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);

  base = 40;

  columns = floor(width/base);
  rows = floor(height/base);

  w = width/columns;
  h = height/rows;

  for ( var i = 0; i < columns; i++ ) {
    for ( var j = 0; j < rows; j++ ) {
      fill(255, random(0, 200), random(0, 200));
      noStroke();
      rect(i*w, j*h, w+1, h+1);
    }
  }
}

function draw() {
}
