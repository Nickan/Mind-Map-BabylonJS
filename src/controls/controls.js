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

    
    // testImpl2()
    // function testImpl2(data) {
        

    //   let myMaterial1 = new BABYLON.StandardMaterial("myMaterial1", scene);
    //   myMaterial1.diffuseColor = new BABYLON.Color3(1, 0, 1);
    //   // myMaterial1.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    //   myMaterial1 = BABYLON.Color3.Black();
    //   myMaterial1.emissiveColor = new BABYLON.Color3(1, 1, 1);
    //   myMaterial1.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    //   myMaterial1.alpha = 1;

    //   // var box = BABYLON.MeshBuilder.CreateBox("box", {width:1, height:1, depth: 1} , scene);
    //   // box.material = myMaterial1;

    //   let plane = BABYLON.MeshBuilder.CreatePlane("plane", 
    //     {width: 1, height: 1}, scene);
    //   // plane.material = myMaterial1;
    //   // plane.material.alpha = 0.5;
    //   // plane.parent = box;

    //   // plane.position.x = data.y * xUnit;
    //   // plane.position.y = data.x * yUnit;

    //   var at = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(
    //     plane, 1024, 1024);

    //   var rectangle = new BABYLON.GUI.Rectangle("rect");
    //   rectangle.width  ="1024px";
    //   rectangle.height = "1024px";
    //   // at.addControl(rectangle);

    //   var text = new BABYLON.GUI.TextBlock();
    //   text.text = 
    //     ": The very long text to test the text block" +
    //     " ";
    //   text.color = "white";
    //   text.fontSize = "140px";
    //   text.textWrapping = true;
    //   // text.width = 0.8;
    //   // text.scaleX = 0.6;
    //   // text.scaleY = 1.5;


    //   // rectangle.addControl(text);
    //   // at.addControl(text);
    //   // plane.showBoundingBox = true;
    // }

    let manager = new BABYLON.GUI.GUI3DManager(scene);
    ad.forEach((data, index) => {

      
      addTextBlock(data);

      
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

      // testImpl(data);
      




      function testImpl(data) {
        var button = new BABYLON.GUI.Button3D("reset");
        manager.addControl(button);

        var text = new BABYLON.GUI.TextBlock();
        text.text = data.name + 
          ": The very long text to test the text block" +
          " ";
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
        button.data = data;

        manager.rootContainer.blockLayout = true;
        manager.rootContainer.position.y = 10;

        console.log("y " + manager.rootContainer.position.y);
        console.log(manager.rootContainer);
        
        

        Utils.addEventListener(Utils.ON_DRAG_SCREEN, (params) => {
          console.log("ondragscreen " + params);
          button.isVisible = true;

          if (button.input != undefined)
            button.input.isVisible = false;

          if (button.plane != undefined) {
            button.plane.isVisible = false;
          }

          console.log(button.mesh.isEnabled());
        });

        button.onPointerDownObservable.add(
          () => {
            console.log(button.data);

            button.isVisible = false;
            
            createTextInputIn2D(button);
            // createTextInputIn3D(button);

            function createTextInputIn2D(button) {
              var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
              
              console.log(advancedTexture);
              var input = new BABYLON.GUI.InputText();
              input.width = 0.2;
              // input.maxWidth = 0.2;
              input.zIndex = 1;
              input.height = "40px";
              input.text = "This is a very long text used to test how the cursor works within the InputText control.";
              input.color = "white";
              input.background = "green";
              input.autoStretchWidth = true;
              advancedTexture.addControl(input);

              // input.moveToVector3(Vector3(0, 0, -2), scene);
            }

            function createTextInputIn3D(button) {
              let plane = BABYLON.MeshBuilder.CreatePlane("plane", 
                {width: 5, height: 1}, scene);
              plane.position.x = button.position.x;
              plane.position.y = button.position.y;
              plane.position.z = -1;
              // plane.scaling.x = 1.2;
              // plane.width = 2;

              button.plane = plane;

              let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

              let input = new BABYLON.GUI.InputText();
              // input.width = 1.8;
              input.width = 1;
              input.zIndex = -100;
              // input.maxWidth = 1;
              input.height = 1;
              input.fontSize = 140;
              input.text = "This is a very long text used to test how the cursor works within the InputText control.";
              input.color = "white";
              input.background = "green";
              // input.scaleX = 0.6;
              input.scaleY = 1.5;

              input.autoStretchWidth = true;
              advancedTexture.addControl(input);
              advancedTexture.rootContainer.zIndex = 100;
              console.log(advancedTexture);
              
              button.input = input;

              input.onBlurObservable.add(() => {
                // button.isVisible = true;
                console.log("Out");
              });

              input.onFocusObservable.add(() => {
                // button.isVisible = true;
                console.log("Focus");
              });
              
            }
          }
        );
      }
      
    });
    
  }


}