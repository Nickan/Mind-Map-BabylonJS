class Controls {
  constructor(dataContainer, scene) {
    this.init(dataContainer, scene);
  }

  init(dataContainer, scene) {
    let ad = dataContainer.allData;
    ad.forEach((value, index) => {
      var plane = BABYLON.Mesh.CreatePlane("plane", 10);
      plane.position.x = value.y;
      plane.position.y = value.x;

      console.log(value.x + ": " + value.y);

      var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

      var input = new BABYLON.GUI.InputText();
      input.width = 0.1;
      input.maxWidth = 0.1;
      input.height = "100px";
      input.text = "This is a very long text used to test how the cursor works within the InputText control.";
      input.color = "white";
      input.background = "green";

      input.autoStretchWidth = true;
      advancedTexture.addControl(input);
    });
    
  }


}