let width = document.body.clientWidth;
let height = document.body.clientHeight;

let canvas = document.querySelector("#main_canvas");
canvas.width = width;
canvas.height = height;

let context = canvas.getContext("2d");

let hud = new HUD(context, canvas);

(function nextFrame() {
  setTimeout(() => {
    hud.render();     
    nextFrame();
  }, 1);
})()