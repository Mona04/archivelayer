import path from 'path'
import fs from 'fs'
import { ExportTestVariable, requireFromString} from '@archivelayer/utils'

var InitChecker = (function() { 
  var instance : any;
  return {
    initialize: async function() {
      if(instance === true) return;
      if(typeof window === 'undefined') return;
      console.log("호출중")
    }    
  }
});

//var configPath = path.join(process.cwd(), 'archivelayer.config.js')
var configPath = path.join(process.cwd(), 'archivelayer.config.js')
//export const config = await import(/* webpackIgnore: true */`file://${configPath}`);
//export const config = await requireFromString('archivelayer.config.js');
//const aaa = config.default.AAA;
const aaa = "asf";
console.log('asf')
export let AAA = aaa;