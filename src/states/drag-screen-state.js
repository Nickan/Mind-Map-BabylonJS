class DragScreenState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    main.cameraManager.currentPos = this.data.pickedPoint;
    main.controls.initDragNodeState(main.scene, 
      (newState) => {
      sm.setState(newState);
    });
  }

  update(delta) {
    let main = this.stateManager.main;
    let cm = main.cameraManager;
    cm.dragCamera(main.scene, delta);
  }

  exit() {
    
  }
}