class CircuitWireView {
  TERMINAL_RADIUS = 7;
  OFF_COLOR = "#000000";
  ON_COLOR = "#EE4444";

  constructor(context, initialTerminal, terminalTerminal) {
    this.context = context;
    this.initialTerminal = initialTerminal;
    this.terminalTerminal = terminalTerminal;
  }

  render() {
    this.context.beginPath();
    this.context.lineWidth = 2;
    if (this.initialTerminal.terminal.is_powered) {
      this.context.strokeStyle = this.ON_COLOR;
    } else {
      this.context.strokeStyle = this.OFF_COLOR;
    }
    this.context.moveTo(this.initialTerminal.x, this.initialTerminal.y);
    this.context.lineTo(this.terminalTerminal.x, this.terminalTerminal.y);
    this.context.stroke();
    this.context.closePath();
  }
}