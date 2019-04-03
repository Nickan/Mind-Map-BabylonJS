


class DragNodeControls {
  static onNodeDragFn;
  static nodeDrag = false;

  constructor(scene, data) {
    this.scene = scene;

    scene.onPointerUp = (event, pickResult) => {
      if (this.dragStopCb != undefined)
        this.dragStopCb();
    }

  }

  update(delta) {

  }

  dispose() {

  }
  

  
}

