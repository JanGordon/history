

type ActionResult = boolean

export type Action = {
    forward: ()=>ActionResult
    backward: ()=>ActionResult
}

export class SmartAction {
    forward: ()=>ActionResult
    backward() {
        for (let [k, v] of Object.entries(this.fieldStorage)) {
            this.data[k] = v
        }
        return true
    }
    data: any
    fieldStorage = {}
    constructor(data: any, fields: string[]) {
        this.data = data
        for (let f of fields) {
            console.log(f, data)
            this.fieldStorage[f] = data[f]
        }
    }
}

export class SmartActionV2<d> {
    forwardFunction: (data: d)=>ActionResult
    forward() {
        return this.forwardFunction(this.proxiedData)
    }
    backward() {
        for (let [k, v] of Object.entries(this.fieldStorage)) {
            this.data[k] = v
        }
        return true
    }
    data: d
    proxiedData: d
    fieldStorage = {}
    constructor(data: d) {
        this.data = data
        //create proxy
        var setFunction = (target: d, prop: string, reciever: any)=>{
            if (target[prop] != reciever) {
                this.fieldStorage[prop] = target[prop]
                target[prop] = reciever
            }
            return true
        }
        var handler: ProxyHandler<any> = {
            get(target, prop, reciever) {
                console.log(target, prop, reciever)
            },
            set: setFunction
        }
        this.proxiedData = new Proxy(data, handler)
        
    }
}

export class SmartActionV3<d extends object> {
    forwardFunction: (data: d)=>ActionResult
    forward() {
        return this.forwardFunction(this.proxiedData)
    }
    backward() {
        if (this.hasMultipleData) {
            for (var [key, val] of Object.entries(this.fieldStorage)) {
                if (typeof val == "object") {
                    for (let [k, v] of Object.entries(val as any)) {
                        this.data[key][k] = v
                    }
                }
                
            }
        } else {
            for (let [k, v] of Object.entries(this.fieldStorage)) {
                this.data[k] = v
            }
        }
        console.trace(this.data)
        console.log(this.data)
        return true
    }
    data: d
    proxiedData: d
    fieldStorage = {}
    hasMultipleData?: boolean
    constructor(data: d, forwardFunction: (data: d)=>ActionResult, hasMultipleData?: boolean) {
        this.forwardFunction = forwardFunction
        this.hasMultipleData = hasMultipleData
        this.data = data
        //create proxy
        
        if (hasMultipleData) {
            var tempObject: any = {}
            for (let [k, v] of Object.entries(data)) {
                var setFunction = (target: d, prop: string, reciever: any)=>{
                    if (target[prop] != reciever) {
                        this.fieldStorage[k] = {}
                        this.fieldStorage[k][prop] = target[prop]
                        target[prop] = reciever
                    }
                    console.log("lsiteneting to ", this.fieldStorage)
                    return true
                }
                var handler: ProxyHandler<any> = {
                    get(target, prop, reciever) {
                        return target[prop]
                    },
                    set: setFunction
                }
                tempObject[k] = new Proxy(v, handler)
            }
            console.log(tempObject)

            this.proxiedData = tempObject
        } else {
            var setFunction = (target: d, prop: string, reciever: any)=>{
                if (target[prop] != reciever) {
                    this.fieldStorage[prop] = target[prop]
                    target[prop] = reciever
                }
    
                return true
            }
            var handler: ProxyHandler<any> = {
                get(target, prop, reciever) {
                    return target[prop]
                },
                set: setFunction
            }
            this.proxiedData = new Proxy(data, handler)
        }
        
        
        
    }
}



export class SessionOld {
    actions: Action[] = []
    currentPosition = 0
    commitAction(actions: Action[]) {
        for (let i of actions) {
            i.forward()
            this.actions.push(i)
        }
        this.currentPosition = this.actions.length - 1
    }
    undo() {
        if (this.currentPosition >= 0) {
            this.actions[this.currentPosition].backward()
        }
        if (this.currentPosition > 0) {
            this.currentPosition--
        }
    }
    
}
type Branch = (Action | BranchJunction)[]
type BranchJunction = Branch[]


export class Session {
    currentBranch() {
        var getItemAt = (branch: Branch, currentLocationIndex: number)=>{
            var d = branch[this.currentLocation[currentLocationIndex]]
            if (Array.isArray(d)) {
                //its a junction
                var nextBranch = d[this.currentLocation[currentLocationIndex+1]]
                return getItemAt(nextBranch, currentLocationIndex+1)
            } else {
                // its an action
                return branch
            }
        }
        return getItemAt(this.actions, 0)
    }
    currentAction() {
        return this.currentBranch()[this.currentLocation[this.currentLocation.length-1]]
    }
    actions: Branch = []
    readonly currentLocation = [0, 0]
    // currentBranch: (Action | BranchJunction)[] = this.actions
    commitAction(actions: Action[]) {
        

        let currentBranch = this.currentBranch()
        // check if we are at end of branch because if not, we need to mkae a new branch junction
        if (currentBranch.length == this.currentLocation[this.currentLocation.length-1]) {
            this.currentLocation[this.currentLocation.length-1]+=actions.length
            for (let i of actions) {
                i.forward()
                this.actions.push(i)
            }
        } else {
            // get all actions / branches after the new branchjunction
            let newBranchJunctionLocation = currentBranch.indexOf(this.currentAction())
            let oldBranch = currentBranch.slice(newBranchJunctionLocation)
            let newBranch = []
            currentBranch[newBranchJunctionLocation] = [oldBranch, newBranch]
            this.currentLocation.push(1, 0)// take the 2nd exit on the branch,
            // the 0 shows that it is the 1st index on that branch
        }
    }
    undo() {

        var decrementLastIndex = ()=>{
            if (this.currentLocation.length > 0) {

                
                // gets the last entry in the location and checks if it can be decremented without going below 0
                if (this.currentLocation[this.currentLocation.length-1]-1 < 0) {
                    // this is the first element in the branch so we'll have to decrement the previous value
                    // therefore we need to remove it
                    var currentBranch = this.currentBranch()

                    // we can safely ignore this because it will always be action because there is never a branchJunction on the end of the currentLocation
                    //@ts-ignore
                    currentBranch[this.currentLocation[this.currentLocation.length-1]].backward()
                    this.currentLocation.pop()
                    // because before every number that defines where we are in a branch there is a 
                    // number that defines which route to take on the branch junction,
                    // we can ignore the value directly before and move on to the one before and decrement that
                    // (actually we need to remove it first)
                    this.currentLocation.pop()
                    // we then decrement the next value
                    // but only if it is above 0
                    decrementLastIndex()
                        
                } else {
                    // we finally found the branch that has at least 1 actions in it
                    this.currentLocation[this.currentLocation.length-1]--
                    // this.currentLocation
                    
                    console.log(this.currentLocation)
                    // we can safely ignore this because it will always be action because there is never a branchJunction on the end of the currentLocation
                    //@ts-ignore
                    this.currentAction().backward()
                }
            } else {
                alert("youve reached teh dstart")
            }
        }
        
        decrementLastIndex()
    }
    
}