let myp5;
let roomsValue = 4;
let abstractnessValue = 50;
const TILE_SIZE = 16;

let seedValue = Math.floor(Math.random() * 10000);
let grid = [];

class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

new p5(function (p) {
  myp5 = p;
  let tileNames = ["background", "bathroom", "carpet", "kitchen", "wall"];
  let tileset = {};

  p.preload = function () {
    tileNames.forEach((t) => {
      tileset[t] = p.loadImage("./assets/tiles/" + t + ".png");
      console.log(t + " loaded");
    });
  };

  p.setup = function () {
    document.getElementById("seed-box").value = seedValue;
    let canvas = p.createCanvas(400, 400);
    canvas.parent(document.getElementById("canvasContainer"));
    p.background(220);
    p.randomSeed(Number(seedValue));
    grid = p.generateGrid();
  };

  p.draw = function () {
    // Update seed if changed
    let newSeed = document.getElementById("seed-box").value;
    if (newSeed !== seedValue) {
      seedValue = newSeed;
      p.randomSeed(Number(seedValue));
      grid = p.generateGrid();
    }
    p.clear();
    //p.background(220);
    roomsValue = document.getElementById("roomsSlider").value;
    abstractnessValue = document.getElementById("abstractnessSlider").value;
    //p.text("Number of Rooms: " + sliderValue, 10, 20);
    //p.text("Abstractness: " + abstractnessValue, 10, 40);

    p.drawGrid(grid);
  };

  p.placeTile = function (x, y, tileName) {
    p.image(tileset[tileName], x, y);
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

    let rooms = [];
    let rootRoom = new Room(1, 1, cols - 2, rows - 2);
    rooms.push(rootRoom);

    let splitRoom = function (room) {
      if (rooms.length < roomsValue && room.width > 10 && room.height > 10) {
        // Decide to split horizontally or vertically
        let splitH = myp5.random(1) > 0.5;

        if (splitH) {
          // Horizontal split
          let splitPoint = Math.floor(myp5.random(5, room.height - 5));
          let newRoom1 = new Room(room.x, room.y, room.width, splitPoint);
          let newRoom2 = new Room(
            room.x,
            room.y + splitPoint,
            room.width,
            room.height - splitPoint
          );

          rooms.push(newRoom1);
          rooms.push(newRoom2);
          return [newRoom1, newRoom2];
        } else {
          // Vertical split
          let splitPoint = Math.floor(myp5.random(5, room.width - 5));
          let newRoom1 = new Room(room.x, room.y, splitPoint, room.height);
          let newRoom2 = new Room(
            room.x + splitPoint,
            room.y,
            room.width - splitPoint,
            room.height
          );

          rooms.push(newRoom1);
          rooms.push(newRoom2);
          return [newRoom1, newRoom2];
        }
      }
      return null;
    };

    let maxIterations = 20; // cap the iterations
    let iterations = 0;
    while (rooms.length < roomsValue && iterations < maxIterations) {
      let roomToSplit = rooms[Math.floor(myp5.random(rooms.length))];
      let newRooms = splitRoom(roomToSplit);

      if (newRooms) {
        // Remove the split room
        let index = rooms.indexOf(roomToSplit);
        if (index > -1) {
          rooms.splice(index, 1);
        }
      } else {
        iterations++;
      }
    }

    // Fill the rooms in the grid
    for (let k = 0; k < rooms.length; k++) {
      let room = rooms[k];
      for (let i = room.x; i < room.x + room.width; i++) {
        for (let j = room.y; j < room.y + room.height; j++) {
          if (i < cols && j < rows) {
            if (
              i == room.x ||
              i == room.x + room.width - 1 ||
              j == room.y ||
              j == room.y + room.height - 1
            ) {
              arr[i][j] = 4; // Wall
            } else {
              arr[i][j] = 2; // Carpet
            }
          }
        }
      }
    }

    console.log(rooms);
    return arr;
  };

  p.drawGrid = function (grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] < 0) continue;
        p.placeTile(i * TILE_SIZE, j * TILE_SIZE, tileNames[grid[i][j]]);
      }
    }
  };
});
