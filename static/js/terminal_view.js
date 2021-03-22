class TerminalView {
  TERMINAL_RADIUS = 7;
  OFF_COLOR = "#000000";
  ON_COLOR = "#EE4444";

  constructor(context, x, y, terminal) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.terminal = terminal;
  }

  toggle() {
    this.terminal.toggle();
  }

  render() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.TERMINAL_RADIUS, 0, 2*Math.PI, true);
    if (this.terminal.is_powered) {
      this.context.fillStyle = this.ON_COLOR;
    } else {
      this.context.fillStyle = this.OFF_COLOR;
    }
    this.context.fill();
  }

  contains(x, y) {
    let dx = (x-this.x);
    let dy = (y-this.y);
    return (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < this.TERMINAL_RADIUS)
  }
}