/* 
  Task: To load and save to json file
  Will be converted to visualizer later on
  How it works?
    Will have a separate json, nodes.json and nodes-main.json
    nodes.json will have id and name(text) of the data
    nodesView(nodes-<view name>) will have the view state of data
      Handles metadata of nodes
      We can have as many view as possible

  How to save state?
    Things to consider:
      Undo, redo
    Current implementation
      Merge the nodes and nodesView to feed to the reingold-tilford
      Potential solutions:
        Have a new merged file
        Do not use it for editing
        Just for presentation purposes
    
*/

class DataManager {
  constructor() {
    this.clear();
  }

  clear() {
    this.dataContainer = new DataContainer();
  }

  onLoadData(cbFunc) {
    let dataLoader = new DataLoader();
    let container = dataLoader.loadDataContainer(loadData);

    function loadData(container) {
      let rein = new ReingoldTilford();
      let a = container.nodes;
      let dCont = rein.getCoordinates(a.get(1), container);
      cbFunc(dCont);
    }
  }

  embedCoordinates() {
    let dc = this.dataContainer;
    let rein = new ReingoldTilford();
    let coords = rein.getCoordinates(dc.nodes.get(1), dc);
    return coords;
  }

  

  addNewData(text, parentId) {
    let nodes = this.dataContainer.nodes;
    let metas = this.dataContainer.metas;

    let id = this.getHighestId(nodes) + 1;
    let node = {"name": "text", "id": id};

    let meta = metas.get(id);
    if (meta == undefined) {
      meta = new Meta(id, parentId);
      metas.set(id, meta);
    }

    if (parentId != undefined) {
      let parentMeta = metas.get(parentId);
      if (parentMeta != undefined) {
        parentMeta.childrenIds.push(id);
      }
    }
    
    nodes.set(id, node);
  }

  getHighestId(nodes) {
    let highestValue = 0;
    nodes.forEach((value, index) => {
      if (highestValue < index) {
        highestValue = index;
      }
    });

    return  highestValue;
  }

  
}