class NotGate extends Circuit {
  constructor(context) {
    super(context, 1, 0)
    this.initOutputs(1);
    this.inputs[0].pushDownStreamTerminal(this.outputs[0]);
    this.outputs[0].pushUpStreamTerminal(this.inputs[0]);
  }
  
  initOutputs(num_outputs) {
    for (let i = 0; i < num_outputs; i++) {
      let spacing = this.context.canvas.clientHeight / num_outputs;
      let x = this.context.canvas.clientWidth - 14;
      let y = spacing/2 + i*spacing;
      let output = new NotTerminal(this.context, x, y);
      this.components.push(output)
      this.outputs.push(output);
    }
  }
  
  clone() {
    return new NotGate(this.context);
  }
}