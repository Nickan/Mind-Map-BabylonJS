

// Handles the flow of the system
class StateManager {

  constructor(main) {
    this.main = main;
    this.init();  
  }

  init() {
    this.currentState = new StartState(this);
  }

  setState(state) {
    this.state = state;
  }
  
}