#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const argv = require('yargs').argv;
const clc = require('cli-color');

function packageJsonLocations(dirname) {
  const filenames = fs.readdirSync(dirname)
      .filter(filename => filename !== 'node_modules');

  let result = [];

  for (const filename of filenames) {
    const pathname = path.resolve(dirname, filename);
    const stat = fs.statSync(pathname);

    if (stat.isFile() && filename === "package.json") {
      result.push(dirname);
    } else if (stat.isDirectory()) {
      result = result.concat(packageJsonLocations(pathname));
    }
  }

  return result;
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
