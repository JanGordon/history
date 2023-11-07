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
            console.log("lsiteneting to ", this.fieldStorage);
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
        console.log(tempObject);
        this.proxiedData = tempObject;
      } else {
        var setFunction = (target, prop, reciever) => {
          if (target[prop] != reciever) {
            this.fieldStorage[prop] = target[prop];
            target[prop] = reciever;
          }
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
      console.trace(this.data);
      console.log(this.data);
      return true;
    }
  };
  var Session = class {
    constructor() {
      this.actions = [];
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
      if (currentBranch.length == this.currentLocation[this.currentLocation.length - 1]) {
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
      var decrementLastIndex = () => {
        if (this.currentLocation.length > 0) {
          if (this.currentLocation[this.currentLocation.length - 1] - 1 < 0) {
            var currentBranch = this.currentBranch();
            currentBranch[this.currentLocation[this.currentLocation.length - 1]].backward();
            this.currentLocation.pop();
            this.currentLocation.pop();
            decrementLastIndex();
          } else {
            this.currentLocation[this.currentLocation.length - 1]--;
            console.log(this.currentLocation);
            this.currentAction().backward();
          }
        } else {
          alert("youve reached teh dstart");
        }
      };
      decrementLastIndex();
    }
  };

  // main.ts
  var data = {
    name: "martini",
    age: "12"
  };
  var session = new Session();
  var a = new SmartActionV3({ d: data }, (data2) => {
    data2.d.name = "a woof of space";
    return true;
  }, true);
  var a2 = new SmartActionV3(data, (data2) => {
    data2.name = "a woof of space and some sparkles overhead";
    return true;
  });
  session.commitAction([a, a2]);
  console.log(data);
  document.getElementById("undo")?.addEventListener("click", () => {
    session.undo();
    console.log(data);
  });
})();
