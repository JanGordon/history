import { Action, Session, SmartActionV3, SmartActionV2 } from "./history";

type dataType = {name: string, age: string}
const data: dataType = {
    name: "martini",
    age: "12"
}

const session = new Session()


// let d = new SmartAction(data, [
//     "name",
//     "age"
// ]) // put in array all the fields that will be modified
// // maybe we could use MutatoNObseevr for this
// d.forward = ()=>{
//     data.name = "jan"
//     data.age = "154"
//     return true
// }
//

const input = document.getElementById("name")! as HTMLInputElement


let a = new SmartActionV3({d:data}, (data)=>{
    data.d.name = "a woof of space"
    return true
}, true)



session.commitAction([a])

console.log(data)
console.log("loc", session.currentLocation)

document.getElementById("commit")?.addEventListener("click", ()=>{
    var inputValue = input.value
    let a = new SmartActionV3({d: data}, (data)=>{
        data.d.name = inputValue
        console.log("im in the forward function", inputValue)
        return true
    }, true)
    session.commitAction([a])
    console.log(data, "loc", session.currentLocation)

})

document.getElementById("undo")?.addEventListener("click", ()=>{
    session.undo()
    input.value = data.name
    console.log(data, "loc", session.currentLocation)


})

document.getElementById("redo")?.addEventListener("click", ()=>{
    console.log(session.redo())
    input.value = data.name

    console.log(data, "loc", session.currentLocation)


})