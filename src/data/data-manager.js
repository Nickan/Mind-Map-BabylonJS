class DataManager {
  constructor() {
    

    let allData = this.getAllData();

    this.reingold = new ReingoldTilford();
    let coords = this.reingold.getCoordinates(allData.get(0), allData);
    console.log(coords);
  }

  // Should be coming from file or database
  // Doesn't necessarily need to be a json
  // Need to have sample data to be a unit test
  getAllData() {
    let allData = new Map();

    this.addNewData("0", -1, allData);
    this.addNewData("1", 0, allData);
    this.addNewData("2", 0, allData);
    this.addNewData("3", 0, allData);

    this.addNewData("4", 1, allData);
    this.addNewData("5", 1, allData);

    this.addNewData("6", 2, allData);

    this.addNewData("7", 3, allData);
    this.addNewData("8", 3, allData);
    this.addNewData("9", 3, allData);

    return allData;
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