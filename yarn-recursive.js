#!/usr/bin/env node

const path = require('path');
const shell = require('shelljs');
const argv = require('yargs').argv;
const clc = require('cli-color');

function packageJsonLocations(dirname) {
  return shell.find(dirname)
    .filter(fname => !(fname.indexOf('node_modules') > -1 || fname[0] === '.') && path.basename(fname) === 'package.json')
    .map(fname => path.dirname(fname));
}

function yarn(directoryName) {
  let command = 'yarn';

  if (argv.cmd)
    command += ' ' + argv.cmd;

  if (argv.opt)
    command += ' ' + argv.opt;

  console.log(clc.blueBright('Current yarn path: ' + directoryName + '/package.json...'));

  shell.cd(directoryName);
  let result = shell.exec(command);

  return {
    directoryName: directoryName,
    exitCode: result.code
  };
}

function filterRoot(directoryName) {
  console.log('Root filtering');

  return path.normalize(directoryName) === path.normalize(process.cwd());
}

if (require.main === module) {
  let exitCode = packageJsonLocations(process.cwd())
    .filter(argv.skipRoot ? filterRoot : filtered => filtered)
    .map(yarn)
    .reduce((code, result) =>result.exitCode > code ? result.exitCode : code, 0);

  console.log(clc.green('End of yarns'));
  process.exit(exitCode);
}

module.exports = {
  yarn: yarn
};
