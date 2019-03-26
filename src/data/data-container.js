class DataContainer {
  constructor(allData = new Map(), allMetaData = new Map()) {
    this.allData = allData;
    this.allMetaData = allMetaData;
  }

  getChildren(nodeId) {
    let mData = this.allMetaData.get(nodeId);
    let childrenIds = mData.childrenIds;
    let children = new Array();
    childrenIds.forEach((childId) => {
      let child = this.allData.get(childId);
      children.push(child);
    });
    return children;
  }

  getSiblings(nodeId) {
    let mData = this.allMetaData.get(nodeId);
    return this.getChildren(mData.parentId);
  }

  isLeftMost(nodeId) {
    if (this.isMainNode(nodeId)) {
      return true;
    }

    let siblings = this.getSiblings(nodeId);
    if (siblings.length == 0) {
      return true;
    }
    return (siblings[0].id == nodeId);
  }

  isMainNode(nodeId) {
    let meta = this.allMetaData.get(nodeId);
    return meta.parentId == undefined;
  }

  hasChildren(nodeId) {
    return (this.allMetaData.get(nodeId).childrenIds.length > 1);
  }

  isLeafNode(nodeId) {
    return !this.hasChildren(nodeId);
  }

  hasChild(nodeId) {
    return (this.allMetaData.get(nodeId).childrenIds.length == 1);
  }

  getLeftSibling(nodeId) {
    let siblings = this.getSiblings(nodeId);

    let leftSiblingIndex = siblings.findIndex((ele) => {
      return ele.id == nodeId;
    }) - 1;
    return siblings[leftSiblingIndex];
  }

  getLeftMostSibling(nodeId) {
    let pId = this.allMetaData.get(nodeId).parentId;
    if (pId == undefined) {
      throw("Can't get parent id of node id " + nodeId);
      return undefined;
    }

    let c = this.getChildren(pId);
    if (c.length == 0) {
      throw("No children, please check for error");
    }
    return c[0];
  }

  getRightSibling(nodeId) {
    let pId = this.allMetaData.get(nodeId).parentId;
    let children = this.getChildren(pId);

    let data = this.allData.get(nodeId);
    let rightSiblingIndex = children.indexOf(data) + 1;
    if (rightSiblingIndex < children.length) {
      return children[rightSiblingIndex];
    }
    return undefined;
  }

  getParent(nodeId) {
    let pId = this.allMetaData.get(nodeId).parentId;
    return this.allData.get(pId);
  }

}