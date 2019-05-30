


class SelectedControls {
  constructor(scene, data) {
    this.scene = scene;
    this.clickedPos = this.getMousePos(scene);

    // For now, node id main will not be dragged
    // Has to be improved in the future
    if (data.nodeId == 1)
      this.detectIfNodeOnDrag = false;
    else {
      if (data.detectIfNodeOnDrag != undefined) {
        this.detectIfNodeOnDrag = data.detectIfNodeOnDrag;
      } else {
        this.detectIfNodeOnDrag = true;
      }
    }
      

    this.initKeyboard(scene, data);
    this.initPointerDown(scene);

    // Will change when node can be dragged
    scene.onPointerUp = (event, pickResult) => {
      this.detectIfNodeOnDrag = false;
      console.log("detect " + this.detectIfNodeOnDrag)
    }

    function clear() {
      scene.onKeyboardObservable.clear();
      this.edit = undefined;
      this.createChild = undefined;
      this.createSibling = undefined;
    }

    this.initDefaultFunctionCallbacks();

    this.shiftIsPressed = false;
  }

  initKeyboard(scene, data) {
    scene.onKeyboardObservable.add((keyInfo) => {
      const KEY_UP = 2;
      let key = keyInfo.event.key;
      if (keyInfo.type == KEY_UP) {
        switch (key) {
          case "Shift":
            this.shiftIsPressed = false;
            break;
        }
        return;
      }
      
      switch (key) {
        case "F2":
          if (data.nodeId != undefined)
            this.edit(scene);
          break;
        case "Tab":
          this.createChild();
          break;
        case "Delete":
          this.deleteNode();
          break;
        case "Shift":
          this.shiftIsPressed = true;
          break;
        case "d":
        case "D":
          if (this.shiftIsPressed) {
            if (this.toggleFoldDescendants != undefined)
              this.toggleFoldDescendants();
          }
          break;
        case "a":
          case "A":
            if (this.shiftIsPressed) {
              if (this.toggleFoldAncestors != undefined)
                this.toggleFoldAncestors();
            }
          break;
      }
    });  
  }

  initPointerDown(scene) {
    scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined) return;

      Utils.onSelectedNode(scene, pickResult, this.selectedNodeFn);
      Utils.onDragScreen(scene, pickResult, this.dragScreenFn);
      this.detectIfNodeOnDrag = true;

      // This is when the user already pointer up, detect if it is still going to 
      // Drag the node
    }
  }

  initDefaultFunctionCallbacks() {
    this.onEdit(() => {});
    this.onCreateChild(() => {});
    this.onCreateSibling(() => {});
    this.onIdle(() => {});
    this.onSelectedNode((result) => {});
    this.onDragScreen((result) => {});
    this.onDeleteNode(() => {});
  }


  update(delta) {
    if (this.detectIfNodeOnDrag) {
      this.detectNodeDrag(this.clickedPos);
    }
  }

  static NODE_DIST_DRAG_DETECTION = 0.0125;
  detectNodeDrag(clickedPos) {
    let curMousePos = this.getMousePos(this.scene);
    if (nodeIsDragged(clickedPos, curMousePos)) {
      if (this.nodeDragCb != undefined)
        this.nodeDragCb();
    }

    function nodeIsDragged(clickedPos, curMousePos) {
      let m = curMousePos;

      let dist = SelectedControls.NODE_DIST_DRAG_DETECTION;
      return (!Utils.insideDist(clickedPos.x, clickedPos.y, m.x, m.y, dist));
    }
  }

  getMousePos(scene) {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    return pickResult.pickedPoint;
  }




  dispose() {
    this.scene.onKeyboardObservable.clear();
    this.scene.onPointerDown = undefined;
    this.scene.onPointerUp = undefined;
  }



  onEdit(fn) {
    this.edit = fn;
    return this;
  }

  onCreateChild(fn) {
    this.createChild = fn;
    return this;
  }

  onCreateSibling(fn) {
    this.createSibling = fn;
    return this;
  }

  onIdle(fn) {
    this.idle = fn;
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

  onDeleteNode(fn) {
    this.deleteNode = fn;
    return this;
  }
  
}