let myp5;
let sliderValue = 50;
let abstractnessValue = 50;
const TILE_SIZE = 16;

let seedValue = Math.floor(Math.random() * 10000);
let grid = [];

new p5(function (p) {
  myp5 = p;
  let tileNames = [
    "background",
    "bathroom",
    "carpet",
    "kitchen",
    "wall"
  ]
  let tileset = {}

  p.preload = function () {
    tileNames.forEach(t => {
      tileset[t] = p.loadImage("./assets/tiles/"+t+".png");
      console.log(t+" loaded");
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
    sliderValue = document.getElementById("roomsSlider").value;
    abstractnessValue = document.getElementById("abstractnessSlider").value;
    //p.text("Number of Rooms: " + sliderValue, 10, 20);
    //p.text("Abstractness: " + abstractnessValue, 10, 40);

    p.drawGrid(grid);
  };

  p.placeTile = function (x, y, tileName) {
    p.image(tileset[tileName], x, y);
  };

  p.generateGrid = function() {
    let cols = Math.floor(p.width / TILE_SIZE);
    let rows = Math.floor(p.height / TILE_SIZE);
    let arr = [];
    for (let i = 0; i < cols; i++) {
      arr[i] = [];
      for (let j = 0; j < rows; j++) {
        arr[i][j] = Math.floor(myp5.random(-1, 5));
      }
    }
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
