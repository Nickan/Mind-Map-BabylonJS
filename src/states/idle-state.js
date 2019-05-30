


class IdleState {
  constructor(elon, data) {
    elon.state = this;

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

      });

      elon.controls.initKeyboard(elon);
  }

  update(delta) {

  }
}