class Circuit {
  constructor(context, num_inputs, num_outputs) {
    this.context = context;
    this.components = [];
    this.inputs = [];
    this.outputs = [];
    this.circuits = [];
    this.wires = [];

    this.initInputs(num_inputs);
    this.initOutputs(num_outputs);
    this.outsideView = new OutsideCircuitView(this.context, this);
  }

  clone() {
    let circuit = new Circuit(this.context, this.inputs.length, this.outputs.length);

    for (let i = 0; i < this.circuits.length; i++) {
      const subcircuit = this.circuits[i];
      circuit.circuits.push(subcircuit.clone());      
    }


    this.wires.forEach(wire => {
      let newInitialTerminal;
      let newTerminalTerminal;

      let initialTerminalIndex = this.inputs.indexOf(wire.initialTerminal);

      if (initialTerminalIndex == -1) {
        for (let i = 0; i < this.circuits.length; i++) {
          const element = this.circuits[i];
          initialTerminalIndex = element.outputs.indexOf(wire.initialTerminal);
          if (initialTerminalIndex != -1) {
            newInitialTerminal = circuit.circuits[i].outputs[initialTerminalIndex];
            break;
          }
        };
      } else {
        newInitialTerminal = circuit.inputs[initialTerminalIndex];
      }

      let terminalTerminalIndex = this.outputs.indexOf(wire.terminalTerminal);
      if (terminalTerminalIndex == -1) {
        for (let i = 0; i < this.circuits.length; i++) {
          const element = this.circuits[i];

          terminalTerminalIndex = element.inputs.indexOf(wire.terminalTerminal);
          if (terminalTerminalIndex != -1) {
            console.log(circuit);
            newTerminalTerminal = circuit.circuits[i].inputs[terminalTerminalIndex];  
            break;
          }
        };
      } else {
        newTerminalTerminal = circuit.outputs[terminalTerminalIndex];
      }

      if (newInitialTerminal && newTerminalTerminal) {
        newInitialTerminal.pushDownStreamTerminal(newTerminalTerminal);
        newTerminalTerminal.pushUpStreamTerminal(newInitialTerminal);
      }

      let newWire = new CircuitWire(newInitialTerminal, newTerminalTerminal);
      circuit.wires.push(newWire);
    });

    return circuit;
  }
  
  initInputs(num_inputs) {
    for (let i = 0; i < num_inputs; i++) {
      let input = new CircuitInputTerminal();
      this.components.push(input)
      this.inputs.push(input);
    }
  }
  
  initOutputs(num_outputs) {
    let dy = (this.outside_size/num_outputs);
    for (let i = 0; i < num_outputs; i++) {
      let spacing = this.context.canvas.clientHeight / num_outputs;
      let x = this.context.canvas.clientWidth - 14;
      let y = spacing/2 + i*spacing;

      let output = new CircuitOutputTerminal();
      this.components.push(output)
      this.outputs.push(output);
    }
  }

  getComponentAtOutside(x, y) {
    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];
      if (component.containsOutside(this.x, this.y, x, y)) {
        return component;
      }
    }

    return null;
  }

  pushDownStreamTerminal(downStreamTerminal) {
    this.components.push(downStreamTerminal);
  }

  contains(x, y) {
    return false;
  }
}

