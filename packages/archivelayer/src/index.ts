import path from 'path'
import fs from 'fs'
//import * as aaaa from '@simcontentlayer/utils'

var configPath = path.join(process.cwd(), 'content-builder.config.js')
///configPath = "content-builder.config.js";
console.log(configPath)
const data = fs.readFileSync(configPath)
console.log(data)
//await import(configPath);
//import(configPath).then((a)=>{
//    console.log(a);
//})

const aaa = "AAA";
export let AAA = aaa;