const path = require('path');
const {writeFile} = require('fs');
const {exec} = require('child_process');
const {promisify} = require('util');
const rimraf = require('rimraf');

const fs = {
  writeFile: promisify(writeFile)
};

const childProcess = {
  exec: promisify(exec)
};

const workspacePackage = require('../../../package');
const srcPackage = require('../src/nodejs/node8/package');

const rimrafAsync = promisify(rimraf);

(async () => {
  console.log('Removing src/node_modules', '$ rm -rf src/node_modules');
  const nodeModulesDir = path.join(__dirname, '../src/nodejs/node8/node_modules');
  await rimrafAsync(nodeModulesDir);

  console.log('Updating src/nodejs/node8/package.json');
  let data = {
    ...srcPackage,
    dependencies: workspacePackage.dependencies
  };
  await fs.writeFile(path.join(__dirname, '../src/nodejs/node8/package.json'), JSON.stringify(data, null, 2));

  console.log('Installing node_modules', '$ yarn');
  const i = setInterval(() => {
    process.stdout.write('.');
  }, 250);
  await childProcess.exec('yarn', {cwd: path.join(__dirname, '../src/nodejs/node8')});
  process.stdout.write('\n');
  clearInterval(i);
})();


