


class IdleState {
  constructor(data = {}) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    this.controls = new IdleControls(main.scene);
    this.controls.onSelectedNode((result) => {
        sm.setState(new SelectedNodeState(result));
      })
      .onDragScreen((result) => {
        sm.setState(new DragScreenState(result));
      })
      .onMouseScroll((deltaY) => {
        main.cameraManager.zoom(deltaY);
      })
      .onSave(() => {
        main.dataManager.save();
      })
      .onOpen(() => {
        // Open file browser
        // Load json file
        // Convert to Map > Will deal with this later
        main.dataManager.open(() => {
          sm.setState(new LoadNodesState());
        })
      });
  }

  update(delta) {

  }

  exit() {
    this.controls.dispose();
  }
}