class ReingoldTilford {

  static get BREADTH_DIST() {
    return 1;
  }

  constructor() {

  }

  getCoordinates(startingNode, dataContainer) {
    if (startingNode == undefined) {
      throw("startingNode should not be undefined");
    }

    let dataContainerY = this.assignValueY(0, startingNode, dataContainer);
    let ft = this.setInitialX(startingNode, dataContainerY);
    
    // return ft;
  }

  assignValueY(currentY, node, dataContainer) {
    node.y = currentY;
    let children = dataContainer.getChildren(node.id);

    children.forEach((child) => {
      this.assignValueY(currentY + 1, child, dataContainer);
    });

    return dataContainer;
  }

  // solveConflicts is needed for unit testing
  setInitialX(node, dataContainer, solveConflicts = true) {
    let children = dataContainer.getChildren(node.id);
    children.forEach((child) => {
      this.setInitialX(child, dataContainer);
    });

    this.setInitialXRelativeToChildren(node, dataContainer);
    if (solveConflicts) {
      this.solveConflictingX(node, dataContainer);
    }
    return dataContainer;
  }

  setInitialXRelativeToChildren(node, dataContainer) {
    this.setLeafInitialX(node, dataContainer);
    this.setNodeWithChildInitialX(node, dataContainer);
    this.setNodeWithChildrenInitialX(node, dataContainer);

    return dataContainer;
  }

  solveConflictingX(node, dataContainer) {
    if (!dataContainer.isLeftMost(node.id) && 
      (dataContainer.hasChild(node.id) ||
      dataContainer.hasChildren(node.id))  ) {
      this.fixConflictingX(node, dataContainer);
    }
  }

  fixConflictingX(node, dataContainer) {
    let contour = new Map();
    this.getLeftContour(node, dataContainer, 0, contour);

    let startingDepth = node.y;
  }


  getLeftContour(node, dataContainer, modSum, contour) {
    let x = node.x;
    let y = node.y;
    let cVal = x + modSum;
    if (contour.has(y)) {
      contour.set(y, Math.min(contour.get(y), cVal));
    } else {
      contour.set(y, cVal);
    }

    if (node.mod == undefined) {
      node.mod = 0;
    }
    modSum += node.mod;
    let children = dataContainer.getChildren(node.id);
    children.forEach((child) => {
      this.getLeftContour(child, dataContainer, modSum, contour);
    });
  }

  setLeafInitialX(node, dataContainer) {
    if (!dataContainer.isLeafNode(node.id)) {
      return; 
    }

    if (dataContainer.isLeftMost(node.id)) {
      node.x = 0.0;
    } else {
      let leftSibling = dataContainer.getLeftSibling(node.id);
      node.x = leftSibling.x + ReingoldTilford.BREADTH_DIST;
    }
  }

  setNodeWithChildInitialX(node, dataContainer) {
    if (!dataContainer.hasChild(node.id)) {
      return;
    }

    let children = dataContainer.getChildren(node.id);
    if (dataContainer.isLeftMost(node.id)) {
      node.x = children[0].x;
    } else {
      let leftSibling = dataContainer.getLeftSibling(node.id);
      node.x = leftSibling.x + ReingoldTilford.BREADTH_DIST;

      let firstChild = dataContainer.getChildren(node.id)[0];
      node.mod = node.x - firstChild.x;
    }
  }

  setNodeWithChildrenInitialX(node, dataContainer) {
    if (!dataContainer.hasChildren(node.id)) {
      return;
    }

    let children = dataContainer.getChildren(node.id);
    let midX = this.getMidX(children);
    if (dataContainer.isLeftMost(node.id)) {
      node.x = midX;
    } else {
      let leftSibling = dataContainer.getLeftSibling(node.id);
      node.x = leftSibling.x + ReingoldTilford.BREADTH_DIST;
      node.mod = node.x - midX;
    }
  }


  getMidX(children) {
    let leftMost = children[0];
    let rightMost = children[children.length - 1];
    let leftX = leftMost.x;
    let rightX = rightMost.x;
    return (leftX + rightX) / 2.0;
  }
}