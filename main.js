let myp5;
let grid = [];

const TILE_SIZE = 16;
const TILE_NAMES = ["background", "bathroom", "carpet", "kitchen", "wall"];

const roomsSlider = document.getElementById("roomsSlider");
const roomsBox = document.getElementById("rooms-box");
const abstractnessSlider = document.getElementById("abstractnessSlider");
const abstractnessBox = document.getElementById("abstractness-box");
const seedBox = document.getElementById("seed-box");
const rerollSeed = document.getElementById("reroll-seed");

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
