var system;
var particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  system = new ParticleSystem(createVector(width/2, height/2));
}

function draw() {
  background(20);

  if (system.particles.length < 120) {
    system.addParticle();
  }

  system.run();
}

var Particle = function(position) {
  this.velocity = createVector(5, 5);
  this.position = position.copy();
  this.garbage = false;
};

Particle.prototype.run = function() {
  this.move();
  this.display();
};

Particle.prototype.move = function(){
  if (this.isInLandingArea()) {
    this.position.add(this.velocity);
  } else {
    this.garbage = true;
  }

  if (this.isBouncing()) {
    newVelocity = createVector(-this.velocity.x + random(-1, 1),
                               -this.velocity.y + random(-1, 1));
    this.velocity = newVelocity;
    this.position.add(this.velocity);
  }

};

Particle.prototype.display = function() {
  strokeWeight(2);
  fill(255);
  ellipse(this.position.x, this.position.y, 10, 10);
};

Particle.prototype.isInLandingArea = function(){
  origin = system.origin

  var distance = sqrt(sq(this.position.x - origin.x) + sq(this.position.y - origin.y));

  return distance < height/4;
};

Particle.prototype.isBouncing = function(){
  origin = system.origin

  var distance = sqrt(sq(this.position.x - origin.x) + sq(this.position.y - origin.y));

  return distance >= height/4;
}

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();

    if (p.garbage == true) {
      this.particles.splice(i, 1);
    }
  }
};
