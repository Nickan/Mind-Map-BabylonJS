// Things to consider
//  Conversion from json file to map will make the key as string
//  Will try to make implementation streamlined on the fly
//  For now to make it faster, deal with string, worry about optimization later

QUnit.test("Reingold Tilford Test", function( assert ) {
  let done = assert.async();
  testReingoldTilford();
  testDataLoader();
  testDataManager();

  // Have to separate later
  function testDataLoader() {
    // let dataLoader = new DataLoader();
    
  }

  function testDataManager() {
    // let dm = new DataManager();
  }
  // Have to separate later

  function testReingoldTilford() {
    let dataLoader = new DataLoader();
    let container = dataLoader.loadDataContainer(loadData);
  
    function loadData(container) {
      let rein = new ReingoldTilford();
      testAssignValueY(rein, container);
      testSetInitialX(rein, container);
      testSetConflictX(rein, container);
      let c1 = testCenterParentOfConflictedNodes(rein, container);
      testCalcFinalX(rein, c1);

      function testAssignValueY(rein, container) {
        let a = container.allData;
        let nC = rein.assignValueY(0, a.get(1), container);
        let nA = nC.allData;

        assert.ok(nA.get(1).y == 0, "Passed!");

        assert.ok(nA.get(2).y == 1, "Passed!");
        assert.ok(nA.get(3).y == 1, "Passed!");
        assert.ok(nA.get(4).y == 1, "Passed!");

        assert.ok(nA.get(5).y == 2, "Passed!");
        assert.ok(nA.get(6).y == 2, "Passed!");
        assert.ok(nA.get(7).y == 2, "Passed!");

        assert.ok(nA.get(8).y == 2, "Passed!");
        assert.ok(nA.get(9).y == 2, "Passed!");
        assert.ok(nA.get(10).y == 2, "Passed!");
      }

      function testSetInitialX(rein, container) {
        let newC = _.cloneDeep(container);
        let sNode = newC.allData.get(1);
        let options = {solveConflicts: false};
        let nc = rein.setInitialX(sNode, newC, options);

        let nA = nc.allData;
        assert.ok(nA.get(1).x == 2, "Passed!");

        assert.ok(nA.get(2).x == 1, "Passed!");
        assert.ok(nA.get(3).x == 2, "Passed!");
        assert.ok(nA.get(3).mod == 2, "Passed!");

        assert.ok(nA.get(4).x == 3, "Passed!");
        assert.ok(nA.get(4).mod == 2.5, "Passed!");

        assert.ok(nA.get(5).x == 0, "Passed!");
        assert.ok(nA.get(6).x == 1, "Passed!");
        assert.ok(nA.get(7).x == 2, "Passed!");

        assert.ok(nA.get(8).x == 0, "Passed!");

        assert.ok(nA.get(9).x == 0, "Passed!");
        assert.ok(nA.get(10).x == 1, "Passed!");
      }

      function testSetConflictX(rein, container) {
        let newC = _.cloneDeep(container);
        let sNode = newC.allData.get(1);
        let options = {solveConflicts: true};
        let nc = rein.setInitialX(sNode, newC, options);

        let nA = nc.allData;
        assert.ok(nA.get(1).x == 2, "Passed!");

        assert.ok(nA.get(2).x == 1, "Passed!");
        assert.ok(nA.get(2).mod == 0, "Passed!");
        
        assert.ok(nA.get(3).x == 3, "Passed!");
        assert.ok(nA.get(3).mod == 3, "Passed!");

        assert.ok(nA.get(4).x == 4.5, "Passed!");
        assert.ok(nA.get(4).mod == 4, "Passed!");

        assert.ok(nA.get(5).x == 0, "Passed!");
        assert.ok(nA.get(6).x == 1, "Passed!");
        assert.ok(nA.get(7).x == 2, "Passed!");

        assert.ok(nA.get(8).x == 0, "Passed!");

        assert.ok(nA.get(9).x == 0, "Passed!");
        assert.ok(nA.get(10).x == 1, "Passed!");
      }

      function testCenterParentOfConflictedNodes(rein, container) {
        let newC = _.cloneDeep(container);
        let sNode = newC.allData.get(1);
        let options = {solveConflicts: true,
          recenterParentOfSolvedConflictNodes: true};
        let nc = rein.setInitialX(sNode, newC, options);

        let nA = nc.allData;
        assert.ok(nA.get(1).x == 2.75, "Passed!");

        assert.ok(nA.get(2).x == 1, "Passed!");
        assert.ok(nA.get(2).mod == 0, "Passed!");
        
        assert.ok(nA.get(3).x == 3, "Passed!");
        assert.ok(nA.get(3).mod == 3, "Passed!");

        assert.ok(nA.get(4).x == 4.5, "Passed!");
        assert.ok(nA.get(4).mod == 4, "Passed!");

        assert.ok(nA.get(5).x == 0, "Passed!");
        assert.ok(nA.get(6).x == 1, "Passed!");
        assert.ok(nA.get(7).x == 2, "Passed!");

        assert.ok(nA.get(8).x == 0, "Passed!");

        assert.ok(nA.get(9).x == 0, "Passed!");
        assert.ok(nA.get(10).x == 1, "Passed!");

        return nc;
      }

      function testCalcFinalX(rein, container) {
        let sNode = container.allData.get(1);
        let nc = rein.calcFinalX(sNode, container, 0);

        let nA = nc.allData;
        assert.ok(nA.get(1).x == 2.75, "Passed!");

        assert.ok(nA.get(2).x == 1, "Passed!");
        assert.ok(nA.get(3).x == 3, "Passed!");
        assert.ok(nA.get(4).x == 4.5, "Passed!");

        assert.ok(nA.get(5).x == 0, "Passed!");
        assert.ok(nA.get(6).x == 1, "Passed!");
        assert.ok(nA.get(7).x == 2, "Passed!");

        assert.ok(nA.get(8).x == 3, "Passed!");

        assert.ok(nA.get(9).x == 4, "Passed!");
        assert.ok(nA.get(10).x == 5, "Passed!");
      }


      
      done();
    }
  }

  // Create more tests here

  function testGetCoordinates() {

  }
});