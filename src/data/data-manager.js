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
    let dataLoader = new DataLoader();
    let container = dataLoader.loadDataContainer(this.loadData);
  }

  loadData(container) {
    let rein = new ReingoldTilford();
    let a = container.allData;
    let coords = rein.getCoordinates(a.get(1), container);
  }

  

  // Should be coming from file or database
  // Doesn't necessarily need to be a json
  // Need to have sample data to be a unit test
  // getAllData() {
  //   let allData = new Map();

  //   this.addNewData("0", -1, allData);
  //   this.addNewData("1", 0, allData);
  //   this.addNewData("2", 0, allData);
  //   this.addNewData("3", 0, allData);

  //   this.addNewData("4", 1, allData);
  //   this.addNewData("5", 1, allData);

  //   this.addNewData("6", 2, allData);

  //   this.addNewData("7", 3, allData);
  //   this.addNewData("8", 3, allData);
  //   this.addNewData("9", 3, allData);

  //   return allData;
  // }

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