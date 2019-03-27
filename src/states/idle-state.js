


class IdleState {
  init() {
    let sm = this.stateManager;
    let main = sm.main;

    main.controls.initIdleState(main.scene, (newState) => {
      sm.setState(newState);
    });
  }

  update(delta) {

  }

  exit() {
  }
}