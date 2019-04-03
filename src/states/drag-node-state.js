


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

    };
  }

  update(delta) {
    // Should handle the ff states
    // Redraw while being dragged
    //   Only for local position
    //   Or when there is a detected change
    //   So that we remove the issue of overlapping nodes
    // Show the future position
    // 
    // Difficulty: Hard
    // Expectation: 
    //   Moving requirements, trial and error

    let scene = this.stateManager.main.scene;
    let mPos = Utils.getPickedMousePos(scene);

    let nPos = this.nodeG.plane.position;

    nPos.x = mPos.x - this.nodePosRelativeToMouse.x;
    nPos.y = mPos.y - this.nodePosRelativeToMouse.y;

    // nPos.x = mPos.x - 0;
    // nPos.y = mPos.y - 0;

    // let nodesG = this.stateManager.main.nodeManager.graphics;
    // let p = getPotentialParent(this.nodeG, nodesG);
    // if (p != undefined) {
    //   console.log(p);
    // }

    function getPotentialParent(draggedG, nodesG) {
      // Node pos.x < than the draggedNode
      // Node closer than the distance detector
      // Closest node detected inside the distance detector

      let potentialParent;
      let distDetector = 1;
      let minDist = 9999;
      nodesG.forEach((nodeG) => {
        let d = draggedG.plane.position;
        let n = nodeG.plane.position;

        if (isPotentialParent(d, n)) {
          
          // Using their center
          let dSqr = Utils.getDistSqr2(d, n);
          if (dSqr < (distDetector * distDetector)) {
            if (minDist > dSqr) {
              potentialParent = nodeG;
            }
          }
        }
      });


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