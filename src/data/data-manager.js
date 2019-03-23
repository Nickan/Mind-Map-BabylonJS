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

  addNewData(text, parentId, allData) {
    let id = this.getHighestId(allData) + 1;
    let nData = new Data(id, text, parentId);

    if (allData.has(parentId)) {
      let parent = allData.get(parentId);
      parent.childrenId.push(nData.id);
    }
    allData.set(nData.id, nData);
  }

  getHighestId(allData) {
    let highestValue = -1;
    allData.forEach((value, index) => {
      if (highestValue < index) {
        highestValue = index;
      }
    });

    return  highestValue;
  }

  
}