class CameraManager {
  // const ORTHOVALUE = 5; Have to make class variable to work
  static get ORTHOVALUE()  {
    return 5;
  }

  constructor() {
    
  }

  init(canvas, scene) {
    let cam1 = this.createCam(canvas, scene);
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
    return camera;
  }
}

