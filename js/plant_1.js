let table, ground;
let black, brown;

const baseSize = 12; // pixels

function setup() {
  createCanvas(windowWidth, windowHeight);
  black = color(0);
  brown = color(30, 20, 10);

  background(black);

  table = new Table();

  ground = floor(table.rows*2/3);

  for ( let k = 0; k < table.columns; k++ ) {
    for ( let l = 0; l < table.rows; l++ ) {
      let cell = new Cell({x: k, y: l});
      if( l > ground ) { cell.color = brown; }
      table.cells.push(cell);
      cell.display();
    }
  }

  let seed = new Cell({x: table.columns/2, y: ground}, randomGreenColor());
  let plant = new Plant(seed);

  table.plants.push(plant);
}

function draw() {
  let plant = table.plants[0];

  plant.display();

  switch (plant.state) {
    case 'growing':
      plant.grow();
      break;
    case 'blooming':
      plant.bloom();
      break;
  }
}

class Table {
  constructor() {
    this.columns = round(width/baseSize);
    this.rows = round(height/baseSize);
    this.cells = [];
    this.plants = [];
  }

  cellsInContact(origin) {
    function isInContact(cell) {
      return (cell.position.x == origin.position.x && cell.position.y == origin.position.y - 1) ||
             (cell.position.x == origin.position.x && cell.position.y == origin.position.y + 1) ||
             (cell.position.y == origin.position.y && cell.position.x == origin.position.x - 1) ||
             (cell.position.y == origin.position.y && cell.position.x == origin.position.x + 1)
    }

    return this.cells.filter(isInContact);
  }
};

class Cell {
  constructor(position, color = black) {
    this.position = position;
    this.color = color;
    this.width = round(width/table.columns);
    this.height = round(height/table.rows);
  }

  display() {
    let bkg = this.color;

    noStroke();
    fill(bkg);

    rect(this.position.x * this.width,
         this.position.y * this.height,
         this.width,
         this.height);
  }
}

class Plant {
  constructor(seed){
    this.body = [seed]
    this.color = seed.color;
    this.size = 1;
    this.maxSize = 25;
    this.state = 'growing';
    this.growSpeed = 15; // entre 0 et 100
    this.energy = 0;
    this.flowerColor = randomRedColor();
    this.petals = [];
    this.maxPetals = 35;
  };

  display() {
    for (let i = 0; i < this.body.length; i++) {
      this.body[i].display();
    }
  }

  grow() {
    if(this.size == this.maxSize) {
      this.state = 'blooming';
      return;
    }

    this.energy = this.energy + this.growSpeed;

    if (this.energy >= 100) {
      let lastCell = this.body[this.body.length - 1];
      let newCell = new Cell({x: lastCell.position.x, y: lastCell.position.y - 1}, this.color);

      this.size ++;
      this.body.push(newCell);
      this.energy = 0;
    }
  }

  bloom() {
    let head = this.body[this.body.length - 1];

    head.color = this.flowerColor;
    head.display();

    this.energy = this.energy + this.growSpeed;

    if (this.energy >= 100) {
      if(this.petals.length >= this.maxPetals) {
        console.log('flower bloomed');
        this.state = 'waiting';
        return
      } else if(this.petals.length < 1) {
        let newPetals = table.cellsInContact(head);

        for (let i = 0; i < newPetals.length; i++) {
          newPetals[i].color = this.flowerColor;
          newPetals[i].display();
        }

        this.petals = this.petals.concat(newPetals);

        this.energy = 0;
      } else {
        let newPetals = []

        for (let i = 0; i < this.petals.length; i++) {
          let newP = table.cellsInContact(this.petals[i]);
          newPetals.push(newP);
        }
        newPetals = newPetals.flat().filter(onlyUnique);
        for (let i = 0; i < newPetals.length; i++) {
          newPetals[i].color = this.flowerColor;
          newPetals[i].display();
        }

        this.petals = this.petals.concat(newPetals);
        this.energy = 0;
      }
    }
  }
}




function randomGreenColor() {
  return color(random(0, 170), 190, random(0, 30));
}

function randomRedColor() {
  return color(190, random(0, 170), random(0, 30));
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
