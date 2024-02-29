import path from 'path'
import fs from 'fs'
import { ExportTestVariable, requireFromString} from '@archivelayer/utils'
//import * as AAA from "~/archivelayer.config.js"

console.log(`Does it exported? ${ExportTestVariable}`)
//var configPath = path.join(process.cwd(), 'archivelayer.config.js')
var configPath = path.join("C:/Users/user/Desktop/Study/blogs/archivelayer/tests/next-test", 'archivelayer.config.js')
///configPath = "content-builder.config.js";
console.log(configPath)
const data = fs.readFileSync(configPath)
console.log(data.toString())
console.log("@@@@@@ Import 스루요~");
await import("file://" + configPath);
//requireFromString(data.toString(), configPath);
//await import(configPath);
//import(configPath).then((a)=>{
//    console.log(a);
//})

const aaa = "AAA";
export let AAA = aaa;