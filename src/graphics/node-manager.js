class NodeManager {

  // Based on data
  // Might be managed later on
  constructor(dataContainer, scene) {
    this.loadNodes(dataContainer, scene);
  }

  loadNodes(dataContainer, scene) {
    let ad = dataContainer.nodes;
    let xUnit = 1.5;
    let yUnit = 1.5;

    ad.forEach((data, index) => {
      addTextBlock(data);
    });


    function addTextBlock(data) {
      let plane = BABYLON.MeshBuilder.CreatePlane("textplane", 
        {width: 1, height: 1}, scene);

      plane.position.x = data.y * xUnit;
      plane.position.y = data.x * yUnit;

      let at = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
        plane, 1024, 1024);

      var rectangle = new BABYLON.GUI.Rectangle("rect");
      rectangle.width  ="1024px";
      rectangle.height = "1024px";
      // rectangle.color = "Orange";
      rectangle.background = "green";
      at.addControl(rectangle);

      var tb = new BABYLON.GUI.TextBlock();
      tb.text = data.name + 
        ": The very long text to test the text block" +
        " ";
      tb.color = "white";
      tb.fontSize = "140px";
      tb.textWrapping = true;
      tb.width = 1.7;
      tb.scaleX = 0.6;
      // text.scaleY = 1.5;
      
      at.addControl(tb);

      plane.textBlock = tb;
      plane.advanceDynamicTexture = at;
    }
  }




}