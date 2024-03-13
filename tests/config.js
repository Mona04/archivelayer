import * as fs from 'fs'

const a = fs.readFileSync('../config.js')
const config = {
  "AAA" : a.toString()
}
console.log("ASDF")
export default config;