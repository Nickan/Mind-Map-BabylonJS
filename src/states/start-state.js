


class StartState {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.init();
  }

  init() {
    let st = this.stateManager;
    let dm = new DataManager();
    dm.addNewData("Main", undefined);
    st.main.dataManager = dm;
    st.setState(new CreateState(st));
  }


}