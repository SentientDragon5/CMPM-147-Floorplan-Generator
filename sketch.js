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
    "32x16_bathtub",
    "shower",
    "oven",
  ];
  let decorset = {};
  let roomsDecor = {
    bathroom: ["sink", "toilet", "toilet-horizontal", "shower"],
    living_room: ["32x16_couch", "32x16_table", "south_chair"],
    bed_room: ["32x32_bed", "south_chair", "32x16_couch", "32x16_table"],
    kitchen: ["oven", "south_chair", "32x16_table"],
  };
  let decorTypeArr = [
    new DecorType("32x16_bathtub", ["bathroom"], false, 2),
    new DecorType("32x16_couch", ["living_room", "bed_room"], false, 2),
    new DecorType(
      "32x16_table",
      ["living_room", "bed_room", "kitchen"],
      false,
      2
    ),
    new DecorType("32x32_bed", ["bed_room"], true, 2, 2),
    new DecorType("oven", ["kitchen"], true),
    new DecorType("shower", ["bathroom"], true),
    new DecorType("sink", ["kitchen"], true),
    new DecorType("south_chair", ["bed_room", "kitchen", "living_room"], false),
    new DecorType("toilet-horizontal", ["bathroom"], true),
    new DecorType("toilet", ["bathroom"], true),
  ];

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

    if (SHOW_DEBUG_TILES) {
      for (let i = 0; i < TILE_NAMES.length; i++) {
        p.placeTile(0, i * TILE_SIZE, TILE_NAMES[i]);
      }
    }
  };

  p.placeTile = function (x, y, tileName) {
    // p.print(tileName);
    //p.print(tileset)
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
    let w = randRange(HOUSE_BORDER_MIN, HOUSE_BORDER_MAX);
    let h = randRange(HOUSE_BORDER_MIN, HOUSE_BORDER_MAX);
    let rootRoom = new Room(
      1 + Math.floor(w / 2),
      1 + Math.floor(w / 2),
      cols - 2 - w,
      rows - 2 - h
    );
    rooms.push(rootRoom);

    let splitRoom = function (room) {
      if (
        rooms.length < roomsSlider.value &&
        room.width > ROOM_MIN_W &&
        room.height > ROOM_MIN_H
      ) {
        let splitH = myp5.random(1) > 0.5;

        if (splitH) {
          let splitPoint = Math.floor(
            myp5.random(ROOM_MIN_SPLIT_SIZE, room.height - ROOM_MIN_SPLIT_SIZE)
          );
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
          let splitPoint = Math.floor(
            myp5.random(ROOM_MIN_SPLIT_SIZE, room.width - ROOM_MIN_SPLIT_SIZE)
          );
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

    let maxIterations = 200;
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
              i == room.x + room.width ||
              j == room.y ||
              j == room.y + room.height
            ) {
              arr[i][j] = tileInd("wall");
            } else {
              arr[i][j] = tileInd("carpet");
            }
          }
        }
      }

      //add furniture to rooms
      let randchoices = [];
      for (let x = room.x + 1; x < room.x + room.width; x++) {
        for (let y = room.y + 1; y < room.y + room.height; y++) {
          if (p.random([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) == 0) {
            randchoices.push([x, y]);
          }
        }
      }
      for (let location of randchoices) {
        //p.random(p.return_options())
        let temp = p.return_size(location[0], location[1], room);
        let chosen = p.random(p.return_options(temp[0], temp[1], room.name)); // returns decorType
        //p.print(chosen)
        room.decorList.push(new Decor(location[0], location[1], chosen));
      }
    }

    // Define wall configurations with start, end, and direction
    const walls = [
      {
        start: rootRoom.x,
        end: rootRoom.x + rootRoom.width,
        y: rootRoom.y,
        windowType: "window_north",
        isVertical: false,
      }, // North
      {
        start: rootRoom.y,
        end: rootRoom.y + rootRoom.height,
        x: rootRoom.x,
        windowType: "window_west",
        isVertical: true,
      }, // West
      {
        start: rootRoom.x,
        end: rootRoom.x + rootRoom.width + 1,
        y: rootRoom.x + rootRoom.height,
        windowType: "window_south",
        isVertical: false,
        offset: rootRoom.x,
      }, // South
      {
        start: rootRoom.y,
        end: rootRoom.y + rootRoom.height,
        x: rootRoom.x + rootRoom.width,
        windowType: "window_east",
        isVertical: true,
        offset: rootRoom.y,
      }, // East
    ];

    // Iterate through each wall and add windows
    for (const wall of walls) {
      for (let i = wall.start; i < wall.end; i++) {
        let tile_name = tileInd("wall");
        if (p.random() < 0.2) {
          tile_name = tileInd(wall.windowType);
        }
        if (wall.isVertical) {
          arr[wall.x][i] = tile_name;
        } else {
          arr[i][wall.y] = tile_name;
        }
      }
    }

    return arr;
  };
  p.return_size = function (x, y, room) {
    return [room.x + room.width - x, room.y + room.height - y];
  };
  p.return_options = function (width, height, roomname) {
    let options = [];
    for (n of decorTypeArr) {
      if (n.roomArr.includes(roomname)) {
        if (n.width <= width) {
          if (n.height <= height) {
            options.push(n);
          }
        }
      }
    }
    //p.print(options);
    return options;
  };
  p.getRoomName = function () {
    return ROOM_NAMES[Math.floor(p.random(ROOM_NAMES.length))];
  };

  p.drawGrid = function (grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let tile_id = grid[i][j];
        if (tile_id < 0) continue;
        let tile_name = TILE_NAMES[grid[i][j]];
        if (tile_name != "wall" && !(tile_name in WINDOW_NAMES)) {
          continue;
        }
        p.placeTile(i * TILE_SIZE, j * TILE_SIZE, TILE_NAMES[grid[i][j]]);
      }
    }
    for (let room of rooms) {
      //draw background

      for (let x = room.x + 1; x < room.width + room.x; x++) {
        for (let y = room.y + 1; y < room.height + room.y; y++) {
          p.placeTile(x * TILE_SIZE, y * TILE_SIZE, p.get_floor(room.name));
        }
      }
      //draw decor

      for (let decor of room.decorList) {
        // p.print(room.decorList);
        // p.print(decor);
        p.placeDecor(
          decor.x * TILE_SIZE,
          decor.y * TILE_SIZE,
          decor.get_name()
        );
      }
    }
  };
  p.get_floor = function (name) {
    let roomDict = {
      bed_room: "carpet",
      kitchen: "kitchen",
      bathroom: "bathroom",
      living_room: "carpet",
    };
    return roomDict[name];
  };
});
