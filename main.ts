import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Session, SmartActionV3, BranchJunction, Branch } from "./history";

type dataType = {name: string, age: string}
const data: dataType = {
    name: "martini",
    age: "12"
}

const session = new Session()

const input = document.getElementById("name")! as HTMLInputElement


let a = new SmartActionV3({d:data}, (data)=>{
    data.d.name = "a woof of space"
    return true
}, true, "update name")



session.commitAction([a])

console.log(data)
console.log("loc", session.currentLocation)

document.getElementById("commit")?.addEventListener("click", ()=>{
    var inputValue = input.value
    let a = new SmartActionV3({d: data}, (data)=>{
        data.d.name = inputValue
        console.log("im in the forward function", inputValue)
        return true
    }, true, "update name to" + inputValue)
    session.commitAction([a])
    console.log(data, "loc", session.currentLocation)

})

document.getElementById("undo")?.addEventListener("click", ()=>{
    session.undo()
    input.value = data.name
    console.log(data, session, "loc", session.currentLocation)


})

document.getElementById("redo")?.addEventListener("click", ()=>{
    console.log(session.redo())
    input.value = data.name

    console.log(data, "loc", session.currentLocation)


})


@customElement("history-tree")
class HistoryTreeComponent extends LitElement {
    static styles = css`
        :host {
            width: 100%;
            display: flex;
        }
        .branch {
            display: flex;
        }
        .action.current {
            color: red;
        }
        .branch-junction {
            display: flex;
            flex-direction: column;
        }
    `

    @property()
    session = session

    constructor() {
        super()
        this.session.onLocationChange.push(()=>{
            this.requestUpdate("session")
        })
    }


    branch(branch: Branch) {
        return html`<div class="branch">${branch.map((v)=>Array.isArray(v)
            ? this.branchJunction(v)
            : html `<button class="action ${(this.session.currentAction() == v) ? "current" : ""}">${v.name}</button>`    
            )}</div>`
        
    }
    branchJunction(junction: BranchJunction) {
        return html`
            <div class="branch-junction">${junction.map((v)=>this.branch(v))}</div>
        `
    }

    render() {
        return html`
            ${this.branch(this.session.actions)}
        `
    }
}
