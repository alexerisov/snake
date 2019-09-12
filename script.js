'use strict';

function level (plan) {
  this.width = 10;
  this.height = 10;
  this.grid = new Array[width * height]();

  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {

    }
  }
}

function displayCanvas () {
  const gameDiv = document.getElementById('game');
  let canvas = document.createElement('canvas');
  canvas.setAttribute('width', '500');
  canvas.setAttribute('height', '500');
  gameDiv.appendChild(canvas);

  canvas = document.querySelector('canvas');
  const cx = canvas.getContext('2d');
  cx.strokeStyle = 'black';
  cx.lineWidth = 1;

  const number = 25;
        let step = 20;

  for (let i = 0; i < number; i++) {
    for (let j = 0; j < number; j++) {
      cx.strokeRect(i * step, j * step, step, step);
    }
  }
}
