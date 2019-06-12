


class DragNodeState {
  constructor(elon, data) {
    this.elon = elon;
    this.data = data;

    elon.state = this;
    this.init(elon);
  }

  init(elon) {
    let ng = elon.nodeManager.graphics.get(this.data.nodeId);
    let nPos = ng.plane.position;
    this.unmodNodePos = _.cloneDeep(nPos);
    let mPos = Utils.getPickedMousePos(elon.scene);

    this.nodePosRelativeToMouse = {
      x: mPos.x - nPos.x,
      y: mPos.y - nPos.y
    };

    this.newPotentialParentId = elon.dataManager.getParentId(this.data.nodeId);

    this.excludedNodeIds = elon.dataManager.getDescendants(this.data.nodeId);
    this.excludedNodeIds.push(this.data.nodeId);


    this.controls = new DragNodeControls(elon.scene, this.data);
    this.controls.dragStopCb = () => {
      elon.scene.onPointerUp = undefined;
      new IdleState(elon, this.data);
      Utils.redraw(elon);
    };

    this.stopUpdate = false;
  }

  update(delta) {
    let elon = this.elon;
    let mPos = Utils.getPickedMousePos(elon.scene);

    if (!Utils.mousePosHasChanged(elon.scene)) {
      return;
    }

    let ng = elon.nodeManager.graphics.get(this.data.nodeId);
    let nPos = ng.plane.position;

    nPos.x = mPos.x - this.nodePosRelativeToMouse.x;
    nPos.y = mPos.y - this.nodePosRelativeToMouse.y;

    let nodesG = elon.nodeManager.graphics;

    let pId = getNewPotentialParent(ng, nodesG, this.excludedNodeIds);

    if (this.stopUpdate) {
      return;
    }
    if (pId != undefined) {
      let nm = elon.nodeManager;

      if (this.newPotentialParentId != pId) {
        handleChangeParent(elon, this);

        function handleChangeParent(elon, state) {
          state.newPotentialParentId = pId;
          elon.dataManager.changeParent(state.data.nodeId, state.newPotentialParentId);

          let n = nm.graphics.get(state.data.nodeId);
          Utils.redraw(elon);
          n = nm.graphics.get(state.data.nodeId);
          let curP = _.cloneDeep(n.plane.position);

          elon.cameraManager.setSamePositionOnScreen(curP, mPos, state.nodePosRelativeToMouse);
        }
        
      } else {
        handleSameParent(elon, this);

        function handleSameParent(elon, state) {
          let cIds = elon.dataManager.getChildrenIds(state.newPotentialParentId);

          let nIndex = getNearestIndex(cIds, state.data.nodeId, nm.graphics);

          if (nIndex != undefined) {
            if (state.breadthLevel != nIndex) {
              state.breadthLevel = nIndex;
              elon.dataManager.changeSiblingIndex(state.data.nodeId, 
                state.newPotentialParentId, nIndex);
              
              Utils.redraw(elon);
              let n = nm.graphics.get(state.data.nodeId);
              let curP = _.cloneDeep(n.plane.position);
              
              elon.cameraManager.setSamePositionOnScreen(curP, mPos, state.nodePosRelativeToMouse);
            }
            
          }
          
          function getNearestIndex(childrenIds, draggedNodeId, graphics) {
            let nC = getNearestChildId(childrenIds, draggedNodeId, graphics);
            if (nC != undefined)
              return childrenIds.indexOf(nC);
            return undefined;

            function getNearestChildId(childrenIds, draggedNodeId, graphics) {
              let distDetector = NodeManager.Y_UNIT * 0.5;
              distDetector = distDetector * distDetector;
              let minDist = 9999;
              let nearestChildId = undefined;

              let draggedGraphics = graphics.get(draggedNodeId);
              for (let cId of childrenIds) {
                if (cId == draggedNodeId)
                  continue;

                let nodeG = graphics.get(cId);
                let dSqr2 = Utils.getDistSqr2Node(draggedGraphics, nodeG);
                if (dSqr2 < distDetector) {
                  if (minDist > dSqr2) {
                    nearestChildId = cId;
                    minDist = dSqr2;
                  }
                }
              }
              return nearestChildId;
            }
            
          }
        }
        
      }
      
    }    


    function getNewPotentialParent(draggedNodeGraphic, nodeGraphics, excludedNodeIds) {
      return getFirstCollisionId(draggedNodeGraphic, nodeGraphics, excludedNodeIds);

      function getFirstCollisionId(draggedNodeGraphic, nodeGraphics, excludedNodeIds) {
        for (let [nodeId, nodeG] of nodeGraphics) {
          if (!excludedNodeIds.includes(nodeId)) {
            if (draggedNodeGraphic.plane.intersectsMesh(nodeG.obb)) {
              return nodeId;
            }
          }
        }

      }
    }

  }

  

  exit() {

  }
}