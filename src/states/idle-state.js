


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
        main.dataManager.open(() => {
          sm.setState(new LoadNodesState());
        })
      });
    
    let dc = main.dataManager.dataContainer;
    main.lines.drawLines(main.scene, dc);
  }

  update(delta) {

  }

  exit() {
    this.controls.dispose();
    
  }
}