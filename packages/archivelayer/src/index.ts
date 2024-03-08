import path from 'path'
import fs from 'fs'
import { ExportTestVariable, requireFromString} from '@archivelayer/utils'
import dynamic from 'next/dynamic.js'
//import * as AAA from "~/archivelayer.config.js"

var InitChecker = (function() { 
  var instance : any;
  return {
    initialize: async function() {
      if(instance === true) return;
      if(typeof window === 'undefined') return;
      console.log("호출중")

      //console.log(`Does it exported? ${ExportTestVariable}`)
      //var configPath = path.join(process.cwd(), 'archivelayer.config.js')
      var configPath = path.join(process.cwd(), 'archivelayer.config.js')
      const data = fs.readFileSync(configPath)
      //console.log(data.toString())
      var fileApiPath = "file://"  + configPath;
      await import(fileApiPath);
    }    
  }
});

var configPath = path.join(process.cwd(), 'archivelayer.config.js')
const data = fs.readFileSync(configPath)
//console.log(data.toString())
var fileApiPath = "file://"  + configPath;
export const config = await import(fileApiPath);

const aaa = "AAA";
export let AAA = aaa;