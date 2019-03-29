


class IdleControls {

  constructor(scene) {
    scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined) return;

      Utils.onSelectedNode(scene, pickResult, this.selectedNodeFn);
      Utils.onDragScreen(scene, pickResult, this.dragScreenFn);
    }
  }

  onSelectedNode(fn) {
    this.selectedNodeFn = fn;
    return this;
  }

  onDragScreen(fn) {
    this.dragScreenFn = fn;
    return this;
  }
  
}