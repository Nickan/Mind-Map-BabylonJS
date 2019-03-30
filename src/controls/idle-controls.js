


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

    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      if (keyInfo.type == KEY_UP)
          return;
      
      let code = keyInfo.event.code;
      if (code == "F5") {
        scene.onKeyboardObservable.clear();
        this.save();
      }


      if (code == "F6") {
        scene.onKeyboardObservable.clear();
        this.open();
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

  onSave(fn) {
    this.save = fn;
    return this;
  }

  onOpen(fn) {
    this.open = fn;
    return this;
  }

  dispose() {
    let scene = this.scene;
    scene.onPointerDown = undefined;
    scene.onPointerObservable.clear();
    scene.onKeyboardObservable.clear();
    this.open = undefined;
    this.save = undefined;
  }
  
}