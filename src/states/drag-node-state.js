


class DragNodeState {
  constructor(data) {
    this.data = data;
  }

  init() {
    let sm = this.stateManager;
    let main = sm.main;

    this.nodeG = main.nodeManager.graphics.get(this.data.nodeId);
    let nPos = this.nodeG.plane.position;
    let mPos = Utils.getPickedMousePos(main.scene);

    this.nodePosRelativeToMouse = {
      x: mPos.x - nPos.x,
      y: mPos.y - nPos.y
    };

    this.controls = new DragNodeControls(main.scene, this.data);
    this.controls.dragStopCb = () => {
      sm.setState(new IdleState(this.data));
    };

    this.potentialParent = undefined;
    this.potentialNodeId = -1;

    this.exceptions = main.dataManager.getDescendants(this.data.nodeId);
    this.exceptions.push(this.data.nodeId);
  }

  update(delta) {
    let main = this.stateManager.main;
    let mPos = Utils.getPickedMousePos(main.scene);

    let nPos = this.nodeG.plane.position;

    nPos.x = mPos.x - this.nodePosRelativeToMouse.x;
    nPos.y = mPos.y - this.nodePosRelativeToMouse.y;

    let nodesG = this.stateManager.main.nodeManager.graphics;

    let metas = main.dataManager.dataContainer.metas;
    let p = getPotentialParent(this.nodeG, nodesG, metas, 
      this.exceptions);
    if (p != undefined && this.potentialNodeId != p.nodeId) {
      this.potentialNodeId = p.nodeId;
      console.log(p.textBlock.text);
      main.dataManager.changeParent(this.data.nodeId, p.nodeId);

      redraw(main);

      function redraw(main) {
        let dm = main.dataManager;
        let dc = dm.embedCoordinates();
        dc = dm.embedCoordinates();
        main.nodeManager.loadNodes(dc, main.scene);
        main.lines.drawLines(main.scene, dc);
        main.scene.render();
      }
    }

    function getPotentialParent(draggedG, nodesG, metas, exceptions) {
      let potentialParent;
      let distDetector = 1.75;
      let minDist = 9999;

      let cloneM = _.cloneDeep(metas);
      exceptions.forEach((nodeId) => {
        cloneM.delete(nodeId);
      });

      cloneM.forEach((meta, nodeId) => {
        let nodeG = nodesG.get(nodeId);
        let d = draggedG.plane.position;
        let n = nodeG.plane.position;

        if (isPotentialParent(d, n)) {
          
          // Using their center
          let dSqr = Utils.getDistSqr2(d, n);

          // console.log(dSqr);
          let distDSqr = distDetector * distDetector;
          if (dSqr < distDSqr) {
            if (minDist > dSqr) {
              potentialParent = nodeG;
              potentialParent.nodeId = nodeId;
              minDist = dSqr;
            }
          }
        }
      });

      // nodesG.forEach((nodeG, nodeId) => {
      //   let d = draggedG.plane.position;
      //   let n = nodeG.plane.position;

      //   if (isPotentialParent(d, n)) {
          
      //     // Using their center
      //     let dSqr = Utils.getDistSqr2(d, n);

      //     // console.log(dSqr);
      //     let distDSqr = distDetector * distDetector;
      //     if (dSqr < distDSqr) {
      //       if (minDist > dSqr) {
      //         potentialParent = nodeG;
      //         potentialParent.nodeId = nodeId;
      //         minDist = dSqr;
      //       }
      //     }
      //   }
      // });
      // console.log(minDist);
      return potentialParent;

      function isPotentialParent(d, n) {
        return (d.x > n.x);
      }
    }

    // if (changeInLocalPosition()) {
    //   redraw();
    //   moveWorldRelativeToMovedNode();
    //   // Decide what to do from here
    // }

    // function redraw() {
    //   useReingoldTilford();
    //   redrawNodes();
    // }
  }

  exit() {

  }
}