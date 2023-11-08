# A tree based history api
This means that you can have multiple paths compared with the traditional system that overwrites your history after you make a change.

Start a new session:
        import * as HISTORY from "./history";
        const historySession = new HISTORY.Session()
And define some data object:
        const exampleData = {
            name: "martini",
            age: "12"
        }
Then, create a new action:
        const action = new HISTORY.SimpleAction(exampleData, (data)=>{
            data.name = "John"
            data.age = 16
            return true
        }, false, "update message goes here (optional)", "update description goes here (optional)")
The first argument is the data that you want to be saved so it can be undoed. Only the fields that you actually modified are saved.
The second argument is the forward function and the 3rd is whether your data has multiple fields that you want to watch for changes.
Finally, commit the action to the session:
        historySession.commitAction([action])

Now, if you want to undo that change to the original exampleData, then just run `historySession.undo()` or to redo: `historySession.redo()`.