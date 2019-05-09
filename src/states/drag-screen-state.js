class DragScreenState {
  constructor(elon, data) {
    this.elon = elon;
    this.data = data;

    elon.cameraManager.currentPos = this.data.pickedPoint;
    elon.controls.onPointerUp(elon.scene, () => {
      this.exit();
      new IdleState(elon);
    });

    elon.state = this;
  }

  update(delta) {
    let cm = this.elon.cameraManager;
    cm.dragCamera(this.elon.scene, delta);
  }

  exit() {
    this.elon.state = undefined;
  }
}