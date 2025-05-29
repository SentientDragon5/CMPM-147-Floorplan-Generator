let myp5;
let sliderValue = 50;
let abstractnessValue = 50;

new p5(function (p) {
  myp5 = p;

  p.setup = function () {
    p.createCanvas(400, 400);
    p.background(220);
  };

  p.draw = function () {
    p.background(220);
    sliderValue = document.getElementById("roomsSlider").value;
    abstractnessValue = document.getElementById("abstractnessSlider").value;
    p.text("Number of Rooms: " + sliderValue, 10, 20);
    p.text("Abstractness: " + abstractnessValue, 10, 40);
  };
}, "main");
