import { AppState } from "react-native";

export default class ApplicationSession {
  static __handlerNames = [
    "active",
    "background"
  ].reduce((p, c) => {
    const action = `${c[0].toUpperCase()}${c.substring(1)}`;
    p[c] = `_switchTo${action}`;
    
    return p;
  }, {});
  
  constructor(context) {
    this._context = context;
    this._manage = this._manage.bind(this);
    
    this.__canSwitchToActiveFromInit = true;
    this.__enableLogging = false;
    this.__switchCompleted = true;
  }
  
  get canSwitchToActiveFromInit() {
    return this.__canSwitchToActiveFromInit;
  }
  
  set canSwitchToActiveFromInit(canSwitchToActiveFromInit) {
    this.__canSwitchToActiveFromInit = canSwitchToActiveFromInit;
  }
  
  get currentState() {
    return AppState.currentState;
  }
  
  get enableLogging() {
    return this.__enableLogging;
  }
  
  set enableLogging(enableLogging) {
    this.__enableLogging = enableLogging;
  }
  
  init() {
    AppState.addEventListener("change", this._manage);
    
    if (this.enableLogging) {
      console.log(`ApplicationSession.init(): ${this.currentState}.`);
    }
    
    if (this.canSwitchToActiveFromInit && this.currentState === "active") {
      this._switchToActive();
    }
  }
  
  uninit() {
    AppState.removeEventListener("change", this._manage);
  }
  
  _completeSwitch() {
    this.__switchCompleted = true;
  }
  
  _isSwitchRequested(state) {
    return this.currentState === state && ApplicationSession.__handlerNames[state];
  }
  
  _manage(nextState) {
    if (this.enableLogging) {
      console.log(`App state: ${nextState}.`);
    }
    
    const handlerName = ApplicationSession.__handlerNames[nextState];
    
    if (this[handlerName] && this.__switchCompleted) {
      this.__switchCompleted = false;
      this[handlerName]();
    }
  }
};
