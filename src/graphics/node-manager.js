class NodeManager {

  // Based on data
  // Might be managed later on
  constructor() {
  }

  // initListeners() {
  //   Utils.addEventListener(Controls.ON_TEXT_ENTERED, (inputText) => {
  //     let tb = inputText.textBlock;
  //     tb.text = inputText.text;
  //   });
  // }

  loadNodes(dataContainer, scene) {
    let ad = dataContainer.nodes;
    
    ad.forEach((node, index) => {
      this.addTextBlock(node, scene);
    });
  }

  addTextBlock(node, scene) {
    let xUnit = 1.5;
    let yUnit = 1.5;

    let plane = BABYLON.MeshBuilder.CreatePlane("textplane", 
      {width: 1, height: 1}, scene);

    plane.position.x = node.y * xUnit;
    plane.position.y = node.x * yUnit;

    this.at = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
      plane, 1024, 1024);
    let at = this.at;

    var rectangle = new BABYLON.GUI.Rectangle("rect");
    rectangle.width  ="1024px";
    rectangle.height = "1024px";
    // rectangle.color = "Orange";
    rectangle.background = "green";
    at.addControl(rectangle);

    var tb = new BABYLON.GUI.TextBlock();
    tb.text = node.text;
    tb.node = node;
    tb.color = "white";
    tb.fontSize = "140px";
    tb.textWrapping = true;
    tb.width = 1.7;
    tb.scaleX = 0.6;
    // text.scaleY = 1.5;
    
    at.addControl(tb);

    plane.node = node;
    plane.textBlock = tb;
  }

  editText(textBlock, text) {
    textBlock.text = text;
  }

  disposeTextBlock() {
    if (this.at != undefined) {
      this.at.dispose();
      this.at = undefined;
    }
  }

}