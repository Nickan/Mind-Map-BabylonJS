


class Controls {
  static ON_POINTER_DOWN = "onPointerDown";
  static ON_POINTER_UP = "onPointerUp";
  static ON_POINTER_OBSERVABLE = "onPointerObservable";
  static ON_MOUSE_SCROLL = "onMouseScroll";

  constructor(dataContainer, scene) {
    this.init(dataContainer, scene);
  }

  init(dataContainer, scene) {
    this.at = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.initEvents(scene);
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
  }

  onPointerDown(event, pickResult) {
    if (pickResult == undefined) {
      return;
    }

    if (pickResult.pickedMesh.id == "textplane") {
      pickResult.pickedMesh.textBlock.text = "Edit";
      this.createInputText(pickResult.pickedMesh);
    }
  }

  createInputText(mesh) {
    if (this.inputMesh == mesh) {
      return
    }

    this.disposeInput();

    this.inputMesh = mesh;

    let input = new BABYLON.GUI.InputText();
    this.input = input;
    input.width = 1;
    // input.maxWidth = 0.2;
    input.zIndex = 1;
    input.height = "40px";
    input.text = "This is a very long text used to test how the cursor works within the InputText control.";
    input.color = "white";
    input.background = "green";

    input.autoStretchWidth = true;
    this.at.addControl(input);
  }

  disposeInput() {
    if (this.input != undefined) {
      this.input.dispose();
    }
    this.input = undefined;
    this.inputMesh = undefined;
  }

  
}