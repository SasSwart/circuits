class LineTool {
  constructor(context) {
    this.context = context;
  }
  
  drawLine(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.closePath();
  }
}