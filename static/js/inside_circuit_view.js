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