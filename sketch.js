let myp5;
let sliderValue = 50;
let abstractnessValue = 50;
const TILE_SIZE = 16;

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
    let canvas = p.createCanvas(400, 400);
    canvas.parent(document.getElementById("canvasContainer"));
    p.background(220);
  };

  p.draw = function () {
    p.background(220);
    sliderValue = document.getElementById("roomsSlider").value;
    abstractnessValue = document.getElementById("abstractnessSlider").value;
    p.text("Number of Rooms: " + sliderValue, 10, 20);
    p.text("Abstractness: " + abstractnessValue, 10, 40);
    
    let x = 0;
    tileNames.forEach(t => {
      p.placeTile(x,4*TILE_SIZE,t);
      x += TILE_SIZE;
    });
  };

  p.placeTile = function (x, y, tileName) {
    p.image(tileset[tileName], x, y);
  };

  p.drawGrid = function (grid) {
    p.background(128);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        p.placeTile(i, j, p.random(4) | 0, 13);
      }
    }
  };
});
