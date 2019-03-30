

// Container of states
class StateManager {

  constructor(main) {
    this.main = main;
  }

  setState(state) {
    if (this.state != undefined) {
      this.state.exit();
    }
    state.stateManager = this;
    this.state = state;
    state.init();
  }
  
}