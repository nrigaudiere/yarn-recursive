#!/usr/bin/env node

const path = require('path');
const shell = require('shelljs');
const yargs = require('yargs');
const clc = require('cli-color');

function packageJsonLocations(dirname) {
  return shell.find(dirname)
    .filter(fname => !(fname.indexOf('node_modules') > -1 || fname[0] === '.') && path.basename(fname) === 'package.json')
    .map(fname => path.dirname(fname));
}

function yarn(directoryName) {
  let command = 'yarn';

  if (yargs.argv.cmd)
    command += ' ' + yargs.argv.cmd;

  if (yargs.argv.opt) {
    const index = process.argv.indexOf('--opt');
    command += ' ' + process.argv.slice(index + 1).join(' ');
  }
    

  console.log(clc.blueBright('Current yarn path: ' + directoryName + path.sep + 'package.json...'));
 
  shell.cd(directoryName);
  let result = shell.exec(command);

  return {
    directoryName: directoryName,
    exitCode: result.code
  };
}

function filterRoot(directoryName) {
  return path.normalize(directoryName) !== path.normalize(process.cwd());
}

if (require.main === module) {
  let exitCode = packageJsonLocations(process.cwd())
    .filter(yargs.argv.skipRoot ? filterRoot : filtered => filtered)
    .map(yarn)
    .reduce((code, result) =>result.exitCode > code ? result.exitCode : code, 0);

  console.log(clc.green('End of yarns'));
  process.exit(exitCode);
}

module.exports = {
  yarn: yarn
};
