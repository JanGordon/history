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

let a = new SmartActionV3({d:data}, (data)=>{
    data.d.name = "a woof of space"
    return true
}, true)


let a2 = new SmartActionV3(data, (data)=>{
    data.name = "a woof of space and some sparkles overhead"
    return true
})

session.commitAction([a, a2])

console.log(data)

document.getElementById("undo")?.addEventListener("click", ()=>{
    session.undo()
    console.log(data)

})