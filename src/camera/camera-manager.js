


class CameraManager {
  // const ORTHOVALUE = 5; Have to make class variable to work
  static ORTHOVALUE = 5;
  static ON_SCREEN_DRAG = "onScreenDrag";
  static ZOOM_SCALE = 0.2;

  constructor() {
    this.onDrag = false;
    this.currentPos = {};

    this.cam1;
    this.zoomValue = CameraManager.ORTHOVALUE;
  }

  init(canvas, scene) {
    this.cam1 = this.createCam(canvas, scene);
    let cam1 = this.cam1;
    let cam2 = this.createCam(canvas, scene);

    cam1.viewport = new BABYLON.Viewport(0, 0, 1.0, 1.0);
    cam2.viewport = new BABYLON.Viewport(0, 0, 0, 1.0);

    scene.activeCameras.push(cam2);
    scene.activeCameras.push(cam1);

    // this.createTmpSlider(cam1, cam2);
    // makeElementDraggable(document.getElementsByClassName("slider")[0]);
  }

  createTmpSlider(cam1, cam2) {
    let root = document.getElementById("mithril");
    var Hello = {
      view: function () {
        return [
          m("div", {
            class: "slider",
            onmousedown: onSliderStart,
            onmousemove: onSliderMove,
            onmouseup: onSliderEnd,
          }),
        ]
      }
    }
    m.mount(root, Hello);

    function onSliderStart(e) {
      console.log("Down");
    }

    function onSliderMove(e) {
      let s = getElementsByClassName("slider")[0];
      let ratio = getElementLeftRatioToWindow(s);

      cam1.viewport = new BABYLON.Viewport(ratio, 0, (1.0 - ratio), 1.0);
      cam1.orthoLeft = (ORTHOVALUE) - (ORTHOVALUE * 2 * (1 - ratio));

      cam2.viewport = new BABYLON.Viewport(0, 0, ratio, 1.0);
      cam2.orthoRight = cam1.orthoLeft;
    }

    function onSliderEnd(e) {
      console.log("End");
    }

    
  }

  createCam(canvas, scene) {
    let camera = new BABYLON.FreeCamera("UniCam", new BABYLON.Vector3(0, 0, -10), scene);

    camera.setTarget(BABYLON.Vector3.Zero());
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    let orthoVal = CameraManager.ORTHOVALUE;
    camera.orthoTop = orthoVal; //5 units to the top
    camera.orthoBottom = -orthoVal; //5 units to the bottom
    camera.orthoLeft = -orthoVal;  //5 units to the left
    camera.orthoRight = orthoVal; //5 units to the right
    // camera.attachControl(canvas, true);

    // camera.minZ = .001;
    return camera;
  }

  implementScreenScroll(scene) {
    Utils.addEventListener(Controls.ON_POINTER_DOWN, 
      (event, pickResult) => {
      if (pickResult == undefined) {
        return;
      }

      if (pickResult.pickedMesh.id == "plane") {
        return;
      }

      let worldCoord = pickResult.pickedPoint;
      this.currentPos = worldCoord;
      this.onDrag = true;
    });

    Utils.addEventListener(Controls.ON_POINTER_UP, 
      (event, pickResult) => {
      this.onDrag = false;
      if (pickResult == undefined) {
        return;
      }

      if (pickResult.pickedMesh.pickedMeshName == "plane") {
        return;
      }

      let worldCoord = pickResult.pickedPoint;
      this.currentPos = worldCoord;
    });

    Utils.addEventListener(Controls.ON_MOUSE_SCROLL,
      (pointerInfo) => {
      if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERWHEEL) {
        let dY = pointerInfo.event.deltaY;
        let zoomScale = 0.5;
        
        if (dY > 0) {
          this.zoomValue += zoomScale;
          
        } else {
          this.zoomValue -= zoomScale;
        }

        setCamOrthoValue(this.cam1, this.zoomValue);

        function setCamOrthoValue(cam, zoomValue) {
          cam.orthoTop = zoomValue;
          cam.orthoBottom = -zoomValue;
          cam.orthoLeft = -zoomValue;
          cam.orthoRight = zoomValue;
        }
      }
    });
  }

  zoom(deltaY) {
    if (deltaY > 0) {
      this.zoomValue += CameraManager.ZOOM_SCALE;
    } else {
      this.zoomValue -= CameraManager.ZOOM_SCALE;;
    }

    this.setCamOrthoValue(this.cam1, this.zoomValue);
  }

  setCamOrthoValue(cam, zoomValue) {
    cam.orthoTop = zoomValue;
    cam.orthoBottom = -zoomValue;
    cam.orthoLeft = -zoomValue;
    cam.orthoRight = zoomValue;
  }

  update(scene, delta) {
    let ms = delta / 1000.0;

    if (this.onDrag) {
      this.dragCamera(scene, delta);
    }
    
  }

  dragCamera(scene, delta) {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    let worldCoord = pickResult.pickedPoint;

    let xDiff = this.currentPos.x - worldCoord.x;
    let yDiff = this.currentPos.y - worldCoord.y;

    if (xDiff != 0 || yDiff != 0) {
      this.currentPos = worldCoord;
      let pos = this.cam1.position;
      pos.x += xDiff;
      this.currentPos.x += xDiff;

      pos.y += yDiff;
      this.currentPos.y += yDiff;

      Utils.fireEvent(CameraManager.ON_SCREEN_DRAG, []);
    }
  }
}

