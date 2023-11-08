(() => {
  // history.ts
  var SmartActionV3 = class {
    constructor(data2, forwardFunction, hasMultipleData) {
      this.fieldStorage = {};
      this.forwardFunction = forwardFunction;
      this.hasMultipleData = hasMultipleData;
      this.data = data2;
      if (hasMultipleData) {
        var tempObject = {};
        for (let [k, v] of Object.entries(data2)) {
          var setFunction = (target, prop, reciever) => {
            if (target[prop] != reciever) {
              this.fieldStorage[k] = {};
              this.fieldStorage[k][prop] = target[prop];
              target[prop] = reciever;
            }
            console.log(prop, "changed");
            return true;
          };
          var handler = {
            get(target, prop, reciever) {
              return target[prop];
            },
            set: setFunction
          };
          tempObject[k] = new Proxy(v, handler);
        }
        this.proxiedData = tempObject;
      } else {
        var setFunction = (target, prop, reciever) => {
          if (target[prop] != reciever) {
            this.fieldStorage[prop] = target[prop];
            target[prop] = reciever;
          }
          console.log(prop, "changed");
          return true;
        };
        var handler = {
          get(target, prop, reciever) {
            return target[prop];
          },
          set: setFunction
        };
        this.proxiedData = new Proxy(data2, handler);
      }
    }
    forward() {
      return this.forwardFunction(this.proxiedData);
    }
    backward() {
      if (this.hasMultipleData) {
        for (var [key, val] of Object.entries(this.fieldStorage)) {
          if (typeof val == "object") {
            for (let [k, v] of Object.entries(val)) {
              this.data[key][k] = v;
            }
          }
        }
      } else {
        for (let [k, v] of Object.entries(this.fieldStorage)) {
          this.data[k] = v;
        }
      }
      return true;
    }
  };
  var Session = class {
    constructor() {
      this.actions = [{ forward: () => true, backward: () => true }];
      this.currentLocation = [0, 0];
    }
    currentBranch() {
      var getItemAt = (branch, currentLocationIndex) => {
        var d = branch[this.currentLocation[currentLocationIndex]];
        if (Array.isArray(d)) {
          var nextBranch = d[this.currentLocation[currentLocationIndex + 1]];
          return getItemAt(nextBranch, currentLocationIndex + 1);
        } else {
          return branch;
        }
      };
      return getItemAt(this.actions, 0);
    }
    currentAction() {
      return this.currentBranch()[this.currentLocation[this.currentLocation.length - 1]];
    }
    commitAction(actions) {
      let currentBranch = this.currentBranch();
      if (currentBranch.length - 1 == this.currentLocation[this.currentLocation.length - 1]) {
        this.currentLocation[this.currentLocation.length - 1] += actions.length;
        for (let i of actions) {
          i.forward();
          this.actions.push(i);
        }
      } else {
        let newBranchJunctionLocation = currentBranch.indexOf(this.currentAction());
        let oldBranch = currentBranch.slice(newBranchJunctionLocation);
        let newBranch = [];
        currentBranch[newBranchJunctionLocation] = [oldBranch, newBranch];
        this.currentLocation.push(1, 0);
      }
    }
    undo() {
      console.log(this.currentLocation);
      var decrementLastIndex = () => {
        if (this.currentLocation.length > 0) {
          if (this.currentLocation[this.currentLocation.length - 1] - 1 < 0) {
            var currentBranch = this.currentBranch();
            currentBranch[this.currentLocation[this.currentLocation.length - 1]].backward();
            this.currentLocation.pop();
            this.currentLocation.pop();
            decrementLastIndex();
          } else {
            let action = this.currentAction();
            if (Array.isArray(action)) {
              this.currentLocation[this.currentLocation.length - 1]--;
            } else {
              console.log(this.currentLocation, this.actions, this.currentAction());
              this.currentAction().backward();
              this.currentLocation[this.currentLocation.length - 1]--;
            }
          }
        } else {
        }
      };
      decrementLastIndex();
    }
    redo() {
      let currentBranch = this.currentBranch();
      if (this.currentLocation[this.currentLocation.length - 1] == currentBranch.length) {
        return false;
      } else {
        this.currentLocation[this.currentLocation.length - 1]++;
        console.log(currentBranch);
        var traverseJunctions = () => {
          let action = this.currentAction();
          if (Array.isArray(action)) {
            let route = prompt("there is a diverging junction here, pick which route to take, (0-" + (action.length - 1) + "): ");
            this.currentLocation.push(parseInt(route ? route : "0"));
            this.currentLocation.push(0);
            return traverseJunctions();
          } else {
            console.log(this.currentBranch());
            console.log("going forward", this.currentLocation, this.currentAction());
            action.forward();
            return true;
          }
        };
        return traverseJunctions();
      }
    }
  };

  // main.ts
  var data = {
    name: "martini",
    age: "12"
  };
  var session = new Session();
  var input = document.getElementById("name");
  var a = new SmartActionV3({ d: data }, (data2) => {
    data2.d.name = "a woof of space";
    return true;
  }, true);
  session.commitAction([a]);
  console.log(data);
  console.log("loc", session.currentLocation);
  document.getElementById("commit")?.addEventListener("click", () => {
    var inputValue = input.value;
    let a2 = new SmartActionV3({ d: data }, (data2) => {
      data2.d.name = inputValue;
      console.log("im in the forward function", inputValue);
      return true;
    }, true);
    session.commitAction([a2]);
    console.log(data, "loc", session.currentLocation);
  });
  document.getElementById("undo")?.addEventListener("click", () => {
    session.undo();
    input.value = data.name;
    console.log(data, "loc", session.currentLocation);
  });
  document.getElementById("redo")?.addEventListener("click", () => {
    console.log(session.redo());
    input.value = data.name;
    console.log(data, "loc", session.currentLocation);
  });
})();
