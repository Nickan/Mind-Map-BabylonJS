class Controls {
  constructor(dataContainer, scene) {
    this.init(dataContainer, scene);
  }

  init(dataContainer, scene) {
    let ad = dataContainer.allData;
    let xUnit = 1.5;
    let yUnit = 1.5;

    // ad.forEach((value, index) => {
    //   var plane = BABYLON.Mesh.CreatePlane("plane", 10);
    //   plane.position.x = value.y;
    //   plane.position.y = value.x;

    //   console.log(value.x + ": " + value.y);

    //   var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    //   var input = new BABYLON.GUI.InputText();
    //   input.width = 0.1;
    //   input.maxWidth = 0.1;
    //   input.height = "100px";
    //   input.text = "This is a very long text used to test how the cursor works within the InputText control.";
    //   input.color = "white";
    //   input.background = "green";

    //   input.autoStretchWidth = true;
    //   advancedTexture.addControl(input);
    // });

    let manager = new BABYLON.GUI.GUI3DManager(scene);

    ad.forEach((data, index) => {
      var button = new BABYLON.GUI.Button3D("reset");
      manager.addControl(button);

      var text = new BABYLON.GUI.TextBlock();
      text.text = data.name + 
        ": The very long text to test the text block" +
        " The very long text to test the text block";
      text.color = "white";
      text.fontSize = 35;
      text.textWrapping = true;
      text.width = 0.8;
      text.scaleX = 0.6;
      text.scaleY = 1.5;

      button.content = text;
      button.scaling.x = 1.2;
      button.position.x = data.y * yUnit;
      button.position.y = data.x * xUnit;
    });
    
  }


}