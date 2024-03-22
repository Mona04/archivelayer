#!/usr/bin/env node

import {Command} from 'commander'
import {requireConfig, WatchFile} from '@archivelayer/utils'

const program = new Command();
const callback = (fileName) => {
  console.log(` ${fileName}`)
}
const gogo = async ()=>{
  const config = await requireConfig();
  const watcher = new WatchFile(config.SourcePath, callback);
}


program.command("build")
  .action(gogo);

program
  .version("0.0.1", "-v, --version")
  .name("archivelayer")
  .parse(process.argv)