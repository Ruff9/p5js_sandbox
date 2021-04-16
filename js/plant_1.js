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
  constructor(seed) {
    this.id = 1;
    this.rod = null;
    this.flower = null;

    this.body = [seed];
    this.color = seed.color;

    this.state = 'growing';
    this.growSpeed = 15; // entre 0 et 100
    this.energy = 0;

    this.init(seed);
  };

  init(seed) {
    let rod = new Rod(this.id, seed);
    this.rod = rod;
  }

  display() {
    switch (this.state) {
      case 'growing':
        this.rod.grow();
        break;
      case 'blooming':
        if (this.flower == null) {
          let bud = this.rod.body[this.rod.body.length - 1];
          this.flower = new Flower(this.id, bud);
        }
        this.flower.bloom();
        break;
      case 'done':
        break;
    }

    let cells = this.rod.body;
    if (this.flower) { cells = [...cells, ...this.flower.petals].filter(onlyUnique); }

    for (let i = 0; i < cells.length; i++) {
      cells[i].display();
    }
  }
}

class Rod {
  constructor(plantId, seed) {
    this.plantId = plantId;
    this.size = 1;
    this.maxSize = 25;
    this.body = [seed];
    this.color = seed.color;
    this.growSpeed = 15; // entre 0 et 100
    this.energy = 0;
  }

  grow() {
    if(this.size == this.maxSize) {
      console.log('rod grown');
      parent(this.plantId).state = 'blooming';
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
}

class Flower {
  constructor(plantId, bud) {
    this.plantId = plantId;
    this.bud = bud;
    this.color = randomRedColor();
    this.petals = [bud];
    this.maxPetals = 35;
    this.growSpeed = 15; // entre 0 et 100
    this.energy = 0;
  }

  bloom() {
    this.energy = this.energy + this.growSpeed;

    if(this.petals.length >= this.maxPetals) {
      console.log('flower bloomed');
      parent(this.plantId).state = 'done';
      return
    }

    if (this.energy >= 100) {
      let newPetals = []

      for (let i = 0; i < this.petals.length; i++) {
        let newP = table.cellsInContact(this.petals[i]);
        newPetals.push(newP);
      }

      newPetals = newPetals.flat().filter(onlyUnique);

      for (let i = 0; i < newPetals.length; i++) {
        newPetals[i].color = this.color;
      }

      this.petals = this.petals.concat(newPetals);
      this.energy = 0;
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

function parent(id) {
  let plant = table.plants.find(x => x.id === id)
  return plant;
}
