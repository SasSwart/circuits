let width = document.body.clientWidth;
let height = document.body.clientHeight;

let canvas = document.querySelector("#main_canvas");
canvas.width = width;
canvas.height = height;

let context = canvas.getContext("2d");

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

class HUD {
  constructor(context) {
    this.context = context;
    
    this.initToolbar();
    this.circuit_menu = document.querySelector(".toolbar #circuits");
    
    canvas.addEventListener('mouseup', e => {
      this.handleClick(e);
    });
    
    canvas.addEventListener('mousemove', e => {
      this.handleMouseMove(e);
    });
    
    const NOT = new NotGate(context);
    this.addCircuitMenuEntry("NOT", 0);
    this.circuits = [NOT, new Circuit(this.context, prompt("How Many Inputs?"), prompt("How Many Outputs?"))];
    this.lineTool = new LineTool(this.context);
    this.focussedCircuit = 1;
    this.insideView = new InsideCircuitView(this.context, this.circuits[this.focussedCircuit]);
  }
  
  initToolbar() {
    let toggle = document.querySelector(".toolbar #toggle");
    let wire = document.querySelector(".toolbar #wire");
    let save = document.querySelector(".toolbar #save");
    this.circuit_name = document.querySelector(".toolbar #circuit_name");
    
    toggle.addEventListener("click", e => {
      this.currentTool = this.TOOLS[0];
    });
    
    wire.addEventListener("click", e => {
      this.currentTool = this.TOOLS[1];
    });
    
    save.addEventListener("click", e => {
      this.saveCircuit(e);
    });
  }
  
  handleClick(e) {
    switch (this.currentTool) {
      case "toggle":
      this.toggleTerminal(e);
      break;
      
      case "wire":
      this.connectTerminals(e);
      break;
      
      case "circuit":
      this.placeCircuit(e);
      break;
    }
  }
  
  handleMouseMove(e) {
    this.mouse_x = e.offsetX;
    this.mouse_y = e.offsetY;
    this.drawWipLine(e.offsetX, e.offsetY);
  }
  
  drawWipLine(x, y) {
    if (this.initialTerminalView) {
      this.context.beginPath();
      this.context.lineWidth = 2;
      if (this.initialTerminalView.terminal.is_powered) {
        this.context.strokeStyle = this.ON_COLOR;
      } else {
        this.context.strokeStyle = this.OFF_COLOR;
      }
      this.context.moveTo(this.initialTerminalView.x, this.initialTerminalView.y);
      this.context.lineTo(x, y);
      this.context.stroke();
      this.context.closePath();
    }
  }
  
  toggleTerminal(e) {
    let component = this.insideView.getComponentAt(e.offsetX, e.offsetY);
    if (component != null && component.terminal.IS_POWER_SOURCE) {
      component.toggle();
    }
  }
  
  connectTerminals(e) {
    if (this.initialTerminalView) {
      let terminalTerminalView = this.insideView.getComponentAt(e.offsetX, e.offsetY);

      if (terminalTerminalView) {
        this.initialTerminalView.terminal.pushDownStreamTerminal(terminalTerminalView.terminal);
        terminalTerminalView.terminal.pushUpStreamTerminal(this.initialTerminalView.terminal);

        if (this.initialTerminalView.terminal.is_powered) terminalTerminalView.terminal.power();

        let wire = new CircuitWire(this.initialTerminalView.terminal, terminalTerminalView.terminal);
        this.circuits[this.focussedCircuit].wires.push(wire);
        this.insideView.wireViews.push(new CircuitWireView(this.context, this.initialTerminalView, terminalTerminalView));
      }
      this.initialTerminalView = null;
    } else {
      this.initialTerminalView = this.insideView.getComponentAt(e.offsetX, e.offsetY);
    }
  }
  
  saveCircuit(e) {
    let circuit_name = this.circuit_name.value;
    this.circuits[this.focussedCircuit].name = this.circuit_name.value;
    this.circuits.push(new Circuit(this.context, prompt("How Many Inputs?"), prompt("How Many Outputs?")));
    this.addCircuitMenuEntry(circuit_name, this.focussedCircuit);
    this.focussedCircuit++;
    this.insideView = new InsideCircuitView(this.context, this.circuits[this.focussedCircuit]);
  }
  
  addCircuitMenuEntry(name, circuit_id) {
    let button = document.createElement("BUTTON");
    button.innerHTML = name;
    
    button.addEventListener("click", e => {
      this.nextCircuit = this.circuits[circuit_id];
      this.currentTool = "circuit";
    })
    
    this.circuit_menu.appendChild(button);
  }
  
  placeCircuit(e) {
    let circuit = this.nextCircuit.clone();
    let outsideView = new OutsideCircuitView(this.context, circuit, e.offsetX, e.offsetY);

    this.insideView.circuit.circuits.push(circuit);
    this.insideView.circuitViews.push(outsideView);
  }
  
  render() {
    this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
    this.drawWipLine(this.mouse_x, this.mouse_y);
    this.insideView.render();
  }
  
  TOOLS = ["toggle", "wire"]
  currentTool = this.TOOLS[0];
  initialTerminalView = null;
}

let hud = new HUD(context);

(function nextFrame() {
  setTimeout(() => {
    hud.render();     
    nextFrame();
  }, 100);
})()