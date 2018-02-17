#!/usr/bin/env node
const minimist = require('minimist');
const onNPMUpdate = require('./index');

var { p: packageName, command } = minimist(process.argv.slice(2), {
  string: ['package-name', 'command'],
  alias: { p: 'package-name', c: 'command' },
});

onNPMUpdate(packageName, command);
