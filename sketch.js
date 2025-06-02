new p5(function (p) {
  myp5 = p;
  let tileset = {};

  p.preload = function () {
    TILE_NAMES.forEach((t) => {
      tileset[t] = p.loadImage("./assets/tiles/" + t + ".png");
      console.log(t + " loaded");
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
      if (
        rooms.length < roomsSlider.value &&
        room.width > 10 &&
        room.height > 10
      ) {
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
    while (rooms.length < roomsSlider.value && iterations < maxIterations) {
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
        p.placeTile(i * TILE_SIZE, j * TILE_SIZE, TILE_NAMES[grid[i][j]]);
      }
    }
  };
});
