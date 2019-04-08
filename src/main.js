


class Main {
  constructor() {
    this.init();
    this.initScene();
    this.initStateManager();
    this.initCamera();
    this.dataManager = new DataManager();
    this.nodeManager = new NodeManager();
    this.controls = new Controls();
    this.lines = new Lines();
    this.stateManager.setState(new StartState());
    this.renderLoop();
  }

  init() {
    this.canvas = document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
    // this.engine.renderEvenInBackground = false;
    // Have to disable because loading json is not rerendering, have to fix later
  }

  initScene() {
    let scene = new BABYLON.Scene(this.engine);
    this.scene = scene;
    Utils.createGroundFor3D2DConversion(scene);
    
    // camSlider = CameraSlider(canvas, scene);
    
    // Add lights to the scene
    this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    this.light.intensity = 1;
  }
  
  initCamera() {
    this.cameraManager = new CameraManager();
    this.cameraManager.init(this.canvas, this.scene);
  }

  initStateManager() {
    this.stateManager = new StateManager(this);
  }

  

  renderLoop() {
    let engine = this.engine;
    let scene = this.scene;
    let sm = this.stateManager;

    engine.runRenderLoop(function () {
      if (sm.state != undefined) {
        sm.state.update(engine.getDeltaTime());
        Utils.update(engine.getDeltaTime());
      }
      scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () { 
      engine.resize();
    });
  }
}

let m = new Main();
document.onkeydown = function(evt) {
  evt = evt || window.event;

  // console.log(evt);
  if (evt.keyCode == 9 || evt.key == "F5") {
      evt.preventDefault();
      // alert("Tab");
  }
};