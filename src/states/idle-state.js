


class IdleState {
  constructor(data = {}) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    let ic = new IdleControls(main.scene);
    ic.onSelectedNode((result) => {
        sm.setState(new SelectedNodeState(result));
      })
      .onDragScreen((result) => {
        sm.setState(new DragScreenState(result));
      });
  }

  update(delta) {

  }

  exit() {
  }
}