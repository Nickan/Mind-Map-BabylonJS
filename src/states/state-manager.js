

// Container of states
class StateManager {

  constructor(main) {
    this.main = main;
  }

  setState(state) {
    state.stateManager = this;
    state.init();
    this.state = state;
  }
  
}