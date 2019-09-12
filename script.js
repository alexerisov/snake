'use strict';

function displayCanvas () {

    let gameDiv = document.getElementById("game");
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", "500");
    canvas.setAttribute("height", "500");
    gameDiv.appendChild(canvas);

    let canvas = document.querySelector("canvas")
    let cx = canvas.getContext("2d");
    cx.strokeStyle = "black";
    cx.lineWidth = 1;
    
    let number = 25,
        step = 20;

    for (let i = 0; i < number; i++) {
        for (let j = 0; j < number; j++) {
        cx.strokeRect(i*step, j*step, step, step);
        }
    }
}


function level (plan) {

this.width = 10;
this.height = 10;
this.grid = new Array[width * height];

for (let i = 0; i < height; i++) {
 for (let j = 0; j < width; j++) {

} 
} 

} 

