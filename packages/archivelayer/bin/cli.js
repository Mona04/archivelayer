#!/usr/bin/env node

import {Command} from 'commander'
import {Startup} from '@archivelayer/core'

const program = new Command();

program.command("build")
  .action(Startup);

program
  .version("0.0.1", "-v, --version")
  .name("archivelayer")
  .parse(process.argv)