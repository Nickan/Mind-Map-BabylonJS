class DataContainer {
  constructor(allData, allMetaData) {
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

}