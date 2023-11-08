

type ActionResult = boolean

export type Action = {
    forward: ()=>ActionResult
    backward: ()=>ActionResult
    description?: string
    name?: string
}

export class SmartActionV3<d extends object> {
    name: string
    description: string
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
        return true
    }
    data: d
    proxiedData: d
    fieldStorage = {}
    hasMultipleData?: boolean
    constructor(data: d, forwardFunction: (data: d)=>ActionResult, hasMultipleData?: boolean, name?: string, description?: string) {
        this.name = name
        this.description = description
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
                    console.log(prop, "changed")
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

            this.proxiedData = tempObject
        } else {
            var setFunction = (target: d, prop: string, reciever: any)=>{
                if (target[prop] != reciever) {
                    this.fieldStorage[prop] = target[prop]
                    target[prop] = reciever
                }
                console.log(prop, "changed")

    
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



export type Branch = (Action | BranchJunction)[]
export type BranchJunction = Branch[]


export class Session {
    onLocationChange: (()=>void)[] = []
    changedLocation() {
        for (let i of this.onLocationChange) {
            i()
        }
    }
    currentBranch() {
        console.log(this.currentLocation)

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
    actions: Branch = [{forward:()=>true, backward: ()=>true}]
    readonly currentLocation = [0]// cange this
    // currentBranch: (Action | BranchJunction)[] = this.actions
    commitAction(actions: Action[]) {
        

        let currentBranch = this.currentBranch()
        // check if we are at end of branch because if not, we need to mkae a new branch junction
        if (currentBranch.length-1 == this.currentLocation[this.currentLocation.length-1]) {
            this.currentLocation[this.currentLocation.length-1]+=actions.length
            for (let i of actions) {
                i.forward()
                currentBranch.push(i)
            }
            this.changedLocation()
        } else {
            console.log("creating a new branhc at position", )
            // get all actions / branches after the new branchjunction
            let newBranchJunctionLocation = currentBranch.indexOf(this.currentAction())
            let oldBranch = currentBranch.slice(newBranchJunctionLocation)
            currentBranch.splice(newBranchJunctionLocation)
            let newBranch: Branch = []
            for (let i of actions) {
                i.forward()
                newBranch.push(i)
            }
            currentBranch[newBranchJunctionLocation] = [oldBranch, newBranch]
            this.currentLocation.push(1, 0)// take the 2nd exit on the branch,
            // the 0 shows that it is the 1st index on that branch
            this.changedLocation()
        }
    }
    undo() {
        console.log(this.currentLocation)
        var decrementLastIndex = (onBranchLocation: boolean)=>{
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
                    // this.currentLocation[this.currentLocation.length-1]--
                    // we then decrement the next value
                    // but only if it is above 0
                    decrementLastIndex(true)
                        
                } else {

                    // we finally found the branch that has at least 1 actions in it
                    if (onBranchLocation) {
                        // a branch
                        this.currentLocation[this.currentLocation.length-1]--
                        //@ts-ignore

                    } else {
                        // we can safely ignore this because it will always be action because there is never a branchJunction on the end of the currentLocation
                        console.log(this.currentLocation, this.actions, this.currentAction())
                        //@ts-ignore
                        this.currentAction().backward()
                        this.currentLocation[this.currentLocation.length-1]--

                    }
                    
                }
            } else {
                // alert("youve reached teh dstart")
            }
        }
        
        decrementLastIndex(false)
        this.changedLocation()

    }

    redo() {
        let currentBranch = this.currentBranch()
        if (this.currentLocation[this.currentLocation.length-1] == currentBranch.length) {
            // we are at end of branch
            return false
        } else {
            // we know there are still items in branch
            console.log(currentBranch)
            // currently unsafe if it is a branch junction
            var traverseJunctions = (action: Action | BranchJunction)=>{
                if (Array.isArray(action)) {
                    // we are at a branch junction 
                    // ask which route to take
                    let route = prompt("there is a diverging junction here, pick which route to take, (0-"+(action.length-1)+"): ")
                    this.currentLocation.push(parseInt(route ? route : "0"))
                    this.currentLocation.push(0) // first action of the branch
                    
                    
                    return traverseJunctions(this.currentBranch()[0])
                } else {
                    console.log("going forward on", this.currentLocation)
                    action.forward()
                    return true
                }
            }
            this.currentLocation[this.currentLocation.length-1]++
            this.changedLocation()

            return traverseJunctions(currentBranch[this.currentLocation[this.currentLocation.length-1]])
        }
    }
    
}