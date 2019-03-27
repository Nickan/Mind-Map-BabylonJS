


class Controls {
  static ON_POINTER_DOWN = "onPointerDown";
  static ON_POINTER_UP = "onPointerUp";
  static ON_POINTER_OBSERVABLE = "onPointerObservable";
  static ON_MOUSE_SCROLL = "onMouseScroll";
  static ON_TEXT_ENTERED = "textEntered";
  static ON_DOUBLE_CLICKED = "onDoubleClicked";
  static ON_CREATE_NODE = "onCreateNode";

  constructor() {
  }

  initEvents(scene) {
    scene.onPointerDown = (event, pickResult) => {
      Utils.fireEvent(Controls.ON_POINTER_DOWN, [event, pickResult]);
      this.onPointerDown(event, pickResult);
    }

    scene.onPointerUp = (event, pickResult) => {
      Utils.fireEvent(Controls.ON_POINTER_UP, [event, pickResult]);
    }

    scene.onPointerObservable.add((pointerInfo) => {
      Utils.fireEvent(Controls.ON_POINTER_OBSERVABLE, [pointerInfo]);

      switch(pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERWHEEL:
        Utils.fireEvent(Controls.ON_MOUSE_SCROLL, [pointerInfo]);
        break;
      }
    });

    Utils.addEventListener(CameraManager.ON_SCREEN_DRAG, (params) => {
      this.disposeInput();
    });

    window.addEventListener("dblclick", (e) => {
      Utils.fireEvent(Controls.ON_DOUBLE_CLICKED, [e]);
    });

    Utils.addEventListener(Controls.ON_DOUBLE_CLICKED, (e) => {
      // console.log(this.selectedNodeMesh);
      this.createInputText(this.selectedNodeMesh);
    });

    scene.onKeyboardObservable.add((KeyboardInfo) => {
      switch (KeyboardInfo.event.code) {
        case "Enter":
        if (this.selectedNodeMesh != undefined) {
          Utils.fireEvent(Controls.ON_CREATE_NODE, []);
        }
        break;
      }
    });
  }

  onPointerDown(event, pickResult) {
    if (pickResult == undefined) {
      return;
    }

    if (pickResult.pickedMesh.id == "textplane") {
      this.selectedNodeMesh = pickResult.pickedMesh;
    }
  }

  createInputText(data, cbEnteredText) {
    if (this.inputMesh == data.selectedMesh) {
      return
    }

    this.disposeInput();
    this.inputMesh = data.selectedMesh;

    let input = new BABYLON.GUI.InputText();
    this.input = input;
    input.width = 0.3;
    input.zIndex = 1;
    input.height = "40px";
    input.text = data.textBlock.text;
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
  }
  
  /*
    Per state in-depth controls
  */
  initIdleState(scene, changeStateFn) {
    scene.onPointerDown = (event, pickResult) => {
      if (pickResult == undefined)
        return;

      changeToSelectedNode(pickResult, changeStateFn);
      changeToDragNode(pickResult, changeStateFn);

      function changeToSelectedNode(pickResult, changeStateFn) {
        if (pickResult.pickedMesh.id == "textplane") {
          let m = pickResult.pickedMesh;
          let data = {
            selectedMesh: m,
            textBlock: m.textBlock,
            node: m.textBlock.node
          };
          scene.onPointerDown = undefined;
          changeStateFn(new SelectedNodeState(data));
        }
      }

      function changeToDragNode(pickResult, changeStateFn) {
        let id = pickResult.pickedMesh.id;
        if (id == "textplane") return;
        if (id == "ground") {
          let data = {
            pickedPoint: pickResult.pickedPoint,
          };
          scene.onPointerDown = undefined;
          changeStateFn(new DragScreenState(data));
        }
      }
    }

    scene.onPointerUp = (event, pickResult) => {
      if (pickResult == undefined)
        return;
    }
  }

  initDragNodeState(scene, changeStateFn) {
    scene.onPointerUp = (event, pickResult) => {
      scene.onPointerUp = undefined;
      changeStateFn(new IdleState());
    }
  }






  onScreenScroll(onDragStartCb, onDragEndCb) {

  }

  disposeInput() {
    if (this.input != undefined)
      this.input.dispose();

    if (this.at != undefined)
      this.at.dispose();
    this.at = undefined;

    this.input = undefined;
    this.inputMesh = undefined;
  }

  
}