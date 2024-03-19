import path from 'path'
import fs from 'fs'
import { ExportTestVariable } from '@archivelayer/utils'



var InitChecker = (function() { 
  var instance : any;
  return {
    initialize: function() {
      if(instance === true) return false;
      if(typeof window === 'undefined') return false;
      return true;
    }    
  }
})();

if(InitChecker.initialize())
{

}
console.log("asdf")

//var configPath = path.join(process.cwd(), 'archivelayer.config.js')
//var configPath = path.join(process.cwd(), 'archivelayer.config.js')
//export const config = await import(/* webpackIgnore: true */`file://${configPath}`);