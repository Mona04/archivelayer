#!/usr/bin/env node

import * as commander from "commander"

commander.program.version("0.0.1", "-v, --version")
commander.createCommand("hello")
  .description('Say hello')
  .action(console.log("ASF"));