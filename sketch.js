new p5(function (p) {
  myp5 = p;
  let tileset = {};
  let decorNames = [
    "32x16_couch",
    "32x16_table",
    "32x32_bed",
    "sink",
    "south_chair",
    "toilet-horizontal",
    "toilet",
  ];
  let decorset = {};
  let roomsDecor = {
    bathroom: ["sink", "toilet", "toilet-horizontal"],
    living_room: ["32x16_couch", "32x16_table", "south_chair"],
    bed_room: ["32x32_bed", "south_chair", "32x16_couch", "32x16_table"],
  };
  let rooms = [];
  p.preload = function () {
    TILE_NAMES.forEach((t) => {
      tileset[t] = p.loadImage("./assets/tiles/" + t + ".png");
      console.log(t + " loaded");
    });
    decorNames.forEach((t) => {
      decorset[t] = p.loadImage("./assets/props/" + t + ".png");
    });
  };

  p.setup = function () {
    p.reroll();
    let canvas = p.createCanvas(400, 400);
    canvas.parent(document.getElementById("canvasContainer"));
    p.background(220);
    grid = p.generateGrid();
  };

  p.setSeed = function (seedValue) {
    let seed = Number(seedValue);
    p.randomSeed(seedValue);
    seedBox.value = seedValue;
    console.log("Seed set to", seedValue);
    return seed;
  };
  p.reroll = function () {
    let seed = Math.floor(Math.random() * 10000);
    return p.setSeed(seed);
  };

  p.regenerate = function () {
    grid = p.generateGrid();
  };

  p.draw = function () {
    p.clear();
    p.drawGrid(grid);
    for (let i = 0; i < rooms.length; i++) {
      rooms[i].drawLabel(p);
    }
  };

  p.placeTile = function (x, y, tileName) {
    p.image(tileset[tileName], x, y);
  };
  p.placeDecor = function (x, y, decorName) {
    p.image(decorset[decorName], x, y);
  };

  p.generateGrid = function () {
    let cols = Math.floor(p.width / TILE_SIZE);
    let rows = Math.floor(p.height / TILE_SIZE);
    let arr = [];

    for (let i = 0; i < cols; i++) {
      arr[i] = [];
      for (let j = 0; j < rows; j++) {
        arr[i][j] = 0;
      }
    }

    rooms = [];
    let rootRoom = new Room(1, 1, cols - 2, rows - 2);
    rooms.push(rootRoom);

    let splitRoom = function (room) {
      if (
        rooms.length < roomsSlider.value &&
        room.width > 10 &&
        room.height > 10
      ) {
        let splitH = myp5.random(1) > 0.5;

        if (splitH) {
          let splitPoint = Math.floor(myp5.random(5, room.height - 5));
          let newRoom1 = new Room(room.x, room.y, room.width, splitPoint);
          newRoom1.name = p.getRoomName();
          let newRoom2 = new Room(
            room.x,
            room.y + splitPoint,
            room.width,
            room.height - splitPoint
          );
          newRoom2.name = p.getRoomName();

          rooms.push(newRoom1);
          rooms.push(newRoom2);
          return [newRoom1, newRoom2];
        } else {
          let splitPoint = Math.floor(myp5.random(5, room.width - 5));
          let newRoom1 = new Room(room.x, room.y, splitPoint, room.height);
          newRoom1.name = p.getRoomName();
          let newRoom2 = new Room(
            room.x + splitPoint,
            room.y,
            room.width - splitPoint,
            room.height
          );
          newRoom2.name = p.getRoomName();

          rooms.push(newRoom1);
          rooms.push(newRoom2);
          return [newRoom1, newRoom2];
        }
      }
      return null;
    };

    let maxIterations = 20;
    let iterations = 0;
    while (rooms.length < roomsSlider.value && iterations < maxIterations) {
      let roomToSplit = rooms[Math.floor(myp5.random(rooms.length))];
      let newRooms = splitRoom(roomToSplit);

      if (newRooms) {
        let index = rooms.indexOf(roomToSplit);
        if (index > -1) {
          rooms.splice(index, 1);
        }
      } else {
        iterations++;
      }
    }

    // Fill the rooms in the grid
    for (let room of rooms) {
      for (let i = room.x; i < room.x + room.width; i++) {
        for (let j = room.y; j < room.y + room.height; j++) {
          if (i < cols && j < rows) {
            if (
              i == room.x ||
              i == room.x + room.width - 1 ||
              j == room.y ||
              j == room.y + room.height - 1
            ) {
              arr[i][j] = 4;
            } else {
              arr[i][j] = 2; // Carpet
            }
          }
        }
      }

      //add furniture to rooms
      let randchoices = [];
      for (let x = room.x + 1; x < room.x + room.width - 1; x++) {
        for (let y = room.y + 1; y < room.y + room.height - 1; y++) {
          if (p.random([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) == 0) {
            randchoices.push([x, y]);
          }
        }
      }
      for (let location of randchoices) {
        let randdecor = p.random(roomsDecor["bed_room"]);
        room.decorList.push(
          new Decor(location[0], location[1], 1, 1, randdecor)
        );
      }
    }

    return arr;
  };

  p.getRoomName = function () {
    const roomNames = ["Kitchen", "Bathroom", "Living Room", "Bedroom"];
    return roomNames[Math.floor(p.random(roomNames.length))];
  };

  p.drawGrid = function (grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] < 0) continue;
        if (TILE_NAMES[grid[i][j]] != "wall") {
          continue;
        }
        p.placeTile(i * TILE_SIZE, j * TILE_SIZE, TILE_NAMES[grid[i][j]]);
      }
    }

    for (let room of rooms) {
      //draw background
      for (let x = room.x; x < room.width + room.x; x++) {
        for (let y = room.y; y < room.height + room.y; y++) {
          p.placeTile(x * TILE_SIZE, y * TILE_SIZE, TILE_NAMES[grid[x][y]]);
        }
      }
      //draw decor
      for (let decor of room.decorList) {
        p.print(room.decorList);
        p.print(decor);
        p.placeDecor(decor.x * TILE_SIZE, decor.y * TILE_SIZE, decor.name);
      }
    }
  };
});

class Room {
  constructor(x, y, width, height, name) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
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
