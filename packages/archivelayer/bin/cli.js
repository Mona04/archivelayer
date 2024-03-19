#!/usr/bin/env node

import {Commander} from 'commander'
//import {requireConfig, watchFile} from '@archivelayer/utils'

const program = new Command();
const aaa =  ()=>{
  console.log("===================================")
  //const config = await requireConfig();
  //console.log(config.SourcePath)
  //if(config.SourcePath != undefined)
  //{
  //  watchFile(config.SourcePath);
  //}
}
console.log(process.argv);

program
  .version("0.0.1", "-v, --version")
  .name("archivelayer");

program.command("build")
  .action(()=>
  {
    console.log("ASDFASDF")
  });