var stars = [];
var warpStart = 60;
var warpEnd = 240;
var time = 0;

var initialSpeed = 1.0005;
var speed1 = 1.025;
var speed2 = 1.06;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (i = 0; i < 1000; i++) {
    stars[i] = {
      posX1: Math.random() * width - width/2,
      posY1: Math.random() * height - height/2,
      size: map(Math.random(), 0, 1, 1, 3),
      color: Math.floor(Math.random() * 155) + 150
    }

    stars[i].posX2 = stars[i].posX1;
    stars[i].posY2 = stars[i].posY1;
  };
}

function draw() {
  background(0,0,20);

  translate(width/2, height/2);
  // translate(mouseX, mouseY);

  stars.forEach(function(star) {
    stroke(star.color);
    strokeWeight(star.size);

    line(star.posX1, star.posY1, star.posX2, star.posY2);

    if (time < warpStart) {
      initial(star)
    } else if (time > warpEnd) {
      slowing(star);
    } else {
      accelerating(star)
    }
  });

  time++;

  if (time == 500) { time = 0; }
}

function initial(star) {
  star.posX1 = initialSpeed*star.posX1;
  star.posY1 = initialSpeed*star.posY1;
  star.posX2 = initialSpeed*star.posX2;
  star.posY2 = initialSpeed*star.posY2;
}

function accelerating(star) {
  star.posX1 = speed1*star.posX1;
  star.posY1 = speed1*star.posY1;
  star.posX2 = speed2*star.posX2;
  star.posY2 = speed2*star.posY2;

  if (Math.abs(star.posX1) > width/2 || Math.abs(star.posY1) > height/2) {
    star.posX1 = (Math.random() * width - width/2)/2;
    star.posY1 = (Math.random() * height - height/2)/2;
    star.posX2 = star.posX1;
    star.posY2 = star.posY1;
  }
}

function slowing(star) {
  if (Math.abs(star.posX1) < Math.abs(star.posX2)) {
    star.posX1 = speed2*star.posX1;
  } else {
    star.posX1 = initialSpeed*star.posX2;
  }

  if (Math.abs(star.posY1) < Math.abs(star.posY2)) {
    star.posY1 = speed2*star.posY1;
  } else {
    star.posY1 = initialSpeed*star.posY2;
  }

  star.posX2 = initialSpeed*star.posX2;
  star.posY2 = initialSpeed*star.posY2;

  if (Math.abs(star.posX1) > width/2 || Math.abs(star.posY1) > height/2) {
    star.posX1 = (Math.random() * width - width/2);
    star.posY1 = (Math.random() * height - height/2);
    star.posX2 = star.posX1;
    star.posY2 = star.posY1;
  }
}