var title;
var bottom;

var downStart = 60;
var upStart = 120;
var time = 0;

function setup() {
  createCanvas(1,1).hide();
  bottom = 100;

  let originalTitle = selectAll('.title')[0];
  let extractedLetters = originalTitle.elt.innerText.split('');
  originalTitle.hide();

  homeLink = createA('http://www.inventif.fr', '', 'blank').addClass('title');
  title = new Title;

  for (let i = 0; i < extractedLetters.length; i++) {
    span = createSpan(extractedLetters[i]).addClass('title-letter')
                                          .addClass('number' + i);
    span.parent(homeLink);

    let letter = new Letter(extractedLetters[i], span.position())
    title.letters.push(letter);
  }
}

function draw() {
  if(time > downStart && title.isUp) {
    title.goDown();
  } else if (time > upStart && title.isDown) {
    title.goUp();
  }

  time++;
}

var Title = function() {
  this.letters = [];
  this.isUp = true;
  this.isDown = false;
}

Title.prototype.goDown = function() {
  for (let i = 0; i < title.letters.length; i++) {
    let letter = title.letters[i]
    query = ".number" + i
    let span = select(query);

    newPosY = letter.pos.y + letter.speed;

    if(letter.pos.y < bottom) {
      if(newPosY < bottom) {
        span.position(letter.pos.x, newPosY);
        letter.pos.y = newPosY;
      } else if(newPosY >= bottom) {
        span.position(letter.pos.x, bottom);
        letter.pos.y = bottom;
      };
      title.checkIfDown();
      if(title.isDown) {
        title.letters.forEach(function(l) {l.randomizeSpeed();})
      }
    };
  }
};

Title.prototype.goUp = function() {
  for (let i = 0; i < title.letters.length; i++) {
    let letter = title.letters[i]
    query = ".number" + i
    let span = select(query);

    newPosY = letter.pos.y - letter.speed;

    if(letter.pos.y > 0) {
      if(newPosY > 0) {
        span.position(letter.pos.x, newPosY);
        letter.pos.y = newPosY;
      } else if(newPosY <= 0) {
        span.position(letter.pos.x, 0);
        letter.pos.y = 0;
      };
      title.checkIfUp();
      if(title.isUp) {
        title.letters.forEach(function(l) {l.randomizeSpeed();})
        time = 0;
      }
    };
  }
};

Title.prototype.checkIfDown = function() {
  let reducer = (accumulator, current) => accumulator && (current.pos.y == bottom);

  result = this.letters.reduce(reducer);

  if(result == true) {
    this.isDown = true;
    this.isUp = false;
  }
}

Title.prototype.checkIfUp = function() {
  let reducer = (accumulator, current) => accumulator && (current.pos.y == 0);

  result = this.letters.reduce(reducer);

  if(result == true) {
    this.isUp = true;
    this.isDown = false;
  }
}

var Letter = function(value, pos) {
  this.value = value;
  this.pos = pos;
  this.speed = random(2,5);
}

Letter.prototype.randomizeSpeed = function() {
  this.speed = random(2,5);
}