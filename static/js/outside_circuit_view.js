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