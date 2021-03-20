class CircuitTerminal {
    RADIUS = 7
    IS_POWER_SOURCE = false;
  
    containsOutside(origin_x, origin_y, target_x, target_y) {
      let dx = (target_x-(origin_x+this.outside_position[0]));
      let dy = (target_y-(origin_y+this.outside_position[1]));
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < this.TERMINAL_RADIUS;
    }
  
    power() {
      this.is_powered = true;
  
      this.downStreamTerminals.forEach(connectedTerminal => {
        connectedTerminal.power();
      });
    }
  
    unpower() {

      for (let i = 0; i < this.upStreamTerminals.length; i++) {
        const upStreamTerminal = this.upStreamTerminals[i];
        if (upStreamTerminal.is_powered) {
          return;
        }
      }
      this.is_powered = false;
      this.downStreamTerminals.forEach(connectedTerminal => {
        connectedTerminal.unpower();
      });
    }
  
    pushDownStreamTerminal(c) {
      this.downStreamTerminals.push(c);
    }
  
    pushUpStreamTerminal(c) {
      this.upStreamTerminals.push(c);
    }
  
    downStreamTerminals = [];
    upStreamTerminals = [];
    is_powered = false;
  }
  
  class CircuitInputTerminal extends CircuitTerminal {
    toggle() {
      this.is_powered = !this.is_powered;
  
      if (this.is_powered) {
        this.downStreamTerminals.forEach(connectedTerminal => {
          connectedTerminal.power();
        });
      } else {
        this.downStreamTerminals.forEach(connectedTerminal => {
          connectedTerminal.unpower();
        });
      }
    }
  
    IS_POWER_SOURCE = true;
  }
  
  class CircuitOutputTerminal extends CircuitTerminal {
  }
  
  class NotTerminal extends CircuitTerminal {
    power() {
      this.is_powered = false;
  
      this.downStreamTerminals.forEach(connectedTerminal => {
        connectedTerminal.unpower();
      });
    }
  
    unpower() {
      for (let i = 0; i < this.upStreamTerminals.length; i++) {
        const upStreamTerminal = this.upStreamTerminals[i];
        if (upStreamTerminal.is_powered) {
          return;
        }
      }
      this.is_powered = true;

      this.downStreamTerminals.forEach(connectedTerminal => {
        connectedTerminal.power();
      });
    }
  
    is_powered = true;

  }