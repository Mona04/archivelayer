#!/usr/bin/env node

import {Command} from 'commander'
import {requireConfig, watchFile} from '@archivelayer/utils'

const program = new Command();
const gogo = async ()=>{
  const config = await requireConfig();
  watchFile(config.SourcePath);
}

program.command("build")
  .action(gogo);

program
  .version("0.0.1", "-v, --version")
  .name("archivelayer")
  .parse(process.argv)