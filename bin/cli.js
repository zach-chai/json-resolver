#! /usr/bin/env node

const jsonResolver = require("../index.js")
const commands = ['resolveRef', 'resolveAllOf']
const help = 'json-resolver <command> <path>'

const args = process.argv.slice(2)


let command = args[0]
let inputFile = args[1]

if(command == 'help') {
  console.log(help)
  process.exit(0)
}

if(commands.indexOf(command) < 0) {
  console.log('Invalid command: ' + command)
  process.exit(1)
}

if(inputFile == null) {
  console.log('Must supply path to file\n')
  process.exit(1)
}

jsonResolver[command](inputFile, function(err, result) {
  if (err) {
    console.error('\nFailed to resolve file. ' + err.message)
  } else {
    console.log(JSON.stringify(result))
  }
});
