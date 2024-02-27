import path from 'path'
import fs from 'fs'
import {requireFromString} from '@archivelayer/utils'

var configPath = path.join(process.cwd(), 'content-layer.config.js')
///configPath = "content-builder.config.js";
console.log(configPath)
const data = fs.readFileSync(configPath)
console.log(data)
requireFromString(data.toString(), configPath);
//await import(configPath);
//import(configPath).then((a)=>{
//    console.log(a);
//})

const aaa = "AAA";
export let AAA = aaa;