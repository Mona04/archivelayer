#!/usr/bin/env node

import {Command} from 'commander'
import {Startup, Build} from '../dist/processing.js'

const program = new Command();

program.command("dev")
  .action(()=>Startup("C:/Users/user/Desktop/study/blog/archivelayer/tests/next-test/src/"));
program.command("build")
  .action(()=>Build("C:/Users/user/Desktop/study/blog/archivelayer/tests/next-test/src/"));
program
  .version("0.0.1", "-v, --version")
  .name("archivelayer")
  .parse(process.argv)