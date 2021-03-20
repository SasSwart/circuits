class CircuitView {
  TERMINAL_RADIUS = 7;
  OFF_COLOR = "#000000";
  ON_COLOR = "#EE4444";
}

class OutsideCircuitView extends CircuitView {
  OUTSIDE_COLOR = "#33AA33"
  WIDTH = 20
  
  constructor(context, circuit, x, y) {
    super();
    this.context = context;
    this.circuit = circuit;
    this.inputViews = [];
    this.outputViews = [];
    this.outside_size = this.WIDTH*Math.max(circuit.inputs.length, circuit.outputs.length);
    this.x = x;
    this.y = y;
    this.initInputViews();
    this.initOutputViews();
  }

  render() {
    this.context.fillStyle = this.OUTSIDE_COLOR;
    this.context.fillRect(this.x, this.y, this.WIDTH, this.outside_size); 

    for (let i = 0; i < this.inputViews.length; i++) {
      this.inputViews[i].render();
    }
    for (let i = 0; i < this.outputViews.length; i++) {
      this.outputViews[i].render();
    }
  }

  initInputViews() {
    let dy = (this.outside_size/this.circuit.inputs.length);

    for (let i = 0; i < this.circuit.inputs.length; i++) {
      let input = new TerminalView(this.context, this.x, this.y+dy/2 +i*dy, this.circuit.inputs[i]);
      this.inputViews.push(input);
    }
  }

  initOutputViews() {
    let dy = (this.outside_size/this.circuit.outputs.length);

    for (let i = 0; i < this.circuit.outputs.length; i++) {
      let output = new TerminalView(this.context, this.x+this.WIDTH, this.y+dy/2 +i*dy, this.circuit.outputs[i]);
      this.outputViews.push(output);
    }
  }

  getComponentAt(x, y) {
    for (let i = 0; i < this.inputViews.length; i++) {
      const component = this.inputViews[i];
      
      if (component.contains(x, y)) {
        return component;
      }
    }

    for (let i = 0; i < this.outputViews.length; i++) {
      const component = this.outputViews[i];
      
      if (component.contains(x, y)) {
        return component;
      }
    }
  }
}

class InsideCircuitView extends CircuitView {
  constructor(context, circuit) {
    super();
    this.context = context;
    this.circuit = circuit;
    this.inputViews = [];
    this.outputViews = [];
    this.wireViews = [];
    this.initInputViews();
    this.initOutputViews();
    this.circuitViews = [];
  }

  initInputViews() {
    for (let i = 0; i < this.circuit.inputs.length; i++) {
      let dy = this.context.canvas.clientHeight / this.circuit.inputs.length;
      let x = 14;
      let y = dy/2 + i*dy;
      
      let input = new TerminalView(this.context, x, y, this.circuit.inputs[i]);
      this.inputViews.push(input);
    }
  }

  initOutputViews() {
    for (let i = 0; i < this.circuit.outputs.length; i++) {
      let dy = this.context.canvas.clientHeight / this.circuit.outputs.length;
      let x = this.context.canvas.clientWidth - 14;
      let y = dy/2 + i*dy;
      
      let output = new TerminalView(this.context, x, y, this.circuit.outputs[i]);
      this.outputViews.push(output);
    }
  }
  
  render() {
    this.wireViews.forEach(wire => {
      wire.render();
    });
    for (let i = 0; i < this.circuit.inputs.length; i++) {
      this.inputViews[i].render();
    }
    for (let i = 0; i < this.circuit.outputs.length; i++) {
      this.outputViews[i].render();
    }
    for (let i = 0; i < this.circuitViews.length; i++) {
      this.circuitViews[i].render();
    }
  }
  
  getComponentAt(x, y) {
    for (let i = 0; i < this.inputViews.length; i++) {
      const component = this.inputViews[i];

      if (component.contains(x, y)) {
        return component;
      }
    }

    for (let i = 0; i < this.outputViews.length; i++) {
      const component = this.outputViews[i];

      if (component.contains(x, y)) {
        return component;
      }
    }

    for (let i = 0; i < this.circuitViews.length; i++) {
      const subcircuit = this.circuitViews[i];

      let component = subcircuit.getComponentAt(x, y);

      if (component) {
        return component;
      }
    }
    
    return null;
  }
}

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

class CircuitWire {
  constructor(initialTerminal, terminalTerminal) {
    this.initialTerminal = initialTerminal;
    this.terminalTerminal = terminalTerminal;
  }
}

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