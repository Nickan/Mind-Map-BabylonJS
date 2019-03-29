


class Controls {
  static ON_POINTER_DOWN = "onPointerDown";
  static ON_POINTER_UP = "onPointerUp";
  static ON_POINTER_OBSERVABLE = "onPointerObservable";
  static ON_MOUSE_SCROLL = "onMouseScroll";
  static ON_TEXT_ENTERED = "textEntered";
  static ON_DOUBLE_CLICKED = "onDoubleClicked";
  static ON_CREATE_NODE = "onCreateNode";

  static EDIT = "edit";
  static NEW_CHILD = "newChild";
  static NEW_SIBLING = "newSibling";

  constructor() {
  }

  onPointerDown(event, pickResult) {
    if (pickResult == undefined) {
      return;
    }

    if (pickResult.pickedMesh.id == "textplane") {
      this.selectedNodeMesh = pickResult.pickedMesh;
    }
  }

  initDragNodeState(scene, changeStateFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }

  initCreateChildState(scene, changeStateFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }


  createInputText(node, cbEnteredText) {
    if (this.input != undefined) {
      return;
    }

    let input = new BABYLON.GUI.InputText();
    this.input = input;
    input.width = 0.3;
    input.top = "45%";
    input.zIndex = 1;
    input.height = "40px";
    input.text = node.text;
    input.color = "white";
    input.background = "green";
    input.onKeyboardEventProcessedObservable.add((keyEvent) => {
      switch (keyEvent.code) {
        case "Enter":
            cbEnteredText(input.text);
          input.onKeyboardEventProcessedObservable.clear();
          this.disposeInput();
        break;
      }
    });

    this.at = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.at.addControl(input);
    this.at.moveFocusToControl(input);
  }

  disposeInput() {
    if (this.input != undefined)
      this.input.dispose();

    if (this.at != undefined)
      this.at.dispose();
    this.at = undefined;

    this.input = undefined;
  }

  
}