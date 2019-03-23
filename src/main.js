



var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.renderEvenInBackground =  false

/******* Add the create scene function ******/
var createScene = function () {
  // Create the scene space
  var scene = new BABYLON.Scene(engine);
  // scene.debugLayer.show();

  Utils.createGroundFor3D2DConversion(scene);
  
  // camSlider = CameraSlider(canvas, scene);
  
  // Add lights to the scene
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  // var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

  // Temporary position to load source codes
  let dm = new DataManager();
  dm.onLoadData((dataContainer) => {
    let nm = new NodeManager(dataContainer, scene);
    let ctrl = new Controls(dataContainer, scene);
  });
  return scene;
};
/******* End of the create scene function ******/    

var scene = createScene(); //Call the createScene function

camManager = new CameraManager();
camManager.init(canvas, scene);

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
  camManager.update(scene, engine.getDeltaTime());
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
  engine.resize();
});