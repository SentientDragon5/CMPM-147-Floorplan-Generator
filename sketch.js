new p5(function (p) {
  myp5 = p;
  let tileset = {};
  let decorset = {};

  let alternate_rotation_dict = {
    "32x16_sink": ["32x16_sink", "16x32_sink"],
    "32x16_desk": ["32x16_desk", "16x32_desk"],
    "32x16_dresser": ["32x16_dresser", "16x32_dresser"],
    "32x16_fridge": ["32x16_fridge", "16x32_fridge"],
  };
  let roomsBaseDecor = {
    bathroom: ["sink", "toilet", "shower", "plant", "trashcan", "plant"],
    living_room: [
      "32x16_couch",
      "32x16_table",
      "32x16_dresser",
      "south_chair",
      "south_chair",
      "32x32_bookcase1",
      "lamp",
      "plant",
      "trashcan",
    ],
    bed_room: [
      "32x16_desk",
      "32x32_bed",
      "32x16_dresser",
      "32x16_couch",
      "32x16_table",
      "south_chair",
      "32x32_bookcase1",
      "lamp",
      "plant",
      "trashcan",
    ],
    kitchen: [
      "oven",
      "sink",
      "32x16_sink",
      "32x16_table",
      "32x16_fridge",
      "south_chair",
      "south_chair",
      "plant",
      "trashcan",
    ],
  };
  let decorTypeDict = {
    "32x16_desk": new DecorType("32x16_desk",true,2 ),
    "16x32_desk": new DecorType("16x32_desk", true,1,2),
    "32x16_sink": new DecorType("32x16_sink",true,2 ),
    "16x32_sink": new DecorType("16x32_sink", true,1, 2),
    "32x16_dresser": new DecorType("32x16_dresser",true,2 ),
    "16x32_dresser": new DecorType("16x32_dresser",true ,1,2 ),
    "32x16_fridge": new DecorType("32x16_fridge",true,2 ),
    "16x32_fridge": new DecorType("16x32_fridge", true,1,2 ),
    "32x32_bookcase1": new DecorType("32x32_bookcase1", true, 2, 2),
    "lamp": new DecorType("lamp", false),
    "plant": new DecorType("plant", false),
    "trashcan": new DecorType("trashcan", false),
    "32x16_bathtub": new DecorType("32x16_bathtub", false, 2),
    "32x16_couch": new DecorType("32x16_couch", false, 2),
    "32x16_table": new DecorType("32x16_table", false, 2),
    "32x32_bed": new DecorType("32x32_bed", true, 2, 2),
    "oven": new DecorType("oven", true),
    "shower": new DecorType("shower", true),
    "sink": new DecorType("sink", true),
    "south_chair": new DecorType("south_chair", false),
    "toilet-horizontal": new DecorType("toilet-horizontal", true),
    "toilet": new DecorType("toilet", true),
  };

  let rooms = [];

  p.preload = function () {
    TILE_NAMES.forEach((t) => {
      tileset[t] = p.loadImage("./assets/tiles/" + t + ".png");
      console.log(t + " loaded");
    });
    let temp = [];
    for (n of Object.keys(decorTypeDict)) {
      temp.push(n);
    }
    temp.forEach((t) => {
      decorset[t] = p.loadImage("./assets/props/" + t + ".png");
      console.log(t + " loaded");
    });
    p.print(decorset);
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
    if (SHOW_DEBUG_TILES) {
      p.text(
        TILE_NAMES.indexOf(tileName),
        x + TILE_SIZE / 2,
        y + TILE_SIZE / 2
      );
    }
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
      //let roomToSplit = rooms[Math.floor(myp5.random(rooms.length))];

      let roomToSplit = rooms.reduce((a, b) =>
        a.width * a.height > b.width * b.height ? a : b
      );
      //let roomToSplit = rooms.reduce((a, b) => ((a.width + a.height) > (b.width + b.height) ? a : b));

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
      let copiedFurnitureArr = [...roomsBaseDecor[room.name]];
      let roomSpaceArr = [];

      for (let x = 0; x < room.width - 1; x++) {
        let temp = new Array(room.height - 1).fill(0);
        roomSpaceArr.push(temp);
      }

      //mutate furniturearr

      mutate_arr(copiedFurnitureArr, p);
      for (let n = 0; n < copiedFurnitureArr.length; n++) {
        if (
          Object.keys(alternate_rotation_dict).includes(copiedFurnitureArr[n])
        ) {
          copiedFurnitureArr[n] =
            alternate_rotation_dict[copiedFurnitureArr[n]][p.random([0, 1])];
        }
      }
      p.print(copiedFurnitureArr)
      for (n of copiedFurnitureArr){
        let location = find_location(roomSpaceArr,decorTypeDict[n],p);
        if (location == [-1,-1]){
          continue;
        }
        let newLocation = [room.x + 1 + location[0], room.y + 1 + location[1]]
        
        room.decorList.push(new Decor(newLocation[0], newLocation[1], decorTypeDict[n]));
      }


    }

    // Define wall configurations with start, end, and direction
    const walls = [
      {
        start: rootRoom.x,
        end: rootRoom.x + rootRoom.width,
        y: rootRoom.y,
        windowType: "window_north",
        doorType: "door_north",
        isVertical: false,
      }, // North
      {
        start: rootRoom.y,
        end: rootRoom.y + rootRoom.height,
        x: rootRoom.x,
        windowType: "window_west",
        doorType: "door_west",
        isVertical: true,
      }, // West
      {
        start: rootRoom.x,
        end: rootRoom.x + rootRoom.width + 1,
        y: rootRoom.x + rootRoom.height,
        windowType: "window_south",
        doorType: "door_south",
        isVertical: false,
        offset: rootRoom.x,
      }, // South
      {
        start: rootRoom.y,
        end: rootRoom.y + rootRoom.height,
        x: rootRoom.x + rootRoom.width,
        windowType: "window_east",
        doorType: "door_east",
        isVertical: true,
        offset: rootRoom.y,
      }, // East
    ];

    let doorPlaced = 0; // Flag to ensure only one door is placed

    // Iterate through each wall and add windows
    for (const wall of walls) {
      let windowStreak = 0; // Keep track of consecutive windows
      for (let i = wall.start; i < wall.end; i++) {
        let tile_name = tileInd("wall");
        let canPlaceWindow = true;
        let canPlaceDoor = doorPlaced < 1; // Can place door if one hasn't been placed yet

        if (wall.isVertical) {
          // Check for interior walls to the right (for west wall) or left (for east wall)
          let checkX = wall.x + (wall.windowType === "window_west" ? 1 : -1);
          if (
            checkX >= 0 &&
            checkX < cols &&
            arr[checkX][i] === tileInd("wall")
          ) {
            canPlaceWindow = false;
            canPlaceDoor = false; // No doors next to interior walls
          }
          // Check for corners
          if (i === wall.start || i === wall.end - 1) {
            canPlaceWindow = false;
            canPlaceDoor = false; // No doors on corners
          }
        } else {
          // Check for interior walls below (for north wall) or above (for south wall)
          let checkY = wall.y + (wall.windowType === "window_north" ? 1 : -1);
          if (
            checkY >= 0 &&
            checkY < rows &&
            arr[i][checkY] === tileInd("wall")
          ) {
            canPlaceWindow = false;
            canPlaceDoor = false; // No doors next to interior walls
          }
          // Check for corners
          if (i === wall.start || i === wall.end - 1) {
            canPlaceWindow = false;
            canPlaceDoor = false; // No doors on corners
          }
        }

        let windowChance = WINDOW_CHANCE_INITIAL; // Initial window chance
        if (windowStreak > 0) {
          windowChance = WINDOW_CHANCE_AFTER; // Higher chance if there's a streak
        }

        if (canPlaceDoor && p.random() < 0.3) {
          // 30% chance to place a door if conditions are met
          tile_name = tileInd(wall.doorType);
          doorPlaced++; // Ensure only one door is placed
        } else if (canPlaceWindow && p.random() < windowChance) {
          tile_name = tileInd(wall.windowType);
          windowStreak++; // Increase streak
        } else {
          windowStreak = 0; // Reset streak
        }

        if (wall.isVertical) {
          arr[wall.x][i] = tile_name;
        } else {
          arr[i][wall.y] = tile_name;
        }
      }
    }

    // Add internal doors between adjacent rooms
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        let room1 = rooms[i];
        let room2 = rooms[j];

        // Check if rooms are adjacent horizontally
        if (room1.y === room2.y && room1.height === room2.height) {
          if (room1.x + room1.width === room2.x) {
            // Room1 is to the left of Room2
            let doorY = Math.floor(
              p.random(
                Math.max(room1.y, room2.y) + 1,
                Math.min(room1.y + room1.height, room2.y + room2.height) - 1
              )
            );
            arr[room1.x + room1.width][doorY] = tileInd("door_east");
          } else if (room2.x + room2.width === room1.x) {
            // Room2 is to the left of Room1
            let doorY = Math.floor(
              p.random(
                Math.max(room1.y, room2.y) + 1,
                Math.min(room1.y + room1.height, room2.y + room2.height) - 1
              )
            );
            arr[room2.x + room2.width][doorY] = tileInd("door_east");
          }
        }

        // Check if rooms are adjacent vertically
        if (room1.x === room2.x && room1.width === room2.width) {
          if (room1.y + room1.height === room2.y) {
            // Room1 is above Room2
            let doorX = Math.floor(
              p.random(
                Math.max(room1.x, room2.x) + 1,
                Math.min(room1.x + room1.width, room2.x + room2.width) - 1
              )
            );
            arr[doorX][room1.y + room1.height] = tileInd("door_south");
          } else if (room2.y + room2.height === room1.y) {
            // Room2 is above Room1
            let doorX = Math.floor(
              p.random(
                Math.max(room1.x, room2.x) + 1,
                Math.min(room1.x + room1.width, room2.x + room2.width) - 1
              )
            );
            arr[doorX][room2.y + room2.height] = tileInd("door_south");
          }
        }
      }
    }

    return arr;
  };
  p.return_size = function (x, y, room) {
    return [room.x + room.width - x, room.y + room.height - y];
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
        // in main.js
        if (SHOW_DEBUG_DECOR_INFO) {
          p.print(room.decorList);
          p.print(decor);
        }
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
