


class IdleState {
  constructor(elon, data) {
    elon.state = this;
    elon.controls.initKeyboard(elon);

    this.controls = new IdleControls(elon.scene);
    this.controls.onSelectedNode((result) => {
        this.controls.dispose();
        new SelectedNodeState(elon, result);
      })
      .onDragScreen((result) => {
        this.controls.dispose();
        new DragScreenState(elon, result);
      })
      .onMouseScroll((deltaY) => {
        elon.cameraManager.zoom(deltaY);
      })
      .onSave(() => {
        // elon.dataManager.save();
      })
      .onOpen(() => {
        // elon.dataManager.open(() => {
        //   this.controls.dispose();
        //   new LoadNodesState(elon);
        // })
      });
  }

  update(delta) {

  }
}