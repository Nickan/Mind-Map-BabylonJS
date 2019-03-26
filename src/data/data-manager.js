/* 
  Task: To load and save to json file
  Will be converted to visualizer later on
  How it works?
    Will have a separate json, allData.json and allData-main.json
    allData.json will have id and name(text) of the data
    allDataView(allData-<view name>) will have the view state of data
      Handles metadata of allData
      We can have as many view as possible

  How to save state?
    Things to consider:
      Undo, redo
    Current implementation
      Merge the allData and allDataView to feed to the reingold-tilford
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
      let a = container.allData;
      let dCont = rein.getCoordinates(a.get(1), container);
      cbFunc(dCont);
    }
  }

  embedCoordinates() {
    let dc = this.dataContainer;
    let rein = new ReingoldTilford();
    let coords = rein.getCoordinates(dc.allData.get(1), dc);
    return coords;
  }

  

  addNewData(text, parentId) {
    let allData = this.dataContainer.allData;
    let allMetaData = this.dataContainer.allMetaData;

    let id = this.getHighestId(allData) + 1;
    let node = {"name": "text", "id": id};

    let meta = allMetaData.get(id);
    if (meta == undefined) {
      meta = new Meta(id, parentId);
      allMetaData.set(id, meta);
    }

    if (parentId != undefined) {
      let parentMeta = allMetaData.get(parentId);
      if (parentMeta != undefined) {
        parentMeta.childrenIds.push(id);
      }
    }
    
    allData.set(id, node);
  }

  getHighestId(allData) {
    let highestValue = 0;
    allData.forEach((value, index) => {
      if (highestValue < index) {
        highestValue = index;
      }
    });

    return  highestValue;
  }

  
}