import * as fs from 'fs'

const a = fs.readFileSync('archivelayer.config.js')
const config = {
  "AAA" : a.toString()
}

export default config;