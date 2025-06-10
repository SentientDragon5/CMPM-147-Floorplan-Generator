let myp5;
let grid = [];

// currently breaks the project
// it tries to generate out of bounds.
const HOUSE_BORDER_MAX = 4;
const HOUSE_BORDER_MIN = 0;

const ROOM_NAMES = ["kitchen", "bathroom", "living_room", "bed_room"];
const ROOM_MIN_W = 8; // Maybe we scale this by abstractness?
const ROOM_MIN_H = 8;
const ROOM_MIN_SPLIT_SIZE = 5;

class Room {
  constructor(x, y, width, height, name) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.decorList = [];
  }

  drawLabel(p) {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.fill(0);
    let centerX = (this.x + this.width / 2) * TILE_SIZE;
    let centerY = (this.y + this.height / 2) * TILE_SIZE;
    p.text(this.name, centerX, centerY);
  }
}
class DecorType {
  constructor(name, wallAdjacent, width = 1, height = 1) {
    this.width = width;
    this.height = height;
    this.name = name;
    this.wallAdjacent = wallAdjacent;
  }
}
class Decor {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  get_name() {
    return this.type.name;
  }
}

const SHOW_DEBUG_DECOR_INFO = false;
const SHOW_DEBUG_TILES = false;
const TILE_SIZE = 16;

const WINDOW_CHANCE_INITIAL = 0.1;
const WINDOW_CHANCE_AFTER = 0.5;
// Add window tile names
const WINDOW_NAMES = [
  "window_north",
  "window_south",
  "window_east",
  "window_west",
];
const DOOR_NAMES = ["door_north", "door_south", "door_east", "door_west"];
const TILE_NAMES = [
  "clear",
  "background",
  "bathroom",
  "carpet",
  "kitchen",
  "wall",
].concat(WINDOW_NAMES, DOOR_NAMES);
tileInd = function (tile) {
  return TILE_NAMES.indexOf(tile);
};

const roomsSlider = document.getElementById("roomsSlider");
const roomsBox = document.getElementById("rooms-box");
const abstractnessSlider = document.getElementById("abstractnessSlider");
const abstractnessBox = document.getElementById("abstractness-box");
const seedBox = document.getElementById("seed-box");
const rerollSeed = document.getElementById("reroll-seed");

randRange = function (min, max) {
  console.log(Math.floor(Math.random() * (max - min) + min));
  return Math.floor(Math.random() * (max - min) + min);
};

roomsSlider.oninput = function () {
  roomsBox.value = roomsSlider.value;
  myp5.regenerate();
};

roomsBox.oninput = function () {
  roomsSlider.value = roomsBox.value;
  myp5.regenerate();
};

abstractnessSlider.oninput = function () {
  abstractnessBox.value = abstractnessSlider.value;
  myp5.regenerate();
};

abstractnessBox.oninput = function () {
  abstractnessSlider.value = abstractnessBox.value;
  myp5.regenerate();
};

seedBox.oninput = function () {
  myp5.setSeed(seedBox.value);
  myp5.regenerate();
};

rerollSeed.onclick = function () {
  myp5.reroll();
  myp5.regenerate();
};
