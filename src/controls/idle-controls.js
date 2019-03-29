


class IdleControls {

  constructor(scene) {
    this.scene = scene;

    scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined) return;

      Utils.onSelectedNode(scene, pickResult, this.selectedNodeFn);
      Utils.onDragScreen(scene, pickResult, this.dragScreenFn);
    }

    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERWHEEL) {
        this.mouseScroll(pointerInfo.event.deltaY);
      }
    });

    // To prevent always checking if method is undefined
    this.onMouseScroll((y) => {});
    this.onSelectedNode((y) => {});
    this.onDragScreen((y) => {});
  }

  onMouseScroll(fn) {
    this.mouseScroll = fn;
    return this;
  }

  onSelectedNode(fn) {
    this.selectedNodeFn = fn;
    return this;
  }

  onDragScreen(fn) {
    this.dragScreenFn = fn;
    return this;
  }

  dispose() {
    let scene = this.scene;
    scene.onPointerDown = undefined;
    scene.onPointerObservable.clear();
  }
  
}